import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <h1>Rewards Dashboard</h1>
      <nav className="nav-container">
        <NavLink
          to="/user-monthly-rewards"
          className={({ isActive }) =>
            isActive || location.pathname === "/" ? "active-link" : "nav-link"
          }
        >
          User Monthly Rewards
        </NavLink>
        <NavLink
          to="/total-rewards"
          className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
        >
          Total Rewards
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
        >
          Transactions
        </NavLink>
      </nav>
      <Outlet /> {/* children pages render here */}
    </>
  );
};

export default Layout;
