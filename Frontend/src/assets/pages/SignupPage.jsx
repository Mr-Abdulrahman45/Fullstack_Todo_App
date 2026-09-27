import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import eye from '../../../public/eye.png';
import eyeSlash from '../../../public/eye-slash.png';

const Signup = () => {
    const {
        handleSubmit,
        handleChange,
        formData,
        passwordError,
    } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-lg">

                <h1 className="text-3xl font-bold text-center text-white mb-2">
                    Create Account
                </h1>

                <p className="text-gray-400 text-center mb-8">
                    Start managing your tasks
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
                    />

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
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
                    />
                    <div className="relative">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
                    /><img src={eye} alt="Eye" className="absolute right-3 top-3 cursor-pointer" width={30}/>
                    </div>

                    {passwordError && (
                        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
                            {passwordError}
                        </div>
                    )}

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white active:scale-95 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Sign Up
                    </button>

                </form>

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