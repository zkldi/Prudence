# Prudence (Logo here, please)

The simple JS object validator.

## Motivation

Validating non-primitive input is a pain, and I found myself rewriting input validation a
lot of the time.

Existing solutions didn't really appeal to me, especially ones that defined their own complicated schema
format to do things instead of using functions.

In constrast, Prudence uses the schema such that it's identical to the structure of an expected object.
Prudence also only two options for validation, a typeof check or a provided function predicate.

## Returns

Returning values from Prudence proved to be a bit of a pain. The initial approach was just to return a boolean, because it results in things like:
```js
if (!Prudence(/* */)) { }
```
which is rather intuitive.

However, additional complexity is added when we want to return error messages.
I've decided to go for C style; return null on success, and an error message on failure, as follows:
```
let err = Prudence(/* */);
if (err) {}
```

## Strings

If the value in a schema is a string, the `typeof` the provided value is compared to the given one.

```js
import Prudence from "prudence";

let schema = {
  username: "string",
  rememberMe: "boolean"
}

// err is null
let err = Prudence({
  username: "zkldi",
  rememberMe: true
}, schema);
```

**Warning**: For usability reasons, `"object"` explicitly does not validate null, instead, `"null"` should be used.

## Functions

If the value in a schema is a function, Prudence will evaluate the function giving up to two arguments.

The first argument is the value the user provided. The second argument is the parenting object, This can be used to reflect
into the provided object.

```js
let schema = {
  username: "string",
  rememberMe: "boolean",
  age: (self) => self > 18
}

// valid
Prudence({
  username: "zkldi",
  rememberMe: true,
  age: 19
}, schema);

// invalid
Prudence({
  username: "zkldi",
  rememberMe: true,
  age: 17
}, schema);
```

An example for the use of the second argument would be something that depends on another property:
```js
let schema = {
  eventStartTime: "number",
  eventEndTime: (self, parent) => Number.isNumber(self) && parent.eventStartTime < self
}

// Number.isNumber(self) is used because "5" < 10 is true
```
which would ensure that the provided endTime was greater than the provided startTime.

## Nested Schemas

If a value inside a schema is an object, it is treated as a schema inside a schema, and is validated identically.

```js
let schema = {
  name: "string",
  permissions: {
    moderator: "boolean",
    admin: "boolean"
  }
}

// valid
Prudence({
  name: "zkldi",
  permissions: {
    moderator: false,
    admin: false
  }
}, schema);
```

You can nest schemas as much as you want - **the structure of the schema is always identical to the object it validates**.

## Arrays

If a value inside a schema is a single-element array, it expects the object to be an array that matches that single element.
```js
// literal
let schema = {
  name: "string",
  aliases: ["string"]
}

// valid
Prudence({
  name: "zkldi",
  aliases: ["foo", "bar"]
}, schema);

// function
let fnSchema = {
  name: "string",
  friendIDs: [Number.isSafeInteger]
}

// valid
Prudence({
  name: "zkldi",
  friendIDs: [12,13,14]
}, fnSchema);

let objSchema = {
  name: "string",
  groupchats: [{
    name: "string",
    members: [Number.isSafeInteger]
  }]
}

// valid
Prudence({
  name: "zkldi",
  groupchats: [
    {
        name: "Friends",
        members: [13, 14, 15],
    },
    {
        name: "Family",
        members: [161, 16, 17],
    },
],
}, fnSchema);
```

## Errors

Prudence automatically keeps track of where in an object an error occurs, and prefixes all error messages with [location].

It can automatically generate error messages for all scenarios except custom functions. To handle this, there are two methods you can use.

You can attach a property, ``errorMessage`` to the function you're providing.

```js
let fn = (self) => Number.isSafeInteger(self) && self > 18;
fn.errorMessage = "Age must be greater than 18.";

Prudence(
  { age: 17 },
  { age: fn }
)

// returns "[age] Age must be greater than 18. Received 17."
```

Notice how Prudence automatically prefixed the error with the location of the error, and appended what it recieved to it.

Alternatively, you can pass a third argument to prudence, the error object. This object follows an identical structure to the schema, and defines the error message
at that point.

This option takes priority over the previous option, but is generally not recommended as it's cumbersome.

They both render error messages the same way, however.

```js
Prudence(
  { age: 17 },
  { age: (self) => Number.isSafeInteger(self) && self > 18 },
  { age: "Age must be greater than 18." }
)
```

Because the former approach of creating properties and then attaching names is a bit of a pain, Prudence also comes with a utility function to quickly create them.
```js
let fn = Prudence.CreateFn((self) => Number.isSafeInteger(self) && self > 18, "Age must be greater than 18.");
```

## Static Functions

Prudence also comes with a bunch of built in functions for common validation purposes. These all come with error messages built in.

The documentation for those is unfinished, and so is the documentation for this.
