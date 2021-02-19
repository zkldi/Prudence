import { ValidationFunction } from "../../src/types";
import { CreateFn } from "../util";

/**
 * Alias for Number.isSafeInteger.
 * @returns {ValidationFunction}
 */
const isInteger = CreateFn(
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
    CreateFn(
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
    CreateFn(
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
    CreateFn(
        (self: unknown): boolean => Number.isFinite(self) && (self as number) < number,
        `Expected number to be greater than ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is a number and less than
 * or equal to the passed argument.
 *
 * @param number The number the value must be less than or equal to.
 * @returns {ValidationFunction}
 */
const lte = (number: number): ValidationFunction =>
    CreateFn(
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
    CreateFn(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) > number,
        `Expected number to be greater than ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is an integer and greater than
 * or equal to the passed argument.
 *
 * @param number The number the value must be greater than or equal to.
 * @returns {ValidationFunction}
 */
const gteInt = (number: number): ValidationFunction =>
    CreateFn(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) >= number,
        `Expected number to be greater than or equal to ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is an integer and less than
 * the passed argument.
 *
 * @param number The number the value must be less than.
 * @returns {ValidationFunction}
 */
const ltInt = (number: number): ValidationFunction =>
    CreateFn(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) < number,
        `Expected number to be greater than ${number}.`
    );

/**
 * Returns a validation function that checks if the passed value is an integer and less than
 * or equal to the passed argument.
 *
 * @param number The number the value must be less than or equal to.
 * @returns {ValidationFunction}
 */
const lteInt = (number: number): ValidationFunction =>
    CreateFn(
        (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) <= number,
        `Expected number to be less than or equal to ${number}.`
    );

/**
 * Determines if a value is a positive integer.
 */
const isPositiveInteger = CreateFn(
    (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) >= 0,
    "Expected a positive integer."
);

/**
 * Determines if a value is a positive integer and not 0.
 */
const isPositiveNonZeroInteger = CreateFn(
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
    return CreateFn(
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
function isPositive(self: unknown): boolean {
    return Number.isFinite(self) && (self as number) >= 0;
}

/**
 * Determines if a value is a positive number and non-zero.
 */
function isPositiveNonZero(self: unknown): boolean {
    return Number.isFinite(self) && (self as number) > 0;
}

/**
 * Takes a list of items and returns a function that checks if a provided value is inside that array.
 * @param values The list of items to check against. This is a rest parameter.
 */
function isIn(...values: unknown[]): ValidationFunction {
    if (Array.isArray(values[0]) && values.length === 1) {
        values = [...values[0]];
    }

    return (self: unknown): boolean => values.includes(self);
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
};

export default PrudenceStatic;
