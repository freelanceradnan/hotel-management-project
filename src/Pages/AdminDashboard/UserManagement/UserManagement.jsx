import React, { useMemo, useState } from "react";
import { useDeleteUserDataMutation, useGetUserDataQuery, useUpdateUserAndRoleMutation } from "../../../Feature/ApiSlice";
import { Check, Pencil, Trash, X } from "lucide-react";
import { toast } from "react-toastify";

const UserManagement = () => {
  const { data: TotalUserData, isLoading } = useGetUserDataQuery();
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [updateUser] = useUpdateUserAndRoleMutation();
  const [deleteUser] = useDeleteUserDataMutation();

  // Active users count
  const approveUser = useMemo(() => {
    return TotalUserData?.filter((user) => user.isActive === true) || [];
  }, [TotalUserData]);

  // Total admin users
  const AdminUser = useMemo(() => {
    return TotalUserData?.filter((user) => user.role === "admin") || [];
  }, [TotalUserData]);

  // Helper to open edit mode with pre-filled row values
  const startEditing = (user) => {
    setEditId(user.id);
    setEditRole(user.role || "user");
    setEditActive(user.isActive ?? true);
  };

  const submitUpdate = async (e, id) => {
    e.preventDefault();

    if (!id) {
      toast.error("User ID is missing. Cannot update.");
      return;
    }

    try {
      // Convert string "true"/"false" 
      const statusValue = editActive === "true" || editActive === true;

      await updateUser({ id: id, role: editRole, isActive: statusValue }).unwrap();
      
      toast.success('Update completed successfully');
      setEditId(null); 
    } catch (error) {
      console.error("Update Error:", error);
      const errorMsg = error?.data?.message || error?.message || "An unexpected error occurred";
      toast.error(`Update failed: ${errorMsg}`);
    }
  };

  const deleteUserHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User Deleted Successfully!');
      } catch (error) {
        console.error("Handler Catch Error: ", error);
        toast.error(error?.message || 'User deletion failed');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-zinc-400 font-medium animate-pulse">
        Loading user records...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-800 dark:text-gray-100">
        User Management Dashboard
      </h2>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-gray-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm transition-colors">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Authenticated Users</h2>
          <p className="text-3xl font-bold text-gray-800 dark:text-zinc-100 mt-1">{TotalUserData?.length || 0}</p>
        </div>
        <div className="border border-gray-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm transition-colors">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Approved Users</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{approveUser.length}</p>
        </div>
        <div className="border border-gray-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm transition-colors">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Banned Users</h2>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
            {(TotalUserData?.length || 0) - approveUser.length}
          </p>
        </div>
        <div className="border border-gray-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm transition-colors">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Total Admins</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{AdminUser.length}</p>
        </div>
      </div>

      {/* Users Table Workspace */}
      <div className="border border-gray-200 dark:border-zinc-700/60 rounded-xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Login Email</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-700/60 text-sm text-gray-700 dark:text-zinc-300">
              {TotalUserData?.map((user) => {
                const isCurrentlyEditing = editId === user.id;

                return (
                  <tr key={user.id} className="hover:bg-gray-50/70 dark:hover:bg-zinc-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-zinc-100">{user.email}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-zinc-400">
                      {user.createdAt ? user.createdAt.replace("T", " ").slice(0, 16) : "—"}
                    </td>

                    {/* Role Block */}
                    <td className="px-6 py-4">
                      {isCurrentlyEditing ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="border border-gray-300 dark:border-zinc-600 rounded px-2 py-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" 
                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30" 
                            : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                        }`}>
                          {user.role || "user"}
                        </span>
                      )}
                    </td>

                    {/* Account Status Block */}
                    <td className="px-6 py-4">
                      {isCurrentlyEditing ? (
                        <select
                          value={String(editActive)}
                          onChange={(e) => setEditActive(e.target.value)}
                          className="border border-gray-300 dark:border-zinc-600 rounded px-2 py-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                        >
                          <option value="true">Active</option>
                          <option value="false">Banned</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          user.isActive 
                            ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40" 
                            : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"}`} />
                          {user.isActive ? "Active" : "Banned"}
                        </span>
                      )}
                    </td>

                    {/* Action Block Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {isCurrentlyEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => submitUpdate(e, user.id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-700 p-1 hover:bg-green-50 dark:hover:bg-green-950/50 rounded transition-colors"
                              title="Confirm changes"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditId(null)}
                              className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded transition-colors"
                              title="Cancel editing"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditing(user)}
                              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded transition-colors"
                              title="Edit record"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="text-red-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 p-1 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors"
                              title="Delete user record"
                              onClick={() => deleteUserHandler(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;