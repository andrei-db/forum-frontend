import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Guest, Protected } from "./components/Protected";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import TopicPage from "./pages/TopicPage";
import ForumPage from "./pages/ForumPage";
import NewTopicPage from "./pages/NewTopicPage";
import AccountDetails from "./pages/AccountDetails";
import AccountLayout from "./layouts/AccountLayout";
import Security from "./pages/Security";
import Profile from "./pages/Profile";
import AdminLayout from "./admin/layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminForums from "./admin/pages/AdminForums";
import AdminMembers from "./admin/pages/AdminMembers";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminAddForum from "./admin/pages/AdminAddForum";
import AdminEditForum from "./admin/pages/AdminEditForum";
import AdminEditCategory from "./admin/pages/AdminEditCategory";
import AdminAddMember from "./admin/pages/AdminAddMember";
import AdminMemberProfile from "./admin/pages/AdminMemberProfile";
import AdminGroups from "./admin/pages/AdminGroups";
import AdminAddGroup from "./admin/pages/AdminAddGroup";
import AdminEditGroup from "./admin/pages/AdminEditGroup";
import AdminGroupPermissions from "./admin/pages/AdminGroupPermissions";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
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
            <Route path="/members/:username" element={<Profile />} />

          </Route>
          <Route path="/admin" element={<Protected staffOnly><AdminLayout /></Protected>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="forums" element={<AdminForums />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="forums/add" element={<AdminAddForum />} />
            <Route path="forums/:id/edit" element={<AdminEditForum />} />
            <Route path="categories/:id/edit" element={<AdminEditCategory />} />
            <Route path="members/add" element={<AdminAddMember />} />
            <Route path="members/:id" element={<AdminMemberProfile />} />
            <Route path="groups" element={<AdminGroups />} />
            <Route path="groups/add" element={<AdminAddGroup />} />
            <Route path="groups/:id" element={<AdminEditGroup />} />
            <Route path="groups/:id/permissions" element={<AdminGroupPermissions />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
