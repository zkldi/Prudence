// eslint doesnt like us importing only types, so lets turn that off.
// eslint-disable-next-line import/no-unresolved
import { NextFunction, Response, Request } from "express-serve-static-core";
import Prudence from "./main";
import {
    ErrorMessages,
    MiddlewareErrorHandler,
    PrudenceMiddlewareGenWithHandler,
    PrudenceOptions,
    PrudenceReturn,
    PrudenceSchema,
    ValidationFunction,
    ValidationFunctionWithErrorMsg,
} from "./types";

/**
 * Prudence allows functions to attach the "errorHandler" property, which will be used to
 * format error messages should user input not match the given format.
 * @param fn
 * @param errHandler
 */
export function CreateFn(fn: ValidationFunction, errMsg: string): ValidationFunctionWithErrorMsg {
    let validationFn = fn as ValidationFunctionWithErrorMsg;
    validationFn.errorMessage = errMsg;
    return validationFn;
}

/**
 * Takes an error handler and returns a function that creates middlewares with it by default.
 * @param errorHandler The error handler to implicitly pass to Middleware.
 */
export function CurryMiddleware(
    errorHandler: MiddlewareErrorHandler
): PrudenceMiddlewareGenWithHandler {
    return (
        schema: PrudenceSchema,
        errorMessages: ErrorMessages = {},
        options: PrudenceOptions = Prudence.Validator.defaultOptions
    ) => Middleware(schema, errorHandler, errorMessages, options);
}

/**
 * Creates an express middleware that calls errorHandler if prudence fails to validate the input data.
 * Uses req.query if the method is a GET request, and req.body if the method is not.
 * If an error handler is not defined, it falls back to returning 400 Bad request with json { err: "error message" }.
 * @param schema The schema to use in Prudence.
 * @param errorHandler The error handler to call if validation failed.
 * @param errorMessages Prudence error messages.
 * @param options Prudence options.
 */
export function Middleware(
    schema: PrudenceSchema,
    errorHandler?: MiddlewareErrorHandler | null,
    errorMessages: ErrorMessages = {},
    options: PrudenceOptions = Prudence.Validator.defaultOptions
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        let err: PrudenceReturn = null;

        if (req.method === "GET") {
            err = Prudence(req.query, schema, errorMessages, options);
        } else {
            err = Prudence(req.query, schema, errorMessages, options);
        }

        if (!err) {
            return next();
        }

        if (errorHandler) {
            return errorHandler(req, res, next, err);
        }

        res.status(400).json({
            err,
        });
    };
}
