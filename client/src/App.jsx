import "./index.css";
import SignIn from "./pages/auth/sign-in.jsx";
import SignUp from "./pages/auth/sign-up.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Settings from "./pages/settings.jsx";
import Transactions from "./pages/transactions.jsx";
import AccountPage from "./pages/account-page.jsx";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import useStore from "./store/index.js";
import { Toaster } from "sonner";
import Navbar from "./components/navbar.jsx";
import { useEffect } from "react";
const RootLayout = () => {
  const {user} = useStore((state)=>state);
  console.log(user);
  return !user ? (
    <Navigate to="sign-in" replace={true}/>
  ) : (
    <>
      {<Navbar/>}
      <div className="min-h-[cal(h-screen-100px)]">
        <Outlet />
      </div>
    </>
  );
};
function App() {
  const {theme}=useStore((state)=>state);
  useEffect(()=>{
    if(theme === "dark"){
      document.body.classList.add("dark");
    }else{
      document.body.classList.remove("dark");
    }
  },[theme])
  return (
    <main>
      <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;
