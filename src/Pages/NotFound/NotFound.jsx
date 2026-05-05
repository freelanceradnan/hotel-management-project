import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-50 px-4'>
            <div className='text-center'>
               
                <h1 className='text-9xl font-black text-gray-500 animate-pulse'>404</h1>
                
                <div className='-mt-12'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-2'>Oops! Page Not Found</h2>
                    <p className='text-gray-500 mb-8 max-w-md mx-auto'>
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                    <Link to="/">
                        <button className='w-full sm:w-auto px-8 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-all shadow-lg hover:shadow-gray-300 active:scale-95'>
                            Return Home
                        </button>
                    </Link>
                    
                    <Link to="/myAccount/help">
                        <button className='w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition-all active:scale-95'>
                            Report Problem
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;