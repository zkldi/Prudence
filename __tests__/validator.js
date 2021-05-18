const { describe, it } = require("mocha");
const expect = require("unexpected");
const Prudence = require("../js/main").default;

const { ValidateValue, StringifyKeyChain, GetErrorMessage } = require("../js/validator");
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

            expect(newValidator.Validate(null, {}), "to exhaustively satisfy", {
                keychain: null,
                message: "Non-object provided for validation.",
                userVal: null,
            });
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

    describe("#StringifyKeyChain", () => {
        it("Should stringify a basic key chain", () => {
            expect(StringifyKeyChain(["foo", "bar"]), "to be", "foo.bar");
        });

        it("Should return null for an empty key chain", () => {
            expect(StringifyKeyChain([]), "to be", null);
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
                "to exhaustively satisfy",
                {
                    keychain: "foo.bar",
                    message: "error message here",
                    userVal: "foo",
                }
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
                "[Prudence] Invalid error message at foo.bar. Expected an error message or undefined, but got an object. Does your schema's structure match your error structure?"
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
                "to exhaustively satisfy",
                {
                    keychain: "foo.bar",
                    message: "Invalid Input, but no error message is available.",
                    userVal: "foo",
                }
            );
        });

        it("Should use a builtin message for strings", () => {
            expect(
                GetErrorMessage(
                    123,
                    "string",
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    undefined
                ),
                "to exhaustively satisfy",
                {
                    keychain: "foo.bar",
                    message: "Expected string.",
                    userVal: 123,
                }
            );
        });
    });

    // The real tests, lol
    describe("#ValidateMain", () => {
        describe("Array schemas", () => {
            let arraySchema = [
                {
                    name: "string",
                    age: Prudence.isInteger,
                    isAdmin: "boolean",
                },
            ];

            it("Should validate an array of values", () => {
                expect(
                    Prudence(
                        [
                            {
                                name: "foo",
                                age: 12,
                                isAdmin: true,
                            },
                            {
                                name: "bar",
                                age: 18,
                                isAdmin: false,
                            },
                        ],
                        arraySchema
                    ),
                    "to be",
                    null
                );
            });
        });

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
                    "to exhaustively satisfy",
                    {
                        keychain: "age",
                        message: "Expected an integer.",
                        userVal: 18.5,
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: null,
                        message: "Unexpected properties inside object: foo1, foo2.",
                        userVal: {
                            name: "bob",
                            age: 18,
                            isAdmin: false,
                            foo1: 1,
                            foo2: 2,
                        },
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: "name",
                        message: "Expected string.",
                        userVal: {
                            name: "bob",
                        },
                    }
                );
            });
        });

        describe("Options", () => {
            let schema = {
                foo: "string",
            };

            it("AllowExcessKeys should allow excess keys", () => {
                expect(
                    Prudence({ foo: "a", bar: 1 }, schema, {}, { allowExcessKeys: true }),
                    "to be null"
                );

                // no cross-option affecting
                expect(
                    () => Prudence(undefined, schema, {}, { allowExcessKeys: true }),
                    "to throw"
                );
            });

            it("throwOnNonObject to throw on non object.", () => {
                expect(
                    () => Prudence(undefined, schema, {}, { throwOnNonObject: true }),
                    "to throw"
                );
                expect(
                    () => Prudence(undefined, schema, {}, { throwOnNonObject: false }),
                    "not to throw"
                );

                // no cross-option affecting
                expect(
                    Prudence({ foo: "a", bar: 1 }, schema, {}, { throwOnNonObject: true }),
                    "not to be null"
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
                    "to exhaustively satisfy",
                    {
                        keychain: "permissions.admin",
                        message: "Expected boolean.",
                        userVal: "foo",
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: "permissions",
                        message: "Unexpected properties inside object: foo1, foo2.",
                        userVal: {
                            admin: true,
                            foo1: true,
                            foo2: true,
                        },
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: "permissions",
                        message:
                            "Object does not match structure of schema, expected this location to have an object.",
                        userVal: "something",
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: "friends[3]",
                        message: "Expected an integer.",
                        userVal: 15.5,
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: "aliases[1]",
                        message: "Expected string.",
                        userVal: 123,
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: "groupchats[1].name",
                        message: "Expected string.",
                        userVal: 123,
                    }
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
                    "to exhaustively satisfy",
                    {
                        keychain: "groupchats[0].members[2]",
                        message: "Expected an integer.",
                        userVal: 17.4,
                    }
                );
            });

            let arraySchemaNesting = {
                "2dArray": [[Prudence.isPositiveInteger]],
            };

            it("Should allow valid input for doubly-nested array schemas", () => {
                expect(
                    Prudence(
                        {
                            "2dArray": [
                                [1, 2],
                                [3, 4],
                                [5, 6],
                            ],
                        },
                        arraySchemaNesting
                    ),
                    "to be",
                    null
                );
            });

            it("Should reject invalid value input for doubly-nested array schemas", () => {
                expect(
                    Prudence(
                        {
                            "2dArray": [
                                [1, 2.5],
                                [3, 4],
                                [5, 6],
                            ],
                        },
                        arraySchemaNesting
                    ),
                    "to exhaustively satisfy",
                    {
                        keychain: '["2dArray"][0][1]',
                        message: "Expected a positive integer.",
                        userVal: 2.5,
                    }
                );

                expect(
                    Prudence(
                        {
                            "2dArray": [
                                [1, 2],
                                [3, 4],
                                [5.5, 6],
                            ],
                        },
                        arraySchemaNesting
                    ),
                    "to exhaustively satisfy",
                    {
                        keychain: '["2dArray"][2][0]',
                        message: "Expected a positive integer.",
                        userVal: 5.5,
                    }
                );
            });

            it("Should reject non-arrays at any point for doubly-nested array schemas", () => {
                expect(
                    Prudence(
                        {
                            "2dArray": [[1, 2], [3, 4], 6],
                        },
                        arraySchemaNesting
                    ),
                    "to exhaustively satisfy",
                    {
                        keychain: '["2dArray"][2]',
                        message: "Value was not an array.",
                        userVal: 6,
                    }
                );
            });
        });

        describe("Invalid Functions", () => {
            it("Any falsy output should result in an error", () => {
                expect(
                    Prudence(
                        { foo: 123 },
                        {
                            foo: () => null,
                        }
                    ),
                    "not to be",
                    null
                );
            });
        });

        describe("Error Messages", () => {
            it("Custom error messages should take priority over function error messages.", () => {
                expect(
                    Prudence(
                        {
                            foo: 123,
                        },
                        {
                            foo: () => "fn err msg",
                        },
                        {
                            foo: "override error message",
                        }
                    ).message,
                    "to be",
                    "override error message"
                );
            });

            it("Custom error messages should take priority over built-in error messages.", () => {
                expect(
                    Prudence(
                        {
                            foo: 123,
                        },
                        {
                            foo: "string",
                        },
                        {
                            foo: "override error message",
                        }
                    ).message,
                    "to be",
                    "override error message"
                );
            });

            it("Custom error messages should not take priority over function success.", () => {
                expect(
                    Prudence(
                        {
                            foo: 123,
                        },
                        {
                            foo: () => true,
                        },
                        {
                            foo: "override error message",
                        }
                    ),
                    "to be",
                    null
                );
            });
        });
    });
});
