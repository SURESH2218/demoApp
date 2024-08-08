import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import UserRouter from "./routes/userRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://rohitbala1822:rohit123@cluster0.h7sm5.mongodb.net/mongopractice`
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to:", mongoose.connection.name);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", UserRouter);

app.get("/", function (req, res) {
  res.send("hey");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
