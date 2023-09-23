import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors"

// dotenv congig
dotenv.config();

// create express app 
const app= express();

// Morgan => this for functionality 
if(process.env.NODE_ENV !=="production"){
    app.use(morgan("dev"))
}

// Helmet => for security http method
app.use(helmet())

// Parser json request url (body-parser): this is parser request data to client.
app.use(express.json());

// Parser request body :
app.use(express.urlencoded({extended:true}))

// sanitize request data : security for our database queries
app.use(mongoSanitize())

// Cookie-Parser: it is simply is going to help us to set cookies and insert some rows and then get them, which is for Authentication
app.use(cookieParser())

// Compression-middleware: this helps compress it.so it becomes the size of it is less, and that makes the response faster because there is less.data size to handle.
app.use(compression());

// file upload:
app.use(fileUpload({
    useTempFiles:true
}))

// Cors : this middleware to protect and restrict access to the server.
app.use(cors())

app.post("/",(req,res)=>{
    console.log(req.body);
    res.send(req.body)
})

export default app;