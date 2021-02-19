const { describe, it } = require("mocha");
const expect = require("unexpected");
const Prudence = require("../js/main").default;

const {
    ValidateValue,
    FunctionHasErrorMsg,
    CreateErrorMessage,
    StringifyKeyChain,
    GetErrorMessage,
} = require("../js/validator");
// const { TryNonInts, TryNonFloats } = require("./utils");

describe("Prudence Validators", () => {
    describe("#new Prudence.validator()", () => {
        it("Should return an instance of validator", () => {
            expect(new Prudence.Validator() instanceof Prudence.Validator, "to be true");
        });

        it("An invalid key in the parser options should throw", () => {
            expect(
                () => new Prudence.Validator({ invalidKey: true }),
                "to throw",
                '[Prudence] Invalid option "invalidKey" passed to Prudence constructor.'
            );
        });

        it("An invalid value in the parser options should throw", () => {
            expect(
                () => new Prudence.Validator({ throwOnNonObject: "blah" }),
                "to throw",
                '[Prudence] Invalid option value of blah for "throwOnNonObject", expected boolean.'
            );
        });

        it("Should listen to options as overrides", () => {
            let newValidator = new Prudence.Validator({ throwOnNonObject: false });
            // under normal circumstances this would throw, instead
            // will return false.

            expect(newValidator.Validate(null, {}), "to be", "Non-object provided for validation.");
        });
    });

    describe("#ValidateValue", () => {
        describe("schemaValue as string", () => {
            it('Should work for "string"', () => {
                expect(ValidateValue("foo", "string", { a: "foo" }), "to be true");
            });

            it('Should validate for "number"', () => {
                expect(ValidateValue(123, "number", { a: 123 }), "to be true");
            });

            it('Should validate for "boolean"', () => {
                expect(ValidateValue(true, "boolean", { a: true }), "to be true");
            });

            it('Should validate for "number"', () => {
                expect(ValidateValue(123, "number", { a: 123 }), "to be true");
            });

            it('Should validate for "null"', () => {
                expect(ValidateValue(null, "null", { a: null }), "to be true");
            });

            it('Should validate for "object"', () => {
                expect(ValidateValue({}, "object", { a: {} }), "to be true");
            });

            it('Should validate for "function"', () => {
                expect(
                    ValidateValue(() => true, "function", { a: () => true }),
                    "to be true"
                );
            });

            it('Should validate for "undefined"', () => {
                expect(ValidateValue(undefined, "undefined", { a: undefined }), "to be true");
            });

            it('Should validate for "bigint"', () => {
                expect(ValidateValue(123n, "bigint", { a: 123n }), "to be true");
            });

            it('Should validate for "symbol"', () => {
                let s = Symbol();
                expect(ValidateValue(s, "symbol", { a: s }), "to be true");
            });

            it("Should throw for invalid string", () => {
                expect(
                    () => {
                        ValidateValue(null, "foobar", { a: null });
                    },
                    "to throw",
                    '[Prudence] Invalid string schemaValue of "foobar". This is not a valid typeof value.'
                );
            });

            it('"object" should reject null', () => {
                expect(ValidateValue(null, "object", { a: null }), "to be false");
            });

            it("Should use the * prefix to indicate optional/undefinedness", () => {
                expect(ValidateValue(undefined, "*string", {}), "to be true");
            });

            it("Should use the ? prefix to indicate nullability", () => {
                expect(ValidateValue(null, "?string", { a: null }), "to be true");
            });

            it("Should use the *? prefix to indicate undefinedness and nullability", () => {
                expect(ValidateValue(undefined, "*?string", {}), "to be true");
                expect(ValidateValue(null, "*?string", {}), "to be true");
            });

            it("Should throw for ?* prefix", () => {
                expect(
                    () => {
                        ValidateValue(null, "?*string", { a: null });
                    },
                    "to throw",
                    '[Prudence] Invalid string schemaValue "?*string". Did you mean to start with "*?".'
                );
            });
        });

        describe("schemaValue as function", () => {
            it("Functions as schemavalues should be called", () => {
                expect(
                    ValidateValue(true, () => true),
                    "to be true"
                );
            });

            it("Functions as schemaValues should correctly take self", () => {
                expect(
                    ValidateValue("hello world", (self) => self === "hello world", {
                        a: "hello world",
                    }),
                    "to be true"
                );
            });

            it("Functions as schemaValues should correctly take self, parent", () => {
                expect(
                    ValidateValue(13, (self, parent) => parent.end > self, {
                        start: 13,
                        end: 18,
                    }),
                    "to be true"
                );
            });
        });
    });

    describe("#FunctionHasErrorMsg", () => {
        it("Should correctly determine if a function has an error message", () => {
            let fn = () => true;
            fn.errorMessage = "foo";
            expect(FunctionHasErrorMsg(fn), "to be true");
        });

        it("Should reject functions without error messages", () => {
            let fn = () => true;
            expect(FunctionHasErrorMsg(fn), "to be false");
        });
    });

    describe("#CreateErrorMessage", () => {
        it("Should return a prefixed/suffixed string if error message is a string", () => {
            expect(
                CreateErrorMessage(
                    "Should be greater than 18.",
                    17,
                    "foo",
                    Prudence.Validator.defaultOptions
                ),
                "to be",
                "[foo]: Should be greater than 18. Received 17."
            );
        });

        it("Should throw an error on invalid error message", () => {
            expect(
                () => CreateErrorMessage(null, 17, "foo", Prudence.Validator.defaultOptions),
                "to throw",
                "[Prudence] Invalid error message of null. Error messages must be strings."
            );
        });
    });

    describe("#StringifyKeyChain", () => {
        it("Should stringify a basic key chain", () => {
            expect(StringifyKeyChain(["foo", "bar"]), "to be", "foo.bar");
        });

        it("Should return <root level> for an empty key chain", () => {
            expect(StringifyKeyChain([]), "to be", "<root level>");
        });

        it("Should stringify a key chain starting with dots", () => {
            expect(StringifyKeyChain(["f.oo", "bar"]), "to be", '["f.oo"].bar');
        });

        it("Should stringify a key chain with dots", () => {
            expect(StringifyKeyChain(["foo", "b.ar"]), "to be", 'foo["b.ar"]');
        });

        it("Should array-indexify keys that start with numbers", () => {
            expect(StringifyKeyChain(["foo", "1"]), "to be", "foo[1]");
        });

        it("Should array-indexify keychains that start with numbers", () => {
            expect(StringifyKeyChain(["1", "foo", "b.ar"]), "to be", '[1].foo["b.ar"]');
        });
    });

    describe("#GetErrorMessage", () => {
        it("Should invoke custom error messages", () => {
            expect(
                GetErrorMessage(
                    "foo",
                    "string",
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    "error message here"
                ),
                "to be",
                "[foo.bar]: error message here. Received foo."
            );
        });

        it("Invoked custom error messages should take priority over function error messages", () => {
            let fn = () => true;
            fn.errorMessage = "error 2";

            expect(
                GetErrorMessage(
                    "foo",
                    fn,
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    "error message here"
                ),
                "to be",
                "[foo.bar]: error message here. Received foo."
            );
        });

        it("Object custom error messages should throw", () => {
            expect(
                () =>
                    GetErrorMessage(
                        "foo",
                        "string",
                        ["foo", "bar"],
                        Prudence.Validator.defaultOptions,
                        { someNestedProperty: "error message" }
                    ),
                "to throw",
                "[Prudence] Invalid customError at foo.bar. Expected an error message or undefined, but got an object."
            );
        });

        it("Should use provided functions error message if present", () => {
            let fn = () => true;
            fn.errorMessage = "error 2";

            expect(
                GetErrorMessage(
                    "foo",
                    fn,
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    undefined
                ),
                "to be",
                "[foo.bar]: error 2. Received foo."
            );
        });

        it("Should return default error if function with no error message was provided", () => {
            let fn = () => true;

            expect(
                GetErrorMessage(
                    "foo",
                    fn,
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    undefined
                ),
                "to be",
                "[foo.bar]: The value foo was invalid, but no error message is available."
            );
        });

        it("Should use a builtin message for strings", () => {
            expect(
                GetErrorMessage(
                    "foo",
                    "string",
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    undefined
                ),
                "to be",
                "[foo.bar]: Expected typeof string. Received foo."
            );
        });
    });

    // The real tests, lol
    describe("#ValidateMain", () => {
        describe("Flat schemas", () => {
            let flatSchema = {
                name: "string",
                age: Prudence.isInteger,
                isAdmin: "boolean",
            };

            it("Should accept valid input", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            isAdmin: false,
                        },
                        flatSchema
                    ),
                    "to be",
                    null
                );
            });

            it("Should reject invalid input", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18.5,
                            isAdmin: false,
                        },
                        flatSchema
                    ),
                    "to be",
                    "[age]: Expected an integer. Received 18.5."
                );
            });

            it("Should reject excess keys", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            isAdmin: false,
                            foo1: 1,
                            foo2: 2,
                        },
                        flatSchema
                    ),
                    "to be",
                    `[<root level>]: These keys were not expected inside this object: foo1, foo2.`
                );
            });

            it("Should reject unecessary nesting", () => {
                expect(
                    Prudence(
                        {
                            name: {
                                name: "bob",
                            },
                            age: 18,
                            isAdmin: false,
                        },
                        flatSchema
                    ),
                    "to be",
                    `[name]: Expected typeof string. Received [object Object].`
                );
            });
        });

        describe("Nested Schemas", () => {
            let nestedSchema = {
                name: "string",
                age: Prudence.isInteger,
                permissions: {
                    admin: "boolean",
                },
            };

            it("Should accept valid input", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            permissions: {
                                admin: true,
                            },
                        },
                        nestedSchema
                    ),
                    "to be",
                    null
                );
            });

            it("Should reject invalid input", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            permissions: {
                                admin: "foo",
                            },
                        },
                        nestedSchema
                    ),
                    "to be",
                    `[permissions.admin]: Expected typeof boolean. Received foo.`
                );
            });

            it("Should reject excess keys", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            permissions: {
                                admin: true,
                                foo1: true,
                                foo2: true,
                            },
                        },
                        nestedSchema
                    ),
                    "to be",
                    `[permissions]: These keys were not expected inside this object: foo1, foo2.`
                );
            });

            it("Should reject object->schema shape mismatch", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            permissions: "something",
                        },
                        nestedSchema
                    ),
                    "to be",
                    `[permissions]: Object does not match structure of schema, expected this location to have an object.`
                );
            });
        });

        describe("Schemas using Array Syntax", () => {
            let arraySchemaFn = {
                name: "string",
                age: Prudence.isInteger,
                friends: [Prudence.isInteger],
            };

            it("Should accept valid input against [Function]", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            friends: [12, 13, 14, 15],
                        },
                        arraySchemaFn
                    ),
                    "to be",
                    null
                );
            });

            it("Should reject invalid input against [Function]", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            friends: [12, 13, 14, 15.5],
                        },
                        arraySchemaFn
                    ),
                    "to be",
                    "[friends[3]]: Expected an integer. Received 15.5."
                );
            });

            let arraySchemaLiteral = {
                name: "string",
                age: Prudence.isInteger,
                aliases: ["string"],
            };

            it("Should accept valid input against [literal]", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            aliases: ["bobert", "robert", "beb"],
                        },
                        arraySchemaLiteral
                    ),
                    "to be",
                    null
                );
            });

            it("Should reject invalid input against [literal]", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            aliases: ["bob", 123],
                        },
                        arraySchemaLiteral
                    ),
                    "to be",
                    "[aliases[1]]: Expected typeof string. Received 123."
                );
            });

            // all together now!
            let arraySchemaObject = {
                name: "string",
                age: Prudence.isInteger,
                groupchats: [
                    {
                        name: "string",
                        members: [Prudence.isInteger],
                    },
                ],
            };

            it("Should accept valid input against [object]", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            groupchats: [
                                {
                                    name: "the boys",
                                    members: [13, 14, 15],
                                },
                                {
                                    name: "the fellas",
                                    members: [13, 16, 17],
                                },
                            ],
                        },
                        arraySchemaObject
                    ),
                    "to be",
                    null
                );
            });

            it("Should reject invalid input against [object] nesting 1", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            groupchats: [
                                {
                                    name: "the boys",
                                    members: [13, 14, 15],
                                },
                                {
                                    name: 123,
                                    members: [13, 16, 17],
                                },
                            ],
                        },
                        arraySchemaObject
                    ),
                    "to be",
                    "[groupchats[1].name]: Expected typeof string. Received 123."
                );
            });

            it("Should reject invalid input against [object] nesting 2", () => {
                expect(
                    Prudence(
                        {
                            name: "bob",
                            age: 18,
                            groupchats: [
                                {
                                    name: "the boys",
                                    members: [13, 14, 17.4],
                                },
                                {
                                    name: "the fellas",
                                    members: [13, 16, 17],
                                },
                            ],
                        },
                        arraySchemaObject
                    ),
                    "to be",
                    "[groupchats[0].members[2]]: Expected an integer. Received 17.4."
                );
            });
        });
    });
});
