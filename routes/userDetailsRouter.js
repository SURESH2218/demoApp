import express from "express";
import { UserDetails } from "../models/userLoginDetails.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await UserDetails.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { username, email, password, age } = req.body;

    if (!username || !email || !password || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new UserDetails({
      username,
      email,
      password: hashedPass,
      age,
    });

    const token = jwt.sign({ email }, "suresh");
    console.log(token);

    res.cookie("token", token, { httpOnly: true, secure: false, path: "/" });
    console.log("Cookie set in /create route");
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});



router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
