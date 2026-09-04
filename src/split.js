/**
 * Split an amount of money among a number of people.
 *
 * The shares always sum to the amount. When the cents do not divide
 * evenly, the first shares are one cent larger, so no two shares differ
 * by more than one cent.
 *
 * @param {number} amount - total to split, in dollars (e.g. 100 or 89.97)
 * @param {number} people - how many people share the bill
 * @returns {number[]} one share per person, in dollars
 */
export function split(amount, people) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError(`amount must be a non-negative number, got ${amount}`);
  }
  if (!Number.isInteger(people) || people < 1) {
    throw new RangeError(`people must be a positive integer, got ${people}`);
  }
  const cents = Math.round(amount * 100);
  const base = Math.floor(cents / people);
  const remainder = cents - base * people;
  // The first `remainder` people pay one extra cent so no cent is lost.
  return Array.from(
    { length: people },
    (_, i) => (base + (i < remainder ? 1 : 0)) / 100,
  );
}

/** Format a dollar value for display. */
export function formatDollars(value) {
  return `$${value.toFixed(2)}`;
}
