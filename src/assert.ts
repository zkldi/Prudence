/**
 * Thin wrapper for using Prudence as an assertion library
 */

import Prudence from "./main";
import { ErrorMessages, PrudenceOptions, PrudenceSchema } from "./types";

export function assert(
    obj: Record<string, unknown> | unknown,
    schema: PrudenceSchema,
    errorMessages: ErrorMessages,
    options?: Partial<PrudenceOptions>
) {
    let err = Prudence(obj, schema, errorMessages, options);

    if (err) {
        throw err;
    }
}
