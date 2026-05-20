const DEFAULT_BRIEF = {
  studentName: "",
  studentEmail: "",
  storeName: "",
  productDescription: "",
  productType: "no-definido",
  targetCustomer: "",
  tone: "cercano",
  salesChannel: "whatsapp",
  shippingType: "paqueteria",
  deliveryTime: "",
  returnPolicy: "",
  paymentMethods: "",
};

const MESSAGE_TYPES = [
  {
    key: "welcome",
    title: "Bienvenida",
    purpose: "Abrir la conversacion y ubicar al cliente.",
  },
  {
    key: "productInfo",
    title: "Informacion de producto",
    purpose: "Explicar que es, para quien sirve y que lo hace valioso.",
  },
  {
    key: "priceAvailability",
    title: "Precio y disponibilidad",
    purpose: "Responder precio, stock y siguiente paso sin rodeos.",
  },
  {
    key: "orderConfirmation",
    title: "Confirmacion de pedido",
    purpose: "Confirmar datos del pedido antes de pago o preparacion.",
  },
  {
    key: "paymentConfirmation",
    title: "Confirmacion de pago",
    purpose: "Dar tranquilidad y explicar que sigue.",
  },
  {
    key: "shippingDelivery",
    title: "Envio o entrega",
    purpose: "Avisar que el pedido salio o esta listo para entrega.",
  },
  {
    key: "delay",
    title: "Retraso",
    purpose: "Informar un problema sin sonar evasivo.",
  },
  {
    key: "delivered",
    title: "Entrega realizada",
    purpose: "Cerrar la entrega y abrir soporte si hace falta.",
  },
  {
    key: "postSale",
    title: "Seguimiento postventa",
    purpose: "Cuidar la experiencia y provocar recompra o feedback.",
  },
  {
    key: "returnExchange",
    title: "Cambio o devolucion",
    purpose: "Explicar pasos y condiciones con claridad.",
  },
];

const PRODUCT_TYPE_LABELS = {
  "no-definido": "Producto no definido",
  fisico: "Producto fisico",
  digital: "Producto digital",
  servicio: "Servicio",
  personalizado: "Producto personalizado",
  perecedero: "Producto perecedero",
};

const TONE_LABELS = {
  cercano: "Cercano y claro",
  premium: "Premium y cuidado",
  tecnico: "Tecnico y preciso",
  juvenil: "Juvenil y breve",
  institucional: "Institucional y formal",
};

const CHANNEL_LABELS = {
  whatsapp: "WhatsApp",
  instagram: "Instagram DM",
  email: "Email",
  marketplace: "Marketplace",
  tienda: "Tienda en linea",
};

const SHIPPING_LABELS = {
  paqueteria: "Envio por paqueteria",
  local: "Entrega local",
  pickup: "Recoleccion en punto",
  digital: "Entrega digital",
  personalizado: "Entrega personalizada",
};

export function createDefaultStoreMessagesState() {
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

export function normalizeStoreMessagesState(value) {
  const base = createDefaultStoreMessagesState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const brief = normalizeMessageBrief(value.brief);
  const status = ["idle", "loading", "ready", "error"].includes(value.status) ? value.status : "idle";

  return {
    ...base,
    brief,
    status,
    result:
      status === "ready" && value.result && typeof value.result === "object"
        ? normalizeStoreMessagesResult(value.result, brief)
        : null,
    prompt: String(value.prompt || ""),
    inputHash: String(value.inputHash || ""),
    delivery: normalizeMessagesDelivery(value.delivery),
  };
}

export function normalizeMessageBrief(value) {
  return {
    studentName: sanitizeInput(value?.studentName, 80),
    studentEmail: sanitizeEmail(value?.studentEmail),
    storeName: sanitizeInput(value?.storeName, 90),
    productDescription: sanitizeLongText(value?.productDescription, 500),
    productType: normalizeOption(value?.productType, PRODUCT_TYPE_LABELS, "no-definido"),
    targetCustomer: sanitizeLongText(value?.targetCustomer, 260),
    tone: normalizeOption(value?.tone, TONE_LABELS, "cercano"),
    salesChannel: normalizeOption(value?.salesChannel, CHANNEL_LABELS, "whatsapp"),
    shippingType: normalizeOption(value?.shippingType, SHIPPING_LABELS, "paqueteria"),
    deliveryTime: sanitizeInput(value?.deliveryTime, 120),
    returnPolicy: sanitizeLongText(value?.returnPolicy, 260),
    paymentMethods: sanitizeInput(value?.paymentMethods, 140),
  };
}

export function normalizeMessagesDelivery(value) {
  if (!value || typeof value !== "object") {
    return createDefaultStoreMessagesState().delivery;
  }

  const status = ["idle", "sending", "sent", "error"].includes(value.status) ? value.status : "idle";
  return {
    status,
    resultHash: String(value.resultHash || ""),
    message: String(value.message || ""),
  };
}

export function buildStoreMessagesInputHash(brief) {
  return JSON.stringify(normalizeMessageBrief(brief));
}

export function buildStoreMessagesResultHash(brief, result) {
  return JSON.stringify({
    inputHash: buildStoreMessagesInputHash(brief),
    headline: result?.headline || "",
    recipient: normalizeMessageBrief(brief).studentEmail || "",
  });
}

export function buildStoreMessagesPrompt(brief) {
  const payload = enrichBrief(normalizeMessageBrief(brief));

  return [
    "Eres un especialista senior en customer experience, ecommerce y comunicacion operativa en espanol.",
    "Debes generar mensajes listos para usar en una tienda en linea.",
    "Los mensajes preparados no deben sonar roboticos. Deben responder con claridad, rapidez y consistencia.",
    "Adapta el contenido a lo que vende la tienda, tipo de producto, canal, tipo de envio, tono y politicas.",
    "Usa placeholders entre llaves cuando falte un dato operativo, por ejemplo {numero_pedido}, {nombre_cliente}, {guia_envio}, {fecha_entrega}.",
    "No inventes promesas legales, garantias, descuentos ni tiempos exactos si no aparecen en el contexto.",
    "Devuelve JSON valido, sin markdown, con estas llaves exactas:",
    "headline, strategyNote, toneGuidelines, variables, messages.",
    "toneGuidelines y variables deben ser arreglos de strings.",
    "messages debe ser un arreglo de 10 objetos, uno por cada tipo solicitado, con llaves: key, title, purpose, subject, message, whenToUse, channelTip.",
    "Tipos obligatorios y orden exacto:",
    MESSAGE_TYPES.map((type) => `${type.key}: ${type.title}`).join(" | "),
    "Contexto:",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}

export async function requestStoreMessages(brief) {
  try {
    const response = await fetch("/api/store-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brief: normalizeMessageBrief(brief) }),
    });

    if (!response.ok) {
      throw new Error(`Store messages endpoint failed with status ${response.status}`);
    }

    const payload = await response.json();
    const normalized = normalizeStoreMessagesResult(payload.result, brief);
    normalized.mode = payload.mode || "live";
    normalized.model = payload.model || "";
    return normalized;
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 320));
    const mock = buildMockStoreMessages(brief);
    mock.mode = "mock";
    mock.model = "";
    return mock;
  }
}

export function buildMockStoreMessages(brief) {
  const normalizedBrief = normalizeMessageBrief(brief);
  const enriched = enrichBrief(normalizedBrief);
  const storeName = enriched.storeName || "tu tienda";
  const product = enriched.productDescription || "tu producto";
  const customer = enriched.targetCustomer || "tu cliente";
  const delivery = buildDeliveryPhrase(enriched);
  const payment = enriched.paymentMethods || "{metodo_pago}";
  const returnPolicy = enriched.returnPolicy || "revisamos cambios o devoluciones segun el estado del pedido y la politica de la tienda";

  const messageByKey = {
    welcome: {
      subject: `Bienvenida a ${storeName}`,
      message: `Hola {nombre_cliente}, gracias por escribir a ${storeName}. Te ayudo con gusto a elegir la mejor opcion de ${product}. Si me compartes que necesitas, te confirmo precio, disponibilidad y siguiente paso.`,
      whenToUse: "Cuando una persona escribe por primera vez o pide informacion general.",
      channelTip: buildChannelTip(enriched, "Mantenerlo breve y abrir una pregunta clara."),
    },
    productInfo: {
      subject: `Informacion sobre ${product}`,
      message: `${product} esta pensado para ${customer}. Lo mas importante es: {beneficio_1}, {beneficio_2} y {beneficio_3}. Si buscas {necesidad_cliente}, esta puede ser una buena opcion porque {diferencial}.`,
      whenToUse: "Cuando el cliente pregunta que incluye, para que sirve o por que le conviene.",
      channelTip: "Usa bullets si el canal lo permite. En WhatsApp conviene separar en frases cortas.",
    },
    priceAvailability: {
      subject: `Precio y disponibilidad`,
      message: `Claro. El precio es {precio} y por ahora tenemos {disponibilidad}. Podemos preparar tu pedido con {variante_o_presentacion}. Para avanzar solo necesito {dato_para_pedido}.`,
      whenToUse: "Cuando preguntan cuanto cuesta o si hay existencia.",
      channelTip: "No escondas el precio. Cierra con una accion concreta.",
    },
    orderConfirmation: {
      subject: `Confirmacion de pedido {numero_pedido}`,
      message: `Tu pedido quedaria asi: {producto}, {variante}, cantidad {cantidad}, total {total}. Datos de entrega: {datos_entrega}. Si todo esta correcto, te comparto el siguiente paso para pago.`,
      whenToUse: "Antes de cobrar o antes de preparar un pedido manual.",
      channelTip: "Repite datos criticos para evitar errores de envio, talla, variante o cantidad.",
    },
    paymentConfirmation: {
      subject: `Pago confirmado`,
      message: `Gracias, {nombre_cliente}. Ya recibimos tu pago por {total} mediante ${payment}. Ahora vamos a preparar tu pedido {numero_pedido}. Te avisamos en cuanto tengamos la informacion de ${delivery}.`,
      whenToUse: "Cuando el pago fue validado.",
      channelTip: "Da tranquilidad y explica que sigue sin sonar frio.",
    },
    shippingDelivery: {
      subject: `Tu pedido va en camino`,
      message: `Tu pedido {numero_pedido} ya esta en proceso de ${delivery}. Guia o referencia: {guia_envio}. Tiempo estimado: {tiempo_entrega}. Te recomendamos revisar tus datos de contacto por si la paqueteria necesita comunicarse.`,
      whenToUse: "Cuando el pedido sale, se agenda o queda listo para entregar.",
      channelTip: "Incluye guia, fecha o punto de entrega siempre que exista.",
    },
    delay: {
      subject: `Actualizacion sobre tu pedido`,
      message: `Hola {nombre_cliente}, queremos avisarte con transparencia que tu pedido {numero_pedido} presenta un retraso por {motivo_retraso}. Nueva estimacion: {nueva_fecha}. Estamos dando seguimiento y te mantendremos informado.`,
      whenToUse: "Cuando hay retraso de preparacion, pago, inventario o paqueteria.",
      channelTip: "Reconoce el problema, da fecha estimada y evita culpar al cliente.",
    },
    delivered: {
      subject: `Pedido entregado`,
      message: `Tu pedido {numero_pedido} aparece como entregado. Esperamos que disfrutes ${product}. Si algo no llego como esperabas, respondemos este mensaje para ayudarte.`,
      whenToUse: "Despues de confirmarse la entrega.",
      channelTip: "Abre soporte de manera sencilla y evita cerrar la conversacion de golpe.",
    },
    postSale: {
      subject: `Como te fue con tu compra`,
      message: `Hola {nombre_cliente}, queremos saber como te fue con ${product}. Tu opinion nos ayuda a mejorar y tambien podemos orientarte si tienes dudas de uso, cuidado o recompra.`,
      whenToUse: "Uno o varios dias despues de la entrega, segun el tipo de producto.",
      channelTip: "No pidas demasiado. Una pregunta clara funciona mejor.",
    },
    returnExchange: {
      subject: `Cambio o devolucion`,
      message: `Claro, te ayudo a revisar tu solicitud. Para cambio o devolucion necesitamos: {numero_pedido}, motivo, fotos si aplica y estado del producto. Nuestra politica: ${returnPolicy}. Con esos datos te indicamos el siguiente paso.`,
      whenToUse: "Cuando el cliente solicita cambio, devolucion o aclaracion.",
      channelTip: "Explica requisitos sin sonar defensivo. La claridad reduce friccion.",
    },
  };

  return {
    headline: `Mensajes listos para ${storeName}`,
    strategyNote:
      "Usa estos textos como base editable. La clave es responder rapido, confirmar datos criticos y mantener el mismo tono en todos los momentos del pedido.",
    toneGuidelines: buildToneGuidelines(enriched),
    variables: [
      "{nombre_cliente}",
      "{numero_pedido}",
      "{producto}",
      "{precio}",
      "{disponibilidad}",
      "{guia_envio}",
      "{tiempo_entrega}",
      "{motivo_retraso}",
      "{nueva_fecha}",
    ],
    messages: MESSAGE_TYPES.map((type) => ({
      key: type.key,
      title: type.title,
      purpose: type.purpose,
      ...messageByKey[type.key],
    })),
  };
}

export function normalizeStoreMessagesResult(candidate, brief) {
  const fallback = buildMockStoreMessages(brief);
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  const normalizedMessages = normalizeMessages(candidate.messages, fallback.messages);

  return {
    headline: normalizeString(candidate.headline, fallback.headline, 180),
    strategyNote: normalizeString(candidate.strategyNote, fallback.strategyNote, 520),
    toneGuidelines: normalizeStringArray(candidate.toneGuidelines, fallback.toneGuidelines, 5, 180),
    variables: normalizeStringArray(candidate.variables, fallback.variables, 14, 80),
    messages: normalizedMessages,
  };
}

export function getMessageTypeCatalog() {
  return MESSAGE_TYPES.map((type) => ({ ...type }));
}

export function translateProductType(value) {
  return PRODUCT_TYPE_LABELS[normalizeOption(value, PRODUCT_TYPE_LABELS, "no-definido")];
}

export function translateTone(value) {
  return TONE_LABELS[normalizeOption(value, TONE_LABELS, "cercano")];
}

export function translateSalesChannel(value) {
  return CHANNEL_LABELS[normalizeOption(value, CHANNEL_LABELS, "whatsapp")];
}

export function translateShippingType(value) {
  return SHIPPING_LABELS[normalizeOption(value, SHIPPING_LABELS, "paqueteria")];
}

function normalizeMessages(candidateMessages, fallbackMessages) {
  const source = Array.isArray(candidateMessages) ? candidateMessages : [];

  return MESSAGE_TYPES.map((type) => {
    const fallback = fallbackMessages.find((message) => message.key === type.key);
    const candidate = source.find((message) => message?.key === type.key || normalize(message?.title) === normalize(type.title));

    return {
      key: type.key,
      title: normalizeString(candidate?.title, fallback.title, 80),
      purpose: normalizeString(candidate?.purpose, fallback.purpose, 180),
      subject: normalizeString(candidate?.subject, fallback.subject, 140),
      message: normalizeString(candidate?.message, fallback.message, 900),
      whenToUse: normalizeString(candidate?.whenToUse, fallback.whenToUse, 220),
      channelTip: normalizeString(candidate?.channelTip, fallback.channelTip, 220),
    };
  });
}

function enrichBrief(brief) {
  return {
    ...brief,
    productTypeLabel: translateProductType(brief.productType),
    toneLabel: translateTone(brief.tone),
    salesChannelLabel: translateSalesChannel(brief.salesChannel),
    shippingTypeLabel: translateShippingType(brief.shippingType),
  };
}

function buildDeliveryPhrase(brief) {
  switch (brief.shippingType) {
    case "local":
      return "entrega local";
    case "pickup":
      return "recoleccion";
    case "digital":
      return "entrega digital";
    case "personalizado":
      return "entrega personalizada";
    default:
      return "envio";
  }
}

function buildChannelTip(brief, fallback) {
  if (brief.salesChannel === "whatsapp" || brief.salesChannel === "instagram") {
    return "Usa frases cortas y una sola pregunta de cierre.";
  }
  if (brief.salesChannel === "email") {
    return "Incluye asunto claro y deja los datos importantes en el primer parrafo.";
  }
  return fallback;
}

function buildToneGuidelines(brief) {
  const base = [
    `Tono sugerido: ${brief.toneLabel}.`,
    `Canal principal: ${brief.salesChannelLabel}.`,
    "Confirmar datos criticos antes de pago, envio o cambios.",
  ];

  if (brief.shippingType === "digital") {
    base.push("Explicar acceso, archivo, liga o activacion con pasos simples.");
  } else {
    base.push("Separar claramente preparacion, envio, entrega y seguimiento.");
  }

  return base;
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

function normalizeStringArray(value, fallback, maxItems, maxLength) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => sanitizeLongText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);

  return items.length > 0 ? items : fallback;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
