import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";

const Signup = () => {
  const {
    signupData,
    handleSignupChange,
    handleSubmit,
    usernameStatus,
    usernameChecking,
    passwordError,
  } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700/50">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Start managing your tasks
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={signupData.full_name}
            onChange={handleSignupChange}
            required
            autoComplete="name"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
          />

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={signupData.username}
              onChange={handleSignupChange}
              required
              minLength={3}
              autoComplete="username"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
            />

            {usernameChecking && (
              <p className="text-gray-400 text-sm mt-1">
                Checking username...
              </p>
            )}

            {!usernameChecking && usernameStatus === "available" && (
              <p className="text-green-400 text-sm mt-1">
                Username is available.
              </p>
            )}

            {!usernameChecking && usernameStatus === "taken" && (
              <p className="text-red-400 text-sm mt-1">
                Username is already taken.
              </p>
            )}

            {usernameStatus === "invalid" && (
              <p className="text-red-400 text-sm mt-1">
                Username must contain at least 3 characters.
              </p>
            )}

            {usernameStatus === "error" && (
              <p className="text-red-400 text-sm mt-1">
                Unable to check username. Try again.
              </p>
            )}
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupData.email}
            onChange={handleSignupChange}
            required
            autoComplete="email"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
              autoComplete="new-password"
              className="w-full bg-gray-700 text-white pl-4 pr-12 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              required
              autoComplete="new-password"
              className="w-full bg-gray-700 text-white pl-4 pr-12 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? (
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
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm"
            >
              {passwordError}
            </div>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={
              usernameChecking || usernameStatus !== "available"
            }
            className="w-full bg-blue-600 text-white active:scale-95 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-400 ml-2 hover:text-blue-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;

