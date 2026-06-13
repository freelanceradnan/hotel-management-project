import React from 'react';
import { useLocation } from 'react-router';
import Listing from './Listing';

const ListingPage = () => {
    const location = useLocation();
    const { owner } = location?.state || {};
    
   
    if (!owner) {
        return <div className="p-4 text-red-500 mt-20">No User Please Go to Home page and come again!</div>;
    }

    return <Listing owner={owner}/>
};
export default ListingPage;