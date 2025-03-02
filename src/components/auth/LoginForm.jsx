import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LoginForm = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" }); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://localhost:7142/api/auth/login`, formData);

      if (response.data.token && response.data.token.result) {
        const token = response.data.token.result;
        localStorage.setItem("token", token);

        // 🔹 Giải mã token
        const decoded = jwtDecode(token);
        const role =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        localStorage.setItem("role", role);
        setUser({ email: formData.email, role });

        // 🔹 Điều hướng theo role
        if (role === "Admin") {
          navigate("/dashboard");
        } else if (role === "MARKETANALIZER") {
          navigate("/news");
        } else {
          setError("Your account is unauthorized.");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } else {
        throw new Error("Invalid token structure");
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data || "Invalid username or password"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 w-96"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email" // 🔹 Đổi thành email thay vì username
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-white font-semibold transition-all duration-200"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
