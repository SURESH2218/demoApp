import express from "express";
import { UserDetails } from "../models/userLoginDetails.js";
import bycrypt, { hash } from "bcrypt";

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
    const hashedPass = await bycrypt.hash(password, 10, (err, hash) => {
      console.log(hash);
    });
    const newUser = new UserDetails({
      username,
      email,
      password: hashedPass,
      age,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

export default router;
