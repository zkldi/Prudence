// Not to be confused with utils.js, which contains utility functions
// for testing.

// These are tests for util.ts

const { describe, it } = require("mocha");
const expect = require("unexpected");
const Prudence = require("../js/main").default;

describe("Prudence Utility Tests", () => {
    describe("#Middleware", () => {
        let schema = {
            username: "string",
        };

        it("Should return a function with arity 3", () => {
            expect(Prudence.Middleware(schema), "to have arity", 3);
        });

        let mw = Prudence.Middleware(schema);

        it("Should validate req.query for valid GET requests", () => {
            let req = {
                method: "GET",
                query: {
                    username: "foo",
                },
            };

            expect((next) => mw(req, null, next), "to call the callback without error");
        });

        it("Should invalidate req.query for invalid GET requests", () => {
            let req = {
                method: "GET",
                query: {
                    username: ["foo"], // this is possible
                },
            };

            expect(
                (cb) => Prudence.Middleware(schema, cb)(req, null, null),
                "to call the callback"
            );
        });

        it("Should validate req.body for valid non-GET requests", () => {
            let req = {
                method: "POST",
                body: {
                    username: "foo",
                },
            };

            expect((next) => mw(req, null, next), "to call the callback without error");
        });

        it("Should invalidate req.body for invalid non-GET requests", () => {
            let req = {
                method: "POST",
                body: {
                    username: 123,
                },
            };

            expect(
                (cb) => Prudence.Middleware(schema, cb)(req, null, null),
                "to call the callback"
            );
        });

        it("Should return the default JSON error if no error handler is present", () => {
            let req = {
                method: "POST",
                body: {
                    username: 123,
                },
            };

            // do you know how difficult this is to test

            let helpMeImTrappedInACallbackFactory = (cb) => ({
                status: () => ({ json: cb }),
            });

            expect(
                (cb) => mw(req, helpMeImTrappedInACallbackFactory(cb), null),
                "to call the callback"
            );
        });
    });

    describe("#CurryMiddleware", () => {
        let schema = {
            username: "string",
        };

        let errorHandler = () => true;

        it("Should return a function with arity 1", () => {
            expect(Prudence.CurryMiddleware(errorHandler), "to have arity", 1);
        });

        it("Should return a function that returns a function with arity 3", () => {
            expect(Prudence.CurryMiddleware(errorHandler)(schema), "to have arity", 3);
        });

        it("Should call the curried errorHandler on error", () => {
            let req = {
                method: "GET",
                query: {
                    username: ["foo"],
                },
            };

            expect((cb) => Prudence.CurryMiddleware(cb)(schema)(req), "to have arity", 1);
        });
    });
});
