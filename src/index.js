import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js"

// env varialble
const {DATABASE_URL} = process.env
const PORT = process.env.PORT || 8000;

// exit on mongodb error 
 mongoose.connection.on("error",(err)=>{
    logger.error(`Mongodb connection error : ${err}`);
    process.exit(1);
 })

 // mongodb dubug mode 
 if(process.env.NODE_ENV !== "production"){
    mongoose.set("debug", true)
 }

// MongoDB connection
mongoose.connect(DATABASE_URL,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
}).then(()=>{
    logger.info("Connected to Mongodb")
})

// 

// server Listner
let server = app.listen(PORT, () => {
  logger.info(`server is Listening at ${PORT}.`);
//   console.log("process id", process.pid);
  //throw new Error("error in server")
});

// socket io
const io=new Server(server,{
   pingTimeout:60000,
   cors:{
      origin:process.env.CLIENT_ENDPOINT,
   }
})

io.on("connection",(socket)=>{
   logger.info("socket io connected successfully.");
   SocketServer(socket)
})

// handle server errors
const exitHandle = () => {
if(server){
   logger.info("Server closed.") 
   process.exit(1)
}else{
   process.exit(1)
}
}

const unexpectedErrorHandle = (error) => {
  logger.error(error);
  exitHandle()
}; 

process.on("uncaughtException", unexpectedErrorHandle)
process.on("unhandledRejection",unexpectedErrorHandle)


// SIGTERM
process.on("SIGTERM", ()=>{
    if(server){
        logger.info("Server closed.") 
        process.exit(1)
     }
})

// unmatch routes handling 
app.all("*",function(req,res){
   res.status(404)
 
   res.end(JSON.stringify("This routes not found"))
});
