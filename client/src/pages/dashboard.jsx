import React, { useState, useEffect } from "react";
import api from "../libs/apiCalls.js";
import { toast } from "sonner";
import Loading from "../components/loading.jsx";
import Info from "../components/Info.jsx";
import Stats from "../components/stats.jsx";
import { Chart } from "../components/chart.jsx";
import DoughnutChart from "../components/piechart.jsx";
import RecentTransactions from "../components/RecentTransactions.jsx";
import Accounts from "../components/accounts.jsx";
const Dashboard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fetchDashboardStats = async () => {
    const URL = `/transaction/dashboard`;
    try {
      const response = await api.get(URL);
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error. Try again later.");
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);
  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  return (
    <div className="px-0 md:px-5 2xl:px-20">
      <Info title="Dashboard" subTitle={"Monitor your financial activities"} />
      <Stats
        dt={{
          balance: data?.availableBalance,
          income: data?.totalIncome,
          expense: data?.totalExpense,
        }}
      />
      <div className="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
        <Chart data={data?.chartData} />
        {data &&
          Object.keys(data).length > 0 &&
          (() => {
            const balance = parseFloat(data?.availableBalance) || 0;
            const income = parseFloat(data?.totalIncome) || 0;
            const expense = parseFloat(data?.totalExpense) || 0;

            const total = balance + income + expense;

            if (total === 0) {
              return (
                <p className="text-sm text-gray-500">
                  No data to display in chart.
                </p>
              );
            }

            const chartData = [
              { name: "Balance", value: (balance / total) * 100 },
              { name: "Income", value: (income / total) * 100 },
              { name: "Expense", value: (expense / total) * 100 },
            ];

            return <DoughnutChart data={chartData} />;
          })()}
      </div>
      <div className="flex flex-col-reverse gap-0 md:flex-row md:gap-10 2xl:gap-20">
        <RecentTransactions data={data?.lastFiveTransactions}/>
          {data?.lastFourAccounts?.length > 0 && <Accounts data={data?.lastFourAccounts}/>}
      </div>
    </div>
  );
};

export default Dashboard;
