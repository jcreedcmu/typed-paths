How run?
-----

`npm install && npm start`

What is?
-----

Some experiments with the ergonomics of [typescript](https://www.typescriptlang.org/) and [immutablejs](https://facebook.github.io/immutable-js/).

[Akiva](https://github.com/aleffert) pointed me at [lenticular.ts](https://github.com/tomasdeml/lenticular.ts), which has the clever idea of using function literals to trick the typechecker into understanding paths from a record-of-records into one of its leaves, and then extracting the first-class path data by stringifying the function and regexing it apart.

I thought it would be fun to try using `Proxy` instead, to intercept the `get`s and build up the path that way.

Plus there's some phantom-type-esque shenanigans going on to pretend that
* `Immutable<T>` is the abstract type of what you get out of throwing something of type `T` into immutablejs's `fromJS`. I used [mapped types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) to sneakily ensure that `Immutable<string> = string` and `Immutable<number> = number`.
* `Path<T, U>` is a first-class bit of data that projects from type `T` (for example `{a: {b: {c: number}}`) to one of its subfields (for example `{c: number}`) but its runtime representation is actually a list of keys, e.g. `['a', 'b']`.
