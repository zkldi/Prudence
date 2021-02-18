import { ValidationFunction } from "../../src/types";
import { CreateValidationFunction } from "../util";

/**
 * Alias for Number.isSafeInteger
 */
const isInteger = CreateValidationFunction(
    (self: unknown): boolean => Number.isSafeInteger(self),
    "Expected an integer."
);

/**
 * Determines if a value is a positive integer.
 */
const isPositiveInteger = CreateValidationFunction(
    (self: unknown): boolean => Number.isSafeInteger(self) && (self as number) >= 0,
    "Expected a positive integer."
);

/**
 * Determines if a value is a positive integer and not 0.
 */
const isPositiveNonZeroInteger = CreateValidationFunction(
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
    return CreateValidationFunction(
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
};

export default PrudenceStatic;
