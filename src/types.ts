// We declare a lot of our types globally because this is a small package
// and it doesn't really matter that much.
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

export interface CustomErrorFunction {
    (value: unknown, keyLocation?: string): string;
}

export type CustomErrorHandler = CustomErrorFunction | string;

export interface PrudenceSuccessfulReturn {
    valid: true;
}

export interface PrudenceErrorReturn {
    valid: false;
    err: string;
}

export type ErrorMessages = { [prop: string]: CustomErrorHandler | ErrorMessages };

export type PrudenceSchema = { [prop: string]: ValidSchemaValue | PrudenceSchema };

export type ValidSchemaValue = ValidationFunction | string;

export interface ValidationFunction {
    (self: unknown, parent?: Record<string, unknown> | unknown[]): boolean;
}

export interface ValidationFunctionWithErrorHandler extends ValidationFunction {
    errorHandler: CustomErrorHandler;
}

export type PrudenceReturn = PrudenceErrorReturn | PrudenceSuccessfulReturn;
