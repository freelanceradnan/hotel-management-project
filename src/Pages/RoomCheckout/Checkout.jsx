import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { assets } from '../../assets/assets';
import { useGetAllRoomsQuery } from '../../Feature/ApiSlice';

const Checkout = () => {
    const { id } = useParams();
    const { data: allrooms, isLoading } = useGetAllRoomsQuery();
    const [room, setRoom] = useState(null);
    
    // Availability State

    useEffect(() => {
        if (allrooms) {
            const foundRoom = allrooms.find(c => c.id === id);
            setRoom(foundRoom);
        }
    }, [id, allrooms]);

    if (isLoading) return <div className="text-center py-20 text-xl font-medium">Loading Room Details...</div>;
    if (!room) return <div className="text-center py-20 text-red-500">Room not found!</div>;

 const handleCheckAvailability=()=>{

 }

    return (
        <div className='py-20 md:py-30 px-4 md:px-16 lg:px-24 xl:px-24 bg-[#fdfdfd] min-h-screen'>
            <h2 className='text-3xl font-playfair font-bold text-gray-800 mb-10'>Confirm Your Booking</h2>
            
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
                
                {/* Left Side: Availability Form */}
                <div className='lg:col-span-7 order-2 lg:order-1'>
                  
                        <div className='bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-gray-100'>
                            <h3 className='text-xl font-semibold mb-6 text-gray-700'>Enter Your Booking Details</h3>
                            <form className='flex flex-col gap-6' onSubmit={handleCheckAvailability}>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-medium text-gray-600'>Enter First Name</label>
                                        <input 
                                            type="text" 
                                            className='p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary/40' 
                                            
                                            required 
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-medium text-gray-600'>Enter Last Name</label>
                                        <input 
                                            type="text" 
                                            className='p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary/40' 
                                            
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-medium text-gray-600'>Address</label>
                                    <input 
                                        type="text"
                                        className='p-3 rounded-lg border border-gray-200 outline-none' 
                                       
                                    />
                                    <p className='text-xs text-gray-400'>Max capacity: {room?.maxGuests} persons</p>
                                </div>
                                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-medium text-gray-600'>City</label>
                                        <input 
                                            type="text" 
                                            className='p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary/40' 
                                            
                                            required 
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-medium text-gray-600'>Enter your Postal Code</label>
                                        <input 
                                            type="text" 
                                            className='p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary/40' 
                                            
                                            required 
                                        />
                                    </div>
                                </div>
                               
                            </form>
                        </div>
                    
                        <div className='bg-green-50 border border-green-200 p-8 rounded-2xl animate-fade-in'>
                           <form action="">
                             <h2>Choice your Payment Options</h2>
                             <div className='flex'>
                                <input type='radio' id="master" name='master'/>
                                <label htmlFor="master">Master Card</label>
                                
                             </div>
                             <div className='flex'>
                                <input type='radio' id="pre" name="master"/>
                                <label htmlFor="pre">Pre Book(No Payment Required)</label>
                             </div>
                            <button className='w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all'>Complete Payment</button>
                           </form>
                        </div>
                   
                </div>

                {/* Right Side: Room Summary Card */}
                <div className='lg:col-span-5 order-1 lg:order-2'>
                    <div className='flex flex-col w-full rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-50'>
                        <div className='w-full h-64 overflow-hidden'>
                            <img 
                                src={room?.image[0]} 
                                alt={room?.name} 
                                className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-500' 
                            />
                        </div>

                        <div className='p-6 flex flex-col gap-4'>
                            <div>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-playfair text-2xl font-bold text-gray-800 italic'>{room?.name}</h3>
                                    <div className='flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-sm font-bold text-yellow-700'>
                                        <img src={assets.starIconFilled} alt="" className='w-4' /> {room?.rating || '4.8'}
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 text-sm text-gray-400 mt-2'>
                                    <img src={assets.locationIcon} alt="location" className='w-3 opacity-50' />
                                    <span>{room?.location}</span>
                                </div>
                            </div>

                            <hr className='border-gray-100' />

                            <div className='space-y-2'>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Type</span>
                                    <span className='font-medium text-gray-800'>{room?.roomType}</span>
                                </div>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Price per night</span>
                                    <span className='font-medium text-gray-800 text-xl'>${room?.price}</span>
                                </div>
                            </div>

                            <div className='bg-gray-50 p-4 rounded-xl mt-2'>
                                <p className='text-sm text-gray-500 italic'>
                                    "Enjoy the best of {room?.name} with premium room service and glass-view balcony."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Checkout;