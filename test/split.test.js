import { test } from "node:test";
import assert from "node:assert/strict";
import { split, formatDollars } from "../src/split.js";

test("splits an even amount equally", () => {
  assert.deepEqual(split(90, 3), [30, 30, 30]);
});

test("splits between two people", () => {
  assert.deepEqual(split(25.5, 2), [12.75, 12.75]);
});

test("one person pays the whole bill", () => {
  assert.deepEqual(split(42.42, 1), [42.42]);
});

test("distributes remainder cents so shares sum to the amount", () => {
  assert.deepEqual(split(100, 3), [33.34, 33.33, 33.33]);
});

test("shares always sum to the amount", () => {
  const cases = [
    [100, 3, [33.34, 33.33, 33.33]],
    [0.01, 3, [0.01, 0, 0]],
    [89.97, 7, [12.86, 12.86, 12.85, 12.85, 12.85, 12.85, 12.85]],
    [0.05, 4, [0.02, 0.01, 0.01, 0.01]],
    [19.99, 6, [3.34, 3.33, 3.33, 3.33, 3.33, 3.33]],
  ];
  for (const [amount, people, expected] of cases) {
    assert.deepEqual(split(amount, people), expected, `${amount} / ${people}`);
  }
});

test("no share differs by more than one cent", () => {
  const shares = split(0.05, 4);
  const cents = shares.map((s) => Math.round(s * 100));
  assert.equal(Math.max(...cents) - Math.min(...cents), 1);
});

test("rejects a negative amount", () => {
  assert.throws(() => split(-5, 2), RangeError);
});

test("rejects a non-integer number of people", () => {
  assert.throws(() => split(10, 2.5), RangeError);
  assert.throws(() => split(10, 0), RangeError);
});

test("formats dollars with two decimals", () => {
  assert.equal(formatDollars(12.5), "$12.50");
});
