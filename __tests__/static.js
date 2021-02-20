const { describe, it } = require("mocha");
const expect = require("unexpected");
const Prudence = require("../js/main").default;
const { TryNonInts, TryNonFloats, TryNonStrings } = require("./utils");

describe("Static Prudence Methods", () => {
    describe("#gt", () => {
        it("Should return a function", () => {
            expect(Prudence.gt(1), "to be a function");
        });

        it("Should allow numbers > argument", () => {
            expect(Prudence.gt(1)(5), "to be true");
        });

        it("Should disallow numbers < argument", () => {
            expect(Prudence.gt(1)(0), "to be false");
        });

        it("Should reject equal values", () => {
            expect(Prudence.gt(1)(1), "to be false");
        });

        it("Should allow floats", () => {
            expect(Prudence.gt(1)(1.01), "to be true");
        });

        TryNonFloats(Prudence.gt(0));
    });

    describe("#gte", () => {
        it("Should return a function", () => {
            expect(Prudence.gte(1), "to be a function");
        });

        it("Should allow numbers >= argument", () => {
            expect(Prudence.gte(1)(5), "to be true");
        });

        it("Should disallow numbers < argument", () => {
            expect(Prudence.gte(1)(0), "to be false");
        });

        it("Should allow equal values", () => {
            expect(Prudence.gte(1)(1), "to be true");
        });

        it("Should allow floats", () => {
            expect(Prudence.gte(1)(1.01), "to be true");
        });

        TryNonFloats(Prudence.gte(0));
    });

    describe("#lt", () => {
        it("Should return a function", () => {
            expect(Prudence.lt(1), "to be a function");
        });

        it("Should allow numbers < argument", () => {
            expect(Prudence.lt(1)(0), "to be true");
        });

        it("Should disallow numbers > argument", () => {
            expect(Prudence.lt(1)(5), "to be false");
        });

        it("Should reject equal values", () => {
            expect(Prudence.lt(1)(1), "to be false");
        });

        it("Should allow floats less than the value", () => {
            expect(Prudence.lt(1)(0.99), "to be true");
        });

        it("Should disallow floats greater than the value", () => {
            expect(Prudence.lt(1)(1.01), "to be false");
        });
        TryNonFloats(Prudence.lt(0));
    });

    describe("#lte", () => {
        it("Should return a function", () => {
            expect(Prudence.lte(1), "to be a function");
        });

        it("Should determine whether a number is <= the argument", () => {
            expect(Prudence.lte(1)(5), "to be false");
            expect(Prudence.lte(1)(0), "to be true");
        });

        it("Should allow equal values", () => {
            expect(Prudence.lte(1)(1), "to be true");
        });

        it("Should allow floats less than the value", () => {
            expect(Prudence.lte(1)(0.99), "to be true");
        });

        it("Should disallow floats greater than the value", () => {
            expect(Prudence.lte(1)(1.01), "to be false");
        });

        TryNonFloats(Prudence.lte(0));
    });

    describe("#gtInt", () => {
        it("Should return a function", () => {
            expect(Prudence.gtInt(1), "to be a function");
        });

        it("Should allow numbers > argument", () => {
            expect(Prudence.gtInt(1)(5), "to be true");
        });

        it("Should disallow numbers < argument", () => {
            expect(Prudence.gtInt(1)(0), "to be false");
        });

        it("Should reject equal values", () => {
            expect(Prudence.gtInt(1)(1), "to be false");
        });

        it("Should disallow floats less than the value", () => {
            expect(Prudence.gtInt(1)(0.99), "to be false");
        });

        it("Should disallow floats greater than the value", () => {
            expect(Prudence.gtInt(1)(1.01), "to be false");
        });

        TryNonFloats(Prudence.gtInt(0));
    });

    describe("#gteInt", () => {
        it("Should return a function", () => {
            expect(Prudence.gteInt(1), "to be a function");
        });

        it("Should allow numbers >= argument", () => {
            expect(Prudence.gteInt(1)(5), "to be true");
        });

        it("Should disallow numbers < argument", () => {
            expect(Prudence.gteInt(1)(0), "to be false");
        });

        it("Should allow equal values", () => {
            expect(Prudence.gteInt(1)(1), "to be true");
        });

        it("Should disallow floats less than the value", () => {
            expect(Prudence.gteInt(1)(0.99), "to be false");
        });

        it("Should disallow floats greater than the value", () => {
            expect(Prudence.gteInt(1)(1.01), "to be false");
        });

        TryNonFloats(Prudence.gteInt(0));
    });

    describe("#ltInt", () => {
        it("Should return a function", () => {
            expect(Prudence.ltInt(1), "to be a function");
        });

        it("Should allow numbers < argument", () => {
            expect(Prudence.ltInt(1)(0), "to be true");
        });

        it("Should disallow numbers > argument", () => {
            expect(Prudence.ltInt(1)(5), "to be false");
        });

        it("Should reject equal values", () => {
            expect(Prudence.ltInt(1)(1), "to be false");
        });

        it("Should disallow floats less than the value", () => {
            expect(Prudence.ltInt(1)(0.99), "to be false");
        });

        it("Should disallow floats greater than the value", () => {
            expect(Prudence.ltInt(1)(1.01), "to be false");
        });

        TryNonFloats(Prudence.ltInt(0));
    });

    describe("#lteInt", () => {
        it("Should return a function", () => {
            expect(Prudence.lteInt(1), "to be a function");
        });

        it("Should determine whether a number is <= the argument", () => {
            expect(Prudence.lteInt(1)(5), "to be false");
            expect(Prudence.lteInt(1)(0), "to be true");
        });

        it("Should allow equal values", () => {
            expect(Prudence.lteInt(1)(1), "to be true");
        });

        it("Should disallow floats less than the value", () => {
            expect(Prudence.lteInt(1)(0.99), "to be false");
        });

        it("Should disallow floats greater than the value", () => {
            expect(Prudence.lteInt(1)(1.01), "to be false");
        });

        TryNonFloats(Prudence.lteInt(0));
    });

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

    describe("#isBoundedString", () => {
        it("Should return a function", () => {
            expect(Prudence.isBoundedString(1, 5), "to be a function");
        });

        let boundStr = Prudence.isBoundedString(1, 5);

        it("Should validate strings within the boundaries", () => {
            expect(boundStr("foo"), "to be true");
        });

        it("Should validate strings equal to the lower bound", () => {
            expect(boundStr("f"), "to be true");
        });

        it("Should validate strings equal to the upper bound", () => {
            expect(boundStr("hello"), "to be true");
        });

        it("Should invalidate strings greater than the upper bound", () => {
            expect(boundStr("foobar"), "to be false");
        });

        it("Should invalidate strings less than the lower bound", () => {
            expect(boundStr(""), "to be false");
        });

        TryNonStrings(boundStr);
    });

    describe("#regex", () => {
        it("Should return a function", () => {
            expect(Prudence.regex(/^foo/), "to be a function");
        });

        let rx = Prudence.regex(/^foo/);

        it("Should validate strings that match the regex", () => {
            expect(rx("fooooon"), "to be true");
        });

        it("Should invalidate strings that do not match the regex", () => {
            expect(rx("fon"), "to be false");
        });

        it("Should also work for new Regexp", () => {
            let rxp = Prudence.regex(new RegExp("^foo"));

            expect(rxp("foooon"), "to be true");
            expect(rxp("fon"), "to be false");
        });

        TryNonStrings(rx);
    });
});
