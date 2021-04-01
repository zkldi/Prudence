const { describe, it } = require("mocha");
const expect = require("unexpected");
const Prudence = require("../js/main").default;
// hey, isn't this ironic!

describe("Prudence Assertion Tests", () => {
    it("Should not throw on valid input", () => {
        Prudence.assert({ foo: "hello" }, { foo: "string" });
    });

    it("Should throw on invalid input", () => {
        expect(() => Prudence.assert({ foo: 123 }, { foo: "string" }), "to throw");
    });
});
