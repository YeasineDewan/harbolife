const ChatHistorySidebar = ({ isOpen, messages }) => {
  return (
    <div
      className={`absolute right-0 top-0 z-10 h-full w-[250px] transform bg-(--color-surface-card) dark:bg-(--color-panel-dark) border-l border-(--color-border-base) dark:border-[#303030] shadow-[-5px_0_15px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-(--color-border-base) dark:border-[#303030] bg-(--color-surface-page) dark:bg-[#242424] p-4">
          <h4 className="text-sm font-semibold text-(--color-text-primary) dark:text-[#F9FAFB]">
            Recent Inquiries
          </h4>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {messages.length === 0 ? (
            <p className="text-xs text-(--color-text-muted) text-center mt-4">
              No previous history.
            </p>
          ) : (
            messages
              .filter((m) => m.role === "user")
              .map((msg) => (
                <div
                  key={msg._id}
                  className="mb-3 cursor-pointer rounded-xl border border-transparent p-3 hover:border-(--color-border-base) dark:hover:border-[#303030] bg-(--color-surface-card) dark:bg-(--color-panel-dark) hover:bg-(--color-surface-page) dark:hover:bg-[#242424] hover:shadow-sm hover:-translate-y-[1px] transition-all duration-250"
                >
                  <span className="line-clamp-2 text-xs text-(--color-text-secondary) dark:text-[#D1D5DB] leading-relaxed">
                    {msg.content}
                  </span>
                  <span className="mt-2 block text-[10px] text-(--color-text-muted) font-medium">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistorySidebar;
