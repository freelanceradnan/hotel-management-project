import React, { useContext } from 'react';
import { StoreContext } from '../../Contexts/StoreContext';
import { Navigate, useLocation } from 'react-router';

const UserPrivate = ({children}) => {
    const {isLogin,currenUser,loading,role}=useContext(StoreContext)
    console.log(isLogin,currenUser)
    const location=useLocation()
    if(loading){
        return <div>Loading ...</div>
    }
    if(!isLogin){
        return  <Navigate to="/" state={{ from: location }} replace />;
    }
//     if (!currenUser || !isLogin) {
//     return <Navigate to="/" replace />;
//   }
    return children
};

export default UserPrivate;