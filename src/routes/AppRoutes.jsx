import { Route, Routes } from "react-router-dom";
import PageNotFound from "../components/error/PageNotFound";
import Layout from "../pages/layout/Layout";
import TotalRewards from "../pages/totalRewards/TotalRewards";
import Transactions from "../pages/transactions/Transactions";
import UserMonthlyRewards from "../pages/userMonthlyRewards/UserMonthlyRewards";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<UserMonthlyRewards />} />
        <Route path="/user-monthly-rewards" element={<UserMonthlyRewards />} />
        <Route path="/total-rewards" element={<TotalRewards />} />
        <Route path="/transactions" element={<Transactions />} />
      </Route>
      {/* Catch all unmatched routes */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
