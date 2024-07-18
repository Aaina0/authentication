import { decodeAccessToken } from "../services/jwtServices.js";
import { CustomError } from "./errorHandler.js";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new CustomError(401, "Please Login"));
  }

  const decodedToken = decodeAccessToken(accessToken);
  if (!decodedToken) {
    return next(new CustomError(401, "Please Login"));
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(new CustomError(401, "Please login"));
  }

  req.user = user;
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new CustomError(403, "You are not authorized for this"));
  }
  next();
};
