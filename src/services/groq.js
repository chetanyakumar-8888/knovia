import Groq from "groq-sdk";

export async function generateSummary(className, subject, chapter) {
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are an expert CBSE teacher.
        
Summarize Class ${className} ${subject} chapter "${chapter}" for a CBSE student.

Format exactly like this:

SUMMARY:
Write a clear 150 word summary here

KEY POINTS:
- Point 1
- Point 2
- Point 3
- Point 4
- Point 5

IMPORTANT TERMS:
- Term 1: definition
- Term 2: definition
- Term 3: definition

EXAM TIPS:
- Tip 1
- Tip 2
- Tip 3`
      }
    ],
    max_tokens: 1000
  });

  return response.choices[0].message.content;
}

export async function generateQuiz(className, subject, chapter) {
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Generate a quiz for Class ${className} ${subject} chapter "${chapter}".

Return ONLY valid JSON like this:
{
  "mcqs": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correct": 0
    }
  ],
  "shortAnswers": [
    {
      "question": "question text",
      "answer": "answer text"
    }
  ]
}

Generate exactly 5 MCQs and 3 short answers.`
      }
    ],
    max_tokens: 1000
  });

  const content = response.choices[0].message.content;
const jsonMatch = content.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  return jsonMatch[0];
}
return content;
}