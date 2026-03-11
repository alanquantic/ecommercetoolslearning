const DEFAULT_BRIEF = {
  productDescription: "",
  targetCustomer: "",
  priceReference: "",
  differentiator: "",
};

const CATEGORY_LIBRARY = [
  {
    key: "beauty",
    label: "belleza",
    keywords: ["skincare", "serum", "serum", "crema", "cosmetica", "cosmetico", "belleza", "piel", "maquillaje"],
    benefits: [
      "Beneficio principal visible en el primer pantallazo.",
      "Como se usa y para quien esta pensado.",
      "Ingrediente o mecanismo que respalda la promesa.",
    ],
    attributes: ["Ingredientes clave", "Tipo de piel compatible", "Rutina sugerida"],
    photoNotes: ["Foto hero limpia", "Textura o close-up del producto", "Uso real en contexto"],
    variants: ["Tamano", "Kit o rutina", "Frecuencia de compra"],
    faq: [
      "Para quien esta recomendado y para quien no.",
      "Cuanto tarda en verse el beneficio principal.",
      "Como se integra en la rutina.",
    ],
    trustSignals: ["Resenas verificadas", "Ingredientes claros", "Cambios y devoluciones", "Envio seguro"],
    objections: [
      "Aclarar si funciona para mi tipo de piel.",
      "Reducir la duda sobre resultados reales.",
      "Explicar por que vale lo que cuesta.",
    ],
  },
  {
    key: "fashion",
    label: "moda",
    keywords: ["ropa", "camisa", "sudadera", "tenis", "zapato", "moda", "bolsa", "joyeria", "accesorio"],
    benefits: [
      "Fit o estilo principal en una frase.",
      "Material o terminacion que justifica el valor.",
      "Como combinarlo o para que ocasion sirve.",
    ],
    attributes: ["Materiales", "Guia de tallas", "Cuidados"],
    photoNotes: ["Vista frontal", "Vista en modelo", "Detalle de textura o acabado"],
    variants: ["Talla", "Color", "Set o bundle"],
    faq: [
      "Como elegir la talla correcta.",
      "Que cambios o devoluciones aplican.",
      "Cuidados para mantener la prenda o accesorio.",
    ],
    trustSignals: ["Guia de tallas", "Cambios faciles", "Fotos reales", "Pagos seguros"],
    objections: [
      "Reducir miedo a pedir talla incorrecta.",
      "Mostrar materiales y terminados reales.",
      "Aclarar tiempos de entrega.",
    ],
  },
  {
    key: "tech",
    label: "tecnologia",
    keywords: ["gadget", "tecnologia", "tecnologico", "audifonos", "celular", "cable", "laptop", "soporte", "smartwatch"],
    benefits: [
      "Que problema resuelve de inmediato.",
      "Compatibilidad o escenario de uso principal.",
      "Dato tecnico traducido a beneficio claro.",
    ],
    attributes: ["Compatibilidad", "Especificaciones", "Contenido de la caja"],
    photoNotes: ["Producto aislado", "Puertos o detalles", "Uso en escenario real"],
    variants: ["Color", "Capacidad", "Version compatible"],
    faq: [
      "Con que equipos es compatible.",
      "Que incluye la caja.",
      "Que garantia tiene y como se activa.",
    ],
    trustSignals: ["Garantia", "Compatibilidad visible", "Pago seguro", "Soporte postventa"],
    objections: [
      "Evitar confusiones de compatibilidad.",
      "Explicar la diferencia frente a alternativas mas baratas.",
      "Dar seguridad sobre garantia y soporte.",
    ],
  },
  {
    key: "food",
    label: "alimentos",
    keywords: ["cafe", "cafe", "snack", "proteina", "proteina", "te", "salsa", "chocolate", "alimento", "bebida"],
    benefits: [
      "Sabor o experiencia principal.",
      "Formato o porcion que facilita la compra.",
      "Ingrediente o proceso distintivo.",
    ],
    attributes: ["Ingredientes", "Porciones", "Conservacion"],
    photoNotes: ["Empaque principal", "Producto servido", "Detalle de ingredientes o textura"],
    variants: ["Sabor", "Tamano", "Paquete o suscripcion"],
    faq: [
      "Cuanto rinde o cuantas porciones incluye.",
      "Como se conserva.",
      "Si contiene alergenos o ingredientes relevantes.",
    ],
    trustSignals: ["Ingredientes visibles", "Pagos seguros", "Entrega cuidada", "Opiniones de compradores"],
    objections: [
      "Mostrar claramente sabor, rendimiento y formato.",
      "Reducir miedo a que no llegue fresco o integro.",
      "Explicar por que elegir este frente a opciones comunes.",
    ],
  },
];

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

  const status = ["idle", "loading", "ready", "error"].includes(value.status) ? value.status : "idle";
  return {
    ...base,
    brief: normalizeBrief(value.brief),
    status,
    result: status === "ready" && value.result && typeof value.result === "object" ? value.result : null,
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
  const payload = normalizeBrief(brief);

  return [
    "Eres un especialista senior en CRO, UX y merchandising para ecommerce en espanol.",
    "Debes proponer el wireframe ideal de una ficha de producto para ayudar a un alumno a entender como convertir mejor.",
    "La ficha debe responder preguntas, reducir objeciones y facilitar la compra.",
    "Devuelve JSON valido, sin markdown, con estas llaves exactas:",
    "wireframeTitle, pageGoal, decisionMessage, productTitle, shortHook, pricePresentation, benefits, photoNotes, variants, availability, primaryCta, secondaryCta, trustSignals, attributes, faq, objections, mobileStickyBar, conversionNotes.",
    "benefits, photoNotes, variants, trustSignals, attributes, faq, objections y conversionNotes deben ser arreglos de strings.",
    "Usa un tono didactico pero accionable.",
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
  const category = inferCategory(normalizedBrief.productDescription);
  const productTitle = buildProductTitle(normalizedBrief.productDescription, category);
  const targetCustomer = normalizedBrief.targetCustomer || "la persona correcta para este producto";
  const priceReference = normalizedBrief.priceReference || "Precio visible desde el primer pantallazo";
  const differentiator =
    normalizedBrief.differentiator || "Diferencial claro explicado arriba del primer CTA";

  return {
    wireframeTitle: `Wireframe sugerido para la ficha de ${productTitle}`,
    pageGoal: "Ayudar a decidir rapido, no solo describir el producto.",
    decisionMessage: `La ficha debe reducir la duda principal de ${targetCustomer} y moverla a compra con evidencia, claridad y un CTA visible.`,
    productTitle,
    shortHook: differentiator,
    pricePresentation: priceReference,
    benefits: category.benefits.slice(0, 3),
    photoNotes: category.photoNotes.slice(0, 3),
    variants: category.variants.slice(0, 3),
    availability: "Disponibilidad visible junto al CTA, con tiempos de entrega y urgencia realista.",
    primaryCta: "Agregar al carrito",
    secondaryCta: "Comprar ahora",
    trustSignals: category.trustSignals.slice(0, 4),
    attributes: category.attributes.slice(0, 3),
    faq: category.faq.slice(0, 3),
    objections: category.objections.slice(0, 3),
    mobileStickyBar: "Barra fija en movil con precio, disponibilidad corta y CTA siempre visible.",
    conversionNotes: [
      "El titulo y el beneficio principal deben estar arriba del pliegue.",
      "Las fotos deben resolver dudas, no solo decorar la pagina.",
      "La zona de compra debe repetir precio, variantes, disponibilidad y CTA sin friccion.",
    ],
  };
}

export function normalizeProductWireframeResult(candidate, brief) {
  const fallback = buildMockProductWireframe(brief);
  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  return {
    wireframeTitle: normalizeString(candidate.wireframeTitle, fallback.wireframeTitle, 180),
    pageGoal: normalizeString(candidate.pageGoal, fallback.pageGoal, 240),
    decisionMessage: normalizeString(candidate.decisionMessage, fallback.decisionMessage, 360),
    productTitle: normalizeString(candidate.productTitle, fallback.productTitle, 90),
    shortHook: normalizeString(candidate.shortHook, fallback.shortHook, 160),
    pricePresentation: normalizeString(candidate.pricePresentation, fallback.pricePresentation, 120),
    benefits: normalizeStringArray(candidate.benefits, fallback.benefits, 4, 180),
    photoNotes: normalizeStringArray(candidate.photoNotes, fallback.photoNotes, 4, 180),
    variants: normalizeStringArray(candidate.variants, fallback.variants, 4, 120),
    availability: normalizeString(candidate.availability, fallback.availability, 140),
    primaryCta: normalizeString(candidate.primaryCta, fallback.primaryCta, 50),
    secondaryCta: normalizeString(candidate.secondaryCta, fallback.secondaryCta, 50),
    trustSignals: normalizeStringArray(candidate.trustSignals, fallback.trustSignals, 5, 120),
    attributes: normalizeStringArray(candidate.attributes, fallback.attributes, 4, 120),
    faq: normalizeStringArray(candidate.faq, fallback.faq, 4, 180),
    objections: normalizeStringArray(candidate.objections, fallback.objections, 4, 180),
    mobileStickyBar: normalizeString(candidate.mobileStickyBar, fallback.mobileStickyBar, 160),
    conversionNotes: normalizeStringArray(candidate.conversionNotes, fallback.conversionNotes, 4, 180),
  };
}

function inferCategory(description) {
  const normalized = normalize(description);
  const bestMatch = CATEGORY_LIBRARY
    .map((category) => ({
      category,
      score: category.keywords.reduce((total, keyword) => total + (normalized.includes(keyword) ? 1 : 0), 0),
    }))
    .sort((first, second) => second.score - first.score)[0];

  return bestMatch && bestMatch.score > 0 ? bestMatch.category : buildGenericCategory();
}

function buildGenericCategory() {
  return {
    label: "producto",
    benefits: [
      "Beneficio principal en lenguaje simple.",
      "Que lo hace distinto frente a otras opciones.",
      "Como se usa o en que momento encaja mejor.",
    ],
    attributes: ["Especificaciones clave", "Que incluye", "Uso recomendado"],
    photoNotes: ["Vista principal", "Detalle importante", "Uso real o escala"],
    variants: ["Version", "Tamano", "Bundle"],
    faq: [
      "Que incluye exactamente la compra.",
      "Cuanto tarda en llegar o activarse.",
      "Que politica de cambios, garantia o soporte aplica.",
    ],
    trustSignals: ["Pago seguro", "Resenas", "Soporte visible", "Envio o entrega clara"],
    objections: [
      "Reducir la duda sobre si realmente resuelve el problema.",
      "Aclarar que incluye y que no incluye.",
      "Dar seguridad sobre entrega, cambios o soporte.",
    ],
  };
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

  const shortTitle = cleaned.split(" ").slice(0, 7).join(" ");
  return shortTitle.charAt(0).toUpperCase() + shortTitle.slice(1);
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
