import express from "express";
import { database } from "./src/database/user.database.js";
import userRoutes from "./src/routes/user.routes.js";
import { ErrorHandler } from "./src/middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cookieParser());
app.use(userRoutes);

app.get("/", (req, res) => {
  res.send("Hello Backend");
});

app.use(ErrorHandler);

const Server = async () => {
  try {
    await database();
    app.listen(PORT, () => {
      console.log(`Server is Running on ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to Connect with Database");
  }
};

Server();
