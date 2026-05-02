import React, { useState } from 'react';
import { assets } from '../../../assets/assets';
import { ChevronDown, ChevronRight, Mail, BellRing } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { auth } from '../../../Firebase/Firebase';

const Communications = () => {
  const [quickModal, setQuickModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Communications</h2>
        <p className="text-gray-500 mt-2">Manage your preferences and stay updated with what matters most.</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Booking Notifications Section */}
        <div className={`group border rounded-xl overflow-hidden transition-all duration-300 ${quickModal ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer bg-white" 
            onClick={() => setQuickModal(!quickModal)}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                <img src={assets.logo} alt="QuickStay" className="w-8 h-8 object-contain invert" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Booking Updates</h3>
                <p className="text-xs text-gray-500">Manage how you receive booking info</p>
              </div>
            </div>
            {quickModal ? <ChevronDown className="text-blue-500" /> : <ChevronRight className="text-gray-400" />}
          </div>

          {quickModal && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Level</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                  <input type="radio" name="booking" id="update" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Confirmation and critical updates</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                  <input type="radio" name="booking" id="update1" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">No updates (Not recommended)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Account Support Section */}
        <div className="mt-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Settings</h2>
          
          <div className={`group border rounded-xl overflow-hidden transition-all duration-300 ${emailModal ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
            <div 
              onClick={() => setEmailModal(!emailModal)} 
              className="flex items-center justify-between p-4 cursor-pointer bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <Mail className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Account Support</h3>
                  <p className="text-xs text-gray-500">Verified Email: {auth?.currentUser?.email}</p>
                </div>
              </div>
              {emailModal ? <ChevronDown className="text-blue-500" /> : <ChevronRight className="text-gray-400" />}
            </div>

            {emailModal && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium italic">Primary Email</span>
                    <span className="text-sm font-semibold text-gray-700">{auth?.currentUser?.email}</span>
                  </div>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors">
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Communications;