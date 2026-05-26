import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../Contexts/StoreContext';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/Firebase';
import { useAdminSettingsQuery, useSetAdminSettingsMutation } from '../../../Feature/ApiSlice';

const Settings = () => {
    const { data: adminSettings } = useAdminSettingsQuery();
    const [setAdmin] = useSetAdminSettingsMutation();
    const auth = getAuth();
    const user = auth.currentUser;
    const { currentUser } = useContext(StoreContext);
    
    const [editEmail, setEditEmail] = useState(false);
    const [steps, setSteps] = useState(1);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Admin settings local UI states
    const [isOrderNotify, setIsOrderNotify] = useState(true);
    const [isPaymentNotify, setIsPaymentNotify] = useState(true);
    const [isUserListing, setIsUserListing] = useState(true);
    const [theme, setTheme] = useState('White');

    useEffect(() => {
        if (adminSettings && adminSettings[0]) {
            setIsOrderNotify(adminSettings[0].isOrderNotify ?? true);
            setIsPaymentNotify(adminSettings[0].isPaymentNotify ?? true);
            setIsUserListing(adminSettings[0].isUserListing ?? true);
            if(adminSettings[0].theme) setTheme(adminSettings[0].theme);
        }
    }, [adminSettings]);

    const verifyPasswordHandler = async (e) => {
        e.preventDefault();
        if (!currentPassword) return toast.warning('Please enter your password first');
        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            setCurrentPassword('');
            setSteps(2);
            toast.success('Password verified successfully!');
        } catch (error) {
            setCurrentPassword('');
            toast.error('Incorrect password!');
        } finally {
            setLoading(false);
        }
    };

    const changeEmailHandler = async (e) => {
        e.preventDefault();
        if (!newEmail) return toast.warning('Please enter a new email address');
        setLoading(true);
        try {
            await updateEmail(user, newEmail);
            const docRef = doc(db, 'users', currentUser?.uid);
            await updateDoc(docRef, { email: newEmail });
            
            // Reset state states
            setEditEmail(false);
            setSteps(1);
            setNewEmail('');
            toast.success('Email address updated successfully!');
        } catch (error) {
            toast.error('Email address could not be updated');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = async (key, newValue, mutationHook) => {
        try {
            await mutationHook({
                id: 'weghtvSP6KMe5r4e5Pxj',
                payload: { [key]: newValue }
            }).unwrap();
            toast.success('Setting updated successfully');
        } catch (error) {
            console.error(`Failed to update ${key}:`, error);
            toast.error('Failed to sync setting changes');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
            {/* Header Header */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight uppercase">Admin Settings Panel</h2>
                <p className="text-sm text-gray-500 mt-1">Configure global application variables and security access parameters</p>
            </div>

            <div className="flex flex-col gap-6">
                
                {/* Section 1: Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🔔</span> Notification Management
                    </h3>
                    <div className="divide-y divide-gray-100">
                        {/* Order Email Switch */}
                        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="font-medium text-gray-700">Order Success Emails</p>
                                <p className="text-xs text-gray-400">Send transactional verification receipts when an item is purchased.</p>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
                                <button 
                                    onClick={() => handleSettingChange('isOrderNotify', true, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${isOrderNotify ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    ON
                                </button>
                                <button 
                                    onClick={() => handleSettingChange('isOrderNotify', false, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${!isOrderNotify ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    OFF
                                </button>
                            </div>
                        </div>

                        {/* Payment Email Switch */}
                        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="font-medium text-gray-700">Payment Success Emails</p>
                                <p className="text-xs text-gray-400">Trigger invoice and payment confirmation metrics downstream.</p>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
                                <button 
                                    onClick={() => handleSettingChange('isPaymentNotify', true, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${isPaymentNotify ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    ON
                                </button>
                                <button 
                                    onClick={() => handleSettingChange('isPaymentNotify', false, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${!isPaymentNotify ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                    OFF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Account Security */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🔒</span> Identity Management
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        {!editEmail ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Current Root Administrator Email</p>
                                    <p className="text-base font-semibold text-gray-700">{currentUser?.email || 'No email defined'}</p>
                                </div>
                                <button 
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium rounded-md transition-colors" 
                                    onClick={() => { setEditEmail(true); setSteps(1); }}>
                                    Modify Root Email
                                </button>
                            </div>
                        ) : (
                            <div>
                                {steps === 1 ? (
                                    <form onSubmit={verifyPasswordHandler} className="space-y-3">
                                        <p className="text-sm text-red-600 font-medium">⚠️ Re-authentication Required</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input 
                                                type="password" 
                                                placeholder="Confirm system password"
                                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                                autoComplete="current-password" 
                                                value={currentPassword} 
                                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="flex gap-2">
                                                <button disabled={loading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-medium rounded-md transition-colors">
                                                    {loading ? 'Verifying...' : 'Verify'}
                                                </button>
                                                <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 text-xs font-medium rounded-md transition-colors" onClick={() => setEditEmail(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={changeEmailHandler} className="space-y-3">
                                        <p className="text-sm text-blue-600 font-medium">🔑 Provide New Security Email String</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input 
                                                type="email" 
                                                placeholder="example@admin.com"
                                                value={newEmail} 
                                                onChange={(e) => setNewEmail(e.target.value)} 
                                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="flex gap-2">
                                                <button disabled={loading} type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-medium rounded-md transition-colors">
                                                    {loading ? 'Updating...' : 'Save New Email'}
                                                </button>
                                                <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 text-xs font-medium rounded-md transition-colors" onClick={() => { setEditEmail(false); setSteps(1); }}>Cancel</button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: User Permissions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🏢</span> UserListing Eligibility
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium text-gray-700">Allow Global Room Listings</p>
                            <p className="text-xs text-gray-400">Controls whether standard external users can submit rooms to the live directory.</p>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
                            <button 
                                onClick={() => handleSettingChange('isUserListing', true, setAdmin)}
                                className={`px-5 py-1.5 text-xs font-medium rounded-md transition-all ${isUserListing ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                Yes
                            </button>
                            <button 
                                onClick={() => handleSettingChange('isUserListing', false, setAdmin)}
                                className={`px-5 py-1.5 text-xs font-medium rounded-md transition-all ${!isUserListing ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                No
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 4: Aesthetics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🎨</span> Theme Management
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium text-gray-700">Display Palette Mode</p>
                            <p className="text-xs text-gray-400">Swap global layout variables across system views (Local Preview).</p>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
                            <button 
                                onClick={() => setTheme('White')}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${theme === 'White' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                Light Mode
                            </button>
                            <button 
                                onClick={() => setTheme('Black')}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${theme === 'Black' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                Dark Mode
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;