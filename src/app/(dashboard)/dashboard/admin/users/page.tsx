"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

type AdminUser = Omit<AuthUser, "id"> & {
  _id: string;
  createdAt?: string;
  plan?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ users: AdminUser[] }>("/admin/users", { auth: true })
      .then((data) => setUsers(data.users))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load users")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRole = async (user: AdminUser, role: "student" | "tutor") => {
    setBusyId(user._id);

    try {
      const data = await apiFetch<{ message?: string; user: AdminUser }>(`/admin/users/${user._id}/role`, {
        method: "PATCH",
        auth: true,
        body: { role },
      });
      setUsers((items) =>
        items.map((item) => (item._id === user._id ? { ...item, role: data.user.role } : item))
      );
      toast.success(data.message || `Role updated to ${role}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update role");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">User Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            {users.length} registered accounts. Change roles with one click.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users…"
            className="w-64 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Change role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr key={user._id} className="text-slate-600">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={user.role} /></td>
                  <td className="px-5 py-4"><StatusBadge status={user.plan || "free"} /></td>
                  <td className="px-5 py-4 text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-4">
                    {user.role === "admin" ? (
                      <span className="text-xs text-slate-400">Protected</span>
                    ) : (
                      <div className="flex gap-2">
                        {(["student", "tutor"] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            disabled={user.role === role || busyId === user._id}
                            onClick={() => handleRole(user, role)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition disabled:cursor-not-allowed disabled:opacity-40 ${
                              user.role === role
                                ? "bg-indigo-600 text-white"
                                : "border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <p className="p-10 text-center text-sm text-slate-500">No users match your search.</p>
          )}
        </div>
      )}
    </div>
  );
}
