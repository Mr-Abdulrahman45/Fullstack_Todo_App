import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const {
    loginData,
    handleLoginChange,
    handleLogin,
    passwordError,
  } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-lg text-white border border-gray-700/50">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Username or Email */}
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            value={loginData.username}
            onChange={handleLoginChange}
            required
            autoComplete="username"
            className="w-full bg-gray-700 text-white px-4 py-3.5 rounded-xl outline-none border border-gray-600 focus:border-blue-500 transition-colors"
          />

          {/* Password */}
          <div className="w-full relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              autoComplete="current-password"
              className="w-full bg-gray-700 text-white pl-4 pr-12 py-3.5 rounded-xl outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* Error Message */}
          {passwordError && (
            <div
              role="alert"
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-medium text-center"
            >
              {passwordError}
            </div>
          )}

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 py-3.5 text-white rounded-xl font-semibold hover:bg-green-700 transition active:scale-[0.98] shadow-md cursor-pointer"
          >
            Login
          </button>

        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?
          <Link
            to="/signup"
            className="text-blue-400 ml-2 hover:text-blue-300 font-semibold"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;

