Kill mutations that affect code matching a set of regex patterns.

This is more of a proof of concept than a long term solution. A basic usage is to stop trivial mutations to strings in places like `console.log`.

There are other cases where a bit of code is designed to uphold some internal invariant. If watertight enough, there may not be a practical way to write a test that exercises this goal enough to kill certain mutations. For these cases, I've been experimenting with adding internal assert functions that throw an error when the invariant is not upheld.

```ts
export function invariant(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}
```

These can be removed as part of the production build.

## Install / Example Config

```sh
# Or npm/yarn/etc...
$ pnpm install -D stryker-ignore-pattern
```

In your [Stryker config file](https://stryker-mutator.io/docs/stryker-js/config-file):

```js
{
    ...
    checkers: ["ignore"],
    plugins: ["stryker-ignore-pattern"],
    ignorePatterns: [
        // This horrible pattern gives us limited nesting support https://stackoverflow.com/a/35271017
        "invariant?\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)",
        'process\\.env\\.NODE_ENV !== "production"',
        "console\\.(log|warn|error)\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)",
    ],
}
```

## Why are you worried about 100% coverage/dead mutations?

It is generally sound advice to not focus on 100% coverage metrics. This is especially true when introducing something like mutation testing to an existing codebase where 80% of the benefit may come from the first 20% of the effort.

Using ignore patterns to increase "coverage" is a bit cheap and risky, but so is accepting an arbitrary <100% coverage result and just manually "ignoring" a set of failures (or letting the number rise). My preference is to treat the 100% as `passed + acknowledged`. Ideally these numbers could be tracked seperately, but we can only do so much.
