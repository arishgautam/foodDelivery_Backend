import mongoose from "mongoose";

    export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://arishgautam686:arish@fooddelivery.akrqn0g.mongodb.net/?retryWrites=true&w=majority&appName=FoodDelivery').then(()=>console.log("Mongo db connected"));
}