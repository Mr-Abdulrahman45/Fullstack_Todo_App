import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const {
    formData,
    handleChange,
    handleLogin,
    passwordError
  } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
          />
          
          {passwordError && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
              {passwordError}
            </div>
          )}

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 py-3 text-white rounded-lg font-semibold hover:bg-green-700 transition active:scale-95"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-400 ml-2 hover:text-blue-300"
          >
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;
