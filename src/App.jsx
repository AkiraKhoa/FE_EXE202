import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import NewsPage from "./pages/NewsPage";
import NotificationsPage from "./pages/NotificationsPage";
import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // ✅ Dùng role đã lưu từ LoginForm
    if (token && role) {
      setUser({ role });
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-2">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {user && <Sidebar role={user.role} setUser={setUser} />}

      <div className="flex-1">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
