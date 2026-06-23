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

const OFFER_TYPES = [
  {
    id: "product",
    label: "Producto fisico",
    helper: "Inventario, empaque, paqueteria y entrega.",
  },
  {
    id: "service",
    label: "Servicio online",
    helper: "Agenda, canal, acceso, entregables y soporte.",
  },
  {
    id: "mixed",
    label: "Modelo mixto",
    helper: "Producto, servicio o entregables digitales combinados.",
  },
];

const SERVICE_STEP_OVERRIDES = {
  "step-1": {
    title: "Canales y registro",
    description: "Donde nacen tus solicitudes y como las documentas.",
    questions: {
      q1: {
        label: "Por donde recibo solicitudes o reservas hoy?",
        helper: "Anota el canal principal y al menos uno alterno.",
        placeholder: "Ej. Instagram para captar interesados + Calendly y correo para confirmar.",
        tags: ["WhatsApp", "Instagram", "Correo", "Calendly", "Formulario web"],
      },
      q2: {
        label: "Donde registro cada solicitud, cita o entregable?",
        helper: "Especifica la herramienta donde no se pierde el seguimiento.",
        placeholder: "Ej. CRM en Notion con estado: interesado, pagado, agendado, entregado.",
        tags: ["Google Sheets", "Notion / Trello", "CRM", "Calendario", "LMS"],
      },
      q3: {
        label: "Que datos pido antes de aceptar el servicio?",
        helper: "Piensa en lo minimo para cotizar, agendar y entregar sin improvisar.",
        placeholder: "Ej. Nombre, correo, objetivo, fecha ideal, archivos necesarios y comprobante.",
        tags: ["Nombre + correo", "Objetivo / brief", "Fecha y horario", "Comprobante de pago"],
      },
    },
  },
  "step-2": {
    title: "Transacciones y capacidad",
    description: "Como confirmas pago y no sobrevendes tu tiempo.",
    questions: {
      q4: {
        label: "Como confirmo el pago antes de agendar o iniciar?",
        helper: "Describe el proceso, no solo el medio.",
        placeholder: "Ej. Reviso transferencia o pasarela antes de bloquear el horario en calendario.",
        tags: ["Transferencia bancaria", "Stripe / Mercado Pago", "Link de pago", "Factura"],
      },
      q5: {
        label: "Como controlo mi capacidad, agenda o cupos disponibles?",
        helper: "Si agendas a mano, explica como evitas empalmes y sobreventa.",
        placeholder: "Ej. Google Calendar con bloques disponibles y maximo 4 sesiones por dia.",
        tags: ["Google Calendar", "Calendly", "Cupos por semana", "Agenda manual", "No controlo"],
      },
      q6: {
        label: "Quien entrega el servicio y por que canal?",
        helper: "Nombra la persona o rol y el medio principal de entrega.",
        placeholder: "Ej. Yo entrego por Zoom y envio materiales por correo en 24 horas.",
        tags: ["Yo mismo", "Equipo dedicado", "Zoom / Meet", "WhatsApp", "Correo"],
      },
    },
  },
  "step-3": {
    title: "Entrega del servicio",
    description: "Como preparas el acceso, el material y el canal.",
    questions: {
      q7: {
        label: "Que checklist uso antes de entregar el servicio?",
        helper: "Describe pasos concretos antes de la sesion, acceso o entrega digital.",
        placeholder: "Ej. Confirmo pago, brief, link de Zoom, carpeta Drive y recordatorio 24h antes.",
        tags: ["Brief completo", "Link confirmado", "Material listo", "Recordatorio", "Sin checklist"],
      },
      q8: {
        label: "Cual es mi canal principal de entrega?",
        helper: "Una sola opcion: donde ocurre la entrega o experiencia principal.",
        placeholder: "Ej. Google Meet para sesiones en vivo y Drive para materiales.",
        tags: ["Zoom", "Google Meet", "WhatsApp", "Correo", "LMS", "Drive / Notion"],
      },
      q9: {
        label: "Cual es mi canal alternativo si el principal falla?",
        helper: "Debe estar listo antes de necesitarlo.",
        placeholder: "Ej. Si falla Zoom, uso Meet y mando el link por correo y WhatsApp.",
        tags: ["Google Meet", "Zoom", "Correo", "WhatsApp", "Grabacion", "Drive / Notion"],
      },
    },
  },
  "step-4": {
    title: "Promesas y control",
    description: "Lo que el cliente espera y lo que mides cada semana.",
    questions: {
      q10: {
        label: "Cual es el tiempo de preparacion o respuesta que prometo?",
        helper: "En horas o dias habiles, sin vaguedades.",
        placeholder: "Ej. Confirmo agenda en menos de 24 horas habiles tras el pago.",
        tags: ["Mismo dia", "24 horas habiles", "48-72 horas", "Fecha agendada"],
      },
      q11: {
        label: "Que hare si hay retraso, no-show o falla tecnica?",
        helper: "Define protocolo: a quien avisas, cuando y con que alternativa.",
        placeholder: "Ej. Aviso antes de la hora, reagendo una fecha y mando link alternativo.",
        tags: ["Aviso al cliente", "Reagendar", "Link alterno", "Grabacion", "Reembolso parcial"],
      },
      q12: {
        label: "Que indicador medire cada semana?",
        helper: "Un KPI claro sobre cumplimiento, experiencia o seguimiento.",
        placeholder: "Ej. % de sesiones entregadas a tiempo, no-shows y NPS post-servicio.",
        tags: ["% a tiempo", "No-show", "NPS post-servicio", "Tiempo de respuesta"],
      },
    },
  },
};

const MIXED_STEP_OVERRIDES = {
  "step-2": {
    title: "Transacciones, stock y capacidad",
    description: "Como confirmas dinero y controlas piezas, cupos o agenda.",
    questions: {
      q5: {
        label: "Como controlo inventario, capacidad o cupos disponibles?",
        helper: "Aplica para producto, servicio o ambos.",
        placeholder: "Ej. Stock en Sheets y cupos semanales en Google Calendar.",
        tags: ["Kardex / Sheets", "Google Calendar", "Cupos por semana", "ERP / CRM", "No controlo"],
      },
      q6: {
        label: "Quien prepara o entrega el pedido/servicio?",
        helper: "Nombra la persona o rol y donde sucede la preparacion o entrega.",
        placeholder: "Ej. Mi equipo empaca producto y yo entrego la asesoria por Meet.",
        tags: ["Yo mismo", "Equipo dedicado", "Fulfillment", "Zoom / Meet", "Familia / apoyo"],
      },
    },
  },
  "step-3": {
    title: "Empaque o entrega",
    description: "Como cierras la caja, habilitas acceso o entregas el resultado.",
    questions: {
      q7: {
        label: "Que checklist uso antes de cerrar el paquete o entregar el servicio?",
        helper: "Describe pasos concretos, no buenas intenciones.",
        placeholder: "Ej. Reviso variante, pago, link de acceso, material y confirmacion al cliente.",
        tags: ["Foto del contenido", "Brief completo", "Link confirmado", "Material listo", "Sin checklist"],
      },
      q8: {
        label: "Cual es mi opcion principal de envio o entrega?",
        helper: "Una sola, la que usas la mayoria del tiempo.",
        placeholder: "Ej. Estafeta para producto y Google Meet para asesoria.",
        tags: ["FedEx", "Estafeta", "Uber Direct", "Zoom / Meet", "Correo", "Drive / Notion"],
      },
      q9: {
        label: "Cual es mi opcion alternativa si la primera falla?",
        helper: "Debe ser distinta a la principal y estar lista.",
        placeholder: "Ej. DHL como plan B para producto y Zoom si falla Meet.",
        tags: ["DHL", "FedEx", "Mensajeria local", "Zoom", "Google Meet", "WhatsApp"],
      },
    },
  },
  "step-4": {
    questions: {
      q11: {
        label: "Que hare si hay retraso, falla tecnica o problema de entrega?",
        helper: "Define el protocolo: a quien avisas, en cuanto tiempo, con que alternativa.",
        placeholder: "Ej. Aviso en 24h, cambio de canal o paqueteria y ofrezco compensacion si aplica.",
        tags: ["Aviso al cliente", "Reagendar", "Plan B", "Reembolso parcial", "Detalle de cortesia"],
      },
    },
  },
};

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

const SERVICE_CHANNEL_KEYWORDS = [
  "zoom",
  "meet",
  "google meet",
  "teams",
  "correo",
  "email",
  "whatsapp",
  "drive",
  "notion",
  "lms",
  "classroom",
  "hotmart",
  "calendly",
  "calendar",
  "agenda",
  "formulario",
];

const CAPACITY_EMPIRIC_KEYWORDS = [
  "a ojo",
  "memoria",
  "no tengo",
  "no controlo",
  "no llevo",
  "agenda manual",
  "como vaya saliendo",
];

const SERVICE_QUESTION_CONCEPTS = {
  q1: {
    expected: 2,
    concepts: [
      { id: "channel", any: ["whatsapp", "instagram", "facebook", "tiktok", "correo", "email", "calendly", "formulario", "landing", "web", "zoom", "meet", "lms", "hotmart", "classroom"] },
      { id: "second-channel", any: ["alterno", "ademas", "tambien", "y ", " y", "complemento", "secundario", "respaldo", "segundo"] },
    ],
  },
  q2: {
    expected: 2,
    concepts: [
      { id: "system", any: ["excel", "sheets", "google sheets", "hoja", "crm", "notion", "trello", "airtable", "clickup", "asana", "calendly", "calendar", "calendario", "lms", "drive", "software", "app"] },
      { id: "process", any: ["actualizo", "registro", "anoto", "cada", "diario", "semanal", "automatico", "automatizado", "estado", "seguimiento", "agenda"] },
    ],
  },
  q3: {
    expected: 3,
    concepts: [
      { id: "name", any: ["nombre", "cliente"] },
      { id: "contact", any: ["telefono", "celular", "correo", "email", "whatsapp"] },
      { id: "service-context", any: ["objetivo", "brief", "necesidad", "diagnostico", "archivo", "requisito", "fecha", "horario", "agenda", "zona horaria"] },
      { id: "payment", any: ["pago", "comprobante", "transferencia", "factura"] },
    ],
  },
  q5: {
    expected: 2,
    concepts: [
      { id: "capacity-tool", any: ["agenda", "calendario", "calendar", "calendly", "cupos", "horarios", "disponibilidad", "slots", "notion", "sheets", "crm"] },
      { id: "limit", any: ["diario", "semanal", "cada", "maximo", "limite", "bloque", "bloques", "actualizo", "registro", "reviso"] },
    ],
    negativePenalty: CAPACITY_EMPIRIC_KEYWORDS,
  },
  q6: {
    expected: 2,
    concepts: [
      { id: "person", any: ["yo", "equipo", "asistente", "empleado", "socio", "consultor", "facilitador", "profesor", "tercero"] },
      { id: "channel", any: ["zoom", "meet", "teams", "whatsapp", "correo", "email", "drive", "notion", "lms", "classroom", "hotmart"] },
    ],
  },
  q7: {
    expected: 2,
    concepts: [
      { id: "prepare", any: ["reviso", "verifico", "valido", "checklist", "lista", "brief", "agenda", "pago", "confirmo", "recordatorio"] },
      { id: "access", any: ["link", "zoom", "meet", "drive", "notion", "material", "archivo", "acceso", "carpeta", "grabacion"] },
    ],
    negativePenalty: ["sin checklist", "no reviso", "no checo", "no tengo proceso"],
  },
  q8: {
    expected: 1,
    concepts: [
      { id: "service-channel", any: SERVICE_CHANNEL_KEYWORDS },
    ],
  },
  q9: {
    expected: 1,
    concepts: [
      { id: "backup-channel", any: SERVICE_CHANNEL_KEYWORDS },
    ],
  },
  q10: {
    expected: 1,
    concepts: [
      { id: "time", any: ["hora", "horas", "dia", "dias", "habil", "habiles", "24", "48", "72", "mismo dia", "siguiente", "fecha", "agendada"] },
    ],
    negativePenalty: ["rapido", "pronto", "lo antes posible", "asap"],
  },
  q11: {
    expected: 2,
    concepts: [
      { id: "communicate", any: ["aviso", "avisar", "informar", "notificar", "contactar", "comunicar", "mensaje", "llamar", "escribir"] },
      { id: "action", any: ["reagendo", "reagendar", "reprogramo", "reprogramar", "reembolso", "link alterno", "link", "grabacion", "soporte", "compensacion", "descuento", "plan b"] },
    ],
  },
  q12: {
    expected: 1,
    concepts: [
      { id: "metric", any: ["%", "porcentaje", "tasa", "numero", "cantidad", "nps", "no-show", "no show", "asistencia", "tiempo de", "tiempo promedio", "respuesta", "kpi", "satisfaccion"] },
    ],
    negativePenalty: ["ninguno", "no se", "todavia no"],
  },
};

const MIXED_QUESTION_CONCEPTS = {
  q5: {
    expected: 2,
    concepts: [
      { id: "control", any: ["excel", "kardex", "sheets", "software", "sistema", "erp", "crm", "inventario", "agenda", "calendario", "cupos", "disponibilidad", "calendly"] },
      { id: "frequency", any: ["diario", "semanal", "cada", "actualizo", "registro", "reviso", "cierre", "corte", "maximo", "limite"] },
    ],
    negativePenalty: ["a ojo", "memoria", "no tengo", "no controlo", "no llevo"],
  },
  q6: {
    expected: 2,
    concepts: [
      { id: "person", any: ["yo", "equipo", "asistente", "empleado", "familia", "socio", "maquila", "fulfillment", "consultor", "tercero"] },
      { id: "place-channel", any: ["casa", "bodega", "oficina", "local", "almacen", "zoom", "meet", "whatsapp", "correo", "drive"] },
    ],
  },
  q7: {
    expected: 2,
    concepts: [
      { id: "verify", any: ["reviso", "verifico", "valido", "checklist", "lista", "foto", "brief", "pago", "confirmo", "variante"] },
      { id: "delivery-ready", any: ["sello", "cinta", "relleno", "guia", "link", "material", "archivo", "acceso", "drive", "notion"] },
    ],
    negativePenalty: ["sin checklist", "no reviso", "no checo", "no tengo proceso"],
  },
  q8: {
    expected: 1,
    concepts: [
      { id: "fulfillment", any: [...CARRIER_KEYWORDS, ...SERVICE_CHANNEL_KEYWORDS] },
    ],
  },
  q9: {
    expected: 1,
    concepts: [
      { id: "backup", any: [...CARRIER_KEYWORDS, ...SERVICE_CHANNEL_KEYWORDS] },
    ],
  },
};

export function getLogiCoachOfferTypes() {
  return OFFER_TYPES.map((type) => ({ ...type }));
}

export function sanitizeOfferType(value) {
  return OFFER_TYPES.some((type) => type.id === value) ? value : "product";
}

export function getLogiCoachSteps(offerType = "product") {
  return getStepsForOfferType(offerType).map((step) => ({
    ...step,
    questions: step.questions.map((q) => ({ ...q, tags: [...q.tags] })),
  }));
}

export function getLogiCoachQuestions(offerType = "product") {
  return getStepsForOfferType(offerType).flatMap((step) => step.questions.map((q) => ({ ...q, stepId: step.id })));
}

export function getQuestionById(id) {
  const entry = QUESTION_INDEX[id];
  return entry ? { ...entry.question, stepId: entry.stepId } : null;
}

function getStepsForOfferType(offerType) {
  const sanitized = sanitizeOfferType(offerType);
  const overrides = sanitized === "service" ? SERVICE_STEP_OVERRIDES : sanitized === "mixed" ? MIXED_STEP_OVERRIDES : {};
  return STEPS.map((step) => {
    const stepOverride = overrides[step.id] || {};
    const questionOverrides = stepOverride.questions || {};
    return {
      ...step,
      ...stepOverride,
      questions: step.questions.map((question) => ({
        ...question,
        ...(questionOverrides[question.id] || {}),
      })),
    };
  });
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
    studentName: "",
    studentEmail: "",
    businessActivity: "",
    offerType: "product",
    answers,
    evaluation: null,
    plan: null,
    planStatus: "idle",
    deliveryStatus: "idle",
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
  const offerType = sanitizeOfferType(value.offerType);
  const evaluation = stage === "result" ? sanitizeEvaluation(value.evaluation, answers, offerType) : null;
  const plan = stage === "result" ? sanitizePlan(value.plan) : null;

  return {
    stage,
    currentStep,
    studentName: sanitizeShortText(value.studentName, 80),
    studentEmail: sanitizeEmail(value.studentEmail),
    businessActivity: sanitizeShortText(value.businessActivity, 200),
    offerType,
    answers,
    evaluation,
    plan,
    planStatus: sanitizePlanStatus(value.planStatus),
    deliveryStatus: sanitizeDeliveryStatus(value.deliveryStatus),
  };
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

export function isReadyForDiagnostic(state) {
  if (!state) {
    return false;
  }
  if (!isValidEmail(state.studentEmail)) {
    return false;
  }
  if (!String(state.businessActivity || "").trim()) {
    return false;
  }
  return getAnsweredCount(state.answers) >= 6;
}

export function buildLogiCoachPrompt(state) {
  const offerType = sanitizeOfferType(state.offerType);
  const offerTypeLabel = getOfferTypeLabel(offerType);
  const steps = getStepsForOfferType(offerType);
  const evaluation = state.evaluation || evaluateLogiCoach(state.answers, offerType);
  const lines = [
    "Eres un consultor logistico senior en e-commerce que prepara un plan operativo personalizado para un alumno mexicano.",
    "Tu concepto de logistica debe adaptarse al tipo de oferta: en producto fisico implica inventario, empaque y paqueteria; en servicio online implica agenda, canal, acceso, entregables, soporte y cumplimiento de promesa.",
    "Devuelve EXCLUSIVAMENTE un JSON valido con la siguiente estructura:",
    "{",
    '  "headline": "frase corta y poderosa que resuma la situacion",',
    '  "summary": "parrafo de 2-3 lineas con el contexto del alumno",',
    '  "strengths": ["3-4 fortalezas concretas detectadas en sus respuestas"],',
    '  "risks": ["3-4 riesgos especificos a su negocio"],',
    '  "thirtyDayPlan": [',
    '    {"week": "Semana 1", "focus": "...", "actions": ["accion 1", "accion 2"]},',
    '    {"week": "Semana 2", "focus": "...", "actions": ["..."]},',
    '    {"week": "Semana 3", "focus": "...", "actions": ["..."]},',
    '    {"week": "Semana 4", "focus": "...", "actions": ["..."]}',
    "  ],",
    '  "checklist": ["6-8 items accionables para esta semana"],',
    '  "metrics": ["3-4 KPIs concretos que debe medir esta semana"]',
    "}",
    "",
    "Contexto del alumno:",
    `- Nombre: ${state.studentName || "(sin nombre)"}`,
    `- Correo: ${state.studentEmail || "(sin correo)"}`,
    `- Negocio: ${state.businessActivity || "(sin descripcion)"}`,
    `- Tipo de oferta: ${offerTypeLabel}`,
    `- Score de madurez actual: ${evaluation.score}/100 (${evaluation.level.label})`,
    "",
    "Respuestas a las 12 preguntas:",
  ];

  for (const step of steps) {
    lines.push("", `[${step.title}]`);
    for (const question of step.questions) {
      const answer = String(state.answers?.[question.id] || "").trim() || "(sin respuesta)";
      lines.push(`${question.id} · ${question.label}`);
      lines.push(`Respuesta: ${answer}`);
    }
  }

  if (evaluation.alerts.length > 0) {
    lines.push("", "Alertas detectadas:");
    for (const alert of evaluation.alerts) {
      lines.push(`- ${alert.title}: ${alert.detail}`);
    }
  }

  lines.push(
    "",
    "Reglas para tu respuesta:",
    "- Habla en segunda persona (tu).",
    "- Aterriza todo al giro y operacion del alumno; usa lenguaje claro de e-commerce mexicano.",
    "- Si el tipo de oferta es servicio online, no fuerces paqueterias ni empaque: habla de agenda, canales de entrega, accesos, sesiones, entregables, no-shows y soporte.",
    "- Si el tipo de oferta es mixto, separa recomendaciones para producto fisico y para servicio/entregable digital cuando aplique.",
    "- Si una respuesta es vaga, intuye y da la mejor recomendacion sin pedir mas datos.",
    "- No inventes herramientas que no existen; cita Estafeta, FedEx, DHL, 99 Minutos, Uber Direct, Shopify, Tiendanube, WhatsApp Business, Excel, Google Calendar, Calendly, Zoom, Google Meet, Drive, Notion, LMS y similares cuando aplique.",
    "- Mantente bajo 1500 palabras en total.",
  );

  return lines.join("\n");
}

export async function requestLogiCoachPlan(state) {
  try {
    const response = await fetch("/api/logicoach-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: {
          studentName: state.studentName,
          studentEmail: state.studentEmail,
          businessActivity: state.businessActivity,
          offerType: sanitizeOfferType(state.offerType),
          answers: state.answers,
          evaluation: state.evaluation,
        },
        prompt: buildLogiCoachPrompt(state),
      }),
    });

    if (!response.ok) {
      throw new Error(`logicoach-plan endpoint failed with status ${response.status}`);
    }

    const payload = await response.json();
    const normalized = normalizePlan(payload.plan, state);
    normalized.mode = payload.mode || "live";
    normalized.model = payload.model || "";
    return normalized;
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 320));
    const mock = buildMockPlan(state);
    mock.mode = "mock";
    mock.model = "";
    return mock;
  }
}

export function buildMockPlan(state) {
  const offerType = sanitizeOfferType(state.offerType);
  const evaluation = state.evaluation || evaluateLogiCoach(state.answers, offerType);
  const activity = state.businessActivity || "tu negocio";
  if (offerType === "service") {
    return {
      headline: `Plan de entrega online para ${activity}.`,
      summary: `Tu operacion de servicio necesita convertir la promesa en un flujo claro: solicitud, pago, agenda, entrega y seguimiento. El nivel actual es ${evaluation.level.label.toLowerCase()}.`,
      strengths: ["Ya puedes identificar tus canales de captacion.", "El servicio puede estandarizarse sin inventario fisico.", "Tienes oportunidad de crear una experiencia muy clara con mensajes y recordatorios."],
      risks: ["Depender de WhatsApp puede perder solicitudes o acuerdos.", "Si no controlas cupos, sobrevendes tu tiempo.", "Falta un canal alternativo si falla la videollamada o el acceso."],
      thirtyDayPlan: [
        {
          week: "Semana 1",
          focus: "Centralizar solicitudes",
          actions: ["Crea una hoja o CRM unico para solicitudes, pagos, fechas y estado.", "Define los datos minimos antes de aceptar una cita o proyecto."],
        },
        {
          week: "Semana 2",
          focus: "Controlar capacidad",
          actions: ["Bloquea cupos reales en Google Calendar o Calendly.", "Define maximos por dia o semana para no sobrevender agenda."],
        },
        {
          week: "Semana 3",
          focus: "Estandarizar entrega",
          actions: ["Documenta el checklist previo: pago, brief, link, material y recordatorio.", "Prepara un canal alternativo: Meet si falla Zoom, correo si falla WhatsApp."],
        },
        {
          week: "Semana 4",
          focus: "Medir cumplimiento",
          actions: ["Mide sesiones entregadas a tiempo, no-shows y tiempo de respuesta.", "Registra incidencias para mejorar mensajes y recordatorios."],
        },
      ],
      checklist: [
        "Define canal principal y canal alternativo de entrega.",
        "Crea una plantilla de solicitud con datos minimos.",
        "Bloquea cupos reales en calendario.",
        "Prepara mensaje de confirmacion, recordatorio y reprogramacion.",
        "Mide tu primera semana con 1 KPI de cumplimiento.",
      ],
      metrics: [
        "% de sesiones o entregables entregados a tiempo.",
        "Tasa de no-show o reprogramacion.",
        "Tiempo promedio de respuesta al cliente.",
      ],
    };
  }

  return {
    headline: `Plan inicial para ${activity}.`,
    summary: `Tu plan logistico arranca con un nivel ${evaluation.level.label.toLowerCase()}. Hay bases que conviene reforzar y otras que ya estas atendiendo bien.`,
    strengths: ["Ya identificas tus canales principales.", "Reconoces los riesgos al describir tu inventario.", "Tienes claridad de lo que te pide tu cliente."],
    risks: ["Tu operacion depende mucho de canales manuales.", "El control de stock necesita herramientas concretas.", "Falta protocolo claro de retraso o devolucion."],
    thirtyDayPlan: [
      {
        week: "Semana 1",
        focus: "Centralizar pedidos",
        actions: ["Implementa una hoja de calculo unica para todos los pedidos.", "Define los datos minimos que pides antes de aceptar venta."],
      },
      {
        week: "Semana 2",
        focus: "Inventario controlado",
        actions: ["Crea un Kardex en Excel con stock minimo por SKU.", "Cierra el dia con un corte y registra entradas/salidas."],
      },
      {
        week: "Semana 3",
        focus: "Logistica con plan B",
        actions: ["Abre cuenta con una paqueteria alterna a la principal.", "Documenta tu checklist de empaque antes de cerrar el paquete."],
      },
      {
        week: "Semana 4",
        focus: "Medicion semanal",
        actions: ["Mide pedidos a tiempo vs tarde.", "Registra incidencias y tiempo de respuesta a quejas."],
      },
    ],
    checklist: [
      "Define hoy tu canal principal y uno alterno.",
      "Crea o estandariza tu hoja de pedidos.",
      "Anota tus paqueterias principal y de respaldo.",
      "Documenta un protocolo de retraso (que dices, en cuanto tiempo).",
      "Mide tu primera semana con 1 indicador claro.",
    ],
    metrics: [
      "% de pedidos entregados a tiempo.",
      "# de incidencias logisticas por semana.",
      "Tiempo promedio de respuesta a queja.",
    ],
  };
}

export function getTotalSteps() {
  return STEPS.length;
}

export function getTotalQuestions(offerType = "product") {
  return getStepsForOfferType(offerType).reduce((total, step) => total + step.questions.length, 0);
}

export function getAnsweredCount(answers, offerType = "product") {
  return getLogiCoachQuestions(offerType).filter((question) => isMeaningful(answers[question.id])).length;
}

export function getStepProgress(answers, stepIndex, offerType = "product") {
  const step = getStepsForOfferType(offerType)[stepIndex];
  if (!step) {
    return 0;
  }
  const answered = step.questions.filter((q) => isMeaningful(answers[q.id])).length;
  return Math.round((answered / step.questions.length) * 100);
}

export function getMissingQuestionsInStep(answers, stepIndex, offerType = "product") {
  const step = getStepsForOfferType(offerType)[stepIndex];
  if (!step) {
    return [];
  }
  return step.questions.filter((q) => !isMeaningful(answers[q.id])).map((q) => q.id);
}

export function evaluateLogiCoach(answers, offerType = "product") {
  const score = computeScore(answers, offerType);
  const level = getLevel(score);
  const alerts = detectAlerts(answers, offerType);

  return {
    score,
    level,
    offerType: sanitizeOfferType(offerType),
    alerts,
    timestamp: new Date().toISOString(),
  };
}

export function buildLogiCoachMarkdown(state) {
  const answers = state.answers || {};
  const offerType = sanitizeOfferType(state.offerType);
  const evaluation = state.evaluation || evaluateLogiCoach(answers, offerType);
  const steps = getStepsForOfferType(offerType);

  const lines = [
    "# Plan logistico personal — LogiCoach",
    "",
    `**Tipo de oferta:** ${getOfferTypeLabel(offerType)}`,
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

  for (const step of steps) {
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

function getOfferTypeLabel(offerType) {
  return OFFER_TYPES.find((type) => type.id === sanitizeOfferType(offerType))?.label || "Producto fisico";
}

function computeScore(answers, offerType = "product") {
  const questions = getLogiCoachQuestions(offerType);
  const perQuestion = 100 / questions.length;
  let total = 0;

  for (const question of questions) {
    total += scoreQuestion(question.id, answers[question.id], offerType) * perQuestion;
  }

  return Math.round(Math.min(100, Math.max(0, total)));
}

export function scoreQuestion(questionId, rawAnswer, offerType = "product") {
  const raw = String(rawAnswer || "").trim();
  if (raw.length === 0) {
    return 0;
  }
  const normalized = normalize(raw);
  const config = getQuestionConceptConfig(questionId, offerType);
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

function getQuestionConceptConfig(questionId, offerType) {
  const sanitized = sanitizeOfferType(offerType);
  if (sanitized === "service" && SERVICE_QUESTION_CONCEPTS[questionId]) {
    return SERVICE_QUESTION_CONCEPTS[questionId];
  }
  if (sanitized === "mixed" && MIXED_QUESTION_CONCEPTS[questionId]) {
    return MIXED_QUESTION_CONCEPTS[questionId];
  }
  return QUESTION_CONCEPTS[questionId];
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

function detectAlerts(answers, offerType = "product") {
  const sanitizedOfferType = sanitizeOfferType(offerType);
  const isService = sanitizedOfferType === "service";
  const isMixed = sanitizedOfferType === "mixed";
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
        isService
          ? "Operar servicios solo por canales manuales causara citas perdidas, acuerdos ambiguos y seguimiento debil. Planea un CRM, agenda o formulario centralizado."
          : "Operar por canales manuales causara perdida de pedidos al escalar. Planea una transicion a un e-commerce formal o concentrador de pedidos.",
      trigger: channelHit,
    });
  }

  const q5 = normalize(answers.q5);
  const capacityKeywords = isService ? CAPACITY_EMPIRIC_KEYWORDS : [...INVENTORY_EMPIRIC_KEYWORDS, ...CAPACITY_EMPIRIC_KEYWORDS];
  const capacityHit = capacityKeywords.find((keyword) => q5.includes(keyword));
  if (capacityHit) {
    alerts.push({
      id: isService ? "empiric-capacity" : "empiric-inventory",
      icon: "🚨",
      tone: "danger",
      title: isService ? "Peligro de sobreventa de agenda" : isMixed ? "Peligro de descontrol operativo" : "Peligro de quiebre de stock",
      detail:
        isService
          ? "Vender servicios sin cupos reales destruye la experiencia: empalmes, no-shows y entregables tarde. Implementa calendario, cupos y limites por semana."
          : isMixed
            ? "Vender sin control de inventario o capacidad te expone a prometer mas de lo que puedes cumplir. Separa stock, agenda y responsables."
            : "Vender sin inventario real destruye la confianza del cliente. Es urgente implementar minimo una plantilla con stock de seguridad.",
      trigger: capacityHit,
    });
  }

  const q8 = normalize(answers.q8);
  const q9 = normalize(answers.q9);
  const route8 = isService ? detectServiceChannel(q8) : isMixed ? detectFulfillmentRoute(q8) : detectCarrier(q8);
  const route9 = isService ? detectServiceChannel(q9) : isMixed ? detectFulfillmentRoute(q9) : detectCarrier(q9);
  const sameRoute = route8 && route9 && route8 === route9;
  if (!q9 || q9 === q8 || sameRoute) {
    alerts.push({
      id: isService ? "single-delivery-channel" : "single-carrier",
      icon: "⚠️",
      tone: "warning",
      title: isService ? "Vulnerabilidad de canal de entrega" : "Vulnerabilidad en distribucion",
      detail:
        isService
          ? "Depender de un solo canal para entregar el servicio te expone a fallas tecnicas, links caidos o clientes sin acceso. Define un canal alternativo listo."
          : "Depender de una sola paqueteria te expone a paros logisticos y retrasos fuera de tu control. Registra un plan de respaldo distinto al principal.",
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

function detectServiceChannel(value) {
  if (!value) {
    return "";
  }
  for (const keyword of SERVICE_CHANNEL_KEYWORDS) {
    if (value.includes(keyword)) {
      return keyword.replace(/\s+/g, "");
    }
  }
  return "";
}

function detectFulfillmentRoute(value) {
  return detectCarrier(value) || detectServiceChannel(value);
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

function sanitizeEvaluation(value, answers, offerType = "product") {
  if (!value || typeof value !== "object") {
    return evaluateLogiCoach(answers, offerType);
  }
  const score = Number(value.score);
  if (!Number.isFinite(score)) {
    return evaluateLogiCoach(answers, offerType);
  }
  return {
    score: Math.round(Math.min(100, Math.max(0, score))),
    level: getLevel(score),
    offerType: sanitizeOfferType(value.offerType || offerType),
    alerts: Array.isArray(value.alerts) ? value.alerts.filter(Boolean) : [],
    timestamp: typeof value.timestamp === "string" ? value.timestamp : new Date().toISOString(),
  };
}

function sanitizeShortText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeEmail(value) {
  const text = String(value || "").trim().slice(0, 120);
  return text;
}

function sanitizePlanStatus(value) {
  return ["idle", "loading", "ready", "error"].includes(value) ? value : "idle";
}

function sanitizeDeliveryStatus(value) {
  return ["idle", "sending", "sent", "error"].includes(value) ? value : "idle";
}

function sanitizePlan(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  return normalizePlan(value);
}

function normalizePlan(value, state) {
  if (!value || typeof value !== "object") {
    return buildMockPlan(state || createDefaultLogiCoachState());
  }
  const arrayOrEmpty = (input) => (Array.isArray(input) ? input.filter((item) => typeof item === "string" && item.trim().length > 0).map((item) => item.trim().slice(0, 400)) : []);
  const plan = {
    headline: sanitizeShortText(value.headline, 200),
    summary: String(value.summary || "").slice(0, 800),
    strengths: arrayOrEmpty(value.strengths),
    risks: arrayOrEmpty(value.risks),
    thirtyDayPlan: Array.isArray(value.thirtyDayPlan)
      ? value.thirtyDayPlan.slice(0, 6).map((week) => ({
          week: sanitizeShortText(week?.week, 40) || "Semana",
          focus: sanitizeShortText(week?.focus, 120) || "Foco de la semana",
          actions: arrayOrEmpty(week?.actions),
        }))
      : [],
    checklist: arrayOrEmpty(value.checklist),
    metrics: arrayOrEmpty(value.metrics),
    mode: value.mode || "live",
    model: value.model || "",
  };
  return plan;
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
