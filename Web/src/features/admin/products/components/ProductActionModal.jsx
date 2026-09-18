import { X } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../../products/api/productsApi";
import Button from "../../../../components/ui/Button";

export default function ProductActionModal({ isOpen, onClose, productToEdit }) {
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  if (!isOpen) return null;

  const isEditMode = !!productToEdit;
  const isLoading = isAdding || isUpdating;

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateProduct({ id: productToEdit._id, data: formData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await addProduct(formData).unwrap();
        toast.success("Product created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-(--color-border-base) dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-(--color-border-base) dark:border-gray-800">
          <h2 className="text-xl font-bold text-(--color-text-primary) dark:text-white">
            {isEditMode ? "Edit Product" : "Create New Product"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <ProductForm
            initialData={productToEdit}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
