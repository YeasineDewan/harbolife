import { useState } from "react";
import { useSelector } from "react-redux";
import { X, Eye, EyeOff } from "lucide-react";
import { useCreateUserMutation } from "../api/usersApi";
import toast from "react-hot-toast";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function CreateUserModal({ isOpen, onClose }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const baseRoles = [
    { value: "user", label: "User" },
    { value: "courier", label: "Courier" },
    { value: "admin", label: "Admin" },
  ];

  const AVAILABLE_ROLES =
    currentUser?.role === "super_admin"
      ? [...baseRoles, { value: "super_admin", label: "Super Admin" }]
      : baseRoles;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createUser(formData).unwrap();
      toast.success(res.message || "User created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
      });
      setShowPassword(false);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create user");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) w-full max-w-2xl rounded-xl shadow-xl border border-(--color-border-base) dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-(--color-border-base) dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-(--color-text-primary) dark:text-white">
              Add New User
            </h2>
            <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
              Create a new user account and assign roles.
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
          <form
            id="create-user-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />

              <div className="relative">
                <Input
                  label="Password"
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
              />

              <div className="space-y-1 md:col-span-2">
                <label className="block text-(--color-text-label) dark:text-gray-300 font-semibold text-sm">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all cursor-pointer text-sm"
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-(--color-border-base) dark:border-gray-800 bg-(--color-surface-page) dark:bg-[#1a1a1a] flex justify-end gap-3">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-user-form"
            variant="solid"
            size="md"
            isLoading={isLoading}
            className="min-w-[120px]"
          >
            Create User
          </Button>
        </div>
      </div>
    </div>
  );
}
