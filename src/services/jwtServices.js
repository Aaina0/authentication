import jwt from "jsonwebtoken";
import { config } from "dotenv";
import Token from "../models/token.model.js";

config();

const generateAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const decodeAccessToken = (accessToken) => {
  try {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
const decodeRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
};

const storeTokenInDb = async (refreshToken, userid) => {
  try {
    // is token already exist
    const isAlreadyExist = await Token.exists({ user: userid });
    let token;
    // update the token if already exist
    if (isAlreadyExist) {
      token = Token.findOneAndUpdate(
        { user: userid },
        { refreshToken: refreshToken }
      );
    } else {
      // create new token if not exist
      token = await Token.create({
        refreshToken: refreshToken,
        user: userid,
      });
    }
    return token;
  } catch (error) {
    console.log("error while storing token in database", error);
    return null;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
  storeTokenInDb,
};
