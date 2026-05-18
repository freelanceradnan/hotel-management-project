import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StoreContext } from '../../../Contexts/StoreContext';
import { useGetAllOrdersDataQuery, useGetSeperateOrderWithEmailQuery, useUpdateOrderPaymentMutation } from '../../../Feature/ApiSlice';
import { Pencil, X, CheckCircle, XCircle, DollarSign, Calendar, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Bookings = () => {
    const { currentUser } = useContext(StoreContext);
    const [searchData, setSearchData] = useState("");
    const userEmail = currentUser?.email;
    
    const { data: allOrder, isLoading: isOrdersLoading } = useGetAllOrdersDataQuery();
    const { data: totalRooms = [], isLoading: isRoomsLoading } = useGetSeperateOrderWithEmailQuery(userEmail);
    
    const [updatePayment, { isLoading: isUpdating }] = useUpdateOrderPaymentMutation();
    
    const [editId, setEditId] = useState(null);
     
   //filtering logic
    const runningOrder = useMemo(() => {
        if (!allOrder || totalRooms.length === 0) return [];
        const seperateRoomIds = new Set(totalRooms.map(c => c.id));
        return allOrder.filter(order => seperateRoomIds.has(order.RoomId));
    }, [allOrder, totalRooms]); 

    //fitering logic
    const filteredRooms = useMemo(() => {
        if (!searchData.trim()) return runningOrder;
        return runningOrder.filter((ele) =>
            ele.email?.toLowerCase().includes(searchData.toLowerCase())
        );
    }, [runningOrder, searchData]);

   //(Stats Calculation)
    const stats = useMemo(() => {
        const total = filteredRooms.length;
        const paid = filteredRooms.filter(o => o.isPayment === true || o.isPayment === 'true').length;
        const unpaid = total - paid;
        const totalRevenue = filteredRooms.reduce((sum, o) => {
    const roomPrice = (o.isPayment === true || o.isPayment === 'true') ? (Number(o.Price) || 0) : 0;
    return sum + roomPrice;
}, 0);

        return { total, paid, unpaid, totalRevenue };
    }, [filteredRooms]);

    // payment update
    const changeHandler = async (value, id) => {
       
        const boolValue = value === "true"; 
        try {
            await updatePayment({ id, value: boolValue }).unwrap();
            setEditId(null);
            toast.success('Payment status updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update payment status.');
        }
    };

    if (isOrdersLoading || isRoomsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <RefreshCw className="animate-spin text-blue-600 h-8 w-8" />
                <span className="ml-2 text-gray-600 font-medium">Loading Bookings...</span>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
         {/* headers-section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">Book Management</h1>
                <p className="text-gray-500 mt-1">Manage, monitor, and update ordered rooms efficiently.</p>
            </div>

            {/*dis card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {/* total bookings*/}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Calendar size={24} />
                    </div>
                </div>

                {/* paid booking*/}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase">Paid Rooms</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{stats.paid}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <CheckCircle size={24} />
                    </div>
                </div>

                {/* unpaid bookings */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase">Unpaid Rooms</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{stats.unpaid}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <XCircle size={24} />
                    </div>
                </div>

                {/* totals revinew */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">${stats.totalRevenue}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>

            {/* search*/}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <input 
                        type="search" 
                        value={searchData}
                        onChange={(e) => setSearchData(e.target.value)} 
                        placeholder="Search by customer email..."
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                </div>
            </div>

            {/* table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                                <th className="px-6 py-4 font-semibold">Booking Email</th>
                                <th className="px-6 py-4 font-semibold">Room Name</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((order) => {
                                    const isPaid = order.isPayment === true || order.isPayment === 'true';
                                    const isEditing = editId === order.id;

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/70 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">{order.email}</td>
                                            <td className="px-6 py-4 text-gray-600">{order.name || "N/A"}</td>
                                            
                                            {/* stastus badge system */}
                                            <td className="px-6 py-4">
                                                {isEditing ? (
                                                    <select 
                                                        defaultValue={String(order.isPayment)} 
                                                        disabled={isUpdating}
                                                        onChange={(e) => changeHandler(e.target.value, order.id)}
                                                        className="block w-28 px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                                    >
                                                        <option value="true">Paid</option>
                                                        <option value="false">Not Paid</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isPaid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                        {isPaid ? 'Paid' : 'Not Paid'}
                                                    </span>
                                                )}
                                            </td>
                                            
                                            <td className="px-6 py-4 font-semibold text-gray-800">${order.Price}</td>
                                            
                                            {/* action button */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button 
                                                        onClick={() => setEditId(isEditing ? null : order.id)}
                                                        className={`p-1.5 rounded-md transition ${
                                                            isEditing 
                                                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                        }`}
                                                        title={isEditing ? "Cancel" : "Edit Status"}
                                                    >
                                                        {isEditing ? <X size={16} /> : <Pencil size={16} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => alert('Deleted done!')}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                                                        title="Delete Booking"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;