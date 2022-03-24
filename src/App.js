import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./components/Home/Home";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import { LoaderProvider } from "./context/LoaderContext";
import Booking from "./components/Booking/Booking";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Header from "./components/Header/Header";
import ProtectedRoute from "./utils/ProtectedRoute";
import { getMe } from "./api/authApi";
import Profile from "./components/Profile/Profile";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { useAuthContext } from "./store/auth-context";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");

const App = () => {
  const authCtx = useAuthContext();
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Header />
      <AuthProvider>
        <LoaderProvider>
          <Routes>
            {!authCtx.isLoggedIn && <Route path="/login" element={<Login />} />}
            {!authCtx.isLoggedIn && (
              <Route path="/signup" element={<Signup />} />
            )}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            {authCtx.user?.role === "admin" && (
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            )}
            <Route
              path="/doctor/:id"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<p>Not found</p>} />
          </Routes>
        </LoaderProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
