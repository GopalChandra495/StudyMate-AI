const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Generate topic suggestions for a subject
const generateTopics = async (subject) => {
  const prompt = `
You are a helpful study assistant.

Suggest exactly 8 important study topics for the subject: "${subject}".

Return only a valid JSON array of objects.
Each object must have:
- "title": the topic name as a string
- "difficulty": one of "Easy", "Medium", or "Hard"

Example:
[
  { "title": "Introduction to DBMS", "difficulty": "Easy" },
  { "title": "Database Keys", "difficulty": "Medium" }
]

Do not include markdown, explanations, or code fences.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const topics = JSON.parse(response.text);

    if (
      !Array.isArray(topics) ||
      !topics.every(
        (topic) =>
          topic &&
          typeof topic.title === "string" &&
          typeof topic.difficulty === "string"
      )
    ) {
      throw new Error("AI returned topics in an unexpected format");
    }

    return topics;
  } catch (error) {
    console.error("Gemini Topic Generation Error:", error);
    throw error;
  }
};
// Answer a student's question about a selected topic
const askTutor = async (topic, question) => {
  const prompt = `
You are a friendly, patient, and professional college study tutor.

The student is studying this topic:
${topic}

Student's question:
${question}

Your task:
Explain the answer in simple, clear language that a college student can easily understand.
Stay focused on the selected topic and answer the student's actual question.

Formatting instructions:
- Format the answer using Markdown so it is easy to read on a study website.
- Start with a short, direct answer or introduction. Avoid long greetings.
- Use clear headings (##) to separate main sections when the answer needs multiple sections.
- Use short paragraphs. Do not put the entire answer into one long paragraph.
- Use bullet points for lists of facts, features, advantages, or key points.
- Use numbered lists for steps, sequences, or procedures.
- Use **bold** for important terms and key ideas, but do not overuse it.
- Include a simple example when it helps explain the concept.
- For a process or technical concept, explain it step by step when useful.
- End with a short "Key Takeaway" section when it would help the student remember the main idea.
- Do not add headings or sections that are unnecessary for a short, simple question.
- Do not use tables unless comparing multiple items is genuinely clearer in a table.
- Do not include unnecessary repetition, decorative symbols, or a long conclusion.

Accuracy instructions:
- If the question is unclear, ask the student to clarify.
- If you are unsure about a fact, say so instead of making it up.
- Do not claim that an explanation is verified against a textbook or official source unless that source was provided.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Tutor Error:", error);
    throw error;
  }
};

// Generate a day-by-day study plan
const generateStudyPlan = async (
  topics,
  dailyHours,
  durationDays,
  startDate
) => {
  const prompt = `
You are a practical and supportive study planner.

Create a realistic study plan using the student's saved topics and available study time.

Student details:
- Saved topics: ${JSON.stringify(topics)}
- Available study time per day: ${dailyHours} hours
- Plan duration: ${durationDays} days
- Start date: ${startDate}

Plan requirements:
- Create exactly ${durationDays} days in the plan.
- Distribute the saved topics across the days in a sensible learning order.
- Keep the total planned study time for each day at or below ${dailyHours} hours.
- Break each day into manageable study sessions.
- Include a short, actionable goal for each day.
- Include revision or practice sessions where useful.
- Use only the topics supplied by the student. Do not invent additional syllabus topics.
- If there are fewer topics than days, use revision, practice, or review of the supplied topics to fill the plan.
- Keep activities specific and easy for a student to follow.

Return only valid JSON in this exact general structure:
{
  "title": "Study Plan",
  "durationDays": ${durationDays},
  "dailyHours": ${dailyHours},
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "focus": "Main focus for the day",
      "sessions": [
        {
          "topic": "A topic from the saved topics",
          "durationMinutes": 60,
          "activity": "What the student should do"
        }
      ],
      "goal": "A short goal for the day"
    }
  ]
}

Do not include markdown or code fences. Return only the JSON object.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Study Plan Generation Error:", error);
    throw error;
  }
};

module.exports = {
  generateTopics,
  askTutor,
  generateStudyPlan,
};