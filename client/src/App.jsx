import "./index.css";
import SignIn from "./pages/auth/sign-in.jsx";
import SignUp from "./pages/auth/sign-up.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Settings from "./pages/settings.jsx";
import Transactions from "./pages/transactions.jsx";
import AccountPage from "./pages/account-page.jsx";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import useStore from "./store/index.js";

const RootLayout = () => {
  const {user} = useStore((state)=>state);
  console.log(user);
  return !user ? (
    <Navigate to="sign-in" replace={true}/>
  ) : (
    <>
      {/*<Navbar/>*/}
      <div>
        <Outlet />
      </div>
    </>
  );
};
function App() {
  return (
    <main>
      <div>
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
    </main>
  );
}

export default App;
