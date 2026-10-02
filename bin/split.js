#!/usr/bin/env node
import { split, formatDollars } from "../src/split.js";

const usageLines = ["usage: split <amount> <people>", "example: split 89.97 3"];

// Help is recognized only when it is the first argument.
if (process.argv[2] === "--help" || process.argv[2] === "-h") {
  console.log(usageLines[0]);
  console.log(usageLines[1]);
  process.exit(0);
}

const [amountArg, peopleArg] = process.argv.slice(2);
if (amountArg === undefined || peopleArg === undefined) {
  console.error(usageLines[0]);
  console.error(usageLines[1]);
  process.exit(2);
}

const shares = split(Number(amountArg), Number(peopleArg));
shares.forEach((share, i) => {
  console.log(`person ${i + 1}: ${formatDollars(share)}`);
});
const total = shares.reduce((sum, share) => sum + share, 0);
console.log(`total:    ${formatDollars(total)}`);
