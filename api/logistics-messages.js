import OpenAI from "openai";

import {
  buildLogisticsPrompt,
  buildMockLogisticsMessages,
  normalizeLogisticsBrief,
  normalizeLogisticsResult,
} from "../lib/logistics-messages.js";

const DEFAULT_OPENAI_MODEL = "gpt-5.4";
const LOGISTICS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mensaje_entrega: { type: "string" },
    confirmacion_pedido: { type: "string" },
    aviso_envio: { type: "string" },
    comunicacion_retraso: { type: "string" },
    protocolo_danado: { type: "string" },
    ejemplo_debil: { type: "string" },
    ejemplo_mejor: { type: "string" },
    tip_clave: { type: "string" },
  },
  required: [
    "mensaje_entrega",
    "confirmacion_pedido",
    "aviso_envio",
    "comunicacion_retraso",
    "protocolo_danado",
    "ejemplo_debil",
    "ejemplo_mejor",
    "tip_clave",
  ],
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = getBody(request);
    const brief = normalizeLogisticsBrief(body?.brief);

    if (!brief.productDescription) {
      response.status(400).json({ error: "Missing product description" });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      response.status(200).json({
        mode: "mock",
        model: "mock",
        result: buildMockLogisticsMessages(brief),
      });
      return;
    }

    const prompt = buildLogisticsPrompt(brief);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const preferredModel = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const modelCandidates = buildModelCandidates(preferredModel);

    for (const candidate of modelCandidates) {
      try {
        const aiResponse = await client.responses.create({
          model: candidate,
          input: prompt,
          max_output_tokens: 1900,
          text: {
            format: {
              type: "json_schema",
              name: "logistics_messages",
              strict: true,
              schema: LOGISTICS_SCHEMA,
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
          result: normalizeLogisticsResult(parsed, brief),
        });
        return;
      } catch (error) {
        if (isInvalidModelError(error) && candidate !== modelCandidates[modelCandidates.length - 1]) {
          continue;
        }

        console.error("Logistics messages generation failed:", error);
        break;
      }
    }

    response.status(200).json({
      mode: "mock-fallback",
      model: "mock",
      result: buildMockLogisticsMessages(brief),
    });
  } catch (error) {
    console.error("Unexpected logistics messages failure:", error);
    response.status(500).json({ error: "Unexpected logistics messages failure" });
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
