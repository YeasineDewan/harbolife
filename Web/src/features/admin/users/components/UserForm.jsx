import { useSelector } from "react-redux";
import { useState } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function UserForm({ onSubmit, isLoading }) {
  const currentUser = useSelector((state) => state.auth.user);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-(--color-surface-card) dark:bg-(--color-panel-dark) p-6 rounded-xl border border-(--color-border-base) dark:border-gray-800 shadow-sm"
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

        <Input
          label="Password"
          required
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          placeholder="Enter a strong password"
        />

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

      <div className="flex justify-end pt-6 mt-2 border-t border-(--color-border-base) dark:border-gray-800">
        <Button
          type="submit"
          variant="solid"
          size="md"
          isLoading={isLoading}
          className="min-w-[140px]"
        >
          Create User
        </Button>
      </div>
    </form>
  );
}
