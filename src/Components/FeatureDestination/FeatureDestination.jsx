import React from 'react';
import { roomCommonData, roomsDummyData } from '../../assets/assets';
import HotelCard from '../HotelCard/HotelCard';
import Title from '../Title/Title';
import { useNavigate } from 'react-router';

const FeatureDestination = () => {
    const navigate=useNavigate()
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 lx:px-32  bg-slate-20 py-20'>
            <Title title='Featured Hotels' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences' align='center' font="playfair"/>
            <div className='flex flex-wrap items-center justify-center mt-20 gap-10'>
                {roomsDummyData.slice(0,4).map((room,index)=>(
                    <HotelCard key={room._id} room={room} index={index}/>
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