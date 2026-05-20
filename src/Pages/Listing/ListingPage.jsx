import React from 'react';
import { useLocation } from 'react-router';
import Listing from './Listing';

const ListingPage = () => {
    const location=useLocation();
    const {owner}=location?.state||{}
    
    return <Listing owner={owner}/>
};

export default ListingPage;