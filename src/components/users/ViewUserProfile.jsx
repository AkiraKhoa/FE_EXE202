import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ViewUserProfile = ({ id, onClose, allUsers }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    age: null,
    gender: null,
    allergies: [],
    healthConditions: [],
    role: "",
    userId: "",
    profileImage: null, // Add this line
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserById();
  }, [id]);

  const fetchUserById = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API}/UserProfile/userProfile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserData({
        fullName: response.data.fullName || "",
        username: response.data.username || "",
        email: response.data.email || "",
        age: response.data.age,
        gender: response.data.gender,
        allergies: response.data.allergies || [],
        healthConditions: response.data.healthConditions || [],
        role: response.data.role || "",
        userId: response.data.userId || "",
        profileImage: response.data.userPicture || null,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to fetch user details");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleImageError = async (e) => {
    e.target.src = "/default-avatar.png";
    console.log(
      "Image failed to load, refreshing user data:",
      userData.profileImage
    );
    await fetchUserById();
    toast.error("Profile image is unavailable and has been reset.");
  };

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
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[440px] shadow-2xl border border-gray-700 relative z-10 max-h-[90vh] overflow-y-auto"
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

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-3 flex items-center justify-center">
                {userData.profileImage ? (
                  <img
                    src={`${userData.profileImage}?w=128&h=128&c=fill&q=80`}
                    alt={userData.fullName || "Profile"}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <span className="text-2xl text-gray-400">
                      {userData.fullName
                        ? userData.fullName.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white">
              {userData.fullName || "User Profile"}
            </h2>
            <p className="text-gray-400">@{userData.username || "username"}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-semibold">
                {userData.allergies?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Allergies</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">
                {userData.healthConditions?.length || 0}
              </div>
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
                <div
                  key={index}
                  className="flex items-center justify-between text-gray-300"
                >
                  <span>{condition.name}</span>
                  <span className="text-sm text-gray-400">
                    {condition.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gender & Age Section */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Heart size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Gender</span>
                <span className="text-gray-300">
                  {userData.gender || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Age</span>
                <span className="text-gray-300">
                  {userData.age || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewUserProfile;
