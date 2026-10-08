import React from 'react'
import Navbar from './assets/components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './assets/pages/Dashboard'
import TasksPage from './assets/pages/TasksPage'
import Profile from './assets/pages/Profile'
import Login from './assets/pages/LoginPage'
import Signup from './assets/pages/SignupPage'
import ProtectedRoute from './assets/pages/ProtectedRoute'
import Forgot_password from './assets/pages/Forgot_password'


const App = () => {
  return (
    <>

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

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
            <ProtectedRoute>
              <Navbar />
              <Forgot_password/>
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  )
}

export default App
