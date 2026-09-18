import { useSendMessageMutation } from "../api/chatApi";
import { useChatAutoScroll } from "../hooks/useChatAutoScroll";

const ChatMessages = ({ messages, isLoading }) => {
  const [, { isLoading: isSending }] = useSendMessageMutation({
    fixedCacheKey: "shared-send-message",
  });

  const endOfMessagesRef = useChatAutoScroll([messages, isSending]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--color-border-base) border-t-(--color-primary-700) dark:border-[#303030] dark:border-t-[#22C55E]"></div>
          <span className="animate-pulse text-sm text-(--color-text-muted)">
            Loading chat history...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-0 flex-1 scroll-smooth overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary-50) dark:bg-(--color-primary-900)/20 text-(--color-primary-700) dark:text-[#22C55E]">
            <svg
              className="h-8 w-8"
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
          <h4 className="text-lg font-semibold text-(--color-text-primary) dark:text-[#F9FAFB]">
            How can I help you?
          </h4>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            Ask me anything about our healthcare services.
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex w-full transition-all duration-300 ease-in-out ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "rounded-2xl rounded-br-sm bg-(--color-primary-700) text-white"
                  : "whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-(--color-primary-100) dark:border-(--color-primary-900)/30 bg-(--color-surface-card) dark:bg-(--color-panel-dark) text-(--color-text-body) dark:text-[#D1D5DB]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))
      )}

      {isSending && (
        <div className="flex justify-start">
          <div className="flex space-x-1.5 rounded-2xl rounded-bl-sm border border-(--color-primary-100) dark:border-(--color-primary-900)/30 bg-(--color-surface-card) dark:bg-(--color-panel-dark) px-4 py-3.5 shadow-sm">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-(--color-primary-700)/50 dark:bg-[#22C55E]/50"></div>
            <div
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-(--color-primary-700)/50 dark:bg-[#22C55E]/50"
              style={{ animationDelay: "0.15s" }}
            ></div>
            <div
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-(--color-primary-700)/50 dark:bg-[#22C55E]/50"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatMessages;
