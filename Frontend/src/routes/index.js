import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../containers/AdminLayout";
import AccountBalance from "../pages/AccountBalance/accountBalance";
import MiniStatement from "../pages/MiniStatement/miniStatement";
import FullStatement from "../pages/FullStatement/fullStatement";
import KYCDetail from "../pages/KYCDetail/KYCDetail";
import LienAccLayout from "../pages/LienAccount/LienAccount";
import BlockCard from "../pages/BlockCard/BlockCard";
import BankXP from "../pages/BankXP/bankxp";
import CardBlockReport from "../pages/ReportCardBlock/reportCardBlock";
import LeinAccountReport from "../pages/ReportLeinAccount/reportLeinAccount";
import UserDetail from "../pages/UserDetails/userDetails";
import MissedCall from "../pages/MIssedCall/missedCall";
import MissedCallRemarks from "../pages/MissedCallRemarks/missedCallRemarks";
import CustomerDetail from "../pages/CustomerDetail/CustomerDetail";

function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />}></Route>

        <Route
          path=""
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/checkAccountBalance" element={<AccountBalance />} />
          <Route path="/miniStatement" element={<><MiniStatement /></>} />
          <Route path="/viewStatement" element={<><FullStatement /></>} />
          <Route path="/kycDetail" element={<><KYCDetail /></>} />
          <Route path="/lienAccount" element={<><LienAccLayout/></>} />
          <Route path="/blockDebitCard" element={<><BlockCard/></>} />
          <Route path="/bankXP" element={<><BankXP/></>}/>
          <Route path="/leinAccountReport" element={<><LeinAccountReport/></>}/>
          <Route path="/cardBlockReport" element={<><CardBlockReport/></>}/>
          <Route path="/userDetails" element={<><UserDetail/></>}/>
          <Route path="/missedCallList" element={<><MissedCall/></>} />
          <Route path="/missedCallRemarks" element={<><MissedCallRemarks/></>} />
          <Route path="/customerDetail" element={<><CustomerDetail/></>} />
          
        </Route>
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default MyRoutes;
