import React, { useContext, useMemo } from "react";
import {
  useGetPaymentRequestQuery,
  useMakePendingPaymentMutation,
} from "../../../Feature/ApiSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../../Contexts/StoreContext";

const AdminPayment = () => {
  const { isOrderNotify, isListingNotify, isPaymentNotify } = useContext(StoreContext);
  const {
    data: allPaymentRequest,
    isLoading,
    isError,
  } = useGetPaymentRequestQuery();
  const [updatePaymentStatus, { isLoading: isUpdating }] =
    useMakePendingPaymentMutation();

  // counting pendingpay ,paid pay
  const { pendingPayments, paidPayments } = useMemo(() => {
    if (!allPaymentRequest) return { pendingPayments: [], paidPayments: [] };
    return {
      pendingPayments: allPaymentRequest.filter(
        (c) => c.status === "Payment Pending",
      ),
      paidPayments: allPaymentRequest.filter((c) => c.status === "Paid"),
    };
  }, [allPaymentRequest]);

  // makepay handler
  const makePayment = async ({ e, id, email, Price }) => {
    e.preventDefault();
    console.log(email, Price); 
    const value = {
      TransectionHash: Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase(),
    };

    try {
      // update pay status
      await updatePaymentStatus({ id, value }).unwrap();
      // emailjs implementations
      if (isPaymentNotify) {
        const emailParams = {
          service_id: import.meta.env.VITE_EMAILJS_CONTACT_SERVICE_ID,
          template_id: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
          user_id: import.meta.env.VITE_EMAILJS_CONTACT_PUBLIC_KEY,
          template_params: {
            user_name: email || "User",
            ammount: Price || 0,
            user_email: email,
            hash: value.TransectionHash,
            message: "Your payout request has been approved and processed!", 
          },
        };
      
        await axios.post(
          "https://api.emailjs.com/api/v1.0/email/send",
          emailParams,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
        
      toast.success("Payment completed and email sent successfully!");
    } catch (error) {
      console.error("Payment action error:", error);
      toast.error(error?.data || "Failed to update payment status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-transparent">
        <p className="text-gray-500 dark:text-zinc-400 font-medium animate-pulse">Loading payment data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 bg-transparent">
        <p className="text-red-500 dark:text-red-400 font-medium">
          Something went wrong loading payments.
        </p>
      </div>
    );
  }

  const hasPaidOrders = allPaymentRequest?.some((order) => order.status === "Paid");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 uppercase">
          Payment Request Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage incoming system requests and update client payout statuses.
        </p>
      </div>

      {/* Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700/60 p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors">
          <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
            Pending Payments
          </h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {pendingPayments.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700/60 p-5 rounded-lg shadow-sm flex flex-col justify-between transition-colors">
          <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
            Paid Payments
          </h3>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {paidPayments.length}
          </p>
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700/60 rounded-lg shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-4">Owner Email</th>
                <th className="px-6 py-4">Order Id</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                {hasPaidOrders && <th className="px-6 py-4">Transaction Hash</th>}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700/60 text-sm text-gray-700 dark:text-zinc-300">
              {allPaymentRequest && allPaymentRequest.length > 0 ? (
                allPaymentRequest.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-zinc-100">
                      {order.owner || "—"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-zinc-400">
                      {order.OrderId || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          order.status === "Paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-zinc-100">
                      ${order.Price || "0.00"}
                    </td>
                    
                    {hasPaidOrders && (
                      <td className="px-6 py-4 font-mono text-xs">
                        {order.status === "Paid" ? (
                          <span className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded text-gray-800 dark:text-zinc-200 font-medium">
                            #{order.TransectionHash || "NO Hash"}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-zinc-500">—</span>
                        )}
                      </td>
                    )}

                    <td className="px-6 py-4 text-right">
                      {order.status === "Payment Pending" ? (
                        <button
                          disabled={isUpdating}
                          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:disabled:bg-indigo-400 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer"
                          type="button"
                          onClick={(e) => makePayment({ e, id: order.id, email: order.owner, Price: order.Price })}
                        >
                          {isUpdating ? "Processing..." : "Approve Payout"}
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-gray-400 dark:text-zinc-500 italic">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={hasPaidOrders ? "6" : "5"}
                    className="px-6 py-10 text-center text-gray-400 dark:text-zinc-500 italic"
                  >
                    No transactions or requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;