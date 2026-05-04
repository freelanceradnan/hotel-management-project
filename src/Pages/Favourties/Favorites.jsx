import { Heart } from 'lucide-react';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Contexts/StoreContext';
import { toggleFavourite } from '../../Feature/Whishlist';
import { toast } from 'react-toastify';

const Favorites = ({isFavorite}) => {
    const { favorites } = useSelector(state => state.wish);
    const dispatch=useDispatch()
    
    return (
        <div className='py-20 md:py-30 px-4 md:px-16 lg:px-24 xl:px-24 bg-[#fdfdfd]'>
            <h2 className='font-playfair text-4xl md:text-[35px] py-10'>List Of Your Saved Hotels</h2>
{favorites.length>0? 
<div className='grid md:grid-cols-2 gap-10'>
    
{
    favorites?.map((room,index)=>(
                     <div key={index}
 
  className='relative flex flex-col w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.5)] h-full'
>
    <div className='w-full h-48 overflow-hidden shrink-0'>
       <Link to={`/rooms/`+room.id}> <img src={room.image[0]} alt="room-image" className='w-full h-full object-cover' 
        
        /></Link>
        
    </div>

 
       <button className='h-6 w-6 py-1 absolute top-3 right-3 text-xs bg-white text-gray-800 font-medium rounded-full flex items-center justify-center' onClick={()=>{
        dispatch(toggleFavourite(room))
        toast.success('Favourite List Updated!')
       }}><Heart size={15} className='' color="#ff3838" 
      fill={`favorites?.some(fav=>fav.id===some.id) `? "#ff3838" : "none"} 
       color={`favorites?.some(fav=>fav.id===some.id) ` ? "#ff3838" : "#888"}/> </button>
     
    <div className='p-4 pt-5 flex flex-col flex-1 justify-between'>
        <div>
            
            <div className='flex items-center justify-between gap-2'>
                <p className='font-playfair text-xl font-medium text-gray-800 line-clamp-1 italic'>{room.name}</p>
                <div className='flex items-center gap-1 shrink-0'>
                    <img  alt="" />4.5
                </div>
            </div>
            
            <div className='flex items-center gap-1 text-sm mt-1'>
                <img alt="location-icon" src={assets.locationIcon}/>
                <span className='truncate'>{room.location}</span>
            </div>
        </div>

       
        <div className='flex items-center justify-between mt-4'>
            <p className='whitespace-nowrap'><span className='text-xl text-gray-800'>${room.price}</span>/night</p>
            <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap'>Book Now</button>
        </div>
    </div>
</div>
    ))
}
</div>
:
<div className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>No Saved Items Found!</div>
}
        </div>
    );
};

export default Favorites;