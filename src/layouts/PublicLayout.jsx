import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="max-w-screen-2xl mx-auto px-5">
      <Navbar />
      <Header />

      <Outlet />
      <Footer />
    </div>
  );
}
