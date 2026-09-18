import { useState } from "react";
import { useSelector } from "react-redux";
import { Users, Trash2, PlusCircle, Search, Filter } from "lucide-react";
import DynamicTable from "../../components/DynamicTable";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  useGetUsersQuery,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../api/usersApi";
import toast from "react-hot-toast";
import CreateUserModal from "../components/CreateUserModal";
import UserDetailsModal from "../components/UserDetailsModal";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function UsersPage() {
  const currentUser = useSelector((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const { data, isLoading } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch,
    role: roleFilter,
    is_active: statusFilter,
  });

  const [toggleStatus] = useToggleUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();

  const usersData = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const handleToggle = async (row) => {
    try {
      await toggleStatus({
        userId: row._id,
        is_active: !row.is_active,
      }).unwrap();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleRoleChange = async (e, id) => {
    e.stopPropagation();
    const newRole = e.target.value;
    try {
      await updateUserRole({ id, role: newRole }).unwrap();
      toast.success("Role updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update role");
    }
  };

  const columns = [
    {
      key: "user",
      label: "User",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-(--color-surface-muted) dark:bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center">
            {row.avatar ? (
              <img
                src={row.avatar}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-(--color-text-secondary) font-medium text-sm">
                {row.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-(--color-text-primary) dark:text-white">
              {row.name}
            </span>
            <span className="text-xs text-(--color-text-secondary)">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (val, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={val}
            onChange={(e) => handleRoleChange(e, row._id)}
            disabled={
              isUpdatingRole ||
              (row.role === "super_admin" &&
                currentUser?.role !== "super_admin")
            }
            className="text-sm font-medium px-3 py-1.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none cursor-pointer"
          >
            <option value="user">User</option>
            <option value="courier">Courier</option>
            <option value="admin">Admin</option>
            {(val === "super_admin" || currentUser?.role === "super_admin") && (
              <option value="super_admin">Super Admin</option>
            )}
          </select>
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      align: "center",
      render: (val, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={val}
              onChange={() => handleToggle(row)}
              disabled={
                row.role === "super_admin" &&
                currentUser?.role !== "super_admin"
              }
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-(--color-primary-600)"></div>
          </label>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (val) => new Date(val).toLocaleDateString("en-GB"),
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
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 text-(--color-text-muted) hover:text-(--color-danger-600) hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            disabled={row.role === "super_admin"}
            aria-label="Delete User"
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
          <h1 className="text-2xl font-bold text-(--color-text-primary) dark:text-white">
            Users Management
          </h1>
          <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
            Manage your system users, roles, and access.
          </p>
        </div>
        <Button
          variant="solid"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-(--color-primary-700) hover:bg-(--color-primary-800) shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Add User
        </Button>
      </div>

      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) p-4 rounded-xl shadow-sm border border-(--color-border-base) dark:border-gray-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            icon={<Search className="w-4 h-4 text-(--color-text-muted)" />}
            className="border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10 pointer-events-none" />
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all cursor-pointer appearance-none text-sm"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="courier">Courier</option>
              <option value="admin">Admin</option>
              {currentUser?.role === "super_admin" && (
                <option value="super_admin">Super Admin</option>
              )}
            </select>
          </div>

          <div className="relative flex-1 sm:w-40">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all cursor-pointer appearance-none text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <DynamicTable
        columns={columns}
        data={usersData}
        rowKey="_id"
        isLoading={isLoading}
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        emptyMessage="No users found in the system."
        emptyIcon={Users}
        onRowClick={(row) => setSelectedUserId(row._id)}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UserDetailsModal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
      />
    </div>
  );
}
