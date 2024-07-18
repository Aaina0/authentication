import express from "express";
import {
  Register,
  Login,
  Logout,
  user,
  admin,
  RefreshToken,
} from "../controllers/user.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authorization.js";

const app = express();

app.post("/api/register", Register);
app.post("/api/login", Login);
app.post("/api/logout", isAuthenticated, Logout);
app.post("/api/refresh-token", RefreshToken);
app.get("/api/user", isAuthenticated, user);
app.get("/api/admin", isAuthenticated, isAdmin, admin);

export default app;
