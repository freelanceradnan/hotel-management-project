import { deleteUser, EmailAuthProvider, getAuth, reauthenticateWithCredential, sendPasswordResetEmail, updateEmail } from "firebase/auth";
import { ChevronDown, ChevronRight, Mail, Lock, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetUserDataQuery } from "../../../Feature/ApiSlice";
import { auth, db } from "../../../Firebase/Firebase";
import { toast } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router";

const Security = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [emailModal, setEmailModal] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const {data:userData}=useGetUserDataQuery()
  const [passModal, setPassModal] = useState(false);
  const [editPass,setEditPassword]=useState(false)
  const [recoveryEmail,setRecoveryEmail]=useState("")
  const [recoverloading,setRecoveryLoading]=useState(false)
  const navigate=useNavigate()
  useEffect(()=>{
  if(userData && user){
    console.log(user.email)
    const findUser=userData.find(c=>c.email==user.email)
    
  }
  },[userData,user])
  // Re-authenticate states
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
 console.log(recoveryEmail)
  
  // Step 1: Verify Password
  const handlerPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      setStep(2);
      toast.success('Password Verification Success!');
    } catch (error) {
      console.error(error);
       setCurrentPassword('')
      toast.success('Wrong!Password Try Again');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Update Email
  const handlerEmailUpdate = async (e) => {
    e.preventDefault();
    if (!newEmail) return   toast.error('write new email!');;
    setLoading(true);

    try {
      await updateEmail(user, newEmail);
        toast.success('Email updated Success!');
      
      // Reset all states
      setEditEmail(false);
      setEmailModal(false);
      setStep(1);
      setNewEmail('');
      setCurrentPassword('');
    } catch (error) {
      console.error(error);
     
      if (error.code === 'auth/requires-recent-login') {
          toast.success('Please sign in again!');
        setStep(1);
      } else {
          toast.success('Email update not possible');
      }
    } finally {
      setLoading(false);
    }
  };
  //recovery email send
 const handlerEmailSend=async(e)=>{
  e.preventDefault()
  setRecoveryLoading(true)
  try {
    await sendPasswordResetEmail(auth,recoveryEmail)
      toast.success('A reset mail Sended!Checkout your Spam Folder!');
      setEditEmail(false)
    setRecoveryEmail('')
    setEditPassword(false)
  } catch (error) {
    
      toast.success('Failed To Send Reset Mail');
  }
  setRecoveryLoading(false)
 }
//delete account
const deleteHandler=async(e)=>{
  e.preventDefault()
  const popup=window.confirm('Are you sure to Delete your Account?After click yes All data will be deleted!')
  if(popup && user){
    try {
    const docRef=doc(db,'users',user.uid)
    await deleteDoc(docRef)
    await deleteUser(user)
    navigate('/')
     toast.success('User Deleted SuccessFully!');
  } catch (error) {
    toast.error('Failed to deleted user!');
  }
  }
}
  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" /> Security and settings
        </h2>
        <p className="text-gray-500 mt-2">
          Keep your account safe with a secure password and by managing your credentials.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Email Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div
            onClick={() => setEmailModal(!emailModal)}
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-400" />
              <div>
                <h2 className="font-semibold text-gray-700">Email Address</h2>
                {!emailModal && <p className="text-sm text-gray-500">{user?.email}</p>}
              </div>
            </div>
            {emailModal ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {emailModal && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
                <div className="flex-1">
                  {!editEmail ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold">Current Email</span>
                      <h2 className="text-gray-800 font-medium">{user?.email}</h2>
                    </div>
                  ) : (
                    <div className="w-full animate-in fade-in duration-300">
                      {step === 1 ? (
                        <form onSubmit={handlerPassword} className="space-y-3">
                          <label className="text-sm font-bold text-gray-600">Verify Identity</label>
                          <div className="flex gap-2">
                            <input
                              type="password"
                              required
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Enter your current password"
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              value={currentPassword}
                            />
                            <button 
                              disabled={loading}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 disabled:bg-blue-300" 
                              type="submit"
                            >
                              {loading ? 'Verifying...' : 'Next'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handlerEmailUpdate} className="space-y-3 animate-in slide-in-from-right duration-300">
                          <label className="text-sm font-bold text-green-600">Enter New Email</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="email"
                              required
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                              placeholder="new-email@gmail.com"
                              onChange={(e) => setNewEmail(e.target.value)}
                              value={newEmail}
                            />
                            <button 
                              disabled={loading}
                              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 disabled:bg-green-300" 
                              type="submit"
                            >
                              {loading ? 'Updating...' : 'Update'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditEmail(!editEmail);
                      setStep(1);
                      setCurrentPassword('')
                      setMessage('');
                    }}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold border transition-all ${
                      editEmail 
                      ? 'border-gray-300 text-gray-600 hover:bg-gray-100' 
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {editEmail ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
{/* password  */}
 <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div
            onClick={() => setPassModal(!passModal)}
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-400" />
              <div>
                <h2 className="font-semibold text-gray-700">Change Password</h2>
                
                {!passModal && <p className="text-sm text-gray-500">{user?.email}</p>}
              </div>
            </div>
            {passModal ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {passModal && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  {!editPass ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold">Current Password</span>
                      <h2 className="text-gray-800 font-medium">********</h2>
                    </div>
                  ) : (
                    <div className="w-full animate-in fade-in duration-300">
                      {step === 1 ? (
                        <form onSubmit={handlerPassword} className="space-y-3">
                          <label className="text-sm font-bold text-gray-600">Verify Identity</label>
                          <div className="flex gap-2">
                            <input
                              type="password"
                              required
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Enter your current password"
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              value={currentPassword}
                            />
                            <button 
                              disabled={loading}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 disabled:bg-blue-300" 
                              type="submit"
                            >
                              {loading ? 'Verifying...' : 'Next'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handlerEmailSend} className="space-y-3 animate-in slide-in-from-right duration-300">
                          <label className="text-sm font-bold text-green-600">Enter your user Email to Receive Recovery Email:</label>
                          <div className="flex gap-2">
                          
                            <input
                              type="email"
                              required
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                              placeholder="Enter"
                              onChange={(e) => setRecoveryEmail(e.target.value)}
                              value={recoveryEmail}
                            />
                            <button 
                              disabled={loading}
                              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 disabled:bg-green-300" 
                              type="submit"
                            >
                              {recoverloading ? 'Updating...' : 'Send Recovery Email'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                     setEditPassword(!editPass);
                      setStep(1);
                      setCurrentPassword('')
                      
                    }}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold border transition-all ${
                      editPass 
                      ? 'border-gray-300 text-gray-600 hover:bg-gray-100' 
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {editPass ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Delete Account Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors" onClick={deleteHandler}>
            Delete Account
          </button>
          <p className="text-xs text-gray-400 mt-2 italic">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Security;