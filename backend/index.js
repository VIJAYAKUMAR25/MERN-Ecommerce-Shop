const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');


app.use(express.json());
app.use(cors());

// DATABASE Connection with mongoDB
mongoose.connect("mongodb+srv://vijay:8838718763@project1.4oj727b.mongodb.net/e-commerce");

//API Creation

app.get("/",(req,res)=>{
    res.send("Express app is running");
})

//Image Storage Engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = `${file.fieldname}_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueSuffix);
    }
})



const upload = multer({storage:storage});


//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products

const Product = mongoose.model("Product",{
        id:{
            type: Number,
            required:true,
        },
        name:{
            type:String,
            required:true,

        },
        image:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        new_price:{
            type:Number,
            required:true
        },
        old_price:{
            type:Number,
            required:true
        },
        date:{
            type:Date,
            default:Date.now,
        },
        avilable:{
            type:Boolean,
            default:true,
        }
   
})
app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id=1;
    }

    const product= new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log('saved');
    res.json({
        success:true,
        name:req.body.name
    })
})


// Creating api for deleting product

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating api for geting all product

app.get('/allproduct' ,async (req,res)=>{
    let products = await Product.find({});
    console.log("ALL PRODUCTS FETCHED")
    res.send(products);
})

//Schema Creating for User model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating Endpoint for registering the user

app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false,errors:"Existing user found with same email address"})
    }
    let cart ={};
    for (let i = 0; i<300;i++){
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

// Creating end point for user login

app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data ={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

//Creating end point for new collection data

app.get('/newcollections',async (req,res)=>{
    let product = await Product.find({});
    let newcollection = product.slice(1).slice(-8);
    console.log("New Collection Fetched");
    res.send(newcollection);
})


//Creating end point for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("popular in women fetched")
    res.send(popular_in_women);
})

//Creating MiddleWare to fetch user

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"please authenticate using valid token"})
    }else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Please aunthaticate Using A valid Token"})
        }
    }
}

// Creating end point for  adding products in cartdata

app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added");
})

//Creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed");
})

//Creating end point to get cartdata

app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData); 
})


app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on port "+port)
    }else{
        console.log("Error :"+error);
    }
})