import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../api/categoriesApi";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function CategoryForm({ isOpen, onClose, categoryToEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const isEditMode = !!categoryToEdit;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setDescription(categoryToEdit.description || "");
      setImagePreview(categoryToEdit.image || "");
    } else {
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
    }
  }, [categoryToEdit, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) {
      formData.append("img", imageFile);
    }

    try {
      if (isEditMode) {
        await updateCategory({ id: categoryToEdit._id, formData }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully!");
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) w-full max-w-2xl rounded-xl shadow-xl border border-(--color-border-base) dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-(--color-border-base) dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-(--color-text-primary) dark:text-white">
              {isEditMode ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
              {isEditMode
                ? "Update the details of this category."
                : "Create a new product category."}
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
            id="category-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <Input
              label="Category Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vitamins & Supplements"
            />

            <div className="space-y-1">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description..."
                className="w-full px-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-600 bg-(--color-surface-input) dark:bg-(--color-panel-dark) text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">
                Category Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-(--color-border-input) dark:border-gray-700 border-dashed rounded-lg relative hover:bg-gray-50 dark:hover:bg-(--color-panel-dark) transition-colors bg-(--color-surface-input) dark:bg-(--color-panel-dark)">
                <div className="space-y-2 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 object-cover rounded-lg border border-(--color-border-base) dark:border-gray-700"
                    />
                  ) : (
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  )}
                  <div className="flex text-sm text-(--color-text-secondary) dark:text-gray-400 justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-(--color-primary-600) hover:text-(--color-primary-700) focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="img"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                        required={!isEditMode}
                      />
                    </label>
                  </div>
                </div>
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
            form="category-form"
            variant="solid"
            size="md"
            isLoading={isLoading}
            className="min-w-[120px]"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
