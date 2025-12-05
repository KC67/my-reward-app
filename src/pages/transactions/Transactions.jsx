/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import Table from "../../components/table/Table";
import { useDateFilter } from "../../context/DateFilterContext";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

const columns = [
  { field: "id", label: "Transaction ID", flex: 1 },
  { field: "customerName", label: "Customer Name", flex: 2 },
  { field: "date", label: "Purchase Date", flex: 1 },
  { field: "product", label: "Product Purchased", flex: 2 },
  { field: "price", label: "Price", flex: 1 },
  { field: "rewardPoints", label: "Reward Points", flex: 1 },
];

const Transactions = () => {
  const { dateRangeFilterState } = useDateFilter();
  const [data, setData] = useState([]);
  const { data: rewardsData, loading } = useFetchTransactionDetailsData(
    dateRangeFilterState.fromDate,
    dateRangeFilterState.toDate,
    dateRangeFilterState.active
  );

  useEffect(() => {
    if (!rewardsData) return;

    const totals =
      rewardsData.length === 0
        ? []
        : rewardsData.map((t) => ({
            id: t.transactionId,
            customerName: t.name,
            date: t.date,
            product: t.product,
            price: t.price,
            rewardPoints: calculateRewardPoints(t.price),
          }));
    setData(totals);
  }, [rewardsData]);

  return (
    <div className="page-container">
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
    </div>
  );
};

export default Transactions;
