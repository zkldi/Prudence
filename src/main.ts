import { Validator, ValidateMain } from "./validator";
import PrudenceStatic from "./static/main";
import { CreateFn } from "./util";
import { PrudenceSchema, ErrorMessages, PrudenceOptions, PrudenceReturn } from "./types";

interface APIFunctionSelf {
    (
        object: Record<string, unknown>,
        schema: PrudenceSchema,
        errorMessages: ErrorMessages,
        options?: PrudenceOptions
    ): PrudenceReturn;
}

type PrudenceStatic = typeof PrudenceStatic;

interface PrudenceAPIStatic extends PrudenceStatic {
    // Todo: understand why/how this works?
    Validator: typeof Validator;
}

type PrudenceAPI = APIFunctionSelf & PrudenceAPIStatic;

const FunctionAPI: APIFunctionSelf = ValidateMain;

const StaticAPI = {
    Validator,
    CreateFn,
    ...PrudenceStatic,
};

const Prudence: PrudenceAPI = Object.assign(FunctionAPI, StaticAPI);

export default Prudence;
