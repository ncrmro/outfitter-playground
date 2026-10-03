#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { split, formatDollars } from "../src/split.js";

const args = process.argv.slice(2);
if (args.length === 1 && (args[0] === "--version" || args[0] === "-v")) {
  const { version } = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  console.log(version);
  process.exit(0);
}

const [amountArg, peopleArg] = args;
if (amountArg === undefined || peopleArg === undefined) {
  console.error("usage: split <amount> <people>");
  console.error("example: split 89.97 3");
  process.exit(2);
}

const shares = split(Number(amountArg), Number(peopleArg));
shares.forEach((share, i) => {
  console.log(`person ${i + 1}: ${formatDollars(share)}`);
});
const total = shares.reduce((sum, share) => sum + share, 0);
console.log(`total:    ${formatDollars(total)}`);
