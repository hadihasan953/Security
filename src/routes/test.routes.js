import express from "express";
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ message: "Test GET endpoint working!" });
});

router.post("/test", (req, res) => {
    res.json({ message: "Test POST endpoint working!" });
});

export default router;
