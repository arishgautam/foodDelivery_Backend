import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{type:String,requried:true},
    email:{type:String,requried:true,unique:true},
password:{type:String,requried:true},
cartData:{type:Object,default:{}}
},{minimize:false})

const userModel = mongoose.model.user || mongoose.model("user",UserSchema);
export default userModel;