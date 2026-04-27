import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from '../Firebase/Firebase';
import { onAuthStateChanged, onIdTokenChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
export const StoreContext=createContext()
export const StoreContextProvider = ({children}) => {
    const [currentUser,setCurrentUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const [isLogin,setIsLogin]=useState(false)
    const [role,setRole]=useState(null)
    
    const resetAuth = () => {
    setCurrentUser(null);
    setIsLogin(false);
    setRole(null);
  };
  useEffect(()=>{
  const unsubscribe=onIdTokenChanged(auth,async(user)=>{
    setLoading(true)
    try {
        //after logout all clear
    if(!user){
    setCurrentUser(null);
    setRole(null);
    setIsLogin(false);
    }
    else{
    const docRef=doc(db,'users',user.uid)
    const docSnap=await getDoc(docRef)
    if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentUser(user);
          setRole(data.role || "user");
          setIsLogin(true);
        }
    //g login
    else{
    setCurrentUser(user);
          setRole("user"); 
          setIsLogin(true);
          console.warn("no doc in meet on firebase");
    }
    
    }
    } catch (error) {
    setCurrentUser(null)
    setRole(null)
    setIsLogin(false)
    console.log(error.code)
    }
    finally{
        setLoading(false)
    }
  })
  return ()=>unsubscribe()
  },[])

    const value={
        currentUser,role,isLogin,loading
    }
    return (
        <StoreContext.Provider value={value}>
       {children}
        </StoreContext.Provider>
    );
};

