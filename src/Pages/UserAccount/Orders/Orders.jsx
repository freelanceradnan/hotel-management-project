import React, { useContext } from 'react';
import { useGetSeperateOrderQuery } from '../../../Feature/ApiSlice';
import { StoreContext } from '../../../Contexts/StoreContext';
import { Download, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';


const Orders = () => {
    const navigate=useNavigate()
    const { currentUser } = useContext(StoreContext);
    const email = currentUser?.email;
    const { data, isLoading } = useGetSeperateOrderQuery(email);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="h-8 w-8 rounded-full border-b-2 border-black animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0">
            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    My Orders
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your bookings and invoices
                </p>
            </div>

            {/* EMPTY STATE */}
            {data?.length === 0 && (
                <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 text-center">
                    <p className="text-gray-400 font-medium">
                        You have no bookings yet.
                    </p>
                </div>
            )}

            {/* MOBILE CARD VIEW  */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {data?.map((d) => (
                    <div key={d.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date</p>
                                <p className="text-sm font-semibold text-gray-900">{d.createAt}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                ${d.status === 'paid' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}
                            >
                                  {d.status=='Paid'||d.status=='paid'?<>{d.status}</>:
                                 
                                 <><button className='bg-red-600 text-white p-2 rounded-md' type='button' onClick={()=>{
                                   
                                 }}>PayNow</button></>}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Room Info</p>
                                <p className="text-sm text-gray-700">Room #{d.RoomId}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order ID</p>
                                <p className="text-xs text-gray-500 break-all">{d.OrderId}</p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Amount</p>
                                <p className="text-lg font-black text-gray-900">${d.Price}</p>
                            </div>
                            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition">
                                {d.status=='Paid'||d.status=='paid'?
                            
                                
                                <Link to="/invoice" state={{orders:d}}>
                                <Download size={14} />
                                Invoice
                                </Link>  :
                                <button onClick={()=>toast.error("invoice disabled please pay first due!")}><X size={14}/></button>  
                            }
                                
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden lg:block w-full overflow-x-auto rounded-3xl border border-gray-100 bg-white">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-5 text-left text-[11px] font-black uppercase text-gray-400">Date</th>
                            <th className="px-6 py-5 text-left text-[11px] font-black uppercase text-gray-400">Room Info</th>
                            <th className="px-6 py-5 text-left text-[11px] font-black uppercase text-gray-400">Order ID</th>
                            <th className="px-6 py-5 text-left text-[11px] font-black uppercase text-gray-400">Total</th>
                            <th className="px-6 py-5 text-left text-[11px] font-black uppercase text-gray-400">Status</th>
                            <th className="px-6 py-5 text-center text-[11px] font-black uppercase text-gray-400">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data?.map((d) => (
                            <tr key={d.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-5 text-sm font-medium whitespace-nowrap">{d.createAt}</td>
                                <td className="px-6 py-5 text-sm text-gray-700 whitespace-nowrap">Room #{d.RoomId}</td>
                                <td className="px-6 py-5 text-xs text-gray-400 truncate max-w-[200px]" title={d.OrderId}>{d.OrderId}</td>
                                <td className="px-6 py-5 text-sm font-black whitespace-nowrap">${d.Price}</td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${d.status === 'Paid' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                        {d.status=='Paid'||d.status=='paid'?<>{d.status}</>:
                                        
                                        <>
                                        <Link to="/prepayment" state={{orders:d}}><button className='bg-red-600 text-white p-2 rounded-md' type='button'>PayNow</button>
                                        </Link>
                                        </>}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button className="p-2 rounded-lg hover:bg-black hover:text-white text-gray-400 transition">
                                         {d.status=='Paid'||d.status=='paid'?
                            
                                
                                <Link to="/invoice" state={{orders:d}}>
                                <Download size={14} />
                                Invoice
                                </Link>  :
                                <button onClick={()=>toast.error("invoice disabled please pay first due!")}><X size={14}/></button>  
                            }
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;