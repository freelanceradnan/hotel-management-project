import React, { useContext } from 'react';
import { StoreContext } from '../../../Contexts/StoreContext';

const Settings = () => {
    const{currentUser}=useContext(StoreContext)
    return (
        <div>
           <h2 className='text-2xl uppercase'>Settings for Admin</h2>
           <div className='mt-10 flex flex-col gap-4'>

           <div>
            <p className='text-2xl'>Notification Management</p>
            <div>
            <div>
                <p>Sending Order Success Details Emails?</p>
            </div>
            <div className='flex gap-2'>
                <div>
                    <label htmlFor="on">ON</label>
                    <input type="radio" name="onbutton" id="on" />
                </div>
                <div>
                    <label htmlFor="off">OFF</label>
                    <input type="radio" name="onbutton" id="off" />
                </div>
                
            </div>
            </div>
             <div>
            <div>
                <p>Sending Payment Success Details Emails?</p>
            </div>
            <div className='flex gap-2'>
                <div>
                    <label htmlFor="on">ON</label>
                    <input type="radio" name="onbutton" id="on" />
                </div>
                <div>
                    <label htmlFor="off">OFF</label>
                    <input type="radio" name="onbutton" id="off" />
                </div>
                
            </div>
            </div>
           </div>


           <div>
            <p  className='text-2xl'>Password and Email Management</p>
            <div className='flex gap-2'>
            <div>
                 <h2>Your current Email</h2>
             <div>
                <span>{currentUser?.email}</span>
             <button className='bg-blue-200'>Change</button>
             </div>
             <div >
                <div className='flex gap-2'>
                    <h2>Change your current Password</h2>
                   
                </div>
                 <div className='flex gap-2'>
                   <div> ********</div>
                    <button className='bg-blue-200'>change password</button>
                 </div>
             </div>
            </div>
            </div>
           </div>


           <div>
            <p  className='text-2xl'>UserListing Eligiblity</p>
            <div>
                <label htmlFor="">User can listing Room?</label>
                <div className='flex gap-2'>
                    <div>
                         <label htmlFor="yes">Yes</label>
                         <input type="radio" name="listing" id="yes" />
                    </div>
                     <div>
                         <label htmlFor="no">No</label>
                         <input type="radio" name="listing" id="no" />
                    </div>
                </div>
            </div>
           </div>


           <div>
           <div>
             <p  className='text-2xl'>Theme Management</p>
           </div>
           <div>
            <h2>Current theme is</h2>
            <div className='flex gap-2'>
                <div>
                    <label htmlFor="White">White</label>
                <input type="radio" name="theme" id="White" />
                </div>
                <div>
                    <label htmlFor="Black">Black</label>
                <input type="radio" name="theme" id="Black" />
                </div>
            </div>
           </div>
           </div>
           </div>
        </div>
    );
};

export default Settings;