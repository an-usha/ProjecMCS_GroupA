import { useContext } from "react";
import LoginPage from "../../pages/Auth/Login";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Dashboard from "../../pages/Dashboard/Dashboard";

export default function ProtectedRoute({children}) {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (isLoggedIn===false) {
    return <Navigate to={"/auth/login"} replace />;
  }else{
    return <>{children}</>;

  }

}
