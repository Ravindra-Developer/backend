import express from "express";
import tasks from "./taskSchema.js";
import { authenticate } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/create", authenticate, async (req, res) => {
    const { title, description } = req.body;
    const task = new tasks({ title, description, userId: req.user.userId });
    await task.save();
    res.status(201).json(task);
});

router.get("/getMyTask", authenticate, async (req, res) => {
    const status = req.query.status
    const findQuery = { userId: req.user.userId }
    if (status) {
        findQuery['status'] = status
    }
    const tasksList = await tasks.find(findQuery);
    res.json(tasksList);
});

router.put("/update/:id", authenticate, async (req, res) => {
    try {
        const task = await tasks.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, req.body, { new: true, runValidators: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
    const task = await tasks.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
});

export default router;
