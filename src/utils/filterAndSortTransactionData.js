/**
 * Filters and sorts transaction data based on date range or last-3-month logic.
 *
 * @function filterAndSortTransactionData
 * @param {Array<Object>} data
 *   The list of transaction objects. Each item should contain a `date` field
 *   in a format recognizable by the JavaScript `Date` constructor.
 *
 * @param {string|null} fromDate
 *   The start date for filtering (only used when `applyFilter = true`).
 *   Must be a valid date string (e.g., "2025-01-10").
 *   If null or invalid and applyFilter = true → returns an empty array.
 *
 * @param {string|null} toDate
 *   The end date for filtering (only used when `applyFilter = true`).
 *   Must be a valid date string.
 *   If null or invalid and applyFilter = true → returns an empty array.
 *
 * @param {boolean} applyFilter
 *   If true → filter data strictly between `fromDate` and `toDate` (inclusive).
 *   If false → automatically filter transactions from **today to the last 3 months**.
 *
 * @returns {Array<Object>}
 *   A new array containing filtered and sorted transactions.
 *   Sorted by date in **descending order** (latest first).
 *   Returns an empty array if:
 *     - data is not an array
 *     - no items match the filter
 *     - invalid date range
 *     - missing/invalid dates in items
 */

export const filterAndSortTransactionData = (
  data,
  fromDate,
  toDate,
  applyFilter
) => {
  if (!Array.isArray(data)) return [];

  const today = new Date();

  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;

  if (applyFilter) {
    if (!from || !to || isNaN(from) || isNaN(to)) return [];

    if (from > to) return [];
  }

  const filtered = data
    .filter((t) => t?.date)
    .filter((t) => {
      const dateObj = new Date(t.date);
      if (isNaN(dateObj)) return false;

      if (!applyFilter) {
        const diff =
          (today.getFullYear() - dateObj.getFullYear()) * 12 +
          (today.getMonth() - dateObj.getMonth());

        return diff < 3 && diff >= 0;
      }

      return dateObj >= from && dateObj <= to;
    });

  if (filtered.length === 0) return [];

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
};
