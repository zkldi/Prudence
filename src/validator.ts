import {
    ValidSchemaValue,
    PrudenceOptions,
    PrudenceSchema,
    PrudenceReturn,
    ErrorMessages,
    ValidationFunctionWithErrorMsg,
} from "./types";

/**
 * Compares a value against the schema.
 * @param value The value to validate.
 * @param schemaValue How the value should be validated.
 * @param object The parenting object that contained value. This is passed to custom functions as a second argument.
 */
function ValidateValue(
    value: unknown,
    schemaValue: ValidSchemaValue,
    parent: Record<string, unknown> | unknown[]
): boolean {
    if (typeof schemaValue === "string") {
        // if the string starts with ?*, the schema creator probably made a mistake.
        // warn them as such.

        if (schemaValue.startsWith("?*")) {
            throw new Error(
                `[Prudence] Invalid string schemaValue "${schemaValue}". Did you mean to start with "*?".`
            );
        }

        // if the string starts with *, this key does not have to be present.

        if (schemaValue.startsWith("*")) {
            schemaValue = schemaValue.substring(1);
            if (value === undefined) {
                return true;
            }
        }

        // if string starts with ?, typeof is also nullable.
        if (schemaValue.startsWith("?")) {
            schemaValue = schemaValue.substring(1);
            if (value === null) {
                return true;
            }
        }

        // typeof null is overrode to be "null".
        // this is consistent with the original ECMA override.
        if (schemaValue === "null") {
            return value === null;
        }

        // typeof value === "object" is an exception, since null being an object
        // is a mistake, Prudence assumes that typeof object just means any object.
        // this does NOT include null.
        // This is identical to how typescript defines an object.
        if (schemaValue === "object") {
            return !!value && typeof value === "object";
        }

        if (
            ["string", "number", "bigint", "undefined", "boolean", "symbol", "function"].includes(
                schemaValue
            )
        ) {
            return typeof value === schemaValue;
        }

        throw new Error(
            `[Prudence] Invalid string schemaValue of "${schemaValue}". This is not a valid typeof value.`
        );
    } else if (typeof schemaValue === "function") {
        return schemaValue(value, parent);
    }

    // if we've gotten here, the schema has ill-defined validation.
    throw new Error(
        `[Prudence] Unknown/unusable SchemaValue of ${schemaValue}. Please refer to the documentation.`
    );
}

/**
 * Checks if the obj given is an object.
 * This is used to determine whether the object matches the schema provided
 * in structure.
 * @param obj The object to check.
 */
function CheckObjectExists(obj: unknown): obj is Record<string, unknown> {
    return !!obj && typeof obj === "object";
}

/**
 * Traverses the schema recursively, comparing it to the object where possible.
 * RETURNS NULL ON SUCCESS, AND AN ERROR MESSAGE ON FAILURE.
 * @param object The object to validate. If the object traverses somewhere the schema is not, the function returns false.
 * @param schema The schema to validate against.
 * @param options Options for parsing.
 * @param keyChain An internal variable used as a "chain" of where in the object the parser is. This is used for error messages.
 */
function ValidateObject(
    object: Record<string, unknown> | unknown,
    schema: PrudenceSchema,
    errorMessages: ErrorMessages | unknown,
    options: PrudenceOptions,
    keyChain: string[] = []
): PrudenceReturn {
    // First, check if we're validating against an object.
    if (!CheckObjectExists(object)) {
        // if we've not even got anywhere in the keychain, we've been passed undefined or something.
        // This is probably unintentional on the consumers part, so the default is to throw an error.
        if (keyChain.length === 0) {
            if (options.throwOnNonObject) {
                throw new Error(`[Prudence] Non-object ${object} provided.`);
            }

            return `Non-object provided for validation.`;
        }

        let stringifiedKeyChain = StringifyKeyChain(keyChain);

        return `[${stringifiedKeyChain}]: Object does not match structure of schema, expected this location to have an object.`;
    }

    // We iterate over the schema's keys and use them to check against the object.
    for (const key in schema) {
        if (!Object.prototype.hasOwnProperty.call(schema, key)) {
            // skip over prototype properties.
            continue;
        }

        // update our current keychain by appending the new key to the end.
        // we instantiate it like this to create a shallow copy, so that we don't
        // screw over the other uses of keyChain.
        let currentKeyChain = [...keyChain, key];

        // Get the value at both the schema and the object of this given key.
        let schemaVal = schema[key];
        let objectVal = object[key];

        // Getting error messages is a bit of a pain. It's not an error to *not* have an error message
        // present.
        // We have this lengthy check to check if there's even an error object to access a property of here.
        // if there is, we retrieve it. If not, we just pass undefined to the error message function.
        let errorMessageVal =
            typeof errorMessages === "object" && errorMessages
                ? (errorMessages as ErrorMessages)[key]
                : undefined;

        // If the schema is an array, the first value in there is used as a validator upon an array.
        if (Array.isArray(schemaVal)) {
            if (!schemaVal[0]) {
                throw new Error(
                    `[Prudence] Invalid schema at ${StringifyKeyChain(
                        currentKeyChain
                    )}, array must have exactly one value.`
                );
            }

            // the provided object must be an array to match this.
            if (!Array.isArray(objectVal)) {
                return `[${StringifyKeyChain(currentKeyChain)}]: Value was not an array.`;
            }

            let arraySchema = schemaVal[0];

            // todo: not copy paste this for either branch.
            if (typeof arraySchema === "object" && arraySchema) {
                // if the first value in the array is an object, we traverse the objects array
                // validating every object against the schema.
                for (let i = 0; i < objectVal.length; i++) {
                    let element = objectVal[i];

                    let arrKeychain = [...currentKeyChain, i.toString()];

                    let arrayErr = ValidateObject(
                        element,
                        arraySchema as PrudenceSchema,
                        errorMessageVal,
                        options,
                        arrKeychain
                    );

                    if (arrayErr) {
                        return arrayErr;
                    }
                }
            } else {
                // if the first value in the array is not an object, we traverse the objects array
                // comparing it as an array of values.
                for (let i = 0; i < objectVal.length; i++) {
                    let element = objectVal[i];

                    let arrayValid = ValidateValue(
                        element,
                        arraySchema as ValidSchemaValue,
                        objectVal
                    );

                    if (!arrayValid) {
                        currentKeyChain.push(i.toString());

                        let errorMessage = GetErrorMessage(
                            element,
                            arraySchema,
                            currentKeyChain,
                            options,
                            errorMessageVal
                        );

                        return errorMessage;
                    }
                }
            }
        } else if (schemaVal && typeof schemaVal === "object") {
            // If what we hit is an object inside the schema, run ValidateObject recursively.
            let recursiveErr = ValidateObject(
                objectVal,
                schemaVal as PrudenceSchema,
                errorMessageVal,
                options,
                currentKeyChain
            );

            if (recursiveErr) {
                // if the recursive check failed, return the failed check to pass the error message up.
                return recursiveErr;
            }
        } else if (!ValidateValue(objectVal, schemaVal as ValidSchemaValue, object)) {
            // If what we hit wasn't an object, we can just compare what the schema expects against the object.

            let errorMessage = GetErrorMessage(
                objectVal,
                schemaVal,
                currentKeyChain,
                options,
                errorMessageVal
            );

            return errorMessage;
        }
    }

    let invalidObjKeys: Array<string> = [];

    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            continue;
        }

        if (!schema[key]) {
            invalidObjKeys.push(key);
        }
    }

    if (invalidObjKeys.length > 0) {
        let stringifiedKeyChain = StringifyKeyChain(keyChain);

        return `[${stringifiedKeyChain}]: These keys were not expected inside this object: ${invalidObjKeys.join(
            ", "
        )}.`;
    }

    return null;
}

/**
 * Determines if a function has an attached errorMessage.
 * @param fn The function to check.
 */
function FunctionHasErrorMsg(fn: unknown): fn is ValidationFunctionWithErrorMsg {
    return typeof fn === "function" && !!(fn as ValidationFunctionWithErrorMsg).errorMessage;
}

/**
 * Creates an error message.
 * @param errorMessage The error message to use.
 * @param objectVal The value we received.
 * @param stringifiedKeyChain Where the above value was sourced from as a single string.
 */
function CreateErrorMessage(
    errorMessage: string,
    objectVal: unknown,
    stringifiedKeyChain: string
): string {
    if (typeof errorMessage === "string") {
        if (errorMessage.endsWith(".")) {
            return `[${stringifiedKeyChain}]: ${errorMessage} Received ${(objectVal as string).toString()}.`;
        }

        return `[${stringifiedKeyChain}]: ${errorMessage}. Received ${(objectVal as string).toString()}.`;
    }

    throw new Error(
        `[Prudence] Invalid error message of ${errorMessage}. Error messages must be strings.`
    );
}

/**
 * Converts a keyChain array into a javascript-like single string.
 * @param keyChain The keychain to stringify.
 */
function StringifyKeyChain(keyChain: string[]): string {
    if (keyChain.length === 0) {
        return "<root level>";
    }

    let str = keyChain[0];

    if (str.includes(".")) {
        str = `["${str}"]`;
    } else if (str.match(/^[0-9]/)) {
        // if starts with a number
        str = `[${str}]`;
    }

    for (let i = 1; i < keyChain.length; i++) {
        let key = keyChain[i];

        if (key.includes(".")) {
            str += `["${key}"]`;
        } else if (key.match(/^[0-9]/)) {
            // if starts with a number
            str += `[${key}]`;
        } else {
            str += `.${key}`;
        }
    }

    return str;
}

/**
 * Attempts to resolve an error message from the parameters.
 * @param objectVal
 * @param schemaVal
 * @param keyChain
 * @param options
 * @param customErrorMessage
 */
function GetErrorMessage(
    objectVal: unknown,
    schemaVal: unknown,
    keyChain: string[],
    options: PrudenceOptions,
    customErrorMessage?: ErrorMessages | string
): string {
    let stringifiedKeyChain = StringifyKeyChain(keyChain);

    // If the consumer passes a malformed set of error messages, it's possible we might get
    // an object here instead of an error message.
    if (typeof customErrorMessage === "object") {
        throw new Error(
            `[Prudence] Invalid customError at ${stringifiedKeyChain}. Expected an error message or undefined, but got an object.`
        );
    }

    // First check:
    // Check if an attached custom error message was sent.
    if (customErrorMessage) {
        return CreateErrorMessage(customErrorMessage, objectVal, stringifiedKeyChain);
    }

    // Second check:
    // If we don't have a custom error message, check if the schema value was a function.
    // Functions are allowed to attach error messages.
    if (typeof schemaVal === "function") {
        if (FunctionHasErrorMsg(schemaVal)) {
            return CreateErrorMessage(schemaVal.errorMessage, objectVal, stringifiedKeyChain);
        }

        return `[${stringifiedKeyChain}]: The value ${(objectVal as string).toString()} was invalid, but no error message is available.`;
    }

    if (typeof schemaVal === "string") {
        if (schemaVal.startsWith("*?")) {
            return `[${stringifiedKeyChain}]: Expected typeof ${schemaVal}, null or no value.`;
        }

        if (schemaVal.startsWith("*")) {
            return `[${stringifiedKeyChain}]: Expected typeof ${schemaVal} or no value. Received ${objectVal}.`;
        }

        if (schemaVal.startsWith("?")) {
            return `[${stringifiedKeyChain}]: Expected typeof ${schemaVal} or null. Received ${objectVal}.`;
        }

        return `[${stringifiedKeyChain}]: Expected typeof ${schemaVal}. Received ${objectVal}.`;
    }

    // failsafe: realistically this will always be caught previously in
    // ValidateValue.
    throw new Error(
        `[Prudence] Invalid schema value ${(schemaVal as string).toString()} at ${stringifiedKeyChain}.`
    );
}

/**
 * The main validation function for Prudence.
 * @param object The object you want to validate.
 * @param schema The schema you wish to validate against.
 * @param errorMessages Optional: Error message declarations.
 * @param options Custom options for the validation.
 */
function ValidateMain(
    object: Record<string, unknown>,
    schema: PrudenceSchema,
    errorMessages: ErrorMessages = {},
    options: PrudenceOptions = Validator.defaultOptions
): PrudenceReturn {
    return ValidateObject(object, schema, errorMessages, options);
}

/**
 * A class for Validators. This exists so users can instantiate a version of the validator
 * with options they prefer, (instead of always having to pass them.)
 */
class Validator {
    static defaultOptions: PrudenceOptions = {
        allowExcessKeys: false,
        throwOnNonObject: true,
    };

    options = Validator.defaultOptions;

    constructor(options?: Partial<PrudenceOptions>) {
        if (!options) {
            return;
        }

        for (const o in options) {
            let opt = o as keyof PrudenceOptions;
            if (Object.hasOwnProperty.call(this.options, opt)) {
                if (typeof options[opt] !== "boolean") {
                    throw new Error(
                        `[Prudence] Invalid option value of ${options[opt]} for "${opt}", expected boolean.`
                    );
                }

                this.options[opt] = options[opt] as boolean;
            } else {
                throw new Error(
                    `[Prudence] Invalid option "${opt}" passed to Prudence constructor.`
                );
            }
        }
    }

    Validate = ValidateMain;
}

export {
    Validator,
    ValidateMain,
    ValidateValue,
    GetErrorMessage,
    StringifyKeyChain,
    CreateErrorMessage,
    FunctionHasErrorMsg,
    ValidateObject,
};
