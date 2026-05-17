import {
  buildAiInputHash,
  buildAiPrompt,
  createDefaultAiState,
  normalizeAiState,
  requestAiAnalysis,
} from "./lib/ai-analysis.js";
import {
  buildProductWireframeInputHash,
  buildProductWireframePrompt,
  createDefaultProductWireframeState,
  normalizeBrief,
  normalizeProductWireframeState,
  requestProductWireframe,
} from "./lib/product-wireframe.js";
import {
  buildStoreMessagesInputHash,
  buildStoreMessagesPrompt,
  buildStoreMessagesResultHash,
  createDefaultStoreMessagesState,
  normalizeMessageBrief,
  normalizeStoreMessagesState,
  requestStoreMessages,
  translateProductType,
  translateSalesChannel,
  translateShippingType,
  translateTone,
} from "./lib/store-messages.js";
import {
  buildLogisticsInputHash,
  buildLogisticsPrompt,
  buildLogisticsResultHash,
  createDefaultLogisticsState,
  getLogisticsErrorCatalog,
  getLogisticsPrepOptions,
  getSelectedErrorLabels,
  normalizeLogisticsBrief,
  normalizeLogisticsState,
  requestLogisticsMessages,
  translateBusinessType,
  translateCoverage,
} from "./lib/logistics-messages.js";
import {
  applyBoxPreset,
  calculateVolumetric,
  createDefaultVolumetricState,
  formatNumber,
  getBoxPresets,
  getFactorOptions,
  normalizeVolumetricSimulator,
  normalizeVolumetricState,
} from "./lib/volumetric-weight.js";

const STORAGE_KEY = "ecommerce-learning-route-v1";
const VALID_BUSINESS_MODELS = new Set(["no-definido", "marca-propia", "reventa", "mixto"]);
const VALID_TOOLS = new Set(["diagnosis", "wireframe", "messages", "logistics", "volumetric"]);
const TOOL_ROUTES = {
  diagnosis: "/diagnostico",
  wireframe: "/ficha-producto",
  messages: "/mensajes",
  logistics: "/logistica",
  volumetric: "/peso-volumetrico",
};
const ROUTE_TO_TOOL = Object.fromEntries(Object.entries(TOOL_ROUTES).map(([tool, route]) => [route, tool]));

const questions = [
  {
    id: "costo",
    title: "Inversión y costos",
    question: "¿Cómo piensas financiar el arranque del proyecto?",
    teachingNote:
      "La elección del canal cambia el tipo de costo: comisión por venta, inversión en marketing o complejidad operativa.",
    options: [
      {
        label:
          "Presupuesto bajo. Prefiero pagar más solo cuando ya vendo y aprovechar infraestructura existente.",
        type: "marketplace",
      },
      {
        label:
          "Tengo capital para montar marca, tienda y adquisición de clientes sin depender de comisiones por pedido.",
        type: "propia",
      },
      {
        label:
          "Puedo invertir y me interesa repartir el riesgo entre varios canales desde el inicio.",
        type: "hibrido",
      },
    ],
  },
  {
    id: "producto",
    title: "Tipo de producto",
    question: "¿Qué vendes y qué tanto se diferencia tu oferta?",
    teachingNote:
      "Los productos muy comparables suelen competir por precio y velocidad; las marcas diferenciadas ganan con historia, comunidad y experiencia.",
    options: [
      {
        label:
          "Productos genéricos o de reventa, con alta comparación entre vendedores.",
        type: "marketplace",
      },
      {
        label:
          "Producto propio, de nicho o con propuesta de valor clara que necesita contar su historia.",
        type: "propia",
      },
      {
        label:
          "Catálogo mixto: parte es marca propia y parte es reventa o surtido amplio.",
        type: "hibrido",
      },
    ],
  },
  {
    id: "industria",
    title: "Comportamiento de compra",
    question: "¿Cómo decide comprar tu cliente ideal?",
    teachingNote:
      "La decisión de compra define si necesitas una vitrina con tráfico masivo o una experiencia de marca más controlada.",
    options: [
      {
        label:
          "Busca el mejor precio, disponibilidad inmediata y confianza transaccional.",
        type: "marketplace",
      },
      {
        label:
          "Compra por identidad, diseño, confianza en la marca y experiencia postventa.",
        type: "propia",
      },
      {
        label:
          "Combina ambas cosas: investiga en plataformas grandes, pero también responde a contenido de marca.",
        type: "hibrido",
      },
    ],
  },
  {
    id: "redes",
    title: "Tracción previa",
    question: "¿Qué tan madura está tu audiencia actual?",
    teachingNote:
      "Si ya existe comunidad, una tienda propia puede capturar mejor el valor. Si no existe, un marketplace acelera la demanda inicial.",
    options: [
      {
        label:
          "No tengo audiencia ni una comunidad activa; necesito exposición rápida.",
        type: "marketplace",
      },
      {
        label:
          "Ya vendo o converso con clientes por redes, mensajes o contenido propio.",
        type: "propia",
      },
      {
        label:
          "Tengo algo de comunidad, pero todavía dependo de descubrir clientes nuevos en otros canales.",
        type: "hibrido",
      },
    ],
  },
  {
    id: "control",
    title: "Marca y datos",
    question: "¿Qué nivel de control quieres sobre clientes, diseño y experiencia?",
    teachingNote:
      "La propiedad de los datos y la relación con el cliente es una de las mayores diferencias entre vender en casa propia o dentro de una plataforma ajena.",
    options: [
      {
        label:
          "Necesito controlar branding, checkout, remarketing y base de clientes.",
        type: "propia",
      },
      {
        label:
          "Quiero control, pero también me interesa usar un canal externo para volumen y validación.",
        type: "hibrido",
      },
      {
        label:
          "Mi prioridad es mover inventario aunque la plataforma sea la dueña principal de la relación.",
        type: "marketplace",
      },
    ],
  },
  {
    id: "marketing",
    title: "Adquisición de tráfico",
    question: "¿Cómo planeas conseguir visitas y ventas?",
    teachingNote:
      "Abrir la tienda no trae tráfico por sí solo. Hay que distinguir entre infraestructura y demanda.",
    options: [
      {
        label:
          "Necesito que los clientes ya estén allí porque todavía no tengo una estrategia de marketing clara.",
        type: "marketplace",
      },
      {
        label:
          "Tengo plan de contenido, anuncios, analítica y puedo construir mi propio embudo.",
        type: "propia",
      },
      {
        label:
          "Usaré marketplaces para captar y mi propio sitio para fidelizar y elevar el margen.",
        type: "hibrido",
      },
    ],
  },
  {
    id: "operacion",
    title: "Capacidad operativa",
    question: "¿Qué tan preparado está tu equipo para operar tecnología, pagos e inventario?",
    teachingNote:
      "El problema no solo es vender. También importa la capacidad para cobrar, despachar, medir y no romper la operación.",
    options: [
      {
        label:
          "Necesito una solución lo más resuelta posible y con poca carga técnica.",
        type: "marketplace",
      },
      {
        label:
          "Puedo configurar tienda, pagos, automatizaciones, analítica y soporte propio.",
        type: "propia",
      },
      {
        label:
          "Tengo capacidad para integrar inventario, varios canales y procesos más complejos.",
        type: "hibrido",
      },
    ],
  },
];

const profileCatalog = {
  propia: {
    label: "Tienda propia",
    subtitle: "Marca y experiencia bajo tu control",
    pill: "Ruta recomendada",
    quote: "Tu ventaja real no es estar en todos lados; es construir una marca que la gente recuerde.",
    description:
      "Tu perfil apunta a una operación donde el valor está en el branding, los datos de cliente y el margen de largo plazo. La tienda propia tiene sentido si aceptas que la captación dependerá de tu ejecución comercial.",
    confidenceLabel: "Señal principal",
    tools: [
      "Shopify, Tiendanube o WooCommerce para el storefront.",
      "Mercado Pago o Stripe para cobros.",
      "GA4, Meta Ads y CRM/email para medir y retener.",
      "Notion o Airtable para operación ligera al inicio.",
    ],
    strengths: [
      "Controlas la experiencia, el diseño y los datos del cliente.",
      "Puedes construir retención, recompra y ticket promedio.",
      "Tu margen mejora cuando afinas adquisición y conversión.",
    ],
    risks: [
      "Sin estrategia de tráfico, la tienda se queda vacía.",
      "La curva de aprendizaje en marketing y analítica es real.",
    ],
    actionPlan: [
      "Define propuesta de valor, ticket promedio y margen real antes de construir.",
      "Lanza un catálogo pequeño y medible en lugar de intentar publicar todo.",
      "Instala analítica, captación de leads y automatizaciones básicas desde el día uno.",
    ],
  },
  marketplace: {
    label: "Marketplace",
    subtitle: "Velocidad de validación y demanda existente",
    pill: "Ruta recomendada",
    quote: "Si todavía no tienes audiencia, vender donde ya hay tráfico puede ser la decisión más inteligente.",
    description:
      "Tu escenario favorece usar una plataforma con confianza transaccional, pagos y logística más resueltos. No es la mejor opción para construir marca profunda, pero sí para validar oferta y aprender rápido con menor fricción.",
    confidenceLabel: "Señal principal",
    tools: [
      "Amazon o Mercado Libre como canal de demanda inmediata.",
      "Hojas de cálculo o un ERP ligero para inventario y márgenes.",
      "Tablero de costos por comisión, envío y devoluciones.",
      "Ficha de producto optimizada con fotos, títulos y reseñas.",
    ],
    strengths: [
      "Aprovechas tráfico, confianza y flujo de compra existente.",
      "Reduces la carga técnica de cobros y parte de la operación.",
      "Sirve para validar qué producto sí rota antes de escalar marca propia.",
    ],
    risks: [
      "La presión por precio puede comerse tu margen.",
      "La lealtad del cliente suele ser hacia la plataforma, no hacia tu marca.",
    ],
    actionPlan: [
      "Calcula margen neto incluyendo comisión, envío, devoluciones y publicidad interna.",
      "Optimiza pocos SKU con buena conversión en vez de subir un catálogo enorme.",
      "Documenta qué preguntas, objeciones y reseñas aparecen para aprender del mercado.",
    ],
  },
  hibrido: {
    label: "Modelo híbrido",
    subtitle: "Marketplace para captar, tienda propia para retener",
    pill: "Ruta recomendada",
    quote: "La mezcla correcta no es duplicar trabajo; es diseñar qué canal gana clientes y cuál captura valor.",
    description:
      "Tu perfil muestra señales mezcladas o una ambición multicanal clara. La jugada más sólida es usar marketplaces para adquisición y validación, mientras construyes tienda propia y base de datos para fidelizar y aumentar margen.",
    confidenceLabel: "Señal principal",
    tools: [
      "Tienda propia conectada con uno o más marketplaces.",
      "Sincronizador de inventario u operación centralizada.",
      "CRM o email marketing para recompras y segmentación.",
      "Dashboard único para ventas, CAC, margen y rotación.",
    ],
    strengths: [
      "Diversificas demanda y reduces dependencia de un solo canal.",
      "Aprendes rápido del mercado sin renunciar a construir marca.",
      "Puedes usar cada canal según su función dentro del negocio.",
    ],
    risks: [
      "La complejidad operativa sube rápido si no centralizas inventario y procesos.",
      "Sin reglas claras, el equipo termina duplicando trabajo y errores.",
    ],
    actionPlan: [
      "Define qué productos y objetivos pertenecen a cada canal.",
      "Centraliza inventario, políticas y métricas antes de escalar catálogo.",
      "Crea una estrategia para convertir compradores ocasionales en clientes propios.",
    ],
  },
};

const defaultState = {
  activeTool: "diagnosis",
  stage: "intro",
  currentQuestionIndex: 0,
  answers: Array(questions.length).fill(null),
  intake: {
    studentName: "",
    projectName: "",
    email: "",
    productDescription: "",
    targetCustomer: "",
    businessModel: "no-definido",
    averageTicket: "",
    salesChannels: "",
    primaryMarket: "",
  },
  ai: createDefaultAiState(),
  delivery: {
    status: "idle",
    reportHash: "",
    message: "",
  },
  wireframe: createDefaultProductWireframeState(),
  messages: createDefaultStoreMessagesState(),
  logistics: createDefaultLogisticsState(),
  volumetric: createDefaultVolumetricState(),
};

let state = loadState();
let aiRequestId = 0;

const appRoot = document.querySelector("#app-root");
const toast = document.querySelector("#toast");

syncToolWithLocation({ replaceUnknown: true });
render();

appRoot.addEventListener("submit", handleSubmit);
appRoot.addEventListener("click", handleClick);
appRoot.addEventListener("change", handleInput);
window.addEventListener("popstate", () => {
  syncToolWithLocation({ replaceUnknown: false });
  render();
});

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultState);
    }
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      activeTool: sanitizeTool(parsed.activeTool),
      answers: normalizeAnswers(parsed.answers),
      intake: {
        ...defaultState.intake,
        ...(parsed.intake || {}),
        businessModel: sanitizeBusinessModel(parsed.intake?.businessModel),
      },
      ai: normalizeAiState(parsed.ai),
      delivery: normalizeDeliveryState(parsed.delivery),
      wireframe: normalizeProductWireframeState(parsed.wireframe),
      messages: normalizeStoreMessagesState(parsed.messages),
      logistics: normalizeLogisticsState(parsed.logistics),
      volumetric: normalizeVolumetricState(parsed.volumetric),
      currentQuestionIndex: clampQuestionIndex(parsed.currentQuestionIndex),
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function normalizeAnswers(answers) {
  if (!Array.isArray(answers)) {
    return Array(questions.length).fill(null);
  }
  const cleanAnswers = Array(questions.length).fill(null);
  questions.forEach((question, index) => {
    const candidate = answers[index];
    const isValid = question.options.some((option) => option.type === candidate);
    cleanAnswers[index] = isValid ? candidate : null;
  });
  return cleanAnswers;
}

function clampQuestionIndex(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.min(Math.max(Math.trunc(value), 0), questions.length - 1);
}

function persistState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sanitizeTool(value) {
  return VALID_TOOLS.has(value) ? value : "diagnosis";
}

function getToolFromPath(pathname = window.location.pathname) {
  const normalizedPath = normalizeRoutePath(pathname);
  if (normalizedPath === "/") {
    return "diagnosis";
  }
  return ROUTE_TO_TOOL[normalizedPath] || null;
}

function normalizeRoutePath(pathname) {
  const normalized = String(pathname || "/").replace(/\/+$/, "");
  return normalized || "/";
}

function syncToolWithLocation({ replaceUnknown = false } = {}) {
  const routeTool = getToolFromPath();
  state.activeTool = routeTool || "diagnosis";

  const normalizedPath = normalizeRoutePath(window.location.pathname);
  const shouldReplaceRoot = normalizedPath === "/";
  const shouldReplaceUnknown = !routeTool && replaceUnknown;

  if (shouldReplaceRoot || shouldReplaceUnknown) {
    window.history.replaceState({ tool: state.activeTool }, "", TOOL_ROUTES[state.activeTool]);
  }
}

function setToolRoute(tool, replace = false) {
  const route = TOOL_ROUTES[sanitizeTool(tool)];
  const currentPath = normalizeRoutePath(window.location.pathname);
  if (currentPath === route) {
    return;
  }

  const method = replace ? "replaceState" : "pushState";
  window.history[method]({ tool }, "", route);
}

function invalidateAiState() {
  aiRequestId += 1;
  state.ai = createDefaultAiState();
  state.delivery = structuredClone(defaultState.delivery);
}

function invalidateWireframeState(preserveBrief = true) {
  const nextState = createDefaultProductWireframeState();
  nextState.brief = preserveBrief ? normalizeBrief(state.wireframe.brief) : { ...nextState.brief };
  state.wireframe = nextState;
}

function invalidateStoreMessagesState(preserveBrief = true) {
  const nextState = createDefaultStoreMessagesState();
  nextState.brief = preserveBrief ? normalizeMessageBrief(state.messages.brief) : { ...nextState.brief };
  state.messages = nextState;
}

function invalidateLogisticsState(preserveBrief = true) {
  const nextState = createDefaultLogisticsState();
  nextState.brief = preserveBrief ? normalizeLogisticsBrief(state.logistics.brief) : { ...nextState.brief };
  state.logistics = nextState;
}

function resetVolumetricState() {
  state.volumetric = createDefaultVolumetricState();
}

function resetState() {
  state = structuredClone(defaultState);
  aiRequestId += 1;
  persistState();
}

function clearIntake() {
  state.intake = structuredClone(defaultState.intake);
  invalidateAiState();
  persistState();
}

function buildToolSwitcherMarkup() {
  return `
    <nav class="tool-switcher" aria-label="Herramientas disponibles">
      <button
        class="tool-tab"
        type="button"
        data-action="switch-tool"
        data-tool="diagnosis"
        data-route="${TOOL_ROUTES.diagnosis}"
        data-active="${state.activeTool === "diagnosis"}"
      >
        <span class="tool-tab-kicker">Herramienta 1</span>
        <strong>Diagnostico de ruta</strong>
        <span>Decide entre tienda propia, marketplace o modelo hibrido.</span>
      </button>

      <button
        class="tool-tab"
        type="button"
        data-action="switch-tool"
        data-tool="wireframe"
        data-route="${TOOL_ROUTES.wireframe}"
        data-active="${state.activeTool === "wireframe"}"
      >
        <span class="tool-tab-kicker">Herramienta 2</span>
        <strong>Ficha de producto</strong>
        <span>Genera un wireframe ideal para una pagina que convierta mejor.</span>
      </button>

      <button
        class="tool-tab"
        type="button"
        data-action="switch-tool"
        data-tool="messages"
        data-route="${TOOL_ROUTES.messages}"
        data-active="${state.activeTool === "messages"}"
      >
        <span class="tool-tab-kicker">Herramienta 3</span>
        <strong>Mensajes de tienda</strong>
        <span>Crea respuestas claras para venta, envio, retrasos y postventa.</span>
      </button>

      <button
        class="tool-tab"
        type="button"
        data-action="switch-tool"
        data-tool="logistics"
        data-route="${TOOL_ROUTES.logistics}"
        data-active="${state.activeTool === "logistics"}"
      >
        <span class="tool-tab-kicker">Herramienta 4</span>
        <strong>Logistica clara</strong>
        <span>Convierte tiempos, guias y retrasos en mensajes confiables.</span>
      </button>

      <button
        class="tool-tab"
        type="button"
        data-action="switch-tool"
        data-tool="volumetric"
        data-route="${TOOL_ROUTES.volumetric}"
        data-active="${state.activeTool === "volumetric"}"
      >
        <span class="tool-tab-kicker">Herramienta 5</span>
        <strong>Peso volumetrico</strong>
        <span>Simula cajas y descubre cuanto aire te cobra la paqueteria.</span>
      </button>
    </nav>
  `;
}

function renderToolShell(screenMarkup) {
  appRoot.innerHTML = `
    ${buildToolSwitcherMarkup()}
    ${screenMarkup}
  `;
  scrollActiveToolTabIntoView();
}

function scrollActiveToolTabIntoView() {
  window.requestAnimationFrame(() => {
    const activeTab = appRoot.querySelector('.tool-tab[data-active="true"]');
    if (!activeTab) {
      return;
    }
    activeTab.scrollIntoView({ block: "nearest", inline: "center" });
  });
}

function render() {
  if (state.activeTool === "wireframe") {
    renderWireframeTool();
    return;
  }

  if (state.activeTool === "messages") {
    renderStoreMessagesTool();
    return;
  }

  if (state.activeTool === "logistics") {
    renderLogisticsTool();
    return;
  }

  if (state.activeTool === "volumetric") {
    renderVolumetricTool();
    return;
  }

  if (state.stage === "quiz") {
    renderQuestion();
    animateStaticProgress();
    return;
  }

  if (state.stage === "result") {
    renderResult();
    animateAffinityBars();
    ensureAiAnalysis();
    ensureAutomaticSummaryDelivery();
    return;
  }

  renderIntro();
}

function renderIntro() {
  const answeredCount = getAnsweredCount();
  const startLabel = answeredCount > 0 ? "Retomar diagnóstico" : "Iniciar diagnóstico";

  renderToolShell(`
    <section class="screen panel-enter">
      <div class="intro-grid">
        <article class="surface-card intro-copy">
          <p class="eyebrow">Antes de comenzar</p>
          <h2>Una decisión útil no empieza con la plataforma. Empieza con el modelo de negocio.</h2>
          <p class="text-muted">
            Responder con honestidad te dará una recomendación más útil. No se trata de
            encontrar la plataforma "mejor", sino la que mejor encaja con tu etapa y tu forma de vender.
          </p>

          <div class="info-grid">
            <div class="mini-card">
              <strong>Resultado claro</strong>
              <span>Recibirás una ruta recomendada con prioridades concretas.</span>
            </div>
            <div class="mini-card">
              <strong>Siguiente paso</strong>
              <span>Verás qué herramientas y decisiones conviene activar primero.</span>
            </div>
          </div>

          <ul class="mini-list">
            <li>Evalúa inversión, producto, marketing, control de marca y operación.</li>
            <li>Detecta cuándo conviene construir canal propio y cuándo aprovechar tráfico existente.</li>
            <li>Te entrega un resumen final para guardar o compartir.</li>
          </ul>

          ${
            answeredCount > 0
              ? `<div class="resume-chip">${answeredCount} de ${questions.length} respuestas listas para continuar</div>`
              : ""
          }
        </article>

        <article class="surface-card">
          <p class="eyebrow">Personaliza tu reporte</p>
          <form id="intake-form" class="form-stack">
            <p class="field-help">
              Mientras mas especifico seas sobre lo que vendes y a quien le vendes, mas util sera la lectura final.
            </p>

            <div class="field">
              <label for="student-name">Tu nombre</label>
              <input
                id="student-name"
                name="studentName"
                type="text"
                maxlength="80"
                placeholder="Ej. Andrea López"
                value="${escapeHtml(state.intake.studentName)}"
              >
            </div>

            <div class="field">
              <label for="project-name">Proyecto o idea</label>
              <input
                id="project-name"
                name="projectName"
                type="text"
                maxlength="80"
                placeholder="Ej. Tienda de skincare"
                value="${escapeHtml(state.intake.projectName)}"
              >
            </div>

            <div class="field">
              <label for="email">
                Correo
                <span class="required-pill">Obligatorio</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                maxlength="120"
                required
                aria-required="true"
                placeholder="tu@correo.com"
                value="${escapeHtml(state.intake.email)}"
              >
              <p class="field-help">
                Es obligatorio para continuar. Despues lo usaremos para enviarte el resumen del diagnostico.
              </p>
            </div>

            <div class="field">
              <label for="product-description">Que vendes exactamente</label>
              <textarea
                id="product-description"
                name="productDescription"
                maxlength="500"
                placeholder="Ej. Kits de skincare para piel sensible con marca propia y suscripcion mensual"
              >${escapeHtml(state.intake.productDescription)}</textarea>
            </div>

            <div class="field">
              <label for="target-customer">A quien se lo vendes</label>
              <textarea
                id="target-customer"
                name="targetCustomer"
                maxlength="320"
                placeholder="Ej. Mujeres de 25 a 40 años en Mexico que compran por recomendacion e Instagram"
              >${escapeHtml(state.intake.targetCustomer)}</textarea>
            </div>

            <div class="form-split">
              <div class="field">
                <label for="business-model">Tu modelo actual</label>
                <select id="business-model" name="businessModel">
                  ${buildBusinessModelOptions(state.intake.businessModel)}
                </select>
              </div>

              <div class="field">
                <label for="average-ticket">Ticket promedio aproximado</label>
                <input
                  id="average-ticket"
                  name="averageTicket"
                  type="text"
                  maxlength="40"
                  placeholder="Ej. $899 MXN"
                  value="${escapeHtml(state.intake.averageTicket)}"
                >
              </div>
            </div>

            <div class="form-split">
              <div class="field">
                <label for="sales-channels">Donde vendes hoy</label>
                <input
                  id="sales-channels"
                  name="salesChannels"
                  type="text"
                  maxlength="160"
                  placeholder="Ej. Instagram, WhatsApp o tienda fisica"
                  value="${escapeHtml(state.intake.salesChannels)}"
                >
              </div>

              <div class="field">
                <label for="primary-market">Mercado principal</label>
                <input
                  id="primary-market"
                  name="primaryMarket"
                  type="text"
                  maxlength="80"
                  placeholder="Ej. Mexico"
                  value="${escapeHtml(state.intake.primaryMarket)}"
                >
              </div>
            </div>

            <div class="button-row">
              <button class="button button-primary" type="submit">${startLabel}</button>
              <button class="button button-secondary" type="button" data-action="clear-local-data">
                Limpiar formulario
              </button>
            </div>
          </form>
        </article>
      </div>
    </section>
  `);
}

function renderQuestion() {
  const question = questions[state.currentQuestionIndex];
  const selectedAnswer = state.answers[state.currentQuestionIndex];
  const answeredCount = getAnsweredCount();
  const isLastQuestion = state.currentQuestionIndex === questions.length - 1;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const optionsMarkup = question.options
    .map((option, index) => {
      const selected = option.type === selectedAnswer;
      return `
        <button
          class="option-card"
          type="button"
          data-option-type="${option.type}"
          data-selected="${selected}"
          aria-pressed="${selected}"
        >
          <span class="option-badge">${String.fromCharCode(65 + index)}</span>
          <span class="option-title">${escapeHtml(option.label)}</span>
        </button>
      `;
    })
    .join("");

  renderToolShell(`
    <section class="screen panel-enter">
      <header class="question-header">
        <div>
          <p class="eyebrow">Paso ${state.currentQuestionIndex + 1} de ${questions.length}</p>
          <h2 class="question-title">${escapeHtml(question.title)}</h2>
          <p class="question-text">${escapeHtml(question.question)}</p>
        </div>

        <div class="metric-box" aria-label="Avance del diagnóstico">
          <span class="metric-number">${progress}%</span>
          <span class="metric-caption">progreso completado</span>
        </div>
      </header>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-bar" data-progress-value="${progress}"></div>
      </div>

      <article class="tip-card">
        <p class="helper-label">Por qué importa</p>
        <p class="helper-copy">${escapeHtml(question.teachingNote)}</p>
      </article>

      <div class="option-list" role="list">
        ${optionsMarkup}
      </div>

      <div class="divider" aria-hidden="true"></div>

      <div class="button-row">
        <button
          class="button button-secondary"
          type="button"
          data-action="go-back"
          ${state.currentQuestionIndex === 0 ? "disabled" : ""}
        >
          Anterior
        </button>
        <button
          class="button button-primary"
          type="button"
          data-action="next-question"
          ${selectedAnswer ? "" : "disabled"}
        >
          ${isLastQuestion ? "Ver diagnóstico" : "Siguiente"}
        </button>
      </div>
    </section>
  `);
}

function renderResult() {
  const analysis = calculateAnalysis();
  const profile = profileCatalog[analysis.recommendation];
  const aiContext = buildAiContext(analysis);
  const currentAiHash = buildAiInputHash(aiContext);
  const aiStatus = state.ai.inputHash === currentAiHash ? state.ai.status : "idle";
  const aiAnalysis = aiStatus === "ready" ? state.ai.analysis : null;
  const reportHash = aiAnalysis ? buildReportHash(currentAiHash, aiAnalysis) : "";
  const deliveryStatus = state.delivery.reportHash === reportHash ? state.delivery.status : "idle";
  const studentName = state.intake.studentName.trim();
  const projectName = state.intake.projectName.trim();
  const reportOwner = studentName || projectName || "Diagnóstico listo";
  const summaryItems = buildProfileSummaryMarkup();
  const businessContextItems = buildBusinessContextMarkup();

  renderToolShell(`
    <section class="screen panel-enter">
      <div class="result-hero">
        <div class="result-pill">${escapeHtml(profile.pill)}</div>
        <div class="result-header">
          <div>
            <h2 class="result-title">${escapeHtml(profile.label)}</h2>
            <p class="result-text">${escapeHtml(profile.subtitle)}</p>
          </div>
          <div class="metric-box">
            <span class="metric-number">${analysis.confidence}%</span>
            <span class="metric-caption">${escapeHtml(profile.confidenceLabel)}</span>
          </div>
        </div>

        <div class="result-meta">
          <span class="meta-chip">Reporte para: ${escapeHtml(reportOwner)}</span>
          ${
            analysis.isMixed
              ? '<span class="meta-chip">Perfil mixto detectado: conviene orquestar canales, no elegir uno a ciegas.</span>'
              : ""
          }
        </div>
      </div>

      <div class="quote-card">
        <blockquote>${escapeHtml(profile.quote)}</blockquote>
        <p>${escapeHtml(profile.description)}</p>
      </div>

      ${buildAiSectionMarkup(aiStatus, aiAnalysis)}

      <div class="result-grid">
        <div class="detail-grid">
          <article class="result-card">
            <h3>Stack sugerido</h3>
            <ul class="feature-list">
              ${profile.tools.map((tool) => `<li>${escapeHtml(tool)}</li>`).join("")}
            </ul>
          </article>

          <article class="result-card">
            <h3>Ventajas clave</h3>
            <ul class="feature-list">
              ${profile.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>

          <article class="result-card risk-card">
            <h3>Riesgos a vigilar</h3>
            <ul class="feature-list">
              ${profile.risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>

          <article class="result-card">
            <h3>Plan de arranque</h3>
            <ol class="action-list">
              ${profile.actionPlan.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ol>
          </article>
        </div>

        <div class="stat-grid">
          <article class="bar-card">
            <h3>Afinidad por ruta</h3>
            ${buildAffinityRow("Modelo híbrido", analysis.percentages.hibrido, "hibrido")}
            ${buildAffinityRow("Tienda propia", analysis.percentages.propia, "propia")}
            ${buildAffinityRow("Marketplace", analysis.percentages.marketplace, "marketplace")}
          </article>

          <article class="bar-card">
            <h3>Contexto del negocio</h3>
            <ul class="summary-list">
              ${businessContextItems}
            </ul>
          </article>

          <article class="bar-card">
            <h3>Tus respuestas clave</h3>
            <ul class="summary-list">
              ${summaryItems}
            </ul>
          </article>
        </div>
      </div>

      <div class="footer-actions">
        <button
          class="button button-primary"
          type="button"
          data-action="send-summary"
          ${aiStatus !== "ready" || deliveryStatus === "sending" || deliveryStatus === "sent" ? "disabled" : ""}
        >
          ${buildSendButtonLabel(aiStatus, deliveryStatus)}
        </button>
        <button class="button button-primary" type="button" data-action="copy-summary">
          Copiar resumen
        </button>
        <button class="button button-secondary" type="button" data-action="download-summary">
          Descargar .txt
        </button>
        <button class="button button-secondary" type="button" data-action="print-result">
          Guardar PDF
        </button>
        <button class="button button-ghost" type="button" data-action="restart-quiz">
          Nuevo diagnóstico
        </button>
      </div>

      ${buildDeliveryStatusMarkup(deliveryStatus)}
    </section>
  `);
}

function renderWireframeTool() {
  const brief = state.wireframe.brief;

  renderToolShell(`
    <section class="screen panel-enter">
      <div class="intro-grid wireframe-intro-grid">
        <article class="surface-card intro-copy">
          <p class="eyebrow">Diapositiva 20</p>
          <h2>La ficha de producto: donde la duda se convierte en decision.</h2>
          <p class="text-muted">
            La ficha no debe limitarse a describir. Debe responder preguntas, reducir objeciones
            y facilitar la compra. Describe un producto y te sugeriremos una estructura ideal.
          </p>

          <div class="info-grid">
            <div class="mini-card">
              <strong>Objetivo</strong>
              <span>Mostrar la ficha como punto decisivo de la conversion.</span>
            </div>
            <div class="mini-card">
              <strong>Enfoque</strong>
              <span>Priorizar lo que ayuda a decidir: evidencia, claridad y CTA visible.</span>
            </div>
          </div>

          <ul class="mini-list">
            <li>Titulo claro, precio visible y beneficios concretos.</li>
            <li>Fotografias utiles, variantes y disponibilidad sin ambiguedad.</li>
            <li>CTA visible, preguntas frecuentes y senales de confianza.</li>
          </ul>
        </article>

        <article class="surface-card">
          <p class="eyebrow">Describe el producto</p>
          <form id="wireframe-form" class="form-stack">
            <p class="field-help">
              Con una descripcion simple ya podemos sugerir una ficha mas util. Si agregas contexto, el wireframe mejora.
            </p>

            <div class="field">
              <label for="wireframe-product-description">
                Producto o descripcion
                <span class="required-pill">Obligatorio</span>
              </label>
              <textarea
                id="wireframe-product-description"
                name="productDescription"
                maxlength="500"
                required
                aria-required="true"
                placeholder="Ej. Serum facial con niacinamida para piel grasa, pensado para rutina diaria y venta en marca propia"
              >${escapeHtml(brief.productDescription)}</textarea>
            </div>

            <div class="field">
              <label for="wireframe-target-customer">A quien se lo vendes</label>
              <textarea
                id="wireframe-target-customer"
                name="targetCustomer"
                maxlength="260"
                placeholder="Ej. Mujeres de 22 a 38 anos que buscan control de brillo y cuidado simple"
              >${escapeHtml(brief.targetCustomer)}</textarea>
            </div>

            <div class="form-split">
              <div class="field">
                <label for="wireframe-price-reference">Precio o rango</label>
                <input
                  id="wireframe-price-reference"
                  name="priceReference"
                  type="text"
                  maxlength="60"
                  placeholder="Ej. $699 MXN"
                  value="${escapeHtml(brief.priceReference)}"
                >
              </div>

              <div class="field">
                <label for="wireframe-differentiator">Diferencial principal</label>
                <input
                  id="wireframe-differentiator"
                  name="differentiator"
                  type="text"
                  maxlength="220"
                  placeholder="Ej. Formula ligera, sin fragancia y con resultados visibles"
                  value="${escapeHtml(brief.differentiator)}"
                >
              </div>
            </div>

            <div class="button-row">
              <button class="button button-primary" type="submit">Generar wireframe</button>
              <button class="button button-secondary" type="button" data-action="clear-wireframe">
                Limpiar brief
              </button>
            </div>
          </form>
        </article>
      </div>

      ${buildWireframePanelMarkup()}
    </section>
  `);
}

function buildWireframePanelMarkup() {
  if (state.wireframe.status === "loading") {
    return `
      <section class="result-card wireframe-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Wireframe sugerido</p>
            <h3 class="ai-title">Estamos armando la estructura ideal de tu ficha de producto.</h3>
          </div>
          <span class="status-chip status-chip-active">Construyendo</span>
        </div>
        <div class="loading-stack" aria-hidden="true">
          <div class="loading-line loading-line-lg"></div>
          <div class="loading-line"></div>
          <div class="loading-line loading-line-sm"></div>
        </div>
      </section>
    `;
  }

  if (state.wireframe.status === "error") {
    return `
      <section class="result-card wireframe-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Wireframe sugerido</p>
            <h3 class="ai-title">No pudimos generar la propuesta en este intento.</h3>
          </div>
          <button class="button button-secondary" type="button" data-action="retry-wireframe">
            Reintentar
          </button>
        </div>
      </section>
    `;
  }

  if (state.wireframe.status !== "ready" || !state.wireframe.result) {
    return `
      <section class="result-card wireframe-panel wireframe-empty">
        <p class="eyebrow">Wireframe sugerido</p>
        <h3 class="ai-title">Aqui veras una ficha ideal para convertir mejor.</h3>
        <p class="helper-copy">
          La propuesta mostrara titulo, precio, beneficios, variantes, disponibilidad,
          CTA visible, senales de confianza y secciones que resuelven objeciones.
        </p>
      </section>
    `;
  }

  const result = state.wireframe.result;

  return `
    <section class="result-card wireframe-panel">
      <div class="wireframe-header">
        <div>
          <p class="eyebrow">Wireframe sugerido</p>
          <h3 class="ai-title">${escapeHtml(result.wireframeTitle)}</h3>
          <p class="helper-copy">${escapeHtml(result.decisionMessage)}</p>
          <div class="tag-grid">
            <span class="tag">${escapeHtml(result.categoryLabel || "Producto")}</span>
            <span class="tag">${escapeHtml(result.audienceLabel || "Cliente objetivo")}</span>
          </div>
        </div>
        <div class="status-stack">
          <span class="status-chip">${escapeHtml(result.pageGoal)}</span>
        </div>
      </div>

      <div class="wireframe-board">
        <article class="wf-card wf-gallery">
          <span class="wf-label">1. Fotografias utiles</span>
          <div class="wf-hero-media">
            <strong>Hero principal</strong>
            <span>${escapeHtml(result.photoNotes[0])}</span>
          </div>
          <div class="wf-media-grid">
            ${result.photoNotes
              .slice(1, 4)
              .map((item, index) => `<div class="wf-media-box"><strong>Apoyo ${index + 1}</strong><span>${escapeHtml(item)}</span></div>`)
              .join("")}
          </div>
        </article>

        <article class="wf-card wf-buybox">
          <span class="wf-label">2. Zona decisiva</span>
          <h4>${escapeHtml(result.productTitle)}</h4>
          <p class="wf-hook">${escapeHtml(result.shortHook)}</p>
          <div class="wf-price">${escapeHtml(result.pricePresentation)}</div>
          <div class="wf-proof-list">
            ${result.proofPoints.map((item) => `<div class="wf-proof-item">${escapeHtml(item)}</div>`).join("")}
          </div>
          <div class="wf-pill-row">
            ${result.variants.map((item) => `<span class="wf-pill">${escapeHtml(item)}</span>`).join("")}
          </div>
          <p class="wf-availability">${escapeHtml(result.availability)}</p>
          <div class="wf-cta-stack">
            <button class="button button-primary" type="button">${escapeHtml(result.primaryCta)}</button>
            <button class="button button-secondary" type="button">${escapeHtml(result.secondaryCta)}</button>
          </div>
        </article>

        <article class="wf-card">
          <span class="wf-label">3. Beneficios y atributos</span>
          <ul class="feature-list">
            ${result.benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
          <div class="wf-mini-divider"></div>
          <div class="wf-attribute-grid">
            ${result.attributes.map((item) => `<span class="wf-attribute">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>

        <article class="wf-card">
          <span class="wf-label">4. Casos de uso y confianza</span>
          <div class="wf-usecase-grid">
            ${result.useCases.map((item) => `<div class="wf-usecase">${escapeHtml(item)}</div>`).join("")}
          </div>
          <div class="wf-mini-divider"></div>
          <div class="tag-grid">
            ${result.trustSignals.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>

        <article class="wf-card">
          <span class="wf-label">5. Preguntas frecuentes</span>
          <ol class="action-list">
            ${result.faq.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ol>
        </article>

        <article class="wf-card wf-mobile-card">
          <span class="wf-label">6. Prioridad movil</span>
          <p>${escapeHtml(result.mobileStickyBar)}</p>
          <div class="wf-mobile-preview">
            <span>${escapeHtml(result.pricePresentation)}</span>
            <strong>${escapeHtml(result.primaryCta)}</strong>
          </div>
        </article>
      </div>

      <div class="wireframe-insight-grid">
        <article class="bar-card">
          <h3>Objeciones a resolver</h3>
          <ul class="summary-list">
            ${result.objections.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>

        <article class="bar-card">
          <h3>Notas de conversion</h3>
          <ul class="summary-list">
            ${result.conversionNotes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      </div>

      <div class="footer-actions">
        <button class="button button-primary" type="button" data-action="copy-wireframe">
          Copiar guia
        </button>
        <button class="button button-secondary" type="button" data-action="download-wireframe">
          Descargar .txt
        </button>
        <button class="button button-ghost" type="button" data-action="reset-wireframe-result">
          Generar otro
        </button>
      </div>
    </section>
  `;
}

function renderStoreMessagesTool() {
  const brief = state.messages.brief;

  renderToolShell(`
    <section class="screen panel-enter">
      <div class="intro-grid messages-intro-grid">
        <article class="surface-card intro-copy">
          <p class="eyebrow">Mensajes para tienda</p>
          <h2>Toda tienda necesita respuestas listas antes de que el cliente pregunte.</h2>
          <p class="text-muted">
            Los mensajes preparados no deben sonar roboticos. Deben ayudar a responder con
            claridad, rapidez y consistencia en los momentos que mas afectan la confianza.
          </p>

          <div class="info-grid">
            <div class="mini-card">
              <strong>10 momentos</strong>
              <span>Bienvenida, producto, precio, pedido, pago, envio, retrasos y postventa.</span>
            </div>
            <div class="mini-card">
              <strong>Listos para editar</strong>
              <span>Incluye placeholders para pedido, guia, fecha y datos del cliente.</span>
            </div>
          </div>

          <ul class="mini-list">
            <li>Reduce respuestas improvisadas y errores de comunicacion.</li>
            <li>Adapta tono, canal, producto y tipo de entrega.</li>
            <li>Envia el paquete por correo al alumno y al profesor.</li>
          </ul>
        </article>

        <article class="surface-card">
          <p class="eyebrow">Brief de comunicacion</p>
          <form id="messages-form" class="form-stack">
            <p class="field-help">
              Describe lo que vendes y como entregas. La IA generara textos para usar en WhatsApp, Instagram, email o tienda.
            </p>

            <div class="form-split">
              <div class="field">
                <label for="messages-student-name">Tu nombre</label>
                <input
                  id="messages-student-name"
                  name="studentName"
                  type="text"
                  maxlength="80"
                  placeholder="Ej. Andrea Lopez"
                  value="${escapeHtml(brief.studentName)}"
                >
              </div>

              <div class="field">
                <label for="messages-student-email">
                  Correo
                  <span class="required-pill">Obligatorio</span>
                </label>
                <input
                  id="messages-student-email"
                  name="studentEmail"
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  maxlength="120"
                  required
                  aria-required="true"
                  placeholder="tu@correo.com"
                  value="${escapeHtml(brief.studentEmail)}"
                >
              </div>
            </div>

            <div class="field">
              <label for="messages-store-name">Nombre de la tienda o proyecto</label>
              <input
                id="messages-store-name"
                name="storeName"
                type="text"
                maxlength="90"
                placeholder="Ej. Skin Routine Lab"
                value="${escapeHtml(brief.storeName)}"
              >
            </div>

            <div class="field">
              <label for="messages-product-description">
                Que vendes exactamente
                <span class="required-pill">Obligatorio</span>
              </label>
              <textarea
                id="messages-product-description"
                name="productDescription"
                maxlength="500"
                required
                aria-required="true"
                placeholder="Ej. Guantes de nitrilo industriales naranjas con textura para talleres, laboratorios y uso rudo"
              >${escapeHtml(brief.productDescription)}</textarea>
            </div>

            <div class="field">
              <label for="messages-target-customer">Cliente ideal</label>
              <textarea
                id="messages-target-customer"
                name="targetCustomer"
                maxlength="260"
                placeholder="Ej. Compradores B2B, responsables de compras o usuarios industriales que necesitan seguridad y disponibilidad"
              >${escapeHtml(brief.targetCustomer)}</textarea>
            </div>

            <div class="form-split">
              <div class="field">
                <label for="messages-product-type">Tipo de producto</label>
                <select id="messages-product-type" name="productType">
                  ${buildSelectOptions(
                    [
                      ["no-definido", "Aun no lo defino"],
                      ["fisico", "Producto fisico"],
                      ["digital", "Producto digital"],
                      ["servicio", "Servicio"],
                      ["personalizado", "Producto personalizado"],
                      ["perecedero", "Producto perecedero"],
                    ],
                    brief.productType
                  )}
                </select>
              </div>

              <div class="field">
                <label for="messages-tone">Tono de marca</label>
                <select id="messages-tone" name="tone">
                  ${buildSelectOptions(
                    [
                      ["cercano", "Cercano y claro"],
                      ["premium", "Premium y cuidado"],
                      ["tecnico", "Tecnico y preciso"],
                      ["juvenil", "Juvenil y breve"],
                      ["institucional", "Institucional y formal"],
                    ],
                    brief.tone
                  )}
                </select>
              </div>
            </div>

            <div class="form-split">
              <div class="field">
                <label for="messages-sales-channel">Canal principal</label>
                <select id="messages-sales-channel" name="salesChannel">
                  ${buildSelectOptions(
                    [
                      ["whatsapp", "WhatsApp"],
                      ["instagram", "Instagram DM"],
                      ["email", "Email"],
                      ["marketplace", "Marketplace"],
                      ["tienda", "Tienda en linea"],
                    ],
                    brief.salesChannel
                  )}
                </select>
              </div>

              <div class="field">
                <label for="messages-shipping-type">Tipo de envio o entrega</label>
                <select id="messages-shipping-type" name="shippingType">
                  ${buildSelectOptions(
                    [
                      ["paqueteria", "Envio por paqueteria"],
                      ["local", "Entrega local"],
                      ["pickup", "Recoleccion en punto"],
                      ["digital", "Entrega digital"],
                      ["personalizado", "Entrega personalizada"],
                    ],
                    brief.shippingType
                  )}
                </select>
              </div>
            </div>

            <div class="form-split">
              <div class="field">
                <label for="messages-delivery-time">Tiempo estimado de entrega</label>
                <input
                  id="messages-delivery-time"
                  name="deliveryTime"
                  type="text"
                  maxlength="120"
                  placeholder="Ej. 2 a 4 dias habiles"
                  value="${escapeHtml(brief.deliveryTime)}"
                >
              </div>

              <div class="field">
                <label for="messages-payment-methods">Metodos de pago</label>
                <input
                  id="messages-payment-methods"
                  name="paymentMethods"
                  type="text"
                  maxlength="140"
                  placeholder="Ej. Tarjeta, transferencia y Mercado Pago"
                  value="${escapeHtml(brief.paymentMethods)}"
                >
              </div>
            </div>

            <div class="field">
              <label for="messages-return-policy">Politica de cambios o devoluciones</label>
              <textarea
                id="messages-return-policy"
                name="returnPolicy"
                maxlength="260"
                placeholder="Ej. Cambios dentro de 7 dias si el producto esta cerrado y con comprobante"
              >${escapeHtml(brief.returnPolicy)}</textarea>
            </div>

            <div class="button-row">
              <button class="button button-primary" type="submit">Generar mensajes</button>
              <button class="button button-secondary" type="button" data-action="clear-messages">
                Limpiar brief
              </button>
            </div>
          </form>
        </article>
      </div>

      ${buildMessagesPanelMarkup()}
    </section>
  `);

  ensureAutomaticMessagesDelivery();
}

function buildMessagesPanelMarkup() {
  const deliveryStatus = state.messages.delivery.status;

  if (state.messages.status === "loading") {
    return `
      <section class="result-card messages-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Kit de mensajes</p>
            <h3 class="ai-title">Estamos preparando respuestas claras para cada momento de la compra.</h3>
          </div>
          <span class="status-chip status-chip-active">Generando</span>
        </div>
        <div class="loading-stack" aria-hidden="true">
          <div class="loading-line loading-line-lg"></div>
          <div class="loading-line"></div>
          <div class="loading-line loading-line-sm"></div>
        </div>
      </section>
    `;
  }

  if (state.messages.status === "error") {
    return `
      <section class="result-card messages-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Kit de mensajes</p>
            <h3 class="ai-title">No pudimos generar los mensajes en este intento.</h3>
          </div>
          <button class="button button-secondary" type="button" data-action="retry-messages">
            Reintentar
          </button>
        </div>
      </section>
    `;
  }

  if (state.messages.status !== "ready" || !state.messages.result) {
    return `
      <section class="result-card messages-panel messages-empty">
        <p class="eyebrow">Kit de mensajes</p>
        <h3 class="ai-title">Aqui apareceran 10 mensajes listos para adaptar y usar.</h3>
        <p class="helper-copy">
          Cubriremos bienvenida, informacion de producto, precio, pedido, pago, envio,
          retrasos, entrega, postventa y cambios o devoluciones.
        </p>
      </section>
    `;
  }

  const result = state.messages.result;
  const brief = normalizeMessageBrief(state.messages.brief);

  return `
    <section class="result-card messages-panel">
      <div class="wireframe-header">
        <div>
          <p class="eyebrow">Kit de mensajes</p>
          <h3 class="ai-title">${escapeHtml(result.headline)}</h3>
          <p class="helper-copy">${escapeHtml(result.strategyNote)}</p>
          <div class="tag-grid">
            <span class="tag">${escapeHtml(translateSalesChannel(brief.salesChannel))}</span>
            <span class="tag">${escapeHtml(translateTone(brief.tone))}</span>
            <span class="tag">${escapeHtml(translateShippingType(brief.shippingType))}</span>
          </div>
        </div>
        <div class="status-stack">
          <span class="status-chip">${result.messages.length} mensajes</span>
        </div>
      </div>

      <div class="messages-strategy-grid">
        <article class="bar-card">
          <h3>Guia de tono</h3>
          <ul class="summary-list">
            ${result.toneGuidelines.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>

        <article class="bar-card">
          <h3>Variables utiles</h3>
          <div class="tag-grid">
            ${result.variables.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>
      </div>

      <div class="message-grid">
        ${result.messages
          .map(
            (message, index) => `
              <article class="message-card">
                <span class="message-number">${String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h4>${escapeHtml(message.title)}</h4>
                  <p class="message-purpose">${escapeHtml(message.purpose)}</p>
                </div>
                <div class="message-subject">Asunto sugerido: ${escapeHtml(message.subject)}</div>
                <p class="message-copy">${escapeHtml(message.message)}</p>
                <div class="message-meta">
                  <span>${escapeHtml(message.whenToUse)}</span>
                  <strong>${escapeHtml(message.channelTip)}</strong>
                </div>
              </article>
            `
          )
          .join("")}
      </div>

      <div class="footer-actions">
        <button class="button button-primary" type="button" data-action="send-messages" ${deliveryStatus === "sending" || deliveryStatus === "sent" ? "disabled" : ""}>
          ${buildMessagesSendButtonLabel(deliveryStatus)}
        </button>
        <button class="button button-primary" type="button" data-action="copy-messages">
          Copiar mensajes
        </button>
        <button class="button button-secondary" type="button" data-action="download-messages">
          Descargar .txt
        </button>
        <button class="button button-ghost" type="button" data-action="reset-messages-result">
          Generar otro
        </button>
      </div>

      ${buildMessagesDeliveryStatusMarkup(deliveryStatus)}
    </section>
  `;
}

function renderVolumetricTool() {
  const simulator = normalizeVolumetricSimulator(state.volumetric.simulator);
  const result = calculateVolumetric(simulator);
  const presets = getBoxPresets();
  const selectedPreset = presets.find((preset) => preset.id === simulator.boxPreset);

  renderToolShell(`
    <section class="screen panel-enter volumetric-screen">
      <div class="volumetric-hero">
        <div>
          <p class="eyebrow">Simulador de paqueteria</p>
          <h2>Peso volumetrico: el costo invisible de enviar aire.</h2>
          <p>
            La paqueteria compara el peso real contra el peso volumetrico y normalmente cobra el mayor.
            Cambia caja, factor y peso para ver por que una caja grande ligera puede destruir el margen.
          </p>
        </div>
        <div class="formula-card">
          <span>Formula universal</span>
          <strong>(Largo x Ancho x Alto) / Factor</strong>
          <p>Usa centimetros y kilogramos. El factor puede cambiar por paqueteria, servicio y destino.</p>
        </div>
      </div>

      <div class="volumetric-layout">
        <article class="surface-card volumetric-controls">
          <p class="eyebrow">Datos del paquete</p>
          <form id="volumetric-form" class="form-stack">
            <div class="field">
              <label for="volumetric-preset">Caja estandar o ejemplo</label>
              <select id="volumetric-preset" name="boxPreset" data-volumetric-field="boxPreset">
                <option value="custom" ${simulator.boxPreset === "custom" ? "selected" : ""}>Personalizada</option>
                ${presets
                  .map(
                    (preset) =>
                      `<option value="${preset.id}" ${preset.id === simulator.boxPreset ? "selected" : ""}>${escapeHtml(
                        preset.label
                      )}</option>`
                  )
                  .join("")}
              </select>
              ${
                selectedPreset
                  ? `<p class="field-help">${escapeHtml(selectedPreset.description)}</p>`
                  : `<p class="field-help">Ajusta las dimensiones reales de la caja final, no solo el producto.</p>`
              }
            </div>

            <div class="volumetric-dim-grid">
              ${buildVolumetricNumberField("length", "Largo", simulator.length, "cm")}
              ${buildVolumetricNumberField("width", "Ancho", simulator.width, "cm")}
              ${buildVolumetricNumberField("height", "Alto", simulator.height, "cm")}
              ${buildVolumetricNumberField("realWeight", "Peso real", simulator.realWeight, "kg", "0.01")}
            </div>

            <div class="form-split">
              <div class="field">
                <label for="volumetric-factor">Factor volumetrico</label>
                <select id="volumetric-factor" name="factor" data-volumetric-field="factor">
                  ${getFactorOptions()
                    .map(
                      (option) =>
                        `<option value="${option.value}" ${Number(option.value) === Number(simulator.factor) ? "selected" : ""}>${escapeHtml(
                          option.label
                        )}</option>`
                    )
                    .join("")}
                </select>
                <p class="field-help">5000 y 6000 son referencias comunes, pero cada paqueteria puede definir condiciones propias.</p>
              </div>

              <div class="field">
                <label for="volumetric-rounding">Redondeo de cobro</label>
                <select id="volumetric-rounding" name="rounding" data-volumetric-field="rounding">
                  ${buildSelectOptions(
                    [
                      ["ceil", "Al kg superior"],
                      ["half", "Al medio kg superior"],
                      ["none", "Sin redondeo didactico"],
                    ],
                    simulator.rounding
                  )}
                </select>
              </div>
            </div>

            <div class="field">
              <label for="volumetric-rate">Tarifa por kg cobrable (opcional)</label>
              <input
                id="volumetric-rate"
                name="ratePerKg"
                type="number"
                min="0"
                step="1"
                data-volumetric-field="ratePerKg"
                placeholder="Ej. 95"
                value="${escapeHtml(simulator.ratePerKg)}"
              >
              <p class="field-help">Si tienes una tarifa estimada, calculamos un costo aproximado para clase.</p>
            </div>

            <div class="button-row">
              <button class="button button-primary volumetric-primary" type="submit">Actualizar simulacion</button>
              <button class="button button-secondary" type="button" data-action="reset-volumetric">
                Reiniciar
              </button>
            </div>
          </form>
        </article>

        ${buildVolumetricResultMarkup(result)}
      </div>

      <section class="volumetric-examples">
        <article>
          <span>Ejemplo 1</span>
          <h3>Caja chica pesada</h3>
          <p>20 x 15 x 10 cm / 5000 = 0.6 kg volumetricos. Si pesa 1.5 kg reales, cobran 1.5 kg.</p>
        </article>
        <article>
          <span>Ejemplo 2</span>
          <h3>Caja grande ligera</h3>
          <p>40 x 30 x 25 cm / 5000 = 6 kg volumetricos. Si pesa 0.8 kg reales, pueden cobrar 6 kg.</p>
        </article>
        <article>
          <span>Conclusion</span>
          <h3>La caja correcta protege el margen</h3>
          <p>Reducir aire, relleno y altura puede bajar de forma importante el costo de envio.</p>
        </article>
      </section>
    </section>
  `);
}

function buildVolumetricResultMarkup(result) {
  const simulator = result.simulator;
  const risk = result.riskLevel;
  const estimatedCostMarkup =
    result.estimatedCost !== null
      ? `<div class="volumetric-cost">$${formatNumber(result.estimatedCost, 2)} MXN estimados</div>`
      : `<p class="field-help">Agrega una tarifa por kg para estimar costo.</p>`;

  return `
    <article class="result-card volumetric-result">
      <div class="volumetric-result-header">
        <div>
          <p class="eyebrow">Resultado</p>
          <h3>${result.dominant === "volumetric" ? "Gana el peso volumetrico" : "Gana el peso real"}</h3>
        </div>
        <span class="volumetric-risk" data-tone="${risk.tone}">${escapeHtml(risk.label)}</span>
      </div>

      <div class="volumetric-equation">
        <span>(${formatNumber(simulator.length)} x ${formatNumber(simulator.width)} x ${formatNumber(simulator.height)}) / ${formatNumber(
          simulator.factor,
          0
        )}</span>
        <strong>${formatNumber(result.volumetricWeight)} kg volumetricos</strong>
      </div>

      <div class="volumetric-metrics">
        <div>
          <span>Peso real</span>
          <strong>${formatNumber(simulator.realWeight)} kg</strong>
          <small>Caja sobre bascula</small>
        </div>
        <div>
          <span>Peso volumetrico</span>
          <strong>${formatNumber(result.volumetricWeight)} kg</strong>
          <small>Volumen / factor</small>
        </div>
        <div class="metric-featured">
          <span>Peso cobrable</span>
          <strong>${formatNumber(result.chargeableWeight)} kg</strong>
          <small>Mayor entre ambos</small>
        </div>
      </div>

      <p class="volumetric-explanation">${escapeHtml(result.explanation)}</p>

      <div class="volumetric-impact-grid">
        <div>
          <span>Multiplicador vs peso real</span>
          <strong>${formatNumber(result.multiplier, 1)}x</strong>
          <small>${escapeHtml(risk.detail)}</small>
        </div>
        <div>
          <span>Volumen de caja</span>
          <strong>${formatNumber(result.volumeCm3, 0)} cm3</strong>
          <small>El aire tambien ocupa espacio logistico.</small>
        </div>
      </div>

      <div class="volumetric-suggestion">
        <span>Simulacion de caja 10%-15% mas compacta</span>
        <p>
          Si aproximas la caja a ${result.compactSuggestion.length} x ${result.compactSuggestion.width} x ${result.compactSuggestion.height} cm,
          el volumetrico bajaria a ${formatNumber(result.compactSuggestion.volumetricWeight)} kg.
        </p>
        <strong>Reduccion volumetrica aproximada: ${formatNumber(result.compactSuggestion.potentialReduction, 0)}%</strong>
      </div>

      ${estimatedCostMarkup}

      <div class="footer-actions">
        <button class="button button-primary" type="button" data-action="copy-volumetric">
          Copiar calculo
        </button>
        <button class="button button-secondary" type="button" data-action="download-volumetric">
          Descargar .txt
        </button>
      </div>
    </article>
  `;
}

function buildVolumetricNumberField(name, label, value, suffix, step = "1") {
  return `
    <div class="field volumetric-number-field">
      <label for="volumetric-${name}">${escapeHtml(label)}</label>
      <div>
        <input
          id="volumetric-${name}"
          name="${name}"
          type="number"
          min="0.01"
          step="${step}"
          data-volumetric-field="${name}"
          value="${escapeHtml(value)}"
        >
        <span>${escapeHtml(suffix)}</span>
      </div>
    </div>
  `;
}

function renderLogisticsTool() {
  const brief = state.logistics.brief;
  const selectedErrors = new Set(brief.currentErrors);
  const errorCatalog = getLogisticsErrorCatalog();

  renderToolShell(`
    <section class="screen panel-enter">
      <div class="intro-grid logistics-intro-grid">
        <article class="surface-card intro-copy logistics-copy">
          <p class="eyebrow">Comunicacion logistica</p>
          <h2>No prometas rapido; promete claro.</h2>
          <p class="text-muted">
            La logistica no solo mueve productos. Tambien sostiene la confianza del cliente.
            Esta herramienta genera mensajes concretos para entrega, guias, retrasos y problemas.
          </p>

          <div class="info-grid">
            <div class="mini-card">
              <strong>Promesa clara</strong>
              <span>Rangos, costos, responsables, guias y siguientes pasos.</span>
            </div>
            <div class="mini-card">
              <strong>Menos friccion</strong>
              <span>Respuestas preparadas antes de que el cliente tenga que reclamar.</span>
            </div>
          </div>

          <ul class="mini-list">
            <li>Adapta mensajes para producto fisico, digital o servicio.</li>
            <li>Detecta errores comunes de comunicacion logistica.</li>
            <li>Envia el paquete por correo al alumno y al profesor.</li>
          </ul>
        </article>

        <article class="surface-card">
          <p class="eyebrow">Brief logistico</p>
          <form id="logistics-form" class="form-stack">
            <div class="form-split">
              <div class="field">
                <label for="logistics-student-name">Tu nombre</label>
                <input
                  id="logistics-student-name"
                  name="studentName"
                  type="text"
                  maxlength="80"
                  placeholder="Ej. Andrea Lopez"
                  value="${escapeHtml(brief.studentName)}"
                >
              </div>

              <div class="field">
                <label for="logistics-student-email">
                  Correo
                  <span class="required-pill">Obligatorio</span>
                </label>
                <input
                  id="logistics-student-email"
                  name="studentEmail"
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  maxlength="120"
                  required
                  aria-required="true"
                  placeholder="tu@correo.com"
                  value="${escapeHtml(brief.studentEmail)}"
                >
              </div>
            </div>

            <div class="field">
              <label for="logistics-business-name">Nombre del negocio</label>
              <input
                id="logistics-business-name"
                name="businessName"
                type="text"
                maxlength="90"
                placeholder="Ej. Babal Wines"
                value="${escapeHtml(brief.businessName)}"
              >
            </div>

            <div class="field">
              <label for="logistics-product-description">
                Que vendes
                <span class="required-pill">Obligatorio</span>
              </label>
              <textarea
                id="logistics-product-description"
                name="productDescription"
                maxlength="520"
                required
                aria-required="true"
                placeholder="Ej. Vinos artesanales boutique de Aguascalientes, botellas de 750 ml, marca Babal"
              >${escapeHtml(brief.productDescription)}</textarea>
            </div>

            <div class="form-split form-three">
              <div class="field">
                <label for="logistics-business-type">Tipo</label>
                <select id="logistics-business-type" name="businessType">
                  ${buildSelectOptions(
                    [
                      ["producto_fisico", "Producto fisico"],
                      ["digital", "Producto digital"],
                      ["servicio", "Servicio"],
                    ],
                    brief.businessType
                  )}
                </select>
              </div>

              <div class="field">
                <label for="logistics-coverage">Cobertura</label>
                <select id="logistics-coverage" name="coverage">
                  ${buildSelectOptions(
                    [
                      ["local", "Local (misma ciudad)"],
                      ["nacional", "Nacional (Mexico)"],
                      ["internacional", "Internacional"],
                    ],
                    brief.coverage
                  )}
                </select>
              </div>

              <div class="field">
                <label for="logistics-prep-time">Preparacion</label>
                <select id="logistics-prep-time" name="prepTime">
                  ${buildSelectOptions(getLogisticsPrepOptions().map((item) => [item, item]), brief.prepTime)}
                </select>
              </div>
            </div>

            <div class="form-split">
              <div class="field">
                <label for="logistics-shipping-cost">Costo de envio o entrega</label>
                <input
                  id="logistics-shipping-cost"
                  name="shippingCost"
                  type="text"
                  maxlength="120"
                  placeholder="Ej. $120 MXN o gratis desde $999"
                  value="${escapeHtml(brief.shippingCost)}"
                >
              </div>

              <div class="field">
                <label for="logistics-carriers">Paqueteria, repartidor o metodo</label>
                <input
                  id="logistics-carriers"
                  name="carriers"
                  type="text"
                  maxlength="160"
                  placeholder="Ej. DHL, FedEx, repartidor local o link de acceso"
                  value="${escapeHtml(brief.carriers)}"
                >
              </div>
            </div>

            <div class="field">
              <label for="logistics-damage-policy">Que haces si algo llega danado o falla</label>
              <textarea
                id="logistics-damage-policy"
                name="damagePolicy"
                maxlength="260"
                placeholder="Ej. Pedimos fotos del empaque y producto, revisamos en 24 horas y ofrecemos reposicion si aplica"
              >${escapeHtml(brief.damagePolicy)}</textarea>
            </div>

            <div class="logistics-checklist">
              <div class="checklist-header">
                <div>
                  <h3>Errores que cometes hoy</h3>
                  <p>Marca los que han pasado en tu comunicacion con clientes.</p>
                </div>
                <span>${brief.currentErrors.length}/${errorCatalog.length}</span>
              </div>
              <div class="checklist-grid">
                ${errorCatalog
                  .map(
                    (error) => `
                      <label class="check-card">
                        <input
                          type="checkbox"
                          name="currentErrors"
                          value="${error.id}"
                          ${selectedErrors.has(error.id) ? "checked" : ""}
                        >
                        <span>${escapeHtml(error.text)}</span>
                      </label>
                    `
                  )
                  .join("")}
              </div>
            </div>

            <div class="button-row">
              <button class="button button-primary logistics-primary" type="submit">Generar mensajes claros</button>
              <button class="button button-secondary" type="button" data-action="clear-logistics">
                Limpiar brief
              </button>
            </div>
          </form>
        </article>
      </div>

      ${buildLogisticsPanelMarkup()}
    </section>
  `);

  ensureAutomaticLogisticsDelivery();
}

function buildLogisticsPanelMarkup() {
  const deliveryStatus = state.logistics.delivery.status;

  if (state.logistics.status === "loading") {
    return `
      <section class="result-card logistics-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Mensajes logisticos</p>
            <h3 class="ai-title">Estamos convirtiendo tu promesa de entrega en comunicacion clara.</h3>
          </div>
          <span class="status-chip status-chip-active">Generando</span>
        </div>
        <div class="loading-stack" aria-hidden="true">
          <div class="loading-line loading-line-lg"></div>
          <div class="loading-line"></div>
          <div class="loading-line loading-line-sm"></div>
        </div>
      </section>
    `;
  }

  if (state.logistics.status === "error") {
    return `
      <section class="result-card logistics-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Mensajes logisticos</p>
            <h3 class="ai-title">No pudimos generar los mensajes en este intento.</h3>
          </div>
          <button class="button button-secondary" type="button" data-action="retry-logistics">
            Reintentar
          </button>
        </div>
      </section>
    `;
  }

  if (state.logistics.status !== "ready" || !state.logistics.result) {
    return `
      <section class="result-card logistics-panel logistics-empty">
        <p class="eyebrow">Mensajes logisticos</p>
        <h3 class="ai-title">Aqui veras mensajes para explicar tiempos, guias, retrasos y problemas.</h3>
        <p class="helper-copy">
          La meta no es prometer velocidad imposible: es explicar con claridad que pasa,
          cuando pasa y que hara la tienda si algo cambia.
        </p>
      </section>
    `;
  }

  const result = state.logistics.result;
  const brief = normalizeLogisticsBrief(state.logistics.brief);
  const messageCards = [
    ["01", "Respuesta a pregunta de entrega", "Cuando un cliente pregunta cuanto tarda o como se entrega.", result.mensaje_entrega],
    ["02", "Confirmacion de pedido", "Inmediatamente despues de recibir un pedido o pago.", result.confirmacion_pedido],
    ["03", "Aviso de envio o entrega", "Cuando el pedido sale, se entrega el acceso o queda agendado.", result.aviso_envio],
    ["04", "Comunicacion de retraso", "En cuanto sabes que no llegaras a la fecha prometida.", result.comunicacion_retraso],
    ["05", "Protocolo de dano o problema", "Cuando algo llego mal o no funciono como esperaba.", result.protocolo_danado],
  ];

  return `
    <section class="result-card logistics-panel">
      <div class="wireframe-header">
        <div>
          <p class="eyebrow">Mensajes logisticos</p>
          <h3 class="ai-title">Comunicacion logistica para ${escapeHtml(brief.businessName || "tu negocio")}</h3>
          <p class="helper-copy">No prometas rapido; promete claro.</p>
          <div class="tag-grid">
            <span class="tag">${escapeHtml(translateBusinessType(brief.businessType))}</span>
            <span class="tag">${escapeHtml(translateCoverage(brief.coverage))}</span>
            <span class="tag">Preparacion: ${escapeHtml(brief.prepTime)}</span>
          </div>
        </div>
        <div class="status-stack">
          <span class="status-chip">${brief.currentErrors.length} errores marcados</span>
        </div>
      </div>

      <div class="logistics-contrast">
        <article>
          <span>Mensaje debil</span>
          <p>"${escapeHtml(result.ejemplo_debil)}"</p>
        </article>
        <article>
          <span>Mensaje claro</span>
          <p>${escapeHtml(result.ejemplo_mejor)}</p>
        </article>
      </div>

      <div class="message-grid">
        ${messageCards
          .map(
            ([number, title, description, content]) => `
              <article class="message-card logistics-message-card">
                <span class="message-number">${number}</span>
                <div>
                  <h4>${escapeHtml(title)}</h4>
                  <p class="message-purpose">${escapeHtml(description)}</p>
                </div>
                <p class="message-copy">${escapeHtml(content)}</p>
              </article>
            `
          )
          .join("")}
      </div>

      <div class="logistics-tip">
        <span>Tu tip clave</span>
        <p>"${escapeHtml(result.tip_clave)}"</p>
      </div>

      <div class="footer-actions">
        <button class="button button-primary logistics-primary" type="button" data-action="send-logistics" ${deliveryStatus === "sending" || deliveryStatus === "sent" ? "disabled" : ""}>
          ${buildLogisticsSendButtonLabel(deliveryStatus)}
        </button>
        <button class="button button-primary" type="button" data-action="copy-logistics">
          Copiar mensajes
        </button>
        <button class="button button-secondary" type="button" data-action="download-logistics">
          Descargar .txt
        </button>
        <button class="button button-ghost" type="button" data-action="reset-logistics-result">
          Generar otro
        </button>
      </div>

      ${buildLogisticsDeliveryStatusMarkup(deliveryStatus)}
    </section>
  `;
}

function handleSubmit(event) {
  if (event.target.id === "volumetric-form") {
    event.preventDefault();
    updateVolumetricFromForm(event.target);
    showToast("Simulacion actualizada.");
    return;
  }

  if (event.target.id === "intake-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = sanitizeInput(formData.get("email")).toLowerCase();
    const emailField = event.target.querySelector("#email");

    if (emailField) {
      emailField.removeAttribute("aria-invalid");
    }

    if (!isValidEmail(email)) {
      if (emailField) {
        emailField.focus();
        emailField.setAttribute("aria-invalid", "true");
      }
      showToast("Ingresa un correo valido para continuar.");
      return;
    }

    state.intake = {
      studentName: sanitizeInput(formData.get("studentName")),
      projectName: sanitizeInput(formData.get("projectName")),
      email,
      productDescription: sanitizeLongText(formData.get("productDescription"), 500),
      targetCustomer: sanitizeLongText(formData.get("targetCustomer"), 320),
      businessModel: sanitizeBusinessModel(formData.get("businessModel")),
      averageTicket: sanitizeInput(formData.get("averageTicket")),
      salesChannels: sanitizeLongText(formData.get("salesChannels"), 160),
      primaryMarket: sanitizeInput(formData.get("primaryMarket")),
    };
    invalidateAiState();

    if (getAnsweredCount() === questions.length) {
      state.stage = "result";
    } else {
      state.stage = "quiz";
    }
    persistState();
    render();
    scrollToToolStart();
    return;
  }

  if (event.target.id === "wireframe-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productField = event.target.querySelector("#wireframe-product-description");
    const brief = normalizeBrief({
      productDescription: formData.get("productDescription"),
      targetCustomer: formData.get("targetCustomer"),
      priceReference: formData.get("priceReference"),
      differentiator: formData.get("differentiator"),
    });

    if (productField) {
      productField.removeAttribute("aria-invalid");
    }

    if (!brief.productDescription) {
      if (productField) {
        productField.focus();
        productField.setAttribute("aria-invalid", "true");
      }
      showToast("Describe el producto para generar el wireframe.");
      return;
    }

    state.wireframe.brief = brief;
    persistState();
    generateProductWireframe(true);
    scrollToToolStart();
  }

  if (event.target.id === "messages-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const emailField = event.target.querySelector("#messages-student-email");
    const productField = event.target.querySelector("#messages-product-description");
    const brief = normalizeMessageBrief({
      studentName: formData.get("studentName"),
      studentEmail: formData.get("studentEmail"),
      storeName: formData.get("storeName"),
      productDescription: formData.get("productDescription"),
      productType: formData.get("productType"),
      targetCustomer: formData.get("targetCustomer"),
      tone: formData.get("tone"),
      salesChannel: formData.get("salesChannel"),
      shippingType: formData.get("shippingType"),
      deliveryTime: formData.get("deliveryTime"),
      paymentMethods: formData.get("paymentMethods"),
      returnPolicy: formData.get("returnPolicy"),
    });

    if (emailField) {
      emailField.removeAttribute("aria-invalid");
    }
    if (productField) {
      productField.removeAttribute("aria-invalid");
    }

    if (!isValidEmail(brief.studentEmail)) {
      if (emailField) {
        emailField.focus();
        emailField.setAttribute("aria-invalid", "true");
      }
      showToast("Ingresa un correo valido para recibir los mensajes.");
      return;
    }

    if (!brief.productDescription) {
      if (productField) {
        productField.focus();
        productField.setAttribute("aria-invalid", "true");
      }
      showToast("Describe lo que vendes para generar los mensajes.");
      return;
    }

    state.messages.brief = brief;
    state.messages.delivery = createDefaultStoreMessagesState().delivery;
    persistState();
    generateStoreMessages(true);
    scrollToToolStart();
  }

  if (event.target.id === "logistics-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const emailField = event.target.querySelector("#logistics-student-email");
    const productField = event.target.querySelector("#logistics-product-description");
    const brief = normalizeLogisticsBrief({
      studentName: formData.get("studentName"),
      studentEmail: formData.get("studentEmail"),
      businessName: formData.get("businessName"),
      productDescription: formData.get("productDescription"),
      businessType: formData.get("businessType"),
      coverage: formData.get("coverage"),
      prepTime: formData.get("prepTime"),
      shippingCost: formData.get("shippingCost"),
      carriers: formData.get("carriers"),
      damagePolicy: formData.get("damagePolicy"),
      currentErrors: formData.getAll("currentErrors"),
    });

    if (emailField) {
      emailField.removeAttribute("aria-invalid");
    }
    if (productField) {
      productField.removeAttribute("aria-invalid");
    }

    if (!isValidEmail(brief.studentEmail)) {
      if (emailField) {
        emailField.focus();
        emailField.setAttribute("aria-invalid", "true");
      }
      showToast("Ingresa un correo valido para recibir los mensajes.");
      return;
    }

    if (!brief.productDescription) {
      if (productField) {
        productField.focus();
        productField.setAttribute("aria-invalid", "true");
      }
      showToast("Describe lo que vendes para generar mensajes logisticos.");
      return;
    }

    state.logistics.brief = brief;
    state.logistics.delivery = createDefaultLogisticsState().delivery;
    persistState();
    generateLogisticsMessages(true);
    scrollToToolStart();
  }
}

function handleInput(event) {
  const field = event.target.closest("[data-volumetric-field]");
  if (!field || state.activeTool !== "volumetric") {
    return;
  }

  const form = field.closest("#volumetric-form");
  if (!form) {
    return;
  }

  updateVolumetricFromForm(form);
}

function updateVolumetricFromForm(form) {
  const formData = new FormData(form);
  const selectedPreset = String(formData.get("boxPreset") || "custom");
  const current = {
    ...state.volumetric.simulator,
    boxPreset: selectedPreset,
    length: formData.get("length"),
    width: formData.get("width"),
    height: formData.get("height"),
    realWeight: formData.get("realWeight"),
    factor: formData.get("factor"),
    ratePerKg: formData.get("ratePerKg"),
    rounding: formData.get("rounding"),
  };

  state.volumetric.simulator =
    selectedPreset !== state.volumetric.simulator.boxPreset && selectedPreset !== "custom"
      ? applyBoxPreset(current, selectedPreset)
      : normalizeVolumetricSimulator(current);

  persistState();
  render();
}

function handleClick(event) {
  const optionButton = event.target.closest("[data-option-type]");
  if (optionButton) {
    selectOption(optionButton.dataset.optionType);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  const { action } = actionButton.dataset;

  switch (action) {
    case "switch-tool":
      switchTool(actionButton.dataset.tool);
      break;
    case "next-question":
      goNext();
      break;
    case "go-back":
      goBack();
      break;
    case "clear-local-data":
      clearIntake();
      render();
      showToast("Formulario limpiado.");
      break;
    case "clear-wireframe":
      invalidateWireframeState(false);
      persistState();
      render();
      showToast("Brief limpiado.");
      break;
    case "clear-messages":
      invalidateStoreMessagesState(false);
      persistState();
      render();
      showToast("Brief limpiado.");
      break;
    case "clear-logistics":
      invalidateLogisticsState(false);
      persistState();
      render();
      showToast("Brief limpiado.");
      break;
    case "reset-volumetric":
      resetVolumetricState();
      persistState();
      render();
      showToast("Simulador reiniciado.");
      break;
    case "copy-summary":
      copySummary();
      break;
    case "copy-wireframe":
      copyWireframe();
      break;
    case "copy-messages":
      copyMessages();
      break;
    case "copy-logistics":
      copyLogisticsMessages();
      break;
    case "copy-volumetric":
      copyVolumetricCalculation();
      break;
    case "send-summary":
      sendSummaryByEmail();
      break;
    case "send-messages":
      sendStoreMessagesByEmail();
      break;
    case "send-logistics":
      sendLogisticsByEmail();
      break;
    case "download-summary":
      downloadSummary();
      break;
    case "download-wireframe":
      downloadWireframe();
      break;
    case "download-messages":
      downloadMessages();
      break;
    case "download-logistics":
      downloadLogisticsMessages();
      break;
    case "download-volumetric":
      downloadVolumetricCalculation();
      break;
    case "retry-wireframe":
      generateProductWireframe(true);
      break;
    case "retry-messages":
      generateStoreMessages(true);
      break;
    case "retry-logistics":
      generateLogisticsMessages(true);
      break;
    case "retry-ai":
      ensureAiAnalysis(true);
      break;
    case "print-result":
      window.print();
      break;
    case "restart-quiz":
      resetState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    case "reset-wireframe-result":
      invalidateWireframeState(true);
      persistState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    case "reset-messages-result":
      invalidateStoreMessagesState(true);
      persistState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    case "reset-logistics-result":
      invalidateLogisticsState(true);
      persistState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    default:
      break;
  }
}

function sanitizeInput(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function sanitizeLongText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeBusinessModel(value) {
  return VALID_BUSINESS_MODELS.has(value) ? value : "no-definido";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function normalizeDeliveryState(value) {
  if (!value || typeof value !== "object") {
    return structuredClone(defaultState.delivery);
  }

  const status = ["idle", "sending", "sent", "error"].includes(value.status) ? value.status : "idle";
  return {
    status,
    reportHash: String(value.reportHash || ""),
    message: String(value.message || ""),
  };
}

function selectOption(type) {
  const isValid = questions[state.currentQuestionIndex].options.some((option) => option.type === type);
  if (!isValid) {
    return;
  }
  state.answers[state.currentQuestionIndex] = type;
  invalidateAiState();
  persistState();
  renderQuestion();
  animateStaticProgress();
}

function goNext() {
  if (!state.answers[state.currentQuestionIndex]) {
    return;
  }

  if (state.currentQuestionIndex === questions.length - 1) {
    state.stage = "result";
  } else {
    state.currentQuestionIndex += 1;
    state.stage = "quiz";
  }
  persistState();
  render();
  scrollToToolStart();
}

function goBack() {
  if (state.currentQuestionIndex === 0) {
    return;
  }
  state.currentQuestionIndex -= 1;
  state.stage = "quiz";
  persistState();
  render();
  scrollToToolStart();
}

function getAnsweredCount() {
  return state.answers.filter(Boolean).length;
}

function buildBusinessModelOptions(selectedValue) {
  const selected = sanitizeBusinessModel(selectedValue);
  const options = [
    { value: "no-definido", label: "Aun no lo defino" },
    { value: "marca-propia", label: "Marca propia" },
    { value: "reventa", label: "Reventa" },
    { value: "mixto", label: "Mixto" },
  ];

  return options
    .map(
      (option) =>
        `<option value="${option.value}" ${option.value === selected ? "selected" : ""}>${option.label}</option>`
    )
    .join("");
}

function buildSelectOptions(options, selectedValue) {
  return options
    .map(([value, label]) => `<option value="${value}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`)
    .join("");
}

function translateBusinessModel(value) {
  switch (sanitizeBusinessModel(value)) {
    case "marca-propia":
      return "Marca propia";
    case "reventa":
      return "Reventa";
    case "mixto":
      return "Mixto";
    default:
      return "Sin definir";
  }
}

function buildAiContext(baseAnalysis = calculateAnalysis()) {
  return {
    intake: {
      ...state.intake,
      businessModel: sanitizeBusinessModel(state.intake.businessModel),
    },
    answers: questions.map((question, index) => {
      const answerType = state.answers[index];
      const selectedOption = question.options.find((option) => option.type === answerType);
      return {
        id: question.id,
        title: question.title,
        answerType,
        answerLabel: selectedOption ? selectedOption.label : "",
      };
    }),
    baseAnalysis,
  };
}

function buildAiSectionMarkup(aiStatus, aiAnalysis) {
  if (aiStatus === "loading" || aiStatus === "idle") {
    return `
      <section class="result-card ai-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Lectura personalizada</p>
            <h3 class="ai-title">Estamos cruzando tus respuestas con el contexto de tu negocio.</h3>
          </div>
          <span class="status-chip status-chip-active">Analizando</span>
        </div>
        <div class="loading-stack" aria-hidden="true">
          <div class="loading-line loading-line-lg"></div>
          <div class="loading-line"></div>
          <div class="loading-line loading-line-sm"></div>
        </div>
      </section>
    `;
  }

  if (aiStatus === "error" || !aiAnalysis) {
    return `
      <section class="result-card ai-panel">
        <div class="ai-header">
          <div>
            <p class="eyebrow">Lectura personalizada</p>
            <h3 class="ai-title">No pudimos generar el analisis contextual en este intento.</h3>
          </div>
          <button class="button button-secondary" type="button" data-action="retry-ai">
            Reintentar
          </button>
        </div>
      </section>
    `;
  }

  return `
    <section class="result-card ai-panel">
      <div class="ai-header">
        <div>
          <p class="eyebrow">Lectura personalizada</p>
          <h3 class="ai-title">${escapeHtml(aiAnalysis.headline)}</h3>
        </div>
        <div class="status-stack">
          <span class="status-chip">Operacion: ${escapeHtml(aiAnalysis.operationalDifficulty)}</span>
          <span class="status-chip">Inversion: ${escapeHtml(aiAnalysis.investmentLevel)}</span>
        </div>
      </div>

      <p class="helper-copy">${escapeHtml(aiAnalysis.summary)}</p>

      <div class="tag-grid">
        ${aiAnalysis.contextSignals.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>

      <div class="ai-grid">
        <article class="ai-block">
          <h4>Por que esta ruta encaja</h4>
          <ul class="feature-list">
            ${aiAnalysis.whyThisFits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>

        <article class="ai-block">
          <h4>Por que no empezar por otras rutas</h4>
          <ul class="feature-list">
            ${aiAnalysis.whyNotNow.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>

        <article class="ai-block">
          <h4>Primer experimento sugerido</h4>
          <p class="helper-copy">${escapeHtml(aiAnalysis.firstExperiment)}</p>
        </article>

        <article class="ai-block">
          <h4>Senales que conviene medir</h4>
          <ul class="feature-list">
            ${aiAnalysis.metrics.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>

        <article class="ai-block">
          <h4>Sprint de 30 dias</h4>
          <ol class="action-list">
            ${aiAnalysis.sprint.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ol>
        </article>
      </div>
    </section>
  `;
}

function buildBusinessContextMarkup() {
  const contextItems = [
    state.intake.productDescription ? `Que vendes: ${state.intake.productDescription}` : "",
    state.intake.targetCustomer ? `Cliente ideal: ${state.intake.targetCustomer}` : "",
    state.intake.businessModel && state.intake.businessModel !== "no-definido"
      ? `Modelo actual: ${translateBusinessModel(state.intake.businessModel)}`
      : "",
    state.intake.averageTicket ? `Ticket promedio: ${state.intake.averageTicket}` : "",
    state.intake.salesChannels ? `Canales actuales: ${state.intake.salesChannels}` : "",
    state.intake.primaryMarket ? `Mercado principal: ${state.intake.primaryMarket}` : "",
  ].filter(Boolean);

  if (contextItems.length === 0) {
    return "<li>No agregaste contexto extra del negocio. El resultado se basa solo en las respuestas estructuradas.</li>";
  }

  return contextItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function buildDeliveryStatusMarkup(deliveryStatus) {
  if (deliveryStatus === "sent") {
    return `
      <p class="delivery-note">
        El resumen se envio a ${escapeHtml(state.intake.email)} y tambien se compartio con el profesor.
      </p>
    `;
  }

  if (deliveryStatus === "error") {
    return `
      <p class="delivery-note delivery-note-error">
        No se pudo enviar el resumen por correo. Puedes intentarlo de nuevo.
      </p>
    `;
  }

  if (deliveryStatus === "sending") {
    return `
      <p class="delivery-note">
        Enviando resumen a tu correo y al profesor...
      </p>
    `;
  }

  return `
    <p class="delivery-note">
      Cuando este listo, enviaremos este resumen a ${escapeHtml(state.intake.email)} y al profesor.
    </p>
  `;
}

function buildSendButtonLabel(aiStatus, deliveryStatus) {
  if (deliveryStatus === "sending") {
    return "Enviando correo...";
  }
  if (deliveryStatus === "sent") {
    return "Resumen enviado";
  }
  if (aiStatus !== "ready") {
    return "Preparando resumen...";
  }
  return "Enviar resumen por correo";
}

function switchTool(nextTool) {
  const sanitizedTool = sanitizeTool(nextTool);
  if (sanitizedTool === state.activeTool) {
    setToolRoute(sanitizedTool);
    return;
  }

  state.activeTool = sanitizedTool;
  setToolRoute(sanitizedTool);

  if (sanitizedTool === "wireframe") {
    seedWireframeBriefFromDiagnosis();
  }

  if (sanitizedTool === "messages") {
    seedStoreMessagesBriefFromDiagnosis();
  }

  if (sanitizedTool === "logistics") {
    seedLogisticsBriefFromDiagnosis();
  }

  persistState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function seedWireframeBriefFromDiagnosis() {
  const brief = normalizeBrief(state.wireframe.brief);
  if (brief.productDescription) {
    return;
  }

  const seededBrief = normalizeBrief({
    productDescription: state.intake.productDescription,
    targetCustomer: state.intake.targetCustomer,
    priceReference: state.intake.averageTicket,
    differentiator: "",
  });

  if (!seededBrief.productDescription) {
    return;
  }

  state.wireframe.brief = seededBrief;
}

function seedStoreMessagesBriefFromDiagnosis() {
  const brief = normalizeMessageBrief(state.messages.brief);
  if (brief.productDescription || brief.studentEmail) {
    return;
  }

  const seededBrief = normalizeMessageBrief({
    studentName: state.intake.studentName,
    studentEmail: state.intake.email,
    storeName: state.intake.projectName,
    productDescription: state.intake.productDescription,
    targetCustomer: state.intake.targetCustomer,
    productType: "fisico",
    salesChannel: state.intake.salesChannels.toLowerCase().includes("instagram")
      ? "instagram"
      : state.intake.salesChannels.toLowerCase().includes("email")
        ? "email"
        : "whatsapp",
    paymentMethods: "",
  });

  if (!seededBrief.productDescription && !seededBrief.studentEmail) {
    return;
  }

  state.messages.brief = seededBrief;
}

function seedLogisticsBriefFromDiagnosis() {
  const brief = normalizeLogisticsBrief(state.logistics.brief);
  if (brief.productDescription || brief.studentEmail) {
    return;
  }

  const seededBrief = normalizeLogisticsBrief({
    studentName: state.intake.studentName,
    studentEmail: state.intake.email,
    businessName: state.intake.projectName,
    productDescription: state.intake.productDescription,
    businessType: "producto_fisico",
    coverage: state.intake.primaryMarket.toLowerCase().includes("mexico") ? "nacional" : "nacional",
  });

  if (!seededBrief.productDescription && !seededBrief.studentEmail) {
    return;
  }

  state.logistics.brief = seededBrief;
}

function generateProductWireframe(force = false) {
  const brief = normalizeBrief(state.wireframe.brief);
  if (!brief.productDescription) {
    return;
  }

  const inputHash = buildProductWireframeInputHash(brief);
  if (!force) {
    if (state.wireframe.status === "loading" && state.wireframe.inputHash === inputHash) {
      return;
    }
    if (state.wireframe.status === "ready" && state.wireframe.inputHash === inputHash) {
      return;
    }
  }

  const prompt = buildProductWireframePrompt(brief);
  state.wireframe = {
    brief,
    status: "loading",
    result: null,
    prompt,
    inputHash,
  };
  persistState();
  render();

  requestProductWireframe(brief)
    .then((result) => {
      if (state.wireframe.inputHash !== inputHash) {
        return;
      }

      state.wireframe = {
        brief,
        status: "ready",
        result,
        prompt,
        inputHash,
      };
      persistState();
      render();
    })
    .catch(() => {
      if (state.wireframe.inputHash !== inputHash) {
        return;
      }

      state.wireframe = {
        brief,
        status: "error",
        result: null,
        prompt,
        inputHash,
      };
      persistState();
      render();
    });
}

function generateStoreMessages(force = false) {
  const brief = normalizeMessageBrief(state.messages.brief);
  if (!brief.productDescription || !isValidEmail(brief.studentEmail)) {
    return;
  }

  const inputHash = buildStoreMessagesInputHash(brief);
  if (!force) {
    if (state.messages.status === "loading" && state.messages.inputHash === inputHash) {
      return;
    }
    if (state.messages.status === "ready" && state.messages.inputHash === inputHash) {
      return;
    }
  }

  const prompt = buildStoreMessagesPrompt(brief);
  state.messages = {
    brief,
    status: "loading",
    result: null,
    prompt,
    inputHash,
    delivery: createDefaultStoreMessagesState().delivery,
  };
  persistState();
  render();

  requestStoreMessages(brief)
    .then((result) => {
      if (state.messages.inputHash !== inputHash) {
        return;
      }

      state.messages = {
        brief,
        status: "ready",
        result,
        prompt,
        inputHash,
        delivery: createDefaultStoreMessagesState().delivery,
      };
      persistState();
      render();
    })
    .catch(() => {
      if (state.messages.inputHash !== inputHash) {
        return;
      }

      state.messages = {
        brief,
        status: "error",
        result: null,
        prompt,
        inputHash,
        delivery: createDefaultStoreMessagesState().delivery,
      };
      persistState();
      render();
    });
}

function generateLogisticsMessages(force = false) {
  const brief = normalizeLogisticsBrief(state.logistics.brief);
  if (!brief.productDescription || !isValidEmail(brief.studentEmail)) {
    return;
  }

  const inputHash = buildLogisticsInputHash(brief);
  if (!force) {
    if (state.logistics.status === "loading" && state.logistics.inputHash === inputHash) {
      return;
    }
    if (state.logistics.status === "ready" && state.logistics.inputHash === inputHash) {
      return;
    }
  }

  const prompt = buildLogisticsPrompt(brief);
  state.logistics = {
    brief,
    status: "loading",
    result: null,
    prompt,
    inputHash,
    delivery: createDefaultLogisticsState().delivery,
  };
  persistState();
  render();

  requestLogisticsMessages(brief)
    .then((result) => {
      if (state.logistics.inputHash !== inputHash) {
        return;
      }

      state.logistics = {
        brief,
        status: "ready",
        result,
        prompt,
        inputHash,
        delivery: createDefaultLogisticsState().delivery,
      };
      persistState();
      render();
    })
    .catch(() => {
      if (state.logistics.inputHash !== inputHash) {
        return;
      }

      state.logistics = {
        brief,
        status: "error",
        result: null,
        prompt,
        inputHash,
        delivery: createDefaultLogisticsState().delivery,
      };
      persistState();
      render();
    });
}

function ensureAiAnalysis(force = false) {
  if (state.stage !== "result" || getAnsweredCount() !== questions.length) {
    return;
  }

  const context = buildAiContext();
  const inputHash = buildAiInputHash(context);

  if (!force) {
    if (state.ai.status === "loading" && state.ai.inputHash === inputHash) {
      return;
    }
    if (state.ai.status === "ready" && state.ai.inputHash === inputHash) {
      return;
    }
    if (state.ai.status === "error" && state.ai.inputHash === inputHash) {
      return;
    }
  }

  const prompt = buildAiPrompt(context);
  aiRequestId += 1;
  const currentRequestId = aiRequestId;

  state.ai = {
    status: "loading",
    analysis: null,
    prompt,
    inputHash,
  };
  persistState();
  renderResult();
  animateAffinityBars();

  requestAiAnalysis(context)
    .then((analysis) => {
      if (currentRequestId !== aiRequestId) {
        return;
      }

      state.ai = {
        status: "ready",
        analysis,
        prompt,
        inputHash,
      };
      persistState();
      render();
    })
    .catch(() => {
      if (currentRequestId !== aiRequestId) {
        return;
      }

      state.ai = {
        status: "error",
        analysis: null,
        prompt,
        inputHash,
      };
      persistState();
      render();
    });
}

function buildReportHash(aiHash, aiAnalysis) {
  return JSON.stringify({
    aiHash,
    headline: aiAnalysis?.headline || "",
    recipient: state.intake.email || "",
  });
}

async function sendSummaryByEmail() {
  const analysis = calculateAnalysis();
  const aiContext = buildAiContext(analysis);
  const currentAiHash = buildAiInputHash(aiContext);
  const aiAnalysis = state.ai.inputHash === currentAiHash && state.ai.status === "ready" ? state.ai.analysis : null;

  if (!aiAnalysis) {
    showToast("Espera a que termine el analisis inteligente.");
    return;
  }

  const reportHash = buildReportHash(currentAiHash, aiAnalysis);
  if (state.delivery.status === "sending" && state.delivery.reportHash === reportHash) {
    return;
  }

  state.delivery = {
    status: "sending",
    reportHash,
    message: "",
  };
  persistState();
  render();

  try {
    const response = await fetch("/api/send-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report: buildEmailReportPayload(analysis, aiAnalysis),
      }),
    });

    if (!response.ok) {
      throw new Error(`Send summary failed with status ${response.status}`);
    }

    const payload = await response.json();
    state.delivery = {
      status: "sent",
      reportHash,
      message: payload.mode || "sent",
    };
    persistState();
    render();
    showToast("Resumen enviado por correo.");
  } catch (error) {
    state.delivery = {
      status: "error",
      reportHash,
      message: String(error?.message || "send-error"),
    };
    persistState();
    render();
    showToast("No se pudo enviar el resumen. Intenta de nuevo.");
  }
}

function ensureAutomaticSummaryDelivery() {
  if (state.stage !== "result" || getAnsweredCount() !== questions.length) {
    return;
  }

  const analysis = calculateAnalysis();
  const aiContext = buildAiContext(analysis);
  const currentAiHash = buildAiInputHash(aiContext);
  const aiAnalysis = state.ai.inputHash === currentAiHash && state.ai.status === "ready" ? state.ai.analysis : null;

  if (!aiAnalysis) {
    return;
  }

  const reportHash = buildReportHash(currentAiHash, aiAnalysis);
  if (state.delivery.reportHash === reportHash && ["sending", "sent"].includes(state.delivery.status)) {
    return;
  }

  window.setTimeout(() => {
    const latestAnalysis = calculateAnalysis();
    const latestContext = buildAiContext(latestAnalysis);
    const latestHash = buildAiInputHash(latestContext);
    const latestReady = state.ai.inputHash === latestHash && state.ai.status === "ready";
    const latestReportHash = latestReady ? buildReportHash(latestHash, state.ai.analysis) : "";

    if (latestReady && latestReportHash === reportHash && state.delivery.status === "idle") {
      sendSummaryByEmail();
    }
  }, 250);
}

async function sendStoreMessagesByEmail() {
  const brief = normalizeMessageBrief(state.messages.brief);
  const result = state.messages.status === "ready" ? state.messages.result : null;

  if (!result) {
    showToast("Genera los mensajes antes de enviarlos.");
    return;
  }

  if (!isValidEmail(brief.studentEmail)) {
    showToast("Ingresa un correo valido para enviar los mensajes.");
    return;
  }

  const resultHash = buildStoreMessagesResultHash(brief, result);
  if (state.messages.delivery.status === "sending" && state.messages.delivery.resultHash === resultHash) {
    return;
  }

  state.messages.delivery = {
    status: "sending",
    resultHash,
    message: "",
  };
  persistState();
  render();

  try {
    const response = await fetch("/api/send-store-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: buildStoreMessagesEmailPayload(brief, result),
      }),
    });

    if (!response.ok) {
      throw new Error(`Send store messages failed with status ${response.status}`);
    }

    const payload = await response.json();
    state.messages.delivery = {
      status: "sent",
      resultHash,
      message: payload.mode || "sent",
    };
    persistState();
    render();
    showToast("Mensajes enviados por correo.");
  } catch (error) {
    state.messages.delivery = {
      status: "error",
      resultHash,
      message: String(error?.message || "send-error"),
    };
    persistState();
    render();
    showToast("No se pudieron enviar los mensajes. Intenta de nuevo.");
  }
}

function ensureAutomaticMessagesDelivery() {
  const brief = normalizeMessageBrief(state.messages.brief);
  const result = state.messages.status === "ready" ? state.messages.result : null;

  if (!result || !isValidEmail(brief.studentEmail)) {
    return;
  }

  const resultHash = buildStoreMessagesResultHash(brief, result);
  if (state.messages.delivery.resultHash === resultHash && ["sending", "sent"].includes(state.messages.delivery.status)) {
    return;
  }

  window.setTimeout(() => {
    const latestBrief = normalizeMessageBrief(state.messages.brief);
    const latestResult = state.messages.status === "ready" ? state.messages.result : null;
    const latestHash = latestResult ? buildStoreMessagesResultHash(latestBrief, latestResult) : "";

    if (latestResult && latestHash === resultHash && state.messages.delivery.status === "idle") {
      sendStoreMessagesByEmail();
    }
  }, 250);
}

function buildMessagesSendButtonLabel(deliveryStatus) {
  if (deliveryStatus === "sending") {
    return "Enviando correos...";
  }
  if (deliveryStatus === "sent") {
    return "Mensajes enviados";
  }
  return "Enviar por correo";
}

function buildMessagesDeliveryStatusMarkup(deliveryStatus) {
  const email = normalizeMessageBrief(state.messages.brief).studentEmail;

  if (deliveryStatus === "sent") {
    return `
      <p class="delivery-note">
        Los mensajes se enviaron a ${escapeHtml(email)} y tambien se compartieron con el profesor.
      </p>
    `;
  }

  if (deliveryStatus === "error") {
    return `
      <p class="delivery-note delivery-note-error">
        No se pudieron enviar los mensajes por correo. Puedes intentarlo de nuevo.
      </p>
    `;
  }

  if (deliveryStatus === "sending") {
    return `
      <p class="delivery-note">
        Enviando mensajes a tu correo y al profesor...
      </p>
    `;
  }

  return `
    <p class="delivery-note">
      Cuando esten listos, enviaremos estos mensajes a ${escapeHtml(email)} y al profesor.
    </p>
  `;
}

async function sendLogisticsByEmail() {
  const brief = normalizeLogisticsBrief(state.logistics.brief);
  const result = state.logistics.status === "ready" ? state.logistics.result : null;

  if (!result) {
    showToast("Genera los mensajes logisticos antes de enviarlos.");
    return;
  }

  if (!isValidEmail(brief.studentEmail)) {
    showToast("Ingresa un correo valido para enviar los mensajes.");
    return;
  }

  const resultHash = buildLogisticsResultHash(brief, result);
  if (state.logistics.delivery.status === "sending" && state.logistics.delivery.resultHash === resultHash) {
    return;
  }

  state.logistics.delivery = {
    status: "sending",
    resultHash,
    message: "",
  };
  persistState();
  render();

  try {
    const response = await fetch("/api/send-logistics-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: buildLogisticsEmailPayload(brief, result),
      }),
    });

    if (!response.ok) {
      throw new Error(`Send logistics failed with status ${response.status}`);
    }

    const payload = await response.json();
    state.logistics.delivery = {
      status: "sent",
      resultHash,
      message: payload.mode || "sent",
    };
    persistState();
    render();
    showToast("Mensajes logisticos enviados por correo.");
  } catch (error) {
    state.logistics.delivery = {
      status: "error",
      resultHash,
      message: String(error?.message || "send-error"),
    };
    persistState();
    render();
    showToast("No se pudieron enviar los mensajes logisticos.");
  }
}

function ensureAutomaticLogisticsDelivery() {
  const brief = normalizeLogisticsBrief(state.logistics.brief);
  const result = state.logistics.status === "ready" ? state.logistics.result : null;

  if (!result || !isValidEmail(brief.studentEmail)) {
    return;
  }

  const resultHash = buildLogisticsResultHash(brief, result);
  if (state.logistics.delivery.resultHash === resultHash && ["sending", "sent"].includes(state.logistics.delivery.status)) {
    return;
  }

  window.setTimeout(() => {
    const latestBrief = normalizeLogisticsBrief(state.logistics.brief);
    const latestResult = state.logistics.status === "ready" ? state.logistics.result : null;
    const latestHash = latestResult ? buildLogisticsResultHash(latestBrief, latestResult) : "";

    if (latestResult && latestHash === resultHash && state.logistics.delivery.status === "idle") {
      sendLogisticsByEmail();
    }
  }, 250);
}

function buildLogisticsSendButtonLabel(deliveryStatus) {
  if (deliveryStatus === "sending") {
    return "Enviando correos...";
  }
  if (deliveryStatus === "sent") {
    return "Mensajes enviados";
  }
  return "Enviar por correo";
}

function buildLogisticsDeliveryStatusMarkup(deliveryStatus) {
  const email = normalizeLogisticsBrief(state.logistics.brief).studentEmail;

  if (deliveryStatus === "sent") {
    return `
      <p class="delivery-note">
        Los mensajes logisticos se enviaron a ${escapeHtml(email)} y tambien se compartieron con el profesor.
      </p>
    `;
  }

  if (deliveryStatus === "error") {
    return `
      <p class="delivery-note delivery-note-error">
        No se pudieron enviar los mensajes logisticos por correo. Puedes intentarlo de nuevo.
      </p>
    `;
  }

  if (deliveryStatus === "sending") {
    return `
      <p class="delivery-note">
        Enviando mensajes logisticos a tu correo y al profesor...
      </p>
    `;
  }

  return `
    <p class="delivery-note">
      Cuando esten listos, enviaremos estos mensajes a ${escapeHtml(email)} y al profesor.
    </p>
  `;
}

function calculateAnalysis() {
  const scores = { propia: 0, marketplace: 0, hibrido: 0 };
  state.answers.forEach((answer) => {
    if (scores[answer] !== undefined) {
      scores[answer] += 1;
    }
  });

  const totalAnswers = Math.max(getAnsweredCount(), 1);
  const sortedScores = Object.entries(scores).sort((first, second) => second[1] - first[1]);
  const [topType, topScore] = sortedScores[0];
  const [, secondScore] = sortedScores[1];
  const hasTie = sortedScores.filter((entry) => entry[1] === topScore).length > 1;
  const isMixed = hasTie || (topScore - secondScore === 1 && topType !== "hibrido" && secondScore > 0);
  const recommendation = isMixed ? "hibrido" : topType;

  const explanation = isMixed
    ? "Tu perfil no cae en un extremo puro. Conviene separar qué canal sirve para adquirir demanda y cuál sirve para retener clientes, margen y datos."
    : `La mayor cantidad de respuestas cae en ${profileCatalog[recommendation].label.toLowerCase()}, así que esa ruta muestra mejor ajuste operativo y comercial.`;

  const tags = [
    `${scores.propia} señales de tienda propia`,
    `${scores.marketplace} señales de marketplace`,
    `${scores.hibrido} señales de enfoque híbrido`,
  ];

  return {
    scores,
    recommendation,
    isMixed,
    confidence: Math.round((Math.max(topScore, 0) / totalAnswers) * 100),
    percentages: {
      propia: Math.round((scores.propia / totalAnswers) * 100),
      marketplace: Math.round((scores.marketplace / totalAnswers) * 100),
      hibrido: Math.round((scores.hibrido / totalAnswers) * 100),
    },
    explanation,
    tags,
  };
}

function buildAffinityRow(label, value, type) {
  return `
    <div class="affinity-row">
      <div class="affinity-meta">
        <span class="affinity-label">${escapeHtml(label)}</span>
        <span class="affinity-value">${value}%</span>
      </div>
      <div class="affinity-track" aria-hidden="true">
        <div class="affinity-fill" data-type="${type}" data-width="${value}"></div>
      </div>
    </div>
  `;
}

function buildProfileSummaryMarkup() {
  return questions
    .map((question, index) => {
      const answerType = state.answers[index];
      const selectedOption = question.options.find((option) => option.type === answerType);
      if (!selectedOption) {
        return "";
      }
      return `
        <li>
          <strong>${escapeHtml(question.title)}:</strong>
          ${escapeHtml(selectedOption.label)}
        </li>
      `;
    })
    .join("");
}

function buildEmailReportPayload(analysis, aiAnalysis) {
  const profile = profileCatalog[analysis.recommendation];

  return {
    studentName: state.intake.studentName || "",
    studentEmail: state.intake.email || "",
    projectName: state.intake.projectName || "",
    productDescription: state.intake.productDescription || "",
    targetCustomer: state.intake.targetCustomer || "",
    businessModel: state.intake.businessModel || "no-definido",
    businessModelLabel: translateBusinessModel(state.intake.businessModel),
    averageTicket: state.intake.averageTicket || "",
    salesChannels: state.intake.salesChannels || "",
    primaryMarket: state.intake.primaryMarket || "",
    profile,
    baseAnalysis: analysis,
    aiAnalysis,
    appBaseUrl: window.location.origin,
    generatedAt: new Date().toISOString(),
  };
}

function buildStoreMessagesEmailPayload(brief, result) {
  return {
    brief,
    result,
    productTypeLabel: translateProductType(brief.productType),
    toneLabel: translateTone(brief.tone),
    salesChannelLabel: translateSalesChannel(brief.salesChannel),
    shippingTypeLabel: translateShippingType(brief.shippingType),
    appBaseUrl: window.location.origin,
    generatedAt: new Date().toISOString(),
  };
}

function buildLogisticsEmailPayload(brief, result) {
  return {
    brief,
    result,
    businessTypeLabel: translateBusinessType(brief.businessType),
    coverageLabel: translateCoverage(brief.coverage),
    selectedErrorLabels: getSelectedErrorLabels(brief.currentErrors),
    appBaseUrl: window.location.origin,
    generatedAt: new Date().toISOString(),
  };
}

function buildSummaryText() {
  const analysis = calculateAnalysis();
  const profile = profileCatalog[analysis.recommendation];
  const aiContext = buildAiContext(analysis);
  const aiHash = buildAiInputHash(aiContext);
  const aiAnalysis = state.ai.status === "ready" && state.ai.inputHash === aiHash ? state.ai.analysis : null;
  const lines = [
    "Resumen del diagnostico de ruta e-commerce",
    "=========================================",
    `Alumno: ${state.intake.studentName || "Sin nombre"}`,
    `Proyecto: ${state.intake.projectName || "Sin proyecto"}`,
    `Correo: ${state.intake.email || "No capturado"}`,
    `Que vende: ${state.intake.productDescription || "No especificado"}`,
    `Cliente ideal: ${state.intake.targetCustomer || "No especificado"}`,
    `Modelo actual: ${translateBusinessModel(state.intake.businessModel)}`,
    `Ticket promedio: ${state.intake.averageTicket || "No especificado"}`,
    `Canales actuales: ${state.intake.salesChannels || "No especificado"}`,
    `Mercado principal: ${state.intake.primaryMarket || "No especificado"}`,
    `Resultado recomendado: ${profile.label}`,
    `Subtitulo: ${profile.subtitle}`,
    `Confianza: ${analysis.confidence}%`,
    "",
    "Lectura del resultado:",
    profile.description,
    analysis.explanation,
    "",
    "Stack sugerido:",
    ...profile.tools.map((tool, index) => `${index + 1}. ${tool}`),
    "",
    "Plan de arranque:",
    ...profile.actionPlan.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Riesgos a vigilar:",
    ...profile.risks.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Afinidad por ruta:",
    `- Modelo hibrido: ${analysis.percentages.hibrido}%`,
    `- Tienda propia: ${analysis.percentages.propia}%`,
    `- Marketplace: ${analysis.percentages.marketplace}%`,
    "",
    "Respuestas:",
    ...questions.map((question, index) => {
      const answerType = state.answers[index];
      const selectedOption = question.options.find((option) => option.type === answerType);
      return `- ${question.title}: ${selectedOption ? selectedOption.label : "Sin respuesta"}`;
    }),
  ];

  if (aiAnalysis) {
    lines.push(
      "",
      "Lectura personalizada:",
      aiAnalysis.headline,
      aiAnalysis.summary,
      "",
      "Por que esta ruta encaja:",
      ...aiAnalysis.whyThisFits.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Por que no empezar por otras rutas:",
      ...aiAnalysis.whyNotNow.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Primer experimento sugerido:",
      aiAnalysis.firstExperiment,
      "",
      "Senales a medir:",
      ...aiAnalysis.metrics.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Sprint de 30 dias:",
      ...aiAnalysis.sprint.map((item, index) => `${index + 1}. ${item}`)
    );
  }

  return lines.join("\n");
}

function buildMessagesSummaryText() {
  const brief = normalizeMessageBrief(state.messages.brief);
  const result = state.messages.result;
  if (state.messages.status !== "ready" || !result) {
    return "Aun no hay mensajes generados.";
  }

  const lines = [
    "Mensajes para tienda en linea",
    "=============================",
    `Alumno: ${brief.studentName || "Sin nombre"}`,
    `Correo: ${brief.studentEmail || "No capturado"}`,
    `Tienda: ${brief.storeName || "Sin nombre"}`,
    `Que vende: ${brief.productDescription || "No especificado"}`,
    `Tipo de producto: ${translateProductType(brief.productType)}`,
    `Cliente ideal: ${brief.targetCustomer || "No especificado"}`,
    `Tono: ${translateTone(brief.tone)}`,
    `Canal principal: ${translateSalesChannel(brief.salesChannel)}`,
    `Tipo de envio o entrega: ${translateShippingType(brief.shippingType)}`,
    `Tiempo estimado: ${brief.deliveryTime || "No especificado"}`,
    `Metodos de pago: ${brief.paymentMethods || "No especificado"}`,
    `Politica de cambios/devoluciones: ${brief.returnPolicy || "No especificada"}`,
    "",
    result.headline,
    result.strategyNote,
    "",
    "Guia de tono:",
    ...result.toneGuidelines.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Variables utiles:",
    ...result.variables.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Mensajes:",
    ...result.messages.flatMap((message, index) => [
      "",
      `${index + 1}. ${message.title}`,
      `Proposito: ${message.purpose}`,
      `Asunto: ${message.subject}`,
      message.message,
      `Cuando usarlo: ${message.whenToUse}`,
      `Tip de canal: ${message.channelTip}`,
    ]),
  ];

  return lines.join("\n");
}

function buildLogisticsSummaryText() {
  const brief = normalizeLogisticsBrief(state.logistics.brief);
  const result = state.logistics.result;
  if (state.logistics.status !== "ready" || !result) {
    return "Aun no hay mensajes logisticos generados.";
  }

  const lines = [
    "Mensajes de logistica clara",
    "===========================",
    `Alumno: ${brief.studentName || "Sin nombre"}`,
    `Correo: ${brief.studentEmail || "No capturado"}`,
    `Negocio: ${brief.businessName || "Sin nombre"}`,
    `Que vende: ${brief.productDescription || "No especificado"}`,
    `Tipo: ${translateBusinessType(brief.businessType)}`,
    `Cobertura: ${translateCoverage(brief.coverage)}`,
    `Preparacion: ${brief.prepTime}`,
    `Costo de envio/entrega: ${brief.shippingCost || "No especificado"}`,
    `Paqueteria o metodo: ${brief.carriers || "No especificado"}`,
    `Proceso ante danos/problemas: ${brief.damagePolicy || "No especificado"}`,
    "",
    "Errores marcados:",
    ...(getSelectedErrorLabels(brief.currentErrors).length > 0
      ? getSelectedErrorLabels(brief.currentErrors).map((item, index) => `${index + 1}. ${item}`)
      : ["Ninguno marcado"]),
    "",
    "Contraste:",
    `Mensaje debil: ${result.ejemplo_debil}`,
    `Mensaje claro: ${result.ejemplo_mejor}`,
    "",
    "Mensajes:",
    "",
    "1. Respuesta a pregunta de entrega",
    result.mensaje_entrega,
    "",
    "2. Confirmacion de pedido",
    result.confirmacion_pedido,
    "",
    "3. Aviso de envio o entrega",
    result.aviso_envio,
    "",
    "4. Comunicacion de retraso",
    result.comunicacion_retraso,
    "",
    "5. Protocolo de dano o problema",
    result.protocolo_danado,
    "",
    "Tip clave:",
    result.tip_clave,
  ];

  return lines.join("\n");
}

function buildVolumetricSummaryText() {
  const result = calculateVolumetric(state.volumetric.simulator);
  const simulator = result.simulator;
  const lines = [
    "Simulador de peso volumetrico",
    "=============================",
    `Dimensiones: ${formatNumber(simulator.length)} x ${formatNumber(simulator.width)} x ${formatNumber(simulator.height)} cm`,
    `Peso real: ${formatNumber(simulator.realWeight)} kg`,
    `Factor usado: ${formatNumber(simulator.factor, 0)}`,
    `Formula: (${formatNumber(simulator.length)} x ${formatNumber(simulator.width)} x ${formatNumber(
      simulator.height
    )}) / ${formatNumber(simulator.factor, 0)}`,
    `Peso volumetrico: ${formatNumber(result.volumetricWeight)} kg`,
    `Peso cobrable estimado: ${formatNumber(result.chargeableWeight)} kg`,
    `Cobra por: ${result.dominant === "volumetric" ? "peso volumetrico" : "peso real"}`,
    `Multiplicador vs peso real: ${formatNumber(result.multiplier, 1)}x`,
    "",
    result.explanation,
    "",
    "Simulacion de caja mas compacta:",
    `${result.compactSuggestion.length} x ${result.compactSuggestion.width} x ${result.compactSuggestion.height} cm -> ${formatNumber(
      result.compactSuggestion.volumetricWeight
    )} kg volumetricos`,
    `Reduccion volumetrica aproximada: ${formatNumber(result.compactSuggestion.potentialReduction, 0)}%`,
    "",
    "Nota: los factores, redondeos y tarifas cambian por paqueteria, servicio y destino. Verifica siempre antes de cotizar al cliente.",
  ];

  if (result.estimatedCost !== null) {
    lines.splice(9, 0, `Costo estimado: $${formatNumber(result.estimatedCost, 2)} MXN`);
  }

  return lines.join("\n");
}

function buildWireframeSummaryText() {
  const brief = normalizeBrief(state.wireframe.brief);
  const result = state.wireframe.result;
  if (state.wireframe.status !== "ready" || !result) {
    return "Aun no hay wireframe generado.";
  }

  const lines = [
    "Wireframe sugerido de ficha de producto",
    "======================================",
    `Producto descrito: ${brief.productDescription}`,
    `Cliente ideal: ${brief.targetCustomer || "No especificado"}`,
    `Precio o rango: ${brief.priceReference || "No especificado"}`,
    `Diferencial: ${brief.differentiator || "No especificado"}`,
    "",
    `Titulo del wireframe: ${result.wireframeTitle}`,
    `Objetivo de la pagina: ${result.pageGoal}`,
    `Mensaje central: ${result.decisionMessage}`,
    `Categoria detectada: ${result.categoryLabel || "No especificada"}`,
    `Audiencia detectada: ${result.audienceLabel || "No especificada"}`,
    "",
    "Zona principal:",
    `- Titulo: ${result.productTitle}`,
    `- Hook: ${result.shortHook}`,
    `- Precio: ${result.pricePresentation}`,
    `- Disponibilidad: ${result.availability}`,
    `- CTA principal: ${result.primaryCta}`,
    `- CTA secundario: ${result.secondaryCta}`,
    "",
    "Beneficios sugeridos:",
    ...result.benefits.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Fotografias utiles:",
    ...result.photoNotes.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Variantes visibles:",
    ...result.variants.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Senales de confianza:",
    ...result.trustSignals.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Casos de uso sugeridos:",
    ...result.useCases.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Puntos de prueba o evidencia:",
    ...result.proofPoints.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Atributos o bloques informativos:",
    ...result.attributes.map((item, index) => `${index + 1}. ${item}`),
    "",
    "FAQ sugeridas:",
    ...result.faq.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Objeciones a resolver:",
    ...result.objections.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Prioridad movil:",
    result.mobileStickyBar,
    "",
    "Notas de conversion:",
    ...result.conversionNotes.map((item, index) => `${index + 1}. ${item}`),
  ];

  return lines.join("\n");
}

function copySummary() {
  const text = buildSummaryText();
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    downloadSummary();
    showToast("No se pudo copiar. Se descargó el resumen.");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showToast("Resumen copiado al portapapeles."))
    .catch(() => {
      downloadSummary();
      showToast("No se pudo copiar. Se descargó el resumen.");
    });
}

function downloadSummary() {
  const text = buildSummaryText();
  const slugBase = state.intake.projectName || state.intake.studentName || "diagnostico";
  const slug = slugBase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "diagnostico";

  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-ruta-ecommerce.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Resumen descargado.");
}

function copyWireframe() {
  const text = buildWireframeSummaryText();
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    downloadWireframe();
    showToast("No se pudo copiar. Se descargo la guia.");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showToast("Guia de ficha copiada al portapapeles."))
    .catch(() => {
      downloadWireframe();
      showToast("No se pudo copiar. Se descargo la guia.");
    });
}

function copyMessages() {
  const text = buildMessagesSummaryText();
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    downloadMessages();
    showToast("No se pudo copiar. Se descargo el kit.");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showToast("Mensajes copiados al portapapeles."))
    .catch(() => {
      downloadMessages();
      showToast("No se pudo copiar. Se descargo el kit.");
    });
}

function copyLogisticsMessages() {
  const text = buildLogisticsSummaryText();
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    downloadLogisticsMessages();
    showToast("No se pudo copiar. Se descargo el kit logistico.");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showToast("Mensajes logisticos copiados."))
    .catch(() => {
      downloadLogisticsMessages();
      showToast("No se pudo copiar. Se descargo el kit logistico.");
    });
}

function copyVolumetricCalculation() {
  const text = buildVolumetricSummaryText();
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    downloadVolumetricCalculation();
    showToast("No se pudo copiar. Se descargo el calculo.");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showToast("Calculo copiado al portapapeles."))
    .catch(() => {
      downloadVolumetricCalculation();
      showToast("No se pudo copiar. Se descargo el calculo.");
    });
}

function downloadWireframe() {
  const text = buildWireframeSummaryText();
  const slugBase =
    state.wireframe.result?.productTitle ||
    state.wireframe.brief.productDescription ||
    "ficha-producto";
  const slug = slugBase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "ficha-producto";

  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-wireframe-ficha.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Guia descargada.");
}

function downloadMessages() {
  const text = buildMessagesSummaryText();
  const brief = normalizeMessageBrief(state.messages.brief);
  const slugBase = brief.storeName || brief.productDescription || "mensajes-tienda";
  const slug = slugBase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "mensajes-tienda";

  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-mensajes-tienda.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Kit de mensajes descargado.");
}

function downloadLogisticsMessages() {
  const text = buildLogisticsSummaryText();
  const brief = normalizeLogisticsBrief(state.logistics.brief);
  const slugBase = brief.businessName || brief.productDescription || "logistica-clara";
  const slug = slugBase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "logistica-clara";

  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-logistica-clara.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Kit logistico descargado.");
}

function downloadVolumetricCalculation() {
  const text = buildVolumetricSummaryText();
  const result = calculateVolumetric(state.volumetric.simulator);
  const slug = `peso-volumetrico-${formatNumber(result.simulator.length, 0)}x${formatNumber(
    result.simulator.width,
    0
  )}x${formatNumber(result.simulator.height, 0)}`.replace(/[^a-z0-9-]/gi, "-");

  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Calculo descargado.");
}

function animateStaticProgress() {
  const progressBar = appRoot.querySelector("[data-progress-value]");
  if (!progressBar) {
    return;
  }
  const width = Number(progressBar.dataset.progressValue || 0);
  requestAnimationFrame(() => {
    progressBar.style.width = `${width}%`;
  });
}

function animateAffinityBars() {
  appRoot.querySelectorAll(".affinity-fill").forEach((bar) => {
    const width = Number(bar.dataset.width || 0);
    requestAnimationFrame(() => {
      bar.style.width = `${width}%`;
    });
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.dataset.visible = "true";
  toast.setAttribute("aria-hidden", "false");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.dataset.visible = "false";
    toast.setAttribute("aria-hidden", "true");
  }, 2400);
}

function scrollToToolStart() {
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
