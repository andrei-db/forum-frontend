import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Guest } from "./components/Protected";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Header />
        <div className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                <Guest>
                  <Login />
                </Guest>
              }
            />
            <Route
              path="/register"
              element={
                <Guest>
                  <Register />
                </Guest>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
