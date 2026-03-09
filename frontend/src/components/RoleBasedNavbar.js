import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import HomeNavbar from "./Navbars/HomeNavBar";
import AdminNavBar from "./Navbars/AdminNavbar";
import WorkerNavBar from "./Navbars/WorkerNavbar";
import CustomerNavBar from "./Navbars/CustomerNavbar";

const RoleBasedNavbar = () => {

  const { user } = useContext(AuthContext);

  if (!user) {
    return <HomeNavbar />;
  }

  if (user.role === "admin") {
    return <AdminNavBar />;
  }

  if (user.role === "worker") {
    return <WorkerNavBar />;
  }

  if (user.role === "customer") {
    return <CustomerNavBar />;
  }

  return <HomeNavbar />;
};

export default RoleBasedNavbar;