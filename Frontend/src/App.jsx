import React from "react";
import Navbar from "./assets/components/Navbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./assets/pages/Dashboard";
import TasksPage from "./assets/pages/TasksPage";
import Profile from "./assets/pages/Profile";
import Login from "./assets/pages/LoginPage";
import Signup from "./assets/pages/SignupPage";
import ProtectedRoute from "./assets/pages/ProtectedRoute";
import Forgot_password from "./assets/pages/Forgot_password";
import PublicRoute from "./assets/pages/PublicRoute";
import NotFound from "./assets/pages/NotFound";
import ViewProfilePicture from "./assets/pages/ViewProfilePicture";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Navbar />
              <TasksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <Forgot_password />
            </PublicRoute>
          }
        />
        <Route path="/view-profile-picture" element={<ViewProfilePicture/>} />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
    
  );
};

export default App;
