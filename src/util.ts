// eslint doesnt like us importing only types, so lets turn that off.
// eslint-disable-next-line import/no-unresolved
import { NextFunction, Response, Request } from "express-serve-static-core";
import Prudence from "./main";
import {
    CustomErrorHandler,
    ErrorMessages,
    MiddlewareErrorHandler,
    PrudenceMiddlewareGenWithHandler,
    PrudenceOptions,
    PrudenceReturn,
    PrudenceSchema,
    ValidationFunction,
    ValidationFunctionWithErrorHandler,
} from "./types";

/**
 * Prudence allows functions to attach the "errorHandler" property, which will be used to
 * format error messages should user input not match the given format.
 * @param fn
 * @param errHandler
 */
export function CreateFn(
    fn: ValidationFunction,
    errHandler: CustomErrorHandler
): ValidationFunctionWithErrorHandler {
    let validationFn = fn as ValidationFunctionWithErrorHandler;
    validationFn.errorHandler = errHandler;
    return validationFn;
}

export function CurryMiddleware(
    errorHandler: MiddlewareErrorHandler
): PrudenceMiddlewareGenWithHandler {
    return (
        schema: PrudenceSchema,
        errorMessages: ErrorMessages = {},
        options: PrudenceOptions = Prudence.Validator.defaultOptions
    ) => Middleware(schema, errorHandler, errorMessages, options);
}

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
