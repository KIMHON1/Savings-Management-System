// src/pages/Home.js
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
        Welcome to Our App
      </h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Manage your account securely with device verification and smart login.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-800 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
