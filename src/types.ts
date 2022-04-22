// eslint doesnt like us importing only types, so lets turn that off.
// eslint-disable-next-line import/no-unresolved
import type { NextFunction, Request, RequestHandler, Response } from "express-serve-static-core";
import type { PrudenceError } from "./error";

export interface PrudenceOptions {
    /**
     * Allows objects to have excess keys versus the schema, such as { foo: 1, bar: 1} being valid to: { foo: "number" }.
     * Default: false.
     */
    allowExcessKeys: boolean;
    /**
     * Whether or whether not passing a non-object to prudence is a thrown error.
     * Default: true.
     */
    throwOnNonObject: boolean;
}

export interface ErrMessageFormatter {
    (msg: string, strKeyChain: string, recieved: unknown): string;
}

export interface CustomErrorFunction {
    (value: unknown, keyLocation?: string): string;
}

export interface PrudenceMiddlewareGenWithHandler {
    (
        schema: PrudenceSchema,
        errorMessages?: ErrorMessages,
        options?: Partial<PrudenceOptions>
    ): RequestHandler;
}

export interface PrudenceMiddlewareGen {
    (
        schema: PrudenceSchema,
        errorHandler?: MiddlewareErrorHandler | null,
        errorMessages?: ErrorMessages,
        options?: Partial<PrudenceOptions>
    ): RequestHandler;
}

export interface MiddlewareErrorHandler {
    (req: Request, res: Response, next: NextFunction, errorMessage: PrudenceError): void;
}

export type ErrorMessages = { [prop: string]: string | ErrorMessages };

export type PrudenceSchema = {
    [prop: string]: ValidSchemaValue
};

export type ValidSchemaValue = ValidationFunction | string | [ValidationFunction] | [string] | PrudenceSchema | [PrudenceSchema];

export interface ValidationFunctionParentOptionsKeychain {
    (
        self: unknown,
        parent: Record<string, unknown>,
        prudenceOptions: PrudenceOptions,
        keyChain: string[]
    ): boolean | string | PrudenceError;
}

export type ValidationFunction = ValidationFunctionParentOptionsKeychain;

export type PrudenceReturn = null | PrudenceError;

export * from "./error";