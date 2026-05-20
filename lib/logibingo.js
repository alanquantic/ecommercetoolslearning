const ERRORS = [
  "Vender producto agotado",
  "Olvidar pedir código postal",
  "Confundir tallas o variantes",
  "Empacar sin báscula",
  'Promesa "te llega rápido" sin fecha',
  "No compartir guía al cliente",
  "Cobro de envío equivocado",
  "Cliente ausente en entrega",
  "Producto roto en tránsito",
  "Devolución sin política",
  "Pago no confirmado en banco",
  "Inventario solo en la cabeza",
  "Paquete extraviado",
  "Dirección incompleta",
  "Cliente molesto sin respuesta",
  "Dos pedidos del mismo producto",
];

const BOARD_SIZE = 16;
const GRID_SIDE = 4;
const ANECDOTE_MAX = 600;

const LINES = buildLines();

export function getBingoErrors() {
  return [...ERRORS];
}

export function getBoardSize() {
  return BOARD_SIZE;
}

export function getGridSide() {
  return GRID_SIDE;
}

export function getAnecdoteMaxLength() {
  return ANECDOTE_MAX;
}

export function shuffleBoard() {
  const order = ERRORS.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function createDefaultLogiBingoState() {
  return {
    order: shuffleBoard(),
    selected: Array(BOARD_SIZE).fill(false),
    linesAcknowledged: 0,
    modalOpen: false,
    triggerCellIndex: null,
    anecdote: "",
    anecdoteHistory: [],
    lastSendStatus: "idle",
  };
}

export function normalizeLogiBingoState(value) {
  const base = createDefaultLogiBingoState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const order = sanitizeOrder(value.order);
  const selected = sanitizeSelected(value.selected);
  const anecdote = sanitizeAnecdote(value.anecdote);
  const currentLines = countCompletedLinesFromSelection(selected);
  const linesAcknowledged = sanitizeAcknowledged(value.linesAcknowledged, currentLines);
  const modalOpen = Boolean(value.modalOpen) && currentLines > linesAcknowledged;
  const triggerCellIndex = sanitizeTriggerIndex(value.triggerCellIndex);
  const anecdoteHistory = sanitizeAnecdoteHistory(value.anecdoteHistory);
  const lastSendStatus = sanitizeStatus(value.lastSendStatus);

  return {
    order,
    selected,
    linesAcknowledged,
    modalOpen,
    triggerCellIndex,
    anecdote,
    anecdoteHistory,
    lastSendStatus,
  };
}

export function resetBoard() {
  return createDefaultLogiBingoState();
}

export function toggleCell(state, index) {
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
    return state;
  }
  const selected = [...state.selected];
  selected[index] = !selected[index];
  const currentLines = countCompletedLinesFromSelection(selected);
  const triggerModalNow = currentLines > state.linesAcknowledged;

  return {
    ...state,
    selected,
    modalOpen: triggerModalNow ? true : state.modalOpen,
    triggerCellIndex: triggerModalNow ? index : state.triggerCellIndex,
    lastSendStatus: triggerModalNow ? "idle" : state.lastSendStatus,
    anecdote: triggerModalNow ? "" : state.anecdote,
  };
}

export function setAnecdote(state, value) {
  return {
    ...state,
    anecdote: sanitizeAnecdote(value),
  };
}

export function closeModal(state) {
  const currentLines = countCompletedLinesFromSelection(state.selected);
  return {
    ...state,
    modalOpen: false,
    linesAcknowledged: Math.max(state.linesAcknowledged, currentLines),
    triggerCellIndex: null,
    anecdote: "",
  };
}

export function markSending(state) {
  return {
    ...state,
    lastSendStatus: "sending",
  };
}

export function recordSentAnecdote(state, snapshot) {
  const currentLines = countCompletedLinesFromSelection(state.selected);
  const entry = {
    anecdote: sanitizeAnecdote(state.anecdote),
    errorLabel: snapshot?.errorLabel || "",
    errorsMarked: countSelected(state.selected),
    linesCompleted: currentLines,
    dangerLevel: snapshot?.dangerLevel || "",
    timestamp: new Date().toISOString(),
  };
  return {
    ...state,
    modalOpen: false,
    linesAcknowledged: Math.max(state.linesAcknowledged, currentLines),
    triggerCellIndex: null,
    anecdote: "",
    anecdoteHistory: [entry, ...state.anecdoteHistory].slice(0, 12),
    lastSendStatus: "sent",
  };
}

export function markSendError(state) {
  return {
    ...state,
    lastSendStatus: "error",
  };
}

export function getTriggerCellLabel(state) {
  const index = state.triggerCellIndex;
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
    return "";
  }
  const order = sanitizeOrder(state.order);
  const errorIndex = order[index];
  return ERRORS[errorIndex] || "";
}

export function getAnecdoteHistory(state) {
  return Array.isArray(state.anecdoteHistory) ? [...state.anecdoteHistory] : [];
}

export function countSelected(selected) {
  return selected.reduce((total, value) => (value ? total + 1 : total), 0);
}

export function countCompletedLines(selected) {
  return LINES.reduce((total, line) => (line.every((index) => selected[index]) ? total + 1 : total), 0);
}

export function hasAnyLine(selected) {
  return LINES.some((line) => line.every((index) => selected[index]));
}

export function getDangerPercent(selected) {
  return Math.round((countSelected(selected) / BOARD_SIZE) * 100);
}

export function getDangerLevel(selected) {
  const count = countSelected(selected);
  if (count <= 3) {
    return {
      key: "green",
      label: "Cliente afortunado",
      detail: "Te han tocado pocos sustos comprando en linea. Aprende de ellos antes de tener tu propia tienda.",
      tone: "success",
      pulse: false,
    };
  }
  if (count <= 8) {
    return {
      key: "amber",
      label: "Has vivido los clasicos del e-commerce",
      detail: "Conoces de primera mano lo que NO quieres que pase en tu tienda. Convierte esas memorias en checklist.",
      tone: "warning",
      pulse: false,
    };
  }
  return {
    key: "red",
    label: "🎴 Coleccionista de horrores logisticos",
    detail: "Has sufrido casi todo el catalogo de errores. Eres el cliente que mas sabe que NO hacer al montar tu propio negocio.",
    tone: "danger",
    pulse: true,
  };
}

export function getBoardCells(state) {
  const order = sanitizeOrder(state.order);
  const selected = sanitizeSelected(state.selected);
  return order.map((errorIndex, cellIndex) => ({
    cellIndex,
    errorIndex,
    label: ERRORS[errorIndex] || "",
    selected: Boolean(selected[cellIndex]),
  }));
}

function buildLines() {
  const lines = [];
  for (let row = 0; row < GRID_SIDE; row += 1) {
    lines.push(Array.from({ length: GRID_SIDE }, (_, col) => row * GRID_SIDE + col));
  }
  for (let col = 0; col < GRID_SIDE; col += 1) {
    lines.push(Array.from({ length: GRID_SIDE }, (_, row) => row * GRID_SIDE + col));
  }
  lines.push(Array.from({ length: GRID_SIDE }, (_, i) => i * GRID_SIDE + i));
  lines.push(Array.from({ length: GRID_SIDE }, (_, i) => i * GRID_SIDE + (GRID_SIDE - 1 - i)));
  return lines;
}

function sanitizeOrder(value) {
  if (!Array.isArray(value) || value.length !== BOARD_SIZE) {
    return shuffleBoard();
  }
  const seen = new Set();
  const result = [];
  for (const entry of value) {
    const index = Number(entry);
    if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE || seen.has(index)) {
      return shuffleBoard();
    }
    seen.add(index);
    result.push(index);
  }
  return result;
}

function sanitizeSelected(value) {
  if (!Array.isArray(value) || value.length !== BOARD_SIZE) {
    return Array(BOARD_SIZE).fill(false);
  }
  return value.map((entry) => Boolean(entry));
}

function sanitizeAnecdote(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.slice(0, ANECDOTE_MAX);
}

function countCompletedLinesFromSelection(selected) {
  return LINES.reduce((total, line) => (line.every((index) => selected[index]) ? total + 1 : total), 0);
}

function sanitizeAcknowledged(value, currentLines) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return Math.max(0, currentLines - 1);
  }
  return Math.min(Math.max(Math.round(number), 0), LINES.length);
}

function sanitizeTriggerIndex(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number >= BOARD_SIZE) {
    return null;
  }
  return number;
}

function sanitizeAnecdoteHistory(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => ({
      anecdote: sanitizeAnecdote(entry.anecdote),
      errorLabel: String(entry.errorLabel || "").slice(0, 200),
      errorsMarked: Number.isFinite(Number(entry.errorsMarked)) ? Number(entry.errorsMarked) : 0,
      linesCompleted: Number.isFinite(Number(entry.linesCompleted)) ? Number(entry.linesCompleted) : 0,
      dangerLevel: String(entry.dangerLevel || "").slice(0, 80),
      timestamp: typeof entry.timestamp === "string" ? entry.timestamp : new Date().toISOString(),
    }))
    .slice(0, 12);
}

function sanitizeStatus(value) {
  return ["idle", "sending", "sent", "error"].includes(value) ? value : "idle";
}
