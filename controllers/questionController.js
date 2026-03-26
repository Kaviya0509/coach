const Question = require("../models/Question.js")
const Session = require("../models/Session.js")

// @desc  add additional questions to an existing session
// @route  POST /api/questions/add
// @access  private
exports.addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body

        if (!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({
                message: "Invalid Input Data"
            })
        }

        const session = await Session.findById(sessionId)

        if (!session) {
            return res.status(404).json({
                message: "Session Not Found"
            })
        }

        // create new questions
        const createQuestions = await Question.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer
            }))
        )

        // update session to include new question IDs
        session.questions.push(...createQuestions.map((q) => q._id))
        await session.save()

        res.status(201).json(createQuestions)

    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// @desc  pin or unpin a question
// @route  POST /api/questions/:id/pin
// @access  private
exports.togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question Not Found"
            })
        }

        question.isPinned = !question.isPinned
        await question.save()

        res.status(200).json({
            success: true,
            question
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// @desc  update a note for a question
// @route  POST /api/questions/:id/note
// @access  private
exports.updateQuestionNote = async (req, res) => {
    try {
        const { note } = req.body
        const question = await Question.findById(req.params.id)

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question Not Found"
            })
        }

        question.note = note || ""
        await question.save()

        res.status(200).json({
            success: true,
            question
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}