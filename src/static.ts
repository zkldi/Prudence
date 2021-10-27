import { ValidationFunction, ValidSchemaValue } from "./types";
import { ValidateObjectValue } from "./validator";

/**
 * Alias for Number.isSafeInteger.
 * @returns {ValidationFunction}
 */
const isInteger = (self: unknown) => Number.isSafeInteger(self) || "Expected an integer.";

/**
 * Returns a validation function that checks if the passed value is a number and greater than
 * the passed argument.
 *
 * @param number The number the value must be greater than.
 * @returns {ValidationFunction}
 */
const gt = (number: number) => (self: unknown) =>
    (typeof self === "number" && (self as number) > number) ||
    `Expected number to be greater than ${number}.`;

/**
 * Returns a validation function that checks if the passed value is a number and greater than
 * or equal to the passed argument.
 *
 * @param number The number the value must be greater than or equal to.
 * @returns {ValidationFunction}
 */
const gte = (number: number) => (self: unknown) =>
    (typeof self === "number" && (self as number) >= number) ||
    `Expected number to be greater than or equal to ${number}.`;

/**
 * Returns a validation function that checks if the passed value is a number and less than
 * the passed argument.
 *
 * @param number The number the value must be less than.
 * @returns {ValidationFunction}
 */
const lt = (number: number) => (self: unknown) =>
    (typeof self === "number" && (self as number) < number) ||
    `Expected number to be less than ${number}.`;

/**
 * Returns a validation function that checks if the passed value is a number and less than
 * or equal to the passed argument.
 *
 * @param number The number the value must be less than or equal to.
 * @returns {ValidationFunction}
 */
const lte = (number: number) => (self: unknown) =>
    (typeof self === "number" && (self as number) <= number) ||
    `Expected number to be less than or equal to ${number}.`;

/**
 * Returns a validation function that checks if the passed value is an integer and greater than
 * the passed argument.
 *
 * @param number The number the value must be greater than.
 * @returns {ValidationFunction}
 */
const gtInt = (number: number) => (self: unknown) =>
    (Number.isSafeInteger(self) && (self as number) > number) ||
    `Expected number to be an integer and greater than ${number}.`;

/**
 * Returns a validation function that checks if the passed value is an integer and greater than
 * or equal to the passed argument.
 *
 * @param number The number the value must be greater than or equal to.
 * @returns {ValidationFunction}
 */
const gteInt = (number: number) => (self: unknown) =>
    (Number.isSafeInteger(self) && (self as number) >= number) ||
    `Expected number to be an integer and greater than or equal to ${number}.`;

/**
 * Returns a validation function that checks if the passed value is an integer and less than
 * the passed argument.
 *
 * @param number The number the value must be less than.
 * @returns {ValidationFunction}
 */
const ltInt = (number: number) => (self: unknown) =>
    (Number.isSafeInteger(self) && (self as number) < number) ||
    `Expected number to be an integer and less than ${number}.`;

/**
 * Returns a validation function that checks if the passed value is an integer and less than
 * or equal to the passed argument.
 *
 * @param number The number the value must be less than or equal to.
 * @returns {ValidationFunction}
 */
const lteInt = (number: number) => (self: unknown) =>
    (Number.isSafeInteger(self) && (self as number) <= number) ||
    `Expected number to be an integer and less than or equal to ${number}.`;

/**
 * Determines if a value is a positive integer.
 */
const isPositiveInteger = (self: unknown) =>
    (Number.isSafeInteger(self) && (self as number) >= 0) || "Expected a positive integer.";

/**
 * Determines if a value is a positive integer and not 0.
 */
const isPositiveNonZeroInteger = (self: unknown) =>
    (Number.isSafeInteger(self) && (self as number) > 0) || "Expected a positive non-zero integer.";

/**
 * Takes a lower bound and an upper bound and returns a function that validates
 * whether a number is an integer and between the two.
 * @param lowerBound The lower bound. Inclusive.
 * @param upperBound The upper bound. Inclusive.
 */
function isBoundedInteger(lowerBound: number, upperBound: number) {
    return (self: unknown) =>
        (Number.isSafeInteger(self) &&
            (self as number) <= upperBound &&
            (self as number) >= lowerBound) ||
        `Expected an integer between ${lowerBound} and ${upperBound}.`;
}

/**
 * Determines if a value is a positive number.
 */
const isPositive = (self: unknown) =>
    (typeof self === "number" && (self as number) >= 0) || "Expected a positive number.";

/**
 * Determines if a value is a positive number and non-zero.
 */
const isPositiveNonZero = (self: unknown) =>
    (typeof self === "number" && (self as number) > 0) || "Expected a positive non-zero number.";

/**
 * Takes a list of items and returns a function that checks if a provided value is inside that array.
 * @param values The list of items to check against. This is a rest parameter.
 */
function isIn(...values: unknown[]) {
    if (Array.isArray(values[0]) && values.length === 1) {
        values = [...values[0]];
    }

    return (self: unknown) => values.includes(self) || `Expected any of ${values.join(", ")}.`;
}

/**
 * Checks whether an item is a string and its length is between the two values.
 * @param lower The lower bound for the length. Inclusive.
 * @param upper The upper bound for the length. Inclusive.
 */
function isBoundedString(lower: number, upper: number) {
    return (self: unknown) =>
        (typeof self === "string" && self.length >= lower && self.length <= upper) ||
        `Expected a string with length between ${lower} and ${upper}.`;
}

/**
 * Checks whether an item is a number, and it is between the two values.
 * @param lower The lower bound for the number. Inclusive.
 * @param upper The upper bound for the number. Inclusive.
 */
function isBetween(lower: number, upper: number) {
    return (self: unknown) =>
        (typeof self === "number" && self >= lower && self <= upper) ||
        `Expected a number between ${lower} and ${upper}.`;
}

/**
 * Checks whether a value is a string that matches the given regex.
 * @param regex The regex to match.
 */
function regex(regex: RegExp) {
    return (self: unknown) =>
        (typeof self === "string" && regex.test(self)) ||
        `Expected string to match ${regex.toString()}`;
}

function is(value: unknown) {
    return (self: unknown) => Object.is(self, value);
}

function isNot(value: unknown) {
    return (self: unknown) => !Object.is(self, value);
}

function equalTo(value: unknown) {
    return (self: unknown) => self === value;
}

function notEqualTo(value: unknown) {
    return (self: unknown) => self !== value;
}

function nullable(schemaValue: ValidSchemaValue): ValidationFunction {
    return (self, parent, options, keychain) => {
        if (self === null) {
            return true;
        }

        let result = ValidateObjectValue(parent, self, schemaValue, undefined, options, keychain);
        if (result) {
            return result;
        }

        return true;
    };
}

function optional(schemaValue: ValidSchemaValue): ValidationFunction {
    return (self, parent, options, keychain) => {
        if (self === undefined) {
            return true;
        }

        let result = ValidateObjectValue(parent, self, schemaValue, undefined, options, keychain);
        if (result) {
            return result;
        }

        return true;
    };
}

// no op
const any = () => true;

/**
 * Checks whether the input data passes all of the provided prudence values.
 * @param schemaValues Rest parameter. Any valid prudence value.
 */
function allOf(...schemaValues: ValidSchemaValue[]): ValidationFunction {
    return (self, parent, options, keychain) => {
        for (const v of schemaValues) {
            let result = ValidateObjectValue(parent, self, v, undefined, options, keychain);

            if (result) {
                return result;
            }
        }

        return true;
    };
}

/**
 * Checks whether the input data passes any of the provided prudence values.
 * @param schemaValues Rest parameter. Any valid prudence value.
 */
function anyOf(...schemaValues: ValidSchemaValue[]): ValidationFunction {
    return (self, parent, options, keychain) => {
        for (const v of schemaValues) {
            let result = ValidateObjectValue(parent, self, v, undefined, options, keychain);

            if (result === null) {
                return true;
            }
        }

        return "The input was invalid, but no error message is available.";
    };
}

/**
 * Checks whether the input data is approximately the first argument.
 * @param number The number the input data should be approximately equal to.
 * @param leninecy By what +/- degree to accept inputs. This is inclusive on both ends.
 */
function aprx(number: number, leniency = 0.01) {
    return (self: unknown) => (typeof self === "number" && Math.abs(number - self) < leniency) || `Expected a number approximately equal to ${number}`
}

const PrudenceStatic = {
    isBoundedInteger,
    isPositiveInteger,
    isPositiveNonZeroInteger,
    isPositive,
    isPositiveNonZero,
    isIn,
    isInteger,
    gt,
    gte,
    lt,
    lte,
    gtInt,
    gteInt,
    ltInt,
    lteInt,
    isBoundedString,
    regex,
    allOf,
    is,
    isNot,
    equalTo,
    notEqualTo,
    any,
    anyOf,
    or: anyOf,
    and: allOf,
    nullable,
    isBetween,
    optional,
    aprx
};

export default PrudenceStatic;
