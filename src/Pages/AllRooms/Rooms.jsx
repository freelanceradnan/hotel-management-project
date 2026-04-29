import React, { useEffect, useState } from 'react';
import { assets, facilityIcons, roomCommonData, roomsDummyData } from './../../assets/assets';
import { useNavigate } from 'react-router';
import StarRating from './../../Components/StarRatings/StarRating';
const Checkbox=({label,selected=false,onChange=()=>{ }})=>{
   return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
        <input type="checkbox" checked={selected} onChange={(e)=>onChange(e.target.checked,label)}/>
        <span className='font-light select-none'>{label}</span>
    </label>
   )
}
const RadioButton=({label,selected=false,onChange=()=>{ }})=>{
   return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
        <input type="radio" name="sortOption" checked={selected} onChange={()=>onChange(label)}/>
        <span className='font-light select-none'>{label}</span>
    </label>
   )
}
const Rooms = () => {
    const [selectRoomType,setSelectRoomType]=useState([])
    
    const [selectPriceRange,setSelectPriceRange]=useState([])
    const [selectShort,setSelectShort]=useState("")
    const [searchFilterData,setSearchFilterData]=useState([])
    const navigate=useNavigate()
    const [openFilters,setOpenFilters]=useState(false)
    const roomTypes=[
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite"
    ]
    const priceRanges=[
        "0 to 500",
        "500 to 1000",
        "1000 to 2000",
        "2000 to 3000"
    ]
    const sortOptions=[
        "Price Low to High",
        "Price Hight to Low",
        //do work next
        "Newest First"
    ]
    useEffect(()=>{
    let temp=[...roomsDummyData]
    if(selectRoomType.length>0){
       temp=temp.filter(room=>selectRoomType.includes(room.roomType))
    }
    if(selectPriceRange.length>0){
        temp = temp.filter(room => {
            //price min-max
                return selectPriceRange.some(range => {
                    const [min, max] = range.match(/\d+/g).map(Number);
                    return room.pricePerNight >= min && room.pricePerNight <= max;
                });
            })
    }
    if(selectShort==='Price Low to High') temp.sort((a,b)=>a.pricePerNight-b.pricePerNight)
    if(selectShort==='Price Hight to Lo') temp.sort((b,a)=>b.pricePerNight-a.pricePerNight)
    setSearchFilterData(temp)
    },[selectRoomType,selectPriceRange,selectShort])
    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        <div>
        <div className='flex flex-col items-start text-left'>
            <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special package to enhance your stay and create unforgettable memories.</p>
        </div>

       {/* //display room */}

       {searchFilterData.map((room)=>(
        <div className='flex flex-col md:flex-row items-center py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0' key={room._id}>
        <img onClick={()=>{navigate(`/rooms/${room._id}`);scrollTo(0,0)}}
        src={room.images[0]} alt="hotel-img" title="View Room Details" className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'/>
        <div className='md:w-1/2 flex flex-col gap-1'>
        <p className='text-gray-500'>{room.hotel.city}</p>
        <p onClick={()=>{navigate(`/rooms/${room._id}`);scrollTo(0,0)}}
        className='text-gray-800 text-3xl font-playfair cursor-pointer'>{room.hotel.name}</p>
        <div className='flex items-center'>
         <StarRating/>
         <p className='ml-2'>200+ reviews</p>
        </div>
        <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
            <img src={assets.locationIcon} alt="location" />
            <span>{room.hotel.address}</span>
        </div>
        {/* room-amenties */}
        <div className='flex flex-wrap items-center mt-3 mb-3 gap-1'>
        {room.amenities.map((item,index)=>(
        <div key={index} className='flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F5F5FF]'>
            <img src={facilityIcons[item]} alt="items" className=' w-3 h-3'/>
            <p className='font-[400] text-[12px]'>{item}</p>
        </div>
        ))}
        </div>
        {/* room price per night */}
        <p className='text-xl font-semibold text-gray-700'>${room.pricePerNight} /night</p>
        </div>
        </div>
       ))}
        </div>
        {/* {filter} */}
        <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
       <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
        <p>FILTERS</p>
        <div className='text-xs cursor-pointer'>
            <span className='lg:hidden' onClick={()=>setOpenFilters(!openFilters)}>
                {openFilters? 'HIDE':'SHOW'}
            </span>
            <span className='hidden lg:block' onClick={()=>{
                setSelectShort("")
                setSelectPriceRange([])
                setSelectRoomType([])
            }}>CLEAR</span>
        </div>
       </div>
       <div>
        
        <div className={`${openFilters ?'h-auto':'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
        <div className='px-5 pt-5'>
        <p className='font-medium text-gray-800 pb-8'>Popular Filters</p>
        <div className='flex flex-col'>
            {roomTypes.map((room,index)=>(
           <Checkbox
           key={index}
           selected={selectRoomType.includes(room)}
           label={room}
           onChange={(checked,label)=>setSelectRoomType(prev=>checked?[...prev,label]:selectRoomType.filter(c=>c!==label))}
           />
            
        ))}
        </div>
        </div>
        <div className='px-5 pt-5'>
        <p className='font-medium text-gray-800 pb-8'>Price Range</p>
        <div className='flex flex-col'>
            {priceRanges.map((range,index)=>(
            <Checkbox
            key={index}
            label={range}
            selected={selectPriceRange.includes(range)}
            onChange={(checked,label)=>setSelectPriceRange(prev=>checked?[...prev,range]:
                selectPriceRange.filter(c=>c!==range)
            )}
            />
        ))}
        </div>
        </div>
        <div className='px-5 pt-5 pb-5'>
        <p className='font-medium text-gray-800 pb-8'>Sort By</p>
        <div className='flex flex-col'>
            {sortOptions.map((option,index)=>(
        <RadioButton
        key={index}
        label={option}
        selected={selectShort===option}
        onChange={(val)=>setSelectShort(val)}
        />
        ))}
        </div>
        </div>
        </div>

       </div>
        </div>

        <div>

        </div>
        </div>
    );
};

export default Rooms;