/**
 * Calculates reward points for a single transaction based on its price.
 *
 * Reward Rules:
 * - For every dollar spent over $100, earn 2 points per dollar plus a base 50 points.
 * - For every dollar spent between $50 and $100, earn 1 point per dollar over $50.
 * - For amounts less than $50, earn 0 points.
 *
 * Edge cases:
 * - Non-numeric or negative prices are treated as 0.
 *
 * @param {number} price - The price of the transaction
 * @returns {number} - The total reward points earned for this transaction
 *
 * @example
 * calculateRewardPoints(120); // returns 90 (50 + (120-100)*2)
 * calculateRewardPoints(75);  // returns 25 (75-50)
 * calculateRewardPoints(40);  // returns 0
 */
export const calculateRewardPoints = (price) => {
  const amount = typeof price === "number" && !isNaN(price) && price > 0 ? Math.floor(price) : 0;

  if (amount >= 100) {
    return 50 + (amount - 100) * 2;
  }
  if (amount >= 50) {
    return amount - 50;
  }
  return 0;
};
