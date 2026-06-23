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

const SERVICE_CHANNELS = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    nickname: "El mostrador digital: rapido, cercano y manual",
    coverage: "Clientes que necesitan respuesta inmediata desde el celular.",
    cost: "Bajo. Requiere disciplina operativa mas que inversion.",
    time: "Minutos a pocas horas si hay responsable asignado.",
    strengths: [
      "Barrera de entrada casi nula para el cliente.",
      "Muy util para dudas rapidas, confirmaciones y seguimiento corto.",
      "Permite notas de voz, fotos y mensajes personalizados.",
      "Catalogo, etiquetas y respuestas rapidas ayudan a ordenar conversaciones.",
    ],
    weaknesses: [
      "Se vuelve caotico con muchos clientes si no hay etiquetas.",
      "No es ideal para entregables complejos o proyectos largos.",
      "La trazabilidad depende de que alguien documente acuerdos.",
    ],
    idealFor: "Servicios de respuesta rapida, venta consultiva simple o soporte de baja complejidad.",
    badges: [
      { label: "Inmediato", tone: "emerald" },
      { label: "Manual", tone: "amber" },
      { label: "Bajo costo", tone: "emerald" },
    ],
  },
  {
    id: "calendly-meet",
    name: "Calendly + Google Meet",
    nickname: "El consultorio ordenado: agenda, confirma y entrega",
    coverage: "Servicios uno a uno con cita, recordatorios y videollamada.",
    cost: "Bajo a medio. Puede operar con planes gratuitos o basicos.",
    time: "Agenda automatizada + entrega en fecha y hora definida.",
    strengths: [
      "Reduce idas y vueltas para agendar.",
      "Bloquea disponibilidad real y evita empalmes.",
      "Genera link de videollamada y recordatorios.",
      "Encaja muy bien con asesorias, clases y sesiones privadas.",
    ],
    weaknesses: [
      "No administra bien cursos masivos o comunidades.",
      "No sustituye un CRM para proyectos largos.",
      "Depende de que el alumno configure horarios y buffers.",
    ],
    idealFor: "Consultorias, clases, sesiones privadas, coaching o diagnosticos personalizados.",
    badges: [
      { label: "Agenda automatica", tone: "indigo" },
      { label: "1:1", tone: "emerald" },
      { label: "Recordatorios", tone: "emerald" },
    ],
  },
  {
    id: "zoom-webinar",
    name: "Zoom Webinar / Meet grupal",
    nickname: "El auditorio online: todos entran a la misma sala",
    coverage: "Eventos en vivo, talleres grupales y sesiones con muchos asistentes.",
    cost: "Medio. Sube si necesitas webinar, grabacion o salas.",
    time: "Entrega sincronica en fecha y hora especifica.",
    strengths: [
      "Soporta audiencias grupales.",
      "Permite grabacion, chat, preguntas y control de participantes.",
      "Funciona bien para talleres, masterclasses y sesiones en vivo.",
      "El cliente entiende la promesa: entrar a una sala en un horario.",
    ],
    weaknesses: [
      "No resuelve por si solo acceso posterior ni materiales.",
      "Requiere recordatorios para evitar no-shows.",
      "Puede fallar si no hay plan alternativo de link o grabacion.",
    ],
    idealFor: "Talleres grupales, webinars, clases en vivo y lanzamientos sincronicos.",
    badges: [
      { label: "Grupal", tone: "indigo" },
      { label: "En vivo", tone: "emerald" },
      { label: "No-show risk", tone: "amber" },
    ],
  },
  {
    id: "lms-hotmart",
    name: "LMS / Hotmart / Classroom",
    nickname: "La escuela digital: acceso, modulos y avance",
    coverage: "Cursos grabados, membresias, lecciones y contenido bajo demanda.",
    cost: "Medio. Plataforma cobra plan, comision o requiere configuracion.",
    time: "Acceso inmediato o por modulos despues del pago.",
    strengths: [
      "Automatiza acceso, lecciones, progreso y materiales.",
      "Escala a muchos alumnos sin depender de WhatsApp.",
      "Permite orden pedagogico y evidencia de consumo.",
      "Reduce soporte repetitivo cuando el contenido esta bien estructurado.",
    ],
    weaknesses: [
      "No sirve para un servicio altamente personalizado.",
      "Necesita produccion previa de contenido.",
      "Si el onboarding es pobre, el alumno se pierde aunque tenga acceso.",
    ],
    idealFor: "Cursos grabados, programas asincronicos, membresias y academias digitales.",
    badges: [
      { label: "Asincronico", tone: "indigo" },
      { label: "Escalable", tone: "emerald" },
      { label: "Acceso digital", tone: "emerald" },
    ],
  },
  {
    id: "drive-notion",
    name: "Drive + Notion",
    nickname: "La mesa de proyecto: brief, archivos y avances",
    coverage: "Servicios con entregables, documentos, revisiones y archivos pesados.",
    cost: "Bajo a medio. Depende de almacenamiento y plantillas.",
    time: "Entrega por hitos, carpetas y fechas pactadas.",
    strengths: [
      "Ordena briefs, versiones, entregables y comentarios.",
      "Hace visible el avance de proyectos largos.",
      "Evita perder archivos en chats.",
      "Funciona muy bien para diseno, consultoria documental y contenido.",
    ],
    weaknesses: [
      "No agenda citas por si solo.",
      "No es ideal para soporte inmediato.",
      "Requiere permisos bien configurados para no confundir al cliente.",
    ],
    idealFor: "Diseno, branding, consultoria con documentos, contenido y entregables digitales.",
    badges: [
      { label: "Entregables", tone: "indigo" },
      { label: "Archivos", tone: "emerald" },
      { label: "Proyecto", tone: "slate" },
    ],
  },
  {
    id: "helpdesk-crm",
    name: "Helpdesk / CRM por correo",
    nickname: "La bitacora formal: tickets, SLA y responsables",
    coverage: "Soporte, incidencias, clientes recurrentes y seguimiento posventa.",
    cost: "Medio. Puede iniciar con correo ordenado y crecer a helpdesk.",
    time: "Respuesta por SLA: horas o dias habiles definidos.",
    strengths: [
      "Da trazabilidad a cada caso.",
      "Permite asignar responsable y estado.",
      "Reduce el caos de promesas hechas por chat.",
      "Ideal cuando hay volumen, reclamos o seguimiento formal.",
    ],
    weaknesses: [
      "No se siente tan inmediato como WhatsApp.",
      "Puede ser demasiado formal para ventas simples.",
      "Requiere reglas claras de tiempos de respuesta.",
    ],
    idealFor: "Soporte posventa, servicios recurrentes, incidencias y operaciones con SLA.",
    badges: [
      { label: "Trazabilidad", tone: "indigo" },
      { label: "SLA", tone: "emerald" },
      { label: "Formal", tone: "slate" },
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

const SERVICE_CASES = [
  {
    id: "consulting",
    name: 'Consultoria "Estrategia 1:1"',
    headline: "Asesoria premium por videollamada con diagnostico personalizado",
    product: "Sesion individual, diagnostico previo y plan de accion posterior.",
    ticket: "$2,500 MXN",
    fragility: { label: "Alta", tone: "red", detail: "Depende de agenda, puntualidad y confianza." },
    urgency: { label: "Media", tone: "amber", detail: "Cliente acepta cita, pero no tolera desorden." },
    destinations: "Clientes nacionales e internacionales en distintos horarios.",
    volume: "8-12 sesiones semanales.",
    priority:
      "Agenda clara + link confiable + recordatorios. El valor esta en llegar preparado a la sesion.",
  },
  {
    id: "course",
    name: 'Curso "Excel para Emprender"',
    headline: "Curso grabado con modulos, plantillas y acceso inmediato",
    product: "Lecciones grabadas, recursos descargables y avance autoguiado.",
    ticket: "$799 MXN",
    fragility: { label: "Media", tone: "amber", detail: "La entrega falla si el alumno no encuentra accesos." },
    urgency: { label: "Alta", tone: "red", detail: "Despues de pagar, espera acceso inmediato." },
    destinations: "Alumnos de todo Mexico, sin horario fijo.",
    volume: "100+ alumnos por lanzamiento.",
    priority:
      "Acceso automatico, orden de modulos y materiales centralizados. WhatsApp no escala.",
  },
  {
    id: "branding",
    name: 'Estudio "Marca Clara"',
    headline: "Servicio de identidad visual con entregables por etapas",
    product: "Brief, moodboard, logotipo, manual basico y archivos finales.",
    ticket: "$8,500 MXN",
    fragility: { label: "Alta", tone: "red", detail: "Muchas versiones, archivos y aprobaciones." },
    urgency: { label: "Media", tone: "amber", detail: "Importa cumplir hitos mas que responder en segundos." },
    destinations: "Clientes remotos con revisiones semanales.",
    volume: "4-6 proyectos activos.",
    priority:
      "Control de versiones + comentarios + carpeta unica. Perder archivos en chat mata la experiencia.",
  },
  {
    id: "workshop",
    name: 'Taller "Ventas en Vivo"',
    headline: "Workshop grupal online con fecha, cupo y grabacion",
    product: "Sesion en vivo de 2 horas, materiales y replay.",
    ticket: "$450 MXN",
    fragility: { label: "Media", tone: "amber", detail: "El riesgo real es no-show y fallas de acceso." },
    urgency: { label: "Critica", tone: "red", detail: "Todo sucede en una fecha y hora." },
    destinations: "Grupo de 60-100 asistentes.",
    volume: "1-2 talleres por mes.",
    priority:
      "Sala estable, recordatorios y grabacion. Si el link falla, todo el grupo se afecta.",
  },
  {
    id: "support",
    name: 'Soporte "Tienda Sin Caos"',
    headline: "Servicio mensual de soporte operativo para tiendas online",
    product: "Dudas, incidencias, ajustes menores y seguimiento posventa.",
    ticket: "$1,200 MXN mensual",
    fragility: { label: "Alta", tone: "red", detail: "El cliente mide confianza por trazabilidad." },
    urgency: { label: "Alta", tone: "red", detail: "Requiere tiempos de respuesta prometidos." },
    destinations: "Clientes recurrentes con varias solicitudes al mes.",
    volume: "40-70 tickets mensuales.",
    priority:
      "Bitacora, responsable y SLA. Si todo queda en chat, se pierden acuerdos.",
  },
  {
    id: "coaching",
    name: 'Coaching "Nutricion Practica"',
    headline: "Programa de seguimiento online con sesiones privadas",
    product: "Consulta inicial, seguimiento por semanas y material personalizado.",
    ticket: "$1,600 MXN",
    fragility: { label: "Alta", tone: "red", detail: "Requiere privacidad, puntualidad y continuidad." },
    urgency: { label: "Media", tone: "amber", detail: "Necesita agenda estable y seguimiento." },
    destinations: "Clientes 1:1 con horarios variables.",
    volume: "20-30 sesiones mensuales.",
    priority:
      "Agenda privada, videollamada clara y recordatorios. La experiencia se rompe si hay empalmes.",
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

const SERVICE_MATCH_MATRIX = {
  consulting: {
    "calendly-meet": {
      score: 100,
      feedback:
        "Excelente: automatizas agenda, evitas empalmes y entregas la consultoria por un canal claro con recordatorios.",
    },
    "zoom-webinar": {
      score: 75,
      feedback:
        "Funciona para videollamada, pero es mas pesado de lo necesario para sesiones 1:1 y no resuelve tan bien la disponibilidad.",
    },
    "drive-notion": {
      score: 70,
      feedback:
        "Muy util para materiales y plan posterior, pero no resuelve por si solo la agenda ni el link de la sesion.",
    },
    "helpdesk-crm": {
      score: 65,
      feedback:
        "Da trazabilidad, pero se siente demasiado formal para una consultoria 1:1 si no se combina con agenda y videollamada.",
    },
    whatsapp: {
      score: 50,
      feedback:
        "Sirve para confirmar, pero vender una consultoria premium solo por WhatsApp aumenta empalmes, olvidos y acuerdos ambiguos.",
    },
    "lms-hotmart": {
      score: 30,
      feedback:
        "Un LMS sirve para contenido grabado, no para entregar una sesion personalizada con agenda y diagnostico en vivo.",
    },
  },
  course: {
    "lms-hotmart": {
      score: 100,
      feedback:
        "Excelente: el alumno paga, entra, ve modulos, descarga recursos y avanza sin depender de mensajes manuales.",
    },
    "drive-notion": {
      score: 70,
      feedback:
        "Puede organizar materiales, pero no mide avance ni automatiza acceso tan bien como una plataforma de curso.",
    },
    "helpdesk-crm": {
      score: 55,
      feedback:
        "Ayuda a soporte, pero no es el canal principal de entrega para lecciones, modulos y recursos.",
    },
    "zoom-webinar": {
      score: 45,
      feedback:
        "Funciona para una clase en vivo, pero el caso pide curso grabado con acceso inmediato y avance autoguiado.",
    },
    whatsapp: {
      score: 35,
      feedback:
        "WhatsApp se satura con 100+ alumnos y no entrega una experiencia ordenada de modulos y progreso.",
    },
    "calendly-meet": {
      score: 25,
      feedback:
        "Agendar citas no resuelve un curso grabado. Estarias convirtiendo un producto escalable en trabajo manual.",
    },
  },
  branding: {
    "drive-notion": {
      score: 100,
      feedback:
        "Excelente: centralizas brief, versiones, aprobaciones y archivos finales sin perder entregables en chats.",
    },
    "helpdesk-crm": {
      score: 85,
      feedback:
        "Buena opcion para trazabilidad y responsables, aunque necesita una carpeta de archivos para entregables pesados.",
    },
    "calendly-meet": {
      score: 70,
      feedback:
        "Sirve para juntas de revision, pero no controla versiones ni archivos finales por si solo.",
    },
    "zoom-webinar": {
      score: 60,
      feedback:
        "Puede servir para revisar avances en vivo, pero es debil para gestionar archivos, comentarios y aprobaciones.",
    },
    whatsapp: {
      score: 40,
      feedback:
        "WhatsApp vuelve fragil un proyecto con versiones: se pierden archivos, comentarios y aprobaciones.",
    },
    "lms-hotmart": {
      score: 25,
      feedback:
        "Un LMS esta pensado para cursos, no para proyectos creativos con entregables personalizados.",
    },
  },
  workshop: {
    "zoom-webinar": {
      score: 100,
      feedback:
        "Excelente: el taller necesita sala estable, control de grupo, grabacion y una experiencia sincronica.",
    },
    "lms-hotmart": {
      score: 80,
      feedback:
        "Buena opcion complementaria para replay y materiales, pero la entrega principal del taller es en vivo.",
    },
    "drive-notion": {
      score: 55,
      feedback:
        "Organiza materiales, pero no entrega por si solo la experiencia grupal en una fecha y hora.",
    },
    "calendly-meet": {
      score: 45,
      feedback:
        "Agenda muy bien sesiones individuales, pero no esta pensado para manejar 60-100 asistentes en vivo.",
    },
    whatsapp: {
      score: 40,
      feedback:
        "WhatsApp sirve para avisos, pero no puede ser la sala principal de un workshop con cupo y grabacion.",
    },
    "helpdesk-crm": {
      score: 35,
      feedback:
        "Un helpdesk atiende incidencias, pero no entrega la experiencia grupal ni el contenido en vivo.",
    },
  },
  support: {
    "helpdesk-crm": {
      score: 100,
      feedback:
        "Excelente: cada solicitud queda con responsable, estado, SLA y evidencia de seguimiento.",
    },
    whatsapp: {
      score: 85,
      feedback:
        "Muy util para soporte rapido, aunque requiere etiquetas y disciplina para no perder acuerdos.",
    },
    "lms-hotmart": {
      score: 55,
      feedback:
        "Puede alojar base de conocimiento, pero no gestiona tickets vivos ni responsables por incidencia.",
    },
    "drive-notion": {
      score: 50,
      feedback:
        "Sirve como bitacora simple, pero se queda corto si hay 40-70 tickets mensuales con SLA.",
    },
    "calendly-meet": {
      score: 35,
      feedback:
        "Agendar reuniones para cada incidencia vuelve lento un servicio que necesita seguimiento asincronico.",
    },
    "zoom-webinar": {
      score: 25,
      feedback:
        "Un webinar no es soporte. El cliente necesita ticket, responsable y respuesta documentada.",
    },
  },
  coaching: {
    "calendly-meet": {
      score: 100,
      feedback:
        "Excelente: agenda privada, link claro, recordatorios y menos riesgo de empalmes en sesiones 1:1.",
    },
    "zoom-webinar": {
      score: 80,
      feedback:
        "La videollamada funciona, aunque necesitas complementar con agenda y recordatorios para evitar no-shows.",
    },
    whatsapp: {
      score: 60,
      feedback:
        "Sirve para seguimiento cercano, pero no debe ser el canal principal para agenda privada y sesiones.",
    },
    "helpdesk-crm": {
      score: 50,
      feedback:
        "Da trazabilidad, pero puede sentirse frio para coaching si no se combina con sesiones calendarizadas.",
    },
    "drive-notion": {
      score: 45,
      feedback:
        "Ordena materiales personalizados, pero no resuelve la agenda ni la experiencia de sesion.",
    },
    "lms-hotmart": {
      score: 25,
      feedback:
        "Un LMS sirve para contenido grabado; este caso requiere seguimiento 1:1 y agenda estable.",
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

const SERVICE_IDEAL_ANSWERS = [
  {
    mipymeId: "consulting",
    mipymeName: 'Consultoria "Estrategia 1:1"',
    needs: "Agenda confiable, videollamada clara, recordatorios y material previo/posterior.",
    bestMatches: [
      { carrierId: "calendly-meet", carrierName: "Calendly + Google Meet" },
    ],
    whyTheyWork:
      "Automatiza disponibilidad, evita empalmes, genera link de sesion y reduce friccion antes de la consultoria.",
    whyOthersFail:
      "WhatsApp deja acuerdos sueltos. LMS es para contenido grabado. Drive/Notion ayuda con entregables, pero no resuelve agenda ni cita.",
  },
  {
    mipymeId: "course",
    mipymeName: 'Curso "Excel para Emprender"',
    needs: "Acceso inmediato, modulos ordenados, recursos descargables y experiencia asincronica.",
    bestMatches: [
      { carrierId: "lms-hotmart", carrierName: "LMS / Hotmart / Classroom" },
    ],
    whyTheyWork:
      "Entrega el curso de forma escalable: pago, acceso, lecciones, progreso y materiales sin depender de soporte manual.",
    whyOthersFail:
      "WhatsApp se vuelve caos con 100+ alumnos. Calendly convierte algo escalable en citas manuales. Zoom solo sirve para vivo.",
  },
  {
    mipymeId: "branding",
    mipymeName: 'Estudio "Marca Clara"',
    needs: "Brief, control de versiones, revisiones, aprobaciones y archivos finales en un solo lugar.",
    bestMatches: [
      { carrierId: "drive-notion", carrierName: "Drive + Notion" },
    ],
    whyTheyWork:
      "Centraliza documentos, comentarios, entregables y permisos; evita perder archivos y acuerdos en chats.",
    whyOthersFail:
      "WhatsApp rompe la trazabilidad. Zoom ayuda a revisar, pero no almacena versiones. LMS no esta pensado para proyectos personalizados.",
  },
  {
    mipymeId: "workshop",
    mipymeName: 'Taller "Ventas en Vivo"',
    needs: "Sala estable, gestion de asistentes, recordatorios, interaccion y grabacion.",
    bestMatches: [
      { carrierId: "zoom-webinar", carrierName: "Zoom Webinar / Meet grupal" },
    ],
    whyTheyWork:
      "Esta disenado para experiencias sincronicas grupales: una sala, una hora, control de asistentes y grabacion.",
    whyOthersFail:
      "Drive/Notion solo guarda materiales. WhatsApp sirve para avisar, no para entregar el taller. Calendly es 1:1.",
  },
  {
    mipymeId: "support",
    mipymeName: 'Soporte "Tienda Sin Caos"',
    needs: "Tickets, responsables, estados, tiempos de respuesta y evidencia de seguimiento.",
    bestMatches: [
      { carrierId: "helpdesk-crm", carrierName: "Helpdesk / CRM por correo" },
    ],
    whyTheyWork:
      "Convierte solicitudes en casos trazables con SLA, responsable y estado; justo lo que requiere soporte recurrente.",
    whyOthersFail:
      "WhatsApp es rapido pero fragil si no se documenta. Zoom no es soporte. Drive/Notion se queda corto con volumen de tickets.",
  },
  {
    mipymeId: "coaching",
    mipymeName: 'Coaching "Nutricion Practica"',
    needs: "Agenda privada, sesiones 1:1, recordatorios y continuidad del seguimiento.",
    bestMatches: [
      { carrierId: "calendly-meet", carrierName: "Calendly + Google Meet" },
    ],
    whyTheyWork:
      "Reduce no-shows, organiza disponibilidad y entrega una experiencia privada con link claro y recordatorios.",
    whyOthersFail:
      "WhatsApp acompana, pero no ordena agenda. LMS es para contenido grabado. Drive/Notion solo gestiona materiales.",
  },
];

const MODE_CONFIG = {
  products: {
    id: "products",
    label: "Productos fisicos",
    shortLabel: "Productos",
    title: "LogiMatch: empareja MiPyME con paqueteria",
    intro:
      "Cada MiPyME tiene un perfil distinto (urgencia, fragilidad, cobertura, ticket). Lee las 6 fichas y asigna a cada una la paqueteria que mejor le acomode.",
    catalogHelp: "Revisa paqueterias y perfiles de MiPyME antes de resolver el examen.",
    optionPlural: "Paqueterias",
    optionSingular: "Paqueteria",
    optionEyebrow: "Paqueteria",
    optionAssignedLabel: "Paqueteria asignada",
    optionPlaceholder: "Selecciona una paqueteria...",
    casePlural: "MiPyMEs",
    caseSingular: "MiPyME",
    caseEyebrow: "MiPyME",
    optionCatalogTitle: "Paqueterias (Anexo B.1)",
    optionCatalogDescription: "Seis perfiles para evaluar en la mesa antes de pujar.",
    caseCatalogTitle: "Perfiles de MiPyME (Anexo B.2)",
    caseCatalogDescription: "Cada negocio tiene una urgencia y fragilidad propias.",
    productLabel: "Producto principal",
    fragilityLabel: "Fragilidad",
    urgencyLabel: "Urgencia",
    destinationLabel: "Destinos",
    volumeLabel: "Volumen",
    priorityLabel: "Lo que mas le importa",
  },
  services: {
    id: "services",
    label: "Servicios online",
    shortLabel: "Servicios",
    title: "LogiMatch: empareja servicio con canal de entrega",
    intro:
      "En servicios tambien hay logistica: agenda, acceso, entregables, soporte y seguimiento. Lee los 6 casos y elige el canal que mejor cumple la promesa.",
    catalogHelp: "Revisa canales de entrega y casos de servicio antes de resolver el examen.",
    optionPlural: "Canales de entrega",
    optionSingular: "Canal",
    optionEyebrow: "Canal",
    optionAssignedLabel: "Canal asignado",
    optionPlaceholder: "Selecciona un canal de entrega...",
    casePlural: "Servicios",
    caseSingular: "Servicio",
    caseEyebrow: "Servicio",
    optionCatalogTitle: "Canales de entrega para servicios",
    optionCatalogDescription: "Seis formas de cumplir una promesa digital sin perder control.",
    caseCatalogTitle: "Casos de servicio online",
    caseCatalogDescription: "Cada servicio tiene una promesa, capacidad y riesgo operativo distinto.",
    productLabel: "Servicio principal",
    fragilityLabel: "Riesgo operativo",
    urgencyLabel: "Sensibilidad de tiempo",
    destinationLabel: "Clientes / alcance",
    volumeLabel: "Capacidad",
    priorityLabel: "Promesa critica",
  },
};

export function getLogiMatchModes() {
  return Object.values(MODE_CONFIG).map((mode) => ({
    id: mode.id,
    label: mode.label,
    shortLabel: mode.shortLabel,
    intro: mode.intro,
  }));
}

export function getModeConfig(mode = "products") {
  return { ...getConfig(mode) };
}

export function getIdealAnswers(mode = "products") {
  return getIdealAnswerSource(mode).map((answer) => ({
    ...answer,
    bestMatches: answer.bestMatches.map((m) => ({ ...m })),
  }));
}

export function getCarriers(mode = "products") {
  return getOptionSource(mode).map((carrier) => ({ ...carrier }));
}

export function getMipymes(mode = "products") {
  return getCaseSource(mode).map((mipyme) => ({ ...mipyme }));
}

export function getCarrierById(id, mode = "products") {
  return getOptionSource(mode).find((carrier) => carrier.id === id) || null;
}

export function getMipymeById(id, mode = "products") {
  return getCaseSource(mode).find((mipyme) => mipyme.id === id) || null;
}

export function createDefaultLogiMatchState(mode = "products") {
  const sanitizedMode = sanitizeMode(mode);
  return {
    mode: sanitizedMode,
    activeTab: "catalog",
    studentName: "",
    assignments: createEmptyAssignments(sanitizedMode),
    result: null,
  };
}

export function normalizeLogiMatchState(value) {
  const base = createDefaultLogiMatchState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const mode = sanitizeMode(value.mode);
  const activeTab = value.activeTab === "exam" ? "exam" : "catalog";
  const studentName = sanitizeStudentName(value.studentName);
  const assignments = sanitizeAssignments(value.assignments, mode);
  const result = sanitizeFullResult(value.result, assignments, studentName, mode);

  return {
    mode,
    activeTab,
    studentName,
    assignments,
    result,
  };
}

export function evaluateLogiMatch({ mipymeId, carrierId, mode = "products" }) {
  const sanitizedMode = sanitizeMode(mode);
  const mipyme = getMipymeById(mipymeId, sanitizedMode);
  const carrier = getCarrierById(carrierId, sanitizedMode);
  if (!mipyme || !carrier) {
    return null;
  }

  const entry = getMatrix(sanitizedMode)[mipyme.id]?.[carrier.id];
  if (!entry) {
    return null;
  }

  return {
    mode: sanitizedMode,
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

export function evaluateAllPairs(assignments, studentName, mode = "products") {
  const sanitizedMode = sanitizeMode(mode);
  const cases = getCaseSource(sanitizedMode);
  const pairs = cases.map((mipyme) => {
    const carrierId = assignments?.[mipyme.id] || "";
    if (!carrierId) {
      return {
        mode: sanitizedMode,
        mipymeId: mipyme.id,
        mipymeName: mipyme.name,
        carrierId: "",
        carrierName: "(sin asignar)",
        score: 0,
        feedback: `Aun no asignaste ${getConfig(sanitizedMode).optionSingular.toLowerCase()} para este perfil.`,
        alert: false,
        tone: "danger",
      };
    }
    const evaluation = evaluateLogiMatch({ mipymeId: mipyme.id, carrierId, mode: sanitizedMode });
    return (
      evaluation || {
        mode: sanitizedMode,
        mipymeId: mipyme.id,
        mipymeName: mipyme.name,
        carrierId,
        carrierName: getCarrierById(carrierId, sanitizedMode)?.name || carrierId,
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
  const grade = getGradeFromScore(overallScore, sanitizedMode);

  return {
    mode: sanitizedMode,
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

export function getGradeFromScore(score, mode = "products") {
  const isServices = sanitizeMode(mode) === "services";
  if (score >= 90) {
    return {
      key: "excellent",
      label: "Excelente",
      detail: isServices
        ? "Dominas la logica de entrega por tipo de servicio."
        : "Dominas la logica de canales por perfil de negocio.",
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
      detail: isServices
        ? "Identificas lo basico, pero aun confundes canal de entrega con canal de comunicacion."
        : "Identificas lo basico pero hay perfiles que pediste mal. Revisa las fichas.",
      tone: "warning",
    };
  }
  return {
    key: "needs-work",
    label: "Necesita reforzar",
    detail: isServices
      ? "Estas emparejando varios servicios con canales que no sostienen la promesa. Vuelve al catalogo de fichas."
      : "Estas pareando varios perfiles con paqueterias que no encajan. Vuelve al catalogo de fichas.",
    tone: "danger",
  };
}

export function getAssignedCount(assignments, mode = "products") {
  if (!assignments || typeof assignments !== "object") {
    return 0;
  }
  return getCaseSource(mode).filter((mipyme) => Boolean(assignments[mipyme.id])).length;
}

export function isExamReady(state) {
  if (!state || typeof state !== "object") {
    return false;
  }
  return (
    sanitizeStudentName(state.studentName).length > 0 &&
    getAssignedCount(state.assignments, state.mode) === getCaseSource(state.mode).length
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
  const config = getConfig(result.mode);

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
    `   ${config.optionAssignedLabel}: ${pair.carrierName}`,
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

function createEmptyAssignments(mode = "products") {
  return getCaseSource(mode).reduce((acc, mipyme) => {
    acc[mipyme.id] = "";
    return acc;
  }, {});
}

function sanitizeMode(value) {
  return Object.prototype.hasOwnProperty.call(MODE_CONFIG, value) ? value : "products";
}

function sanitizeStudentName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function sanitizeAssignments(value, mode = "products") {
  const sanitizedMode = sanitizeMode(mode);
  const options = getOptionSource(sanitizedMode);
  const base = createEmptyAssignments(sanitizedMode);
  if (!value || typeof value !== "object") {
    return base;
  }
  for (const mipyme of getCaseSource(sanitizedMode)) {
    const candidate = value[mipyme.id];
    if (typeof candidate === "string" && options.some((c) => c.id === candidate)) {
      base[mipyme.id] = candidate;
    }
  }
  return base;
}

function sanitizeFullResult(value, assignments, studentName, mode = "products") {
  if (!value || typeof value !== "object" || !Array.isArray(value.pairs)) {
    return null;
  }
  // Re-evaluate from sanitized assignments to keep result and state consistent.
  return evaluateAllPairs(assignments, studentName, mode);
}

function getConfig(mode = "products") {
  return MODE_CONFIG[sanitizeMode(mode)] || MODE_CONFIG.products;
}

function getOptionSource(mode = "products") {
  return sanitizeMode(mode) === "services" ? SERVICE_CHANNELS : CARRIERS;
}

function getCaseSource(mode = "products") {
  return sanitizeMode(mode) === "services" ? SERVICE_CASES : MIPYMES;
}

function getMatrix(mode = "products") {
  return sanitizeMode(mode) === "services" ? SERVICE_MATCH_MATRIX : MATCH_MATRIX;
}

function getIdealAnswerSource(mode = "products") {
  return sanitizeMode(mode) === "services" ? SERVICE_IDEAL_ANSWERS : IDEAL_ANSWERS;
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
