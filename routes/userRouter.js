import express from "express";
import User from "../models/usermodel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { name, email, image } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const newUser = await User.create({ name, email, image });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(400).json({ message: error.message });
  }
});

router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Deleted user:", deletedUser);
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

router.post("/edit", async (req, res) => {
  const { id, name, email, image } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, image },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating user");
  }
});

export default router;
