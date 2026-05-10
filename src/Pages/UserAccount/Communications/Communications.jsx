import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../../assets/assets';
import { ChevronDown, ChevronRight, Mail } from 'lucide-react';
import { auth, db } from '../../../Firebase/Firebase';
import { StoreContext } from './../../../Contexts/StoreContext';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Communications = () => {
  const [quickModal, setQuickModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const { currentUser } = useContext(StoreContext);
  
  // Single source of truth for the user's current DB state
  const [userData, setUserData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);


  useEffect(() => {
    if (!currentUser?.uid) return;

    
    const userDocRef = doc(db, 'users', currentUser.uid); 
    
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData({ id: doc.id, ...doc.data() });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleUpdatePreference = async (newValue) => {
    if (!userData?.id) return;
    
    
    if (userData.isOrderNotify === newValue) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'users', userData.id);
      await updateDoc(docRef, {
        isOrderNotify: newValue
      });
      toast.success("Preferences updated!");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to sync with server");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!userData) return <div className="p-10 text-center text-gray-400">Syncing with server...</div>;

  // Derive checked state from DB data
  const isNotifyEnabled = userData.isOrderNotify ?? true;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Communications</h2>
        <p className="text-gray-500 mt-2">Manage your preferences and stay updated.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className={`group border rounded-xl overflow-hidden transition-all ${quickModal ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer" 
            onClick={() => setQuickModal(!quickModal)}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50">
                <img src={assets.logo} alt="" className='h-6 w-6 invert opacity-70'/>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Booking Updates</h3>
                <p className="text-xs text-gray-500">Currently: {isNotifyEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            {quickModal ? <ChevronDown className="text-blue-500" /> : <ChevronRight className="text-gray-400" />}
          </div>

          {quickModal && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
              <div className={`space-y-3 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                  <input 
                    type="radio" 
                    className="w-4 h-4 text-blue-600" 
                    checked={isNotifyEnabled === true} 
                    onChange={() => handleUpdatePreference(true)}
                  />
                  <span className="text-sm text-gray-700">Confirmation and critical updates</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                  <input 
                    type="radio" 
                    className="w-4 h-4 text-blue-600" 
                    checked={isNotifyEnabled === false} 
                    onChange={() => handleUpdatePreference(false)}
                  />
                  <span className="text-sm text-gray-700">No updates (Not recommended)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communications;