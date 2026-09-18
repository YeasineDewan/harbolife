import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SignupForm from "./components/SignupForm";

import SignUpImg from "../../../assets/Auth/signup.webp";
import LoginBg from "../../../assets/Auth/login_background.webp";

export default function Signup() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${LoginBg})` }}
    >
      <div className="absolute inset-0 bg-[#012b01]/70 backdrop-blur-md z-0"></div>

      <div className="relative z-10 w-full max-w-4xl bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300 border border-(--color-border-base) dark:border-gray-800">
        <div className="hidden md:flex md:w-1/2 p-8 items-center justify-center bg-(--color-surface-page) dark:bg-[#252525]">
          <img
            src={SignUpImg}
            alt="Sign Up"
            className="w-full h-100 max-w-sm rounded-2xl shadow-lg object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
          <Link
            to="/"
            className="absolute top-6 left-6 text-(--color-text-secondary) hover:text-(--color-primary-600) dark:hover:text-green-400 flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>

          <h2 className="text-3xl font-bold text-(--color-primary-600) dark:text-green-400 text-center mb-6 mt-4">
            Create An Account
          </h2>

          <SignupForm />

          <p className="mt-4 text-center text-(--color-text-secondary) dark:text-gray-400 font-medium text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-(--color-primary-600) dark:text-green-400 hover:underline font-bold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
