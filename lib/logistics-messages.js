const DEFAULT_BRIEF = {
  studentName: "",
  studentEmail: "",
  businessName: "",
  productDescription: "",
  businessType: "producto_fisico",
  coverage: "nacional",
  prepTime: "24 a 48 horas",
  shippingCost: "",
  carriers: "",
  damagePolicy: "",
  currentErrors: [],
};

const ERROR_CATALOG = [
  { id: "sin_fecha", text: 'Decir "te llega pronto" sin fecha concreta' },
  { id: "sin_guia", text: "No enviar guia o comprobante" },
  { id: "sin_aviso", text: "No avisar retrasos" },
  { id: "sin_envio", text: "No aclarar quien paga el envio" },
  { id: "sin_confirmar", text: "No confirmar direccion y telefono" },
  { id: "promesa_imposible", text: "Prometer entregas imposibles" },
  { id: "sin_proceso_danos", text: "No tener proceso para productos danados" },
];

const BUSINESS_TYPE_LABELS = {
  producto_fisico: "Producto fisico",
  digital: "Producto digital",
  servicio: "Servicio",
};

const COVERAGE_LABELS = {
  local: "Local (misma ciudad)",
  nacional: "Nacional (Mexico)",
  internacional: "Internacional",
};

const PREP_TIME_OPTIONS = ["Mismo dia", "24 a 48 horas", "3 a 5 dias habiles", "1 a 2 semanas"];

export function createDefaultLogisticsState() {
  return {
    brief: { ...DEFAULT_BRIEF },
    status: "idle",
    result: null,
    prompt: "",
    inputHash: "",
    delivery: {
      status: "idle",
      resultHash: "",
      message: "",
    },
  };
}

export function normalizeLogisticsState(value) {
  const base = createDefaultLogisticsState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const brief = normalizeLogisticsBrief(value.brief);
  const status = ["idle", "loading", "ready", "error"].includes(value.status) ? value.status : "idle";

  return {
    ...base,
    brief,
    status,
    result:
      status === "ready" && value.result && typeof value.result === "object"
        ? normalizeLogisticsResult(value.result, brief)
        : null,
    prompt: String(value.prompt || ""),
    inputHash: String(value.inputHash || ""),
    delivery: normalizeLogisticsDelivery(value.delivery),
  };
}

export function normalizeLogisticsBrief(value) {
  const rawErrors = Array.isArray(value?.currentErrors) ? value.currentErrors : [];
  const validErrorIds = new Set(ERROR_CATALOG.map((error) => error.id));

  return {
    studentName: sanitizeInput(value?.studentName, 80),
    studentEmail: sanitizeEmail(value?.studentEmail),
    businessName: sanitizeInput(value?.businessName, 90),
    productDescription: sanitizeLongText(value?.productDescription, 520),
    businessType: normalizeOption(value?.businessType, BUSINESS_TYPE_LABELS, "producto_fisico"),
    coverage: normalizeOption(value?.coverage, COVERAGE_LABELS, "nacional"),
    prepTime: PREP_TIME_OPTIONS.includes(value?.prepTime) ? value.prepTime : "24 a 48 horas",
    shippingCost: sanitizeInput(value?.shippingCost, 120),
    carriers: sanitizeInput(value?.carriers, 160),
    damagePolicy: sanitizeLongText(value?.damagePolicy, 260),
    currentErrors: rawErrors.filter((id) => validErrorIds.has(id)),
  };
}

export function normalizeLogisticsDelivery(value) {
  if (!value || typeof value !== "object") {
    return createDefaultLogisticsState().delivery;
  }

  const status = ["idle", "sending", "sent", "error"].includes(value.status) ? value.status : "idle";
  return {
    status,
    resultHash: String(value.resultHash || ""),
    message: String(value.message || ""),
  };
}

export function buildLogisticsInputHash(brief) {
  return JSON.stringify(normalizeLogisticsBrief(brief));
}

export function buildLogisticsResultHash(brief, result) {
  return JSON.stringify({
    inputHash: buildLogisticsInputHash(brief),
    tip: result?.tip_clave || "",
    recipient: normalizeLogisticsBrief(brief).studentEmail || "",
  });
}

export function buildLogisticsPrompt(brief) {
  const normalized = normalizeLogisticsBrief(brief);
  const payload = {
    ...normalized,
    businessTypeLabel: translateBusinessType(normalized.businessType),
    coverageLabel: translateCoverage(normalized.coverage),
    currentErrorsText: getSelectedErrorLabels(normalized.currentErrors),
  };

  return [
    "Eres un experto en comunicacion logistica de comercio electronico para PyMEs mexicanas.",
    "Genera mensajes claros y profesionales en espanol de Mexico que puedan copiarse en WhatsApp, email o redes sociales.",
    'Principio central: "No prometas rapido; promete claro". La claridad genera mas confianza que una promesa exagerada.',
    "Cada mensaje debe incluir informacion concreta: rangos de dias, costos, metodos, pasos, responsables o placeholders cuando falten datos.",
    'Evita frases vagas como "te llega pronto". Usa "tu", no "usted".',
    "Adapta todo al tipo de negocio. Si es digital, habla de acceso, links o activacion. Si es servicio, habla de agenda, confirmacion o entregables. Si es local, habla de entrega en mano o repartidor. Si es nacional, puedes mencionar paqueterias mexicanas cuando aplique.",
    "No inventes garantias, descuentos ni tiempos exactos si no aparecen en el contexto.",
    "Devuelve EXCLUSIVAMENTE JSON valido, sin markdown, con estas llaves exactas:",
    "mensaje_entrega, confirmacion_pedido, aviso_envio, comunicacion_retraso, protocolo_danado, ejemplo_debil, ejemplo_mejor, tip_clave.",
    "Contexto:",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}

export async function requestLogisticsMessages(brief) {
  try {
    const response = await fetch("/api/logistics-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brief: normalizeLogisticsBrief(brief) }),
    });

    if (!response.ok) {
      throw new Error(`Logistics endpoint failed with status ${response.status}`);
    }

    const payload = await response.json();
    return normalizeLogisticsResult(payload.result, brief);
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 320));
    return buildMockLogisticsMessages(brief);
  }
}

export function buildMockLogisticsMessages(brief) {
  const normalized = normalizeLogisticsBrief(brief);
  const product = normalized.productDescription || "tu producto o servicio";
  const businessName = normalized.businessName || "tu tienda";
  const prep = normalized.prepTime;
  const cost = normalized.shippingCost || "{costo_envio}";
  const carriers = normalized.carriers || defaultCarrierText(normalized);
  const damagePolicy = normalized.damagePolicy || "revisaremos el caso y te daremos una solucion en un plazo definido";
  const deliveryWord = buildDeliveryWord(normalized);

  if (normalized.businessType === "digital") {
    return normalizeLogisticsResult(
      {
        mensaje_entrega: `Para ${product}, el acceso se entrega despues de confirmar el pago. La activacion toma ${prep} y te enviaremos la liga o instrucciones por el canal registrado. Si hubiera algun retraso, te avisaremos con una nueva hora estimada y alternativa de soporte.`,
        confirmacion_pedido: `Gracias por tu compra en ${businessName}. Tu pedido queda confirmado: ${product}. El siguiente paso es validar el pago y preparar tu acceso en un rango de ${prep}.`,
        aviso_envio: `Tu acceso ya fue enviado a {correo_cliente}. Revisa tambien spam o promociones. Si no lo encuentras en {tiempo_revision}, respondeme este mensaje y lo reenviamos.`,
        comunicacion_retraso: `Queremos avisarte con claridad que el acceso de tu pedido {numero_pedido} se retraso por {motivo_retraso}. Nueva estimacion: {nueva_hora}. Si prefieres, podemos darte soporte manual mientras se completa.`,
        protocolo_danado: `Lamento que el acceso no este funcionando como esperabas. Enviame captura del error, correo usado en la compra y numero de pedido. Revisamos el caso y te damos solucion en {plazo_solucion}.`,
        ejemplo_debil: "Si, te llega pronto.",
        ejemplo_mejor: `Tu acceso se activa despues de validar el pago. El proceso toma ${prep} y te enviaremos la liga por correo con instrucciones claras.`,
        tip_clave: "En productos digitales, la confianza depende de explicar acceso, soporte y tiempos de activacion antes de que el cliente tenga que preguntar.",
      },
      normalized
    );
  }

  if (normalized.businessType === "servicio") {
    return normalizeLogisticsResult(
      {
        mensaje_entrega: `Para ${product}, primero confirmamos el pedido y despues agendamos el siguiente paso. La preparacion toma ${prep}. Si hay algun ajuste de agenda, te avisaremos con una nueva opcion de fecha y el canal para confirmar.`,
        confirmacion_pedido: `Tu solicitud queda confirmada con ${businessName}: ${product}. En las proximas ${prep} te compartiremos confirmacion de agenda, requisitos y siguiente paso.`,
        aviso_envio: `Tu servicio ya quedo programado para {fecha_servicio}. Te compartimos los detalles: {lugar_o_link}, horario {hora} y contacto de seguimiento {contacto}.`,
        comunicacion_retraso: `Queremos avisarte que hubo un ajuste en la agenda de tu servicio por {motivo_retraso}. Nueva propuesta: {nueva_fecha}. Si no te funciona, te compartimos otra alternativa.`,
        protocolo_danado: `Lamento que la experiencia no haya sido la esperada. Cuentame que ocurrio y comparte evidencia si aplica. Revisaremos el caso y te propondremos una solucion en {plazo_solucion}.`,
        ejemplo_debil: "Si, lo vemos pronto.",
        ejemplo_mejor: `Tu servicio queda en preparacion. En ${prep} te confirmamos agenda, requisitos y el canal de seguimiento para evitar dudas.`,
        tip_clave: "En servicios, la logistica es agenda y expectativas: confirma fecha, responsable, canal y requisitos desde el primer mensaje.",
      },
      normalized
    );
  }

  return normalizeLogisticsResult(
    {
      mensaje_entrega: `Para ${product}, el tiempo de preparacion es de ${prep}. El envio se realiza por ${carriers} y el costo estimado es ${cost}. Si la paqueteria presenta retraso, te avisaremos con nueva fecha estimada y seguimiento.`,
      confirmacion_pedido: `Gracias por tu pedido en ${businessName}. Confirmamos: ${product}, direccion {direccion_cliente} y telefono {telefono_cliente}. Prepararemos tu pedido en ${prep} y despues te compartiremos guia o comprobante.`,
      aviso_envio: `Tu pedido {numero_pedido} ya salio por ${carriers}. Guia de rastreo: {guia_envio}. El rango estimado de entrega es {rango_entrega}; te avisaremos si cambia.`,
      comunicacion_retraso: `Queremos avisarte con transparencia que tu pedido {numero_pedido} presenta un retraso por {motivo_retraso}. Nueva fecha estimada: {nueva_fecha}. Podemos mantener el envio o revisar una alternativa contigo.`,
      protocolo_danado: `Lamento que tu pedido haya llegado con problema. Enviame fotos del empaque, producto, guia y numero de pedido. Politica actual: ${damagePolicy}. Te damos seguimiento en {plazo_solucion}.`,
      ejemplo_debil: "Si, te llega pronto.",
      ejemplo_mejor: `Tu pedido se prepara en ${prep}. Despues sale por ${carriers}; te enviaremos guia y rango estimado de entrega para que puedas rastrearlo.`,
      tip_clave: "Antes de vender, deja claro preparacion, costo de envio, paqueteria y proceso si algo llega danado.",
    },
    normalized
  );
}

export function normalizeLogisticsResult(candidate, brief) {
  const fallback = buildRawFallback(brief);
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  return {
    mensaje_entrega: normalizeString(candidate.mensaje_entrega, fallback.mensaje_entrega, 900),
    confirmacion_pedido: normalizeString(candidate.confirmacion_pedido, fallback.confirmacion_pedido, 760),
    aviso_envio: normalizeString(candidate.aviso_envio, fallback.aviso_envio, 680),
    comunicacion_retraso: normalizeString(candidate.comunicacion_retraso, fallback.comunicacion_retraso, 760),
    protocolo_danado: normalizeString(candidate.protocolo_danado, fallback.protocolo_danado, 760),
    ejemplo_debil: normalizeString(candidate.ejemplo_debil, fallback.ejemplo_debil, 180),
    ejemplo_mejor: normalizeString(candidate.ejemplo_mejor, fallback.ejemplo_mejor, 460),
    tip_clave: normalizeString(candidate.tip_clave, fallback.tip_clave, 260),
  };
}

export function getLogisticsErrorCatalog() {
  return ERROR_CATALOG.map((item) => ({ ...item }));
}

export function getLogisticsPrepOptions() {
  return [...PREP_TIME_OPTIONS];
}

export function translateBusinessType(value) {
  return BUSINESS_TYPE_LABELS[normalizeOption(value, BUSINESS_TYPE_LABELS, "producto_fisico")];
}

export function translateCoverage(value) {
  return COVERAGE_LABELS[normalizeOption(value, COVERAGE_LABELS, "nacional")];
}

export function getSelectedErrorLabels(errorIds) {
  const selected = new Set(Array.isArray(errorIds) ? errorIds : []);
  return ERROR_CATALOG.filter((error) => selected.has(error.id)).map((error) => error.text);
}

function buildRawFallback(brief) {
  const normalized = normalizeLogisticsBrief(brief);
  const product = normalized.productDescription || "tu producto o servicio";
  return {
    mensaje_entrega: `Para ${product}, primero confirmamos el pedido y despues te compartimos el siguiente paso con fecha estimada. Si ocurre un retraso, te avisaremos antes de que tengas que preguntar.`,
    confirmacion_pedido: `Tu pedido queda confirmado. Preparacion estimada: ${normalized.prepTime}. Siguiente paso: validar datos y compartir confirmacion de entrega.`,
    aviso_envio: `Tu pedido ya esta en proceso de entrega. Referencia: {guia_o_link}. Tiempo estimado: {rango_entrega}.`,
    comunicacion_retraso: `Queremos avisarte con claridad que hubo un retraso por {motivo_retraso}. Nueva estimacion: {nueva_fecha}. Te mantenemos informado.`,
    protocolo_danado: `Lamento el problema. Comparte evidencia, numero de pedido y datos de contacto. Revisamos el caso y te damos una solucion en {plazo_solucion}.`,
    ejemplo_debil: "Si, te llega pronto.",
    ejemplo_mejor: `Tu pedido se prepara en ${normalized.prepTime}. Despues te compartimos referencia y rango concreto de entrega.`,
    tip_clave: "La promesa logistica debe decir que pasa, cuando pasa y que hara la tienda si algo cambia.",
  };
}

function defaultCarrierText(brief) {
  if (brief.coverage === "local") {
    return "repartidor local o entrega acordada";
  }
  if (brief.coverage === "internacional") {
    return "paqueteria internacional con rastreo";
  }
  return "Estafeta, DHL, FedEx, Paquetexpress o 99 Minutos";
}

function buildDeliveryWord(brief) {
  if (brief.businessType === "digital") {
    return "acceso";
  }
  if (brief.businessType === "servicio") {
    return "agenda";
  }
  return "entrega";
}

function normalizeOption(value, catalog, fallback) {
  return Object.prototype.hasOwnProperty.call(catalog, value) ? value : fallback;
}

function sanitizeEmail(value) {
  return sanitizeInput(value, 140).toLowerCase();
}

function sanitizeInput(value, maxLength = 120) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeLongText(value, maxLength = 320) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeString(value, fallback, maxLength) {
  const cleaned = sanitizeLongText(value, maxLength);
  return cleaned || fallback;
}
