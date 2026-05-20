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
      score: 75,
      feedback:
        "Estafeta resuelve la cobertura del 70% foraneo, pero el cliente que paga $1,800 espera rastreo granular y seguro reforzado que Estafeta no garantiza por default.",
    },
    min99: {
      score: 55,
      feedback:
        "99 Minutos cuida bien el envio urbano del 30% local, pero deja sin solucion el 70% foraneo que es el grueso de Luz de Plata.",
    },
    uber: {
      score: 35,
      feedback:
        "Uber Direct solo cubre el 30% local. Tampoco entrega el seguro y discrecion que una joya de $1,800 necesita.",
    },
    cadete: {
      score: 35,
      feedback:
        "El cadete cuida el paquete pero solo en zona local. No resuelve el 70% foraneo ni ofrece seguro formal para mercancia de alto valor.",
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
      score: 45,
      feedback:
        "Cumples velocidad, pero el costo premium de FedEx se come el margen pequeno de una prenda de $750. No es sostenible para alto volumen.",
    },
    dhl: {
      score: 40,
      feedback:
        "DHL es solido en internacional, pero exagerado para ropa nacional con ticket de $750 y 60-80 pedidos semanales.",
    },
    uber: {
      score: 55,
      feedback:
        "Uber Direct sirve para el 40% local rapido, pero no resuelve el 60% foraneo y eleva el costo por pedido.",
    },
    cadete: {
      score: 50,
      feedback:
        "Cadete sirve para la base local, pero deja sin solucion al 60% foraneo del catalogo y no escala al volumen semanal.",
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
      score: 85,
      feedback:
        "DHL entrega velocidad y rastreo granular para 100 pedidos semanales, aunque su costo premium aprieta el margen sobre el 40% foraneo.",
    },
    estafeta: {
      score: 50,
      feedback:
        "Estafeta resuelve la cobertura, pero el cliente tech no tolera 2-5 dias terrestres. Esperas mas quejas que ventas felices.",
    },
    uber: {
      score: 75,
      feedback:
        "Uber Direct domina entregas same-day en CDMX, GDL y MTY (tu 60% metro). El 40% foraneo queda sin solucion y necesita un plan complementario.",
    },
    cadete: {
      score: 40,
      feedback:
        "Cadete cuida bien el producto, pero solo atiende Aguascalientes. El 60% metropolitano fuera del estado queda fuera de su alcance.",
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
      score: 70,
      feedback:
        "Manejo cuidadoso del vidrio, pero el costo premium de FedEx golpea fuerte un ticket de $550 y 40-60 pedidos semanales.",
    },
    dhl: {
      score: 60,
      feedback:
        "DHL cuida el envio pero es sobrado para distribucion 100% nacional. Su costo no encaja con un ticket de $550.",
    },
    uber: {
      score: 50,
      feedback:
        "Uber Direct cubre el 50% local con velocidad, pero los riders no garantizan cuidado de vidrio y producto liquido.",
    },
    cadete: {
      score: 75,
      feedback:
        "Cadete cuida bien el vidrio y resuelve el 50% local con costo predecible. Necesitas un plan complementario para el 50% foraneo restante.",
    },
  },
  food: {
    estafeta: {
      score: 100,
      feedback:
        "La consistencia en tiempos y tarifas controladas aseguran la rentabilidad de las recompras mensuales.",
    },
    min99: {
      score: 60,
      feedback:
        "99 Minutos entrega velocidad que el alimento no necesita y cobra mas: estas pagando por urgencia que el cliente no pidio.",
    },
    fedex: {
      score: 45,
      feedback:
        "FedEx es sobrado para un producto poco urgente. Su tarifa premium comprime el margen del granel y desincentiva la recompra mensual.",
    },
    dhl: {
      score: 35,
      feedback:
        "DHL es caro para alimento nacional poco urgente. Golpea el ticket de $850 hasta volverlo no rentable.",
    },
    uber: {
      score: 45,
      feedback:
        "Uber Direct solo cubre la ciudad y eleva el costo por entrega. Para alimento poco urgente, no aporta nada que justifique su precio.",
    },
    cadete: {
      score: 80,
      feedback:
        "Cadete cuida el costo local con tarifa plana, ideal para recompra. Necesitas un plan paralelo (Estafeta) para la base foranea del catalogo.",
    },
  },
};

const IDEAL_ANSWERS = [
  {
    mipymeId: "bakery",
    mipymeName: 'Pasteleria "Dulce Agua"',
    needs: "Velocidad local same-day + cuidado del producto perecedero. La paqueteria nacional NO funciona.",
    bestMatches: [
      { carrierId: "uber", carrierName: "Uber Direct" },
      { carrierId: "cadete", carrierName: "Cadete Local" },
    ],
    whyTheyWork:
      "Entregan en menos de una hora dentro del estado con manejo manual del repartidor. El pastel se mantiene frio y no rompe la cadena de temperatura.",
    whyOthersFail:
      "Cualquier opcion terrestre nacional (FedEx, DHL, Estafeta) significa 2-5 dias en transito sin refrigeracion: el pastel se derrite. 99 Minutos cubre Aguascalientes solo parcialmente y se satura en picos.",
  },
  {
    mipymeId: "jewelry",
    mipymeName: 'Joyeria "Luz de Plata"',
    needs: "Cobertura nacional con rastreo granular y seguro alto. El 70% del catalogo es foraneo y el ticket de $1,800 exige proteccion.",
    bestMatches: [
      { carrierId: "fedex", carrierName: "FedEx" },
      { carrierId: "dhl", carrierName: "DHL" },
    ],
    whyTheyWork:
      "Entregan rastreo en tiempo real granular y esquemas de seguro premium por default para mercancia de alto valor en todo Mexico.",
    whyOthersFail:
      "Uber Direct y Cadete solo cubren el 30% local del catalogo y no ofrecen seguro formal. 99 Minutos solo cubre zonas metro. Estafeta da cobertura pero exige contratar seguro adicional y su rastreo no es granular.",
  },
  {
    mipymeId: "clothing",
    mipymeName: 'Ropa "Oficina + Casual"',
    needs: "Costo bajo + cobertura nacional masiva. El margen de una prenda de $750 obliga a optimizar logistica, y el 60% del catalogo es foraneo.",
    bestMatches: [
      { carrierId: "estafeta", carrierName: "Estafeta" },
    ],
    whyTheyWork:
      "Tarifas escalonadas economicas con cobertura nacional total. No castiga el margen pequeno y escala a 60-80 pedidos semanales sin problema.",
    whyOthersFail:
      "FedEx y DHL son premium y matan el margen. Uber Direct y Cadete solo cubren local y dejan el 60% foraneo sin solucion. 99 Minutos es un buen complemento en zonas metro (85%) pero no reemplaza a Estafeta como columna vertebral.",
  },
  {
    mipymeId: "electronics",
    mipymeName: 'Electronicos "Gadgetzac"',
    needs: "Velocidad y rastreo para cliente tech intolerante a retrasos. El 60% es metro CDMX/GDL/MTY y el 40% foraneo.",
    bestMatches: [
      { carrierId: "min99", carrierName: "99 Minutos" },
      { carrierId: "fedex", carrierName: "FedEx" },
    ],
    whyTheyWork:
      "99 Minutos entrega same-day en CDMX, GDL y MTY (el 60% metro de Gadgetzac) con rastreo en vivo. FedEx cubre velocidad nacional con rastreo granular para el 40% foraneo. Combinadas son el setup ideal.",
    whyOthersFail:
      "Estafeta es terrestre (2-5 dias) y el cliente tech no espera tanto. Cadete solo cubre Aguascalientes. Uber Direct entrega local rapido pero deja el 40% foraneo sin atender. DHL funciona pero su costo premium aprieta el margen.",
  },
  {
    mipymeId: "cosmetics",
    mipymeName: 'Cosmetica "Agave Bello"',
    needs: "Cuidado del empaque de vidrio + distribucion mixta nacional (50/50 local-foraneo) + evitar reentregas que danen el producto.",
    bestMatches: [
      { carrierId: "estafeta", carrierName: "Estafeta" },
      { carrierId: "min99", carrierName: "99 Minutos" },
    ],
    whyTheyWork:
      "Estafeta da cobertura nacional + reentrega automatica para producto delicado. 99 Minutos cubre el 50% local con manejo urbano cuidadoso. Combinarlas es el equilibrio ideal.",
    whyOthersFail:
      "FedEx y DHL cuidan bien el vidrio pero son caros para un ticket de $550. Uber Direct expone el vidrio a riders sin protocolo de manejo cuidadoso. Cadete cuida bien pero solo cubre el 50% local.",
  },
  {
    mipymeId: "food",
    mipymeName: 'Alimentos "Despensa Seca"',
    needs: "Costo bajo + consistencia en tiempos y tarifas + cobertura nacional. El cliente recompra mensualmente, asi que la rentabilidad de cada envio importa.",
    bestMatches: [
      { carrierId: "estafeta", carrierName: "Estafeta" },
    ],
    whyTheyWork:
      "Tarifas controladas y consistentes con cobertura nacional total. Aseguran la rentabilidad de la recompra mensual sin sorpresas en el costo.",
    whyOthersFail:
      "99 Minutos cobra por velocidad que el alimento no necesita. FedEx y DHL son sobrados para producto poco urgente y vuelven no rentable el ticket. Cadete cuida costo local pero solo Aguascalientes. Uber Direct igual.",
  },
];

export function getIdealAnswers() {
  return IDEAL_ANSWERS.map((answer) => ({
    ...answer,
    bestMatches: answer.bestMatches.map((m) => ({ ...m })),
  }));
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
    studentName: "",
    assignments: createEmptyAssignments(),
    result: null,
  };
}

export function normalizeLogiMatchState(value) {
  const base = createDefaultLogiMatchState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const activeTab = value.activeTab === "exam" ? "exam" : "catalog";
  const studentName = sanitizeStudentName(value.studentName);
  const assignments = sanitizeAssignments(value.assignments);
  const result = sanitizeFullResult(value.result, assignments, studentName);

  return {
    activeTab,
    studentName,
    assignments,
    result,
  };
}

export function evaluateLogiMatch({ mipymeId, carrierId }) {
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
    mipymeId: mipyme.id,
    mipymeName: mipyme.name,
    carrierId: carrier.id,
    carrierName: carrier.name,
    score: entry.score,
    feedback: entry.feedback,
    alert: Boolean(entry.alert),
    tone: getToneForScore(entry.score),
  };
}

export function evaluateAllPairs(assignments, studentName) {
  const pairs = MIPYMES.map((mipyme) => {
    const carrierId = assignments?.[mipyme.id] || "";
    if (!carrierId) {
      return {
        mipymeId: mipyme.id,
        mipymeName: mipyme.name,
        carrierId: "",
        carrierName: "(sin asignar)",
        score: 0,
        feedback: "Aun no asignaste una paqueteria para este perfil.",
        alert: false,
        tone: "danger",
      };
    }
    const evaluation = evaluateLogiMatch({ mipymeId: mipyme.id, carrierId });
    return (
      evaluation || {
        mipymeId: mipyme.id,
        mipymeName: mipyme.name,
        carrierId,
        carrierName: getCarrierById(carrierId)?.name || carrierId,
        score: 0,
        feedback: "Combinacion no reconocida.",
        alert: false,
        tone: "danger",
      }
    );
  });

  const totalScore = pairs.reduce((sum, pair) => sum + pair.score, 0);
  const maxScore = pairs.length * 100;
  const overallScore = Math.round((totalScore / maxScore) * 100);
  const perfectMatches = pairs.filter((pair) => pair.score >= 95).length;
  const goodMatches = pairs.filter((pair) => pair.score >= 80).length;
  const grade = getGradeFromScore(overallScore);

  return {
    studentName: sanitizeStudentName(studentName),
    pairs,
    overallScore,
    perfectMatches,
    goodMatches,
    totalPairs: pairs.length,
    grade,
    timestamp: new Date().toISOString(),
  };
}

export function getGradeFromScore(score) {
  if (score >= 90) {
    return {
      key: "excellent",
      label: "Excelente",
      detail: "Dominas la logica de canales por perfil de negocio.",
      tone: "success",
    };
  }
  if (score >= 75) {
    return {
      key: "good",
      label: "Bueno",
      detail: "Tienes claro el panorama; afinacion fina en algunos perfiles.",
      tone: "success",
    };
  }
  if (score >= 60) {
    return {
      key: "fair",
      label: "Regular",
      detail: "Identificas lo basico pero hay perfiles que pediste mal. Revisa las fichas.",
      tone: "warning",
    };
  }
  return {
    key: "needs-work",
    label: "Necesita reforzar",
    detail: "Estas pareando varios perfiles con paqueterias que no encajan. Vuelve al catalogo de fichas.",
    tone: "danger",
  };
}

export function getAssignedCount(assignments) {
  if (!assignments || typeof assignments !== "object") {
    return 0;
  }
  return MIPYMES.filter((mipyme) => Boolean(assignments[mipyme.id])).length;
}

export function isExamReady(state) {
  if (!state || typeof state !== "object") {
    return false;
  }
  return (
    sanitizeStudentName(state.studentName).length > 0 &&
    getAssignedCount(state.assignments) === MIPYMES.length
  );
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
  if (!result || !Array.isArray(result.pairs)) {
    return "";
  }

  const header = [
    "LOGIMATCH - EVIDENCIA DE EXAMEN",
    "================================",
    `Alumno: ${result.studentName || "(sin nombre)"}`,
    `Calificacion final: ${result.overallScore}% (${result.grade?.label || ""})`,
    `Resumen: ${result.grade?.detail || ""}`,
    `Pares perfectos (>=95%): ${result.perfectMatches} de ${result.totalPairs}`,
    `Pares aceptables (>=80%): ${result.goodMatches} de ${result.totalPairs}`,
    `Fecha y hora: ${formatTimestamp(result.timestamp)}`,
    "",
    "DETALLE POR PAR",
    "----------------",
  ];

  const body = result.pairs.flatMap((pair, index) => [
    `${index + 1}. ${pair.mipymeName}`,
    `   Paqueteria asignada: ${pair.carrierName}`,
    `   Score del par: ${pair.score}%`,
    `   Feedback: ${pair.feedback}`,
    "",
  ]);

  const footer = [
    "Esta evidencia se generó desde LogiMatch, el examen interactivo del taller Ruta E-commerce.",
  ];

  return [...header, ...body, ...footer].join("\n");
}

export function buildEvidenceFilename(result) {
  if (!result) {
    return "logimatch-evidencia.txt";
  }
  const studentSlug = slug(result.studentName) || "alumno";
  return `logimatch-${studentSlug}-${result.overallScore || 0}pct.txt`;
}

function createEmptyAssignments() {
  return MIPYMES.reduce((acc, mipyme) => {
    acc[mipyme.id] = "";
    return acc;
  }, {});
}

function sanitizeStudentName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function sanitizeAssignments(value) {
  const base = createEmptyAssignments();
  if (!value || typeof value !== "object") {
    return base;
  }
  for (const mipyme of MIPYMES) {
    const candidate = value[mipyme.id];
    if (typeof candidate === "string" && CARRIERS.some((c) => c.id === candidate)) {
      base[mipyme.id] = candidate;
    }
  }
  return base;
}

function sanitizeFullResult(value, assignments, studentName) {
  if (!value || typeof value !== "object" || !Array.isArray(value.pairs)) {
    return null;
  }
  // Re-evaluate from sanitized assignments to keep result and state consistent.
  return evaluateAllPairs(assignments, studentName);
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
