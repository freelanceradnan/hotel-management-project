import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { assets } from '../../assets/assets';
import { useGetAllRoomsQuery } from '../../Feature/ApiSlice';
import { StoreContext } from '../../Contexts/StoreContext';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [radioValue, setRadioValue] = useState("masterCard");
    const { data: allrooms, isLoading } = useGetAllRoomsQuery();
    const [room, setRoom] = useState(null);
    
    const genarateOrderId = "SS-" + Math.floor(Math.random() * 900000 + 100000);
   const { orderDetails, setOrderDetails,roomBookingDate } = useContext(StoreContext);
   const {currentUser}=useContext(StoreContext)
   const isPayment=radioValue==='masterCard'?true:false;
   
   const [formData, setFormData] = useState({
        OrderId:genarateOrderId,
        email:currentUser.email,
        name: "",
        address: "",
        city: "",
        post: ""
    });
    //changing radio current value
    useEffect(() => {
    setFormData(prev => ({
        ...prev,
        payMethod: radioValue,
        isPayment: radioValue === 'masterCard'
    }));
}, [radioValue]);
    
    useEffect(() => {
        if (allrooms) {
            const foundRoom = allrooms.find(c => c.id === id);
            setRoom(foundRoom);
        }
    }, [id, allrooms]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-xl font-medium text-gray-600">Loading details...</span>
        </div>
    );

    if (!room) return <div className="text-center py-20 text-red-500 font-bold text-2xl">Room not found!</div>;

  
const changeHandler=(e)=>{
     const {name,value}=e.target
     setFormData((prev)=>({
        ...prev,
       [name]:name=='post'?Number(value):value
     }))
}
//submit preorder
const paymentSubmit = async(e) => {
    e.preventDefault();

   try {
     if (room) {
        const finalBookingData = {
            ...formData,
            RoomId: room.id
            
        };
        setOrderDetails(finalBookingData);
        if(radioValue==='masterCard'){
            navigate('/payment')
            window.scrollTo(0, 0);
        }
        else{
            navigate('/preorder')
             const finalBookingData = {
            ...formData,
            RoomId: room.id
            
        };
             const docRef=collection(db,'orders')
            await addDoc(docRef,{
                    ...finalBookingData,
                    roomBookingDate
                  })
             toast.success('Preorder success')
             window.scrollTo(0, 0);
            
        }
        // const targetPath = radioValue === 'masterCard' ? '/payment' : '/preorder';
        // navigate(targetPath);
       
    }
   } catch (error) {
    console.log(error.message)
   }
};

    return (
        <div className='py-20 md:py-26 px-4 md:px-16 lg:px-24 bg-[#FAFBFF] min-h-screen font-sans'>
            <div className='max-w-7xl mx-auto'>
                <h2 className='text-4xl font-bold text-gray-900 mb-2'>Complete Your Booking</h2>
                <p className='text-gray-500 mb-10 text-lg'>Please provide your details to finalize the reservation.</p>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>

                    {/* Left Side: Form */}
                    <div className='lg:col-span-7 order-2 lg:order-1'>
                        <form onSubmit={paymentSubmit} className='space-y-8'>
                            
                            {/* Personal Details Section */}
                            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
                                <div className='flex items-center gap-3 mb-8'>
                                    <span className='w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold'>01</span>
                                    <h3 className='text-xl font-bold text-gray-800'>Guest Information</h3>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600 ml-1'>First Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={changeHandler} placeholder="John" className='p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all' required />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600 ml-1'>Last Name</label>
                                        <input type="text" placeholder="Doe" className='p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all' required />
                                    </div>
                                    <div className='flex flex-col gap-2 md:col-span-2'>
                                        <label className='text-sm font-semibold text-gray-600 ml-1'>Street Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={changeHandler} placeholder="Apartment, suite, or street name" className='p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all' required />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600 ml-1'>Town / City</label>
                                        <input type="text" name="city" value={formData.city} onChange={changeHandler} placeholder="New York" className='p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all' required />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-sm font-semibold text-gray-600 ml-1'>Postal Code</label>
                                        <input type="number" name="post" min={1} value={formData.post} onChange={changeHandler} placeholder="10001" className='p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all' required />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Options Section */}
                            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
                                <div className='flex items-center gap-3 mb-8'>
                                    <span className='w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold'>02</span>
                                    <h3 className='text-xl font-bold text-gray-800'>Payment Method</h3>
                                </div>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {/* MasterCard Option */}
                                    <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${radioValue === 'masterCard' ? 'border-green-600 bg-green-50/50 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}>
                                        <input type='radio' name='payment' value="masterCard" className='hidden' checked={radioValue === 'masterCard'} onChange={(e) => setRadioValue(e.target.value)} />
                                        <div className='flex items-center gap-4'>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${radioValue === 'masterCard' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                                                {radioValue === 'masterCard' && <div className='w-2 h-2 bg-white rounded-full'></div>}
                                            </div>
                                            <div>
                                                <p className='font-bold text-gray-800'>Online Payment</p>
                                                <p className='text-xs text-gray-500'>Credit or Debit Card</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* Pre-book Option */}
                                    <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${radioValue === 'preorder' ? 'border-green-600 bg-green-50/50 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}>
                                        <input type='radio' name='payment' value="preorder" className='hidden' checked={radioValue === 'preorder'} onChange={(e) => setRadioValue(e.target.value)} />
                                        <div className='flex items-center gap-4'>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${radioValue === 'preorder' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                                                {radioValue === 'preorder' && <div className='w-2 h-2 bg-white rounded-full'></div>}
                                            </div>
                                            <div>
                                                <p className='font-bold text-gray-800'>Pay at Hotel</p>
                                                <p className='text-xs text-gray-500'>No immediate payment required</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <button type='submit' className='w-full mt-10 bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-[0.98]'>
                                    {radioValue === 'masterCard' ? 'Proceed to Payment' : 'Confirm Pre-Booking'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className='lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-8'>
                        <div className='bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100'>
                            <div className='relative h-72 overflow-hidden'>
                                <img src={room?.image[0]} alt={room?.name} className='w-full h-full object-cover transition-transform duration-700 hover:scale-105' />
                                <div className='absolute top-5 left-5'>
                                    <span className='bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-blue-600 shadow-sm'>
                                        {room?.roomType}
                                    </span>
                                </div>
                            </div>

                            <div className='p-8'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <h3 className='text-2xl font-bold text-gray-800'>{room?.name}</h3>
                                        <div className='flex items-center gap-1.5 text-sm text-gray-400 mt-2 font-medium'>
                                            <img src={assets.locationIcon} alt="location" className='w-3.5 opacity-50' />
                                            <span>{room?.location}</span>
                                        </div>
                                    </div>
                                    <div className='bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-100'>
                                        <img src={assets.starIconFilled} alt="" className='w-4' />
                                        <span className='font-bold text-amber-700'>{room?.rating || '4.8'}</span>
                                    </div>
                                </div>

                                <div className='space-y-4 py-6 border-y border-gray-50'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Max Occupancy</span>
                                        <span className='font-bold text-gray-800'>{room?.maxGuests} Guests</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-600'>Price per night</span>
                                        <span className='text-3xl font-bold text-gray-900'>${room?.price}</span>
                                    </div>
                                </div>

                                <div className='mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-2xl'>
                                    <div className='p-2 bg-white rounded-lg shadow-sm'>
                                       ✨
                                    </div>
                                    <p className='text-sm text-gray-500 leading-relaxed italic'>
                                        Includes access to premium lounge, glass-view balcony, and 24/7 room service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};
export default Checkout;