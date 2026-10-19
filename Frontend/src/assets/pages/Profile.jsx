import React, { useContext, useEffect, useRef, useState } from "react";
import { TaskContext } from "../Context/TaskContext";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../Context/AuthContext";

const Profile = () => {
  const {
    profilePic,
    user,
    loading,
    handlePictureUpload,
    handleUpdateProfile,
    editProfileData,
    setEditProfileData,
    showPictureOptions,
    setShowPictureOptions,
    successMsg,
    errorMsg,
    delete_profile_picture,
    showInlineMessage,
  } = useContext(AuthContext);

  const { totalTasks, completedTasks, progress } = useContext(TaskContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Separate Show/Hide state for each password field
  const [showPasswords, setShowPasswords] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleEditChange = (e) => {
    setEditProfileData({
      ...editProfileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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

      setShowPasswords({
        old_password: false,
        new_password: false,
        confirm_password: false,
      });
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
                src={profilePic.url}
                alt="Profile"
                onClick={() => setShowPictureOptions(!showPictureOptions)}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow cursor-pointer"
              />

              {showPictureOptions && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-gray-700 rounded-lg shadow-lg p-2 z-10 flex flex-col gap-2">
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (profilePic.status === "updated" ) {
                        navigate("/view-profile-picture", {
                          state: { pictureUrl: profilePic.url },
                        });
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
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowPictureOptions(false);
                    }}
                    className="text-left px-3 py-2 rounded hover:bg-gray-600"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      delete_profile_picture();
                    }}
                    className="text-left px-3 py-2 rounded hover:bg-gray-600 text-red-400"
                  >
                    Delete
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
              className="bg-yellow-600 px-5 py-3 rounded-lg hover:bg-yellow-700 text-white font-semibold transition"
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
                  value={editProfileData.first_name}
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
                  value={editProfileData.email}
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

              {/* Current Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showPasswords.old_password ? "text" : "password"}
                    name="old_password"
                    placeholder="Current password..."
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-800 p-2.5 pr-12 rounded border border-gray-600 outline-none focus:border-yellow-500"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old_password")}
                    aria-label={
                      showPasswords.old_password
                        ? "Hide current password"
                        : "Show current password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                  >
                    {showPasswords.old_password ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c5 0 9 7 9 7a13.16 13.16 0 0 1-2.16 2.57" />
                        <path d="M6.61 6.61C3.5 8.37 2 12 2 12s4 7 10 7a9.77 9.77 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPasswords.new_password ? "text" : "password"}
                    name="new_password"
                    placeholder="New password..."
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-800 p-2.5 pr-12 rounded border border-gray-600 outline-none focus:border-yellow-500"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new_password")}
                    aria-label={
                      showPasswords.new_password
                        ? "Hide new password"
                        : "Show new password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                  >
                    {showPasswords.new_password ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c5 0 9 7 9 7a13.16 13.16 0 0 1-2.16 2.57" />
                        <path d="M6.61 6.61C3.5 8.37 2 12 2 12s4 7 10 7a9.77 9.77 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type={showPasswords.confirm_password ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm new password..."
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-800 p-2.5 pr-12 rounded border border-gray-600 outline-none focus:border-yellow-500"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm_password")}
                    aria-label={
                      showPasswords.confirm_password
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                  >
                    {showPasswords.confirm_password ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c5 0 9 7 9 7a13.16 13.16 0 0 1-2.16 2.57" />
                        <path d="M6.61 6.61C3.5 8.37 2 12 2 12s4 7 10 7a9.77 9.77 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
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
