
import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router';
import { Heart, LucideMove } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite } from '../../Feature/Whishlist';
import { StoreContext } from '../../Contexts/StoreContext';

const HotelCard = ({room,index}) => {
 const {isLogin,role}=useContext(StoreContext)

 const { favorites } = useSelector(state => state.wish);
 const isFavorite = favorites.some(fav => fav.id === room.id); //favorite logic returns true if product added

  const dispatch=useDispatch()
    return (
       <div
  key={room._id} 
  className='relative flex flex-col max-w-70 lg:max-w-60 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.5)] h-full'
>
    <div className='w-full h-48 overflow-hidden shrink-0'>
       <Link to={`/rooms/`+room.id}> <img src={room.image?.[0]} alt="room-image" className='w-full h-full object-cover' 
        
        /></Link>
        
    </div>

    {index % 2 === 0 && (
        <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>
    )}
   {isLogin && role==='user' &&(
    <button className='h-6 w-6 py-1 absolute top-3 right-3 text-xs bg-white text-gray-800 font-medium rounded-full flex items-center justify-center' onClick={()=>dispatch(toggleFavourite(room))}><Heart size={15} className='' color="#ff3838" 
   fill={isFavorite ? "#ff3838" : "none"} 
    color={isFavorite ? "#ff3838" : "#888"}/> </button>
   )}
    <div className='p-4 pt-5 flex flex-col flex-1 justify-between'>
        <div>
            
            <div className='flex items-center justify-between gap-2'>
                <p className='font-playfair text-xl font-medium text-gray-800 line-clamp-1 italic'>{room.name}</p>
                <div className='flex items-center gap-1 shrink-0'>
                    <img src={assets.starIconFilled} alt="" />4.5
                </div>
            </div>
            
            <div className='flex items-center gap-1 text-sm mt-1'>
                <img src={assets.locationIcon} alt="location-icon" />
                <span className='truncate'>{room.location}</span>
            </div>
        </div>

       
        <div className='flex items-center justify-between mt-4'>
            <p className='whitespace-nowrap'><span className='text-xl text-gray-800'>${room.price}</span>/night</p>
            <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap'>Book Now</button>
        </div>
    </div>
</div>
    );
};

export default HotelCard;