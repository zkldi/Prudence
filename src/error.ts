export class PrudenceError extends Error {
    keychain;
    userVal;

    constructor(msg: string, keychain: string | null, userVal: unknown) {
        super();
        this.message = msg;
        this.keychain = keychain;
        this.userVal = userVal;
    }
}
