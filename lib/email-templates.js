const BRAND = {
  ink: "#152033",
  muted: "#5b667a",
  surface: "#fffdf8",
  border: "#e8dfd2",
  brand: "#0f766e",
  brandSoft: "#d7f3ee",
  accent: "#f28c28",
  accentSoft: "#ffe9d2",
};

export function buildStudentEmail(payload) {
  const title = payload.profile.label;
  const subject = `Tu resumen de diagnostico e-commerce: ${title}`;
  const intro = payload.aiAnalysis?.summary || payload.profile.description;

  return {
    subject,
    html: wrapEmail({
      eyebrow: "Diagnostico listo",
      title,
      subtitle: payload.profile.subtitle,
      recipientName: payload.studentName || payload.studentEmail,
      intro,
      badges: [
        `Afinidad: ${payload.baseAnalysis.confidence}%`,
        `Proyecto: ${payload.projectName || "Sin nombre"}`,
      ],
      sections: [
        {
          title: "Lo mas importante",
          body: payload.aiAnalysis?.headline || payload.profile.quote,
        },
        {
          title: "Por que esta ruta te conviene",
          list: payload.aiAnalysis?.whyThisFits || payload.profile.strengths,
        },
        {
          title: "Primer experimento sugerido",
          body: payload.aiAnalysis?.firstExperiment || payload.profile.actionPlan[0],
        },
        {
          title: "Que medir primero",
          list: payload.aiAnalysis?.metrics || [],
        },
      ],
      footerNote: `Puedes volver a revisar tu resultado en ${payload.appBaseUrl}.`,
    }),
    text: buildTextEmail({
      subject,
      intro,
      sections: [
        { title: "Ruta recomendada", body: `${payload.profile.label} - ${payload.profile.subtitle}` },
        { title: "Por que encaja", list: payload.aiAnalysis?.whyThisFits || payload.profile.strengths },
        { title: "Primer experimento", body: payload.aiAnalysis?.firstExperiment || payload.profile.actionPlan[0] },
        { title: "Que medir", list: payload.aiAnalysis?.metrics || [] },
      ],
      footerNote: `Resultado generado desde ${payload.appBaseUrl}`,
    }),
  };
}

export function buildTeacherEmail(payload) {
  const studentReference = payload.studentName || payload.studentEmail;
  const subject = `Nuevo diagnostico: ${studentReference} | ${payload.profile.label}`;
  const intro = `Se registro un nuevo diagnostico para ${studentReference}.`;

  return {
    subject,
    html: wrapEmail({
      eyebrow: "Nuevo lead academico",
      title: payload.profile.label,
      subtitle: payload.profile.subtitle,
      recipientName: "Profesor",
      intro,
      badges: [
        `Alumno: ${studentReference}`,
        `Correo: ${payload.studentEmail}`,
        `Proyecto: ${payload.projectName || "Sin nombre"}`,
      ],
      sections: [
        {
          title: "Contexto capturado",
          list: buildBusinessContextList(payload),
        },
        {
          title: "Lectura personalizada",
          body: payload.aiAnalysis?.summary || payload.profile.description,
        },
        {
          title: "Riesgos y seguimiento",
          list: payload.aiAnalysis?.whyNotNow || payload.profile.risks,
        },
        {
          title: "Siguiente accion sugerida",
          body: payload.aiAnalysis?.firstExperiment || payload.profile.actionPlan[0],
        },
      ],
      footerNote: `Sitio: ${payload.appBaseUrl}`,
    }),
    text: buildTextEmail({
      subject,
      intro,
      sections: [
        { title: "Alumno", body: `${studentReference} <${payload.studentEmail}>` },
        { title: "Ruta", body: `${payload.profile.label} - ${payload.profile.subtitle}` },
        { title: "Contexto", list: buildBusinessContextList(payload) },
        { title: "Lectura", body: payload.aiAnalysis?.summary || payload.profile.description },
        { title: "Siguiente accion", body: payload.aiAnalysis?.firstExperiment || payload.profile.actionPlan[0] },
      ],
      footerNote: `Sitio: ${payload.appBaseUrl}`,
    }),
  };
}

export function buildStoreMessagesStudentEmail(payload) {
  const brief = payload.brief || {};
  const result = payload.result || {};
  const storeName = brief.storeName || "tu tienda";
  const subject = `Tus mensajes para tienda en linea: ${storeName}`;
  const intro =
    result.strategyNote ||
    "Aqui tienes un paquete de mensajes base para responder con claridad, rapidez y consistencia en tu tienda.";

  return {
    subject,
    html: wrapEmail({
      eyebrow: "Mensajes listos",
      title: result.headline || `Mensajes para ${storeName}`,
      subtitle: "10 momentos clave de comunicacion para tienda en linea",
      recipientName: brief.studentName || brief.studentEmail,
      intro,
      badges: buildStoreMessageBadges(payload),
      sections: [
        {
          title: "Guia de tono",
          list: result.toneGuidelines || [],
        },
        {
          title: "Variables a completar",
          list: result.variables || [],
        },
        {
          title: "Mensajes generados",
          list: buildStoreMessageList(result.messages),
        },
      ],
      footerNote: `Puedes volver a usar la herramienta en ${payload.appBaseUrl}.`,
    }),
    text: buildTextEmail({
      subject,
      intro,
      sections: [
        { title: "Contexto", list: buildStoreContextList(payload) },
        { title: "Guia de tono", list: result.toneGuidelines || [] },
        { title: "Variables", list: result.variables || [] },
        { title: "Mensajes", list: buildStoreMessageList(result.messages) },
      ],
      footerNote: `Resultado generado desde ${payload.appBaseUrl}`,
    }),
  };
}

export function buildStoreMessagesTeacherEmail(payload) {
  const brief = payload.brief || {};
  const result = payload.result || {};
  const studentReference = brief.studentName || brief.studentEmail;
  const storeName = brief.storeName || "Sin nombre";
  const subject = `Nuevo paquete de mensajes: ${studentReference} | ${storeName}`;
  const intro = `Se genero un paquete de mensajes operativos para ${studentReference}.`;

  return {
    subject,
    html: wrapEmail({
      eyebrow: "Nuevo ejercicio academico",
      title: result.headline || "Mensajes para tienda en linea",
      subtitle: storeName,
      recipientName: "Profesor",
      intro,
      badges: [
        `Alumno: ${studentReference}`,
        `Correo: ${brief.studentEmail}`,
        `Tienda: ${storeName}`,
      ],
      sections: [
        {
          title: "Contexto capturado",
          list: buildStoreContextList(payload),
        },
        {
          title: "Lectura de comunicacion",
          body: result.strategyNote || "Sin nota estrategica.",
        },
        {
          title: "Mensajes generados",
          list: buildStoreMessageList(result.messages),
        },
      ],
      footerNote: `Sitio: ${payload.appBaseUrl}`,
    }),
    text: buildTextEmail({
      subject,
      intro,
      sections: [
        { title: "Alumno", body: `${studentReference} <${brief.studentEmail}>` },
        { title: "Contexto", list: buildStoreContextList(payload) },
        { title: "Mensajes", list: buildStoreMessageList(result.messages) },
      ],
      footerNote: `Sitio: ${payload.appBaseUrl}`,
    }),
  };
}

function wrapEmail({ eyebrow, title, subtitle, recipientName, intro, badges, sections, footerNote }) {
  const badgesHtml = badges
    .filter(Boolean)
    .map(
      (badge) =>
        `<span style="display:inline-flex;margin:0 8px 8px 0;padding:8px 12px;border-radius:999px;background:${BRAND.brandSoft};color:${BRAND.brand};font-size:13px;font-weight:700;">${escapeHtml(
          badge
        )}</span>`
    )
    .join("");

  const sectionsHtml = sections
    .map((section) => {
      const bodyHtml = section.body
        ? `<p style="margin:0;color:${BRAND.muted};font-size:15px;line-height:1.7;">${escapeHtml(section.body)}</p>`
        : "";

      const listHtml = Array.isArray(section.list) && section.list.length > 0
        ? `<ul style="margin:0;padding-left:20px;color:${BRAND.muted};font-size:15px;line-height:1.7;">${section.list
            .map((item) => `<li style="margin:0 0 8px;">${escapeHtml(item)}</li>`)
            .join("")}</ul>`
        : "";

      return `
        <section style="padding:22px 24px;border:1px solid ${BRAND.border};border-radius:22px;background:#ffffff;">
          <h3 style="margin:0 0 12px;color:${BRAND.ink};font-size:15px;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(
            section.title
          )}</h3>
          ${bodyHtml}
          ${listHtml}
        </section>
      `;
    })
    .join("");

  return `
    <div style="margin:0;padding:32px 16px;background:${BRAND.surface};font-family:Arial,sans-serif;color:${BRAND.ink};">
      <div style="max-width:720px;margin:0 auto;">
        <div style="padding:32px;border-radius:28px;background:linear-gradient(135deg,#f6fffd 0%,#fff8ef 100%);border:1px solid ${BRAND.border};">
          <p style="margin:0 0 12px;color:${BRAND.brand};font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">${escapeHtml(
            eyebrow
          )}</p>
          <h1 style="margin:0 0 10px;font-size:34px;line-height:1.05;color:${BRAND.ink};">${escapeHtml(title)}</h1>
          <p style="margin:0 0 20px;color:${BRAND.muted};font-size:18px;line-height:1.6;">${escapeHtml(subtitle)}</p>
          <p style="margin:0 0 20px;color:${BRAND.ink};font-size:16px;line-height:1.7;">Hola ${escapeHtml(
            recipientName
          )},</p>
          <p style="margin:0 0 20px;color:${BRAND.muted};font-size:16px;line-height:1.8;">${escapeHtml(intro)}</p>
          <div style="margin:0 0 12px;">${badgesHtml}</div>
        </div>

        <div style="display:grid;gap:16px;margin-top:18px;">
          ${sectionsHtml}
        </div>

        <p style="margin:18px 0 0;color:${BRAND.muted};font-size:13px;line-height:1.6;">${escapeHtml(footerNote)}</p>
      </div>
    </div>
  `;
}

function buildTextEmail({ subject, intro, sections, footerNote }) {
  const chunks = [subject, "", intro];

  sections.forEach((section) => {
    chunks.push("", section.title);
    if (section.body) {
      chunks.push(section.body);
    }
    if (section.list) {
      chunks.push(...section.list.map((item, index) => `${index + 1}. ${item}`));
    }
  });

  chunks.push("", footerNote);
  return chunks.join("\n");
}

function buildBusinessContextList(payload) {
  return [
    payload.productDescription ? `Que vende: ${payload.productDescription}` : "",
    payload.targetCustomer ? `Cliente ideal: ${payload.targetCustomer}` : "",
    payload.businessModelLabel ? `Modelo: ${payload.businessModelLabel}` : "",
    payload.averageTicket ? `Ticket: ${payload.averageTicket}` : "",
    payload.salesChannels ? `Canales actuales: ${payload.salesChannels}` : "",
    payload.primaryMarket ? `Mercado principal: ${payload.primaryMarket}` : "",
  ].filter(Boolean);
}

function buildStoreContextList(payload) {
  const brief = payload.brief || {};
  return [
    brief.productDescription ? `Que vende: ${brief.productDescription}` : "",
    payload.productTypeLabel ? `Tipo de producto: ${payload.productTypeLabel}` : "",
    brief.targetCustomer ? `Cliente ideal: ${brief.targetCustomer}` : "",
    payload.toneLabel ? `Tono: ${payload.toneLabel}` : "",
    payload.salesChannelLabel ? `Canal principal: ${payload.salesChannelLabel}` : "",
    payload.shippingTypeLabel ? `Tipo de envio o entrega: ${payload.shippingTypeLabel}` : "",
    brief.deliveryTime ? `Tiempo estimado: ${brief.deliveryTime}` : "",
    brief.paymentMethods ? `Metodos de pago: ${brief.paymentMethods}` : "",
    brief.returnPolicy ? `Politica de cambios/devoluciones: ${brief.returnPolicy}` : "",
  ].filter(Boolean);
}

function buildStoreMessageBadges(payload) {
  const brief = payload.brief || {};
  return [
    `Tienda: ${brief.storeName || "Sin nombre"}`,
    payload.salesChannelLabel ? `Canal: ${payload.salesChannelLabel}` : "",
    payload.shippingTypeLabel ? `Entrega: ${payload.shippingTypeLabel}` : "",
  ];
}

function buildStoreMessageList(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.map((message) => {
    const subject = message.subject ? ` Asunto: ${message.subject}.` : "";
    return `${message.title}: ${message.message}${subject}`;
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
