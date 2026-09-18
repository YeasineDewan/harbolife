import { useState } from "react";
import { useGetChatHistoryQuery } from "../api/chatApi";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatHistorySidebar from "./ChatHistorySidebar";

const ChatWindow = ({ onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data, isLoading } = useGetChatHistoryQuery();

  const history = data?.data?.history || [];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[calc(100vh-120px)] sm:w-[400px]">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm sm:hidden"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full flex-col overflow-hidden bg-(--color-surface-card) dark:bg-(--color-panel-dark) shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-(--color-border-base) dark:border-[#303030] sm:rounded-2xl transition-all">
        <div className="flex items-center justify-between border-b border-(--color-border-base) dark:border-[#303030] bg-(--color-surface-card) dark:bg-(--color-panel-dark) p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-full p-2 text-(--color-text-secondary) dark:text-[#D1D5DB] hover:bg-gray-100 dark:hover:bg-[#242424] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-primary-50) dark:bg-(--color-primary-900)/30 text-(--color-primary-700) dark:text-[#22C55E]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  ></path>
                </svg>
              </div>
              <h3 className="font-semibold text-(--color-text-primary) dark:text-[#F9FAFB]">
                Rochetta Assistant
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-(--color-text-secondary) dark:text-[#D1D5DB] hover:bg-gray-100 dark:hover:bg-[#242424] transition-colors"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>

        <div className="relative flex flex-1 overflow-hidden bg-(--color-surface-page) dark:bg-[#121212]">
          <div className="flex w-full flex-col">
            <ChatMessages messages={history} isLoading={isLoading} />
            <ChatInput />
          </div>

          <ChatHistorySidebar isOpen={isSidebarOpen} messages={history} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
