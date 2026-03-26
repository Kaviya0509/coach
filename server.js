require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB = require("./config/db.js")
const { protect } = require("./middlewares/authMiddleware.js")
const { generateInterviewQuestions, generateConceptExplanation, mockInterviewChat } = require("./controllers/aiController.js")

const authRoutes = require("./routes/authRoutes.js")
const sessionRoutes = require("./routes/sessionRoutes.js")
const questionRoutes = require("./routes/questionRoutes.js")

const app = express()

// Middleware to handle cors
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

connectDB()

// Middleware
app.use(express.json())

// ✅ ROOT ROUTE (Fixes Cannot GET /)
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀")
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/questions", questionRoutes)

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions)
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation)
app.use("/api/ai/mock-interview-chat", protect, mockInterviewChat)

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}))

// Start Server
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

module.exports = app