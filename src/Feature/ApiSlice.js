import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore"; // Added addDoc
import { db } from "../Firebase/Firebase";

export const ApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['rooms', 'orders'], 
  endpoints: (builder) => ({
    getAllRooms: builder.query({
      async queryFn() {
        try {
          const docRef = collection(db, 'rooms')
          const docSnap = await getDocs(docRef)
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          }
        } catch (error) {
          return { error: { message: "failed to return room data" } }
        }
      },
      providesTags: ['rooms']
    }),

    getSeperateOrder: builder.query({
      async queryFn(emailid) {
        try {
          const q = query(collection(db, 'orders'), where("email", "==", emailid))
          const docSnap = await getDocs(q)
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          }
        } catch (error) {
          return { error: { message: "failed to return user data" } }
        }
      },
      
      providesTags: ['orders'] 
    }),

    addOrder: builder.mutation({
      async queryFn(orderData) {
        try {
          const docRef = collection(db, 'orders');
          await addDoc(docRef, orderData);
          return { data: 'ok' };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      
      invalidatesTags: ['orders'] 
    }),
    updateOrder: builder.mutation({
  async queryFn({ orderData }) {
  console.log(orderData.id)
    try {

      const docRef = doc(
        db,
        "orders",
        orderData.id
      );

      await updateDoc(docRef, orderData.OrderPayload);

       return {
        data: {
          success: true
        }
      };


    } catch (error) {

      return {
        error: {
          message: error.message
        }
      };

    }
  },
  invalidatesTags: ['orders'] 
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
    }),
       getSeperateOrderWithEmail: builder.query({
      async queryFn(emailid) {
        try {
          const q = query(collection(db,'rooms'), where("owner", "==", emailid))
          const docSnap = await getDocs(q)
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          }
        } catch (error) {
          return { error: { message: "failed to return user data" } }
        }
      },
      
      providesTags: ['orders'] 
    }),
    getAllOrdersData:builder.query({
    async queryFn(){
    try {
    const docRef=collection(db,'orders')
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
    }),
  })
})


export const { 
  useGetAllRoomsQuery, 
  useGetUserDataQuery,
  useGetSeperateOrderQuery, 
  useAddOrderMutation,
  useUpdateOrderMutation,
  useGetSeperateOrderWithEmailQuery,
  useGetAllOrdersDataQuery
} = ApiSlice;