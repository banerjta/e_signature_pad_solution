import { connectionInterfaces } from "../../constants/connection-interfaces.js";
import { BaseProfile } from "./base-profile.js";
// an example of new profile that made just for Topaz Signature Pad TLBK462-HSB
// x and y for this device don't start from 0
// overriding the decode function and the canvas height and width will do the trick
export class TopazSignaturePadTLBK462HSBProfile extends BaseProfile {
  // on this signature pad x values are always between 500 and 2305
  static leftCoordinate = 500;
  static rightCoordinate = 2305;

  // same apply for y, always between 450 and 1000
  static topCoordinate = 450;
  static bottomCoordinate = 1000;

  // set the filter to only accept this device
  static filter = (vid, pid) => {
    // return vid == 0x06a8 && pid == 0x0043;
    return false;
  };

  static vid = 0x06a8;
  static pid = 0x0043;

  static penDownByte = 0xe5;
  static penUpByte = 0xe4;

  static connectionInterface = connectionInterfaces.HID;

  static chunkSize = 6;

  // width is the diffrence between right and left
  static canvasWidth = this.rightCoordinate - this.leftCoordinate;

  // height is the difference between bottom and top
  static canvasHeight = this.bottomCoordinate - this.topCoordinate;

  static decodeFunction = (bytes) => {
    //bytes = bytes.slice(1);
    if (bytes[0] != this.penDownByte && bytes[0] != this.penUpByte)
      return { x: null, y: null, invalid: true, ignore: true };
    if (bytes[0] == this.penUpByte) return { x: null, y: null, penOut: true };
    if (bytes[0] != this.penDownByte)
      return { x: null, y: null, invalid: true };
    let bytesObj = super.decodeFunction(bytes);
    if (bytesObj.x != null) bytesObj.x = bytesObj.x - this.leftCoordinate;
    if (bytesObj.y != null) bytesObj.y = bytesObj.y - this.topCoordinate;
    return bytesObj;
  };
}
