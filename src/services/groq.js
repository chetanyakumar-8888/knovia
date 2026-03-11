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

Return ONLY a pure JSON array with no extra text, no markdown, no backticks:
[
  {
    "question": "question text here",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": 0
  }
]

Rules:
- Generate exactly 10 questions
- correctAnswer must be the index (0, 1, 2, or 3) of the correct option
- All 4 options must be different and plausible
- Questions must be based strictly on NCERT Class ${className} ${subject} chapter "${chapter}"
- Return ONLY the JSON array, nothing else`
      }
    ],
    max_tokens: 2000
  });

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) return jsonMatch[0];
  return content;
}