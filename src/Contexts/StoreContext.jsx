import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
    const unsubscribe=onAuthStateChanged(auth,async(user)=>{
        try {
        if(!user){
            setIsLogin(false)
            return;
        }
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) {
          await signOut(auth);
          setIsLoading(false);
          return;
        }
        const data = snap.data();

        setCurrentUser(user);
        setRole(data.role || "user");
        setIsLogin(true);
        setLoading(false);

        } catch (error) {
        console.log(error);
        resetAuth();
        setLoading(false);
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

