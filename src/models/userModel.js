import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,  "Please provide your name"],
    },
    email:{
        type:String,
        required:[true, "Please provide your email address"],
        unique:[true, "This email address already exist"],
        lowercase:true,
        validate:[validator.isEmail, "Please provide valid email address"]
    },
    picture:{
        type:String,
        default:"https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png",
    },
    status:{
        type:String,
        default:"Hey there ! I'm using whatsapp"
    },
    password:{
        type:String,
        required:[true,"Please provide your password"],
        minlength:[6,"Please make sure your password is atleast 6 character long",],
        maxLength:[30,"Please make sure your password is less than 30 character long"],
    }
},{
    collection:"users",
    timestamps:true,
});

// we do something defore creating a document
userSchema.pre("save",async function(next){
   try {
    if(this.isNew){
        const salt=await bcrypt.genSalt(12);
        const hashedPassword=await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    }
    next()
   } catch (error) {
    next(error)
   }
})

const UserModel = 
mongoose.models.UserModel || mongoose.model("UserModel",userSchema);

export default UserModel ;