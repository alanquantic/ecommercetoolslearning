import OpenAI from "openai";

import { buildAiPrompt, buildMockAiAnalysis, normalizeAiAnalysisResult } from "../lib/ai-analysis.js";

const DEFAULT_OPENAI_MODEL = "gpt-5.4";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = getBody(request);
    const context = body?.context;

    if (!context || typeof context !== "object") {
      response.status(400).json({ error: "Missing analysis context" });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      response.status(200).json({
        mode: "mock",
        model: "mock",
        analysis: buildMockAiAnalysis(context),
      });
      return;
    }

    const prompt = buildAiPrompt(context);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const preferredModel = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const modelCandidates = buildModelCandidates(preferredModel);

    for (const candidate of modelCandidates) {
      try {
        const aiResponse = await client.responses.create({
          model: candidate,
          input: prompt,
          max_output_tokens: 1800,
        });

        const parsed = safeParseJson(aiResponse.output_text);
        if (!parsed) {
          continue;
        }

        response.status(200).json({
          mode: "live",
          model: candidate,
          analysis: normalizeAiAnalysisResult(parsed, context),
        });
        return;
      } catch (error) {
        if (isInvalidModelError(error) && candidate !== modelCandidates[modelCandidates.length - 1]) {
          continue;
        }

        console.error("OpenAI analysis failed:", error);
        break;
      }
    }

    response.status(200).json({
      mode: "mock-fallback",
      model: "mock",
      analysis: buildMockAiAnalysis(context),
    });
  } catch (error) {
    console.error("Unexpected analyze handler failure:", error);
    response.status(500).json({ error: "Unexpected analysis failure" });
  }
}

function getBody(request) {
  if (typeof request.body === "object" && request.body !== null) {
    return request.body;
  }

  try {
    return JSON.parse(request.body || "{}");
  } catch (error) {
    return {};
  }
}

function buildModelCandidates(primaryModel) {
  const ordered = [primaryModel, DEFAULT_OPENAI_MODEL].filter(Boolean);
  return [...new Set(ordered)];
}

function safeParseJson(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function isInvalidModelError(error) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("model") && (message.includes("not found") || message.includes("does not exist"));
}
