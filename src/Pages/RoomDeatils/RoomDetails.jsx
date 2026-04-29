import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../../assets/assets';
import StarRating from '../../Components/StarRatings/StarRating';
import { useGetAllRoomsQuery } from '../../Feature/ApiSlice';

const RoomDetails = () => {
    const {id}=useParams()
    const [room,setRoom]=useState(null)
    const [mainImage,setMainImage]=useState(null)
    const {data:roomdata,isLoading}=useGetAllRoomsQuery()
    //fetch room data
    useEffect(()=>{
    if(roomdata?.length>0){
    const room=roomdata?.find(room=>room.id===id)
    if(room){
         room && setRoom(room)
    room && setMainImage(room.image[0])
    }
    }
    },[id,roomdata])

    //loading room data...
    if (isLoading) {
        return (
            <div className='flex flex-wrap justify-center gap-10 py-20 bg-slate-50'>
                {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex w-70 flex-col gap-4">
                        <div className="skeleton h-48 w-full bg-gray-200 animate-pulse rounded-xl"></div>
                        <div className="skeleton h-4 w-28 bg-gray-200 animate-pulse"></div>
                        <div className="skeleton h-4 w-full bg-gray-200 animate-pulse"></div>
                    </div>
                ))}
            </div>
        );
    }
    return room && (
       <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 bg-[#fdfdfd]'>
        {/* {room-details} */}
        <div className='flex flex-col md:flex-row items-center md:items-center gap-2'>
            <h1 className='text-3xl md:text-4xl font-playfair'>{room.name}
                <span className='font-inter text-sm'>({room.roomType})</span>
                </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
        </div>
        {/* room rating */}
        <div className='flex items-center gap-1 mt-2'>
            <StarRating/>
            <p className='ml-2'>200+ reviews</p>
        </div>
        {/* {room -addres} */}
        <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.location}</span>
        </div>
{/* {room image} */}
<div className='flex flex-col lg:flex-row mt-6 gap-6'>
<div className='lg:w-1/2 w-full'>
    <img src={mainImage} alt="main room img" className='w-full rounded-xl shadow-lg object-cover'/>
</div>
<div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
    {room?.image.length>1&& room.image.map((image,index)=>(
        <img 
        onClick={()=>setMainImage(image)}
        className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage=== image && `outline-3 outline-orange-500`}`}
        key={index} src={image} alt="room image"/>
    ))}
</div>
</div>
{/* {room-hightlight} */}
<div className='flex flex-col md:flex-row md:justify-between mt-10'>
<div className='flex flex-col'>
    <h1>Experience Luxury Like Never Before</h1>
    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
        {room.services.map((item,index)=>(
        <div key={index} className='flex items-center gap-2 px-3 rounded-lg bg-gray-100'>
        <img src={facilityIcons[item]} alt="icon" className='w-5 h-5'/>
        <p className='text-xs'>{item}</p>
        </div>
        ))}
    </div>
</div>
{/* {room prices} */}
<p className='text-2xl font-medium'>${room.price}/night</p>
</div>
{/* {checkin cheout form} */}
<form className='flex flex-col md:flex-row items-start md:items-center justify-between bg-[#ffffff] shadow-[0px_0px_20px_rgba(0,0,0,0.2)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
<div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>

<div className='flex flex-col'>
    <label htmlFor="checkDate" className='font-medium'>Check In</label>
<input type="date" name="" id="checkDate" placeholder='Check-In' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
</div>
<div className='flex flex-col'>
    <label htmlFor="CheckoutDate" className='font-medium'>Check-Out</label>
<input type="date" name="" id="CheckoutDate" placeholder='Check-In' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
</div>

<div className='flex flex-col'>
    <label htmlFor="guests" className='font-medium'>Guests</label>
<input type="number" name="" id="guests" placeholder='0' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
</div>
</div>
<button type='submit' className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-fulll max-md:mt-16 md:px-3 md:py-4 text-base cursor-pointer'>
Check Availability 
</button>
</form>
{/* common-specifications */}
<div className='mt-25 space-y-4'>
    {roomCommonData.map((spec,index)=>(
     <div key={index} className='flex items-center gap-2'>
     <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5'/>
     <div>
        <p className='text-base'>{spec.title}</p>
        <p className='text-gray-500'>{spec.description}</p>
     </div>
     </div>
    ))}
</div>

<div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
<p>
    Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.
</p>
</div>
{/* {posted by} */}
{/* {todo owner posted and date  also contact button} */}
       </div>
    );
};

export default RoomDetails;