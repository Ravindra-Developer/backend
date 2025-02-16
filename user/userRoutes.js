import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "./userSchema.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await users.insertOne({ username, password: hashedPassword });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ message: "User registered", token: token });
    } catch (error) {
        res.status(400).json({ message: "Username already exists" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await users.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

export default router;

