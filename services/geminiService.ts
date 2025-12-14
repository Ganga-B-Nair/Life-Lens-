import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, OutputMode, FileData } from '../types';

const getSystemInstruction = () => `
You are LifeLens, a creative and intelligent multimodal assistant.
Your style is that of a thoughtful sketchbook artist and executive planner.
Your goal is to analyze inputs (text, images, PDFs, handwriting) and produce highly structured, professional, and useful outputs.

Your responsibilities:
1. SEE & DESCRIBE: First, strictly describe what you see in the image/document visually in a short, observational way (e.g., "I see a handwritten note on a yellow sticky pad..." or "This is a screenshot of a medical chart...").
2. DETECT CONTEXT: Analyze the input to determine if it falls into Health, Education, Business, Planning, or Accessibility.
3. ADAPT TONE: 
   - Health: Empathetic, precise, safety-focused.
   - Education: Encouraging, structured, clarity-focused.
   - Business: Professional, concise, action-oriented.
   - Planning: Organized, chronological.
   - Accessibility: Clear, descriptive, high readability.
4. FORMAT OUTPUT: Return the response in the requested format (Summary, Tasks, JSON, etc.).

When generating the 'content' field:
- Use Markdown for rich text (bolding, headers, lists, tables).
- If the user asks for JSON output mode, the 'content' string itself should still be a markdown code block containing the JSON.
- If the user asks for Table output mode, the 'content' string should be a Markdown table.
`;

export const analyzeContent = async (
  text: string, 
  file: FileData | null, 
  mode: OutputMode
): Promise<AnalysisResponse> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Define the prompt based on the selected mode
  let specificInstruction = "";
  switch (mode) {
    case 'summary':
      specificInstruction = "Create a clean, comprehensive summary. Capture key points and ignore fluff.";
      break;
    case 'tasks':
      specificInstruction = "Extract all actionable tasks. Prioritize them (High/Medium/Low). suggestions for execution.";
      break;
    case 'json':
      specificInstruction = "Convert the core information into a valid, nested JSON structure. Return the content as a markdown code block (```json ... ```).";
      break;
    case 'table':
      specificInstruction = "Organize the data into a Markdown table. Ensure columns are logical.";
      break;
    case 'study':
      specificInstruction = "Generate study aids. Include a brief summary followed by 5 key flashcards (Q&A) and a mini study schedule.";
      break;
    case 'action':
      specificInstruction = "Create a detailed action plan with suggested deadlines (relative to now) and dependencies.";
      break;
  }

  const userPrompt = `
    Analyze the attached content.
    Selected Mode: ${mode.toUpperCase()}.
    Instruction: ${specificInstruction}
  `;

  // Define the schema for the strict object response
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      visual_summary: {
        type: Type.STRING,
        description: "A short, direct description of what is visually present in the image or document."
      },
      context: {
        type: Type.STRING,
        enum: ['Health', 'Education', 'Business', 'Planning', 'Accessibility', 'General'],
        description: "The primary domain of the content."
      },
      reasoning: {
        type: Type.STRING,
        description: "Brief explanation of why this context was chosen and how the output was generated."
      },
      title: {
        type: Type.STRING,
        description: "A short, catchy title for the generated card."
      },
      content: {
        type: Type.STRING,
        description: "The main output in Markdown format."
      }
    },
    required: ["visual_summary", "context", "reasoning", "title", "content"]
  };

  const parts: any[] = [{ text: userPrompt }];
  
  // Add text input if present
  if (text.trim()) {
    parts.push({ text: `Additional User Notes: ${text}` });
  }

  // Add file input if present
  if (file) {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.base64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, 
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("No response from AI");

    const parsed = JSON.parse(textResponse) as AnalysisResponse;
    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};