import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

async function makeCompletion(inputText) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: `You will receive a user prompt describing some interface or webpage they want. You must respond by providing a single, valid HTML document that implements the request. Follow these rules strictly:

1. **Output only one HTML file** (a single <html>...</html> block).
2. Do not include any extra text or explanations outside of the HTML.
3. You may include <style> and <script> sections inline, but do not reference external files (e.g., no external CSS or JS).
4. Your generated code must be a complete HTML page with <!DOCTYPE html>, <html>, <head>, and <body> tags.
5. Make sure the HTML is self-contained, so it can be placed directly into an iframe’s srcDoc attribute without modification.` },
                {
                    role: "user",
                    content: inputText,
                },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error in makeCompletion:", error);
        throw error;
    }
}

export default makeCompletion;