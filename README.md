Kill mutations that affect code matching a set of regex patterns.

This is more of a proof of concept than a long term solution. A basic usage is to stop trivial mutations to strings in places like `console.log`.

There are other cases where a bit of code has some internal invariant that it is designed to uphold. If this is watertight enough, there may not be a practical way to write a test that exercises this fact enough to kill certain mutations. For these cases, I've been experimenting with adding an assert function that throws an error when the invariant is not upheld.

```ts
export function invariant(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}
```

These can be removed as part of the production build.

## Example Config

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
