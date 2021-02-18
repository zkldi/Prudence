const { describe, it } = require("mocha");
const expect = require("unexpected");
const Prudence = require("../js/main").default;

const {
    ValidateValue,
    FunctionHasErrorHandler,
    InvokeCustomErrorHandler,
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

            expect(newValidator.Validate(null, {}).valid, "to be false");
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

    describe("#FunctionHasErrorHandler", () => {
        it("Should correctly determine if a function has an error handler", () => {
            let fn = () => true;
            fn.errorHandler = "foo";
            expect(FunctionHasErrorHandler(fn), "to be true");
        });

        it("Should reject functions without error handlers", () => {
            let fn = () => true;
            expect(FunctionHasErrorHandler(fn), "to be false");
        });
    });

    describe("#InvokeCustomErrorHandler", () => {
        it("Should return a prefixed string if error handler is a string", () => {
            expect(
                InvokeCustomErrorHandler(
                    "Should be greater than 18.",
                    17,
                    "foo",
                    Prudence.Validator.defaultOptions
                ),
                "to be",
                "[foo]: Should be greater than 18."
            );
        });

        it("Should return a custom string if error handler is a function", () => {
            expect(
                InvokeCustomErrorHandler(
                    () => "blah",
                    17,
                    "foo",
                    Prudence.Validator.defaultOptions
                ),
                "to be",
                "[foo]: blah"
            );
        });

        it("Should pass object value as the first argument to an error handler", () => {
            expect(
                InvokeCustomErrorHandler(
                    (v) => v.toString(),
                    17,
                    "foo",
                    Prudence.Validator.defaultOptions
                ),
                "to be",
                "[foo]: 17"
            );
        });

        it("Should throw an error on invalid error handler", () => {
            expect(
                () => InvokeCustomErrorHandler(null, 17, "foo", Prudence.Validator.defaultOptions),
                "to throw",
                "[Prudence] Invalid error handler of null. Error handlers must be strings or functions."
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
            expect(StringifyKeyChain(["f.oo", "bar"]), "to be", '"f.oo".bar');
        });

        it("Should stringify a key chain with dots", () => {
            expect(StringifyKeyChain(["foo", "b.ar"]), "to be", 'foo["b.ar"]');
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
                "[foo.bar]: error message here"
            );
        });

        it("Invoked custom error messages should take priority over function error messages", () => {
            let fn = () => true;
            fn.errorHandler = "error 2";

            expect(
                GetErrorMessage(
                    "foo",
                    fn,
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    "error message here"
                ),
                "to be",
                "[foo.bar]: error message here"
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
                "[Prudence] Invalid errorHandlers at foo.bar. Expected an error handler or undefined, but got an object."
            );
        });

        it("Should use provided functions error handler if present", () => {
            let fn = () => true;
            fn.errorHandler = "error 2";

            expect(
                GetErrorMessage(
                    "foo",
                    fn,
                    ["foo", "bar"],
                    Prudence.Validator.defaultOptions,
                    undefined
                ),
                "to be",
                "[foo.bar]: error 2"
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
                "[foo.bar]: Expected typeof string, received foo."
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
                    "to exhaustively satisfy",
                    { valid: true }
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
                        valid: false,
                        err: "[age]: Expected an integer.",
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
                        valid: false,
                        err: `[<root level>]: These keys were not expected inside this object: foo1, foo2.`,
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
                        valid: false,
                        err: `[name]: Expected typeof string, received [object Object].`,
                    }
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
                    "to exhaustively satisfy",
                    { valid: true }
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
                        valid: false,
                        err: `[permissions.admin]: Expected typeof boolean, received foo.`,
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
                        valid: false,
                        err: `[permissions]: These keys were not expected inside this object: foo1, foo2.`,
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
                        valid: false,
                        err: `[permissions]: Object does not match structure of schema, expected this to be an object.`,
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
                    "to exhaustively satisfy",
                    { valid: true }
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
                    { valid: false, err: "[friends.3]: Expected an integer." }
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
                    "to exhaustively satisfy",
                    { valid: true }
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
                    { valid: false, err: "[aliases.1]: Expected typeof string, received 123." }
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
                    "to exhaustively satisfy",
                    { valid: true }
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
                        valid: false,
                        err: "[groupchats.1.name]: Expected typeof string, received 123.",
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
                        valid: false,
                        err: "[groupchats.0.members.2]: Expected an integer.",
                    }
                );
            });
        });
    });
});
