import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateProfileMutation } from "../../store/userApi";
import toast from "react-hot-toast";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function EditProfileModal({ isOpen, onClose, userData }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    email: "",
    address: {
      label: "",
      city: "",
      street: "",
    },
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        gender: userData.gender || "male",
        date_of_birth: userData.date_of_birth
          ? userData.date_of_birth.split("T")[0]
          : "",
        email: userData.email || "",
        address: {
          label: userData.address?.label || "",
          city: userData.address?.city || "",
          street: userData.address?.street || "",
        },
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        id: userData._id,
        ...formData,
      }).unwrap();

      toast.success(res.message || "Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-(--color-surface-card) w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl border border-(--color-border-base) flex flex-col">
        <div className="sticky top-0 z-10 bg-(--color-surface-card) flex justify-between items-center p-6 border-b border-(--color-border-base)">
          <h2 className="text-xl font-bold text-(--color-text-primary)">
            Edit Personal Details
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-(--color-text-muted)" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />

          <Input
            label="Primary Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01xxxxxxxxx"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-(--color-text-label) mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-(--color-border-input) bg-(--color-surface-input) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all cursor-pointer text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-(--color-text-label) mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-(--color-border-input) bg-(--color-surface-input) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary-500) outline-none text-sm"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-4 mt-2 border-t border-(--color-border-base)">
            <h3 className="text-sm font-bold text-(--color-text-primary) mb-4">
              Address Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Label (e.g., Home, Work)"
                type="text"
                name="label"
                value={formData.address.label}
                onChange={handleAddressChange}
                placeholder="Home"
              />
              <Input
                label="City"
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                placeholder="Cairo"
              />
              <div className="md:col-span-2">
                <Input
                  label="Street"
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main St"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-(--color-border-base)">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              isLoading={isLoading}
              className="bg-(--color-primary-700) hover:bg-(--color-primary-800) text-white min-w-[100px]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
