import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Phone, Mail, User, Lock, Edit, Check, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast"; // Add this import
import Header from "../components/common/Header";
import ChangePasswordModal from "../components/users/ChangePasswordModal";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    profileImage: null
  });
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (editMode) {
      setEditedData({ ...userData });
    }
  }, [editMode]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const upId = localStorage.getItem("upId"); // Changed from userId to upId
      
      if (!token || !upId) {
        setError("No authentication token or user ID found");
        return;
      }

      // Log the upId and URL for debugging
      // console.log("Fetching profile for upId:", upId);
      // console.log("API URL:", `${import.meta.env.VITE_API}/UserProfile/${upId}`);

      const response = await axios.get(
        `${import.meta.env.VITE_API}/UserProfile/userProfileMin/${upId}`, // Updated URL to use upId
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Log the response data for debugging
      console.log("API Response:", response.data);

      if (response.data) {
        setUserData({
          fullName: response.data.fullName || "",
          username: response.data.username || "",
          email: response.data.email || "",
          phone: response.data.phoneNumber || "", // Changed to match API response
          profileImage: response.data.profileImage || null,
          role: response.data.role || ""
        });
        setError(null);
      } else {
        setError("No user data received");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(err.response?.data?.message || "Failed to fetch profile data");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const upId = localStorage.getItem("upId");
      
      // Format the data to match API expectations
      const formattedData = {
        upId: parseInt(upId),
        fullName: editedData.fullName,
        username: userData.username,
        email: editedData.email,
        phoneNumber: editedData.phone,
        role: userData.role
      };

      // Show loading toast
      const loadingToastId = toast.loading("Updating profile...");

      await axios.put(
        `${import.meta.env.VITE_API}/UserProfile/userProfile/${upId}`,
        formattedData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Update local state with the new data
      setUserData({
        ...userData,
        fullName: editedData.fullName,
        email: editedData.email,
        phone: editedData.phone
      });

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success("Profile updated successfully!", {
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#fff',
        },
      });

      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      
      // Show error toast
      toast.error(err.response?.data?.message || "Failed to update profile", {
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#fff',
        },
      });
    }
  };

  const handleDiscard = () => {
    setEditMode(false);
    setEditedData({});
    toast("Changes discarded", {
      icon: '🔄',
      duration: 2000,
      style: {
        background: '#1f2937',
        color: '#fff',
      },
    });
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
                  {editMode ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editedData.fullName || ""}
                      onChange={handleInputChange}
                      className="bg-gray-600 text-white px-3 py-1 rounded-lg"
                    />
                  ) : (
                    <span>{userData.fullName}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail size={20} className="text-gray-400 mr-3" />
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={editedData.email || ""}
                      onChange={handleInputChange}
                      className="bg-gray-600 text-white px-3 py-1 rounded-lg"
                    />
                  ) : (
                    <span>{userData.email}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone size={20} className="text-gray-400 mr-3" />
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone || ""}
                      onChange={handleInputChange}
                      className="bg-gray-600 text-white px-3 py-1 rounded-lg"
                    />
                  ) : (
                    <span>{userData.phone || "No phone number added"}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check size={16} className="mr-2" />
                    Submit
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X size={16} className="mr-2" />
                    Discard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Lock size={16} className="mr-2" />
                    Change Password
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
        <ChangePasswordModal 
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default ProfilePage;