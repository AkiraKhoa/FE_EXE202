import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "Admin" ? "/" : "/news"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
