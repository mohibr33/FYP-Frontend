import React, { useEffect, useMemo, useState } from "react";
import { Search, Edit, Trash2, Save, X } from "lucide-react";

const API = "http://localhost:5000/api";

function AdminUsers() {
  const token = localStorage.getItem("hp:token");
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/admin/users`, { headers });
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading users:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const filtered = list.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
      u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditData({ ...user });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const saveUser = async (userId) => {
    try {
      setSaving(userId);
      const res = await fetch(`${API}/admin/users/${userId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          firstName: editData.firstName,
          lastName: editData.lastName,
          phone: editData.phone,
          email: editData.email,
          gender: editData.gender,
          role: editData.role,
        }),
      });

      if (!res.ok) throw new Error("Failed to update user");
      const updated = await res.json();

      setList((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
      setEditingId(null);
      setEditData({});
      alert("✅ User updated successfully!");
    } catch (error) {
      console.error("Error saving user:", error);
      alert("❌ Failed to update user. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        "⚠️ Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;
    try {
      const res = await fetch(`${API}/admin/users/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setList((p) => p.filter((x) => x._id !== id));
      alert("✅ User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Failed to delete user. Please try again.");
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
          User Management
        </h1>
        <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-3 mb-5 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          className="outline-none flex-1 text-base"
          placeholder="Search users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* compact + fixed layout */}
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col style={{ width: "12%" }} /> {/* ID */}
              <col style={{ width: "18%" }} /> {/* Name */}
              <col style={{ width: "30%" }} /> {/* Email */}
              <col style={{ width: "16%" }} /> {/* Phone */}
              <col style={{ width: "14%" }} /> {/* Gender */}
              <col style={{ width: "10%" }} /> {/* Role */}
              <col style={{ width: "10%" }} /> {/* Actions */}
            </colgroup>

            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Gender</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  {/* ID (read-only) */}
                  <td className="px-4 py-3 text-gray-700">
                    <span title={u._id}>{String(u._id).slice(0, 8)}…</span>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium">
                    {editingId === u._id ? (
                      <div className="flex gap-2">
                        <input
                          value={editData.firstName || ""}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                        <input
                          value={editData.lastName || ""}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                    ) : (
                      <span className="block truncate">
                        {u.firstName} {u.lastName}
                      </span>
                    )}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-gray-700">
                    {editingId === u._id ? (
                      <input
                        value={editData.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="block break-words">{u.email}</span>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-gray-700">
                    {editingId === u._id ? (
                      <input
                        value={editData.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="block">{u.phone || "-"}</span>
                    )}
                  </td>

                  {/* Gender */}
                  <td className="px-4 py-3 text-gray-700">
                    {editingId === u._id ? (
                      <select
                        value={editData.gender || ""}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className="border rounded px-2 py-1 w-full bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span>{u.gender}</span>
                    )}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    {editingId === u._id ? (
                      <select
                        value={editData.role || ""}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="px-2 py-1 rounded-full text-xs font-medium border-0 bg-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    {editingId === u._id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => saveUser(u._id)}
                          disabled={saving === u._id}
                          className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 disabled:opacity-50"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(u)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(u._id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="px-6 py-8 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}
    </section>
  );
}

export default AdminUsers;
