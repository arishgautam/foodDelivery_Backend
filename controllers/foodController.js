import foodModel from "../models/foodModel.js";
import fs from 'fs'

const baseUrl = 'https://fooddelivery-backend-5aua.onrender.com/uploads'


// add food item
const addFood = async (req,res) => {

let image_filename = `${baseUrl}/${req.file.filename}`;

const food = new foodModel({
    name:req.body.name,
    description:req.body.description,
    price:req.body.price,
    category:req.body.category,
    image:image_filename
})
try {
    await food.save();
    res.json({sucess:true,message:"Food Added"})
} catch (error) {
    res.json({sucess:false,message:"Error"})
}
}

// all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({sucess:true,data:foods})
    } catch (error) {
       res.json({sucess:false,message:"error"}) 
    }
}

// remove food item

const removeFood = async (req,res) => {
try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, ()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({sucess:true,message:"Food Removed"})
} catch (error) {
     res.json({sucess:false,message:"Error"})
}
}

export {addFood,listFood,removeFood}