import { ValidationFunction } from "./types";
import { AttachErrMsg } from "./util";

/**
 * Alias for Number.isSafeInteger.
 * @returns {ValidationFunction}
 */
const isInteger = AttachErrMsg(
    (self: unknown): boolean => Number.isSafeInteger(self),
    "Expected an integer."
);

/**
 * Returns a validation function that checks if the passed value is a number and greater than
 * the passed argument.
 *
 * @param number The number the value must be greater than.
 * @returns {ValidationFunction}
 */
const gt = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isFinite(self) && (self as number) > number,
        `Expected number to be greater than ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is a number and greater than
 * or equal to the passed argument.
 *
 * @param number The number the value must be greater than or equal to.
 * @returns {ValidationFunction}
 */
const gte = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isFinite(self) && (self as number) >= number,
        `Expected number to be greater than or equal to ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is a number and less than
 * the passed argument.
 *
 * @param number The number the value must be less than.
 * @returns {ValidationFunction}
 */
const lt = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isFinite(self) && (self as number) < number,
        `Expected number to be less than ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is a number and less than
 * or equal to the passed argument.
 *
 * @param number The number the value must be less than or equal to.
 * @returns {ValidationFunction}
 */
const lte = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isFinite(self) && (self as number) <= number,
        `Expected number to be less than or equal to ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is an integer and greater than
 * the passed argument.
 *
 * @param number The number the value must be greater than.
 * @returns {ValidationFunction}
 */
const gtInt = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) > number,
        `Expected number to be an integer and greater than ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is an integer and greater than
 * or equal to the passed argument.
 *
 * @param number The number the value must be greater than or equal to.
 * @returns {ValidationFunction}
 */
const gteInt = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) >= number,
        `Expected number to be an integer and greater than or equal to ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is an integer and less than
 * the passed argument.
 *
 * @param number The number the value must be less than.
 * @returns {ValidationFunction}
 */
const ltInt = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) < number,
        `Expected number to be an integer and less than ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is an integer and less than
 * or equal to the passed argument.
 *
 * @param number The number the value must be less than or equal to.
 * @returns {ValidationFunction}
 */
const lteInt = (number: number): ValidationFunction =>
    AttachErrMsg(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) <= number,
        `Expected number to be an integer and less than or equal to ${number}.`
    );

/**
 * Determines if a value is a positive integer.
 */
const isPositiveInteger = AttachErrMsg(
    (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) >= 0,
    "Expected a positive integer."
);

/**
 * Determines if a value is a positive integer and not 0.
 */
const isPositiveNonZeroInteger = AttachErrMsg(
    (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) > 0,
    "Expected a positive non-zero integer."
);

/**
 * Takes a lower bound and an upper bound and returns a function that validates
 * whether a number is an integer and between the two.
 * @param lowerBound The lower bound. Inclusive.
 * @param upperBound The upper bound. Inclusive.
 */
function isBoundedInteger(lowerBound: number, upperBound: number): ValidationFunction {
    return AttachErrMsg(
        (self: unknown): boolean =>
            Number.isSafeInteger(self) &&
            (self as number) <= upperBound &&
            (self as number) >= lowerBound,
        `Expected an integer between ${lowerBound} and ${upperBound}.`
    );
}

/**
 * Determines if a value is a positive number.
 */
const isPositive = AttachErrMsg(
    (self: unknown): boolean => Number.isFinite(self) && (self as number) >= 0,
    "Expected a positive number."
);

/**
 * Determines if a value is a positive number and non-zero.
 */
const isPositiveNonZero = AttachErrMsg(
    (self: unknown): boolean => Number.isFinite(self) && (self as number) > 0,
    "Expected a positive non-zero number."
);

/**
 * Takes a list of items and returns a function that checks if a provided value is inside that array.
 * @param values The list of items to check against. This is a rest parameter.
 */
function isIn(...values: unknown[]): ValidationFunction {
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
function isBoundedString(lower: number, upper: number): ValidationFunction {
    return AttachErrMsg(
        (self: unknown): boolean =>
            typeof self === "string" && self.length >= lower && self.length <= upper,
        `Expected a string with length between ${lower} and ${upper}.`
    );
}

/**
 * Checks whether a value is a string that matches the given regex.
 * @param regex The regex to match.
 */
function regex(regex: RegExp): ValidationFunction {
    return AttachErrMsg(
        (self: unknown): boolean => typeof self === "string" && regex.test(self),
        `Expected string to match ${regex.toString()}`
    );
}

function allOf(...validators: ValidationFunction[]): ValidationFunction {
    return (self: unknown, parent): boolean | string => {
        for (const v of validators) {
            let result = v(self, parent);

            if (typeof result === "string") {
                return result;
            } else if (result === false) {
                return result;
            }
        }

        return true;
    };
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

// no op
const any = () => true;

// I can't think of a nice way to return err msgs for this.
// function anyOf(...validators: ValidationFunction[]): ValidationFunction {
//     return (self: unknown, parent): boolean | string => {
//         for (const v of validators) {
//             let result = v(self, parent);

//             if (typeof result === "string") {
//                 return result;
//             } else if (result === false) {
//                 return result;
//             }
//         }

//         return false;
//     };
// }

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
};

export default PrudenceStatic;
