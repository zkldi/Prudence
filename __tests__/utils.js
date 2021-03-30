const { it } = require("mocha");
const expect = require("unexpected");

function TryNonInts(fn) {
    it(`Should return error for string`, () => {
        expect(fn("2"), "to be a string");
    });

    it(`Should return error for decimal`, () => {
        expect(fn(0.5), "to be a string");
    });

    it(`Should return error for boolean`, () => {
        expect(fn(false), "to be a string");
    });

    it(`Should return error for object`, () => {
        expect(fn({}), "to be a string");
    });

    it(`Should return error for array`, () => {
        expect(fn([]), "to be a string");
    });
}

function TryNonStrings(fn) {
    it(`Should return error for decimal`, () => {
        expect(fn(0.5), "to be a string");
    });

    it(`Should return error for int`, () => {
        expect(fn(1), "to be a string");
    });

    it(`Should return error for boolean`, () => {
        expect(fn(false), "to be a string");
    });

    it(`Should return error for object`, () => {
        expect(fn({}), "to be a string");
    });

    it(`Should return error for array`, () => {
        expect(fn([]), "to be a string");
    });
}

function TryNonFloats(fn) {
    it(`Should return error for string`, () => {
        expect(fn("2"), "to be a string");
    });

    it(`Should return error for boolean`, () => {
        expect(fn(false), "to be a string");
    });

    it(`Should return error for object`, () => {
        expect(fn({}), "to be a string");
    });

    it(`Should return error for array`, () => {
        expect(fn([]), "to be a string");
    });
}

module.exports = {
    TryNonFloats,
    TryNonInts,
    TryNonStrings,
};
