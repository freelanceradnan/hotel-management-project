import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { auth, db } from './../../Firebase/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { allArea } from '../../ApiData/AllArea';
import { toast } from 'react-toastify';


const MyProfile = () => {
    const [editProfile, setEditProfile] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [selectedDist, setSelectDist] = useState("");

    const [editProfileData, setEditProfileData] = useState({
        name: "",
        mobile: "",
        date: "",
        gender: []
    });

    const [addressData, setAddressData] = useState({
        address1: "",
        address2: "",
        city: "",
        state: "",
        post: ""
    });

    // Fetching current data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setEditProfileData(data);
                        setOriginalData(data);
                        // Address data sync
                        setAddressData({
                            address1: data.address1 || "",
                            address2: data.address2 || "",
                            city: data.city || "",
                            state: data.state || "",
                            post: data.post || ""
                        });
                        setSelectDist(data.state || "");
                    }
                } catch (error) {
                    toast.error('Failed to fetch data!');
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const changeProfileHandler = (e) => {
        const { name, value } = e.target;
        setEditProfileData((prev) => ({
            ...prev,
            [name]: name === 'mobile' ? value : (name === 'gender' ? [value] : value)
        }));
    };

    const submitProfileHandler = async (e) => {
        e.preventDefault();
       
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(docRef, { ...editProfileData });
            setEditProfile(false);
            setOriginalData(editProfileData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Update failed!');
        }
    };

    const ChangeAddressHandler = (e) => {
        const { name, value } = e.target;
        setAddressData((prev) => ({
            ...prev,
            [name]: name === 'post' ? Number(value) : value
        }));
    };

    const handleDistrictChange = (e) => {
        const distName = e.target.value;
        setSelectDist(distName);
        setAddressData(prev => ({ ...prev, state: distName, city: "" }));
    };

    const addressSubmitHandler = async (e) => {
        e.preventDefault();
        
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(docRef, { ...addressData });
            setEditAddress(false);
            toast.success('Address saved successfully!');
        } catch (error) {
            toast.error('Failed to save address!');
        }
    };

    const district = Object.keys(allArea);

    return (
        <div className='max-w-4xl mx-auto p-2 md:p-10 flex flex-col gap-1 bg-white'>
           
           
            <section className='border-b pb-8'>
                <div className='flex items-center justify-between mb-4'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>Basic information</h2>
                        <p className='text-sm text-gray-500 mt-1'>Ensure this matches your official travel documents.</p>
                    </div>
                    <button 
                        onClick={() => setEditProfile(!editProfile)}
                        className='text-blue-600 font-semibold hover:underline'
                    >
                        {editProfile ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <form onSubmit={submitProfileHandler} className='grid grid-cols-1 md:grid-cols-2 gap-1 mt-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Full Name</label>
                        {editProfile ? (
                            <input type="text" name="name" className='p-2 border rounded-md focus:ring-2 focus:ring-amber-500 outline-none' value={editProfileData.name} onChange={changeProfileHandler} required />
                        ) : (
                            <h2 className='text-lg text-gray-900'>{editProfileData?.name || "N/A"}</h2>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Email Address</label>
                        <h2 className='text-lg text-gray-500 bg-gray-50 p-2 rounded cursor-not-allowed'>{auth?.currentUser?.email} <span className='text-xs'>(Read only)</span></h2>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Mobile Number</label>
                        {editProfile ? (
                            <input type="text" name="mobile" className='p-2 border rounded-md outline-none' value={editProfileData.mobile} onChange={changeProfileHandler} />
                        ) : (
                            <h2 className='text-lg text-gray-900'>{editProfileData?.mobile || "Not provided"}</h2>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Date of Birth</label>
                        {editProfile ? (
                            <DatePicker 
                                selected={editProfileData?.date ? new Date(editProfileData.date.split('/').reverse().join('-')) : null} 
                                onChange={(date) => {
                                    if(date){
                                        const formattedDate = date.toLocaleDateString('en-GB');
                                        setEditProfileData(prev => ({ ...prev, date: formattedDate }));
                                    }
                                }}
                                dateFormat="dd/MM/yyyy"
                                className="w-full p-2 border rounded-md outline-none"
                                showMonthDropdown showYearDropdown dropdownMode="select"
                            />
                        ) : (
                            <h2 className='text-lg text-gray-900'>{editProfileData?.date || "No Birthday Found!"}</h2>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Gender</label>
                        {editProfile ? (
                            <select name="gender" className='p-2 border rounded-md outline-none' value={editProfileData?.gender?.[0] || ""} onChange={changeProfileHandler}>
                                <option value="">Select Gender</option> 
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        ) : (
                            <h2 className='text-lg capitalize text-gray-900'>{editProfileData?.gender?.[0] || "Not Specified"}</h2>
                        )}
                    </div>

                    {editProfile && (
                        <div className='md:col-span-2 flex gap-3 mt-4'>
                            <button type='submit' className='bg-black text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-all font-medium'>Save Changes</button>
                        </div>
                    )}
                </form>
            </section>

            {/* Address Section */}
            <section>
                <div className='flex items-center justify-between mb-4'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>Contact Details</h2>
                        <p className='text-sm text-gray-500 mt-1'>Update your address for account alerts and billing.</p>
                    </div>
                    <button 
                        onClick={() => setEditAddress(!editAddress)}
                        className='text-blue-600 font-semibold hover:underline'
                    >
                        {editAddress ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <form onSubmit={addressSubmitHandler} className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Address Line 1</label>
                        {editAddress ? (
                            <input type="text" name="address1" className='p-2 border rounded-md outline-none' onChange={ChangeAddressHandler} value={addressData.address1} />
                        ) : (
                            <h2 className='text-lg text-gray-900'>{addressData.address1 || "---"}</h2>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Address Line 2</label>
                        {editAddress ? (
                            <input type="text" name="address2" className='p-2 border rounded-md outline-none' onChange={ChangeAddressHandler} value={addressData.address2} />
                        ) : (
                            <h2 className='text-lg text-gray-900'>{addressData.address2 || "---"}</h2>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>District / State</label>
                        {editAddress ? (
                            <select value={selectedDist} onChange={handleDistrictChange} className='p-2 border rounded-md outline-none' required>
                                <option value="">--Select District--</option>
                                {district.map((dis) => (<option key={dis} value={dis}>{dis}</option>))}
                            </select>
                        ) : (
                            <h2 className='text-lg text-gray-900'>{addressData.state || "---"}</h2>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>City / Area</label>
                        {editAddress ? (
                            <select value={addressData.city} onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))} className='p-2 border rounded-md outline-none' required>
                                <option value="">--Select Area--</option>
                                {allArea[selectedDist]?.map((single) => (<option key={single} value={single}>{single}</option>))}
                            </select>
                        ) : (
                            <h2 className='text-lg text-gray-900'>{addressData.city || "---"}</h2>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-700'>Postal Code</label>
                        {editAddress ? (
                            <input type="number" name="post" className='p-2 border rounded-md outline-none' onChange={ChangeAddressHandler} value={addressData.post} />
                        ) : (
                            <h2 className='text-lg text-gray-900'>{addressData.post || "---"}</h2>
                        )}
                    </div>

                    {editAddress && (
                        <div className='md:col-span-2 flex gap-3 mt-4'>
                            <button type='submit' className='bg-black text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-all font-medium'>Save Address</button>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
};

export default MyProfile;