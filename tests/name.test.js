import { resolve } from "node:path";
import ttfInfo from "../index.js";
import { expect, test, beforeAll, describe } from "vitest";

/** @type {string} */
let fontFolder;

beforeAll(() => {
  fontFolder = resolve(import.meta.dirname, "./fonts");
});

describe("colr_1", () => {
  /** @type {string} */
  let testFont;

  beforeAll(() => {
    testFont = resolve(fontFolder, "colr_1.ttf");
  });

  test("colr name is COLRv1 Static Test Glyphs Regular", async () => {
    const info = await ttfInfo.get(testFont);

    expect(info.tables.name.microsoft.fullName).toBe(
      "COLRv1 Static Test Glyphs Regular",
    );
  });
});

describe("colr_1_variable", () => {
  /** @type {string} */
  let testFont;

  beforeAll(() => {
    testFont = resolve(fontFolder, "colr_1_variable.ttf");
  });

  test("colr name is COLRv1 Variable Test Glyphs Regular", async () => {
    const info = await ttfInfo.get(testFont);

    expect(info.tables.name.microsoft.fullName).toBe(
      "COLRv1 Variable Test Glyphs Regular",
    );
  });
});
