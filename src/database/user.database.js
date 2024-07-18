import { config } from "dotenv";
import mongoose from "mongoose";

config();
const MONGO_URI = process.env.MONGO_URI;

export const database = async (req, res) => {
  try {
    await mongoose
      .connect(MONGO_URI)
      .then(() => console.log("DataBase Connected"))
      .catch((e) => console.log(e));
  } catch (error) {}
};
