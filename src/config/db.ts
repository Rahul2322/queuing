import mongoose from "mongoose";

export const dbConnection = (uri:string) => {
    mongoose.connect(uri)
    .then(()=>console.log("Connection Successfull"))
    .catch(err=>console.log("Something Went Wrong",err))
};
