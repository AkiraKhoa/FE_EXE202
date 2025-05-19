import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Phone, Mail, User, Lock, Edit } from "lucide-react";
import axios from "axios";
import Header from "../components/common/Header";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    profileImage: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const response = await axios.get(
        `${import.meta.env.VITE_API}/UserProfile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch profile data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Add your image upload logic here
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="My Profile" />
      <main className="max-w-3xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-4">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={40} className="text-gray-500" />
                  </div>
                )}
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600"
                >
                  <Upload size={16} className="text-white" />
                </label>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-1">{userData.fullName}</h1>
            <p className="text-gray-400">@{userData.username}</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <User size={20} className="text-gray-400 mr-3" />
                  <span>{userData.fullName}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail size={20} className="text-gray-400 mr-3" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone size={20} className="text-gray-400 mr-3" />
                  <span>{userData.phone || "No phone number added"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => {/* Add change password logic */}}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Lock size={16} className="mr-2" />
                Change Password
              </button>
              <button
                onClick={() => {/* Add edit profile logic */}}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;