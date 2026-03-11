import OpenAI from "openai";

import {
  buildMockProductWireframe,
  buildProductWireframePrompt,
  normalizeBrief,
  normalizeProductWireframeResult,
} from "../lib/product-wireframe.js";

const DEFAULT_OPENAI_MODEL = "gpt-5.4";
const WIREFRAME_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    wireframeTitle: { type: "string" },
    pageGoal: { type: "string" },
    decisionMessage: { type: "string" },
    categoryLabel: { type: "string" },
    audienceLabel: { type: "string" },
    productTitle: { type: "string" },
    shortHook: { type: "string" },
    pricePresentation: { type: "string" },
    benefits: { type: "array", items: { type: "string" } },
    photoNotes: { type: "array", items: { type: "string" } },
    variants: { type: "array", items: { type: "string" } },
    availability: { type: "string" },
    primaryCta: { type: "string" },
    secondaryCta: { type: "string" },
    trustSignals: { type: "array", items: { type: "string" } },
    attributes: { type: "array", items: { type: "string" } },
    useCases: { type: "array", items: { type: "string" } },
    proofPoints: { type: "array", items: { type: "string" } },
    faq: { type: "array", items: { type: "string" } },
    objections: { type: "array", items: { type: "string" } },
    mobileStickyBar: { type: "string" },
    conversionNotes: { type: "array", items: { type: "string" } },
  },
  required: [
    "wireframeTitle",
    "pageGoal",
    "decisionMessage",
    "categoryLabel",
    "audienceLabel",
    "productTitle",
    "shortHook",
    "pricePresentation",
    "benefits",
    "photoNotes",
    "variants",
    "availability",
    "primaryCta",
    "secondaryCta",
    "trustSignals",
    "attributes",
    "useCases",
    "proofPoints",
    "faq",
    "objections",
    "mobileStickyBar",
    "conversionNotes",
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
    const brief = normalizeBrief(body?.brief);

    if (!brief.productDescription) {
      response.status(400).json({ error: "Missing product description" });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      response.status(200).json({
        mode: "mock",
        model: "mock",
        result: buildMockProductWireframe(brief),
      });
      return;
    }

    const prompt = buildProductWireframePrompt(brief);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const preferredModel = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
    const modelCandidates = buildModelCandidates(preferredModel);

    for (const candidate of modelCandidates) {
      try {
        const aiResponse = await client.responses.create({
          model: candidate,
          input: prompt,
          max_output_tokens: 1800,
          text: {
            format: {
              type: "json_schema",
              name: "product_wireframe",
              strict: true,
              schema: WIREFRAME_SCHEMA,
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
          result: normalizeProductWireframeResult(parsed, brief),
        });
        return;
      } catch (error) {
        if (isInvalidModelError(error) && candidate !== modelCandidates[modelCandidates.length - 1]) {
          continue;
        }

        console.error("Product wireframe generation failed:", error);
        break;
      }
    }

    response.status(200).json({
      mode: "mock-fallback",
      model: "mock",
      result: buildMockProductWireframe(brief),
    });
  } catch (error) {
    console.error("Unexpected product wireframe failure:", error);
    response.status(500).json({ error: "Unexpected wireframe failure" });
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
