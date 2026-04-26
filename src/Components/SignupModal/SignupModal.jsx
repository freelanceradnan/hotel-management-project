import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { X } from 'lucide-react';
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase';

import { GoogleAuthProvider } from "firebase/auth";
import { toast } from 'react-toastify';
const SignupModal = ({setIsModal}) => {
  const provider = new GoogleAuthProvider();
  //signup states
  const [currentPage,setCurrentPage]=useState("login")

   const [signupLoading,setSignUpLoading]=useState(false)
  const [singupData,setSignupData]=useState({
    name:"",
    email:"",
    password:""
  })
 
  const ChangeSignHandler=(e)=>{
    setSignupData({...singupData,[e.target.name]:e.target.value})
  }
  
  const signupSubmitHandler=async(e)=>{
  e.preventDefault()
  setSignUpLoading(true)
  try {
   const res=await createUserWithEmailAndPassword(auth,singupData.email,singupData.password)
   if(res.user){
    toast.success('Signup Success!', {
              style: { backgroundColor: '#ff8c00', color: '#ffffff' },
            });
     setSignupData({
     name:"",
    email:"",
    password:""
     })
     setSignUpLoading(false)
   }
  
  } catch (error) {
    const errorCode = error.code;
    let message=""
    switch (errorCode) {
      case 'auth/email-already-in-use':
        message="This email is already registered. Try logging in instead.";
        break;
      case 'auth/weak-password':
        message="Your password is too weak. Please use at least 6 characters.";
        break;
      case 'auth/invalid-email':
        message="That email address doesn't look right.";
        break;
      default:
        
        message="An unexpected error occurred. Please try again.";
        
    }
   setSignupData({
    name:"",
    email:"",
    password:""
   })
    toast.error(message,{
  style: {
    backgroundColor: '#ff8c00', 
    color: '#ffffff'          
  },
  progressStyle: {
    background: '#ffffff'     
     }})
     
    setSignUpLoading(false)
  
  }
   
  }
  
  
  //login states
  const [loginLoading,setLoginLoading]=useState(false)
 
  const [loginError,setLoginError]=useState("")
  const [loginData,setLoginData]=useState({
    email:"",
    password:""
  })
  const changeLoginHandler=(e)=>{
    setLoginData({...loginData,[e.target.name]:e.target.value})
  }
  
   const loginSubmitHandler=async(e)=>{
  e.preventDefault()
  setLoginLoading(true)
  setLoginError("")
  try {
   await signInWithEmailAndPassword(auth,loginData.email,loginData.password)
  setLoginLoading(false)
  setLoginError("")
  toast.success('Login Success!', {
              style: { backgroundColor: '#ff8c00', color: '#ffffff' },
            });
  setLoginData({
        email:"",
    password:""
  })
   } catch (error) {
    setLoginData({
      email:"",
      password:""
    })
    let message=""
    switch (error.code) {
      case 'auth/user-not-found':
        message="No user found this email!";
        break;
      case 'auth/wrong-password':
        message="Wrong Password!";
        break;
      case 'auth/invalid-email':
        message="Wrong Email Address!";
        break;
      case 'auth/too-many-requests':
        message="Too many Attemp please try again later";
        break;
      default:
        message="An error occured!Checkout your Internet!";
        break;
    }
    setLoginLoading(false)
    
    toast.error(message, {
              style: { backgroundColor: '#ff8c00', color: '#ffffff' },
            });
    
  }
  
  
  }
  const singInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      toast.success('Google Login Success!', {
              style: { backgroundColor: '#ff8c00', color: '#ffffff' },
            });
      setIsModal(false);
    }
  } catch (error) {
     toast.error(error.code, {
              style: { backgroundColor: '#ff8c00', color: '#ffffff' },
            });
  }
};
//reset password states
const [resetEmail,setResetEmail]=useState("")
const [resetLoading,setResetLoading]=useState(false)
const resetHandler=async()=>{
  setResetLoading(true)
try {

  await sendPasswordResetEmail(auth,resetEmail)
  setResetLoading(false)
  setResetEmail("")
  
  toast.success('Reset Mail Sended!Check Your Email Spam Folder Must!', {
              style: { backgroundColor: '#ff8c00', color: '#ffffff' },
            });
            setCurrentPage('login')
  
} catch (error) {
  setResetLoading(false)
  const errorCode=error.code
  let message=""

  switch(errorCode){
    case 'auth/invalid-email':
    message="Email Not Fount"
    break;
    case 'auth/network-request-failed':
    message="Check your Internet Connection!"
  }
  toast.error(message, {
              style: { backgroundColor: '#ff8c00', color: '#ffffff' },
            });
  setResetEmail("")
}
}
return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur">
  {/* Modal Container */}
  <div className="flex items-center justify-center min-h-screen p-4 w-full lg:w-2/3 ">
  
  <div className="rounded-2xl shadow-2xl flex overflow-hidden border border-slate-100 w-full relative shadow-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] h-[85vh]">
    <button className="absolute top-2 right-3 transition-transform duration-500 active:rotate-[360deg] hover:scale-110" onClick={()=>setIsModal(false)}>
  <X />
</button>
    {/*singup*/}
    {currentPage=='signup' && 
    <>
    <div className="hidden md:block md:w-1/2 hidden">
      <img 
        className="w-full object-cover h-full" 
        src={assets.regImage} 
        alt="leftSideImage" 
      />
    </div>

    {/* Right Side: Form */}
    <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 md:p-12 bg-slate-50 ">
      <form className="flex flex-col w-full gap-2" onSubmit={signupSubmitHandler}>
        
        {/* Header */}
        <div className="text-center mb-1">
          <h2 className="text-3xl text-slate-800 font-bold tracking-tight">Sign Up</h2>
          <p className="text-sm text-slate-500 mt-1">Please enter your details to create An Account!</p>
        </div>

        {/* Google Button */}
        <button type="button" className="w-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center h-11 rounded-xl transition-all gap-3 text-blue-600 font-extralight" onClick={singInWithGoogle}>
          <img className="h-6" src={assets.googleImg} alt="google" />
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs text-slate-400 uppercase font-semibold">or</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Inputs Group */}
        <div className="space-y-4">
          <div className="relative flex items-center">
             <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  <circle cx="12" cy="7" r="4"></circle>
</svg>
             </span>
             <input type="text" placeholder="First Name" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl h-12 pl-12 pr-4 text-sm transition-all" name="name" onChange={ChangeSignHandler} value={singupData.name} required/>
          </div>
          <div className="relative flex items-center">
             <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
             </span>
             <input type="email" placeholder="Email address" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl h-12 pl-12 pr-4 text-sm transition-all"  name="email" onChange={ChangeSignHandler} value={singupData.email} required />
          </div>

          <div className="relative flex items-center">
             <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             </span>
             <input type="password" placeholder="Password" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl h-12 pl-12 pr-4 text-sm transition-all"  name="password" onChange={ChangeSignHandler} value={singupData.password} required />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" type="checkbox" id="checkbox" />
            <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
          </label>
         
        </div>

        {/* Submit */}
       {signupLoading? <h2 className="w-full h-12 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center">
        Creating user...
       </h2>:
        <button type="submit" className="w-full h-12 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
          Register now
        </button>
       }

        <p className="text-center text-slate-500 text-sm mt-2">
          Don’t have an account? <button type="button" className="text-indigo-600 font-bold hover:underline" onClick={()=>setCurrentPage('login')}>
            Login
          </button>
        </p>
      </form>
    </div>
    </>
    }
      {/*login*/}
    {currentPage=='login' && (
      <>
    <div className="hidden md:block md:w-1/2 hidden">
      <img 
        className="w-full object-cover h-full" 
        src={assets.roomImg1} 
        alt="leftSideImage" 
      />
    </div>

    {/* Right Side: Form */}
    <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 md:p-12 bg-slate-50 ">
      <form className="flex flex-col w-full gap-2" onSubmit={loginSubmitHandler}>
        
        {/* Header */}
        <div className="text-center mb-1">
          <h2 className="text-3xl text-slate-800 font-bold tracking-tight">Login</h2>
          <p className="text-sm text-slate-500 mt-1">Please enter your details to login Account!</p>
        </div>

        {/* Google Button */}
        <button type="button" className="w-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center h-11 rounded-xl transition-all gap-3 font-medium  text-blue-600 font-extralight" onClick={singInWithGoogle}>
           <img className="h-6 text-blue" src={assets.googleImg} alt="google" />
          Login with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs text-slate-400 uppercase font-semibold">or</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Inputs Group */}
        <div className="space-y-4">
         
          <div className="relative flex items-center">
             <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
             </span>
             <input type="email" placeholder="Email address" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl h-12 pl-12 pr-4 text-sm transition-all"  name="email" onChange={changeLoginHandler} value={loginData.email} required />
          </div>

          <div className="relative flex items-center">
             <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             </span>
             <input type="password" placeholder="Password" className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl h-12 pl-12 pr-4 text-sm transition-all"  name="password" onChange={changeLoginHandler} value={loginData.password} required />
          </div>
          {loginError && <h2>{loginError}</h2>}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" type="checkbox" id="checkbox" />
            <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
          </label>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors" onClick={()=>setCurrentPage('resetPassword')} type='button'>Forgot password?</button>
        </div>

        {/* Submit */}
        
       {loginLoading? <h2 className="w-full h-12 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center">
        Login user...
       </h2>:
        <button type="submit" className="w-full h-12 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
          Login now
        </button>
       }

        <p className="text-center text-slate-500 text-sm mt-2">
          Don’t have an account? <button  className="text-indigo-600 font-bold hover:underline" onClick={()=>setCurrentPage('signup')} type='button'>Sign up</button>
        </p>
      </form>
    </div>
    </>
    )}
      {/*reset*/}
     {currentPage=='resetPassword' && (
      <>
    <div className="hidden md:block md:w-1/2 hidden">
      <img 
        className="w-full object-cover h-full" 
        src={assets.regImage} 
        alt="leftSideImage" 
      />
    </div>

    {/* Right Side: Form */}
    <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 md:p-12 bg-slate-50 ">
      <form className="flex flex-col w-full gap-2" onSubmit={resetHandler}>
        
        {/* Header */}
        <div className="text-center mb-1">
          <h2 className="text-3xl text-slate-800 font-bold tracking-tight">Reset Your Password!</h2>
          <p className="text-sm text-slate-500 mt-1">Please enter your email to get a reset Email!</p>
        </div>

      

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs text-slate-400 uppercase font-semibold">or</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Inputs Group */}
        <div className="space-y-4">
          <div className="relative flex items-center">
             <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
             </span>
             <input type="email" placeholder="Email address" value={resetEmail} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl h-12 pl-12 pr-4 text-sm transition-all"  name="email" onChange={(e)=>setResetEmail(e.target.value)}  required />
          </div>
         
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            
           
          </label>
         
        </div>

        {/* Submit */}
       {resetLoading? <h2 className="w-full h-12 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center">
        Sending Email...
       </h2>:
        <button type="submit" className="w-full h-12 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]" onClick={resetHandler}>
          Reset Password
        </button>
       }

        <p className="text-center text-slate-500 text-sm mt-2">
          Already have Password? <button type="button" className="text-indigo-600 font-bold hover:underline" onClick={()=>setCurrentPage('login')}>
            Login
          </button>
        </p>
      </form>
    </div>
    </>
    )}
  </div>
</div>
</div>
        </div>
    );
}

export default SignupModal;