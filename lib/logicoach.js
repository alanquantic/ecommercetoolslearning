const STEPS = [
  {
    id: "step-1",
    title: "Canales y registro",
    description: "Donde nacen tus pedidos y como los anotas.",
    questions: [
      {
        id: "q1",
        label: "Por donde recibo pedidos hoy?",
        helper: "Anota el canal principal y al menos uno alterno.",
        placeholder: "Ej. Instagram para venta inicial + WhatsApp para confirmar.",
        tags: ["WhatsApp", "Instagram", "Shopify", "Punto fisico"],
      },
      {
        id: "q2",
        label: "Donde los registro?",
        helper: "Especifica el sistema, hoja o plataforma concreta.",
        placeholder: "Ej. Hoja de Google Sheets con columna por estado del pedido.",
        tags: ["Excel / Google Sheets", "Libreta manual", "ERP / sistema", "Plataforma e-commerce"],
      },
      {
        id: "q3",
        label: "Que datos pido siempre antes de aceptar un pedido?",
        helper: "Piensa en lo minimo necesario para preparar y enviar.",
        placeholder: "Ej. Nombre completo, telefono, direccion con CP, comprobante de pago.",
        tags: ["Nombre + telefono", "Direccion + CP", "Comprobante de pago", "Talla o variante"],
      },
    ],
  },
  {
    id: "step-2",
    title: "Transacciones y stock",
    description: "Como confirmas dinero y controlas piezas.",
    questions: [
      {
        id: "q4",
        label: "Como confirmo el pago antes de procesar?",
        helper: "Describe el proceso, no solo el medio.",
        placeholder: "Ej. Reviso transferencia en la app del banco antes de armar el pedido.",
        tags: ["Transferencia bancaria", "Pasarela online", "Pago contra entrega", "Tarjeta en sitio"],
      },
      {
        id: "q5",
        label: "Como controlo el inventario de mis productos?",
        helper: "Si no controlas, dilo con honestidad.",
        placeholder: "Ej. Llevo un Kardex en Excel actualizado cada cierre de dia.",
        tags: ["Control visual / a ojo", "Kardex en Excel", "Software de inventario", "No controlo"],
      },
      {
        id: "q6",
        label: "Quien prepara el pedido fisicamente?",
        helper: "Nombra la persona o el rol y donde sucede.",
        placeholder: "Ej. Yo mismo desde casa por la tarde, mi hermana ayuda en picos.",
        tags: ["Yo mismo", "Equipo dedicado", "Maquila / fulfillment", "Familia / apoyo"],
      },
    ],
  },
  {
    id: "step-3",
    title: "Empaque y logistica de envio",
    description: "Como cierras la caja y como sale del piso.",
    questions: [
      {
        id: "q7",
        label: "Que checklist o revision uso antes de cerrar el paquete?",
        helper: "Describe pasos concretos, no buenas intenciones.",
        placeholder: "Ej. Reviso talla, fotografio el contenido, sello con cinta firmada.",
        tags: ["Foto del contenido", "Doble revision de talla", "Hoja de empaque", "Sin checklist"],
      },
      {
        id: "q8",
        label: "Cual es mi opcion principal de envio o paqueteria?",
        helper: "Una sola, la que usas la mayoria del tiempo.",
        placeholder: "Ej. 99 Minutos para zona metropolitana.",
        tags: ["FedEx", "DHL", "Estafeta", "99 Minutos", "Uber Direct", "Mensajeria local"],
      },
      {
        id: "q9",
        label: "Cual es mi opcion alternativa si la primera falla?",
        helper: "Debe ser distinta a la principal y estar lista.",
        placeholder: "Ej. Estafeta como plan B con cuenta ya abierta.",
        tags: ["FedEx", "DHL", "Estafeta", "99 Minutos", "Uber Direct", "Mensajeria local"],
      },
    ],
  },
  {
    id: "step-4",
    title: "Promesas y control",
    description: "Lo que el cliente espera y lo que mides cada semana.",
    questions: [
      {
        id: "q10",
        label: "Cual es el tiempo de preparacion que prometo al cliente?",
        helper: "En horas o dias habiles, sin vaguedades.",
        placeholder: "Ej. 24 horas habiles desde la confirmacion del pago.",
        tags: ["Mismo dia", "24 horas habiles", "48-72 horas", "3-5 dias habiles"],
      },
      {
        id: "q11",
        label: "Que hare si hay retraso o problema con la paqueteria?",
        helper: "Define el protocolo: a quien avisas, en cuanto tiempo, con que tono.",
        placeholder: "Ej. Aviso al cliente antes de las 24h con guia nueva y un detalle de cortesia.",
        tags: ["Aviso al cliente", "Reembolso parcial", "Detalle de cortesia", "Reenvio con plan B"],
      },
      {
        id: "q12",
        label: "Que indicador o metrica logistica medire cada semana?",
        helper: "Un KPI claro, no un wishlist.",
        placeholder: "Ej. % de pedidos entregados a tiempo y numero de quejas por logistica.",
        tags: ["% a tiempo", "Tasa de incidencias", "Devoluciones por logistica", "NPS post-entrega"],
      },
    ],
  },
];

const QUESTION_INDEX = buildQuestionIndex();

const QUESTION_CONCEPTS = {
  q1: {
    expected: 2,
    concepts: [
      { id: "channel", any: ["whatsapp", "instagram", "facebook", "tiktok", "shopify", "amazon", "mercado libre", "mercadolibre", "tienda online", "tienda en linea", "ecommerce", "fisica", "fisico", "presencial", "wordpress", "woocommerce", "tiktok shop", "marketplace"] },
      { id: "second-channel", any: ["alterno", "ademas", "tambien", "y ", " y", "complemento", "secundario", "respaldo", "segundo"] },
    ],
  },
  q2: {
    expected: 2,
    concepts: [
      { id: "system", any: ["excel", "sheets", "google sheets", "hoja", "erp", "sistema", "crm", "shopify", "woocommerce", "tilopay", "tiendanube", "kardex", "plataforma", "software", "app"] },
      { id: "process", any: ["actualizo", "registro", "anoto", "cada", "diario", "semanal", "automatico", "automatizado", "sincroniza", "exporta"] },
    ],
  },
  q3: {
    expected: 3,
    concepts: [
      { id: "name", any: ["nombre", "cliente"] },
      { id: "contact", any: ["telefono", "celular", "correo", "email", "whatsapp"] },
      { id: "address", any: ["direccion", "domicilio", "cp", "codigo postal", "postal", "calle"] },
      { id: "payment", any: ["pago", "comprobante", "transferencia", "factura"] },
    ],
  },
  q4: {
    expected: 2,
    concepts: [
      { id: "channel", any: ["transferencia", "spei", "tarjeta", "pasarela", "stripe", "mercado pago", "mercadopago", "paypal", "clip", "kueski", "efectivo", "oxxo", "contra entrega", "deposito"] },
      { id: "verification", any: ["reviso", "verifico", "confirmo", "compruebo", "valido", "espero", "notificacion", "comprobante", "app del banco", "estado de cuenta", "extracto"] },
    ],
  },
  q5: {
    expected: 2,
    concepts: [
      { id: "tool", any: ["excel", "kardex", "sheets", "software", "sistema", "erp", "plantilla", "inventario", "shopify"] },
      { id: "frequency", any: ["diario", "semanal", "cada", "actualizo", "registro", "reviso", "cierre", "corte", "minimo"] },
    ],
    negativePenalty: ["a ojo", "memoria", "no tengo", "no controlo", "no llevo"],
  },
  q6: {
    expected: 2,
    concepts: [
      { id: "person", any: ["yo", "equipo", "asistente", "empleado", "familia", "mi pareja", "hermano", "hermana", "socio", "maquila", "fulfillment", "tercero"] },
      { id: "place", any: ["casa", "bodega", "oficina", "local", "almacen", "garage", "tienda"] },
    ],
  },
  q7: {
    expected: 2,
    concepts: [
      { id: "verify", any: ["reviso", "verifico", "valido", "checklist", "lista", "foto", "fotografio", "etiqueta", "doble", "tallas", "talla", "variante", "etiquetar", "rotular"] },
      { id: "secure", any: ["sello", "cinta", "burbuja", "relleno", "proteccion", "rotulo", "etiqueta", "guia"] },
    ],
    negativePenalty: ["sin checklist", "no reviso", "no checo", "no tengo proceso"],
  },
  q8: {
    expected: 1,
    concepts: [
      { id: "carrier", any: ["fedex", "dhl", "estafeta", "99 minutos", "99minutos", "uber", "cadete", "mensajeria", "redpack", "paquetexpress", "ups", "correos de mexico", "ampm", "ivoy"] },
    ],
  },
  q9: {
    expected: 1,
    concepts: [
      { id: "carrier", any: ["fedex", "dhl", "estafeta", "99 minutos", "99minutos", "uber", "cadete", "mensajeria", "redpack", "paquetexpress", "ups", "correos de mexico", "ampm", "ivoy"] },
    ],
  },
  q10: {
    expected: 1,
    concepts: [
      { id: "time", any: ["hora", "horas", "dia", "dias", "habil", "habiles", "24", "48", "72", "mismo dia", "siguiente"] },
    ],
    negativePenalty: ["rapido", "pronto", "lo antes posible", "asap"],
  },
  q11: {
    expected: 2,
    concepts: [
      { id: "communicate", any: ["aviso", "avisar", "informar", "notificar", "contactar", "comunicar", "mensaje", "llamar", "escribir"] },
      { id: "action", any: ["reembolso", "reenvio", "reenviar", "cambio", "devolucion", "cortesia", "compensacion", "descuento", "plan b", "alterna", "alternativa", "guia nueva"] },
    ],
  },
  q12: {
    expected: 1,
    concepts: [
      { id: "metric", any: ["%", "porcentaje", "tasa", "numero", "cantidad", "nps", "tiempo de", "tiempo promedio", "indice", "kpi", "ratio"] },
    ],
    negativePenalty: ["ninguno", "no se", "todavia no"],
  },
};

const CHANNEL_MANUAL_KEYWORDS = ["whatsapp", "instagram", "libreta"];
const INVENTORY_EMPIRIC_KEYWORDS = [
  "a ojo",
  "memoria",
  "no tengo",
  "no controlo",
  "no llevo",
  "no llevo control",
];
const CARRIER_KEYWORDS = [
  "fedex",
  "dhl",
  "estafeta",
  "99 minutos",
  "99minutos",
  "uber direct",
  "uber",
  "mensajeria local",
  "mensajeria",
  "cadete",
];

export function getLogiCoachSteps() {
  return STEPS.map((step) => ({
    ...step,
    questions: step.questions.map((q) => ({ ...q, tags: [...q.tags] })),
  }));
}

export function getLogiCoachQuestions() {
  return STEPS.flatMap((step) => step.questions.map((q) => ({ ...q, stepId: step.id })));
}

export function getQuestionById(id) {
  const entry = QUESTION_INDEX[id];
  return entry ? { ...entry.question, stepId: entry.stepId } : null;
}

export function createDefaultLogiCoachState() {
  const answers = {};
  for (const step of STEPS) {
    for (const question of step.questions) {
      answers[question.id] = "";
    }
  }
  return {
    stage: "wizard",
    currentStep: 0,
    answers,
    evaluation: null,
  };
}

export function normalizeLogiCoachState(value) {
  const base = createDefaultLogiCoachState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const answers = { ...base.answers };
  if (value.answers && typeof value.answers === "object") {
    for (const id of Object.keys(answers)) {
      const candidate = value.answers[id];
      if (typeof candidate === "string") {
        answers[id] = candidate.slice(0, 800);
      }
    }
  }

  const currentStep = sanitizeStep(value.currentStep);
  const stage = value.stage === "result" ? "result" : "wizard";
  const evaluation = stage === "result" ? sanitizeEvaluation(value.evaluation, answers) : null;

  return {
    stage,
    currentStep,
    answers,
    evaluation,
  };
}

export function getTotalSteps() {
  return STEPS.length;
}

export function getTotalQuestions() {
  return STEPS.reduce((total, step) => total + step.questions.length, 0);
}

export function getAnsweredCount(answers) {
  return getLogiCoachQuestions().filter((question) => isMeaningful(answers[question.id])).length;
}

export function getStepProgress(answers, stepIndex) {
  const step = STEPS[stepIndex];
  if (!step) {
    return 0;
  }
  const answered = step.questions.filter((q) => isMeaningful(answers[q.id])).length;
  return Math.round((answered / step.questions.length) * 100);
}

export function getMissingQuestionsInStep(answers, stepIndex) {
  const step = STEPS[stepIndex];
  if (!step) {
    return [];
  }
  return step.questions.filter((q) => !isMeaningful(answers[q.id])).map((q) => q.id);
}

export function evaluateLogiCoach(answers) {
  const score = computeScore(answers);
  const level = getLevel(score);
  const alerts = detectAlerts(answers);

  return {
    score,
    level,
    alerts,
    timestamp: new Date().toISOString(),
  };
}

export function buildLogiCoachMarkdown(state) {
  const answers = state.answers || {};
  const evaluation = state.evaluation || evaluateLogiCoach(answers);

  const lines = [
    "# Plan logistico personal — LogiCoach",
    "",
    `**Score de madurez:** ${evaluation.score} / 100`,
    `**Nivel del plan:** ${evaluation.level.label}`,
    `**Resumen:** ${evaluation.level.detail}`,
    "",
  ];

  if (evaluation.alerts.length > 0) {
    lines.push("## Alertas de la consultoria");
    lines.push("");
    for (const alert of evaluation.alerts) {
      lines.push(`- ${alert.icon} **${alert.title}.** ${alert.detail}`);
    }
    lines.push("");
  }

  lines.push("## Plan completo (12 preguntas)");
  lines.push("");

  for (const step of STEPS) {
    lines.push(`### ${step.title}`);
    lines.push("");
    for (const question of step.questions) {
      const answer = (answers[question.id] || "").trim();
      lines.push(`**${question.label}**`);
      lines.push("");
      lines.push(answer || "_Sin respuesta._");
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push("Generado con LogiCoach (Ruta E-commerce).");
  lines.push(`Fecha: ${formatTimestamp(evaluation.timestamp)}`);

  return lines.join("\n");
}

function buildQuestionIndex() {
  const index = {};
  for (const step of STEPS) {
    for (const question of step.questions) {
      index[question.id] = { question, stepId: step.id };
    }
  }
  return index;
}

function isMeaningful(value) {
  if (typeof value !== "string") {
    return false;
  }
  return value.trim().length >= 3;
}

function computeScore(answers) {
  const questions = getLogiCoachQuestions();
  const perQuestion = 100 / questions.length;
  let total = 0;

  for (const question of questions) {
    total += scoreQuestion(question.id, answers[question.id]) * perQuestion;
  }

  return Math.round(Math.min(100, Math.max(0, total)));
}

export function scoreQuestion(questionId, rawAnswer) {
  const raw = String(rawAnswer || "").trim();
  if (raw.length === 0) {
    return 0;
  }
  const normalized = normalize(raw);
  const config = QUESTION_CONCEPTS[questionId];
  if (!config) {
    return raw.length < 20 ? 0.45 : raw.length < 60 ? 0.75 : 1;
  }

  const conceptsMatched = config.concepts.filter((concept) =>
    concept.any.some((keyword) => normalized.includes(keyword)),
  ).length;
  const conceptCoverage = config.expected > 0 ? Math.min(1, conceptsMatched / config.expected) : 1;

  let lengthFactor = 0.2;
  if (raw.length >= 60) {
    lengthFactor = 1;
  } else if (raw.length >= 30) {
    lengthFactor = 0.7;
  } else if (raw.length >= 12) {
    lengthFactor = 0.45;
  }

  // 70% concept coverage + 30% reasonable length.
  let score = conceptCoverage * 0.7 + lengthFactor * 0.3;

  if (Array.isArray(config.negativePenalty)) {
    const triggers = config.negativePenalty.filter((penalty) => normalized.includes(penalty));
    if (triggers.length > 0) {
      score = Math.max(0, score - 0.45);
    }
  }

  return Math.min(1, Math.max(0, score));
}

function getLevel(score) {
  if (score >= 70) {
    return {
      key: "optimized",
      label: "Optimizado",
      detail: "Tu plan tiene profundidad operativa: respuestas concretas y control real del proceso.",
    };
  }
  if (score >= 40) {
    return {
      key: "developing",
      label: "En desarrollo",
      detail: "Hay bases claras pero quedan huecos. Reforza las preguntas con detalle de proceso, no solo herramienta.",
    };
  }
  return {
    key: "initial",
    label: "Inicial",
    detail: "Tu plan necesita aterrizar procesos. Hay respuestas vacias o muy genericas que te van a costar caras al escalar.",
  };
}

function detectAlerts(answers) {
  const alerts = [];

  const q1 = normalize(answers.q1);
  const q2 = normalize(answers.q2);
  const channelHit = CHANNEL_MANUAL_KEYWORDS.find((keyword) => q1.includes(keyword) || q2.includes(keyword));
  if (channelHit) {
    alerts.push({
      id: "manual-channels",
      icon: "⚠️",
      tone: "warning",
      title: "Riesgo de cuello de botella",
      detail:
        "Operar por canales manuales causara perdida de pedidos al escalar. Planea una transicion a un e-commerce formal o concentrador de pedidos.",
      trigger: channelHit,
    });
  }

  const q5 = normalize(answers.q5);
  const inventoryHit = INVENTORY_EMPIRIC_KEYWORDS.find((keyword) => q5.includes(keyword));
  if (inventoryHit) {
    alerts.push({
      id: "empiric-inventory",
      icon: "🚨",
      tone: "danger",
      title: "Peligro de quiebre de stock",
      detail:
        "Vender sin inventario real destruye la confianza del cliente. Es urgente implementar minimo una plantilla con stock de seguridad.",
      trigger: inventoryHit,
    });
  }

  const q8 = normalize(answers.q8);
  const q9 = normalize(answers.q9);
  const carrier8 = detectCarrier(q8);
  const carrier9 = detectCarrier(q9);
  const sameCarrier = carrier8 && carrier9 && carrier8 === carrier9;
  if (!q9 || q9 === q8 || sameCarrier) {
    alerts.push({
      id: "single-carrier",
      icon: "⚠️",
      tone: "warning",
      title: "Vulnerabilidad en distribucion",
      detail:
        "Depender de una sola paqueteria te expone a paros logisticos y retrasos fuera de tu control. Registra un plan de respaldo distinto al principal.",
      trigger: q8 || "(sin opcion alternativa)",
    });
  }

  return alerts;
}

function detectCarrier(value) {
  if (!value) {
    return "";
  }
  for (const keyword of CARRIER_KEYWORDS) {
    if (value.includes(keyword)) {
      return keyword.replace(/\s+/g, "");
    }
  }
  return "";
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function sanitizeStep(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number >= STEPS.length) {
    return 0;
  }
  return number;
}

function sanitizeEvaluation(value, answers) {
  if (!value || typeof value !== "object") {
    return evaluateLogiCoach(answers);
  }
  const score = Number(value.score);
  if (!Number.isFinite(score)) {
    return evaluateLogiCoach(answers);
  }
  return {
    score: Math.round(Math.min(100, Math.max(0, score))),
    level: getLevel(score),
    alerts: Array.isArray(value.alerts) ? value.alerts.filter(Boolean) : [],
    timestamp: typeof value.timestamp === "string" ? value.timestamp : new Date().toISOString(),
  };
}

function formatTimestamp(value) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "";
  }
}
