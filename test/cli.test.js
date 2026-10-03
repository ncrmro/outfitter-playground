import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const binPath = fileURLToPath(new URL("../bin/split.js", import.meta.url));
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const usageMessage = "usage: split <amount> <people>\nexample: split 89.97 3\n";

function runCli(args) {
  return spawnSync(process.execPath, [binPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

test("--version prints the package.json version and exits 0", () => {
  const result = runCli(["--version"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, `${version}\n`);
});

test("-v prints the package.json version and exits 0", () => {
  const result = runCli(["-v"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(result.stdout, `${version}\n`);
});

test("two positional arguments still print person and total lines", () => {
  const result = runCli(["100", "3"]);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  const lines = result.stdout.trimEnd().split("\n");
  assert.equal(lines.length, 4);
  for (let i = 0; i < 3; i += 1) {
    assert.match(lines[i], new RegExp(`^person ${i + 1}: \$\\d+\\.\\d{2}$`));
  }
  assert.match(lines[3], /^total:\s+\$\d+\.\d{2}$/);
});

test("no arguments still prints usage to stderr and exits 2", () => {
  const result = runCli([]);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, usageMessage);
});

test("one non-version argument still prints usage to stderr and exits 2", () => {
  const result = runCli(["100"]);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, usageMessage);
});

test("--version with extra arguments keeps the pre-existing split crash behavior", () => {
  // Two arguments were never a usage error: the original CLI treated the
  // first as an amount and crashed on the NaN split (exit 1, RangeError).
  // The version path only triggers for exactly one --version/-v argument.
  const result = runCli(["--version", "3"]);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /RangeError/);
});
