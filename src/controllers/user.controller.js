import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { serachUsers as searchUsersService } from "../services/user.service.js";

export const searchUsers =async (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const keyword=req.query.search;
      // console.log(keyword);
      if(!keyword){
        logger.error("Please add a search query first")
        throw createHttpError.BadRequest("Ooops... something went wrong !")
      }
      const users= await searchUsersService(keyword,req.user.userId)
      res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}
