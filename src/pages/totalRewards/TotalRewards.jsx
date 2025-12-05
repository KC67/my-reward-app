/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import Table from "../../components/table/Table";
import { useDateFilter } from "../../context/DateFilterContext";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

const columns = [
  { field: "customerName", label: "Customer Name", flex: 1 },
  { field: "rewardPoints", label: "Reward Points", flex: 1 },
];

const TotalRewards = () => {
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
        : Object.values(
            rewardsData
              .map((t) => ({
                customerName: t.name,
                rewardPoints: calculateRewardPoints(t.price),
              }))
              .reduce((acc, curr) => {
                acc[curr.customerName] = acc[curr.customerName]
                  ? {
                      ...curr,
                      rewardPoints:
                        acc[curr.customerName].rewardPoints + curr.rewardPoints,
                    }
                  : curr;
                return acc;
              }, {})
          );
    setData(totals);
  }, [rewardsData]);

  return (
    <div className="page-container">
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
    </div>
  );
};

export default TotalRewards;
