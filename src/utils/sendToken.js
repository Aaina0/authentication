import {
  generateAccessToken,
  generateRefreshToken,
  storeTokenInDb,
} from "../services/jwtServices.js";

const sendToken = async (user, res, message, statusCode) => {
  try {
    if (!user._id) throw new Error("User not foud");
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await storeTokenInDb(refreshToken, user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(statusCode).json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};

export default sendToken;
