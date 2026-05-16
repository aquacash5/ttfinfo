import { offset } from "./table";

const VERSION_OFFSET = 0,
  WEIGHT_CLASS_OFFSET = 4;

/**
 *
 * @param {Buffer} data
 * @returns
 */
export function os2Table(data) {
  var o = offset(data, "OS/2");
  if (!o) throw new Error("Font does not have 'OS/2' field");

  return {
    version: data.readUInt16BE(o + VERSION_OFFSET),
    weightClass: data.readUInt16BE(o + WEIGHT_CLASS_OFFSET),
  };
}
