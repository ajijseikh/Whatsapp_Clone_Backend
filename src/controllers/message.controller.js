import logger from "../configs/logger.config.js"
import { updateLatestMessage } from "../services/conversation.service.js";
import { createMessage, populateMessage } from "../services/message.service.js";

export const sendMessage=async(req,res,next)=>{

    try {
     const user_id=req.user.userId;
     const {message, convo_id, files}= req.body;
     if(!convo_id || (!message && !files)){
        logger.error("Please provide a conversation id and a message body");
       return  res.sendStatus(400) //sendStatus
     }
      const msgData ={
        sender:user_id,
        message,
        conversation:convo_id,
        files: files || [],
      };
      let newMessage=await createMessage(msgData);
      let populatedMessage =await populateMessage(newMessage._id)
      await updateLatestMessage(convo_id,newMessage);
      res.json(populatedMessage)
    } catch (error) {
        next(error)
    }
}

export const getMessages=async(req,res,next)=>{
    try {
        res.send("get message")
    } catch (error) {
        next(error)
    }
}