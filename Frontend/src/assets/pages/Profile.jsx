import React, { useContext, useEffect, useRef, useState } from "react";
import { TaskContext } from "../Context/TaskContext";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Profile = () => {
  const { totalTasks, completedTasks, progress } = useContext(TaskContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPictureOptions, setShowPictureOptions] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editData, setEditData] = useState({
    first_name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const showInlineMessage = (type, text) => {
    if (type === "success") {
      setSuccessMsg(text);
      setErrorMsg("");
    } else {
      setErrorMsg(text);
      setSuccessMsg("");
    }

    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 4000);
  };

  const getProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("profile/");

      setUser(response.data);
      setProfilePic(response.data.profile_picture || null);

      setEditData({
        first_name: response.data.first_name || "",
        email: response.data.email || "",
      });
    } catch (error) {
      console.log("Profile Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showInlineMessage("error", "Please select an image file.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await api.patch("update-profile-picture/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data.profile_picture;

      setProfilePic(imageUrl);
      setUser((prev) => ({
        ...prev,
        profile_picture: imageUrl,
      }));

      setShowPictureOptions(false);
      showInlineMessage("success", "Profile picture updated!");
    } catch (error) {
      if (error.response?.status === 400) {
        showInlineMessage("error", "Please upload a valid image file.");
      }
    } finally {
      e.target.value = "";
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      showInlineMessage("error", "New passwords do not match.");
      return;
    }

    if (passwordData.new_password.length < 8) {
      showInlineMessage("error", "Password must be at least 8 characters.");
      return;
    }

    try {
      await api.post("profile/change-password/", {
        current_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });

      showInlineMessage("success", "Password changed successfully!");

      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      setShowPassword(false);
    } catch (error) {
      const serverError = error.response?.data;
      const msg = serverError
        ? Object.values(serverError).flat().join(" ")
        : "Password change failed.";

      showInlineMessage("error", msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={profilePic}
                alt="Profile"
                onClick={() => setShowPictureOptions(!showPictureOptions)}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow cursor-pointer"
              />

              {showPictureOptions && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-gray-700 rounded-lg shadow-lg p-2 z-10 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (profilePic) {
                        window.open(profilePic, "_self");
                      } else {
                        showInlineMessage(
                          "error",
                          "No profile picture available.",
                        );
                      }

                      setShowPictureOptions(false);
                    }}
                    className="text-left px-3 py-2 rounded hover:bg-gray-600"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-left px-3 py-2 rounded hover:bg-gray-600"
                  >
                    Change
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePictureUpload}
                hidden
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{user?.username}</h2>

              <p className="text-gray-400 text-sm mt-2">
                Name: {user?.first_name || "Not Set"}
              </p>

              <p className="text-gray-400 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800 p-5 rounded-xl shadow">
            <h3 className="text-gray-400">Total Tasks</h3>
            <p className="text-3xl font-bold mt-2">{totalTasks}</p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl shadow">
            <h3 className="text-gray-400">Completed</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {completedTasks}
            </p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl shadow">
            <h3 className="text-gray-400">Progress</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">{progress}%</p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gray-800 rounded-xl p-6 mt-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setShowPassword(false);
              }}
              className="bg-blue-600 px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={() => {
                setShowPassword(!showPassword);
                setIsEditing(false);
              }}
              className="bg-yellow-600 px-5 py-3 rounded-lg hover:bg-yellow-700 text-black font-semibold transition"
            >
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 px-5 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <form
              onSubmit={handleUpdateProfile}
              className="bg-gray-700 p-5 rounded-lg space-y-4 border border-gray-600 mt-5"
            >
              <h3 className="text-lg font-medium text-blue-400">
                Update Personal Details
              </h3>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  First Name
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={editData.first_name}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 p-2.5 rounded border border-gray-600 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 p-2.5 rounded border border-gray-600 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* Change Password Form */}
          {showPassword && (
            <form
              onSubmit={handleChangePassword}
              className="bg-gray-700 p-5 rounded-lg space-y-4 border border-gray-600 mt-5"
            >
              <h3 className="text-lg font-medium text-yellow-400">
                Change Password Securely
              </h3>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Current Password
                </label>

                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-800 p-2.5 rounded border border-gray-600 outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  New Password
                </label>

                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-800 p-2.5 rounded border border-gray-600 outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-800 p-2.5 rounded border border-gray-600 outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="max-w-4xl mx-auto mt-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="max-w-4xl mx-auto mt-4 bg-green-500/10 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm">
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default Profile;
