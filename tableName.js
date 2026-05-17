import { offset } from "./table.js";

/** @type {Record<number, "unicode" | "macintosh" | "microsoft" | undefined>} */
const Platforms = {
  0: "unicode",
  1: "macintosh",
  3: "microsoft",
};

/** @typedef {"copyright" | "family" | "subFamily" | "subFamilyId" | "fullName" | "version" | "postscript" | "trademark" | "manufacturer" | "designer" | "description" | "venderUrl" | "designerUrl" | "license" | "licenseUrl" | "reserved" | "preferredFamily" | "preferredSubFamily" | "compatible" | "sample" | "postscriptCID" | "wwsFamily" | "wwsSubFamily" | "lightPalette" | "darkPalette" | "postscriptVariations"} Name */

/** @type {Record<number, Name | undefined>} */
const Names = {
  0: "copyright",
  1: "family",
  2: "subFamily",
  3: "subFamilyId",
  4: "fullName",
  5: "version",
  6: "postscript",
  7: "trademark",
  8: "manufacturer",
  9: "designer",
  10: "description",
  11: "venderUrl",
  12: "designerUrl",
  13: "license",
  14: "licenseUrl",
  15: "reserved",
  16: "preferredFamily",
  17: "preferredSubFamily",
  18: "compatible",
  19: "sample",
  20: "postscriptCID",
  21: "wwsFamily",
  22: "wwsSubFamily",
  23: "lightPalette",
  24: "darkPalette",
  25: "postscriptVariations",
};

/**
 * @param {Buffer} data
 * @returns {{
 *  base: Partial<Record<Name | number, string>>,
 *  unicode: Partial<Record<Name, string>>,
 *  macintosh: Partial<Record<Name, string>>,
 *  microsoft: Partial<Record<Name, string>>
 * }}
 */
export function nameTable(data) {
  const ntOffset = offset(data, "name");
  if (!ntOffset) throw new Error("Font does not have 'name' field");

  const offsetStorage = data.readUInt16BE(ntOffset + 4);
  const numberNameRecords = data.readUInt16BE(ntOffset + 2);

  const storage = offsetStorage + ntOffset;

  /**
   * @type {{
   *  base: Partial<Record<Name | number, string>>,
   *  unicode: Partial<Record<Name, string>>,
   *  macintosh: Partial<Record<Name, string>>,
   *  microsoft: Partial<Record<Name, string>>
   * }}
   */
  let info = {
    base: {},
    unicode: {},
    macintosh: {},
    microsoft: {},
  };

  for (let j = 0; j < numberNameRecords; j++) {
    const o = ntOffset + 6 + j * 12;
    const platformId = data.readUInt16BE(o);
    const nameId = data.readUInt16BE(o + 6);
    const stringLength = data.readUInt16BE(o + 8);
    const stringOffset = data.readUInt16BE(o + 10);

    const platformName = Platforms[platformId];
    const recordName = Names[nameId];

    if (!platformName || !recordName) continue;

    let value = "";
    for (let k = 0; k < stringLength; k++) {
      const charCode = data[storage + stringOffset + k];
      if (charCode === 0) continue;
      value += String.fromCharCode(charCode);
    }

    info[platformName][recordName] = value;

    if (!info.base[nameId]) {
      info.base[nameId] = info[platformName][recordName];
      info.base[recordName] = info[platformName][recordName];
    }
  }
  return info;
}
