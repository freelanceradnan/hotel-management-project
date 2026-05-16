import React, { useContext, useState } from 'react';
import { StoreContext } from '../../../Contexts/StoreContext';
import { useDeleteSeperateRoomMutation, useGetSeperateOrderWithEmailQuery } from '../../../Feature/ApiSlice';
import { Link } from 'react-router';

const Management = () => {
     const {currentUser}=useContext(StoreContext)
     const [searchData,setSearchData]=useState([])
        const email=currentUser?.email
       
        const {data:totalRooms=[]}=useGetSeperateOrderWithEmailQuery(email)
        const [deleteRoom]=useDeleteSeperateRoomMutation()

        const deleteHandler=async(roomId)=>{
            
        try {
          
            await deleteRoom({roomId}).unwrap
            
        } catch (error) {
            
        }
        }
        
    return (
       <div className='p-10'>
       
        <h2 className='text-3xl uppercase'>| Management Product</h2>
     
      
        <form action="" className='flex justify-between' >
             <input type="search" name="" id="" className='border' placeholder='Search room by Room...' value={searchData} onChange={(e)=>setSearchData(e.target.value)}/>
             <Link to="/listing"><button className='bg-blue-500 p-2 rounded-sm text-white' type='button'>Add Room</button>
             </Link>
        </form>
        <div>
            <table className='w-full'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Room Id</th>
                        <th>Room Price</th>
                        <th>Room Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
             <tbody>
  {totalRooms.length>0?
    totalRooms.filter((ele)=>{
        if(searchData.length<0){
            return ele;
        }
         else{
             return ele.name.toLowerCase().includes(searchData)
                            }
    }) 
   
    .map((c) => (
      <tr key={c.id}>
        <td>{c.name}</td>
        <td>{c.id}</td>
        <td>{c.price}</td>
        <td>{c.roomType}</td>
        <td className="flex gap-2">
          <Link to={`/rooms/edit/${c.id}`}><button>Edit</button></Link>
          <button onClick={()=>deleteHandler(c.id)} type='button'>X</button>
        </td>
      </tr>
    ))
:
<tr><td>No Room Found</td></tr>
}
</tbody>
             
            </table>
        </div>
       
 
       </div>
    );
};

export default Management;