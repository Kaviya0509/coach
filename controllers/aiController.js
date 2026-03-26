const Groq = require("groq-sdk")
const { conceptExplainPrompt, questionAnswerPrompt, mockInterviewChatPrompt } = require("../utils/prompts.js")

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// @desc  generate interview questions and answers using groq
// @route  POST /api/ai/generate-questions
// @access  private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body

        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({
                message: "Missing Required Fields"
            })
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions)

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })

        let rawText = response.choices[0].message.content

        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim()

        const data = JSON.parse(cleanedText)
        
        // Handle potential wrapping object from json_object mode
        const result = Array.isArray(data) ? data : (data.questions || data.items || data)
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({
            message: "Failed to Generate Questions",
            error: error.message
        })
    }
}

// @desc  generate explains a interview question
// @route  POST /api/ai/generate-explanation
// @access  private
const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body

        if (!question) {
            return res.status(400).json({
                message: "Missing Required Fields"
            })
        }

        const prompt = conceptExplainPrompt(question)

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })

        let rawText = response.choices[0].message.content

        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim()

        const data = JSON.parse(cleanedText)

        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({
            message: "Failed to Generate Explanation",
            error: error.message
        })
    }
}

// @desc  run a continuous mock interview chat
// @route  POST /api/ai/mock-interview-chat
// @access  private
const mockInterviewChat = async (req, res) => {
    try {
        const { role, experience, transcript, recentAnswer } = req.body

        if (!role || !experience) {
            return res.status(400).json({
                message: "Missing Required Fields: role, experience"
            })
        }

        const prompt = mockInterviewChatPrompt(role, experience, transcript, recentAnswer)

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })

        let rawText = response.choices[0].message.content

        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim()

        const data = JSON.parse(cleanedText)

        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({
            message: "Failed to Generate Interviewer Response",
            error: error.message
        })
    }
}

module.exports = { generateInterviewQuestions, generateConceptExplanation, mockInterviewChat }