import React, { useEffect, useState } from 'react';
import { roomCommonData, roomsDummyData } from '../../assets/assets';
import HotelCard from '../HotelCard/HotelCard';
import Title from '../Title/Title';
import { useNavigate } from 'react-router';
import { useGetAllRoomsQuery } from '../../Feature/ApiSlice';

const FeatureDestination = () => {
    const navigate=useNavigate()
    const {data:allRooms,isLoading}=useGetAllRoomsQuery()
    const [Rooms,setRooms]=useState([])
  
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
    
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 lx:px-32  bg-slate-20 py-20'>
            <Title title='Featured Hotels' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences' align='center' font="playfair"/>
            <div className='flex flex-wrap items-center justify-center mt-20 gap-10'>
                
                {allRooms?.slice(0,4).map((room,index)=>(
                    <HotelCard key={room.id} room={room} index={index}/>
                ))}
            </div>
            <button type='button'
            onClick={()=>{navigate('/rooms');scrollTo(0,0)}}
            className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer text-[#1c2027]'>
                View All Rooms
            </button>
        </div>
    );
};

export default FeatureDestination;