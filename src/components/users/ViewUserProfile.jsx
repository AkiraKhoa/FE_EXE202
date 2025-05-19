import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Heart, AlertTriangle, Upload } from "lucide-react";
import axios from "axios";

const ViewUserProfile = ({ id, onClose, allUsers }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    age: "",
    gender: "",
    allergies: [],
    healthConditions: [],
    emergencyContact: {
      name: "",
      relation: "",
      phone: ""
    },
    profileImage: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = allUsers.find((user) => user.upId === id);
    if (currentUser) {
      setUserData(currentUser);
      setIsLoading(false);
    } else {
      fetchUserById();
    }
  }, [id]);

  const fetchUserById = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/UserProfile/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch user details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this before the return statement to debug
  console.log("Current ID:", id);
  console.log("All Users:", allUsers);
  console.log("Current User Data:", userData);

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-gray-800 rounded-xl p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">Loading...</span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (error || !userData) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-gray-800 rounded-xl p-8">
            <div className="text-red-400 mb-4">{error || "User not found"}</div>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 pt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[440px] shadow-2xl border border-gray-700 relative mb-24 max-h-[90vh] overflow-y-auto"
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 30, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-3">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload size={32} className="text-gray-500" />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profile-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-2 right-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600"
              >
                <Upload size={14} />
              </label>
            </div>
            <h2 className="text-xl font-semibold text-white">{userData.fullName || "User Profile"}</h2>
            <p className="text-gray-400">@{userData.username || "username"}</p>
            {/* <p className="text-sm text-gray-500">Member since 2023</p> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-semibold">{userData.allergies?.length || 0}</div>
              <div className="text-sm text-gray-400">Allergies</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">{userData.healthConditions?.length || 0}</div>
              <div className="text-sm text-gray-400">Conditions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">0</div>
              <div className="text-sm text-gray-400">Medications</div>
            </div>
          </div>

          {/* Allergies Section */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <AlertTriangle size={18} className="text-red-400 mr-2" />
              <h3 className="text-lg font-semibold">Allergies</h3>
            </div>
            <div className="space-y-2">
              {userData.allergies?.map((allergy, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  {allergy}
                </div>
              ))}
            </div>
          </div>

          {/* Health Conditions Section */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Heart size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold">Health Conditions</h3>
            </div>
            <div className="space-y-2">
              {userData.healthConditions?.map((condition, index) => (
                <div key={index} className="flex items-center justify-between text-gray-300">
                  <span>{condition.name}</span>
                  <span className="text-sm text-gray-400">{condition.severity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Phone size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-300">{userData.emergencyContact?.name}</div>
              <div className="text-sm text-gray-400">{userData.emergencyContact?.relation}</div>
              <div className="text-blue-400 mt-2">{userData.emergencyContact?.phone}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewUserProfile;
