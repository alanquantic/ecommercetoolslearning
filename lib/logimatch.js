const TABLES = Array.from({ length: 15 }, (_, index) => index + 1);

const CARRIERS = [
  {
    id: "estafeta",
    name: "Estafeta",
    nickname: "La abuela confiable: en todos lados, sin sorpresas",
    coverage: "La mas amplia del pais. Oficinas en practicamente cualquier ciudad. Cobertura rural buena.",
    cost: "Medio. Tarifas escalonadas por peso y zona.",
    time: "2 a 5 dias habiles. Express disponible (1-2 dias) con sobrecosto.",
    strengths: [
      "Cobertura total del territorio mexicano.",
      "Recoleccion en domicilio o entrega en sucursal.",
      "Rastreo decente.",
      "Marca muy reconocida; el cliente confia cuando ve el nombre.",
    ],
    weaknesses: [
      "Demoras en temporada alta (Buen Fin, Navidad).",
      "El servicio terrestre puede tardar mas que la competencia.",
      "Reclamaciones por danos pueden ser lentas.",
    ],
    idealFor: "Negocios con envios a cualquier punto del pais, que valoren cobertura sobre velocidad.",
    badges: [
      { label: "Cobertura nacional", tone: "indigo" },
      { label: "Costo medio", tone: "slate" },
      { label: "Tiempo 2-5 dias", tone: "amber" },
    ],
  },
  {
    id: "fedex",
    name: "FedEx",
    nickname: "El ejecutivo premium: rapido y caro, sin pretextos",
    coverage: "Nacional e internacional. Excelente en zonas urbanas.",
    cost: "Alto. Premium en cada categoria.",
    time: "1 a 3 dias habiles. Overnight disponible.",
    strengths: [
      "Velocidad lider en la categoria.",
      "Rastreo en tiempo real, granular.",
      "Manejo cuidadoso de paquetes.",
      "Atencion a clientes empresariales solida.",
    ],
    weaknesses: [
      "Costo alto; no compite con economicas.",
      "Cobertura rural limitada vs Estafeta.",
      "Sobrecargos por dimensiones.",
    ],
    idealFor: "Productos de alto valor, urgentes o internacionales. Cliente que paga por velocidad.",
    badges: [
      { label: "Cobertura nacional + internacional", tone: "indigo" },
      { label: "Costo alto", tone: "red" },
      { label: "Tiempo 1-3 dias", tone: "emerald" },
    ],
  },
  {
    id: "dhl",
    name: "DHL",
    nickname: "El corporativo global: para cruzar fronteras",
    coverage: "Nacional aceptable; fortaleza maxima en internacional.",
    cost: "Alto en nacional, competitivo en internacional.",
    time: "1 a 3 dias nacional. Internacional: 3 a 7 dias.",
    strengths: [
      "Lider mundial en envios internacionales.",
      "Documentacion aduanal solida.",
      "Rastreo confiable en cualquier pais.",
      "Seguro premium disponible.",
    ],
    weaknesses: [
      "Caro para envios nacionales pequenos.",
      "Cobertura rural en MX limitada.",
      "No es lo mas eficiente en costo si solo vendes dentro de Mexico.",
    ],
    idealFor: "Negocios que venden al extranjero o productos premium internacionales.",
    badges: [
      { label: "Cobertura internacional", tone: "indigo" },
      { label: "Costo alto", tone: "red" },
      { label: "Tiempo 1-3 dias MX", tone: "emerald" },
    ],
  },
  {
    id: "min99",
    name: "99 Minutos",
    nickname: "El chico urbano rapido: te entrego hoy mismo",
    coverage: "Zonas metropolitanas grandes (CDMX, Guadalajara, Monterrey, Queretaro, Aguascalientes parcialmente, Puebla).",
    cost: "Competitivo en zonas que cubre. Caro fuera de cobertura.",
    time: "Same-day o next-day en zonas de cobertura. Fuera, similar a paqueteria tradicional.",
    strengths: [
      "Entrega el mismo dia o al siguiente.",
      "Rastreo en vivo con ubicacion del repartidor.",
      "Integracion con Shopify y otras plataformas.",
      "App moderna y facil para el cliente.",
    ],
    weaknesses: [
      "Cobertura limitada; fuera de zonas grandes el servicio decae.",
      "Costo se dispara para envios fuera de su zona principal.",
      "En temporada alta puede saturarse.",
    ],
    idealFor: "Negocios urbanos que venden mucho dentro de zonas metropolitanas y necesitan velocidad.",
    badges: [
      { label: "Cobertura urbana", tone: "indigo" },
      { label: "Costo competitivo", tone: "emerald" },
      { label: "Tiempo same-day", tone: "emerald" },
    ],
  },
  {
    id: "uber",
    name: "Uber Direct",
    nickname: "El vecino digital: del local al cliente en una hora",
    coverage: "Tu ciudad. Radio variable, generalmente urbano y semiurbano.",
    cost: "Bajo a medio segun distancia. Sin contratos.",
    time: "30 a 90 minutos.",
    strengths: [
      "Velocidad record en local.",
      "Integracion facil con plataformas de e-commerce.",
      "Sin volumen minimo.",
      "Cliente puede rastrear en tiempo real desde la app.",
    ],
    weaknesses: [
      "Solo local. No funciona para envios foraneos.",
      "Conductor puede no manejar paquete fragil con tanto cuidado.",
      "Depende de disponibilidad de conductores en tu zona.",
    ],
    idealFor: "Negocios que venden mucho a clientes en su ciudad y quieren convertir e-commerce en 'recibe hoy'.",
    badges: [
      { label: "Cobertura local", tone: "amber" },
      { label: "Costo bajo-medio", tone: "emerald" },
      { label: "Tiempo 30-90 min", tone: "emerald" },
    ],
  },
  {
    id: "cadete",
    name: "Cadete Local / Motoexpres",
    nickname: "El amigo del barrio: cuidamos tu paquete como tu",
    coverage: "Aguascalientes y municipios cercanos. Radio variable segun empresa.",
    cost: "Tarifa plana o por zona. Generalmente economico.",
    time: "Mismo dia o siguiente.",
    strengths: [
      "Relacion personal con el equipo.",
      "Flexibilidad para casos especiales.",
      "Costo predecible.",
      "Pueden ayudar con cobranza si manejas COD.",
      "Cuidado del paquete superior (los conoces).",
    ],
    weaknesses: [
      "Cobertura geografica limitada.",
      "Capacidad de volumen limitada en picos.",
      "Sin rastreo digital sofisticado.",
      "Depende de disponibilidad humana del equipo.",
    ],
    idealFor: "Negocios con base local fuerte que valoran trato cercano y entregas dentro del estado.",
    badges: [
      { label: "Cobertura estatal", tone: "amber" },
      { label: "Costo economico", tone: "emerald" },
      { label: "Tiempo same-day", tone: "emerald" },
    ],
  },
];

const MIPYMES = [
  {
    id: "bakery",
    name: 'Pasteleria "Dulce Agua"',
    headline: "Pasteleria artesanal con base en Aguascalientes",
    product: "Pasteles, postres individuales, paquetes para eventos.",
    ticket: "$450 MXN",
    fragility: { label: "Muy alta", tone: "red", detail: "Producto delicado, requiere refrigeracion." },
    urgency: { label: "Critica", tone: "red", detail: "Producto perecedero." },
    destinations: "Aguascalientes capital y municipios cercanos. Foraneo no funciona.",
    volume: "30-50 pedidos semanales.",
    priority:
      "Velocidad local + cuidado del producto. La paqueteria nacional NO funciona.",
  },
  {
    id: "jewelry",
    name: 'Joyeria "Luz de Plata"',
    headline: "Joyeria artesanal en plata 925",
    product: "Anillos, aretes, collares hechos a mano.",
    ticket: "$1,800 MXN",
    fragility: { label: "Media", tone: "amber", detail: "Requiere empaque presentable (es regalo comun)." },
    urgency: { label: "Media", tone: "amber", detail: "Cliente acepta 3-5 dias." },
    destinations: "Todo Mexico. 70% foraneo, 30% local.",
    volume: "15-25 pedidos semanales.",
    priority:
      "Rastreo confiable y seguro de envio. El producto vale lo que pesa por ser pequeno.",
  },
  {
    id: "clothing",
    name: 'Ropa "Oficina + Casual"',
    headline: "E-commerce de ropa de oficina y casual urbana",
    product: "Camisas, blusas, pantalones, accesorios.",
    ticket: "$750 MXN",
    fragility: { label: "Baja", tone: "emerald", detail: "Producto resistente." },
    urgency: { label: "Media", tone: "amber", detail: "Cliente prefiere economico aunque tarde." },
    destinations: "Todo Mexico. 60% foraneo.",
    volume: "60-80 pedidos semanales.",
    priority:
      "Costo bajo + cobertura amplia. Margen pequeno obliga a optimizar logistica.",
  },
  {
    id: "electronics",
    name: 'Electronicos "Gadgetzac"',
    headline: "Distribuidor de electronicos chicos y accesorios",
    product: "Audifonos, cargadores, smartwatches, accesorios.",
    ticket: "$1,200 MXN",
    fragility: { label: "Media", tone: "amber", detail: "Producto sensible a impacto." },
    urgency: { label: "Alta", tone: "red", detail: "Cliente tech espera 'de hoy para manana'." },
    destinations: "60% zona metropolitana CDMX/GDL/MTY, 40% resto del pais.",
    volume: "100+ pedidos semanales.",
    priority: "Velocidad y rastreo. Cliente sin tolerancia a retrasos.",
  },
  {
    id: "cosmetics",
    name: 'Cosmetica "Agave Bello"',
    headline: "Cosmetica natural artesanal",
    product: "Jabones, cremas, aceites esenciales, mascarillas.",
    ticket: "$550 MXN",
    fragility: { label: "Alta", tone: "red", detail: "Frascos de vidrio, producto liquido, sensibilidad a temperatura." },
    urgency: { label: "Baja a media", tone: "amber", detail: "No es perecedero pero las reentregas son problema." },
    destinations: "Todo Mexico. 50/50 local-foraneo.",
    volume: "40-60 pedidos semanales.",
    priority:
      "Cuidado del empaque y temperatura. Reentregas son problema (producto puede danarse esperando).",
  },
  {
    id: "food",
    name: 'Alimentos "Despensa Seca"',
    headline: "Granos, especias, cafe, productos de despensa",
    product: "Bolsas de cafe, especias, harinas, frijoles, productos a granel.",
    ticket: "$850 MXN",
    fragility: { label: "Baja a media", tone: "emerald", detail: "Caducidad media-larga." },
    urgency: { label: "Baja", tone: "emerald", detail: "Cliente acepta tiempos amplios." },
    destinations: "Todo Mexico. Pedido frecuente con recompra.",
    volume: "50-70 pedidos semanales.",
    priority: "Costo bajo y consistencia. El cliente recompra mensualmente.",
  },
];

const PERFECT_BAKERY_FEEDBACK =
  "Excelente decision: el pastel se mantiene frio, se maneja con cuidado manual y se entrega en menos de una hora dentro del estado.";
const BAKERY_FAIL_FEEDBACK =
  "Fracaso total: el pastel paso 3 dias en transito terrestre, se derritio y llego destruido.";
const BAKERY_PARTIAL_FEEDBACK =
  "99 Minutos no garantiza cobertura completa en Aguascalientes para producto refrigerado: el riesgo de saturacion sigue siendo alto.";

const MATCH_MATRIX = {
  bakery: {
    uber: { score: 100, feedback: PERFECT_BAKERY_FEEDBACK },
    cadete: { score: 100, feedback: PERFECT_BAKERY_FEEDBACK },
    fedex: { score: 20, feedback: BAKERY_FAIL_FEEDBACK, alert: true },
    dhl: { score: 20, feedback: BAKERY_FAIL_FEEDBACK, alert: true },
    estafeta: { score: 20, feedback: BAKERY_FAIL_FEEDBACK, alert: true },
    min99: { score: 40, feedback: BAKERY_PARTIAL_FEEDBACK },
  },
  jewelry: {
    fedex: {
      score: 100,
      feedback:
        "Excelente: cuentas con rastreo en tiempo real de alta precision y esquemas de seguro para mercancia de alto valor en envios nacionales.",
    },
    dhl: {
      score: 100,
      feedback:
        "Excelente: cuentas con rastreo en tiempo real de alta precision y esquemas de seguro para mercancia de alto valor en envios nacionales.",
    },
    estafeta: {
      score: 70,
      feedback:
        "Estafeta llega a cualquier rincon, pero el cliente foraneo de la joyeria espera rastreo granular y seguro reforzado.",
    },
    min99: {
      score: 65,
      feedback:
        "99 Minutos cuida bien el envio urbano, pero no resuelve el 70% foraneo de Luz de Plata.",
    },
    uber: {
      score: 45,
      feedback:
        "Uber Direct solo cubre el 30% local. Tampoco entrega el seguro y discrecion que exige una joya.",
    },
    cadete: {
      score: 50,
      feedback:
        "El cadete cuida el paquete, pero no resuelve el 70% foraneo de la operacion ni el seguro de alto valor.",
    },
  },
  clothing: {
    estafeta: {
      score: 100,
      feedback:
        "Proteges el pequeno margen de ganancia de la prenda optimizando al costo de envio mas bajo con cobertura masiva.",
    },
    min99: {
      score: 85,
      feedback:
        "Proteges el pequeno margen de ganancia de la prenda optimizando al costo de envio mas bajo con cobertura masiva.",
    },
    fedex: {
      score: 55,
      feedback:
        "Cumples velocidad, pero el costo premium se come el margen pequeno de la prenda.",
    },
    dhl: {
      score: 50,
      feedback:
        "DHL es solido en internacional, pero exagerado para ropa nacional con margen ajustado.",
    },
    uber: {
      score: 65,
      feedback:
        "Uber Direct sirve para el 40% local rapido, pero no resuelve el 60% foraneo de la marca.",
    },
    cadete: {
      score: 60,
      feedback:
        "Cadete sirve para la base local, pero deja sin solucion al 60% foraneo del catalogo.",
    },
  },
  electronics: {
    min99: {
      score: 100,
      feedback:
        "Cumples la expectativa de inmediatez del cliente tecnologico que exige entregas de hoy para manana.",
    },
    fedex: {
      score: 100,
      feedback:
        "Cumples la expectativa de inmediatez del cliente tecnologico que exige entregas de hoy para manana.",
    },
    dhl: {
      score: 80,
      feedback:
        "Velocidad correcta, pero el costo premium aprieta el margen del 40% foraneo.",
    },
    estafeta: {
      score: 65,
      feedback:
        "Estafeta resuelve la cobertura, pero el cliente tech no tolera 2-5 dias terrestres.",
    },
    uber: {
      score: 70,
      feedback:
        "Uber Direct domina entregas en CDMX y GDL, pero no cubre el 40% foraneo de Gadgetzac.",
    },
    cadete: {
      score: 55,
      feedback:
        "Cadete cuida bien el producto, pero no atiende el 60% metropolitano fuera de Aguascalientes.",
    },
  },
  cosmetics: {
    estafeta: {
      score: 95,
      feedback:
        "Equilibrio ideal para la distribucion mixta nacional protegiendo el empaque de vidrio.",
    },
    min99: {
      score: 95,
      feedback:
        "Equilibrio ideal para la distribucion mixta nacional protegiendo el empaque de vidrio.",
    },
    fedex: {
      score: 80,
      feedback:
        "Manejo cuidadoso del vidrio, pero el costo premium golpea un ticket de $550.",
    },
    dhl: {
      score: 70,
      feedback:
        "DHL cuida el envio, pero es sobrado para distribucion 100% nacional.",
    },
    uber: {
      score: 60,
      feedback:
        "Uber Direct resuelve local, pero los riders no garantizan cuidado de vidrio.",
    },
    cadete: {
      score: 75,
      feedback:
        "Cadete cuida el vidrio, pero solo cubre el 50% local del catalogo de Agave Bello.",
    },
  },
  food: {
    estafeta: {
      score: 100,
      feedback:
        "La consistencia en tiempos y tarifas controladas aseguran la rentabilidad de las recompras mensuales.",
    },
    min99: {
      score: 70,
      feedback:
        "99 Minutos es bueno en zonas urbanas, pero el alimento no necesita velocidad y si optimizar costo.",
    },
    fedex: {
      score: 60,
      feedback:
        "FedEx es sobrado para un producto poco urgente y comprime el margen del granel.",
    },
    dhl: {
      score: 50,
      feedback:
        "DHL es caro para alimento nacional poco urgente: golpea el ticket de recompra.",
    },
    uber: {
      score: 55,
      feedback:
        "Uber Direct solo cubre la ciudad y eleva el costo por entrega.",
    },
    cadete: {
      score: 75,
      feedback:
        "Cadete cuida el costo local, pero no atiende la base foranea de la recompra mensual.",
    },
  },
};

export function getTableOptionsForMatch() {
  return [...TABLES];
}

export function getCarriers() {
  return CARRIERS.map((carrier) => ({ ...carrier }));
}

export function getMipymes() {
  return MIPYMES.map((mipyme) => ({ ...mipyme }));
}

export function getCarrierById(id) {
  return CARRIERS.find((carrier) => carrier.id === id) || null;
}

export function getMipymeById(id) {
  return MIPYMES.find((mipyme) => mipyme.id === id) || null;
}

export function createDefaultLogiMatchState() {
  return {
    activeTab: "catalog",
    tableNumber: "",
    selectedMipyme: MIPYMES[0].id,
    selectedCarrier: "",
    result: null,
  };
}

export function normalizeLogiMatchState(value) {
  const base = createDefaultLogiMatchState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const activeTab = value.activeTab === "auction" ? "auction" : "catalog";
  const tableNumber = sanitizeTableNumber(value.tableNumber);
  const selectedMipyme = sanitizeMipymeId(value.selectedMipyme);
  const selectedCarrier = sanitizeCarrierId(value.selectedCarrier);
  const result = sanitizeResult(value.result);

  return {
    activeTab,
    tableNumber,
    selectedMipyme,
    selectedCarrier,
    result,
  };
}

export function evaluateLogiMatch({ mipymeId, carrierId, tableNumber }) {
  const mipyme = getMipymeById(mipymeId);
  const carrier = getCarrierById(carrierId);
  if (!mipyme || !carrier) {
    return null;
  }

  const entry = MATCH_MATRIX[mipyme.id]?.[carrier.id];
  if (!entry) {
    return null;
  }

  return {
    tableNumber: sanitizeTableNumber(tableNumber),
    mipymeId: mipyme.id,
    mipymeName: mipyme.name,
    carrierId: carrier.id,
    carrierName: carrier.name,
    score: entry.score,
    feedback: entry.feedback,
    alert: Boolean(entry.alert),
    tone: getToneForScore(entry.score),
    timestamp: new Date().toISOString(),
  };
}

export function getToneForScore(score) {
  if (score >= 80) {
    return "success";
  }
  if (score >= 50) {
    return "warning";
  }
  return "danger";
}

export function buildEvidenceReceipt(result) {
  if (!result) {
    return "";
  }

  const lines = [
    "LOGIMATCH - EVIDENCIA DE SUBASTA",
    "================================",
    `Mesa / Equipo: ${result.tableNumber || "N/A"}`,
    `MiPyME evaluada: ${result.mipymeName}`,
    `Paqueteria asignada: ${result.carrierName}`,
    `Calificacion del match: ${result.score}%`,
    `Veredicto: ${result.feedback}`,
    `Fecha y hora: ${formatTimestamp(result.timestamp)}`,
    "",
    "Esta evidencia se generó desde LogiMatch, el simulador de subasta del taller Ruta E-commerce.",
  ];

  return lines.join("\n");
}

export function buildEvidenceFilename(result) {
  if (!result) {
    return "logimatch-evidencia.txt";
  }
  const mesa = result.tableNumber ? `mesa-${result.tableNumber}` : "mesa-sin-numero";
  const mipymeSlug = slug(result.mipymeId);
  const carrierSlug = slug(result.carrierId);
  return `logimatch-${mesa}-${mipymeSlug}-${carrierSlug}.txt`;
}

function sanitizeTableNumber(value) {
  const number = Number.parseInt(value, 10);
  if (!Number.isInteger(number) || number < 1 || number > TABLES.length) {
    return "";
  }
  return String(number);
}

function sanitizeMipymeId(value) {
  return MIPYMES.some((m) => m.id === value) ? value : MIPYMES[0].id;
}

function sanitizeCarrierId(value) {
  return CARRIERS.some((c) => c.id === value) ? value : "";
}

function sanitizeResult(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  if (!getMipymeById(value.mipymeId) || !getCarrierById(value.carrierId)) {
    return null;
  }
  const score = Number(value.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return null;
  }
  return {
    tableNumber: sanitizeTableNumber(value.tableNumber),
    mipymeId: value.mipymeId,
    mipymeName: String(value.mipymeName || getMipymeById(value.mipymeId)?.name || ""),
    carrierId: value.carrierId,
    carrierName: String(value.carrierName || getCarrierById(value.carrierId)?.name || ""),
    score,
    feedback: String(value.feedback || ""),
    alert: Boolean(value.alert),
    tone: getToneForScore(score),
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

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
