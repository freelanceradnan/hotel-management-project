import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, getDoc, onSnapshot } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";

export const ApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['rooms', 'orders', 'users','payment'],
  endpoints: (builder) => ({
    
    getAllRooms: builder.query({
      async queryFn() {
        try {
          const docRef = collection(db, 'rooms');
          const docSnap = await getDocs(docRef);
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        } catch (error) {
          return { error: { message: "failed to return room data" } };
        }
      },
      providesTags: ['rooms']
    }),

    getSeperateOrder: builder.query({
      async queryFn(emailid) {
        try {
          const q = query(collection(db, 'orders'), where("email", "==", emailid));
          const docSnap = await getDocs(q);
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        } catch (error) {
          return { error: { message: "failed to return user data" } };
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
        
        try {
          const docRef = doc(db, "orders", orderData.id);
          await updateDoc(docRef, orderData.OrderPayload);
          return { data: { success: true } };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ['orders'] 
    }),

    getUserData: builder.query({
      async queryFn() {
        try {
          const docRef = collection(db, 'users');
          const docSnap = await getDocs(docRef);
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        } catch (error) {
          return { error: { message: "failed to return user data" } };
        }
      },
      providesTags: ['users']
    }),

    getSeperateOrderWithEmail: builder.query({
      async queryFn(emailid) {
        try {
          const q = query(collection(db, 'rooms'), where("owner", "==", emailid));
          const docSnap = await getDocs(q);
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        } catch (error) {
          return { error: { message: "failed to return user data" } };
        }
      },
      providesTags: ['rooms'] 
    }),

    getAllOrdersData: builder.query({
      async queryFn() {
        try {
          const docRef = collection(db, 'orders');
          const docSnap = await getDocs(docRef);
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        } catch (error) {
          return { error: { message: "failed to return user data" } };
        }
      },
      providesTags: ['orders'] 
    }),
    addRoom: builder.mutation({
      async queryFn(roomData) {
        try {
          const docRef = collection(db, 'rooms');
          await addDoc(docRef, roomData);
          return { data: 'ok' };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ['rooms'] 
    }),
    deleteSeperateRoom: builder.mutation({
      async queryFn({ roomId }) { 
        try {
          const docRef = doc(db, "rooms", roomId);
          await deleteDoc(docRef);
          return { data: { success: true } };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ['rooms'] 
    }),
    updateRoom: builder.mutation({
      async queryFn({id,roomdata}) {
        

        try {
          const docRef = doc(db, 'rooms',id);
          
          await updateDoc(docRef, roomdata);
          return { data: 'ok' };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ['rooms'] 
    }),
    updateOrderPayment:builder.mutation({
      async queryFn({id,value}){
      
        try {
    const updateRef=doc(db,'orders',id)
    await updateDoc(updateRef,{isPayment:value})
    return { data: 'success' };
   } catch (error) {
    return {error: error.message||"message"}
   }
      },
      invalidatesTags:['orders']
    }),
    addUserPaymentRequest: builder.mutation({
      async queryFn(paymentInfo) {
        try {
          const docRef = collection(db, 'payments');
          await addDoc(docRef, paymentInfo);
          return { data: 'ok' };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ['payment'] 
    }),
    successAllPayments: builder.query({
      async queryFn() {
        try {
          const q=query(collection(db,'orders'),where("isPayment","==",true))
          const docSnap=await getDocs(q)
          
        
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        } catch (error) {
          return { error: { message: "failed to return user data" } };
        }
      },
      providesTags: ['orders'] 
    }),
      getAllRooms: builder.query({
      async queryFn() {
        try {
          const docRef = collection(db, 'rooms');
          const docSnap = await getDocs(docRef);
          return {
            data: docSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          };
        } catch (error) {
          return { error: { message: "failed to return user data" } };
        }
      },
      providesTags: ['rooms'] 
    }),
  })
});

export const { 
  useGetAllRoomsQuery, 
  useGetUserDataQuery,
  useGetSeperateOrderQuery, 
  useAddOrderMutation,
  useUpdateOrderMutation,
  useGetSeperateOrderWithEmailQuery,
  useGetAllOrdersDataQuery,
  useDeleteSeperateRoomMutation,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useUpdateOrderPaymentMutation,
  useAddUserPaymentRequestMutation,
  useSuccessAllPaymentsQuery,
} = ApiSlice;