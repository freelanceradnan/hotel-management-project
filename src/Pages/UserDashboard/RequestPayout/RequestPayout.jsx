import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BanknoteArrowDown, DollarSign, HandCoins, CheckCircle, Clock } from 'lucide-react';
import { useAddUserPaymentRequestMutation, useGetAllOrdersDataQuery, useGetSeperateOrderWithEmailQuery } from '../../../Feature/ApiSlice';
import { StoreContext } from '../../../Contexts/StoreContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../../Firebase/Firebase';
import { Link } from 'react-router';

const RequestPayout = () => {
    const { currentUser } = useContext(StoreContext);
    const userEmail = currentUser?.email;
    const { data: allOrder, isLoading: isOrdersLoading } = useGetAllOrdersDataQuery();
    const { data: totalRooms = [], isLoading: isRoomsLoading } = useGetSeperateOrderWithEmailQuery(userEmail);
    const [addPayRequest] = useAddUserPaymentRequestMutation();
    const [payoutTrigger, setPayoutTrigger] = useState(false);
    const [payRequestStatus, setPayRequestStatus] = useState([]);
    const [payRequestStatusLoading, setPayRequestStatusLoading] = useState(false);
    
    // running order array
    const runningOrder = useMemo(() => {
        if (!allOrder || totalRooms.length === 0) return [];
        const seperateRoomIds = new Set(totalRooms?.map(c => c.id));
        return allOrder.filter(order => seperateRoomIds.has(order.RoomId));
    }, [allOrder, totalRooms]);

    // follow stats
    const stats = useMemo(() => {
        const totalPayment = runningOrder.reduce((sum, r) => sum += r.Price, 0);
        const pendingPayment = payRequestStatus
            .filter(r => r.status === "Payment Pending")
            .reduce((sum, r) => sum += r.price, 0);
        const successPayment = payRequestStatus
            .filter(r => r.status === "Paid" || r.status === "Success")
            .reduce((sum, r) => sum += r.price, 0);

        return { totalPayment, pendingPayment, successPayment };
    }, [runningOrder, payRequestStatus]);

    // send request to db
    const requestPayment = async ({ e, value }) => {
        e.preventDefault();
        if (value) {
            try {
                const initValue = {
                    owner: userEmail,
                    RoomName: value.name || "Room",
                    status: "Payment Pending",
                    RoomId: value.RoomId,
                    Price: value.Price,
                    OrderId: value.OrderId
                };
             
                await addPayRequest(initValue).unwrap();
                
                setPayoutTrigger(true)
                toast.success('Payout requested successfully!');
            } catch (error) {
                console.log(error.message);
                toast.error('Failed to request payout.');
            }
        }
    };

    useEffect(() => {
        if (!userEmail || runningOrder.length === 0) {
            setPayRequestStatus([]);
            setPayRequestStatusLoading(false);
            return; 
        }

        setPayRequestStatusLoading(true);
        const q = query(collection(db, 'payments'), where("owner", "==", userEmail));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const filteredData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            setPayRequestStatus(filteredData.map(c => ({
                order: c.OrderId,
                status: c.status,
                price: c.Price
            })));

            setPayRequestStatusLoading(false);
        }, (error) => {
            console.error("Firestore live fetch error:", error);
            setPayRequestStatusLoading(false);
        });

        return () => unsubscribe();
    }, [userEmail, runningOrder.length]); 

    const globalLoading = isOrdersLoading || isRoomsLoading;

    return (
        <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">Request Payout</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your orders and track your withdrawal requests.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Balance</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">${stats.totalPayment.toLocaleString()}</h3>
                    </div>
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <DollarSign className="w-6 h-6" /> 
                    </div>
                </div>
                
                {/* Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending Withdraw</p>
                        <h3 className="text-2xl font-bold text-amber-600 mt-1">${stats.pendingPayment.toLocaleString()}</h3>
                    </div>
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
                        <BanknoteArrowDown className="w-6 h-6" />
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Success Withdraw</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">${stats.successPayment.toLocaleString()}</h3>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <HandCoins className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">Your Booking Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4">Booking Email</th>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                            {globalLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-400">Loading your data...</td>
                                </tr>
                            ) : runningOrder.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-400">No orders found.</td>
                                </tr>
                            ) : (
                                runningOrder.map((c) => {
                                    const matchStatus = Array.isArray(payRequestStatus) && payRequestStatus.find((item) => item.order === c.OrderId);
                                    const isRequested = !!matchStatus;
                                    const statusText = matchStatus?.status || "Available";

                                    return (
                                        <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{c.email}</td>
                                            <td className="px-6 py-4 font-mono text-gray-500">{c.OrderId}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">${c.Price}</td>
                                            <td className="px-6 py-4 text-center">
                                                {payRequestStatusLoading ? (
                                                    <span className="text-gray-400 text-xs animate-pulse">Checking...</span>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        statusText === "Payment Pending" ? "bg-amber-50 text-amber-700" :
                                                        statusText === "Paid" || statusText === "Success" ? "bg-emerald-50 text-emerald-700" :
                                                        "bg-blue-50 text-blue-700"
                                                    }`}>
                                                        {statusText === "Payment Pending" && <Clock className="w-3 h-3" />}
                                                        {(statusText === "Paid" || statusText === "Success") && <CheckCircle className="w-3 h-3" />}
                                                        {statusText}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {payRequestStatusLoading ? (
                                                    <div className="h-8 w-24 bg-gray-100 animate-pulse rounded ml-auto"></div>
                                                ) : isRequested ? (
                                                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                                                        Requested
                                                    </span>
                                                ) : (
                                                   
                                                    <button 
                                                        className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow active:scale-95 transition-all" 
                                                        onClick={(e) => requestPayment({ e, value: c })}
                                                    >
                                                        Request Payout
                                                        
                                                    </button>
                                                    
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequestPayout;