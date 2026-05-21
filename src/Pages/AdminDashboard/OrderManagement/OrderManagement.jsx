import { Calendar, CircleCheckBig, DollarSign, Edit, Trash2, X } from "lucide-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useChangeOrderStatusMutation, useDeleteSeperateOrderMutation, useGetAllOrdersDataQuery, useGetAllRoomsQuery, useSuccessAllPaymentsQuery, useUnpaidAllPaymentsQuery } from "../../../Feature/ApiSlice";
import { StoreContext } from "../../../Contexts/StoreContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../Firebase/Firebase";
import { toast } from "react-toastify";

const OrderManagement = () => {
  const {data:allOrders}=useGetAllOrdersDataQuery()
  const {data:allRooms}=useGetAllRoomsQuery()
  const {data:allUnpaidOrders}=useUnpaidAllPaymentsQuery()
  const [changeOrder]=useChangeOrderStatusMutation()
  const [deleteORder]=useDeleteSeperateOrderMutation()
  const {currentUser}=useContext(StoreContext)
  const [adminRooms,setAdminRooms]=useState([])
  
  const [adminOrder,setAdminOrder]=useState([])
  const {data:AllPaymentsOrder}=useSuccessAllPaymentsQuery()
  const [searchData,setSearchData]=useState("")
  const userEmail=currentUser?.email||{}
  const [editId,setEditId]=useState(null)

  //total user order
  const UsersOrder=allOrders?.length-adminOrder?.length||0

  //unpaidTotals
  const unPaidTotalOrder=allOrders?.length-AllPaymentsOrder?.length||0

  const AdminPaymentOrders = AllPaymentsOrder?.filter(order => {
    return adminRooms?.some(room => room.id === order.RoomId);
  });

  //AllUnpaidORders
  const unPaidAdminOrder=allUnpaidOrders?.filter(order=>{
    return adminRooms?.some(room=>room.id===order.RoomId)
  })

  useEffect(()=>{
    if(allRooms){
      const AdminRooms=allRooms?.filter(c=>c.owner==="Admin")
      setAdminRooms(AdminRooms)
    }
  },[allRooms])
  
  useEffect(() => {
    const AdminOrders = allOrders?.filter(order => {
      return adminRooms?.some(room => room.id === order.RoomId);
    });
    
    setAdminOrder(AdminOrders)
  }, [adminRooms, allOrders]);

  const totalRevenue=useMemo(()=>{
    return AllPaymentsOrder?.reduce((sum,item)=>sum+=item.Price,0)
  },[AllPaymentsOrder])

  const AdminOrderRevenue=useMemo(()=>{
    return AdminPaymentOrders?.reduce((sum,item)=>sum+=item.Price,0)
  },[adminOrder])

  const userOrderRevenue=useMemo(()=>{
    return totalRevenue-AdminOrderRevenue
  },[adminOrder])

  //filtering logic
  const filteredOrder = useMemo(() => {
    if (!allOrders) return [];
    
    const searchClean = searchData.trim().toLowerCase();

    if (!searchClean) return allOrders;

    if (searchClean === "admin") {
      return allOrders.filter((order) =>
        adminOrder?.some((admin) => admin.RoomId === order.RoomId)
      );
    }

    if (searchClean === "user") {
      return allOrders.filter((order) =>
        !adminOrder?.some((admin) => admin.RoomId === order.RoomId)
      );
    }

    return allOrders.filter((order) =>
      order.RoomId?.toLowerCase().includes(searchClean) || 
      order.email?.toLowerCase().includes(searchClean)
    );
  }, [allOrders, adminOrder, searchData]);

  //auto payment status update
  const changeStatus = async ({ value, id }) => {
    try {
      await changeOrder({ value, id }).unwrap();
      setEditId(null);
    } catch (error) {
      console.error("RTK Mutation Failed:", error);
    }
  };
const deleteORderHandler=async(id)=>{
  try {
    await deleteORder(id).unwrap()
    toast.success('order delete success!')
  } catch (error) {
   toast.error('failed to delete order') 
  }
}
  return (
    <div className=" bg-gray-50 min-h-screen font-sans">
      {/* Title Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight uppercase">Book Management</h2>
        <p className="text-gray-500 mt-1">Manage, monitor, and update ordered rooms efficiently.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Orders</h1>
              <p className="text-3xl font-bold text-gray-800 mt-1">{allOrders?.length || 0}</p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-lg"><Calendar size={20} /></div>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 mt-4 text-xs text-gray-500">
            <div>Admin: <span className="font-semibold text-gray-700">{adminOrder?.length || 0}</span></div>
            <div>User: <span className="font-semibold text-gray-700">{UsersOrder}</span></div>
          </div>
        </div>

        {/* Card 2: Paid Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Paid Orders</h1>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{AllPaymentsOrder?.length || 0}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-lg"><CircleCheckBig size={20} /></div>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 mt-4 text-xs text-gray-500">
            <div>Admin: <span className="font-semibold text-gray-700">{AdminPaymentOrders?.length || 0}</span></div>
            <div>User: <span className="font-semibold text-gray-700">{(AllPaymentsOrder?.length - AdminPaymentOrders?.length) || 0}</span></div>
          </div>
        </div>

        {/* Card 3: Unpaid Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Unpaid Orders</h1>
              <p className="text-3xl font-bold text-rose-600 mt-1">{unPaidTotalOrder || 0}</p>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-lg"><X size={20} /></div>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 mt-4 text-xs text-gray-500">
            <div>Admin: <span className="font-semibold text-gray-700">{unPaidAdminOrder?.length || 0}</span></div>
            <div>User: <span className="font-semibold text-gray-700">{(unPaidTotalOrder - unPaidAdminOrder?.length) || 0}</span></div>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</h1>
              <p className="text-3xl font-bold text-amber-600 mt-1">${totalRevenue || 0}</p>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-lg"><DollarSign size={20} /></div>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 mt-4 text-xs text-gray-500">
            <div>Admin: <span className="font-semibold text-gray-700">${AdminOrderRevenue || 0}</span></div>
            <div>User: <span className="font-semibold text-gray-700">${userOrderRevenue || 0}</span></div>
          </div>
        </div>

      </div>

      {/* Search Input Custom Styling */}
      <div className="mb-6">
        <input 
          type="search" 
          placeholder="Find Admin or Users Order (or type 'admin' / 'user')..." 
          className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm transition" 
          onChange={(e)=>setSearchData(e.target.value)}
        />
      </div>

      {/* Order Table Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 uppercase text-xs font-bold border-b border-gray-100 tracking-wider">
                <th className="px-6 py-4">Room Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Booking Email</th>
                <th className="px-6 py-4">Room Owners</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredOrder?.map((order) => {
                const isAdminOrder = adminOrder?.some(admin => admin.RoomId === order.RoomId);
                
                // Unified source-of-truth status checker
                const isPaid = order.isPayment === true || order.status === "Paid" || order.status === "true";

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition duration-150">
                    <td className="px-6 py-4 font-semibold text-gray-900">{order.RoomId}</td>
                    
                    <td className="px-6 py-4">
                      {editId === order.id ? (
                        <select 
                          className="px-2 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          onChange={(e) => changeStatus({ value: e.target.value, id: order.id })} 
                          defaultValue={isPaid ? "true" : "false"}
                        >
                          <option value="true">Paid</option>
                          <option value="false">Unpaid</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isPaid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {isPaid ? "Paid" : "Unpaid"}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-500">{order.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase ${
                        isAdminOrder ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-gray-100 text-gray-600"
                      }`}>
                        {isAdminOrder ? "Admin" : "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${order.Price}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button 
                          onClick={() => setEditId(editId === order.id ? null : order.id)}
                          className={`p-1 rounded transition ${editId === order.id ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-blue-600"}`}
                          title="Edit Status"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-rose-600 rounded transition"
                          title="Delete" type="button" onClick={()=>deleteORderHandler(order.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {/* Empty state when filtering finds nothing */}
              {filteredOrder?.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400 font-medium">
                    No records found matching your search.
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

export default OrderManagement;