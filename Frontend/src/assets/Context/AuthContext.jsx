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
      setUsernameStatus("invalid , username must be contain ateleast 4 chracters ");
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
          setUsernameStatus(
            response.data.available ? "available" : "taken"
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Username Check Error:",
            error.response?.data || error.message
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
        error.response?.data || error.message
      );

      setPasswordError(
        getErrorMessage(error, "Registration failed.")
      );
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
      console.error(
        "Login Error:",
        error.response?.data || error.message
      );

      setPasswordError(
        getErrorMessage(error, "Invalid username or password.")
      );
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

