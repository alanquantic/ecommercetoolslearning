import { Resend } from "resend";

import { buildLogiCoachStudentEmail, buildLogiCoachTeacherEmail } from "../lib/email-templates.js";

const DEFAULT_FROM = "Diagnosticos CEOS Logica <diagnosticos@updates.ceoslogica.com>";
const DEFAULT_REPORT_RECIPIENTS = ["alan@ceosnm.com", "agavalos@up.edu.mx"];

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = getBody(request);
    const report = body?.report;

    if (!report?.studentEmail || !report?.plan || !report?.evaluation) {
      response.status(400).json({ error: "Missing report payload" });
      return;
    }

    const payload = {
      studentName: String(report.studentName || "").slice(0, 80),
      studentEmail: String(report.studentEmail || "").slice(0, 120),
      businessActivity: String(report.businessActivity || "").slice(0, 200),
      evaluation: report.evaluation,
      plan: report.plan,
      appBaseUrl: process.env.APP_BASE_URL || "",
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

    const studentEmail = buildLogiCoachStudentEmail(payload);
    const teacherEmail = buildLogiCoachTeacherEmail(payload);

    const [studentResult, teacherResult] = await Promise.all([
      resend.emails.send({
        from,
        to: [payload.studentEmail],
        subject: studentEmail.subject,
        html: studentEmail.html,
        text: studentEmail.text,
      }),
      resend.emails.send({
        from,
        to: recipients,
        replyTo: payload.studentEmail,
        subject: teacherEmail.subject,
        html: teacherEmail.html,
        text: teacherEmail.text,
      }),
    ]);

    response.status(200).json({
      mode: "live",
      delivered: true,
      studentEmailId: studentResult.data?.id || null,
      teacherEmailId: teacherResult.data?.id || null,
    });
  } catch (error) {
    console.error("Send logicoach plan failed:", error);
    response.status(500).json({ error: "Failed to send plan email" });
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
