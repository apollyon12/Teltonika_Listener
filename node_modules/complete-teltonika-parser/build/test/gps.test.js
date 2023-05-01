"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GPSelement_1 = require("../Scripts/AVL Data Parser/GPSelement");
test("Test online value", () => {
    let parsed = (0, GPSelement_1.getGPSdata)(0x209cca80);
    expect(parsed).toBeCloseTo(54.7146368);
});
