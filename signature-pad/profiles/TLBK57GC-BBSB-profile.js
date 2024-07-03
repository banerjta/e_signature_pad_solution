import { BaseProfile } from "./base-profile.js";
// an example of new profile that made just for Topaz Signature Pad TLBK57GC-BBSB
// x and y for this device don't start from 0
// overriding the decode function and the canvas height and width will do the trick
export class TopazSignaturePadTLBK57GCBBSBProfile extends BaseProfile {
  // on this signature pad x values are always between 400 and 2255, left most is 500 and right most is 2280
  static leftCoordinate = 400;
  static rightCoordinate = 2255;

  // same apply for y, always between 480 and 1845
  static topCoordinate = 480;
  static bottomCoordinate = 1845;

  // set the filter to only accept this device
  static filter = (vid, pid) => {
    return false;
    // return vid == 0x0403 && pid == 0x6001;
  };

  static penDownByte = 0xc1;
  static penUpByte = 0xc0;

  static baudRate = 115200;

  // width is the diffrence between right and left
  static canvasWidth = this.rightCoordinate - this.leftCoordinate;

  // height is the difference between bottom and top
  static canvasHeight = this.bottomCoordinate - this.topCoordinate;

  static decodeFunction = (bytes) => {
    if (bytes[0] == this.penUpByte) return { x: null, y: null, penOut: true };
    if (bytes[0] != this.penDownByte) return { x: null, y: null, invalid: true };

    let bytesObj = super.decodeFunction(bytes);
    if (bytesObj.x != null) bytesObj.x = bytesObj.x - this.leftCoordinate;
    if (bytesObj.y != null) bytesObj.y = bytesObj.y - this.topCoordinate;
    return bytesObj;
  };
}
