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
  <div className="min-h-screen bg-gray-50 pt-28 px-4 md:px-10 lg:px-24">
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
        <h1 className="text-4xl font-bold">
          List Your Hotel Room
        </h1>
        <p className="mt-2 text-blue-100">
          Add your room details correctly to attract more guests.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={submitHandler}
        className="p-6 md:p-10 space-y-8"
      >

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Room Name
            </label>
            <input
              type="text"
              name="name"
              value={listingData.name}
              onChange={changeHandler}
              placeholder="Luxury Deluxe Room"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Price Per Night
            </label>
            <input
              type="number"
              name="price"
              value={listingData.price}
              onChange={changeHandler}
              placeholder="$120"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={listingData.location}
              onChange={changeHandler}
              placeholder="Dhaka, Bangladesh"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              min={1}
              name="capacity"
              value={listingData.capacity}
              onChange={changeHandler}
              placeholder="2 Guests"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Room Type */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Room Type
          </label>

          <select
            name="roomType"
            value={listingData.roomType}
            onChange={changeHandler}
            className="w-full md:w-1/2 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
          </select>
        </div>

        {/* Upload Images */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700">
            Upload Images
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={submitting}
              className="w-full"
            />

            <p className="text-sm text-gray-500 mt-2">
              Upload up to 4 high-quality room images
            </p>
          </div>

          {submitting && (
            <p className="text-blue-500 mt-3 animate-pulse">
              Uploading images...
            </p>
          )}

          {/* Image Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {listingData.image.map((img, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-2xl shadow"
              >
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-32 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700">
            Services & Amenities
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Service</option>
              <option value="Free WiFi">Free WiFi</option>
              <option value="Free Breakfast">Free Breakfast</option>
              <option value="Room Service">Room Service</option>
              <option value="Swimming Pool">Swimming Pool</option>
              <option value="Air Conditioning">Air Conditioning</option>
            </select>

            <button
              onClick={addService}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition"
            >
              Add Service
            </button>
          </div>

          {/* Service Tags */}
          <div className="flex flex-wrap gap-3 mt-5">
            {listingData.services.map((service, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span>{service}</span>

                <button
                  type="button"
                  onClick={() =>
                    setListingData((prev) => ({
                      ...prev,
                      services: prev.services.filter(
                        (_, i) => i !== index
                      ),
                    }))
                  }
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 text-white py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg"
        >
          {submitting ? "Uploading..." : "List Room"}
        </button>
      </form>
    </div>
  </div>

    );
};

export default Listing;