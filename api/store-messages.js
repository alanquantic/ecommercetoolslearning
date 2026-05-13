import OpenAI from "openai";

import {
  buildMockStoreMessages,
  buildStoreMessagesPrompt,
  normalizeMessageBrief,
  normalizeStoreMessagesResult,
} from "../lib/store-messages.js";

const DEFAULT_OPENAI_MODEL = "gpt-5.4";
const STORE_MESSAGES_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    strategyNote: { type: "string" },
    toneGuidelines: { type: "array", items: { type: "string" } },
    variables: { type: "array", items: { type: "string" } },
    messages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: { type: "string" },
          title: { type: "string" },
          purpose: { type: "string" },
          subject: { type: "string" },
          message: { type: "string" },
          whenToUse: { type: "string" },
          channelTip: { type: "string" },
        },
        required: ["key", "title", "purpose", "subject", "message", "whenToUse", "channelTip"],
      },
    },
  },
  required: ["headline", "strategyNote", "toneGuidelines", "variables", "messages"],
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = getBody(request);
    const brief = normalizeMessageBrief(body?.brief);

    if (!brief.productDescription) {
      response.status(400).json({ error: "Missing product description" });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      response.status(200).json({
        mode: "mock",
        model: "mock",
        result: buildMockStoreMessages(brief),
      });
      return;
    }

    const prompt = buildStoreMessagesPrompt(brief);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const preferredModel = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const modelCandidates = buildModelCandidates(preferredModel);

    for (const candidate of modelCandidates) {
      try {
        const aiResponse = await client.responses.create({
          model: candidate,
          input: prompt,
          max_output_tokens: 2600,
          text: {
            format: {
              type: "json_schema",
              name: "store_messages",
              strict: true,
              schema: STORE_MESSAGES_SCHEMA,
            },
          },
        });

        const parsed = safeParseJson(aiResponse.output_text);
        if (!parsed) {
          continue;
        }

        response.status(200).json({
          mode: "live",
          model: candidate,
          result: normalizeStoreMessagesResult(parsed, brief),
        });
        return;
      } catch (error) {
        if (isInvalidModelError(error) && candidate !== modelCandidates[modelCandidates.length - 1]) {
          continue;
        }

        console.error("Store messages generation failed:", error);
        break;
      }
    }

    response.status(200).json({
      mode: "mock-fallback",
      model: "mock",
      result: buildMockStoreMessages(brief),
    });
  } catch (error) {
    console.error("Unexpected store messages failure:", error);
    response.status(500).json({ error: "Unexpected store messages failure" });
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
