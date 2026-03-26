const express = require("express")
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController.js")
const { protect } = require("../middlewares/authMiddleware.js")
const upload = require("../middlewares/uploadMiddleware.js")

const router = express.Router()

// Auth routes
router.post("/register", registerUser) // register user
router.post("/login", loginUser) // login user
router.get("/profile", protect, getUserProfile) // get user profile

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No File Uploaded"
        })
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({ imageUrl })
})

module.exports = router