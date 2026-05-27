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
    const [theme, setTheme] = useState('white');
    //set themes on context
    const {isTheme,setIsTheme}=useContext(StoreContext)
    useEffect(() => {
        if (adminSettings && adminSettings[0]) {
            setIsOrderNotify(adminSettings[0].isOrderNotify ?? true);
            setIsPaymentNotify(adminSettings[0].isPaymentNotify ?? true);
            setIsUserListing(adminSettings[0].isUserListing ?? true);
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

    // dark mode code
    const themeChanger = () => {
        const newTheme = theme === 'white' ? 'dark' : 'white';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
        setIsTheme(newTheme)
    };

    
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'white';
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen text-gray-900 dark:text-zinc-100 transition-colors duration-300">
            {/* Header */}
            <div className="mb-8 border-b border-gray-200 dark:border-zinc-700/60 pb-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight uppercase">Admin Settings Panel</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Configure global application variables and security access parameters</p>
            </div>

            <div className="flex flex-col gap-6">
                
                {/* Section 1: Notifications */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6 transition-colors">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <span>🔔</span> Notification Management
                    </h3>
                    <div className="divide-y divide-gray-100 dark:divide-zinc-700/60">
                        {/* Order Email Switch */}
                        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="font-medium text-gray-700 dark:text-zinc-300">Order Success Emails</p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500">Send transactional verification receipts when an item is purchased.</p>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-lg self-start sm:self-auto">
                                <button 
                                    onClick={() => handleSettingChange('isOrderNotify', true, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${isOrderNotify ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}>
                                    ON
                                </button>
                                <button 
                                    onClick={() => handleSettingChange('isOrderNotify', false, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${!isOrderNotify ? 'bg-white dark:bg-zinc-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}>
                                    OFF
                                </button>
                            </div>
                        </div>

                        {/* Payment Email Switch */}
                        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="font-medium text-gray-700 dark:text-zinc-300">Payment Success Emails</p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500">Trigger invoice and payment confirmation metrics downstream.</p>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-lg self-start sm:self-auto">
                                <button 
                                    onClick={() => handleSettingChange('isPaymentNotify', true, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${isPaymentNotify ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}>
                                    ON
                                </button>
                                <button 
                                    onClick={() => handleSettingChange('isPaymentNotify', false, setAdmin)}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${!isPaymentNotify ? 'bg-white dark:bg-zinc-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}>
                                    OFF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Account Security */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6 transition-colors">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <span>🔒</span> Identity Management
                    </h3>
                    <div className="bg-gray-50 dark:bg-zinc-900/40 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
                        {!editEmail ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-wider">Current Root Administrator Email</p>
                                    <p className="text-base font-semibold text-gray-700 dark:text-zinc-300">{currentUser?.email || 'No email defined'}</p>
                                </div>
                                <button 
                                    className="px-4 py-2 bg-gray-800 dark:bg-zinc-700 hover:bg-gray-900 dark:hover:bg-zinc-600 text-white text-xs font-medium rounded-md transition-colors" 
                                    onClick={() => { setEditEmail(true); setSteps(1); }}>
                                    Modify Root Email
                                </button>
                            </div>
                        ) : (
                            <div>
                                {steps === 1 ? (
                                    <form onSubmit={verifyPasswordHandler} className="space-y-3">
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">⚠️ Re-authentication Required</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input 
                                                type="password" 
                                                placeholder="Confirm system password"
                                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                                autoComplete="current-password" 
                                                value={currentPassword} 
                                                className="border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-1.5 text-sm flex-grow bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500"
                                            />
                                            <div className="flex gap-2">
                                                <button disabled={loading} type="submit" className="bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 text-white px-4 py-1.5 text-xs font-medium rounded-md transition-colors">
                                                    {loading ? 'Verifying...' : 'Verify'}
                                                </button>
                                                <button type="button" className="bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-zinc-300 px-3 py-1.5 text-xs font-medium rounded-md transition-colors" onClick={() => setEditEmail(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={changeEmailHandler} className="space-y-3">
                                        <p className="text-sm text-blue-600 dark:text-indigo-400 font-medium">🔑 Provide New Security Email String</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input 
                                                type="email" 
                                                placeholder="example@admin.com"
                                                value={newEmail} 
                                                onChange={(e) => setNewEmail(e.target.value)} 
                                                className="border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-1.5 text-sm flex-grow bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500"
                                            />
                                            <div className="flex gap-2">
                                                <button disabled={loading} type="submit" className="bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-800 text-white px-4 py-1.5 text-xs font-medium rounded-md transition-colors">
                                                    {loading ? 'Updating...' : 'Save New Email'}
                                                </button>
                                                <button type="button" className="bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-zinc-300 px-3 py-1.5 text-xs font-medium rounded-md transition-colors" onClick={() => { setEditEmail(false); setSteps(1); }}>Cancel</button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: User Permissions */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6 transition-colors">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <span>🏢</span> UserListing Eligibility
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-zinc-300">Allow Global Room Listings</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">Controls whether standard external users can submit rooms to the live directory.</p>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-lg self-start sm:self-auto">
                            <button 
                                onClick={() => handleSettingChange('isUserListing', true, setAdmin)}
                                className={`px-5 py-1.5 text-xs font-medium rounded-md transition-all ${isUserListing ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}>
                                Yes
                            </button>
                            <button 
                                onClick={() => handleSettingChange('isUserListing', false, setAdmin)}
                                className={`px-5 py-1.5 text-xs font-medium rounded-md transition-all ${!isUserListing ? 'bg-white dark:bg-zinc-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}>
                                No
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 4: Aesthetics */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6 transition-colors">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <span>🎨</span> Theme Management
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-zinc-300">Display Palette Mode</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">Swap global layout variables across system views (Local Preview).</p>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-lg self-start sm:self-auto">
                            <button 
                                onClick={themeChanger}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${theme === 'white' ? 'bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}>
                                Light Mode
                            </button>
                            <button 
                                onClick={themeChanger}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-zinc-200'}`}>
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