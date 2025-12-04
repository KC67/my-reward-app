import { calculateRewardPoints } from "./calculateRewardPoints";

/**
 * Calculates month-wise reward points for each customer.
 *
 * Merges multiple transactions for the same customer in the same month,
 * summing their reward points.
 *
 * Edge cases handled:
 * - Invalid or missing date → transaction skipped
 * - Invalid or missing price → rewardPoints set to 0
 * - Missing customerId or name → transaction skipped
 *
 * @param {Array<Object>} data - Array of transactions
 * @param {string|number} data[].transactionId - Unique transaction identifier
 * @param {number} data[].customerId - Customer identifier
 * @param {string} data[].name - Customer name
 * @param {string} data[].date - Transaction date (ISO string)
 * @param {number} data[].price - Transaction price
 *
 * @returns {Array<Object>} Array of objects, each representing a customer for a month
 * with total reward points:
 * [
 *   {
 *     key: string,           // unique key: "name-MMM-yyyy"
 *     customerId: number,
 *     name: string,
 *     month: string,         // short month e.g., "Jan"
 *     year: number,
 *     rewardPoints: number,  // total points for the month
 *   },
 *   ...
 * ]
 */
export const calculateMonthwiseRewards = (data) => {
  if (!Array.isArray(data)) return [];

  return Object.values(
    data
      .map((t) => {
        if (!t.name || !t.customerId) return null;

        const dateObj = new Date(t.date);
        if (isNaN(dateObj)) return null;

        const month = dateObj.toLocaleString("default", { month: "short" });
        const year = dateObj.getFullYear();
        const price =
          typeof t.price === "number" && !isNaN(t.price) ? t.price : 0;

        const key = `${t.customerId}-${month}-${year}`;

        return {
          key,
          customerId: t.customerId,
          name: t.name,
          month,
          year,
          rewardPoints: calculateRewardPoints(price),
        };
      })
      .filter(Boolean)
      .reduce((acc, curr) => {
        if (!acc[curr.key]) {
          acc[curr.key] = { ...curr };
        } else {
          acc[curr.key].rewardPoints += curr.rewardPoints;
        }
        return acc;
      }, {})
  );
};
