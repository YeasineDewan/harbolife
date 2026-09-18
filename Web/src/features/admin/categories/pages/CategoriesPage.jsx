import { useState } from "react";
import { PlusCircle, Edit, Trash2, Search, FolderTree } from "lucide-react";
import toast from "react-hot-toast";
import DynamicTable from "../../components/DynamicTable";
import CategoryForm from "../components/CategoryForm";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../api/categoriesApi";
import Button from "../../../../components/ui/Button";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading } = useGetCategoriesQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category, e) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete category");
      }
    }
  };

  const columns = [
    {
      key: "category",
      label: "Category",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-(--color-surface-muted) dark:bg-gray-700 overflow-hidden shrink-0 border border-(--color-border-base) dark:border-gray-700 flex items-center justify-center">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FolderTree className="w-5 h-5 text-(--color-text-muted)" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-(--color-text-primary) dark:text-(--color-text-primary) capitalize">
              {row.name}
            </span>
            <span className="text-xs text-(--color-text-secondary)">
              {row.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (val) => (
        <span
          className="truncate max-w-xs block text-sm text-(--color-text-secondary) dark:text-gray-300"
          title={val}
        >
          {val}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleEdit(row, e)}
            className="text-gray-400 hover:text-(--color-primary-600) hover:bg-(--color-primary-50) dark:hover:bg-(--color-primary-900)"
            aria-label="Edit category"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleDelete(row._id, e)}
            className="text-gray-400 hover:text-(--color-danger-600) hover:bg-(--color-danger-50) dark:hover:bg-(--color-danger-900)"
            aria-label="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text-primary) dark:text-(--color-text-primary)">
            Categories Management
          </h1>
          <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
            Manage product categories and classifications.
          </p>
        </div>
        <Button
          variant="solid"
          size="md"
          onClick={handleCreate}
          className="bg-(--color-primary-700) hover:bg-(--color-primary-800) shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) p-4 rounded-xl shadow-sm border border-(--color-border-base) dark:border-gray-800 flex items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary-700) outline-none transition-all"
          />
        </div>
      </div>

      <DynamicTable
        columns={columns}
        data={categories}
        rowKey="_id"
        isLoading={isLoading}
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        emptyMessage="No categories found."
        emptyIcon={FolderTree}
      />

      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={selectedCategory}
      />
    </div>
  );
}
