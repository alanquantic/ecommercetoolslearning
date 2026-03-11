const DEFAULT_BRIEF = {
  productDescription: "",
  targetCustomer: "",
  priceReference: "",
  differentiator: "",
};

const CATEGORY_LIBRARY = [
  {
    key: "industrial",
    label: "Industrial / B2B",
    keywords: [
      "guante",
      "guantes",
      "nitrilo",
      "industrial",
      "seguridad",
      "proteccion",
      "proteccion personal",
      "equipo de seguridad",
      "ppe",
      "taller",
      "laboratorio",
      "mantenimiento",
      "limpieza",
      "insumo",
      "mayoreo",
      "caja",
      "piezas por caja",
      "textura",
      "antiderrapante",
      "refaccion",
      "maquinaria",
      "quimico",
      "resistencia quimica",
      "uso rudo",
    ],
    benefits: [
      "Nivel de proteccion y resistencia explicado sin ambiguedad.",
      "Aplicaciones concretas donde funciona mejor.",
      "Material, grosor o textura traducidos a beneficio operativo.",
    ],
    attributes: ["Material y grosor", "Uso recomendado", "Contenido por caja", "Tallas o medidas"],
    photoNotes: [
      "Foto hero del producto y empaque",
      "Close-up de textura, grosor o acabado",
      "Uso real en taller, laboratorio o linea de trabajo",
      "Foto comparativa de tallas o piezas por caja",
    ],
    variants: ["Talla", "Color", "Calibre o grosor", "Piezas por caja"],
    trustSignals: [
      "Ficha tecnica visible",
      "Material y especificaciones claras",
      "Disponibilidad por caja o mayoreo",
      "Politica de cambios o garantia",
      "Entrega y tiempos visibles",
    ],
    faq: [
      "Que nivel de resistencia ofrece y para que tareas si aplica.",
      "Cuantas piezas incluye la caja o paquete.",
      "Que talla o medida conviene elegir.",
      "Si se puede usar en tal proceso, taller o laboratorio.",
    ],
    objections: [
      "Resolver si realmente aguanta el uso prometido.",
      "Aclarar medida, grosor o talla para evitar compra incorrecta.",
      "Explicar compatibilidad con el tipo de trabajo o material.",
      "Mostrar presentacion exacta por caja, paquete o unidad.",
    ],
    proofPoints: [
      "Material y resistencia visibles cerca del precio.",
      "Uso recomendado por industria o tarea.",
      "Presentacion comercial clara: unidad, paquete o caja.",
      "Ficha tecnica, certificacion o especificacion descargable si existe.",
    ],
    useCases: ["Taller mecanico", "Laboratorio", "Limpieza industrial", "Inspeccion o manejo de piezas"],
  },
  {
    key: "beauty",
    label: "Belleza / cuidado personal",
    keywords: [
      "skincare",
      "serum",
      "serums",
      "crema",
      "cosmetica",
      "cosmetico",
      "belleza",
      "piel",
      "maquillaje",
      "rutina",
      "dermatologico",
      "facial",
      "labial",
    ],
    benefits: [
      "Beneficio principal visible en el primer pantallazo.",
      "Como se usa y para quien esta pensado.",
      "Ingrediente o mecanismo que respalda la promesa.",
    ],
    attributes: ["Ingredientes clave", "Tipo de piel compatible", "Rutina sugerida", "Modo de uso"],
    photoNotes: [
      "Foto hero limpia",
      "Textura o close-up del producto",
      "Aplicacion real en contexto",
      "Antes y despues o prueba social si existe",
    ],
    variants: ["Tamano", "Kit o rutina", "Frecuencia de compra", "Presentacion"],
    trustSignals: [
      "Ingredientes claros",
      "Resenas verificadas",
      "Cambios y devoluciones",
      "Envio seguro",
      "Pruebas o claims visibles si existen",
    ],
    faq: [
      "Para quien esta recomendado y para quien no.",
      "Cuanto tarda en verse el beneficio principal.",
      "Como se integra en la rutina.",
      "Con que otros productos se puede combinar.",
    ],
    objections: [
      "Aclarar si funciona para mi tipo de piel.",
      "Reducir la duda sobre resultados reales.",
      "Explicar por que vale lo que cuesta.",
      "Mostrar como se usa sin complicacion.",
    ],
    proofPoints: [
      "Beneficio principal arriba del pliegue.",
      "Ingredientes o activos explicados en lenguaje simple.",
      "Testimonios o reseñas visibles cerca del CTA.",
      "Instrucciones de uso sin obligar a bajar demasiado.",
    ],
    useCases: ["Rutina diaria", "Piel sensible", "Cuidado nocturno", "Kit de inicio"],
  },
  {
    key: "fashion",
    label: "Moda / accesorios",
    keywords: [
      "ropa",
      "camisa",
      "sudadera",
      "tenis",
      "zapato",
      "moda",
      "bolsa",
      "joyeria",
      "accesorio",
      "playera",
      "vestido",
      "pantalon",
      "talla",
    ],
    benefits: [
      "Fit o estilo principal en una frase.",
      "Material o terminacion que justifica el valor.",
      "Como combinarlo o para que ocasion sirve.",
    ],
    attributes: ["Materiales", "Guia de tallas", "Cuidados", "Detalles del acabado"],
    photoNotes: [
      "Vista frontal",
      "Vista en modelo",
      "Detalle de textura o acabado",
      "Comparativa de tallas o medidas",
    ],
    variants: ["Talla", "Color", "Set o bundle", "Largo o ajuste"],
    trustSignals: ["Guia de tallas", "Cambios faciles", "Fotos reales", "Pagos seguros", "Envio claro"],
    faq: [
      "Como elegir la talla correcta.",
      "Que cambios o devoluciones aplican.",
      "Cuidados para mantener la prenda o accesorio.",
      "Que tan ajustado o amplio queda.",
    ],
    objections: [
      "Reducir miedo a pedir talla incorrecta.",
      "Mostrar materiales y terminados reales.",
      "Aclarar tiempos de entrega.",
      "Explicar el fit sin tecnicismos.",
    ],
    proofPoints: [
      "Guia de talla visible junto a variantes.",
      "Fotos en uso real y detalle de tela.",
      "Politica de cambios cerca del CTA.",
      "Material principal y sensacion al tacto en beneficios.",
    ],
    useCases: ["Uso diario", "Outfit casual", "Evento especial", "Regalo"],
  },
  {
    key: "tech",
    label: "Tecnologia / accesorios",
    keywords: [
      "gadget",
      "tecnologia",
      "tecnologico",
      "audifonos",
      "celular",
      "cable",
      "laptop",
      "soporte",
      "smartwatch",
      "usb",
      "bluetooth",
      "cargador",
      "compatibilidad",
    ],
    benefits: [
      "Que problema resuelve de inmediato.",
      "Compatibilidad o escenario de uso principal.",
      "Dato tecnico traducido a beneficio claro.",
    ],
    attributes: ["Compatibilidad", "Especificaciones", "Contenido de la caja", "Garantia"],
    photoNotes: [
      "Producto aislado",
      "Puertos o detalles",
      "Uso en escenario real",
      "Contenido de la caja o comparativa de tamanos",
    ],
    variants: ["Color", "Capacidad", "Version compatible", "Longitud o formato"],
    trustSignals: ["Garantia", "Compatibilidad visible", "Pago seguro", "Soporte postventa", "Envio claro"],
    faq: [
      "Con que equipos es compatible.",
      "Que incluye la caja.",
      "Que garantia tiene y como se activa.",
      "Que limitaciones o requisitos tiene.",
    ],
    objections: [
      "Evitar confusiones de compatibilidad.",
      "Explicar la diferencia frente a alternativas mas baratas.",
      "Dar seguridad sobre garantia y soporte.",
      "Mostrar claramente que incluye la compra.",
    ],
    proofPoints: [
      "Compatibilidad arriba del pliegue.",
      "Especificaciones resumidas antes del scroll profundo.",
      "Garantia y soporte visibles cerca del CTA.",
      "Fotos de puertos, conexiones o detalles funcionales.",
    ],
    useCases: ["Home office", "Uso diario", "Trabajo movil", "Viaje"],
  },
  {
    key: "food",
    label: "Alimentos / bebidas",
    keywords: [
      "cafe",
      "cafe de especialidad",
      "snack",
      "proteina",
      "proteina en polvo",
      "te matcha",
      "te chai",
      "salsa",
      "chocolate",
      "alimento",
      "bebida",
      "granola",
      "sabor",
      "porciones",
    ],
    benefits: [
      "Sabor o experiencia principal.",
      "Formato o porcion que facilita la compra.",
      "Ingrediente o proceso distintivo.",
    ],
    attributes: ["Ingredientes", "Porciones", "Conservacion", "Preparacion o consumo"],
    photoNotes: [
      "Empaque principal",
      "Producto servido",
      "Detalle de ingredientes o textura",
      "Comparativa de tamanos o porciones",
    ],
    variants: ["Sabor", "Tamano", "Paquete o suscripcion", "Cantidad"],
    trustSignals: [
      "Ingredientes visibles",
      "Pagos seguros",
      "Entrega cuidada",
      "Opiniones de compradores",
      "Caducidad o conservacion clara",
    ],
    faq: [
      "Cuanto rinde o cuantas porciones incluye.",
      "Como se conserva.",
      "Si contiene alergenos o ingredientes relevantes.",
      "Como se prepara o consume.",
    ],
    objections: [
      "Mostrar claramente sabor, rendimiento y formato.",
      "Reducir miedo a que no llegue fresco o integro.",
      "Explicar por que elegir este frente a opciones comunes.",
      "Aclarar ingredientes clave o alergenos.",
    ],
    proofPoints: [
      "Sabor y rendimiento arriba del pliegue.",
      "Ingredientes y porciones visibles antes del FAQ.",
      "Preparacion simple o sugerencia de uso.",
      "Caducidad o conservacion explicadas sin letra chica.",
    ],
    useCases: ["Consumo diario", "Regalo", "Suscripcion", "Preparacion rapida"],
  },
];

const AUDIENCE_SIGNALS = [
  { label: "B2B / compra operativa", keywords: ["empresa", "industrial", "taller", "mayoreo", "negocio", "laboratorio", "compras"] },
  { label: "Consumidor final", keywords: ["hogar", "persona", "consumidor", "familia", "mujeres", "hombres", "regalo"] },
];

const CATEGORY_LEAK_TERMS = {
  industrial: ["sabor", "porcion", "ingrediente", "alergeno", "rutina", "tipo de piel", "maquillaje", "outfit"],
  beauty: ["piezas por caja", "uso rudo", "ficha tecnica", "compatibilidad", "puertos"],
  fashion: ["ingrediente", "alergeno", "compatibilidad", "ficha tecnica", "uso rudo"],
  tech: ["tipo de piel", "alergeno", "sabor", "outfit"],
  food: ["compatibilidad", "ficha tecnica", "tipo de piel", "uso rudo"],
};

export function createDefaultProductWireframeState() {
  return {
    brief: { ...DEFAULT_BRIEF },
    status: "idle",
    result: null,
    prompt: "",
    inputHash: "",
  };
}

export function normalizeProductWireframeState(value) {
  const base = createDefaultProductWireframeState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const brief = normalizeBrief(value.brief);
  const status = ["idle", "loading", "ready", "error"].includes(value.status) ? value.status : "idle";
  return {
    ...base,
    brief,
    status,
    result:
      status === "ready" && value.result && typeof value.result === "object"
        ? normalizeProductWireframeResult(value.result, brief)
        : null,
    prompt: String(value.prompt || ""),
    inputHash: String(value.inputHash || ""),
  };
}

export function normalizeBrief(value) {
  return {
    productDescription: sanitizeLongText(value?.productDescription, 500),
    targetCustomer: sanitizeLongText(value?.targetCustomer, 260),
    priceReference: sanitizeInput(value?.priceReference, 60),
    differentiator: sanitizeLongText(value?.differentiator, 220),
  };
}

export function buildProductWireframeInputHash(brief) {
  return JSON.stringify(normalizeBrief(brief));
}

export function buildProductWireframePrompt(brief) {
  const normalizedBrief = normalizeBrief(brief);
  const signals = inferSignals(normalizedBrief);

  const payload = {
    brief: normalizedBrief,
    inferredCategory: signals.category.label,
    inferredAudience: signals.audienceLabel,
    productTitleSuggestion: signals.productTitle,
    pricingHint: signals.pricePresentation,
    recommendedPrimaryCta: signals.primaryCta,
    recommendedSecondaryCta: signals.secondaryCta,
  };

  return [
    "Eres un especialista senior en CRO, UX y merchandising para ecommerce en espanol.",
    "Debes proponer el wireframe ideal de una ficha de producto para ayudar a un alumno a entender como convertir mejor.",
    "La ficha debe responder preguntas, reducir objeciones y facilitar la compra.",
    "No mezcles lenguajes de categorias incorrectas.",
    "Ejemplo: si el producto es industrial, no hables de sabor, ingredientes o rutina de piel.",
    "Debes producir una ficha creible para el tipo real de producto descrito.",
    "Devuelve JSON valido, sin markdown, con estas llaves exactas:",
    "wireframeTitle, pageGoal, decisionMessage, categoryLabel, audienceLabel, productTitle, shortHook, pricePresentation, benefits, photoNotes, variants, availability, primaryCta, secondaryCta, trustSignals, attributes, useCases, proofPoints, faq, objections, mobileStickyBar, conversionNotes.",
    "benefits, photoNotes, variants, trustSignals, attributes, useCases, proofPoints, faq, objections y conversionNotes deben ser arreglos de strings.",
    "Usa un tono didactico, concreto y accionable.",
    "Contexto:",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}

export async function requestProductWireframe(brief) {
  try {
    const response = await fetch("/api/product-wireframe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brief: normalizeBrief(brief) }),
    });

    if (!response.ok) {
      throw new Error(`Product wireframe endpoint failed with status ${response.status}`);
    }

    const payload = await response.json();
    return normalizeProductWireframeResult(payload.result, brief);
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 320));
    return buildMockProductWireframe(brief);
  }
}

export function buildMockProductWireframe(brief) {
  const normalizedBrief = normalizeBrief(brief);
  const signals = inferSignals(normalizedBrief);
  const category = signals.category;

  return {
    wireframeTitle: `Wireframe sugerido para la ficha de ${signals.productTitle}`,
    pageGoal: signals.pageGoal,
    decisionMessage: buildDecisionMessage(signals),
    categoryLabel: category.label,
    audienceLabel: signals.audienceLabel,
    productTitle: signals.productTitle,
    shortHook: signals.shortHook,
    pricePresentation: signals.pricePresentation,
    benefits: category.benefits.slice(0, 3),
    photoNotes: category.photoNotes.slice(0, 4),
    variants: dedupeItems(buildVariantSuggestions(signals, category)).slice(0, 4),
    availability: buildAvailabilityCopy(signals),
    primaryCta: signals.primaryCta,
    secondaryCta: signals.secondaryCta,
    trustSignals: dedupeItems(buildTrustSignals(signals, category)).slice(0, 5),
    attributes: dedupeItems(buildAttributes(signals, category)).slice(0, 4),
    useCases: dedupeItems(buildUseCases(signals, category)).slice(0, 4),
    proofPoints: dedupeItems(buildProofPoints(signals, category)).slice(0, 4),
    faq: dedupeItems(buildFaq(signals, category)).slice(0, 4),
    objections: dedupeItems(buildObjections(signals, category)).slice(0, 4),
    mobileStickyBar: buildMobileStickyBar(signals),
    conversionNotes: dedupeItems(buildConversionNotes(signals, category)).slice(0, 4),
  };
}

export function normalizeProductWireframeResult(candidate, brief) {
  const fallback = buildMockProductWireframe(brief);
  const signals = inferSignals(normalizeBrief(brief));
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  return {
    wireframeTitle: normalizeString(candidate.wireframeTitle, fallback.wireframeTitle, 180),
    pageGoal: normalizeString(candidate.pageGoal, fallback.pageGoal, 240),
    decisionMessage: sanitizeCategoryLeakage(
      normalizeString(candidate.decisionMessage, fallback.decisionMessage, 360),
      fallback.decisionMessage,
      signals
    ),
    categoryLabel: normalizeString(candidate.categoryLabel, fallback.categoryLabel, 80),
    audienceLabel: normalizeString(candidate.audienceLabel, fallback.audienceLabel, 80),
    productTitle: normalizeString(candidate.productTitle, fallback.productTitle, 90),
    shortHook: sanitizeCategoryLeakage(normalizeString(candidate.shortHook, fallback.shortHook, 160), fallback.shortHook, signals),
    pricePresentation: normalizeString(candidate.pricePresentation, fallback.pricePresentation, 120),
    benefits: sanitizeArray(normalizeStringArray(candidate.benefits, fallback.benefits, 4, 180), fallback.benefits, signals),
    photoNotes: sanitizeArray(normalizeStringArray(candidate.photoNotes, fallback.photoNotes, 4, 180), fallback.photoNotes, signals),
    variants: sanitizeArray(normalizeStringArray(candidate.variants, fallback.variants, 4, 120), fallback.variants, signals),
    availability: sanitizeCategoryLeakage(
      normalizeString(candidate.availability, fallback.availability, 160),
      fallback.availability,
      signals
    ),
    primaryCta: sanitizeCategoryLeakage(normalizeString(candidate.primaryCta, fallback.primaryCta, 50), fallback.primaryCta, signals),
    secondaryCta: sanitizeCategoryLeakage(
      normalizeString(candidate.secondaryCta, fallback.secondaryCta, 50),
      fallback.secondaryCta,
      signals
    ),
    trustSignals: sanitizeArray(
      normalizeStringArray(candidate.trustSignals, fallback.trustSignals, 5, 140),
      fallback.trustSignals,
      signals
    ),
    attributes: sanitizeArray(normalizeStringArray(candidate.attributes, fallback.attributes, 4, 140), fallback.attributes, signals),
    useCases: sanitizeArray(normalizeStringArray(candidate.useCases, fallback.useCases, 4, 140), fallback.useCases, signals),
    proofPoints: sanitizeArray(
      normalizeStringArray(candidate.proofPoints, fallback.proofPoints, 4, 180),
      fallback.proofPoints,
      signals
    ),
    faq: sanitizeArray(normalizeStringArray(candidate.faq, fallback.faq, 4, 180), fallback.faq, signals),
    objections: sanitizeArray(
      normalizeStringArray(candidate.objections, fallback.objections, 4, 180),
      fallback.objections,
      signals
    ),
    mobileStickyBar: sanitizeCategoryLeakage(
      normalizeString(candidate.mobileStickyBar, fallback.mobileStickyBar, 180),
      fallback.mobileStickyBar,
      signals
    ),
    conversionNotes: sanitizeArray(
      normalizeStringArray(candidate.conversionNotes, fallback.conversionNotes, 4, 180),
      fallback.conversionNotes,
      signals
    ),
  };
}

function inferSignals(brief) {
  const normalizedDescription = normalize(brief.productDescription);
  const normalizedAudience = normalize(brief.targetCustomer);
  const normalizedDifferentiator = normalize(brief.differentiator);
  const mergedText = [normalizedDescription, normalizedAudience, normalizedDifferentiator].join(" ");

  const scoredCategories = CATEGORY_LIBRARY.map((category) => ({
    category,
    score: countKeywordMatches(mergedText, category.keywords),
  })).sort((first, second) => second.score - first.score);

  const bestCategory = scoredCategories[0];
  const category = bestCategory && bestCategory.score > 0 ? bestCategory.category : buildGenericCategory();
  const audienceLabel = inferAudienceLabel(mergedText);
  const isB2B = audienceLabel === "B2B / compra operativa" || category.key === "industrial";
  const productTitle = buildProductTitle(brief.productDescription, category);
  const shortHook = buildShortHook(brief, category);
  const pricePresentation = formatPriceReference(brief.priceReference, isB2B);
  const primaryCta = isB2B && category.key === "industrial" ? "Agregar caja al carrito" : "Agregar al carrito";
  const secondaryCta = isB2B ? "Solicitar cotizacion" : "Comprar ahora";
  const pageGoal = isB2B
    ? "Quitar friccion tecnica y comercial antes del pedido."
    : "Ayudar a decidir rapido, no solo describir el producto.";

  return {
    category,
    audienceLabel,
    isB2B,
    productTitle,
    shortHook,
    pricePresentation,
    primaryCta,
    secondaryCta,
    pageGoal,
    brief: normalizeBrief(brief),
  };
}

function inferAudienceLabel(text) {
  const bestMatch = AUDIENCE_SIGNALS.map((signal) => ({
    signal,
    score: countKeywordMatches(text, signal.keywords),
  })).sort((first, second) => second.score - first.score)[0];

  return bestMatch && bestMatch.score > 0 ? bestMatch.signal.label : "Consumidor final";
}

function buildDecisionMessage(signals) {
  if (signals.category.key === "industrial") {
    return `La ficha debe reducir la duda tecnica y comercial de ${sanitizeAudience(signals.brief.targetCustomer)} para moverla a compra con especificaciones, evidencia y CTA visible.`;
  }

  return `La ficha debe reducir la duda principal de ${sanitizeAudience(signals.brief.targetCustomer)} y moverla a compra con evidencia, claridad y un CTA visible.`;
}

function buildAttributes(signals, category) {
  const items = [...category.attributes];
  const text = normalize(signals.brief.productDescription);

  if (category.key === "industrial") {
    if (text.includes("nitrilo")) {
      items.unshift("Material: nitrilo");
    }
    if (text.includes("textura")) {
      items.unshift("Textura o agarre visible");
    }
  }

  return dedupeItems(items);
}

function buildUseCases(signals, category) {
  const items = [...category.useCases];
  const audience = normalize(signals.brief.targetCustomer);

  if (category.key === "industrial") {
    if (audience.includes("laboratorio")) {
      items.unshift("Laboratorio");
    }
    if (audience.includes("taller")) {
      items.unshift("Taller");
    }
  }

  return dedupeItems(items);
}

function buildProofPoints(signals, category) {
  const items = [...category.proofPoints];

  if (category.key === "industrial" && signals.brief.priceReference) {
    items.unshift("Precio por caja o presentacion visible desde arriba del pliegue.");
  }

  return dedupeItems(items);
}

function buildTrustSignals(signals, category) {
  const items = [...category.trustSignals];
  if (signals.isB2B) {
    items.unshift("Atencion a compras y pedidos grandes");
  }
  return dedupeItems(items);
}

function buildFaq(signals, category) {
  return dedupeItems(category.faq);
}

function buildObjections(signals, category) {
  return dedupeItems(category.objections);
}

function buildVariantSuggestions(signals, category) {
  const items = [...category.variants];
  const text = normalize(signals.brief.productDescription);

  if (category.key === "industrial") {
    if (text.includes("naranja")) {
      items.unshift("Color");
    }
    if (text.includes("textura")) {
      items.unshift("Acabado o textura");
    }
  }

  return items;
}

function buildAvailabilityCopy(signals) {
  if (signals.isB2B) {
    return "Disponibilidad visible por caja o paquete, con tiempos de entrega, stock y pedido minimo si aplica.";
  }

  return "Disponibilidad visible junto al CTA, con tiempos de entrega y urgencia realista.";
}

function buildMobileStickyBar(signals) {
  if (signals.isB2B) {
    return `Barra fija en movil con ${signals.pricePresentation.toLowerCase()}, presentacion comercial y CTA para comprar o pedir cotizacion.`;
  }

  return "Barra fija en movil con precio, disponibilidad corta y CTA siempre visible.";
}

function buildConversionNotes(signals, category) {
  const notes = [
    "El titulo y el beneficio principal deben estar arriba del pliegue.",
    "Las fotos deben resolver dudas, no solo decorar la pagina.",
    "La zona de compra debe repetir precio, variantes, disponibilidad y CTA sin friccion.",
  ];

  if (category.key === "industrial") {
    notes.unshift("Si el producto se compra por presentacion comercial, eso debe verse antes del primer scroll.");
    notes.unshift("La ficha debe mostrar especificaciones operativas antes del FAQ.");
  }

  return dedupeItems(notes);
}

function buildShortHook(brief, category) {
  if (brief.differentiator) {
    return brief.differentiator;
  }

  switch (category.key) {
    case "industrial":
      return "Especificaciones claras, uso recomendado y compra sin dudas.";
    case "beauty":
      return "Beneficio claro, confianza visible y rutina simple de entender.";
    case "fashion":
      return "Estilo, ajuste y material explicados antes de comprar.";
    case "tech":
      return "Compatibilidad y valor explicados sin tecnicismos innecesarios.";
    case "food":
      return "Sabor, rendimiento y formato claros desde el primer vistazo.";
    default:
      return "Beneficio principal y diferenciador visibles arriba del CTA.";
  }
}

function buildProductTitle(description, category) {
  const normalized = sanitizeLongText(description, 90);
  if (!normalized) {
    return `Producto ${category.label}`;
  }

  const cleaned = normalized
    .replace(/[.,;:!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ").slice(0, 8);
  while (words.length > 0 && ["de", "del", "para", "con", "y", "o", "en"].includes(words[words.length - 1].toLowerCase())) {
    words.pop();
  }

  const shortTitle = words.join(" ") || cleaned.split(" ").slice(0, 6).join(" ");
  return toSmartTitleCase(shortTitle);
}

function buildGenericCategory() {
  return {
    key: "generic",
    label: "Producto general",
    benefits: [
      "Beneficio principal en lenguaje simple.",
      "Que lo hace distinto frente a otras opciones.",
      "Como se usa o en que momento encaja mejor.",
    ],
    attributes: ["Especificaciones clave", "Que incluye", "Uso recomendado", "Presentacion"],
    photoNotes: ["Vista principal", "Detalle importante", "Uso real o escala", "Comparativa de tamano o version"],
    variants: ["Version", "Tamano", "Bundle", "Color o acabado"],
    trustSignals: ["Pago seguro", "Resenas", "Soporte visible", "Envio o entrega clara", "Politicas visibles"],
    faq: [
      "Que incluye exactamente la compra.",
      "Cuanto tarda en llegar o activarse.",
      "Que politica de cambios, garantia o soporte aplica.",
      "Como saber si esta version es la correcta.",
    ],
    objections: [
      "Reducir la duda sobre si realmente resuelve el problema.",
      "Aclarar que incluye y que no incluye.",
      "Dar seguridad sobre entrega, cambios o soporte.",
      "Mostrar rapidamente para quien si conviene.",
    ],
    proofPoints: [
      "Beneficio principal arriba del pliegue.",
      "Especificaciones antes del scroll profundo.",
      "CTA y disponibilidad siempre visibles.",
      "Prueba social o confianza junto a la decision de compra.",
    ],
    useCases: ["Uso principal", "Escenario de compra", "Regalo o reposicion", "Comparacion entre versiones"],
  };
}

function countKeywordMatches(text, keywords) {
  return keywords.reduce((total, keyword) => total + (containsKeyword(text, keyword) ? 1 : 0), 0);
}

function containsKeyword(text, keyword) {
  const normalizedText = ` ${normalize(text)} `;
  const normalizedKeyword = normalize(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedKeyword).replace(/\\ /g, "\\s+")}([^a-z0-9]|$)`);
  return pattern.test(normalizedText);
}

function sanitizeCategoryLeakage(value, fallback, signals) {
  return isSuspiciousForCategory(value, signals.category.key) ? fallback : value;
}

function sanitizeArray(items, fallbackItems, signals) {
  return items.map((item, index) => {
    const fallback = fallbackItems[index % fallbackItems.length];
    return sanitizeCategoryLeakage(item, fallback, signals);
  });
}

function isSuspiciousForCategory(value, categoryKey) {
  const terms = CATEGORY_LEAK_TERMS[categoryKey];
  if (!terms) {
    return false;
  }

  return terms.some((term) => containsKeyword(value, term));
}

function sanitizeAudience(value) {
  return sanitizeLongText(value, 80) || "la persona correcta para este producto";
}

function formatPriceReference(value, isB2B) {
  const raw = sanitizeInput(value, 60);
  if (!raw) {
    return isB2B ? "Precio visible por presentacion comercial" : "Precio visible desde el primer pantallazo";
  }

  const digits = raw.replace(/[^\d.]/g, "");
  if (!digits) {
    return raw;
  }

  if (raw.includes("$") || /mxn|usd|eur/i.test(raw)) {
    return raw;
  }

  return `$${digits} MXN`;
}

function toSmartTitleCase(text) {
  return text
    .split(" ")
    .filter(Boolean)
    .map((word, index) => {
      if (/^[A-Z0-9-]{2,}$/.test(word)) {
        return word;
      }

      const lower = word.toLowerCase();
      if (index > 0 && ["de", "del", "para", "con", "y", "o", "en"].includes(lower)) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function dedupeItems(items) {
  return [...new Set(items.filter(Boolean))];
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

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
