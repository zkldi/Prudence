import {
    CustomErrorHandler,
    ValidationFunction,
    ValidationFunctionWithErrorHandler,
} from "./types";

/**
 * Prudence allows functions to attach the "errorHandler" property, which will be used to
 * format error messages should user input not match the given format.
 * @param fn
 * @param errHandler
 */
export function CreateValidationFunction(
    fn: ValidationFunction,
    errHandler: CustomErrorHandler
): ValidationFunctionWithErrorHandler {
    let validationFn = fn as ValidationFunctionWithErrorHandler;
    validationFn.errorHandler = errHandler;
    return validationFn;
}
