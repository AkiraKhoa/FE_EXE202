import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import axios from "axios"; // Commented out for mock data, re-enable when backend is available
// import { jwtDecode } from "jwt-decode"; // Commented out for mock data, re-enable when backend is available

const LoginForm = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Mock user data for temporary use until backend is available
  const mockUsers = [
    { email: "a@gmail.com", password: "Abcd@1234", role: "Admin" },
    { email: "b@gmail.com", password: "Abcd@1234", role: "Staff" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mock login logic (temporary until backend is available)
    const user = mockUsers.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Simulate token and backend response structure
      const mockToken = `mock-jwt-${user.email}`;
      localStorage.setItem("token", mockToken);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.email); // Use email as userId for simplicity

      setUser({ email: user.email, role: user.role });

      // Navigate based on role
      if (user.role === "Admin") {
        navigate("/");
      } else if (user.role === "Staff") {
        navigate("/news");
      }
    } else {
      setError("Invalid email or password");
    }

    // Backend login logic (commented out, re-enable when backend is available)
    /*
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      if (response.data.token && response.data.token.result) {
        const token = response.data.token.result;
        localStorage.setItem("token", token);

        // Decode token
        const decoded = jwtDecode(token);
        const role =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        const userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        // Only set user and navigate if role is authorized
        if (role === "Admin" || role === "Staff") {
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          setUser({ email: formData.email, role });

          if (role === "Admin") {
            navigate("/");
          } else if (role === "Staff") {
            navigate("/news");
          }
        } else {
          // Clear token and role for unauthorized users
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          setError("Your account is unauthorized.");
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "Invalid username or password");
    }
    */
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
          src="/pan.png"
          alt="App Chảo Icon"
          className="ml-2 h-[180px] w-[180px]"
        />
      </motion.div>

      {/* Form Section - With blur effect contained within */}
      <div className="relative w-96">
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl"></div>
        <motion.div
          className="relative z-0 p-8 border border-gray-700 rounded-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
            Login
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 bg-gray-600 hover:bg-gray-500 p-3 rounded-lg text-white font-semibold transition-all duration-200"
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
