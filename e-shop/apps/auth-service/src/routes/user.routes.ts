import express, { Router } from "express";
import { registerUser } from "../controllers/auth/auth-controller";

const authrouter: Router = express.Router();

authrouter.post("/user-registration", registerUser);

export default authrouter;
