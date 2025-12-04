import { useMemo } from "react";
import useFetchData from "../hooks/useFetchData";

export const apiURL =
  "https://6915d19e465a9144626db46a.mockapi.io/api/v1/rewards/allTransactions";

export function useFetchTransactionDetailsData(fromDate, toDate, applyFilter) {
  const { data, loading } = useFetchData(apiURL);

  const processedData = useMemo(() => {
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
  }, [data, fromDate, toDate, applyFilter]);

  return { data: processedData, loading };
}
