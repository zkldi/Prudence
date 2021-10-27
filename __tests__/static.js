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
            expect(Prudence.gt(1)(0), "to be", `Expected number to be greater than 1.`);
        });

        it("Should reject equal values", () => {
            expect(Prudence.gt(1)(1), "to be", `Expected number to be greater than 1.`);
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
            expect(
                Prudence.gte(1)(0),
                "to be",
                `Expected number to be greater than or equal to 1.`
            );
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
            expect(Prudence.lt(1)(5), "to be", `Expected number to be less than 1.`);
        });

        it("Should reject equal values", () => {
            expect(Prudence.lt(1)(1), "to be", `Expected number to be less than 1.`);
        });

        it("Should allow floats less than the value", () => {
            expect(Prudence.lt(1)(0.99), "to be true");
        });

        it("Should disallow floats greater than the value", () => {
            expect(Prudence.lt(1)(1.01), "to be", `Expected number to be less than 1.`);
        });
        TryNonFloats(Prudence.lt(0));
    });

    describe("#lte", () => {
        it("Should return a function", () => {
            expect(Prudence.lte(1), "to be a function");
        });

        it("Should determine whether a number is <= the argument", () => {
            expect(Prudence.lte(1)(5), "to be", `Expected number to be less than or equal to 1.`);
            expect(Prudence.lte(1)(0), "to be true");
        });

        it("Should allow equal values", () => {
            expect(Prudence.lte(1)(1), "to be true");
        });

        it("Should allow floats less than the value", () => {
            expect(Prudence.lte(1)(0.99), "to be true");
        });

        it("Should disallow floats greater than the value", () => {
            expect(
                Prudence.lte(1)(1.01),
                "to be",
                `Expected number to be less than or equal to 1.`
            );
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
            expect(
                Prudence.gtInt(1)(0),
                "to be",
                "Expected number to be an integer and greater than 1."
            );
        });

        it("Should reject equal values", () => {
            expect(
                Prudence.gtInt(1)(1),
                "to be",
                "Expected number to be an integer and greater than 1."
            );
        });

        it("Should disallow floats less than the value", () => {
            expect(
                Prudence.gtInt(1)(0.99),
                "to be",
                "Expected number to be an integer and greater than 1."
            );
        });

        it("Should disallow floats greater than the value", () => {
            expect(
                Prudence.gtInt(1)(1.01),
                "to be",
                "Expected number to be an integer and greater than 1."
            );
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
            expect(
                Prudence.gteInt(1)(0),
                "to be",
                "Expected number to be an integer and greater than or equal to 1."
            );
        });

        it("Should allow equal values", () => {
            expect(Prudence.gteInt(1)(1), "to be true");
        });

        it("Should disallow floats less than the value", () => {
            expect(
                Prudence.gteInt(1)(0.99),
                "to be",
                "Expected number to be an integer and greater than or equal to 1."
            );
        });

        it("Should disallow floats greater than the value", () => {
            expect(
                Prudence.gteInt(1)(1.01),
                "to be",
                "Expected number to be an integer and greater than or equal to 1."
            );
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
            expect(
                Prudence.ltInt(1)(5),
                "to be",
                "Expected number to be an integer and less than 1."
            );
        });

        it("Should reject equal values", () => {
            expect(
                Prudence.ltInt(1)(1),
                "to be",
                "Expected number to be an integer and less than 1."
            );
        });

        it("Should disallow floats less than the value", () => {
            expect(
                Prudence.ltInt(1)(0.99),
                "to be",
                "Expected number to be an integer and less than 1."
            );
        });

        it("Should disallow floats greater than the value", () => {
            expect(
                Prudence.ltInt(1)(1.01),
                "to be",
                "Expected number to be an integer and less than 1."
            );
        });

        TryNonFloats(Prudence.ltInt(0));
    });

    describe("#lteInt", () => {
        it("Should return a function", () => {
            expect(Prudence.lteInt(1), "to be a function");
        });

        it("Should determine whether a number is <= the argument", () => {
            expect(
                Prudence.lteInt(1)(5),
                "to be",
                "Expected number to be an integer and less than or equal to 1."
            );
            expect(Prudence.lteInt(1)(0), "to be true");
        });

        it("Should allow equal values", () => {
            expect(Prudence.lteInt(1)(1), "to be true");
        });

        it("Should disallow floats less than the value", () => {
            expect(
                Prudence.lteInt(1)(0.99),
                "to be",
                "Expected number to be an integer and less than or equal to 1."
            );
        });

        it("Should disallow floats greater than the value", () => {
            expect(
                Prudence.lteInt(1)(1.01),
                "to be",
                "Expected number to be an integer and less than or equal to 1."
            );
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

        it("Should return error for ints larger than safe values", () => {
            expect(
                Prudence.isPositiveInteger(Number.MAX_SAFE_INTEGER + 1),
                "to be",
                "Expected a positive integer."
            );
        });

        it("Should return error for ints less than 0", () => {
            expect(Prudence.isPositiveInteger(-1), "to be", "Expected a positive integer.");
        });

        TryNonInts(Prudence.isPositiveInteger);
    });

    describe("#isPositiveNonZeroInteger", () => {
        it("Should return true for positive integers", () => {
            expect(Prudence.isPositiveNonZeroInteger(5), "to be true");
        });

        it("Should return false for 0", () => {
            expect(
                Prudence.isPositiveNonZeroInteger(0),
                "to be",
                "Expected a positive non-zero integer."
            );
        });

        it("Should return false for ints larger than safe values", () => {
            expect(
                Prudence.isPositiveNonZeroInteger(Number.MAX_SAFE_INTEGER + 1),
                "to be",
                "Expected a positive non-zero integer."
            );
        });

        it("Should return false for ints less than 0", () => {
            expect(
                Prudence.isPositiveNonZeroInteger(-1),
                "to be",
                "Expected a positive non-zero integer."
            );
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
            expect(boundFn(100), "to be", `Expected an integer between 0 and 10.`);
        });

        it("Should disallow Infinity between 0 and 10.", () => {
            expect(boundFn(Infinity), "to be", `Expected an integer between 0 and 10.`);
        });

        it("Should allow -0 between 0 and 10.", () => {
            expect(boundFn(-0), "to be true");
        });

        it("Should disallow -100 between 0 and 10.", () => {
            expect(boundFn(-100), "to be", `Expected an integer between 0 and 10.`);
        });

        it("Should disallow -Infinity between 0 and 10.", () => {
            expect(boundFn(-Infinity), "to be", `Expected an integer between 0 and 10.`);
        });

        it("Should disallow 5.5 between 0 and 10.", () => {
            expect(boundFn(5.5), "to be", `Expected an integer between 0 and 10.`);
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

        it("Should allow 0", () => {
            expect(Prudence.isPositive(0), "to be true");
        });

        it("Should disallow negative integers", () => {
            expect(Prudence.isPositive(-1), "to be", "Expected a positive number.");
        });

        it("Should disallow negative floats", () => {
            expect(Prudence.isPositive(-1.5), "to be", "Expected a positive number.");
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

        it("Should disallow 0", () => {
            expect(Prudence.isPositiveNonZero(0), "to be", "Expected a positive non-zero number.");
        });

        it("Should disallow negative integers", () => {
            expect(Prudence.isPositiveNonZero(-1), "to be", "Expected a positive non-zero number.");
        });

        it("Should disallow negative floats", () => {
            expect(
                Prudence.isPositiveNonZero(-1.5),
                "to be",
                "Expected a positive non-zero number."
            );
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
            expect(inFn("banana"), "to be", "Expected any of plum, apple, peach.");
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
            expect(boundStr("foobar"), "to be", `Expected a string with length between 1 and 5.`);
        });

        it("Should invalidate strings less than the lower bound", () => {
            expect(boundStr(""), "to be", `Expected a string with length between 1 and 5.`);
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
            expect(rx("fon"), "to be", "Expected string to match /^foo/");
        });

        it("Should also work for new Regexp", () => {
            let rxp = Prudence.regex(new RegExp("^foo"));

            expect(rxp("foooon"), "to be true");
            expect(rxp("fon"), "to be", "Expected string to match /^foo/");
        });

        TryNonStrings(rx);
    });

    describe("#allOf", () => {
        it("Should return a function", () => {
            expect(
                Prudence.allOf(
                    () => true,
                    () => false
                ),
                "to be a function"
            );
        });

        it("Should fail if not all functions pass", () => {
            const badFn = Prudence.allOf(
                () => true,
                () => false
            );
            expect(Prudence({ foo: 1 }, { foo: badFn }), "not to be null");
        });

        it("Should pass if all functions pass", () => {
            const goodFn = Prudence.allOf(
                () => true,
                () => true,
                () => true
            );
            expect(Prudence({ foo: 1 }, { foo: goodFn }), "to be null");
        });

        it("Should work with any valid prudence value", () => {
            const schema = {
                root: Prudence.allOf(
                    (s) => typeof s.foo === "number",
                    (s) => typeof s.bar === "string",
                    {
                        foo: Prudence.any,
                        bar: Prudence.any,
                    }
                ),
            };

            expect(Prudence({ root: { foo: 123, bar: "asdf" } }, schema), "to be null");

            expect(
                Prudence({ root: { foo: 123, bar: "asdf", baz: "fdsa" } }, schema),
                "not to be null"
            );
            expect(Prudence({ root: { foo: "asdf", bar: "asdf" } }, schema), "not to be null");
            expect(Prudence({ root: { foo: 123, bar: 123 } }, schema), "not to be null");
        });
    });

    describe("#anyOf", () => {
        it("Should return a function", () => {
            expect(
                Prudence.anyOf(
                    () => true,
                    () => false
                ),
                "to be a function"
            );
        });

        it("Should fail if all functions do not pass", () => {
            const badFn = Prudence.anyOf(
                () => false,
                () => false
            );
            expect(Prudence({ foo: 1 }, { foo: badFn }), "not to be null");
        });

        it("Should pass if all functions pass", () => {
            const goodFn = Prudence.anyOf(
                () => true,
                () => true,
                () => true
            );
            expect(Prudence({ foo: 1 }, { foo: goodFn }), "to be null");
        });

        it("Should pass if any functions pass", () => {
            const goodFn = Prudence.anyOf(
                () => false,
                () => true,
                () => false
            );
            expect(Prudence({ foo: 1 }, { foo: goodFn }), "to be null");
        });

        it("Should work with any valid prudence value", () => {
            const schema = {
                root: Prudence.anyOf(
                    { foo: "string" },
                    { bar: "number" },
                    "null",
                    (s) => typeof s === "number" && s % 2 === 0
                ),
            };

            expect(Prudence({ root: { foo: "Any string" } }, schema), "to be null");
            expect(Prudence({ root: { bar: 123.456 } }, schema), "to be null");
            expect(Prudence({ root: null }, schema), "to be null");
            expect(Prudence({ root: 12 }, schema), "to be null");

            expect(Prudence({ root: { foo: 123 } }, schema), "not to be null");
            expect(Prudence({ root: { bar: "not a number" } }, schema), "not to be null");
            expect(Prudence({ root: [] }, schema), "not to be null");
            expect(Prudence({ root: 13 }, schema), "not to be null");
        });
    });

    describe("#nullable", () => {
        it("Should validate against any prudence value.", () => {
            const stringSchema = { field: Prudence.nullable("string") };
            expect(
                Prudence(
                    {
                        field: null,
                    },
                    stringSchema
                ),
                "to be null"
            );

            expect(
                Prudence(
                    {
                        field: "anystring",
                    },
                    stringSchema
                ),
                "to be null"
            );

            expect(
                Prudence(
                    {
                        field: 123,
                    },
                    stringSchema
                ),
                "not to be null"
            );

            const functionSchema = {
                field: Prudence.nullable((self) => typeof self === "number" && self % 2 === 0),
            };

            expect(
                Prudence(
                    {
                        field: null,
                    },
                    functionSchema
                ),
                "to be null"
            );

            expect(
                Prudence(
                    {
                        field: 2,
                    },
                    functionSchema
                ),
                "to be null"
            );

            expect(
                Prudence(
                    {
                        field: 1,
                    },
                    functionSchema
                ),
                "not to be null"
            );

            const nestedSchema = {
                field: Prudence.nullable({
                    nested: "string",
                }),
            };

            expect(
                Prudence(
                    {
                        field: null,
                    },
                    nestedSchema
                ),
                "to be null"
            );

            expect(
                Prudence(
                    {
                        field: {
                            nested: "foo",
                        },
                    },
                    nestedSchema
                ),
                "to be null"
            );

            expect(
                Prudence(
                    {
                        field: {
                            nested: 1,
                        },
                    },
                    nestedSchema
                ),
                "not to be null"
            );

            expect(
                Prudence(
                    {
                        field: {},
                    },
                    nestedSchema
                ),
                "not to be null"
            );
        });
    });
});
