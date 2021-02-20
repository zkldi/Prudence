import { Validator, ValidateMain } from "./validator";
import PrudenceStatic from "./static";
import * as PrudenceUtil from "./util";
import { PrudenceSchema, ErrorMessages, PrudenceOptions, PrudenceReturn } from "./types";

interface APIFunctionSelf {
    (
        object: Record<string, unknown>,
        schema: PrudenceSchema,
        errorMessages?: ErrorMessages,
        options?: PrudenceOptions
    ): PrudenceReturn;
}

type PrudenceStatic = typeof PrudenceStatic;

type PrudenceUtil = typeof PrudenceUtil;

interface PrudenceAPIStatic extends PrudenceStatic, PrudenceUtil {
    // Todo: understand why/how this works?
    Validator: typeof Validator;
}

type PrudenceAPI = APIFunctionSelf & PrudenceAPIStatic;

const FunctionAPI: APIFunctionSelf = ValidateMain;

const StaticAPI = {
    Validator,
    ...PrudenceUtil,
    ...PrudenceStatic,
};

const Prudence: PrudenceAPI = Object.assign(FunctionAPI, StaticAPI);

export default Prudence;
