import React, { useContext, useEffect, useState } from 'react';
import { ShoppingCart, BookAlert, BookCheck, Banknote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { StoreContext } from './../../../Contexts/StoreContext';
import { useGetAllOrdersDataQuery, useGetSeperateOrderWithEmailQuery } from '../../../Feature/ApiSlice';

const MyStatistics = () => {
    const { currentUser } = useContext(StoreContext);
    const email = currentUser?.email;

    const { data: totalRooms = [] } = useGetSeperateOrderWithEmailQuery(email);
    const { data: AllOrder = [] } = useGetAllOrdersDataQuery();
    
    const [preOrder, setPreOrders] = useState([]);
    const [orders, setOrders] = useState([]);

    const myRevenue = orders.reduce((sum, order) => sum + (order.Price || 0), 0);

    useEffect(() => {
        if (totalRooms.length > 0 && AllOrder.length > 0) {
            const seperateRoomId = totalRooms.map(c => c.id);
            
            const filteredRoom = AllOrder.filter(order =>
                seperateRoomId.includes(order.RoomId) && order.isPayment === true
            );
            const filteredPre = AllOrder.filter(order =>
                seperateRoomId.includes(order.RoomId) && order.isPayment === false
            );
            setOrders(filteredRoom);
            setPreOrders(filteredPre);
        }
    }, [totalRooms, AllOrder]);

    const chartData = [
        { name: 'Rooms', count: totalRooms.length },
        { name: 'Bookings', count: orders.length },
        { name: 'PreBookings', count: preOrder.length },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            {/* Header section */}
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase flex items-center gap-2">
                    <span className="text-sky-600">|</span> My Statistics
                </h2>
                <p className="text-sm text-gray-500 mt-1">Real-time overview of your rooms, bookings, and revenue performance.</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Rooms Card */}
                <div className="p-6 bg-white border border-rose-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-500 text-sm tracking-wide uppercase">Rooms</p>
                        <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
                            <ShoppingCart size={22} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-gray-900">{totalRooms.length}</h3>
                    </div>
                </div>

                {/* Bookings Card */}
                <div className="p-6 bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-500 text-sm tracking-wide uppercase">Bookings</p>
                        <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                            <BookAlert size={22} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-gray-900">{orders.length}</h3>
                    </div>
                </div>

                {/* PreBookings Card */}
                <div className="p-6 bg-white border border-sky-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-500 text-sm tracking-wide uppercase">Pre-Bookings</p>
                        <div className="p-2.5 bg-sky-50 rounded-lg text-sky-600">
                            <BookCheck size={22} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-gray-900">{preOrder.length}</h3>
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="p-6 bg-white border border-amber-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-500 text-sm tracking-wide uppercase">Total Revenue</p>
                        <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
                            <Banknote size={22} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-gray-900">${myRevenue.toLocaleString()}</h3>
                    </div>
                </div>

            </div>

            {/* Chart Area */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Inventory Overview</h3>
                    <p className="text-xs text-gray-400">Visual layout sizing your current inventory logs</p>
                </div>
                
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                            />
                            <Tooltip 
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle"/>
                            <Bar 
                                dataKey="count" 
                                name="Total Units"
                                fill="#0ea5e9" 
                                radius={[6, 6, 0, 0]} 
                                maxBarSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MyStatistics;