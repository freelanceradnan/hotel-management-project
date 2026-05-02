import React from 'react';
import { Ticket, Info } from 'lucide-react';

const MyCoupon = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="border-b border-gray-100 pb-6 mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Coupons</h2>
        <p className="text-gray-500 mt-2 flex items-center gap-2">
          <Info size={16} className="text-blue-500" />
          Collect and manage your discount vouchers for your next stay.
        </p>
      </div>

      {/* Active Coupons Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Active Coupons</h3>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
            0 Available
          </span>
        </div>

        {/* Empty State Card */}
        <div className="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Ticket size={48} className="text-gray-300 -rotate-12" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700">No active coupons</h4>
          <p className="text-gray-500 text-sm text-center max-w-xs mt-2">
            You don't have any coupons right now. Keep an eye on your inbox for exclusive deals and seasonal offers!
          </p>
        
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
          <div className="mt-1">
            <Ticket size={20} className="text-blue-600" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-blue-900">How to use coupons?</h5>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              When you have an active coupon, it will appear here. You can apply it during the checkout process of your booking to get an instant discount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoupon;