import { useState, useCallback } from "react";
import ChatWindow from "./ChatWindow";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import toast from "react-hot-toast";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const toggleChat = useCallback(() => {
    if (!user) {
      toast.error("Please log in to use the Rochetta Assistant.");
      return;
    }
    setIsOpen((prev) => !prev);
  }, [user]);

  const inCourierRoute = location.pathname.startsWith("/courier");
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  if (isAdmin || isDashboard || isAuthPage || inCourierRoute) {
    return null;
  }
  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-22 right-6 z-50 flex flex-col items-center animate-[bounce_3.5s_ease-in-out_infinite]">
          <div className="relative bg-white dark:bg-[#1e1e1e] text-(--color-text-primary) dark:text-white border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 select-none">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-md -z-10 animate-pulse"></div>

            <div className="relative bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-xl border border-emerald-400/20">
              <Bot className="h-5 w-5" />
              <span className="absolute top-[-2px] right-[-2px] flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="flex flex-col text-left pr-1">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">
                Rochetta AI
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                Ask me anything!
              </span>
            </div>

            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white dark:bg-[#1e1e1e] border-r border-b border-gray-200 dark:border-gray-800 rotate-45"></div>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary-700) text-white shadow-[0_4px_14px_0_rgba(22,101,52,0.39)] transition-all duration-300 hover:bg-(--color-primary-800) hover:scale-105 active:scale-95"
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        )}
      </button>

      {isOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};

export default ChatBotWidget;
