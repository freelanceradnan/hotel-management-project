import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAdminSettingsQuery } from "../Feature/ApiSlice";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const {data:adminSettings}=useAdminSettingsQuery()
   const [currentUser,setCurrentUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const [isLogin,setIsLogin]=useState(false)
    const [role,setRole]=useState(null)
    const [orderDetails,setOrderDetails]=useState({})
    const [roomBookingDate,setRoomBookingDate]=useState({})
    const [OrderTime,setOrderTime]=useState("")
    const [PreBookingData,setPreBookingData]=useState({})
    const [updateOrderId,setUpdateOrderId]=useState("")
    const [isOrderNotify,setIsOrderNotify]=useState(true)
    const [isPaymentNotify,setIsPaymentNotify]=useState(true)
    const [isListingNotify,setIsListingNotify]=useState(true)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      try {
        if (!user) {
          setCurrentUser(null);
          setIsLogin(false);
          setRole(null);
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        setCurrentUser(user);
        setIsLogin(true);

        if (docSnap.exists()) {
          setRole(docSnap.data().role || "user");
        } else {
          setRole("user");
        }
      } catch (error) {
        console.log(error);
        setCurrentUser(null);
        setIsLogin(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
  //const adminSettings
  useEffect(()=>{
  if(adminSettings){
 setIsOrderNotify(adminSettings[0].isOrderNotify)
 setIsPaymentNotify(adminSettings[0].isPaymentNotify)
 setIsListingNotify(adminSettings[0].isUserListing)
  }
  },[adminSettings])
  const value = {
     currentUser,role,isLogin,loading,orderDetails,setOrderDetails,roomBookingDate,setRoomBookingDate,OrderTime,setOrderTime,PreBookingData,setPreBookingData,updateOrderId,setUpdateOrderId,isOrderNotify,isPaymentNotify,isListingNotify
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};