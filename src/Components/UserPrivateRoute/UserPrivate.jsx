import React, { useContext } from 'react';
import { StoreContext } from '../../Contexts/StoreContext';
import { Navigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';

const UserPrivate = ({children}) => {
    const {isLogin,currenUser,loading,role}=useContext(StoreContext)
    
    const location=useLocation()
    if(loading){
        return <div className='min-h-screen flex items-center justify-center '>
            <div className='w-[500px]'>
                
<div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
  <div className="flex animate-pulse space-x-4">
    <div className="size-10 rounded-full bg-gray-200"></div>
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 rounded bg-gray-200"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-2 rounded bg-gray-200"></div>
          <div className="col-span-1 h-2 rounded bg-gray-200"></div>
        </div>
        <div className="h-2 rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
</div>
            </div>
        </div>
    }
    if(!isLogin){
        
            toast.error('please login now') 
 return <Navigate to="/" state={{ from: location }} replace />;
 
        
        
    }
//     if (!currenUser || !isLogin) {
//     return <Navigate to="/" replace />;
//   }
    return children
};

export default UserPrivate;