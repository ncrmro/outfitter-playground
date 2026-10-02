# CLI examples

Runnable examples for the `split` CLI (`bin/split.js`).

## Even split

Split $100 evenly among 4 people:

```sh
node bin/split.js 100 4
```

Output:

```text
person 1: $25.00
person 2: $25.00
person 3: $25.00
person 4: $25.00
total:    $100.00
```

## Uneven splits lose cents

The repository's deliberately seeded bug is unchanged: when the cents do not
divide evenly, each share is floored and the remainder is dropped, so
`node bin/split.js 100 3` still totals $99.99. See
[docs/issues/0001-split-loses-cents.md](issues/0001-split-loses-cents.md).
