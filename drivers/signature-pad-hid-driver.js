import { BaseDriver } from "./base-driver.js";

export class SignaturePadHIDDriver extends BaseDriver {
  constructor() {
    super();
    this.callbackFunction = null;
    this.parity = null;
    this.baudRate = null;
    this.penDownByte = null;
    this.penUpByte = null;

    // number of bytes that represent each point
    this.chunkSize = null;
    this.decodeFunction = null;
    this.port = null;
    this.bytesArray = [];

    // Boolean to stop read function from reading more data
    this.keepReading = false;

    // store last point drawn information
    this.lastX = null;
    this.lastY = null;

    this.readInterval = null;
  }

  /**
   * request a device from the user, return it's pid and vid
   * @returns {{vid: Number, pid: Number}}
   */
  connect = async () => {
    // request the user to select a device (it will give permission to interact with the device)
    let dev = await navigator.hid.requestDevice({ filters: [] });
    this.port = dev[0];
    let vid = this.port.vendorId;
    let pid = this.port.productId;
    return { vid: vid, pid: pid };
  };

  /**
   * open the port and start reading from it
   * @param {Number} baudRate
   * @param {String} parity
   * @param {Number} chunkSize
   * @param {Function} decodeFunction
   * @param {Function} callbackFunction
   */
  open = async (options = {}) => {
    let _decodeFunction = (bytes) => {
      // bytes length is 5, first byte is 0xc1 when the pen in drawing on the pad, anything other than it will be invalid
      if (bytes[0] != 0xc1) return { x: null, y: null, invalid: true };

      // 2ed and 3ed bytes are for x and 4th and 5th bytes are for y
      let x = 0;
      x += bytes[1];
      x += 128 * bytes[2]; //left most bit of 2ed byte is a sign byte (always 0), so 3ed byte weight is 2^7
      let y = 0;
      y += bytes[3];
      y += 128 * bytes[4]; //left most bit of 4ed byte is a sign byte (always 0), so 5th byte weight is 2^7
      return { x: x, y: y };
    };

    let defaultOptions = {
      baudRate: 19200,
      parity: "odd",
      chunkSize: 5,
      decodeFunction: _decodeFunction,
      callbackFunction: () => {},
    };

    options = { ...defaultOptions, ...options };
    this.baudRate = options.baudRate;
    this.parity = options.parity;
    this.chunkSize = options.chunkSize;
    this.decodeFunction = options.decodeFunction;
    this.penDownByte = options.penDownByte;
    this.penUpByte = options.penUpByte;

    // open a connection with that device
    await this.port.open();
    this.process();
    this.keepReading = true;

    this.port.addEventListener("inputreport", (event) => {
      if (this.keepReading) {
        let data = new Uint8Array(event.data.buffer);
        console.log(data.toString());
        this.bytesArray.push(...data);
      }
    });

    // reset bytes array after 0.05s, it clear any old bytes were stuck in the buffer
    setTimeout(() => {
      this.bytesArray = [];
      this.callbackFunction = options.callbackFunction;
    }, 50);
  };

  /**
   * function is called when new data come from device
   * it decode and draw the data on canvas
   */
  process = () => {
    // data is recieved as bytes representing points on the pad
    let drawLine = true;
    this.readInterval = setInterval(() => {
      if (this.bytesArray.length < this.chunkSize) return;
      let decodedObj = null;
      let startIndex = this.bytesArray.findIndex(
        (value) => value == this.penDownByte || value == this.penUpByte
      );
      this.bytesArray.splice(0, startIndex);
      let nextIndex = this.bytesArray
        .slice(1)
        .findIndex(
          (value) => value == this.penDownByte || value == this.penUpByte
        );
      decodedObj = this.decodeFunction(this.bytesArray.slice(0, nextIndex));
      if ("ignore" in decodedObj && decodedObj.ignore === true) {
        this.bytesArray.splice(
          0,
          this.bytesArray.findIndex(
            (value) => value == this.penDownByte || value == this.penUpByte
          )
        );
        return;
      }
      if ("invalid" in decodedObj && decodedObj.invalid === true) {
        this.lastX = null;
        this.lastY = null;
        this.bytesArray.splice(
          0,
          this.bytesArray.findIndex(
            (value) => value == this.penDownByte || value == this.penUpByte
          )
        );
        return;
      }
      drawLine = true;
      if ("penOut" in decodedObj) {
        this.lastX = null;
        this.lastY = null;
        this.bytesArray.splice(0, 1);
        this.bytesArray.splice(
          0,
          this.bytesArray.findIndex(
            (value) => value == this.penDownByte || value == this.penUpByte
          )
        );
        drawLine = false;
        return;
      }
      let x = decodedObj.x;
      let y = decodedObj.y;
      // remove the decoded bytes from the array
      let nextPointIndex = this.bytesArray.findIndex(
        (value) => value == this.penDownByte || value == this.penUpByte
      );
      if (nextPointIndex === -1) {
        this.bytesArray.splice(0, this.bytesArray.length - 1);
        return;
      }
      this.bytesArray.splice(0, 1);
      this.bytesArray.splice(
        0,
        this.bytesArray.findIndex(
          (value) => value == this.penDownByte || value == this.penUpByte
        )
      );
      if (
        this.bytesArray[0] != this.penDownByte &&
        this.bytesArray[0] != this.penUpByte
      ) {
        this.bytesArray.splice(
          0,
          this.bytesArray.findIndex(
            (value) => value == this.penDownByte || value == this.penUpByte
          )
        );
        return;
      }
      if (drawLine === true && this.lastX !== null && this.lastY !== null) {
        this.callbackFunction(x, y, this.lastX, this.lastY);
      } else this.callbackFunction(x, y, x, y);
      this.lastX = x;
      this.lastY = y;

      this.locked = false;
    }, 5);
  };

  /**
   * disconnect from the device
   */
  disconnect = async () => {
    if (this.port != null) {
      this.keepReading = false;
      if (this.readInterval) {
        clearInterval(this.readInterval);
        this.readInterval = null;
      }
      await this.port.close();
    }
  };
}
