const table = require('./table');

const Platforms = {
  0: 'unicode',
  1: 'macintosh',
  3: 'microsoft',
};

const Names = {
  0:  'copyright',
  1:  'family',
  2:  'subFamily',
  3:  'subFamilyId',
  4:  'fullName',
  5:  'version',
  6:  'postscript',
  7:  'trademark',
  8:  'manufacturer',
  9:  'designer',
  10: 'description',
  11: 'venderUrl',
  12: 'designerUrl',
  13: 'license',
  14: 'licenseUrl',
  15: 'reserved',
  16: 'preferredFamily',
  17: 'preferredSubFamily',
  18: 'compatible',
  19: 'sample',
  20: 'postscriptCID',
  21: 'wwsFamily',
  22: 'wwsSubFamily',
  23: 'lightPalette',
  24: 'darkPalette',
  25: 'postscriptVariations',
};

module.exports = function(data) {
  const ntOffset          = table.offset(data, 'name'),
        offsetStorage     = data.readUInt16BE(ntOffset+4),
        numberNameRecords = data.readUInt16BE(ntOffset+2);

  const storage = offsetStorage + ntOffset;

  let info = {
    base: [],
    unicode: {},
    macintosh: {},
    microsoft: {}
  };

  for (let j = 0; j < numberNameRecords; j++) {
    const o            = ntOffset + 6 + j * 12,
          platformId   = data.readUInt16BE(o),
          nameId       = data.readUInt16BE(o + 6),
          stringLength = data.readUInt16BE(o + 8),
          stringOffset = data.readUInt16BE(o + 10);

    const platformName = Platforms[platformId];
    const recordName = Names[nameId];

    info[platformName][recordName] = '';

    for (let k = 0; k < stringLength; k++) {
      const charCode = data[storage + stringOffset + k];
      if (charCode === 0) continue;
      info[platformName][recordName] += String.fromCharCode(charCode);
    }
    if (!info[nameId]) {
      info.base[nameId] = info[platformName][recordName];
    }
  }
  return info;
};
