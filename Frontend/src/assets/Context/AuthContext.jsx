import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  // profile data for nav
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState({
    url: null,
    status: null,
  });
  const [user, setUser] = useState(null);
  const [showPictureOptions, setShowPictureOptions] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editProfileData, setEditProfileData] = useState({
    first_name: "",
    email: "",
  });
  const access_token = localStorage.getItem('access_token')
  const getProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("profile/");

      setUser(response.data);
      setProfilePic({
        url: response.data.profile_picture || "",
        status: response.data.picture_status || "default",
      });

      setEditProfileData({
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
  if (access_token) {
    getProfile();
  }
}, [access_token]);

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
      const imageStaus = response.data.picture_status;

      setProfilePic({
        url: imageUrl,
        status: imageStaus,
      });
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

  const delete_profile_picture = async () => {
    if (profilePic.status === "default") {
      showInlineMessage("error", "No profile picture available.");
      setShowPictureOptions(false);
      return;
    }

    try {
      const response = await api.delete("update-profile-picture/");
      const imageUrl = response.data.profile_picture;
      const imageStatus = response.data.picture_status;
      console.log(response.data.profile_picture)
      setProfilePic({
        url: imageUrl,
        status: imageStatus,
      });
      setUser((prev) => ({
        ...prev,
        profile_picture: imageUrl,
        picture_status: imageStatus,
      }));

      setShowPictureOptions(false);
      showInlineMessage("success", "Profile picture deleted successfully.");
    } catch (error) {
      showInlineMessage("error", "Failed to delete profile picture.");
    }
  };

  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
  };

  useEffect(() => {
    const username = signupData.username.trim();

    if (!username) {
      setUsernameStatus("");
      setUsernameChecking(false);
      return;
    }

    if (username.length < 4) {
      setUsernameStatus(
        "invalid , username must be contain ateleast 4 chracters ",
      );
      setUsernameChecking(false);
      return;
    }

    let cancelled = false;

    setUsernameStatus("");
    setUsernameChecking(true);

    const timer = setTimeout(async () => {
      try {
        const response = await api.post("check-username/", {
          username,
        });

        if (!cancelled) {
          setUsernameStatus(response.data.available ? "available" : "taken");
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Username Check Error:",
            error.response?.data || error.message,
          );

          setUsernameStatus("error");
        }
      } finally {
        if (!cancelled) {
          setUsernameChecking(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [signupData.username]);

  // Password validation
  const validatePassword = (password) => {
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.";
    }

    return "";
  };

  const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (Array.isArray(data?.non_field_errors)) {
      return data.non_field_errors[0];
    }

    if (data && typeof data === "object") {
      for (const value of Object.values(data)) {
        if (Array.isArray(value) && value.length > 0) {
          return String(value[0]);
        }

        if (typeof value === "string") {
          return value;
        }
      }
    }

    return fallback;
  };

  // Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (usernameChecking) {
      setPasswordError("Please wait while username is being checked.");
      return;
    }

    if (usernameStatus === "taken") {
      setPasswordError("Username is already taken.");
      return;
    }

    if (usernameStatus === "invalid") {
      setPasswordError("Username must contain at least 3 characters.");
      return;
    }

    if (usernameStatus === "error" || usernameStatus !== "available") {
      setPasswordError("Please check username availability first.");
      return;
    }

    const passwordErrorMessage = validatePassword(signupData.password);

    if (passwordErrorMessage) {
      setPasswordError(passwordErrorMessage);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("register/", {
        first_name: signupData.full_name,
        username: signupData.username.trim(),
        email: signupData.email.trim(),
        password: signupData.password,
      });

      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
      }

      if (response.data.refresh) {
        localStorage.setItem("refresh_token", response.data.refresh);
      }

      setSignupData({
        full_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setUsernameStatus("");
      navigate("/");
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data || error.message,
      );

      setPasswordError(getErrorMessage(error, "Registration failed."));
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setPasswordError("");

    try {
      const response = await api.post("login/", {
        username: loginData.username.trim(),
        password: loginData.password,
      });

      if (!response.data.access) {
        setPasswordError("Login failed: access token not received.");
        return;
      }

      localStorage.setItem("access_token", response.data.access);

      if (response.data.refresh) {
        localStorage.setItem("refresh_token", response.data.refresh);
      }

      setLoginData({
        username: "",
        password: "",
      });

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      setPasswordError(getErrorMessage(error, "Invalid username or password."));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signupData,
        loginData,
        handleSignupChange,
        handleLoginChange,
        handleSubmit,
        handleLogin,
        usernameStatus,
        usernameChecking,
        passwordError,
        profilePic,
        setProfilePic,
        user,
        setUser,
        editProfileData,
        setEditProfileData,
        showInlineMessage,
        showPictureOptions,
        setShowPictureOptions,
        loading,
        setLoading,
        handlePictureUpload,
        errorMsg,
        setErrorMsg,
        successMsg,
        setSuccessMsg,
        delete_profile_picture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
