const Session = require("../models/Session.js")
const Question = require("../models/Question.js")

// @desc  create a new session and linked questions
// @route  POST /api/sessions/create
// @access private
exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body
        const userId = req.user._id // assuming you have a middleware setting req.user

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description
        })

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                })
                return question._id
            })
        )

        session.questions = questionDocs
        await session.save()

        res.status(201).json({
            success: true,
            session
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// @desc  get all sessions for the logged-in user
// @route  GET /api/sessions/my-sessions
// @ access  private
exports.getMySessions = async (req, res) => {
    try {
        // console.log("REQ USER:", req.user)
        // console.log("REQ USER ID:", req.user._id)

        const sessions = await Session.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("questions")

        res.status(200).json(sessions)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// @desc  get a session by id with populated questions
// @route  GET /api/sessions/:id
// @access  private
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: "questions",
                options: { sort: { isPinned: -1, createdAt: 1 } },
            })
            .exec()

        if (!session) {
            return res.status(400).json({
                success: false,
                message: "Session Not Found"
            })
        }

        res.status(200).json({
            success: true,
            session
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// @desc  delete a session and its questions
// @route  DELETE /api/sessions/:id
// @access  private
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)

        if (!session) {
            return res.status(404).json({
                message: "Session Not Found"
            })
        }

        // check if the logged-in user owns this session
        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "Not Authorized to Delete this Session"
            })
        }

        // first, delete all questions linked to this session
        await Question.deleteMany({ session: session._id })

        // then, delete the session
        await session.deleteOne()

        res.status(200).json({
            message: "Session Deleted Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}