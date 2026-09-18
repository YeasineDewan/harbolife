import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/NavBar/Header";
import SubNavbar from "./components/SubNavBar/SubNavbar";
import AppRouter from "./app/router/AppRouter";
import Footer from "./components/Footer/footer";
import ChatBotWidget from "./features/chatbot/components/ChatBotWidget";

export default function App() {
  const { darkMode } = useSelector((state) => state.ui);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isCourier = location.pathname.startsWith("/courier");
  const authPaths = ["/login", "/signup"];
  const shouldHideNavbar = isDashboard || isCourier || authPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full transition ">
      <Toaster position="top-center" reverseOrder={false} />

      {!shouldHideNavbar && (
        <>
          <Navbar />
          <SubNavbar />
        </>
      )}

      <main
        className={`grow w-full flex flex-col ${!shouldHideNavbar ? "pt-28" : ""}`}
      >
        <AppRouter />
        {!shouldHideNavbar && <Footer />}
      </main>

      <ChatBotWidget />
    </div>
  );
}
