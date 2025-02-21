import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/"); // Nếu đã login, về trang chính
    }
  }, [navigate]);

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 ">
      <LoginForm setUser={setUser} />
    </main>
  );
};

export default LoginPage;