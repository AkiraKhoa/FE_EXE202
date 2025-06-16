import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { CloudCog, X } from "lucide-react";
import axios from "axios";

const CreateUserModal = ({ onClose, onSave }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    password: [],
    email: "",
    fullName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Must include at least one special character");
    }
    if (!/\d/.test(password)) {
      errors.push("Must include at least one number");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Must include at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Must include at least one uppercase letter");
    }
    if (new Set(password).size < 1) {
      errors.push("Must use at least 1 different character");
    }

    return errors;
  };

  const validateFullName = (name) => {
    if (!name) return "";
    if (!/^[A-Z]/.test(name)) {
      return "First letter must be uppercase";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // Reset error state when user types
    setError(null);

    // Validate on change
    if (name === 'password') {
      setValidationErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    }
    if (name === 'fullName') {
      setValidationErrors(prev => ({
        ...prev,
        fullName: validateFullName(value)
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate all fields before submission
      const passwordErrors = validatePassword(userData.password);
      const fullNameError = validateFullName(userData.fullName);
      
      setValidationErrors({
        password: passwordErrors,
        fullName: fullNameError,
        email: ""
      });

      if (passwordErrors.length > 0 || fullNameError) {
        return;
      }

      if (!userData.email || !userData.password || !userData.role) {
        setError("Email, password and role are required.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");
      const requestData = {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName || "",
        username: userData.email,
        role: userData.role,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API}/UserProfile/create`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      onSave(response.data);
      onClose();
      
    } catch (err) {
      console.error("Full error:", err);
      let errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to create user";
      
      // Handle specific error cases
      if (errorMessage.includes("already taken")) {
        setValidationErrors(prev => ({
          ...prev,
          email: "This email is already registered"
        }));
      } else if (errorMessage.includes("Passwords must")) {
        // Extract password-specific errors from the error message
        const passwordErrors = errorMessage
          .split("., ")
          .map(err => err.replace("Passwords must ", "")
          .replace("Failed to create user: ", ""));
        setValidationErrors(prev => ({
          ...prev,
          password: passwordErrors
        }));
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add useEffect to handle error auto-dismiss
  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [error]); // Run effect when error changes

  // Modify your error display with animation
  const errorDisplay = error && (
    <motion.div
      className="mb-4 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {error}
    </motion.div>
  );

  // In the return statement, update the outer container:
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>

        <motion.div
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[400px] shadow-2xl border border-gray-700 relative z-10"
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold mb-5 text-white">Create User</h2>

          <AnimatePresence>{error && errorDisplay}</AnimatePresence>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-gray-700 text-white border ${
                  validationErrors.fullName ? 'border-red-500' : 'border-gray-600'
                } focus:ring-2 focus:ring-blue-500`}
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-gray-700 text-white border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-600'
                } focus:ring-2 focus:ring-blue-500`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-gray-700 text-white border ${
                  validationErrors.password.length > 0 ? 'border-red-500' : 'border-gray-600'
                } focus:ring-2 focus:ring-blue-500`}
              />
              {validationErrors.password.length > 0 && (
                <div className="mt-1 text-sm text-red-400">
                  <ul className="list-disc list-inside">
                    {validationErrors.password.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mt-4 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={userData.role}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a role</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mt-4 mb-1">
                Subscription Status
              </label>
              <div className="w-full p-2 rounded bg-gray-700 text-gray-400 border border-gray-600">
                None
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-6 w-full p-2 rounded text-white font-semibold transition-all duration-200 ${
              isSubmitting
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateUserModal;
