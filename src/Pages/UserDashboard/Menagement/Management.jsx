import React, { useContext, useState } from 'react';
import { StoreContext } from '../../../Contexts/StoreContext';
import { useDeleteSeperateRoomMutation, useGetSeperateOrderWithEmailQuery } from '../../../Feature/ApiSlice';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

const Management = () => {
    const { currentUser } = useContext(StoreContext);
    const [searchData, setSearchData] = useState(""); 
    const email = currentUser?.email;
    const { data: totalRooms = [], isLoading } = useGetSeperateOrderWithEmailQuery(email);
    const [deleteRoom] = useDeleteSeperateRoomMutation();
     
    const deleteHandler = async (roomId) => {
        if (window.confirm("Are you sure you want to delete this room listing?")) {
            try {

                await deleteRoom({ roomId }).unwrap();
                toast.success("Room deleted successfully");
            } catch (error) {
                toast.error("Failed to delete room");
            }
        }
    };

    // Filter logic
    const filteredRooms = totalRooms.filter((ele) => {
        if (!searchData.trim()) return ele;
        return ele.name?.toLowerCase().includes(searchData.toLowerCase());
    });
        
    return (
        <div className='min-h-screen bg-slate-50/50 font-sans text-slate-800 antialiased'>
            <div className='max-w-6xl mx-auto'>
                
                {/* Header Section */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 mb-8 gap-4'>
                    <div>
                         <h2 className='text-3xl font-bold text-gray-800 uppercase tracking-wide'>Manage Listed Rooms</h2>
                        <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600">Inventory Management</span>
                       
                    </div>
                    <div>
                        <Link to="/listing" state={{owner:email}}>
                            <button className='bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5' type='button'>
                                <span className="text-sm">+</span> Add New Room
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Filters/Search Bar */}
                <div className='bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs'>
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            className='w-full border border-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-slate-400' 
                            placeholder='Search rooms by title...' 
                            value={searchData} 
                            onChange={(e) => setSearchData(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Layout */}
                <div className='bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden'>
                    <div className="overflow-x-auto">
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500'>
                                    <th className='py-3 px-5'>Room Details</th>
                                    <th className='py-3 px-5'>Room ID</th>
                                    <th className='py-3 px-5'>Type</th>
                                    <th className='py-3 px-5'>Base Price</th>
                                    <th className='py-3 px-5 text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100 text-xs text-slate-700'>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-slate-400 font-medium animate-pulse">
                                            Loading inventory entries...
                                        </td>
                                    </tr>
                                ) : filteredRooms.length > 0 ? (
                                    filteredRooms.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className='py-4 px-5 font-semibold text-slate-900'>{c.name}</td>
                                            <td className='py-4 px-5 font-mono text-slate-400 text-[11px]'>{c.id}</td>
                                            <td className='py-4 px-5'>
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${c.roomType === 'Single Bed' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
                                                    {c.roomType}
                                                </span>
                                            </td>
                                            <td className='py-4 px-5 font-medium text-slate-900'>${c.price}<span className="text-[10px] font-normal text-slate-400">/night</span></td>
                                            <td className='py-4 px-5 text-right'>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/rooms/edit/${c.id}`}>
                                                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg font-medium transition-colors text-[11px]">
                                                            Edit
                                                        </button>
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteHandler(c.id)} 
                                                        type='button'
                                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                                        title="Delete item"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16">
                                            <div className="max-w-xs mx-auto text-center">
                                                <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v6a2 2 0 012-2m14-8V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4" />
                                                </svg>
                                                <h3 className="mt-2 text-xs font-semibold text-slate-900">No rooms found</h3>
                                                <p className="mt-1 text-[11px] text-slate-400">Try adjustment to search variables or register a new room blueprint mapping.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Management;