import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 🔹 Import thêm useState & useEffect
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import NewsPage from "./pages/NewsPage";
import NotificationsPage from "./pages/NotificationsPage";
import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null); // 🔹 Dùng state để lưu user

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser); // 🔹 Cập nhật user từ localStorage khi app load
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-2">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80"/>
        <div className="absolute inset-0 backdrop-blur-sm"/>
      </div>

      {/* 📌 Chỉ hiển thị Sidebar nếu user đã đăng nhập */}
      {user && <Sidebar role={user.role} setUser={setUser} />} {/* 🔹 Truyền setUser để xử lý logout */}

      <div className="flex-1">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<LoginPage setUser={setUser} />} /> {/* 🔹 Truyền setUser vào Login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
