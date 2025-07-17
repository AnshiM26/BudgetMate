import React from "react";
import Title from "./title";
import { RiProgress3Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import { formatCurrency } from "../libs";
import { Link } from "react-router-dom";

const RecentTransactions = ({data}) => {
  return (
    <div className="flex-1 w-full py-20">
        <div className="flex items-center justify-between">
            <Title title="Latest Transactions" />
            <Link to="/transactions" className='text-sm text-gray-600 dark:text-gray-500 hover text-violet-600 hover:underline mr-5'>
            View All Transactions
            </Link>
        </div>
      <div className='overflow-x-auto mt-5'>
        <table className='w-full'>
          <thead className='w-full border-b border-gray-300 dark:border-gray-700'>
            <tr className='w-full text-black dark:text-gray-400  text-left'>
              <th className='py-2'>Date</th>
              <th className='px-2 py-2'>Description</th>
              <th className='px-2 py-2'>Status</th>
              <th className='px-2 py-2'>Source</th>
              <th className='px-2 py-2'>Amount</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item, index) => (
              <tr
                key={index}
                className='norder-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500 hover:bg-gray-300/10'
              >
                <td className='py-3 px-2'>
                    {new Date(item.createdat).toLocaleDateString()}
                </td>
                <td className='py-3 px-2'>
                  <div className='flex flex-col'>
                    <p className='text-base font-medium 2xl:text-lg text-black dark:text-gray-400 line-clamp-1'>
                      {item?.description}
                    </p>
                  </div>
                </td>

                <td className='py-3 px-2 flex items-center gap-2'>
                  {item?.status === "Pending" && (
                    <RiProgress3Line className='text-amber-600' size={24} />
                  )}
                  {item.status === "Completed" && (
                    <IoCheckmarkDoneCircle
                      className='text-emerald-600'
                      size={24}
                    />
                  )}
                  {item?.status === "Rejected" && (
                    <TiWarning className='text-red-600' size={24} />
                  )}

                  <span>{item?.status}</span>
                </td>

                <td className='py-3 px-2'>
                <p className="line-clamp-1">
                  {item?.source}
                </p>
                </td>
                <td className='flex items-center py-4 px-2 font-medium text-black dark:text-gray-400'>
                  <span className={`${
                    item?.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                    {item?.type==="income" ? "+":"-"}
                  </span>
                  {formatCurrency(item?.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;