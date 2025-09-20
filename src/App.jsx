import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Header from "./components/Header";
import Protected from "./components/Protected";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <>
     <BrowserRouter>
      <Navbar />
      <Header />
      <div style={{ maxWidth: 600, margin: "1rem auto" }}>
        <Routes>
          <Route path="/" element={<Protected authed={!!token}><Home /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}