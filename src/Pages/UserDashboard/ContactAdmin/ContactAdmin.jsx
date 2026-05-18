import { Mail, Phone, Copy, Check } from 'lucide-react';
import React, { useState } from 'react';

const ContactAdmin = () => {
  
    const [copiedItem, setCopiedItem] = useState(null);

    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItem(type);
            
           
            setTimeout(() => {
                setCopiedItem(null);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="max-w-md p-6 bg-white rounded-lg shadow-sm">
            <div>
                <h2 className='text-3xl font-bold text-gray-800 uppercase tracking-wide'>Contact Admin</h2>
                <p className="text-gray-600 mt-2 mb-6">Contact site admin for quick approve payments and any problems.</p>
                
                <div className="space-y-6">
                    {/* WhatsApp Section */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className='flex gap-2 text-gray-500 text-sm font-medium mb-1'>
                            <Phone size={18}/>
                            <div>Contact with Whatsapp</div>
                        </div>
                        <div className="flex items-center justify-between gap-4 mt-2">
                            <h2 className="text-xl font-semibold text-gray-800">+880 1305 140844</h2>
                            <button 
                                onClick={() => handleCopy('+8801305140844', 'phone')}
                                className={`p-2 rounded-md transition-colors ${
                                    copiedItem === 'phone' 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                }`}
                                title="Copy Phone Number"
                            >
                                {copiedItem === 'phone' ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Email Section */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className='flex gap-2 text-gray-500 text-sm font-medium mb-1'>
                            <Mail size={18} />
                            <div>Contact with Email</div>
                        </div>
                        <div className="flex items-center justify-between gap-4 mt-2">
                            <h2 className="text-xl font-semibold text-gray-800 break-all">reactorbro722@gmail.com</h2>
                            <button 
                                onClick={() => handleCopy('reactorbro722@gmail.com', 'email')}
                                className={`p-2 rounded-md transition-colors ${
                                    copiedItem === 'email' 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                }`}
                                title="Copy Email Address"
                            >
                                {copiedItem === 'email' ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    
                </div>
           </div>
        </div>
    );
};

export default ContactAdmin;