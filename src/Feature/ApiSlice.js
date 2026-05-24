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
    UnpaidAllPayments: builder.query({
      async queryFn() {
        try {
          const q=query(collection(db,'orders'),where("isPayment","==",false))
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
  changeOrderStatus: builder.mutation({
  async queryFn({ value, id }) {
    try {
      console.log("Updating order:", id, "with value:", value);
      const docRef = doc(db, 'orders', id);
      
      const isPaymentString = String(value) === "true" ? true : false;
      const statusString = isPaymentString === "true" ? "Paid" : "Unpaid";
      
      
      await updateDoc(docRef, { 
        isPayment: isPaymentString,
        status: statusString
      });
      
      return { data: true };
    } catch (error) {
      return { 
        error: { 
          status: 'CUSTOM_ERROR', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      };
    }
  },
  invalidatesTags: ['orders']
})
,
deleteSeperateOrder: builder.mutation({
  async queryFn(id) {
    // console.log(id)
    try {
      
      const docRef = doc(db, 'orders', id);

      
      await deleteDoc(docRef,id);
      
      return { data: true };
    } catch (error) {
      return { 
        error: { 
          status: 'CUSTOM_ERROR', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      };
    }
  },
  invalidatesTags: ['orders']
}),
// feature/ApiSlice.js
getPaymentRequest: builder.query({
  async queryFn() {
    try {
      const docRef = collection(db, 'payments');
      const result = await getDocs(docRef);
      const paymentData = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: paymentData };
    } catch (error) {
      console.error(error.message);
      
      return { error: error.message || 'Failed to fetch payments' };
    }
  },
  providesTags: ['payment']
}),

makePendingPayment: builder.mutation({
  async queryFn({id,value}) {
    try {
      const docRef = doc(db, 'payments', id);
      await updateDoc(docRef, {
        status: "Paid",
        ...value
      });
     
      return { data: { id, status: "Paid" } };
    } catch (error) {
      console.error(error.message);
      return { error: error.message || 'Failed to update status' };
    }
  },
  invalidatesTags: ['payment']
}),
updateUserAndRole: builder.mutation({
  async queryFn({ id, role, isActive }) {
   
    try {
      if (!id) throw new Error("Missing document ID");
      
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, { role, isActive });
      
      return { data: "Success" };
    } catch (err) {
      return { error: { message: err.message } };
    }
  },
  invalidatesTags:['users']
}),
checkUserAuthenticated: builder.query({
  async queryFn(email) {
    console.log("Checking email in Firestore:", email);
    
    try {
    
      const q = query(collection(db, 'users'), where('email', '==', email));
      
     
      const querySnapshot = await getDocs(q); 
      
     
      const filtered = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      
     
      return { data: filtered };
      
    } catch (error) {
      console.error("Firestore Error:", error);
     
      return { error: error.message || error };
    }
  }
}),
deleteUserData: builder.mutation({
  async queryFn(id) {
    try {
      const docRef = doc(db, 'users', id);
      await deleteDoc(docRef);
      return { data: { success: true, id } }; 
    } catch (error) {
      console.error("Firebase Delete Error: ", error);
      return { error: { message: error.message || 'Failed to delete user' } };
    }
  },
  invalidatesTags: ['users']
})
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
  useUnpaidAllPaymentsQuery,
  useChangeOrderStatusMutation,
  useDeleteSeperateOrderMutation,
  useGetPaymentRequestQuery,
  useMakePendingPaymentMutation,
  useUpdateUserAndRoleMutation,
  useCheckUserAuthenticatedQuery,
  useLazyCheckUserAuthenticatedQuery,
  useDeleteUserDataMutation
} = ApiSlice;