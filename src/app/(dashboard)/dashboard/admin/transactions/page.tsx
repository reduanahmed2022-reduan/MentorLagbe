"use client";

import { useEffect, useState } from "react";
import { BadgeDollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { Transaction } from "@/lib/types";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ transactions: Transaction[] }>("/admin/transactions", { auth: true })
      .then((data) => setTransactions(data.transactions))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load transactions")
      )
      .finally(() => setLoading(false));
  }, []);

  const total = transactions
    .filter((item) => item.paymentStatus === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Transactions</h2>
          <p className="mt-1 text-sm text-slate-500">Pro subscription payments recorded by Stripe.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
          <BadgeDollarSign className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs font-semibold text-emerald-700">Total collected</p>
            <p className="text-lg font-extrabold text-emerald-800">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : transactions.length ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((item) => (
                <tr key={item._id} className="text-slate-600">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{item.userName}</p>
                    <p className="text-xs text-slate-400">{item.userEmail}</p>
                  </td>
                  <td className="px-5 py-4 capitalize">{item.planName} · {item.userRole}</td>
                  <td className="px-5 py-4 font-bold text-slate-800">
                    ${Number(item.amount).toFixed(2)} <span className="text-xs font-normal text-slate-400">{item.currency?.toUpperCase()}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={item.paymentStatus} /></td>
                  <td className="px-5 py-4 text-xs">
                    {item.paidAt ? new Date(item.paidAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-slate-800">No transactions yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Pro purchases will appear here once payments are completed.
          </p>
        </div>
      )}
    </div>
  );
}
