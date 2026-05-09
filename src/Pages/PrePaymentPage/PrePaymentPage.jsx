import React from 'react';
import { useLocation } from 'react-router';
import Prepayment from '../PrePayments/Prepayment';

const PrePaymentPage = () => {
    const location=useLocation()
    const{orders}=location.state||{}
    if(!orders){
        <div className='flex items-center justify-center'>
            <h2>Orders data missing please go back or Contact Room Owner For Complete your payments!</h2>
        </div>
    }
    return (
        <Prepayment orders={orders}/>
    );
};

export default PrePaymentPage;