import { ArrowRight, CheckCircle, Package } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

const PrePaymentSuccess = () => {
    return (
        <div className='py-20 md:pt-8 px-4 md:px-16 lg:px-24 xl:px-24 bg-[#fdfdfd] min-h-screen'>
         
          <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
            <div className="max-w-lg w-full">
                <div className="mb-4 flex justify-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle size={60} className="text-green-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-black mb-4">THANK YOU!</h1>
                <p className="text-gray-500 mb-8 text-lg">Your Payment has been placed successfully. We'll send you a confirmation email shortly.</p>

                <div className="bg-gray-50 p-4 rounded-3xl border border-dashed border-gray-200 mb-10">
                    <div className="flex justify-between items-center mb-4">
                       
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold text-sm uppercase">Status</span>
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Paid</span>
                        
                    </div>
                    <h2 className='font-semibold text-slate-800 py-2'>Please visit Order Page For More Details!</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/myAccount/orders" className="flex items-center justify-center gap-2 bg-gray-100 text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition">
                        <Package size={20} /> View Orders
                    </Link>


                    <Link to="/" className="flex items-center justify-center gap-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition">
                        Shop <ArrowRight size={20} />
                    </Link>
                </div>

               
            </div>
        </div>
        </div>
    );
};

export default PrePaymentSuccess;