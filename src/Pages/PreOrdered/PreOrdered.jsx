import React from 'react';
import { ArrowRight, BanknoteArrowDown, CheckCircle, Download, Package } from 'lucide-react';

import { Link } from 'react-router';
const PreOrdered = () => {
     const genarateOrderId = "SS-" + Math.floor(Math.random() * 900000 + 100000);
    return (
         <div className='py-10 md:py-10 px-4 md:px-16 lg:px-24 xl:px-24 bg-[#fdfdfd] min-h-screen'>
         
          <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
            <div className="max-w-lg w-full">
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle size={60} className="text-pink-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-black mb-4">THANK YOU!</h1>
                <p className="text-gray-500 mb-8 text-lg">Your Pre-Booking has been placed successfully.Please Pay online or Contact directly On booking Hotel Desk</p>

                <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 font-bold text-sm uppercase">Pre-Memo</span>
                        <span className="font-black text-lg">{genarateOrderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold text-sm uppercase">Payment</span>
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Not Success!</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/myDashboard/orders" className="flex items-center justify-center gap-2 bg-gray-100 text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition">
                        <Package size={20} /> View PreOrders
                    </Link>

                    
                    <Link 
                        to="/" 
                        className="flex items-center justify-center gap-1 bg-gray-100 text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
                    >
                       <BanknoteArrowDown color="#15f4bc" />Make Payment
                    </Link>

                    <Link to="/" className="flex items-center justify-center gap-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition">
                        Contact Hotel<ArrowRight size={20} />
                    </Link>
                </div>

               
            </div>
        </div>
        </div>
    );
};

export default PreOrdered;