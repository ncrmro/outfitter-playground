#!/usr/bin/env node
import { split, formatDollars } from "../src/split.js";

const [amountArg, peopleArg] = process.argv.slice(2);
if (amountArg === undefined || peopleArg === undefined) {
  console.error("usage: split <amount> <people>");
  console.error("example: split 89.97 3");
  process.exit(2);
}

let shares;
try {
  shares = split(Number(amountArg), Number(peopleArg));
} catch (error) {
  if (!(error instanceof RangeError)) {
    throw error;
  }
  console.error(`split: ${error.message}`);
  console.error("usage: split <amount> <people>");
  console.error("example: split 89.97 3");
  process.exit(2);
}

shares.forEach((share, i) => {
  console.log(`person ${i + 1}: ${formatDollars(share)}`);
});
const total = shares.reduce((sum, share) => sum + share, 0);
console.log(`total:    ${formatDollars(total)}`);
