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

test("distributes remainder cents so an uneven split sums to the amount", () => {
  const shares = split(100, 3);
  assert.deepEqual(shares, [33.34, 33.33, 33.33]);
  assert.equal(Math.round(shares.reduce((sum, s) => sum + s, 0) * 100), 10000);
});

test("shares of an uneven split differ by at most one cent", () => {
  for (const [amount, people] of [
    [100, 3],
    [89.97, 7],
    [0.02, 3],
    [10, 6],
  ]) {
    const cents = split(amount, people).map((s) => Math.round(s * 100));
    assert.equal(
      cents.reduce((sum, c) => sum + c, 0),
      Math.round(amount * 100),
      `${amount} among ${people} must sum to the amount`,
    );
    assert.ok(
      Math.max(...cents) - Math.min(...cents) <= 1,
      `${amount} among ${people} must not spread shares by more than a cent`,
    );
  }
});
