import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";


export const ApiSlice=createApi({
    reducerPath:'api',
    baseQuery:fakeBaseQuery(),
    tagTypes:['rooms'],
    endpoints:(builder)=>({
    getAllRooms:builder.query({
    async queryFn(){
    try {
    const docRef=collection(db,'rooms')
    const docSnap=await getDocs(docRef)
    return {
        data:docSnap.docs.map((doc)=>({
            id:doc.id,
            ...doc.data()
        })),
        error:null
    }
    } catch (error) {
        return {error:{message:"faild to return room data"}}
    }
    }
    }),
    getUserData:builder.query({
    async queryFn(){
    try {
    const docRef=collection(db,'users')
    const docSnap=await getDocs(docRef)
    return {
        data:docSnap.docs.map((doc)=>({
            id:doc.id,
            ...doc.data()
        })),
        error:null
    }
    } catch (error) {
        return {error:{message:"faild to return user data"}}
    }
    }
    })
    
    })
})
export const {useGetAllRoomsQuery,useGetUserDataQuery}=ApiSlice
