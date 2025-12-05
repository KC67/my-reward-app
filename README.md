# Rewards Dashboard App

A **React + Vite** web application to display customer reward points, monthly rewards, total rewards, and transaction history.  
This project demonstrates **React functional components**, **custom hooks**, **React Router**, and **unit testing with Vitest**.

---

## **Features**

- **User Monthly Rewards:** Displays rewards earned by each customer, grouped month-wise.
- **Total Rewards:** Displays total reward points per customer.
- **Transactions:** Shows all transactions with reward points calculation.
- **404 Page:** Friendly page when route not found.
- **Custom Hooks:** `useFetchData` for API calls with loading and error handling.
- **Utility Functions:** `calculateRewardPoints`, `calculateMonthwiseRewards`, `customLogger`.
- **Unit Testing:** Full coverage for components, hooks, and utilities using **Vitest** and **React Testing Library**.
- **DateRangeFilter:** A reusable React `DateRangeFilter` component with global state management using DateFilterContext (Context + Reducer), supporting apply/reset actions, validation, and easy integration with tables or dashboards.
- **Table:** Reusable table component built with MUI DataGrid for easy integration and customization.

> ⚠️ **Note:** By default, The tables displays data from the last three months up to today, and updates to custom results when a date range is selected.
---

## **Tech Stack**

- React 19 + Vite
- React Router DOM v7
- JavaScript (ES6+)
- Vitest + Testing Library (unit tests)
- CSS Modules / Plain CSS
- MUI v5 (with optional icons and pickers)

---

# Running the App

## start development server
```
npm run dev
```
## or
```
yarn dev
```

# Running Unit Tests

## run all Vitest tests
```
npm run test
```
## or
```
yarn test
```

## generate coverage report
```
npm run test -- --coverage
```

# Demo

https://github.com/user-attachments/assets/d28b4a76-1c6d-43d4-9137-333a58a71574

# Unittest Coverage Report

![Image](https://github.com/user-attachments/assets/2f0e3bec-e79b-4c24-87d5-097deab88d48)
