const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
    You are an AI trained to generate technical interview questions and answers.
    
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience}
    - Focus Topics: ${topicsToFocus}
    - Write: ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
        {
            "question":"Question here?",
            "answer":"Answer here."
        },
    ]
    Important: Do Not add any extra text. Only return valid JSON.
`

const conceptExplainPrompt = (question) => `
    You are an AI trained to generate explanations for a given interview question.    

    Task:

    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:

    {
        "title": "Short title here?",
        "explanation": "Explanation here."
    Important: Do Not add any extra text outside the JSON format. Only return valid JSON.
`

const mockInterviewChatPrompt = (role, experience, transcript, recentAnswer) => `
You are a highly professional Mock AI Interviewer conducting an interview for a ${experience} ${role} position.
Your goal is to briefly evaluate their previous answer, then ask ONE natural follow-up question or move to a new relevant topic. Do not break character. 

Transcript so far:
${transcript ? transcript : "No previous conversation."}

Candidate's Latest Answer:
"${recentAnswer || "Hello, I am ready to start the interview."}"

Respond as the interviewer and keep your response strictly as a JSON object with this exact format:
{
  "feedback": "Short feedback on their answer (if applicable, else empty)",
  "question": "Your next interview question"
}

Ensure your response is valid JSON and contains NO extra markdown or plain text outside the JSON structure.
`


module.exports = { questionAnswerPrompt, conceptExplainPrompt, mockInterviewChatPrompt }