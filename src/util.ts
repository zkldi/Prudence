// eslint doesnt like us importing only types, so lets turn that off.
// eslint-disable-next-line import/no-unresolved
import type { NextFunction, Response, Request, RequestHandler } from "express-serve-static-core";
import Prudence from "./main";
import {
    ErrorMessages,
    MiddlewareErrorHandler,
    PrudenceMiddlewareGenWithHandler,
    PrudenceOptions,
    PrudenceReturn,
    PrudenceSchema,
    ValidationFunction,
} from "./types";

/**
 * Attaches an error message to the function by returning the second argument on false.
 * This is syntactic sugar for a validation function that returns a string.
 * @param fn
 * @param errMessage
 */
export function AttachErrMsg(fn: ValidationFunction, errMsg: string): ValidationFunction {
    return (
        self: unknown,
        parent: Record<string, unknown>,
        options: PrudenceOptions,
        keychain: string[]
    ) => {
        let result = fn(self, parent, options, keychain);

        if (typeof result === "string") {
            return result;
        }

        if (result === false) {
            return errMsg;
        }

        return true;
    };
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
        options: Partial<PrudenceOptions> = Prudence.Validator.defaultOptions
    ): RequestHandler => Middleware(schema, errorHandler, errorMessages, options);
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
    options: Partial<PrudenceOptions> = Prudence.Validator.defaultOptions
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        let err: PrudenceReturn = null;

        if (req.method === "GET") {
            err = Prudence(req.query, schema, errorMessages, options);
        } else {
            err = Prudence(req.body, schema, errorMessages, options);
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
