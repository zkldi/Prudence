const { it } = require("mocha");
const expect = require("unexpected");

function TryNonInts(fn) {
    it(`Should return false for string`, () => {
        expect(fn("2"), "to be false");
    });

    it(`Should return false for decimal`, () => {
        expect(fn(0.5), "to be false");
    });

    it(`Should return false for boolean`, () => {
        expect(fn(false), "to be false");
    });

    it(`Should return false for object`, () => {
        expect(fn({}), "to be false");
    });

    it(`Should return false for array`, () => {
        expect(fn([]), "to be false");
    });
}

function TryNonFloats(fn) {
    it(`Should return false for string`, () => {
        expect(fn("2"), "to be false");
    });

    it(`Should return false for boolean`, () => {
        expect(fn(false), "to be false");
    });

    it(`Should return false for object`, () => {
        expect(fn({}), "to be false");
    });

    it(`Should return false for array`, () => {
        expect(fn([]), "to be false");
    });
}

module.exports = {
    TryNonFloats,
    TryNonInts,
};
