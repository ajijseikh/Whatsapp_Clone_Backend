import createHttpError from "http-errors";
import { UserModel } from "../models/index.js"

export const findUser=async(userId)=>{
    const user=await UserModel.findById(userId);
    if(!user) throw createHttpError.BadRequest("Please fill all field")
    return user;
}


export const serachUsers=async(keyword,userId)=>{
   const users=await UserModel.find({
   $or:[
   { name:{$regex:keyword, $options:"i"}},
   { email:{$regex:keyword, $options:"i"}},

   ]
   }).find({
    _id:{$ne:userId}
   })
//    console.log("user",users);
   return users
}

