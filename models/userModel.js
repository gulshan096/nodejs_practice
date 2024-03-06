import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{ 
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    state:{
        type:String,
        // required:true
    },
    password: { 
        type: String, 
        required: true 
    },

})

const bookingSchema = new mongoose.Schema({

    userid:{
        type:String,
        required:true
    },
    car_name:{
        type:String,
        required:true
    },
    brand_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
})

export const User =  mongoose.model("user", userSchema);
export const Booking =  mongoose.model("booking", bookingSchema);