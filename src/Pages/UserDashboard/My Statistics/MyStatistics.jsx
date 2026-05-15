import { BanknoteArrowUp, BookAlert, BookCheck, CircleDollarSign, ShoppingCart } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {BarChart, Bar, Line,XAxis, YAxis, CartesianGrid,Tooltip, Legend, ResponsiveContainer} from "recharts";
import { StoreContext } from './../../../Contexts/StoreContext';
import { useGetAllOrdersDataQuery, useGetSeperateOrderQuery, useGetSeperateOrderWithEmailQuery } from '../../../Feature/ApiSlice';
import {  LineChart } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
const MyStatistics = () => {
    const {currentUser}=useContext(StoreContext)
    const email=currentUser?.email
   
      const {data:totalRooms=[]}=useGetSeperateOrderWithEmailQuery(email)
      const {data:AllOrder=[]}=useGetAllOrdersDataQuery();
const seperateRoomId = totalRooms.map(c => c.id);
const [preOrder, setPreOrders] = useState([]);
const [orders, setOrders] = useState([]);
let sum=0;
const myRevinue= orders.reduce(
  (sum, orders) => sum += orders.Price,
  0,
);
useEffect(() => {
  if (totalRooms.length > 0 && AllOrder.length > 0) {
   
    const filteredRoom = AllOrder.filter(order => 
      seperateRoomId.includes(order.RoomId) && order.isPayment === true
    );
    const filteredPre = AllOrder.filter(order => 
      seperateRoomId.includes(order.RoomId) && order.isPayment === false
    );
    setOrders(filteredRoom)
    setPreOrders(filteredPre);
  }
}, [totalRooms, AllOrder]);

    
 
    const chartData =
         [
        { name: 'Rooms', count: totalRooms.length },
        { name: 'Bookings', count: orders.length },
        { name: 'PreBookings', count: preOrder.length },
        // { name: 'Revenue', count:myRevinue}
    ];

//     if (!chartData || chartData.length === 0) {
//     return <p>Loading Chart Data...</p>; 
    
// }
  
    return (
        <div className=''>
            <h2 className='text-3xl uppercase'>| My Statistics</h2>

            
<div className='flex flex-col lg:flex-row gap-4 w-full flex-wrap py-4'>
    <div className='px-10 border border-[#a53a1f] py-6 bg-[#FCEFEB] rounded-sm'>
        <div className=''>
            <div className='flex gap-4'>
            <p className='font-bold text-xl'>Rooms</p>
            <p className='bg-[#8f442d] p-0.5'><ShoppingCart color='white'/></p>
        </div>
        <div className='font-bold'>{totalRooms.length}</div>
        </div>
    </div>
    <div className='px-6 border py-6 border border-[#1a8545] bg-[#e5f9ed] rounded-sm'>
        <div>
            <div className='flex gap-4'>
            <p className='font-bold text-xl'>Bookings</p>
            <p className='bg-[#12a84e] p-0.5'><BookAlert color='white'/></p>
        </div>
        <div className='font-bold'>{orders.length}</div>
        </div>
        
    </div>
    <div className='px-6 border py-6 bg-[#e5f8fb] border-[#12acc4]'>
      
        <div>
            <div className='flex gap-4'>
            <p className='font-bold text-xl'>PreBookings</p>
            <p className='bg-[#3bb0c2] p-0.5'><BookCheck color='white'/></p>
        </div>
        <div className='font-bold'>{preOrder.length}</div>
        </div>
        
    </div>
    <div className='px-6 border py-6 border-[#bd9419] bg-[#f1eee4]'>
    
         <div>
            <div className='flex gap-4'>
            <p className='font-bold text-xl'>Revinew</p>
            <p className='bg-[#dab445] p-0.5'><BanknoteArrowUp /></p>
        </div>
        <div className='font-bold'>{myRevinue} $</div>
        </div>
    </div>
</div>
<div>
    <div className="">
    {/* Bar Chart Container */}
    <div className="flex-1 border border-[#c4bbbb] py-8 px-4 bg-white">
        <h2 className="font-bold mb-4">Inventory Overview</h2>
        
       
            <ResponsiveContainer width="99%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip useTranslate3d={true} />
            <Legend />
            <Bar dataKey="count" fill="#3bb0c2" isAnimationActive={false} />
        </BarChart>
    </ResponsiveContainer>
       
    </div>

    {/* Line Chart Container */}
    {/* <div className="flex-1 border border-[#c4bbbb] py-8 px-4 bg-white">
        <h2 className="font-bold mb-4">Resource Comparison</h2>
   
     
          
       
    </div> */}
</div>
</div>
        </div>
    );
};

export default MyStatistics;