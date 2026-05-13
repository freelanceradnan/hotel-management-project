import { BanknoteArrowUp, BookAlert, BookCheck, CircleDollarSign, ShoppingCart } from 'lucide-react';
import React from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
const MyStatistics = () => {
    const chartData = [
        { name: 'Products', count: 5 },
        { name: 'Categories', count: 10 },
        { name: 'Users', count: 2 },
        { name: 'Orders', count:26}
    ];
    return (
        <div className=''>
            <h2 className='text-3xl uppercase'>| My Statistics</h2>

            
<div className='flex flex-col lg:flex-row gap-4 w-full flex-wrap py-4'>
    <div className='px-10 border border-[#a53a1f] py-6 bg-[#FCEFEB] rounded-sm'>
        <div className=''>
            <div className='flex gap-4'>
            <p>Rooms</p>
            <p className='bg-[#8f442d] p-0.5'><ShoppingCart color='white'/></p>
        </div>
        <div>5</div>
        </div>
    </div>
    <div className='px-6 border py-6 border border-[#1a8545] bg-[#e5f9ed] rounded-sm'>
        <div>
            <div className='flex gap-4'>
            <p>PreBook</p>
            <p className='bg-[#12a84e] p-0.5'><BookAlert color='white'/></p>
        </div>
        <div>5</div>
        </div>
        
    </div>
    <div className='px-6 border py-6 bg-[#e5f8fb] border-[#12acc4]'>
      
        <div>
            <div className='flex gap-4'>
            <p>Booking</p>
            <p className='bg-[#3bb0c2] p-0.5'><BookCheck color='white'/></p>
        </div>
        <div>5</div>
        </div>
        
    </div>
    <div className='px-6 border py-6 border-[#bd9419] bg-[#f1eee4]'>
    
         <div>
            <div className='flex gap-4'>
            <p>Revinew</p>
            <p className='bg-[#dab445] p-0.5'><BanknoteArrowUp /></p>
        </div>
        <div>5</div>
        </div>
    </div>
</div>
<div>
    <div className="lg:flex gap-4">
    {/* Bar Chart Container */}
    <div className="flex-1 border border-[#c4bbbb] py-8 px-4 bg-white">
        <h2 className="font-bold mb-4">Inventory Overview</h2>
        
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3bb0c2" />
            </BarChart>
        </ResponsiveContainer>
    </div>

    {/* Line Chart Container */}
    <div className="flex-1 border border-[#c4bbbb] py-8 px-4 bg-white">
        <h2 className="font-bold mb-4">Resource Comparison</h2>
      
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    </div>
</div>
</div>
        </div>
    );
};

export default MyStatistics;