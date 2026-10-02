import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(new URL("../bin/split.js", import.meta.url));

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8" });
}

test("exits 2 with usage when arguments are missing", () => {
  const result = runCli([]);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /usage: split <amount> <people>/);
  assert.match(result.stderr, /example: split 89\.97 3/);
});

test("exits 2 with a diagnostic for a non-numeric amount", () => {
  const result = runCli(["nope", "3"]);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /amount must be a non-negative number/);
  assert.match(result.stderr, /usage: split <amount> <people>/);
  assert.match(result.stderr, /example: split 89\.97 3/);
  assert.doesNotMatch(result.stderr, /\n\s+at /);
});

test("exits 2 with a diagnostic for zero people", () => {
  const result = runCli(["10", "0"]);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /people must be a positive integer/);
  assert.match(result.stderr, /usage: split <amount> <people>/);
  assert.match(result.stderr, /example: split 89\.97 3/);
  assert.doesNotMatch(result.stderr, /\n\s+at /);
});

test("prints shares and total for a valid split", () => {
  const result = runCli(["10", "2"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, "person 1: $5.00\nperson 2: $5.00\ntotal:    $10.00\n");
});
