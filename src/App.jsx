import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Guest, Protected } from "./components/Protected";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import TopicPage from "./pages/TopicPage";
import ForumPage from "./pages/ForumPage";
import NewTopicPage from "./pages/NewTopicPage";
import Footer from "./components/Footer";
import AccountDetails from "./pages/AccountDetails";
import AccountLayout from "./layouts/AccountLayout";
import Security from "./pages/Security";
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
            <Route
              path="/account"
              element={
                <Protected>
                  <AccountLayout />
                </Protected>
              }
            >
              <Route path="account-details" element={<AccountDetails />} />
              <Route path="security" element={<Security />} />
            </Route>
            <Route path="/forums/:id/new-topic" element={<NewTopicPage />} />
            <Route path="/forums/:id" element={<ForumPage />} />
            <Route path="/topics/:id" element={<TopicPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
