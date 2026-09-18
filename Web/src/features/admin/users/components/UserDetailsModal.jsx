import {
  X,
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  Shield,
} from "lucide-react";
import { useGetUserByIdQuery } from "../api/usersApi";
import Button from "../../../../components/ui/Button";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function UserDetailsModal({ isOpen, onClose, userId }) {
  const { data, isLoading, isError } = useGetUserByIdQuery(userId, {
    skip: !userId || !isOpen,
  });

  if (!isOpen) return null;

  const user = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) w-full max-w-2xl rounded-xl shadow-xl border border-(--color-border-base) dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-(--color-border-base) dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-(--color-text-primary) dark:text-white">
              User Profile
            </h2>
            <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
              Detailed view of user information.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <GlobalLoader width="w-8" height="h-8" animate-spin text="(--color-primary-600)" />
            </div>
          ) : isError || !user ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-(--color-danger-600) font-medium mb-4">
                Failed to load user data.
              </p>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="w-32 h-32 rounded-full bg-(--color-surface-muted) dark:bg-gray-800 border-4 border-white dark:border-[#252525] shadow-sm overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-(--color-text-muted)" />
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                >
                  {user.is_active ? "Active Account" : "Inactive Account"}
                </span>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-(--color-text-secondary) uppercase flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <p className="text-base font-medium text-(--color-text-primary) dark:text-white">
                    {user.name}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-(--color-text-secondary) uppercase flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Role
                  </label>
                  <p className="text-base font-medium text-(--color-text-primary) dark:text-white capitalize">
                    {user.role.replace("_", " ")}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-(--color-text-secondary) uppercase flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <p className="text-base font-medium text-(--color-text-primary) dark:text-white">
                    {user.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-(--color-text-secondary) uppercase flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <p className="text-base font-medium text-(--color-text-primary) dark:text-white">
                    {user.phone || "Not provided"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-(--color-text-secondary) uppercase flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Joined Date
                  </label>
                  <p className="text-base font-medium text-(--color-text-primary) dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
