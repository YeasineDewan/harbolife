import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../api/notificationsApi";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: notificationsData, isLoading } = useGetNotificationsQuery({
    page: 1,
    limit: 10,
  });
  const { data: unreadData } = useGetUnreadCountQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadData?.unreadCount || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
      toast.success("Marked as read");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update notification");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update notifications");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-all text-gray-800 dark:text-gray-300"
        aria-label="Toggle notifications"
      >
        <Bell className="w-5.5 h-5.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-danger-600) text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-[-70px] sm:right-0 mt-2 w-[90vw] sm:w-96 max-w-[380px] bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-2xl shadow-2xl border border-(--color-border-base) dark:border-gray-800 z-50 overflow-hidden origin-top-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border-base) dark:border-gray-800">
            <h3 className="font-bold text-sm text-(--color-text-primary) dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAll}
                className="text-xs text-(--color-primary-600) dark:text-green-400 hover:underline flex items-center gap-1 font-medium h-auto py-1 px-2"
              >
                <CheckCheck className="w-4 h-4" /> Mark all as read
              </Button>
            )}
          </div>

          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-(--color-border-base) dark:divide-gray-800">
            {isLoading ? (
              <div className="py-6 text-center text-sm text-(--color-text-muted)">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-(--color-text-muted)">
                No notifications found
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleMarkAsRead(item._id, item.isRead)}
                  className={`p-4 transition-colors cursor-pointer flex gap-3 items-start ${
                    item.isRead
                      ? "bg-(--color-surface-card) dark:bg-[#1e1e1e] opacity-75"
                      : "bg-(--color-primary-50)/50 dark:bg-(--color-primary-900)/20"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-(--color-text-primary) dark:text-white">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-(--color-text-muted)">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-(--color-text-secondary) dark:text-gray-300 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-(--color-primary-600) mt-1 shrink-0"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
