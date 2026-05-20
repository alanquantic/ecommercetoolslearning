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
    bingoTriggered: false,
    modalOpen: false,
    anecdote: "",
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
  const bingoTriggered = Boolean(value.bingoTriggered);
  const modalOpen = Boolean(value.modalOpen) && bingoTriggered;

  return {
    order,
    selected,
    bingoTriggered,
    modalOpen,
    anecdote,
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
  const lineComplete = hasAnyLine(selected);
  const triggerModalNow = lineComplete && !state.bingoTriggered;

  return {
    ...state,
    selected,
    bingoTriggered: state.bingoTriggered || lineComplete,
    modalOpen: triggerModalNow ? true : state.modalOpen,
  };
}

export function setAnecdote(state, value) {
  return {
    ...state,
    anecdote: sanitizeAnecdote(value),
  };
}

export function closeModal(state) {
  return {
    ...state,
    modalOpen: false,
  };
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
      label: "Operador Junior Prudente",
      detail: "Vas controlando los riesgos básicos. Mantén ese ritmo.",
      tone: "success",
      pulse: false,
    };
  }
  if (count <= 8) {
    return {
      key: "amber",
      label: "Coordinador de Crisis Logísticas",
      detail: "Los errores están acumulándose: revisa procesos antes de la siguiente venta.",
      tone: "warning",
      pulse: false,
    };
  }
  return {
    key: "red",
    label: "🚨 Imán de Pérdidas Operativas: ¡Necesitas este taller de inmediato!",
    detail: "Cada error en este nivel cuesta clientes, dinero y reputación. Es momento de rediseñar tu operación.",
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
