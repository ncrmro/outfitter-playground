import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const cli = (args) =>
  spawnSync(process.execPath, ["bin/split.js", ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });

const packageVersion = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;

test("--version prints the package.json version and exits 0", () => {
  const result = cli(["--version"]);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${packageVersion}\n`);
  assert.equal(result.stderr, "");
});

test("-v prints the package.json version and exits 0", () => {
  const result = cli(["-v"]);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${packageVersion}\n`);
  assert.equal(result.stderr, "");
});

test("ordinary invocation still prints per-person shares and a total", () => {
  const result = cli(["100", "3"]);
  assert.equal(result.status, 0);
  const lines = result.stdout.trimEnd().split("\n");
  assert.equal(lines.length, 4);
  for (let i = 0; i < 3; i += 1) {
    assert.match(lines[i], new RegExp(`^person ${i + 1}: \\$\\d+\\.\\d{2}$`));
  }
  assert.match(lines[3], /^total: {4}\$\d+\.\d{2}$/);
});

test("missing arguments still print usage and exit 2", () => {
  for (const args of [[], ["10"]]) {
    const result = cli(args);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /usage: split <amount> <people>/);
    assert.match(result.stderr, /example: split 89\.97 3/);
    assert.equal(result.stdout, "");
  }
});

test("a version flag with extra arguments is not a version query", () => {
  const result = cli(["--version", "2"]);
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.stdout, /^\d+\.\d+\.\d+\n$/);
});
