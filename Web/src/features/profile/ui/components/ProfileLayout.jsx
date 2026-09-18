import { useRef, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { logout, setCredentials } from "../../../auth/store/authSlice";
import ProfileNav from "./ProfileNav";
import { useUpdateAvatarMutation } from "../../store/userApi";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [updateAvatar] = useUpdateAvatarMutation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const response = await updateAvatar(formData).unwrap();
      dispatch(setCredentials({ user: response.data, token: user.token }));
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update avatar");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-8 lg:px-12 mb-20 w-full transition-colors duration-300">
      <div className="bg-(--color-surface-card) rounded-[2rem] shadow-sm border border-(--color-border-base) p-8 sm:p-12 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-(--color-primary-400) to-(--color-primary-600) text-white rounded-full flex items-center justify-center shadow-lg border-4 border-(--color-surface-page) shrink-0 overflow-hidden">
                {isUploading ? (
                  <GlobalLoader
                    width="w-8"
                    height="h-8"
                    animate-spin
                    text="text-white"
                  />
                ) : user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name || "User"}'s avatar`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                ) : (
                  <User className="w-12 h-12" aria-hidden="true" />
                )}
              </div>

              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-(--color-surface-card) p-2.5 rounded-full shadow-md border border-(--color-border-input) hover:bg-(--color-surface-muted) transition-transform group-hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-(--color-primary-600)"
                aria-label="Upload new avatar"
              >
                <Camera
                  className="w-4 h-4 text-(--color-primary-600)"
                  aria-hidden="true"
                />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                tabIndex="-1"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-(--color-text-primary) mb-1 tracking-tight line-clamp-1">
                {user.name || user.username || "Valued Customer"}
              </h1>
              <p className="text-sm sm:text-base text-(--color-text-secondary) font-medium">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-(--color-danger-50) dark:bg-(--color-danger-900) text-(--color-danger-600) hover:bg-(--color-danger-100) dark:hover:bg-(--color-danger-800) rounded-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-danger-500)"
            aria-label="Sign out of your account"
          >
            <LogOut className="w-5 h-5 hidden sm:inline" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="pt-2 border-t border-(--color-border-base)">
          <ProfileNav />
        </div>
      </div>

      <div
        className="bg-(--color-surface-card) rounded-[2rem] shadow-sm border border-(--color-border-base) p-8 sm:p-12 min-h-[500px] focus-visible:outline-none"
        tabIndex="-1"
      >
        <Outlet />
      </div>
    </div>
  );
}
