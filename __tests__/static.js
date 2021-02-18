const { describe, it } = require("mocha");
const expect = require("unexpected");
const Prudence = require("../js/main").default;
const { TryNonInts, TryNonFloats } = require("./utils");

describe("Static Prudence Methods", () => {
    describe("#isPositiveInteger", () => {
        it("Should return true for positive integers", () => {
            expect(Prudence.isPositiveInteger(5), "to be true");
        });

        it("Should return true for 0", () => {
            expect(Prudence.isPositiveInteger(0), "to be true");
        });

        it("Should return false for ints larger than safe values", () => {
            expect(Prudence.isPositiveInteger(Number.MAX_SAFE_INTEGER + 1), "to be false");
        });

        it("Should return false for ints less than 0", () => {
            expect(Prudence.isPositiveInteger(-1), "to be false");
        });

        TryNonInts(Prudence.isPositiveInteger);
    });

    describe("#isPositiveNonZeroInteger", () => {
        it("Should return true for positive integers", () => {
            expect(Prudence.isPositiveNonZeroInteger(5), "to be true");
        });

        it("Should return false for 0", () => {
            expect(Prudence.isPositiveNonZeroInteger(0), "to be false");
        });

        it("Should return false for ints larger than safe values", () => {
            expect(Prudence.isPositiveNonZeroInteger(Number.MAX_SAFE_INTEGER + 1), "to be false");
        });

        it("Should return false for ints less than 0", () => {
            expect(Prudence.isPositiveNonZeroInteger(-1), "to be false");
        });

        TryNonInts(Prudence.isPositiveNonZeroInteger);
    });

    describe("#isBoundedInteger", () => {
        it("Should return a function", () => {
            expect(Prudence.isBoundedInteger(1, 2), "to be a function");
        });

        let boundFn = Prudence.isBoundedInteger(0, 10);

        it("Should allow 4 between 0 and 10.", () => {
            expect(boundFn(4), "to be true");
        });

        it("Should allow 0 between 0 and 10.", () => {
            expect(boundFn(0), "to be true");
        });

        it("Should allow 10 between 0 and 10.", () => {
            expect(boundFn(10), "to be true");
        });

        it("Should disallow 100 between 0 and 10.", () => {
            expect(boundFn(100), "to be false");
        });

        it("Should disallow Infinity between 0 and 10.", () => {
            expect(boundFn(Infinity), "to be false");
        });

        it("Should allow -0 between 0 and 10.", () => {
            expect(boundFn(-0), "to be true");
        });

        it("Should disallow -100 between 0 and 10.", () => {
            expect(boundFn(-100), "to be false");
        });

        it("Should disallow -Infinity between 0 and 10.", () => {
            expect(boundFn(-Infinity), "to be false");
        });

        it("Should disallow 5.5 between 0 and 10.", () => {
            expect(boundFn(5.5), "to be false");
        });

        TryNonInts(boundFn);
    });

    describe("#isPositive", () => {
        it("Should allow positive floats", () => {
            expect(Prudence.isPositive(5.5), "to be true");
        });

        it("Should allow positive integers", () => {
            expect(Prudence.isPositive(5), "to be true");
        });

        it("Should disallow Infinity", () => {
            expect(Prudence.isPositive(Infinity), "to be false");
        });

        it("Should allow 0", () => {
            expect(Prudence.isPositive(0), "to be true");
        });

        it("Should disallow negative integers", () => {
            expect(Prudence.isPositive(-1), "to be false");
        });

        it("Should disallow negative floats", () => {
            expect(Prudence.isPositive(-1.5), "to be false");
        });

        TryNonFloats(Prudence.isPositive);
    });

    describe("#isPositiveNonZero", () => {
        it("Should allow positive floats", () => {
            expect(Prudence.isPositiveNonZero(5.5), "to be true");
        });

        it("Should allow positive integers", () => {
            expect(Prudence.isPositiveNonZero(5), "to be true");
        });

        it("Should disallow Infinity", () => {
            expect(Prudence.isPositiveNonZero(Infinity), "to be false");
        });

        it("Should disallow 0", () => {
            expect(Prudence.isPositiveNonZero(0), "to be false");
        });

        it("Should disallow negative integers", () => {
            expect(Prudence.isPositive(-1), "to be false");
        });

        it("Should disallow negative floats", () => {
            expect(Prudence.isPositive(-1.5), "to be false");
        });

        TryNonFloats(Prudence.isPositiveNonZero);
    });

    describe("#isIn", () => {
        it("Should return a function", () => {
            expect(Prudence.isIn("plum", "apple", "peach"), "to be a function");
        });

        let inFn = Prudence.isIn("plum", "apple", "peach");

        it("Should accept input inside the array", () => {
            expect(inFn("plum"), "to be true");
        });

        it("Should disallow input not inside the array", () => {
            expect(inFn("banana"), "to be false");
        });

        let inFnArr = Prudence.isIn(["plum", "apple", "peach"]);

        it("Should also work with array construction", () => {
            expect(inFnArr("plum"), "to be true");
        });
    });
});
