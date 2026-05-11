export const uploadToCloudinary=async(file)=>{
    const data=new FormData()
    data.append('file',file)
    data.append('cloud_name',"doguuyqrp")
    data.append('upload_preset','my eco projects')
    const res = await fetch(`https://api.cloudinary.com/v1_1/doguuyqrp/image/upload`, {
  method: 'POST', 
  body: data     
})
const result=await res.json()
if(!res.ok) throw new Error('cloudinary upload failed')
return{
    url:result.secure_url,
    publicId:result.public_id
}
}