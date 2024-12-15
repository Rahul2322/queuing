import { NextFunction, Request,Response } from "express";
import { User } from "../models/users.model";
import { BaseQuerySearcUser } from "../types/types";



export const  fetchUsers = async (req:Request<{},{},BaseQuerySearcUser>,res:Response,next:NextFunction)=>{
    const {sort,search='{}'} = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = JSON.parse(search as string);
    try {
      const users = await User.find(filter)
      .sort(sort ? { [sort as string]: 1 } : { "createdAt": 1 })
      .skip(skip)
      .limit(limit);
     
      console.log(users.length,'users');
      
      const count = await User.countDocuments(filter);
      console.log(count,"count");
      
      res.status(200).json({
        totalNoOfUsers:count,
        limit:limit,
        page:page,
        user:users
      })
    } catch (error) {
        console.log(error,"errrorro");
        
        next(error)
    }

}