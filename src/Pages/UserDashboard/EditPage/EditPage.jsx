import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useGetAllRoomsQuery, useUpdateOrderMutation, useUpdateRoomMutation } from '../../../Feature/ApiSlice';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { toast } from 'react-toastify';



const EditPage = () => {
    const { id } = useParams();
    const { data: allRooms } = useGetAllRoomsQuery();
    
    const [selectedService, setSelectedService] = useState("");
    const [update]=useUpdateRoomMutation()
    const [editableData, setEditableData] = useState({
        name: "",
        capacity: "",
        services: [], 
        image: [],
        location: "",
        price: "",
        roomType: "Single Bed"
    });
//    console.log(editableData)
    useEffect(() => {
        if (id && allRooms) {
            const currentRoom = allRooms.find(room => room.id == id);
            if (currentRoom) {
                setEditableData({
                    name: currentRoom.name || "",
                    capacity: currentRoom.capacity || "",
                    services: currentRoom.services || [],
                    image: currentRoom.image || [],
                    location: currentRoom.location || "",
                    price: currentRoom.price || "",
                    roomType: currentRoom.roomType || "Single Bed"
                });
            }
        }
    }, [id, allRooms]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const addServices = (e) => {
        e.preventDefault(); 
        if (!selectedService || selectedService.trim() === "") return;
        
    
        if (editableData.services.includes(selectedService)) {
            toast.error("Service already added!");
            return;
        }

        setEditableData((prev) => ({
            ...prev,
            services: [...prev.services, selectedService] 
        }));
        setSelectedService("");
    };

    
    const deleteService = (indexToDelete) => {
        setEditableData(prev => ({
            ...prev,
            services: prev.services.filter((_, index) => index !== indexToDelete)
        }));
    };

  
    const changeImage = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        try {
            const uploadPromises = files.map(file => uploadToCloudinary(file));
            const results = await Promise.all(uploadPromises);
            const urls = results.map(res => res.url);
            
            setEditableData(prev => ({
                ...prev,
                image: [...prev.image, ...urls].slice(0, 4) 
            }));
            toast.success("Images uploaded successfully!");
        } catch (error) {
            toast.error("Image upload failed!");
        }
    };

   
    const deleteImage = (indexToDelete) => {
        setEditableData(prev => ({
            ...prev,
            image: prev.image.filter((_, index) => index !== indexToDelete)
        }));
    };

   
    const submitHandler = async(e) => {
        e.preventDefault();
        try {
           await update({roomdata:editableData,id:id}).unwrap
        } catch (error) {
            
        }
    };

    return (
        <div className='py-20 md:py-26 px-4 md:px-16 lg:px-24 bg-[#FAFBFF] min-h-screen font-sans'>
            <h1>This is room edit page</h1>
            <h2>Edit Room of {id}</h2>
            
            <form onSubmit={submitHandler} className="space-y-4 max-w-lg">
                {/* Name Input */}
                <div>
                    <label className='block font-medium'>Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        className='border p-2 w-full rounded'  
                        value={editableData.name} 
                        onChange={handleInputChange}
                    />
                </div>

                {/* Capacity Input */}
                <div>
                    <label className='block font-medium'>Capacity</label>
                    <input 
                        type="number" 
                        name="capacity" 
                        className='border p-2 w-full rounded' 
                        value={editableData.capacity} 
                        onChange={handleInputChange}
                    />
                </div>

                {/* Location Input */}
                <div>
                    <label className='block font-medium'>Location</label>
                    <input 
                        type="text" 
                        name="location"
                        className='border p-2 w-full rounded'  
                        value={editableData.location} 
                        onChange={handleInputChange}
                    />
                </div>

                {/* Price Input */}
                <div>
                    <label className='block font-medium'>Price</label>
                    <input 
                        type="number" 
                        name="price"
                        className='border p-2 w-full rounded'  
                        value={editableData.price} 
                        onChange={handleInputChange}
                    />
                </div>

                {/* Room Type Select */}
                <div>
                    <label className='block font-medium'>Room Type</label>
                    <select 
                        name="roomType" 
                        className='border p-2 w-full rounded'
                        value={editableData.roomType} 
                        onChange={handleInputChange}
                    >
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                    </select>
                </div>

                {/* Image Upload & Preview */}
                <div>
                    <label className='block font-medium'>Upload your image (Max 4)</label>
                    <input type="file" multiple onChange={changeImage} className="my-2"/>
                    
                    <div className='flex flex-wrap gap-4 mt-2'> 
                        {editableData.image?.map((imgUrl, index) => (
                            <div key={index} className="relative w-32 h-32 group"> 
                                <img 
                                    src={imgUrl} 
                                    className="w-full h-full object-cover rounded shadow" 
                                    alt="preview" 
                                />
                                <button 
                                    type="button" // type="button" দেওয়া জরুরি যাতে ফর্ম সাবমিট না হয়
                                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs hover:bg-red-600 transition-all shadow"
                                    onClick={() => deleteImage(index)} 
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services Dropdown & Add Button */}
                <div>
                    <label className='block font-medium'>Services</label>
                    <div className='flex gap-2 mt-1'>
                        <select 
                            className='border p-2 rounded'
                            value={selectedService} 
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            <option value="">Select a service</option>
                            <option value="Free WiFi">Free WiFi</option>
                            <option value="Free Breakfast">Free Breakfast</option>
                            <option value="Room Service">Room Service</option>
                            <option value="Swimming Pool">Swimming Pool</option>
                            <option value="Air Conditioning">Air Conditioning</option>
                        </select>
                        <button 
                            type="button" 
                            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600' 
                            onClick={addServices}
                        >
                            Add Service
                        </button>
                    </div>

                    {/* Added Services Badges */}
                    <div className='flex flex-wrap gap-2 mt-3'>
                        {editableData.services?.map((serviceName, index) => (
                            <div className='flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm' key={index}>
                                <span>{serviceName}</span>
                                <button 
                                    type="button" 
                                    className="text-red-500 font-bold hover:text-red-700"
                                    onClick={() => deleteService(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className='pt-4'>
                    <button className='bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors' type='submit'>
                        Update Room
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPage;