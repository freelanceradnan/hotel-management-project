import { useLocation } from 'react-router-dom';
import Invoice from '../Invoice/Invoice';
import { useContext } from 'react';
import { StoreContext } from '../../Contexts/StoreContext';


const InvoicePage = () => {
    const location = useLocation();
    const {OrderTime,setOrderTime}=useContext(StoreContext)
  
    const { orders } = location.state || {};
    if (!orders) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold">No order found!</h2>
                <p>Please go back to your order history.</p>
            </div>
        );
    }

    return <Invoice orderData={orders} userEmail={orders?.userEmail} OrderTime={OrderTime}/>;
};

export default InvoicePage;