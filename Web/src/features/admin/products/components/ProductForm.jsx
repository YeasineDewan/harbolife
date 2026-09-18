import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useGetCategoriesQuery } from "../../../admin/categories/api/categoriesApi";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function ProductForm({
  initialData = null,
  onSubmit,
  isLoading,
}) {
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categories = categoriesResponse?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    requires_prescription: false,
    has_strips: false,
    strip_count: "",
    strips_per_box: "",
    is_active: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category?._id || "",
        stock: initialData.stock || "",
        requires_prescription: initialData.requires_prescription || false,
        has_strips: initialData.has_strips || false,
        strip_count: initialData.strip_count || "",
        strips_per_box: initialData.strips_per_box || "",
        is_active: initialData.is_active ?? true,
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(initialData?.image || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-(--color-border-input) dark:border-gray-700 overflow-hidden flex items-center justify-center bg-(--color-surface-input) dark:bg-[#252525]">
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {imageFile && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1 right-1 p-1 bg-(--color-danger-600) text-white rounded-full hover:bg-(--color-danger-700)"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-(--color-text-muted)">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <span className="text-xs">Upload Image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <Input
          label="Product Name"
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="block text-(--color-text-label) dark:text-gray-300 font-semibold text-sm">
            Category
          </label>
          <select
            required
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Stock */}
        <Input
          label="Price"
          required
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <Input
          label="Stock"
          required
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
        />

        {/* Description - Full Width */}
        <div className="space-y-1 md:col-span-2">
          <label className="block text-(--color-text-label) dark:text-gray-300 font-semibold text-sm">
            Description
          </label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all resize-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="requires_prescription"
            id="requires_prescription"
            checked={formData.requires_prescription}
            onChange={handleChange}
            className="w-4 h-4 text-(--color-primary-700) bg-(--color-surface-input) border-(--color-border-input) rounded focus:ring-(--color-primary-500) dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="requires_prescription"
            className="text-sm font-medium text-(--color-text-label) dark:text-gray-300"
          >
            Requires Prescription
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="has_strips"
            id="has_strips"
            checked={formData.has_strips}
            onChange={handleChange}
            className="w-4 h-4 text-(--color-primary-700) bg-(--color-surface-input) border-(--color-border-input) rounded focus:ring-(--color-primary-500) dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="has_strips"
            className="text-sm font-medium text-(--color-text-label) dark:text-gray-300"
          >
            Has Strips 
          </label>
        </div>

        {formData.has_strips && (
          <>
            <Input
              label="Strip Count"
              required={formData.has_strips}
              type="number"
              name="strip_count"
              value={formData.strip_count}
              onChange={handleChange}
            />
            <Input
              label="Strips Per Box"
              required={formData.has_strips}
              type="number"
              name="strips_per_box"
              value={formData.strips_per_box}
              onChange={handleChange}
            />
          </>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4 border-t border-(--color-border-base) dark:border-gray-800">
        <Button
          type="submit"
          variant="solid"
          size="md"
          isLoading={isLoading}
          className="min-w-[140px]"
        >
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
