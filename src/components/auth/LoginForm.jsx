import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const LoginForm = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/Auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.token) {
        const token = response.data.token;
        const upId = response.data.upId;

        // Lưu token và upId, không lưu role
        localStorage.setItem("token", token);
        localStorage.setItem("upId", upId.toString());

        // Giải mã token
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (!role) {
          throw new Error("Token không hợp lệ: thiếu thông tin vai trò");
        }

        // Chỉ set user và navigate nếu role được phép
        if (role === "Admin" || role === "Staff") {
          setUser({ email: formData.email, role, upId });
          toast.success("Đăng nhập thành công!");

          // Navigate dựa trên role
          if (role === "Admin") {
            navigate("/", { replace: true });
          } else if (role === "Staff") {
            navigate("/news", { replace: true });
          }
        } else {
          clearLocalStorage();
          setError("Tài khoản của bạn không được phép truy cập.");
        }
      } else {1
        setError("Thông tin đăng nhập không hợp lệ");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || error.response.data.message || "Email hoặc mật khẩu không đúng";
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (error.request) {
        setError("Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.");
        toast.error("Không nhận được phản hồi từ server.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        toast.error(error.message);
      }
      clearLocalStorage();
    }
  };

  // Add a helper function to clear localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("upId");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Header Section - Completely separate from any blur effects */}
      <motion.div
        className="z-10 flex items-center justify-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-7xl font-bold text-orange-400">App Chảo</h1>
        <img
          src="/favicon.png"
          alt="App Chảo Icon"
          className="ml-2 h-[120px] w-[120px]"
        />
      </motion.div>

      {/* Form Section - With blur effect contained within */}
      <div className="relative w-96 pt-3">
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl"></div>
        <motion.div
          className="relative z-0 p-8 border border-gray-700 rounded-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
            Đăng nhập
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-1">Mật khẩu</label>
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
              Đăng nhập
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 bg-gray-600 hover:bg-gray-500 p-3 rounded-lg text-white font-semibold transition-all duration-200"
              type="button"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu?
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;