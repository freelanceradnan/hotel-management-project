import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, CreditCard, Link2, Users, PlusCircle } from 'lucide-react';
import { auth } from '../../../Firebase/Firebase';
import { getAuth } from "firebase/auth";
import { assets } from '../../../assets/assets';
const MyPayment = () => {
    const [payment, setPayment] = useState(false);
    const [account, setAccount] = useState(false);
    const [travel, setTravel] = useState(false);
    const [userGoogle,setUserGoogle]=useState(false)
    //user
    // const user = auth.currentUser;
    // কমন স্টাইল ক্লাস



const auth = getAuth();
const user = auth.currentUser;
//checkout google/email login
useEffect(() => {
    if (user) {
      const isGoogleUser = user.providerData.some(
        (provider) => provider.providerId === 'google.com'
      );

      if (isGoogleUser) {
        setUserGoogle(true)
      } else {
        setUserGoogle(false)
      }
    }
  }, [user]);
    const itemContainer = "border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 bg-white";
    const headerStyle = "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors";
    const contentStyle = "p-4 bg-gray-50 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200";

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className='max-w-2xl mx-auto'>
                <div className="mb-6">
                    <h2 className='text-2xl font-extrabold text-gray-900'>My Account Info</h2>
                    <p className="text-gray-500 text-sm">Manage your payment methods and connected services.</p>
                </div>

                <div className='flex flex-col gap-4'>
                    
                    {/* Payment Methods */}
                    <div className={`${itemContainer} ${payment ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}>
                        <div className={headerStyle} onClick={() => setPayment(!payment)}>
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} className={payment ? "text-blue-600" : "text-gray-400"} />
                                <span className={`font-semibold ${payment ? "text-blue-600" : "text-gray-700"}`}>Payment Methods</span>
                            </div>
                            {payment ? <ChevronDown size={20} className="text-blue-500" /> : <ChevronRight size={20} className="text-gray-400" />}
                        </div>
                        {payment && (
                            <div className={contentStyle}>
                                <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-gray-500 text-sm mb-3">No payment method added yet</p>
                                    <p  className="text-gray-500 text-sm mb-3">You can save a new card when you check out.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Connected Accounts */}
                    <div className={`${itemContainer} ${account ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}>
                        <div className={headerStyle} onClick={() => setAccount(!account)}>
                            <div className="flex items-center gap-3">
                                <Link2 size={20} className={account ? "text-blue-600" : "text-gray-400"} />
                                <span className={`font-semibold ${account ? "text-blue-600" : "text-gray-700"}`}>Connected Accounts</span>
                            </div>
                            {account ? <ChevronDown size={20} className="text-blue-500" /> : <ChevronRight size={20} className="text-gray-400" />}
                        </div>
                        {account && (
    <div className={`${contentStyle} flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100`}>
        
        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-200">
            {userGoogle ? (
                <img src={assets.googleImg} alt="Google" className="h-6 w-6 object-contain" />
            ) : (
                <img src={assets.emailImg} alt="Email" className="h-6 w-6 object-contain" />
            )}
        </div>

        
        <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                {userGoogle ? "Google Account" : "Password Protected"}
            </span>
            <p className="text-sm font-medium text-gray-700">
                {auth?.currentUser?.email || "No email found"}
            </p>
        </div>
    </div>
)}
                    </div>

                    {/* Travel Arranger */}
                    <div className={`${itemContainer} ${travel ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}>
                        <div className={headerStyle} onClick={() => setTravel(!travel)}>
                            <div className="flex items-center gap-3">
                                <Users size={20} className={travel ? "text-blue-600" : "text-gray-400"} />
                                <span className={`font-semibold ${travel ? "text-blue-600" : "text-gray-700"}`}>Travel Arranger</span>
                            </div>
                            {travel ? <ChevronDown size={20} className="text-blue-500" /> : <ChevronRight size={20} className="text-gray-400" />}
                        </div>
                        {travel && (
                            <div className={contentStyle}>
                                <p className="text-sm text-gray-600">QuickStay's Travel Arranger lets you book travel for your friends or co-workers. With permission, you can arrange trips directly from their account, making it simple to coordinate and manage trips for any Expedia traveler.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyPayment;