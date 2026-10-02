import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(new URL("../bin/split.js", import.meta.url));

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8" });
}

test("--help prints usage to stdout and exits 0", () => {
  const result = runCli(["--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /usage: split <amount> <people>/);
  assert.match(result.stdout, /example: split 89\.97 3/);
  assert.equal(result.stderr, "");
});

test("-h prints usage to stdout and exits 0", () => {
  const result = runCli(["-h"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /usage: split <amount> <people>/);
  assert.match(result.stdout, /example: split 89\.97 3/);
  assert.equal(result.stderr, "");
});

test("--help as first argument wins over trailing args, no stack trace", () => {
  const result = runCli(["--help", "invalid", "extra"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /usage: split <amount> <people>/);
  assert.match(result.stdout, /example: split 89\.97 3/);
  assert.equal(result.stderr, "");
  assert.doesNotMatch(result.stderr, /RangeError|at /);
});

test("no arguments keeps the usage error on stderr with exit 2", () => {
  const result = runCli([]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /usage: split <amount> <people>/);
  assert.match(result.stderr, /example: split 89\.97 3/);
  assert.equal(result.stdout, "");
});

test("valid invocation prints three shares and the total", () => {
  const result = runCli(["90", "3"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /person 1: \$30\.00/);
  assert.match(result.stdout, /person 2: \$30\.00/);
  assert.match(result.stdout, /person 3: \$30\.00/);
  assert.match(result.stdout, /total: {4}\$90\.00/);
});
