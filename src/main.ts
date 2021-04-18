import { Validator, ValidateMain } from "./validator";
import PrudenceStatic from "./static";
import * as PrudenceUtil from "./util";
import { PrudenceSchema, ErrorMessages, PrudenceOptions, PrudenceReturn } from "./types";
import { assert } from "./assert";

interface APIFunctionSelf {
    (
        object: Record<string, unknown> | unknown,
        schema: PrudenceSchema,
        errorMessages?: ErrorMessages,
        options?: Partial<PrudenceOptions>
    ): PrudenceReturn;
}

type PrudenceStatic = typeof PrudenceStatic;

type PrudenceUtil = typeof PrudenceUtil;

interface PrudenceAPIStatic extends PrudenceStatic, PrudenceUtil {
    // Todo: understand why/how this works?
    Validator: typeof Validator;
    assert: typeof assert;
}

type PrudenceAPI = APIFunctionSelf & PrudenceAPIStatic;

const FunctionAPI: APIFunctionSelf = ValidateMain;

const StaticAPI = {
    Validator,
    ...PrudenceUtil,
    ...PrudenceStatic,
    assert,
};

const Prudence: PrudenceAPI = Object.assign(FunctionAPI, StaticAPI);

export default Prudence;

export * from "./types";
