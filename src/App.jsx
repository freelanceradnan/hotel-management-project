import { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router'
import Home from './Pages/Home/Home';
import SignupModal from './Components/SignupModal/SignupModal';
import Footer from './Components/Footer/Footer';
import Rooms from './Pages/AllRooms/Rooms';
import RoomDetails from './Pages/RoomDeatils/RoomDetails';
import MyAccount from './Pages/UserAccount/MyAccount/MyAccount';
import MyProfile from './Components/UserAccount/MyProfile';
import Communications from './Pages/UserAccount/Communications/Communications';
import Payments from './Pages/UserAccount/myPayment/MyPayment';
import MyPayment from './Pages/UserAccount/myPayment/MyPayment';
import MyCoupon from './Pages/UserAccount/myCoupon/MyCoupon';
import Security from './Pages/UserAccount/MySecurity/Security';
import ChangeEmailBasic from './Pages/UserAccount/MySecurity/Security';
import Favorites from './Pages/Favourties/Favorites';
import UserPrivate from './Components/UserPrivateRoute/UserPrivate';
import Checkout from './Pages/RoomCheckout/Checkout';
import Payment from './Pages/Payment/Payment';
import OrderSuccess from './Pages/OrderSuccess/OrderSuccess';

import NotFound from './Pages/NotFound/NotFound';
import InvoicePage from './Pages/InvoicePage/InvoicePage';
import Feedback from './Pages/UserAccount/MyFeedback/Feedback';
import Orders from './Pages/UserAccount/Orders/Orders';
import Prepayment from './Pages/PrePayments/Prepayment';
import PreOrdered from './Pages/PreOrdered/PreOrdered';
import PrePaymentSuccess from './Pages/Prepaymentsuccess/PrePaymentSuccess';
// import Check from './Pages/Check';
import PrePaymentPage from './Pages/PrePaymentPage/PrePaymentPage';
import Listing from './Pages/Listing/Listing';
// import UserDashboard from './Pages/UserDashboard/UserDashboard/UserDashboard';
import UserDashboard from './Pages/UserDashboard/UserDashboard/UserDashboard'
import MyStatistics from './Pages/UserDashboard/My Statistics/MyStatistics';



function App() {
  const location=useLocation()
  
  //hide admin dashboard
const isAdminPath=useLocation().pathname.includes("admin-dashboard")
const [isModal,setIsModal]=useState(false)

//footer hide and navbar hide logic
const allRoutes = [
    "/", "/rooms", "/payment", "/preorder", "/order-success", "/favourites", "/myAccount","/invoice","/prepayment","/prepaymentsuccess","/listing","/userDashboard","/userDashboard/manage","/userDashboard/bookings","/userDashboard/revenue","/userDashboard/contact-admin"
  ];
const isKnownRoute = allRoutes.some(path => location.pathname === path) || 
                       location.pathname.startsWith("/rooms/") || 
                       location.pathname.startsWith("/myAccount/");
const showFooter = !isAdminPath && isKnownRoute;
  return (
  <>
  {/* navbar */}
   {!isAdminPath && showFooter &&<Navbar setIsModal={setIsModal} isModal={isModal}/>}
   {/* all-routes */}
   <div className="min-h-[70vh]">
    {/* all-routes */}
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/rooms" element={<Rooms/>}/>
    <Route path="/invoice" element={<InvoicePage/>}/>
    <Route path="/userDashboard" element={<UserDashboard/>}>
    <Route path="" element={<MyStatistics/>} index="true"/>
    <Route path="manage" element={<h2>this is manage</h2>} />
    <Route path="bookings" element={<h2>this is bookings</h2>} />
    <Route path="revenue" element={<h2>this is revenue</h2>} />
    <Route path="contact-admin" element={<h2>this is contact-admin</h2>} />
    </Route>
    <Route path="/prepayment" element={<PrePaymentPage/>}/>
    <Route path="/listing" element={<Listing/>}/>
    {/* <Route path="/check" element={<Check/>}/> */}
    <Route path="/prepaymentsuccess" element={<PrePaymentSuccess/>}/>
    <Route path="/rooms" element={<Rooms/>}/>
    <Route path="/rooms/checkout/:id" element={
      <UserPrivate>
        <Checkout/>
      </UserPrivate>
    }/>
    <Route path="/payment" element={
      <UserPrivate>
        <Payment/>
      </UserPrivate>
    }/>
    <Route path="/preorder" element={
      <UserPrivate>
        <PreOrdered/>
      </UserPrivate>
    }/>
    <Route path="/order-success" element={
      <UserPrivate>
      <OrderSuccess/>
    </UserPrivate>}/>
    <Route path="/rooms/:id" element={
      
      <RoomDetails/>
   }/>
    <Route path="favourites" element={
      <UserPrivate>
        <Favorites/>
      </UserPrivate>
    }/>
     
    
    <Route path="/myAccount" element={
      <UserPrivate>
        <MyAccount/>
      </UserPrivate>
    } >
    
    <Route path="" element={<MyProfile />} />
    <Route path="communications" element={<Communications/>}/>
    <Route path="orders" element={<Orders/>}/>
    <Route path="payments" element={<MyPayment/>}/>
    <Route path="coupons" element={<MyCoupon/>}/>
    <Route path="security" element={<Security/>}/>
    <Route path="help" element={<Feedback/>}/>
    </Route>
    <Route path="*" element={<NotFound />} />
   </Routes>
   {/* universal-footer-section */}
   
    {showFooter &&
    <div>
     <Footer/>
   </div>
    }
   
   {/* singup modals */}
  {isModal &&  <SignupModal setIsModal={setIsModal}/>}
  
 
   </div>
  </>
  )
}

export default App
