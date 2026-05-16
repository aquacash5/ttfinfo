import { readFile as readFileAsync } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { nameTable } from "./tableName";
import { postTable } from "./tablePost";
import { os2Table } from "./tableOS2";

/**
 *
 * @param {Buffer} data
 * @returns
 */
function ttfInfo(data) {
  try {
    const names = nameTable(data);

    const info = {
      tables: {
        name: names,
        platform: {
          unicode: names.unicode,
          macintosh: names.macintosh,
          microsoft: names.microsoft,
        },
        post: postTable(data),
        "OS/2": os2Table(data),
      },
    };

    info.tables.platform.macintosh;

    return info;
  } catch (e) {
    // console.error(String(e));
    throw "Error reading ttf: " + String(e);
  }
}

/**
 *
 * @param {Buffer | string} pathOrData
 * @returns
 */
export async function get(pathOrData) {
  if (pathOrData instanceof Buffer) {
    return ttfInfo(pathOrData);
  } else {
    const data = await readFileAsync(pathOrData);
    return ttfInfo(data);
  }
}

/**
 *
 * @param {Buffer | string} pathOrData
 * @returns
 */
export function getSync(pathOrData) {
  var data;
  if (pathOrData instanceof Buffer) {
    return ttfInfo(pathOrData);
  } else {
    data = readFileSync(pathOrData);
    return ttfInfo(data);
  }
}
