import React, { useContext, useState } from 'react';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Firebase';
import { StoreContext } from '../../Contexts/StoreContext';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const {orderDetails,setOrderDetails}=useContext(StoreContext)
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
 const {roomBookingDate,setRoomBookingDate}=useContext(StoreContext)

  const handlePayment = async(e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating an API call
   
    try {
      setTimeout(() => {
      setLoading(false);
      toast.success("Payment Successful! Your sneakers are on the way.");
      navigate('/order-success')
      scrollTo(0,0)
    }, 2500);
      const docRef=collection(db,'orders')
      await addDoc(docRef,{
        ...orderDetails,
        roomBookingDate
      })
      toast.success('order success done!')
    } catch (error) {
      console.log(error.message)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='py-20 md:py-24 px-4 md:px-16 lg:px-24 bg-[#fdfdfd] min-h-screen'>
      <div className="flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 ">
          
          {/* Back Button */}
          <button className="flex items-center text-gray-400 hover:text-black mb-6 transition group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-sm ml-1 font-medium">Go Back</span>
          </button>

          {/* Logo Section */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic tracking-tighter">
              SOLE<span className="text-orange-600">STYLE</span> PAY
            </h2>
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-blue-800 rounded-sm opacity-80" title="Visa"></div>
              <div className="w-8 h-5 bg-red-500 rounded-sm opacity-80" title="MasterCard"></div>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-2">
            {/* Cardholder Name */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 mb-2 block tracking-wider">Cardholder Name</label>
              <input 
                type="text" 
                required 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition" 
                placeholder="John Doe" 
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 mb-2 block tracking-wider">Card Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  name="cardNumber"
                  maxLength="19"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition" 
                  placeholder="xxxx xxxx xxxx xxxx" 
                />
                <CreditCard className="absolute right-4 top-4 text-gray-300" />
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-2 block tracking-wider">Expiry Date</label>
                <input 
                  type="text" 
                  required 
                  name="expiry"
                  placeholder="MM/YY" 
                  maxLength="5"
                  value={formData.expiry}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition" 
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-2 block tracking-wider">CVV</label>
                <input 
                  type="password" 
                  required 
                  name="cvv"
                  maxLength="4"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition" 
                  placeholder="***" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg mt-6 hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "PAY NOW"
              )}
            </button>
          </form>

          {/* Footer Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
            <Lock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted & Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;