import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useGetAllRoomsQuery, useUpdateRoomMutation } from '../../../Feature/ApiSlice';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { toast } from 'react-toastify';

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: allRooms } = useGetAllRoomsQuery();
    
    const [selectedService, setSelectedService] = useState("");
    const [update, { isLoading: isUpdating }] = useUpdateRoomMutation();
    const [isUploading, setIsUploading] = useState(false);
    
    const [editableData, setEditableData] = useState({
        name: "",
        capacity: "",
        services: [], 
        image: [],
        location: "",
        price: "",
        roomType: "Single Bed"
    });

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
        
        setIsUploading(true);
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
        } finally {
            setIsUploading(false);
        }
    };

    const deleteImage = (indexToDelete) => {
        setEditableData(prev => ({
            ...prev,
            image: prev.image.filter((_, index) => index !== indexToDelete)
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Note: Added missing () to invoke .unwrap()
            await update({ roomdata: editableData, id: id }).unwrap();
            toast.success('Room updated successfully!');
            navigate('/userDashboard/manage');
        } catch (error) {
            toast.error('Failed to update room.');
        }
    };

    return (
        <div className='py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] min-h-screen font-sans text-gray-800 mt-12'>
            <div className='max-w-5xl mx-auto'>
                {/* Header section */}
                <div className="mb-8 border-b border-gray-200 pb-5">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Room Details</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Room ID: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{id}</span>
                    </p>
                </div>
                
                <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Center Column: Main Info */}
                    <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Basic Information</h3>
                        
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Room Title / Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'  
                                value={editableData.name} 
                                onChange={handleInputChange}
                                placeholder="e.g. Deluxe Ocean View Suite"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Capacity (Guests)</label>
                                <input 
                                    type="number" 
                                    name="capacity" 
                                    className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all' 
                                    value={editableData.capacity} 
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2"
                                    required
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Room Type</label>
                                <select 
                                    name="roomType" 
                                    className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white'
                                    value={editableData.roomType} 
                                    onChange={handleInputChange}
                                >
                                    <option value="Single Bed">Single Bed</option>
                                    <option value="Double Bed">Double Bed</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Location / Floor</label>
                                <input 
                                    type="text" 
                                    name="location"
                                    className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'  
                                    value={editableData.location} 
                                    onChange={handleInputChange}
                                    placeholder="e.g. Building A, 3rd Floor"
                                    required
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Price per Night ($)</label>
                                <input 
                                    type="number" 
                                    name="price"
                                    className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'  
                                    value={editableData.price} 
                                    onChange={handleInputChange}
                                    placeholder="e.g. 150"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Media & Features */}
                    <div className="space-y-6">
                        {/* Image Section Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Room Gallery</h3>
                            <label className='block text-sm font-medium text-gray-500 mb-2'>Upload Images (Max 4)</label>
                            
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span></p>
                                        <p className="text-xs text-gray-400">PNG, JPG up to 4 images</p>
                                    </div>
                                    <input type="file" multiple onChange={changeImage} className="hidden" disabled={isUploading || editableData.image.length >= 4}/>
                                </label>
                            </div>
                            
                            {isUploading && <p className="text-xs text-blue-500 mt-1 animate-pulse">Uploading images...</p>}

                            {/* Grid Layout Preview */}
                            <div className='grid grid-cols-2 gap-2 mt-4'> 
                                {editableData.image?.map((imgUrl, index) => (
                                    <div key={index} className="relative aspect-square group overflow-hidden rounded-lg border border-gray-200"> 
                                        <img 
                                            src={imgUrl} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                            alt="preview" 
                                        />
                                        <button 
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs opacity-90 hover:opacity-100 hover:bg-red-600 transition-all shadow-md font-bold"
                                            onClick={() => deleteImage(index)} 
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Services Section Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Amenities & Services</h3>
                            <div className='flex gap-2'>
                                <select 
                                    className='flex-1 border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm'
                                    value={selectedService} 
                                    onChange={(e) => setSelectedService(e.target.value)}
                                >
                                    <option value="">Select a service</option>
                                    <option value="Free WiFi">Free WiFi</option>
                                    <option value="Free Breakfast">Free Breakfast</option>
                                    <option value="Room Service">Room Service</option>
                                    <option value="Mountain View">Mountain View</option>
                                    <option value="Pool Access">Pool Access</option>
                                </select>
                                <button 
                                    type="button" 
                                    className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors' 
                                    onClick={addServices}
                                >
                                    Add
                                </button>
                            </div>

                            {/* Clean Badges wrapper */}
                            <div className='flex flex-wrap gap-2 mt-4'>
                                {editableData.services?.map((serviceName, index) => (
                                    <div className='flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100' key={index}>
                                        <span>{serviceName}</span>
                                        <button 
                                            type="button" 
                                            className="text-blue-400 hover:text-red-500 font-bold transition-colors ml-0.5 text-xs"
                                            onClick={() => deleteService(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {editableData.services.length === 0 && (
                                    <p className="text-xs text-gray-400 italic">No features selected yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Save Action Banner */}
                        <div className='pt-2 flex gap-4'>
                            <button 
                                type='button'
                                onClick={() => navigate('/userDashboard/manage')}
                                className='w-1/3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm text-center'
                            >
                                Cancel
                            </button>
                            <button 
                                type='submit' 
                                disabled={isUpdating}
                                className='w-2/3 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 text-center flex items-center justify-center'
                            >
                                {isUpdating ? 'Updating...' : 'Update Room'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPage;