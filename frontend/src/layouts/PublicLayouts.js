import { Outlet } from "react-router-dom";
import RoleBasedNavbar from "../components/RoleBasedNavbar";
import Footer from "../components/Footer/Footer";

const PublicLayout = () => {
  return (
    <>
      <RoleBasedNavbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default PublicLayout;