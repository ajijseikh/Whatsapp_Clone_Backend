import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";
import bcrypt from "bcrypt";
import { verifyToken } from "./token.service.js";


// env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

// Register
export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;
  // check if field are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all field");
  }

  // check name length
  if (
    !validator.isLength(name, {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please Provide your name is between 2 and 16 characters."
    );
  }

  // check status length
  if (status && status > 64) {
    throw createHttpError.BadRequest(
      "Please make sure youe status is less than 64 character"
    );
  }
  // check isf email is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure to provide a valid email address."
    );
  }

  // check is user already exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address, this email already exist."
    );
  }
  // check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 30,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and characters."
    );
  }

  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password,
  }).save();

  return user;
};

// Login
export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  // check user exist
  if (!user) {
    throw createHttpError.NotFound("Invalid credentials");
  }

  // compare password
  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials");
  
  return user;
};
