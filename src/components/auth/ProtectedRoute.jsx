import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, redirectPath }) => {
  if (!user) {
    return <Navigate to="/login" replace />; // 🔹 Nếu chưa login, chuyển về login
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />; // 🔹 Nếu role không hợp lệ, chuyển hướng phù hợp
  }

  return <Outlet />; // 🔹 Nếu hợp lệ, render component con
};

export default ProtectedRoute;
