import React, { useState, useEffect, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import VideoBackgroundLayout from "./components/VideoBackgroundLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load components
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const UsersPage = React.lazy(() => import("./pages/UsersPage"));
const RecipesPage = React.lazy(() => import("./pages/RecipesPage"));
const NotificationsPage = React.lazy(() => import("./pages/NotificationsPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));

// Preload LoginPage and ForgotPasswordForm
const preloadComponents = async () => {
  try {
    const [loginModule, forgotModule] = await Promise.all([
      import("./pages/LoginPage"),
      import("./components/auth/ForgotPasswordForm"),
    ]);
    return { LoginPage: loginModule.default, ForgotPasswordForm: forgotModule.default };
  } catch (error) {
    console.error("Preloading failed:", error);
    return {};
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preloadedComponents, setPreloadedComponents] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const upId = localStorage.getItem("upId");

    preloadComponents()
      .then((components) => {
        setPreloadedComponents(components);
      })
      .catch((error) => console.error("Preload error:", error));

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

  if (loading) return <div className="text-white">Initializing...</div>;

  // Use preloaded components
  const LoginComponent = preloadedComponents.LoginPage || (() => <div>Loading Login...</div>);
  const ForgotPasswordComponent = preloadedComponents.ForgotPasswordForm || (() => <div>Loading Forgot Password...</div>);

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div className="fixed inset-0 z-2">
          <div className="absolute inset-0 opacity-80" />
          <div className="absolute inset-0" />
        </div>

        {user && <Sidebar role={user.role} setUser={setUser} />}

        <div className="flex-1 relative z-10">
          <Routes>
            {!user ? (
              <>
                <Route element={<VideoBackgroundLayout />}>
                  <Route
                    path="/login"
                    element={<LoginComponent setUser={setUser} />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordComponent />}
                  />
                </Route>
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route
                  element={
                    <ProtectedRoute
                      user={user}
                      allowedRoles={["Admin", "Staff"]}
                    />
                  }
                >
                  <Route
                    path="/profile"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProfilePage />
                      </Suspense>
                    }
                  />
                </Route>

                <Route
                  element={
                    <ProtectedRoute user={user} allowedRoles={["Admin"]} />
                  }
                >
                  <Route
                    path="/"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <DashboardPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <UsersPage />
                      </Suspense>
                    }
                  />
                </Route>

                <Route
                  element={
                    <ProtectedRoute user={user} allowedRoles={["Staff"]} />
                  }
                >
                  <Route
                    path="/recipes"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <RecipesPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <NotificationsPage />
                      </Suspense>
                    }
                  />
                </Route>

                <Route
                  path="*"
                  element={
                    <Navigate to={user.role === "Admin" ? "/" : "/recipes"} />
                  }
                />
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