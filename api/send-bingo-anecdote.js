import { Resend } from "resend";

import { buildBingoAnecdoteEmail } from "../lib/email-templates.js";

const DEFAULT_FROM = "Diagnosticos CEOS Logica <diagnosticos@updates.ceoslogica.com>";
const DEFAULT_REPORT_RECIPIENTS = ["alan@ceosnm.com", "agavalos@up.edu.mx"];
const MAX_ANECDOTE_LENGTH = 800;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = getBody(request);
    const payload = body?.payload;

    if (!payload || typeof payload !== "object") {
      response.status(400).json({ error: "Missing anecdote payload" });
      return;
    }

    const anecdote = String(payload.anecdote || "").trim();
    if (!anecdote) {
      response.status(400).json({ error: "Empty anecdote" });
      return;
    }

    const sanitizedPayload = {
      anecdote: anecdote.slice(0, MAX_ANECDOTE_LENGTH),
      errorLabel: String(payload.errorLabel || "").slice(0, 200),
      tableNumber: sanitizeShort(payload.tableNumber),
      errorsMarked: sanitizeNumber(payload.errorsMarked, 0, 16),
      linesCompleted: sanitizeNumber(payload.linesCompleted, 0, 10),
      dangerLevel: String(payload.dangerLevel || "").slice(0, 80),
      appBaseUrl: process.env.APP_BASE_URL || "",
      timestamp: new Date().toLocaleString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (!process.env.RESEND_API_KEY) {
      response.status(200).json({
        mode: "mock",
        delivered: false,
        message: "RESEND_API_KEY is not configured",
      });
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM || DEFAULT_FROM;
    const recipients = parseRecipients(process.env.REPORT_RECIPIENTS);
    const email = buildBingoAnecdoteEmail(sanitizedPayload);

    const result = await resend.emails.send({
      from,
      to: recipients,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    response.status(200).json({
      mode: "live",
      delivered: true,
      teacherEmailId: result.data?.id || null,
    });
  } catch (error) {
    console.error("Send bingo anecdote failed:", error);
    response.status(500).json({ error: "Failed to send anecdote" });
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

function parseRecipients(value) {
  const list = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return list.length > 0 ? list : DEFAULT_REPORT_RECIPIENTS;
}

function sanitizeNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return null;
  }
  return Math.min(Math.max(Math.round(number), min), max);
}

function sanitizeShort(value) {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value).slice(0, 24);
}
