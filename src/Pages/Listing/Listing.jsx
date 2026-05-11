import React, { useContext, useState } from 'react';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { toast } from 'react-toastify';
import { addDoc, collection, doc } from 'firebase/firestore';
import { StoreContext } from '../../Contexts/StoreContext';
import { db } from '../../Firebase/Firebase';

const Listing = () => {
    const {currentUser}=useContext(StoreContext)
    const [listingData, setListingData] = useState({
        name: "",
        price: "",
        roomType: "",
        capacity: "",
        location: "",
        image: [],
        services: []
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [selectedService, setSelectedService] = useState("");

    // সাধারণ ইনপুট হ্যান্ডলার
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setListingData((prev) => ({
            ...prev,
            [name]: name === 'capacity' || name === 'price' ? Number(value) : value
        }));
    };

    // ইমেজ আপলোড হ্যান্ডলার (একসাথে একাধিক ফাইল হ্যান্ডেল করার জন্য)
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;

        setSubmitting(true);
        try {
            const uploadPromises = files.map(file => uploadToCloudinary(file));
            const results = await Promise.all(uploadPromises);
            const urls = results.map(res => res.url);

            setListingData(prev => ({
                ...prev,
                image: [...prev.image, ...urls].slice(0, 4) // সর্বোচ্চ ৪টি ছবি
            }));
            toast.success("Images uploaded successfully!");
        } catch (error) {
            toast.error("Image upload failed");
        } finally {
            setSubmitting(false);
        }
    };

    // সার্ভিস অ্যারেতে যোগ করার ফাংশন
    const addService = (e) => {
        e.preventDefault();
        if (selectedService && !listingData.services.includes(selectedService)) {
            setListingData(prev => ({
                ...prev,
                services: [...prev.services, selectedService]
            }));
            setSelectedService("");
        }
    };
 const submitHandler=async(e)=>{
    e.preventDefault();
    try {
        const docRef=collection(db,'rooms')
        await addDoc(docRef,{
            ...listingData,
            owner:currentUser.email,
        })
        toast.success("room added!")
    } catch (error) {
        console.log("error is",error.message);
    }
 }
    return (
        <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <h2 className='font-playfair text-4xl md:text-[40px]'>Listing Your Hotels Room!</h2>
            <p className='text-sm md:text-base text-gray-500/90 mt-2'>Add your room details correctly.</p>

            <div className='py-10'>
                <form onSubmit={(e) => e.preventDefault(),submitHandler}>
                    {/* Name & Price */}
                    <div className='flex flex-col gap-4 mb-4'>
                        <label>Room Name</label>
                        <input type="text" name="name" className='border p-2' value={listingData.name} onChange={changeHandler} />
                        
                        <label>Price</label>
                        <input type="number" name="price" className='border p-2' value={listingData.price} onChange={changeHandler} />
                        <label>location</label>
                        <input type="text" name="location" className='border p-2' value={listingData.location} onChange={changeHandler} />
                    </div>

                    {/* Room Type & Capacity */}
                    <div className='mb-4'>
                        <label>Room Type</label>
                        <select name="roomType" className='border p-2 block' value={listingData.roomType} onChange={changeHandler}>
                            <option value="">--Select type--</option>
                            <option value="Single Bed">Single Bed</option>
                            <option value="Double Bed">Double Bed</option>
                        </select>
                    </div>

                    <div className='mb-4'>
                        <label>Capacity</label>
                        <input type="number" name="capacity" min={1} className='border p-2' value={listingData.capacity} onChange={changeHandler} />
                    </div>

                    {/* Image Section */}
                    <div className='mb-4'>
                        <h2>Upload Images (Select up to 4)</h2>
                        <input type="file" multiple accept='image/*' onChange={handleImageUpload} disabled={submitting} />
                        {submitting && <p className='text-blue-500'>Uploading...</p>}
                        <div className='flex gap-2 mt-2'>
                            {listingData.image.map((img, index) => (
                                <img key={index} src={img} alt="preview" className='w-20 h-20 object-cover border' />
                            ))}
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className='mb-4'>
                        <label>Services (At least 3)</label>
                        <div className='flex gap-2'>
                            <select className='border p-2' value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                                <option value="">--Select Service--</option>
                                <option value="Free WiFi">Free WiFi</option>
                                <option value="Free Breakfast">Free Breakfast</option>
                                <option value="Room Service">Room Service</option>
                            </select>
                            <button onClick={addService} className='bg-black text-white px-4 py-1 rounded'>Add</button>
                        </div>
                        <div className='mt-2 flex gap-2'>
                            {listingData.services.map((s, i) => (
                                <span key={i} className='bg-gray-200 px-2 py-1 text-sm rounded'>{s}</span>
                            ))}
                        </div>
                    </div>

                    <button className='bg-blue-600 p-2 text-white rounded-sm w-full mt-5' disabled={submitting} type='submit'>
                        {submitting ? "Uploading..." : "List Room"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Listing;