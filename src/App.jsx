import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import RecipesPage from "./pages/RecipesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const upId = localStorage.getItem("upId");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (role && upId) {
          setUser({ role, upId });
        } else {
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("upId");
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("upId");
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <>
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
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              </>
            ) : (
              <>
                {/* Common routes for both roles */}
                <Route element={<ProtectedRoute user={user} allowedRoles={["Admin", "Staff"]} />}>
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Protect Dashboard: Only Admin can access */}
                <Route element={<ProtectedRoute user={user} allowedRoles={["Admin"]} />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                </Route>

                {/* Protect Staff pages: Only Staff can access */}
                <Route element={<ProtectedRoute user={user} allowedRoles={["Staff"]} />}>
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Route>

                {/* Redirect unauthorized users to appropriate page */}
                <Route path="*" element={<Navigate to={user.role === "Admin" ? "/" : "/recipes"} />} />
              </>
            )}
          </Routes>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            padding: "16px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;