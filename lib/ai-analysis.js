const BUSINESS_MODEL_LABELS = {
  "no-definido": "Sin definir",
  "marca-propia": "Marca propia",
  reventa: "Reventa",
  mixto: "Mixto",
};

const ROUTE_LABELS = {
  propia: "tienda propia",
  marketplace: "marketplace",
  hibrido: "modelo híbrido",
};

const BRAND_KEYWORDS = [
  "moda",
  "ropa",
  "skincare",
  "cosmetica",
  "cosmética",
  "belleza",
  "joyeria",
  "joyería",
  "decoracion",
  "decoración",
  "arte",
  "velas",
  "artesanal",
  "premium",
  "marca",
  "diseño",
  "diseno",
  "estilo",
];

const COMMODITY_KEYWORDS = [
  "refaccion",
  "refacción",
  "cable",
  "repuesto",
  "generico",
  "genérico",
  "autoparte",
  "herramienta",
  "ferreteria",
  "ferretería",
  "accesorios para celular",
  "electrica",
  "eléctrica",
  "componentes",
  "consumibles",
  "papeleria",
  "papelería",
];

const B2B_KEYWORDS = [
  "empresa",
  "negocio",
  "mayoreo",
  "distribuidor",
  "distribución",
  "restaurante",
  "oficina",
  "taller",
  "corporativo",
  "negocios",
];

const SOCIAL_CHANNEL_KEYWORDS = [
  "instagram",
  "tiktok",
  "facebook",
  "whatsapp",
  "telegram",
  "contenido",
  "comunidad",
];

const MARKETPLACE_CHANNEL_KEYWORDS = [
  "amazon",
  "mercado libre",
  "marketplace",
  "linio",
  "etsy",
  "shopify",
  "tiendanube",
];

export function createDefaultAiState() {
  return {
    status: "idle",
    analysis: null,
    prompt: "",
    inputHash: "",
  };
}

export function normalizeAiState(value) {
  const base = createDefaultAiState();
  if (!value || typeof value !== "object") {
    return base;
  }

  if (value.status !== "ready") {
    return base;
  }

  return {
    ...base,
    ...value,
  };
}

export function buildAiInputHash(context) {
  return JSON.stringify({
    intake: context.intake,
    answers: context.answers,
    recommendation: context.baseAnalysis.recommendation,
    scores: context.baseAnalysis.scores,
  });
}

export function buildAiPrompt(context) {
  const payload = {
    intake: {
      ...context.intake,
      businessModelLabel: BUSINESS_MODEL_LABELS[context.intake.businessModel] || "Sin definir",
    },
    answers: context.answers,
    baseAnalysis: context.baseAnalysis,
    routeLabel: ROUTE_LABELS[context.baseAnalysis.recommendation],
  };

  return [
    "Eres un consultor senior de e-commerce para emprendedores hispanohablantes.",
    "Debes enriquecer un diagnostico estructurado, no reemplazarlo.",
    "Usa la ruta base como ancla y solo matizala con el contexto libre del negocio.",
    "Responde con enfoque practico, directo y orientado a accion.",
    "Devuelve un JSON valido, sin markdown, con estas llaves exactas:",
    "headline, summary, whyThisFits, whyNotNow, firstExperiment, metrics, sprint, operationalDifficulty, investmentLevel, contextSignals.",
    "Las llaves whyThisFits, whyNotNow, metrics, sprint y contextSignals deben ser arreglos de strings.",
    "Contexto recibido:",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}

export async function requestAiAnalysis(context) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context }),
    });

    if (!response.ok) {
      throw new Error(`AI endpoint failed with status ${response.status}`);
    }

    const payload = await response.json();
    const normalized = normalizeAiAnalysisResult(payload.analysis, context);
    normalized.mode = payload.mode || "live";
    normalized.model = payload.model || "";
    return normalized;
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const mock = buildMockAiAnalysis(context);
    mock.mode = "mock";
    mock.model = "";
    return mock;
  }
}

export function buildMockAiAnalysis(context) {
  const signals = inferSignals(context);
  const route = context.baseAnalysis.recommendation;
  const alternatives = getAlternativeRoutes(context.baseAnalysis.scores, route);

  return {
    headline: buildHeadline(route, signals),
    summary: buildSummary(route, signals, context),
    whyThisFits: buildWhyThisFits(route, signals, context),
    whyNotNow: alternatives.map((type) => buildWhyNotNow(type, route, signals)),
    firstExperiment: buildFirstExperiment(route, signals, context),
    metrics: buildMetrics(route, signals),
    sprint: buildSprint(route, signals),
    operationalDifficulty: buildOperationalDifficulty(route, signals),
    investmentLevel: buildInvestmentLevel(route, signals),
    contextSignals: signals.contextSignals.slice(0, 4),
  };
}

export function normalizeAiAnalysisResult(candidate, context) {
  const fallback = buildMockAiAnalysis(context);
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  return {
    headline: normalizeString(candidate.headline, fallback.headline, 180),
    summary: normalizeString(candidate.summary, fallback.summary, 700),
    whyThisFits: normalizeStringArray(candidate.whyThisFits, fallback.whyThisFits, 4, 260),
    whyNotNow: normalizeStringArray(candidate.whyNotNow, fallback.whyNotNow, 3, 260),
    firstExperiment: normalizeString(candidate.firstExperiment, fallback.firstExperiment, 320),
    metrics: normalizeStringArray(candidate.metrics, fallback.metrics, 4, 220),
    sprint: normalizeStringArray(candidate.sprint, fallback.sprint, 4, 220),
    operationalDifficulty: normalizeString(candidate.operationalDifficulty, fallback.operationalDifficulty, 40),
    investmentLevel: normalizeString(candidate.investmentLevel, fallback.investmentLevel, 40),
    contextSignals: normalizeStringArray(candidate.contextSignals, fallback.contextSignals, 5, 220),
  };
}

function inferSignals(context) {
  const normalizedProduct = normalize(context.intake.productDescription);
  const normalizedAudience = normalize(context.intake.targetCustomer);
  const normalizedChannels = normalize(context.intake.salesChannels);
  const normalizedMarket = normalize(context.intake.primaryMarket);
  const normalizedProject = normalize(context.intake.projectName);
  const mergedText = [
    normalizedProduct,
    normalizedAudience,
    normalizedChannels,
    normalizedMarket,
    normalizedProject,
  ].join(" ");

  const brandHits = countKeywordMatches(mergedText, BRAND_KEYWORDS);
  const commodityHits = countKeywordMatches(mergedText, COMMODITY_KEYWORDS);
  const b2bHits = countKeywordMatches(mergedText, B2B_KEYWORDS);
  const socialHits = countKeywordMatches(normalizedChannels, SOCIAL_CHANNEL_KEYWORDS);
  const marketplaceHits = countKeywordMatches(normalizedChannels, MARKETPLACE_CHANNEL_KEYWORDS);

  const ticketValue = parseTicketValue(context.intake.averageTicket);
  const ticketBand =
    ticketValue >= 2500 ? "alto" : ticketValue >= 800 ? "medio" : ticketValue > 0 ? "bajo" : "no-definido";

  const explicitModel = context.intake.businessModel || "no-definido";
  const style =
    explicitModel === "marca-propia" || brandHits > commodityHits
      ? "marca"
      : explicitModel === "reventa" || commodityHits > brandHits
        ? "comparacion"
        : "mixto";

  const audienceType = b2bHits > 0 ? "b2b" : "consumo";
  const hasSocialTraction = socialHits > 0;
  const hasMarketplaceTraction = marketplaceHits > 0;
  const marketLabel = context.intake.primaryMarket || "tu mercado principal";

  const contextSignals = [];
  if (style === "marca") {
    contextSignals.push("Tu producto tiene señales de diferenciacion y construccion de marca.");
  }
  if (style === "comparacion") {
    contextSignals.push("Tu oferta parece competir mas por catalogo, precio o disponibilidad.");
  }
  if (audienceType === "b2b") {
    contextSignals.push("Hay indicios de venta consultiva o compras mas racionales.");
  }
  if (hasSocialTraction) {
    contextSignals.push("Ya aparecen canales relacionales donde puedes educar y retener clientes.");
  }
  if (hasMarketplaceTraction) {
    contextSignals.push("Ya existe cercania con canales de demanda mas transaccional.");
  }
  if (ticketBand !== "no-definido") {
    contextSignals.push(`El ticket aproximado luce ${ticketBand}, lo que cambia la exigencia de conversion y contenido.`);
  }

  return {
    style,
    audienceType,
    hasSocialTraction,
    hasMarketplaceTraction,
    ticketBand,
    ticketValue,
    marketLabel,
    businessModelLabel: BUSINESS_MODEL_LABELS[explicitModel] || "Sin definir",
    contextSignals,
  };
}

function buildHeadline(route, signals) {
  if (route === "propia") {
    return signals.style === "marca"
      ? "Tu contexto pide una tienda que explique y eleve el valor de la marca."
      : "Tu mejor oportunidad esta en controlar la experiencia y convertirla en un activo propio.";
  }

  if (route === "marketplace") {
    return signals.style === "comparacion"
      ? "Tu producto encaja mejor donde la demanda ya existe y la comparacion es natural."
      : "En tu etapa, la velocidad para validar demanda pesa mas que construir un canal propio desde cero.";
  }

  return "Tu negocio muestra señales mixtas: te conviene adquirir en un canal y capturar valor en otro.";
}

function buildSummary(route, signals, context) {
  const projectReference = context.intake.projectName ? `"${context.intake.projectName}"` : "tu proyecto";

  if (route === "propia") {
    return `${projectReference} necesita una experiencia donde puedas contar mejor lo que vendes, capturar datos y defender margen. ${signals.style === "marca" ? "El tipo de producto que describes gana cuando construyes confianza y diferenciacion." : "Aunque hay componentes comparables, tus respuestas favorecen control y relacion de largo plazo."}`;
  }

  if (route === "marketplace") {
    return `${projectReference} parece beneficiarse mas de una plataforma con demanda activa, reglas transaccionales claras y menor friccion para empezar. ${signals.style === "comparacion" ? "El tipo de producto descrito encaja bien en entornos donde el cliente compara rapido." : "Tus respuestas muestran que hoy pesa mas validar y mover producto que construir marca profunda."}`;
  }

  return `${projectReference} necesita una arquitectura de canales, no una decision unica. Tu contexto sugiere usar demanda externa para descubrir compradores y luego moverlos a un espacio donde controles recompra, margen y relacion.`;
}

function buildWhyThisFits(route, signals, context) {
  const reasons = [];

  if (route === "propia") {
    reasons.push("Tus respuestas favorecen control sobre marca, datos y experiencia.");
    reasons.push(
      signals.style === "marca"
        ? "Lo que vendes tiene componentes de identidad, diferenciacion o historia que una tienda propia puede explicar mejor."
        : "Aunque no todo depende de marca, tienes mejores probabilidades si controlas la presentacion y la retencion."
    );
    reasons.push(
      signals.hasSocialTraction
        ? "Ya hay señales de comunidad o canales relacionales que puedes convertir en trafico propio."
        : "Tu enfoque comercial sugiere que puedes construir demanda si ordenas bien contenido, anuncios y conversion."
    );
  } else if (route === "marketplace") {
    reasons.push("Tus respuestas priorizan velocidad, friccion baja y demanda ya existente.");
    reasons.push(
      signals.style === "comparacion"
        ? "El producto parece entrar en una categoria donde el cliente compara rapido precio, stock y reputacion."
        : "Aunque hay espacio para construir marca despues, hoy el aprendizaje de mercado importa mas que el control total."
    );
    reasons.push(
      signals.ticketBand === "alto"
        ? "Un ticket mas alto exigira mejores fichas, prueba social y respuesta rapida para no perder conversion."
        : "El arranque transaccional te permite validar antes de meter complejidad operativa innecesaria."
    );
  } else {
    reasons.push("Tus respuestas no caen en un extremo puro; la mezcla de canales tiene mas sentido que una sola apuesta.");
    reasons.push(
      signals.hasMarketplaceTraction
        ? "Ya hay cercania con canales de demanda externa, asi que puedes aprovecharlos como captacion."
        : "Aun sin traccion fuerte, un canal externo puede ayudarte a validar mientras construyes tus activos propios."
    );
    reasons.push(
      signals.hasSocialTraction || signals.style === "marca"
        ? "Tambien hay señales para retener clientes fuera del marketplace mediante marca, contenido o comunidad."
        : "Separar adquisicion y retencion te dara mas flexibilidad cuando empieces a escalar."
    );
  }

  return reasons;
}

function buildWhyNotNow(type, route, signals) {
  if (type === "propia") {
    return route === "marketplace"
      ? "No empezaria por tienda propia porque hoy te obligaria a generar trafico y confianza desde cero antes de validar la demanda."
      : "No conviene hacer de la tienda propia el unico canal mientras todavia necesitas una fuente de descubrimiento mas rapida.";
  }

  if (type === "marketplace") {
    return route === "propia"
      ? "No pondria al marketplace como prioridad porque puede presionarte a competir por precio y diluir la diferenciacion."
      : "No conviene depender solo del marketplace porque perderias margen, datos de cliente y capacidad de recompra.";
  }

  return signals.hasSocialTraction || signals.hasMarketplaceTraction
    ? "No arrancaria ya en modo hibrido completo si todavia no defines reglas claras para inventario, precios y objetivos por canal."
    : "No meteria complejidad multicanal demasiado pronto si aun no esta clara tu oferta ganadora.";
}

function buildFirstExperiment(route, signals, context) {
  const market = context.intake.primaryMarket || "tu mercado";

  if (route === "propia") {
    return `Lanza una pagina o coleccion corta para ${market} con 1 a 3 productos, propuesta de valor clara, captacion de leads y una campaña pequeña para medir visitas, conversion y preguntas reales del cliente.`;
  }

  if (route === "marketplace") {
    return `Publica un lote pequeño de SKU en ${market} con titulos, fotos y argumentos optimizados. Mide clics, conversion, preguntas, margen neto y velocidad de rotacion antes de ampliar catalogo.`;
  }

  return `Selecciona un grupo pequeño de productos: usa marketplace para captar demanda y una landing propia para capturar interes, recompra o bundles. La clave es medir que canal adquiere y cual retiene mejor.`;
}

function buildMetrics(route, signals) {
  if (route === "propia") {
    return [
      "Costo por visita y costo por lead.",
      "Conversion del sitio y porcentaje de carrito abandonado.",
      "Ticket promedio y recompra en 30 a 60 dias.",
      signals.hasSocialTraction ? "Porcentaje de trafico que llega desde comunidad o contenido." : "Canales que traen trafico con mejor intencion de compra.",
    ];
  }

  if (route === "marketplace") {
    return [
      "Margen neto despues de comision, envio y devoluciones.",
      "Conversion por ficha de producto.",
      "Tiempo de respuesta y reputacion del vendedor.",
      "Rotacion de inventario por SKU.",
    ];
  }

  return [
    "Margen por canal y costo real de adquisicion.",
    "Porcentaje de compradores que migran a canal propio.",
    "Rotacion de inventario sin sobreventa.",
    "Recompra y ticket promedio en clientes propios.",
  ];
}

function buildSprint(route, signals) {
  if (route === "propia") {
    return [
      "Semana 1: definir oferta, propuesta de valor y estructura minima del catalogo.",
      "Semana 2: publicar tienda, medios de pago, captura de leads y medicion base.",
      "Semanas 3 y 4: correr trafico controlado, observar objeciones y ajustar conversion.",
    ];
  }

  if (route === "marketplace") {
    return [
      "Semana 1: calcular margen real y escoger pocos SKU para validar.",
      "Semana 2: optimizar fichas, fotos y politicas de envio.",
      "Semanas 3 y 4: medir conversion, reputacion y decidir que productos merecen mas inversion.",
    ];
  }

  return [
    "Semana 1: definir el rol de cada canal y reglas de inventario.",
    "Semana 2: publicar un set piloto y centralizar seguimiento comercial.",
    "Semanas 3 y 4: medir adquisicion vs retencion y ajustar que productos vive mejor en cada canal.",
  ];
}

function buildOperationalDifficulty(route, signals) {
  if (route === "hibrido") {
    return "Alta";
  }
  if (route === "propia") {
    return signals.hasSocialTraction ? "Media" : "Media-alta";
  }
  return signals.ticketBand === "alto" ? "Media" : "Baja-media";
}

function buildInvestmentLevel(route, signals) {
  if (route === "propia") {
    return signals.ticketBand === "alto" ? "Media-alta" : "Media";
  }
  if (route === "marketplace") {
    return "Baja-media";
  }
  return "Media-alta";
}

function getAlternativeRoutes(scores, recommendation) {
  return Object.keys(scores)
    .filter((type) => type !== recommendation)
    .sort((first, second) => scores[second] - scores[first]);
}

function countKeywordMatches(text, keywords) {
  return keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0);
}

function parseTicketValue(value) {
  const digits = String(value || "")
    .replace(/[^\d.,]/g, "")
    .replace(/,/g, "");
  const parsed = Number.parseFloat(digits);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeString(value, fallback, maxLength) {
  const normalized = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
  return normalized || fallback;
}

function normalizeStringArray(value, fallback, maxItems, maxLength) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value
    .map((item) =>
      String(item || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength)
    )
    .filter(Boolean)
    .slice(0, maxItems);

  return cleaned.length > 0 ? cleaned : fallback;
}
