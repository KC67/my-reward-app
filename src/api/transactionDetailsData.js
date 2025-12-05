import { useMemo } from "react";
import useFetchData from "../hooks/useFetchData";
import { filterAndSortTransactionData } from "../utils/filterAndSortTransactionData";

export const apiURL =
  "https://6915d19e465a9144626db46a.mockapi.io/api/v1/rewards/allTransactions";

export function useFetchTransactionDetailsData(fromDate, toDate, applyFilter) {
  const { data, loading } = useFetchData(apiURL);

  const processedData = useMemo(() => {
    return filterAndSortTransactionData(data, fromDate, toDate, applyFilter);
  }, [data, fromDate, toDate, applyFilter]);

  return { data: processedData, loading };
}
