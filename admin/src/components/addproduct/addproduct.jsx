import React, { useState } from 'react';
import './addproduct.css';
import upload_area from '../../assets/upload_area.svg';

const Addproduct = () => {
  
    const [image,setimage] = useState(false);
    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })

    const imageHandler = (e) =>{
        setimage(e.target.files[0]);
    }

    const changeHandler = (e) =>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const Add_Product = async () =>{
        console.log(productDetails);
        let responseData ;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json'
            },
            body:formData,
        }).then((res)=>res.json()).then((data)=>{responseData=data})

        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((res)=>res.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed Please Try Again")
            })
        }
    }
    return (
        <div className="add-product">
            <div className="addproduct-itemfield mb-3">
                <p className='form-label fw-bold'>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' className='form-control w-100 fs-5'/>
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p className='form-label fw-bold'>Price</p>
                    <input type="text" value={productDetails.old_price} onChange={changeHandler} className='form-control w-100 fs-5' name='old_price' placeholder='Type here'/>
                </div>
                <div className="addproduct-itemfield">
                    <p className='form-label fw-bold'>Offer Price</p>
                    <input type="text" value={productDetails.new_price} onChange={changeHandler} className='form-control w-100 fs-5' name='new_price' placeholder='Type here'/>
                </div>
            </div>
            <div className="addproduct-itemfield my-3">
               <p className='form-label fw-bold '>Product Category</p>
               <select name="category"  value={productDetails.category} onChange={changeHandler} className='form-select fs-5' style={{width:'200px',height:"3rem"}}>
                <option value="women">WOMEN</option>
                <option value="men">MEN</option>
                <option value="kid">KID'S</option>
               </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input type="file" onChange={imageHandler} name='image' id='file-input' hidden/>
            </div>
            <button className='addproduct-btn' onClick={()=>{Add_Product()}}>ADD</button>
        </div>
    )
}

export default Addproduct;
