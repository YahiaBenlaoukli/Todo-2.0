import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import { buildRoadmapPrompt, buildRepairPrompt } from './promptBuilder';
import Ajv from 'ajv';
import schema from './roadmap.schema.json' assert {type: 'json'};

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const genAI = new GoogleGenAI({ apiKey: API_KEY });

async function validateRoadmap(roadmapData: any) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(roadmapData);
    if (!valid) {
        return { valid: false, errors: validate.errors };
    }
    return { valid: true, errors: [] };
}

function parseJSONSafely(text: string) {
    try {
        const cleaned = text.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return { success: true, data: parsed, raw: cleaned };
    } catch (e: any) {
        return { success: false, raw: text, error: e.message };
    }
}

export async function generateRoadmap(topic: string, difficulty: string, focus: string) {
    const prompt = buildRoadmapPrompt(topic, difficulty, focus);
    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let outputText = response.text || "";
        let parsedRes = parseJSONSafely(outputText);

        let validationResult;
        if (parsedRes.success) {
            validationResult = await validateRoadmap(parsedRes.data);
            if (validationResult.valid) {
                return { status: "success", data: parsedRes.data };
            }
        } else {
            validationResult = { valid: false, errors: [{ message: parsedRes.error }] };
        }

        let retries = 0;
        let lastOutput = parsedRes.raw;
        let lastErrors = validationResult.errors;

        while (retries < 2) {
            console.log(`Validation failed, attempting repair (Attempt ${retries + 1}/2)...`);
            const errorMessages = lastErrors?.map((e: any) => e.message || JSON.stringify(e)) || [];

            const repairResponse = await repairRoadmap(prompt, lastOutput, errorMessages);

            if (repairResponse.status === "success") {
                return repairResponse;
            } else {
                lastErrors = repairResponse.errors;
                lastOutput = repairResponse.rawOutput || "";
            }

            retries++;
        }

        return { status: "error", data: "Failed to generate a valid roadmap after multiple attempts.", errors: lastErrors };

    } catch (error) {
        console.log(error);
        return { status: "error", data: error };
    }
}

async function repairRoadmap(originalPrompt: string, badOutput: string, errors: string[]) {
    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: buildRepairPrompt(originalPrompt, badOutput, errors),
        });

        let repairText = response.text || "";
        let repairParsed = parseJSONSafely(repairText);

        if (repairParsed.success) {
            let repairValidation = await validateRoadmap(repairParsed.data);
            if (repairValidation.valid) {
                return { status: "success", data: JSON.stringify(repairParsed.data) };
            } else {
                return { status: "error", errors: repairValidation.errors, rawOutput: repairParsed.raw };
            }
        } else {
            return { status: "error", errors: [{ message: repairParsed.error }], rawOutput: repairParsed.raw };
        }
    } catch (error) {
        console.log(error);
        return { status: "error", errors: [{ message: "API Error during repair" }], rawOutput: badOutput };
    }
}
