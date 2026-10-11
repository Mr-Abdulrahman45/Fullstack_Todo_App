import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "password") {
      setPasswordError("");
    }
  };

  // Username Checking
  useEffect(() => {
    const username = formData.username.trim();

    if (!username) {
      setUsernameStatus("");
      return;
    }

    if (username.length < 3) {
      setUsernameStatus("invalid");
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameChecking(true);

      try {
        const response = await api.post(
          "check-username/",
          { username }
        );

        setUsernameStatus(
          response.data.available
            ? "available"
            : "taken"
        );
      } catch (error) {
        console.log(
          "Username Check Error:",
          error.response?.data || error.message
        );

        setUsernameStatus("error");
      } finally {
        setUsernameChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Password Validation
  const validatePassword = (password) => {
 
    if (password.length < 8 || !/[A-Z]/.test(password) || 
    !/[a-z]/.test(password) || 
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)

    ) {
      return "Password must be at least 8 characters. Also must contain an uppercase and a lowercase letters and a number and  .";
    }
    return "";
  };

  // Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");

    if (usernameChecking) {
      return;
    }

    if (usernameStatus === "taken") {
      return;
    }

    const passwordErrorMessage = validatePassword(
      formData.password
    );

    if (passwordErrorMessage) {
      setPasswordError(passwordErrorMessage);
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post(
        "register/",
        {
          first_name: formData.full_name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      navigate("/");
    } catch (error) {
      console.log(
        "Registration Error:",
        error.response?.data || error.message
      );
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "login/",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      navigate("/");
    } catch (error){
      console.log(error.response?.data)
      setPasswordError(error.response?.data.non_field_errors[0] || 'invalid username or password')
    }
  };

  return (
    <AuthContext.Provider
      value={{
        formData,
        handleChange,
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