import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const upId = localStorage.getItem("upId");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (role && upId) {
          setUser({ role, upId });
          navigate("/");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("upId");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("upId");
      }
    }
  }, [navigate, setUser]);

  return (
    // <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
    <main className="min-h-screen">
      <LoginForm setUser={setUser} />
    </main>
  );
};

export default LoginPage;