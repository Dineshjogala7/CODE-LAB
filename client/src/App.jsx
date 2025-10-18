import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import EdiorCode from "./EdiorCode";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "./AuthContext";

const App = () => {
  const userName = localStorage.getItem("userName")
  const navigate = useNavigate();

  // Login / Logout handler
  const handleLogin = async () => {
    try {
      if (!userName) {
        const result = await signInWithPopup(auth, googleProvider);
        localStorage.setItem("userName", result.user.displayName);
        setUserName(result.user.displayName);
        navigate("/main");
      } else {
        await signOut(auth);
        localStorage.removeItem("userName")
        setUserName("");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ProtectedRoute
  const ProtectedRoute = ({ children }) => {
    if (!userName) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[50vh] bg-gray-100 w-full">
          <p className="text-7xl font-thin mb-8">Code Execution Made Simple</p>
          <span className="relative inline-block px-6 py-4 md:px-12 md:py-6">
            <span className="absolute inset-x-0 top-2 -bottom-2 -skew-y-3 transform bg-black md:top-3 md:-bottom-3 dark:bg-white"></span>
            <span className="relative text-4xl md:text-6xl font-serif tracking-widest text-white dark:text-black drop-shadow-lg">
              Sign UP for Code-Lab Access
            </span>
          </span>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <header className="max-w-7xl w-full py-4 mx-auto">
        <nav className="max-w-2xl w-full mx-auto flex justify-between items-center py-4 px-8 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-gray-300 dark:bg-black/20 dark:border-white/10">
          <h1 className="text-2xl font-light tracking-wider text-black dark:text-white">CODE-LAB</h1>
          <button
            className="text-lg font-light tracking-wider py-2 px-6 border border-black rounded-xl bg-black text-white hover:bg-gray-900 hover:scale-105 transition-all duration-300 shadow-md"
            onClick={handleLogin}
          >
            {userName ? "LOG-OUT" : "SIGN-UP"}
          </button>
        </nav>
      </header>

      {/* Routes */}
      <main className="min-h-[80vh] w-full flex justify-center items-center">
        <Routes>
          <Route
            path="/"
            element={
              userName ? (
                <EdiorCode />
              ) : (
                <div className="flex flex-col justify-center items-center min-h-[50vh] bg-gray-100 w-full">
                  <p className="text-7xl font-thin mb-8">Code Execution Made Simple</p>
                  <span className="relative inline-block px-6 py-4 md:px-12 md:py-6">
                    <span className="absolute inset-x-0 top-2 -bottom-2 -skew-y-3 transform bg-black md:top-3 md:-bottom-3 dark:bg-white"></span>
                    <span className="relative text-4xl md:text-6xl font-serif tracking-widest text-white dark:text-black drop-shadow-lg">
                      Sign UP for Code-Lab Access
                    </span>
                  </span>
                </div>
              )
            }
          />

          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <EdiorCode />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
