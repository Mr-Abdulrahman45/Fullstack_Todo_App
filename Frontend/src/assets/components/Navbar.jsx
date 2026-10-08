import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      
      <nav className="hidden md:flex sticky top-0 z-50 items-center justify-between px-6 py-3 bg-gray-800 text-white shadow">

        <div className="text-xl font-bold">
          AI Study Planner
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-400 transition">
            Dashboard
          </Link>

          <Link to="/tasks" className="hover:text-blue-400 transition">
            Tasks
          </Link>

          <Link to="/profile">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-blue-400 transition"
            />
          </Link>
        </div>

      </nav>
      
      <nav className="md:hidden sticky top-0 z-50 bg-gray-800 text-white shadow">

        <div className="flex justify-between items-center px-4 py-3">

          <h1 className="font-bold text-lg">
            Todo App
          </h1>

          <button
            className="text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

        {menuOpen && (
          <div className="flex flex-col px-4 pb-4 gap-4 border-t border-gray-700">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              to="/tasks"
              onClick={() => setMenuOpen(false)}
            >
              Tasks
            </Link>
            <div>{user}</div>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              Profile
            </Link>

          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;