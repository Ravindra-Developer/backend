import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('database connection successful')
}).catch((err) => {
    console.log("no connection", err)
})

const app = express();
app.use(express.json());
app.use(cors());


import userRoutes from "./user/userRoutes.js";
import taskRoutes from "./task/taskRoutes.js";

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);


app.listen(3000, () => console.log("Server running on port 3000"));

export default app;
