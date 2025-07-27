import React, { useEffect, useState } from "react";
import { FaPaypal, FaBtc } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiVisaLine } from "react-icons/ri";
import { toast } from "sonner";
import Loading from "../components/loading.jsx";
import api from "../libs/apiCalls.js";
import Title from "../components/title.jsx";
import { MdAdd, MdVerifiedUser } from "react-icons/md";
import TransferMoney from "../components/transferMoney.jsx";
import AddMoney from "../components/addmoney.jsx";
import AccountMenu from "../components/accmenu.jsx";
import { formatCurrency, MaskAccountNumber } from "../libs/index.js";
import { AddAccount } from "../components/addaccount.jsx";
const ICONS = {
  crypto: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaBtc size={26} />
    </div>
  ),
  cash: (
    <div className="w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full">
      <GiCash size={26} />
    </div>
  ),
  paypal: (
    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
      <FaPaypal size={26} />
    </div>
  ),
  "visa debit card": (
    <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
      <RiVisaLine size={26} />
    </div>
  ),
};
const AccountPage = () => {
  const { user } = useState((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenToPop, setIsOpenToPop] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const { data: res } = await api.get(`/account`);
      setData(res?.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleOpenAddMoney=(i)=>{
    setSelectedAccount(i?.id);
    setIsOpenToPop(true);
  }
  const handleTransferMoney=(i)=>{
    setSelectedAccount(i?.id);
    setIsOpenTransfer(true);
  }
  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
    <div className="w-full py-10">
      <div className="flex items-center justify-between">
        <Title title="Your Accounts" />
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center overflow-hidden px-2.5 py-1.5 bg-violet-600 dark:bg-violet-800 text-white rounded border border-gray-500 hover:bg-violet-800 transition-all duration-300"
          >
            <MdAdd size={22} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 whitespace-nowrap">
              Add Account
            </span>
          </button>
        </div>
      </div>

      {data?.length === 0 ? (
        <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-white text-lg">
          <span>Click on + to get started</span>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 py-10 gap-6">
          {data?.map((acc, index) => (
            <div
              key={index}
              className="w-full h-48 flex gap-4 bg-gray-50 dark:bg-slate-800 p-3 rounded shadow"
            >
              <div>{ICONS[acc?.account_name?.toLowerCase()]}</div>
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center ">
                    <p className="text-black dark:text-white text-2xl font-bold">{acc?.account_name}</p>
                    <MdVerifiedUser size={26} className="text-emerald-600 ml-1"/>
                  </div>
                  <AccountMenu 
                    addMoney={()=>handleOpenAddMoney(acc)}
                    transferMoney={()=>handleTransferMoney(acc)}
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-light leading-loose">
                  {MaskAccountNumber(acc?.account_number)}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-500">
                  {new Date(acc?.createdat).toLocaleDateString("en-US",{
                    dateStyle:"full"
                  })}
                </p>
                <div className="flex tems-center justify-between">
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                    {formatCurrency(acc?.account_balance)}
                  </p>
                  <button
                  onClick={()=>handleOpenAddMoney(acc)}
                  className="text-sm outline-none text-violet-700 hover:underline"
                  >
                    Add Money
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <AddAccount
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    refetch={fetchAccounts}
    key={new Date().getTime()}
    />
    <AddMoney 
      isOpen={isOpenToPop}
      setIsOpen={setIsOpenToPop}
      id={selectedAccount}
      refetch={fetchAccounts}
      key={new Date().getTime()+1}
    />
    <TransferMoney 
      isOpen={isOpenTransfer}
      setIsOpen={setIsOpenTransfer}
      id={selectedAccount}
      refetch={fetchAccounts}
      key={new Date().getTime()+2}
    />
    </>
  );
};

export default AccountPage;
