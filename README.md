# Prudence (Logo here, please)

**use `zod` instead. This library is deprecated and only really used by its author. Sorry about that.**

The simple JS object validator.

**Prudence is currently heavily in development, and should not be used in any
environment.**

**The API may (will!) suddenly change underfoot. Do not depend on this library for anything
at the moment.**

## Documentation

Read the documentation [here](https://prudence.readthedocs.io).

## Motivation

Validating non-primitive input is a pain, and I found myself rewriting input validation a
lot of the time.

Existing solutions didn't really appeal to me, especially ones that defined their own complicated schema
format to do things instead of using functions.

In constrast, Prudence uses the schema such that it's identical to the structure of an expected object.
Prudence also only two options for validation, a typeof check or a provided function predicate.

## Benefits

- Damn simple. 0 dependencies and counting.

- Primarily uses functions, which means you do not have to make pull requests for features, you can just write them
yourself.

- Schema is the exact same structure as the object, no wildcarding workarounds or weird exceptional use cases.

- Automatic high quality error messages.

- Wrote in TypeScript (tests are in JS).

## Importing
```
npm i prudence
```

```js
import { p } from "prudence"; // ES6 (preferred)
const { p } = require("prudence"); // CJS
```

## Returns

Prudence returns null on success, and an error object on failure.

```js
let err = p(/* */);
if (err) {}
```

## Example use cases

Validating non-primitive user input is the most common use for Prudence.

Here's a common use case of wanting to validate JSON input.
```js
import fs from "fs";

let userInput = JSON.parse(fs.readFileSync("config.json"));

// minimal implementation of the mocha config
let schema = {
    diff: "boolean",
    extension: ["string"],
    package: "string",
    slow: p.isPositiveInteger,
    ui: p.isIn("bdd", "tdd")
}

let err = p(userInput, schema);

if (err) {
    console.error(err);
    process.exit(1);
}
```

Prudence also comes with a built in [express](https://github.com/expressjs/express) middleware generator.

You can use this to create automatic input validation for your endpoints

```js
import express from "express";
const router = express.Router();

let schema = {
    username: "string",
    password: (self) => typeof self === "string" && self.length > 8,
    confirmPassword: (self, parent) => self === parent.password,
    rememberMe: "boolean"
}

// send the user an error message (your 400 handler here, basically).
let errorHandler = (req, res, next, errObject) => res.status(400).send(errObject.message);

router.post("/register", p.middleware(schema, errorHandler), (req, res) => {
    return res.status(200).send("registered account!");
});
```

## Static Functions

Because Prudence only has two schema validation methods, string or function, it also comes with some static functions
to help with validation.

```js
let schema = {
    age: p.isPositiveInteger,
    favouriteFruit: p.isIn("apple", "banana", "orange"),
    testScore: p.isBoundedInteger(0, 60)
    // etc.
}
```

There are a decent amount of these static functions, and you can see more of
them in the [documentation](https://prudence.readthedocs.io).
