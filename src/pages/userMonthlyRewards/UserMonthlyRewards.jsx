/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import Table from "../../components/table/Table";
import { useDateFilter } from "../../context/DateFilterContext";
import { calculateMonthwiseRewards } from "../../utils/calculateMonthwiseRewards";

const columns = [
  { field: "customerId", label: "Customer Id", flex: 1 },
  { field: "name", label: "Customer Name", flex: 2 },
  { field: "month", label: "Month", flex: 1 },
  { field: "year", label: "Year", flex: 1 },
  { field: "rewardPoints", label: "Reward Points", flex: 2 },
];

const UserMonthlyRewards = () => {
  const { dateRangeFilterState } = useDateFilter();
  const [data, setData] = useState([]);
  const { data: rewardsData, loading } = useFetchTransactionDetailsData(
    dateRangeFilterState.fromDate,
    dateRangeFilterState.toDate,
    dateRangeFilterState.active
  );

  useEffect(() => {
    if (!rewardsData) return;

    const monthlyRewards =
      rewardsData.length === 0 ? [] : calculateMonthwiseRewards(rewardsData);
    setData(monthlyRewards);
  }, [rewardsData]);

  return (
    <div className="page-container">
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
    </div>
  );
};

export default UserMonthlyRewards;
