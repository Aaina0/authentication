import bcrypt from "bcrypt";
import asyncHandler from "../middleware/asyncHandler.js";
import { CustomError } from "../middleware/errorHandler.js";
import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
import sendToken from "../utils/sendToken.js";
// import sendResponse from "../utils/sendResponse.js";
import { decodeRefreshToken } from "../services/jwtServices.js";
import Token from "../models/token.model.js";

const Register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new CustomError(400, "All fields are required"));
  }

  const isUserExist = await User.exists({ email });
  if (isUserExist) {
    return next(new CustomError(403, "User already exists"));
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });

  sendToken(user, res, "User Created Successfully", 201);
});

const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError(400, "User does not exist"));
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return next(new CustomError(400, "Password is incorrect"));
  }

  sendToken(user, res, "User Login Successfully", 200);
});

const Logout = async (req, res, next) => {
  const userId = req.user?._id;
  console.log("Logout userId:", userId);

  if (!userId) {
    console.log("user not authenticated");
    return next(new CustomError(401, "Please Login Again"));
  }
  try {
    res.clearCookie("token");
    console.log("Cokkies Cleared");
    res.send("Logged Out Succesfully");
  } catch (error) {
    console.log("Logged Error:", error);
    next(new CustomError(500, "Internel server error"));
  }
};

// when access token is expired then we get new access token using refresh token
const RefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new CustomError(401, "Please Login again"));
  }

  const refreshTokenDocument = await Token.findOne({ refreshToken });
  if (!refreshTokenDocument) {
    return next(new CustomError(400, "Please Login Again"));
  }

  const decodedToken = decodeRefreshToken(refreshTokenDocument.refreshToken);
  if (!decodedToken) {
    return next(new CustomError(400, "Please Login Again"));
  }

  const user = await User.findById(decodedToken.id);

  if (!user) return next(new CustomError(400, "Please Login Again"));
  sendToken(user, res, "New Token Sent Successfully", 200);
});

const user = (req, res, next) => {
  res.send("I am User");
};

const admin = (req, res, next) => {
  res.send("I am admin");
};

export { admin, Login, Logout, RefreshToken, Register, user };
