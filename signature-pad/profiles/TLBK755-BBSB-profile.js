import { BaseProfile } from "./base-profile.js";
// an example of new profile that made just for Topaz Signature Pad TLBK755-BBSB
// x and y for this device don't start from 0
// overriding the decode function and the canvas height and width will do the trick
export class TopazSignaturePadTLBK755BBSBProfile extends BaseProfile {
  // on this signature pad x values are always between 700 and 2470
  static leftCoordinate = 700;
  static rightCoordinate = 2470;

  // same apply for y, always between 700 and 1665
  static topCoordinate = 700;
  static bottomCoordinate = 1665;

  // set the filter to only accept this device
  static filter = (vid, pid) => {
    // return vid == 0x0403 && pid == 0x6001;
    return false;
  };

  static penDownByte = 0xe5;
  static penUpByte = 0xe4;
  
  static baudRate = 38400;
  // width is the diffrence between right and left
  static canvasWidth = this.rightCoordinate - this.leftCoordinate;

  // height is the difference between bottom and top
  static canvasHeight = this.bottomCoordinate - this.topCoordinate;

  static decodeFunction = (bytes) => {
    if (bytes[0] != this.penDownByte && bytes[0] != this.penUpByte)
      return { x: null, y: null, invalid: true, ignore: true };
    if (bytes[0] == this.penUpByte) return { x: null, y: null, penOut: true };
    if (bytes[0] != this.penDownByte) return { x: null, y: null, invalid: true };
    let bytesObj = super.decodeFunction(bytes);
    if (bytesObj.x != null) bytesObj.x = bytesObj.x - this.leftCoordinate;
    if (bytesObj.y != null) bytesObj.y = bytesObj.y - this.topCoordinate;
    return bytesObj;
  };
}
