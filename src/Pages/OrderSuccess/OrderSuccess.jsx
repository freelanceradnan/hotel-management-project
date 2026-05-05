import { ArrowRight, CheckCircle, Download, Package } from 'lucide-react';
import React, { useContext } from 'react';
import { Link } from 'react-router';
import { StoreContext } from '../../Contexts/StoreContext';

const OrderSuccess = () => {
    const {orderDetails}=useContext(StoreContext)
    
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
                <p className="text-gray-500 mb-8 text-lg">Your Booking has been placed successfully. We'll send you a confirmation email shortly.</p>

                <div className="bg-gray-50 p-4 rounded-3xl border border-dashed border-gray-200 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 font-bold text-sm uppercase">Order Number</span>
                        <span className="font-black text-lg">{orderDetails.OrderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold text-sm uppercase">Status</span>
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Processing</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/myDashboard/orders" className="flex items-center justify-center gap-2 bg-gray-100 text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition">
                        <Package size={20} /> View Orders
                    </Link>

                    
                    <Link 
                        to="/invoice" 
                        className="flex items-center justify-center gap-1 bg-gray-100 text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
                    >
                        <Download size={20} /> Invoice
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

export default OrderSuccess;