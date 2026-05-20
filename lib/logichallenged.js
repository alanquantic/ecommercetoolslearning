const PRODUCTS = [
  "Taza cerámica (Frágil, peso medio, forma irregular - H: 12cm)",
  "Vela artesanal en frasco (Frágil, control de olor/temperatura)",
  "Playera enrollada (No frágil, ligera, empaque blando)",
  "Frasco de mermelada o miel (Frágil, pesado, riesgo de derrame)",
  "Pulsera o collar en caja chica (Alto valor, pequeño, regalo)",
  "Paquete de galletas / Alimento (Frágil, caducidad, contaminación)",
  "Bombillo o foco (Extremadamente frágil, dimensiones difíciles)",
  "Libro o libreta (Peso bajo, rígido, sensible a humedad)",
  "Maceta pequeña con planta (Pesado, frágil, requiere ventilación)",
  "Producto cosmético en vidrio (Frágil, líquido, alta presentación)",
];

const ZONES = {
  local: { label: "Local", rate: 50, detail: "$50/kg" },
  nacional: { label: "Nacional", rate: 90, detail: "$90/kg" },
  extendida: { label: "Zona Extendida", rate: 160, detail: "$160/kg" },
};

const DEFAULT_FORM = {
  tableNumber: "1",
  storeName: "",
  product: PRODUCTS[0],
  productPrice: "",
  realWeight: "",
  length: "",
  width: "",
  height: "",
  zone: "nacional",
};

const EXAMPLE_PACKAGES = [
  {
    id: "mesa-1-demo",
    tableNumber: "1",
    storeName: "Ceramica Aurora",
    product: PRODUCTS[0],
    productPrice: 320,
    realWeight: 1.2,
    length: 25,
    width: 20,
    height: 15,
    zone: "nacional",
    votes: { safe: 2, pretty: 1, efficient: 1 },
    createdAt: "2026-05-20T08:00:00.000Z",
  },
  {
    id: "mesa-2-demo",
    tableNumber: "2",
    storeName: "Miel del Valle",
    product: PRODUCTS[3],
    productPrice: 180,
    realWeight: 1.6,
    length: 16,
    width: 12,
    height: 8,
    zone: "local",
    votes: { safe: 1, pretty: 2, efficient: 3 },
    createdAt: "2026-05-20T08:03:00.000Z",
  },
];

export function createDefaultLogiChallengedState() {
  return {
    activeTab: "simulator",
    filterTable: "all",
    timerSeconds: 12 * 60,
    timerRunning: false,
    form: { ...DEFAULT_FORM },
    packages: EXAMPLE_PACKAGES.map((item) => normalizePackage(item)),
    notice: "",
  };
}

export function normalizeLogiChallengedState(value) {
  const base = createDefaultLogiChallengedState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const packages = Array.isArray(value.packages)
    ? value.packages.map((item) => normalizePackage(item)).filter(Boolean)
    : base.packages;

  return {
    ...base,
    activeTab: ["simulator", "gallery"].includes(value.activeTab) ? value.activeTab : base.activeTab,
    filterTable: normalizeFilterTable(value.filterTable),
    timerSeconds: clampNumber(value.timerSeconds, 0, 12 * 60, base.timerSeconds),
    timerRunning: Boolean(value.timerRunning) && Number(value.timerSeconds) > 0,
    form: normalizeForm(value.form),
    packages: packages.length > 0 ? packages : base.packages,
    notice: sanitizeInput(value.notice, 160),
  };
}

export function normalizeForm(value) {
  return {
    tableNumber: normalizeTable(value?.tableNumber, "1"),
    storeName: sanitizeInput(value?.storeName, 80),
    product: PRODUCTS.includes(value?.product) ? value.product : PRODUCTS[0],
    productPrice: normalizeOptionalNumber(value?.productPrice, 0, 100000),
    realWeight: normalizeOptionalNumber(value?.realWeight, 0, 500),
    length: normalizeOptionalNumber(value?.length, 0, 500),
    width: normalizeOptionalNumber(value?.width, 0, 500),
    height: normalizeOptionalNumber(value?.height, 0, 500),
    zone: Object.prototype.hasOwnProperty.call(ZONES, value?.zone) ? value.zone : "nacional",
  };
}

export function normalizePackage(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const form = normalizeForm(value);
  const hasNumbers = Number(form.productPrice) > 0 && Number(form.realWeight) > 0 && Number(form.length) > 0 && Number(form.width) > 0 && Number(form.height) > 0;
  if (!form.storeName || !hasNumbers) {
    return null;
  }

  return {
    id: sanitizeInput(value.id, 80) || createId(),
    ...form,
    productPrice: Number(form.productPrice),
    realWeight: Number(form.realWeight),
    length: Number(form.length),
    width: Number(form.width),
    height: Number(form.height),
    votes: normalizeVotes(value.votes),
    createdAt: sanitizeInput(value.createdAt, 40) || new Date().toISOString(),
  };
}

export function validateForm(form) {
  const normalized = normalizeForm(form);
  const missing = [];

  if (!normalized.tableNumber) missing.push("Mesa / Equipo");
  if (!normalized.storeName) missing.push("Nombre de la tienda");
  if (!normalized.product) missing.push("Producto asignado");
  if (Number(normalized.productPrice) <= 0) missing.push("Precio del producto");
  if (Number(normalized.realWeight) <= 0) missing.push("Peso real");
  if (Number(normalized.length) <= 0) missing.push("Largo");
  if (Number(normalized.width) <= 0) missing.push("Ancho");
  if (Number(normalized.height) <= 0) missing.push("Alto");

  return {
    ok: missing.length === 0,
    missing,
    form: normalized,
  };
}

export function calculatePackage(input) {
  const item = normalizeForm(input);
  const length = Number(item.length) || 0;
  const width = Number(item.width) || 0;
  const height = Number(item.height) || 0;
  const realWeight = Number(item.realWeight) || 0;
  const productPrice = Number(item.productPrice) || 0;
  const zone = ZONES[item.zone] || ZONES.nacional;
  const volumetricWeight = (length * width * height) / 5000;
  const chargeableBase = Math.max(realWeight, volumetricWeight);
  const chargeableWeight = Math.max(1, Math.ceil(chargeableBase));
  const shippingCost = chargeableWeight * zone.rate;
  const financialImpact = productPrice > 0 ? (shippingCost / productPrice) * 100 : 0;
  const dominant = volumetricWeight > realWeight ? "volumetric" : "real";

  return {
    ...item,
    zone,
    volume: length * width * height,
    volumetricWeight,
    chargeableBase,
    chargeableWeight,
    shippingCost,
    financialImpact,
    dominant,
    isHighImpact: financialImpact > 30,
  };
}

export function createPackageFromForm(form) {
  const validation = validateForm(form);
  if (!validation.ok) {
    return { error: validation.missing };
  }

  return {
    packageItem: normalizePackage({
      id: createId(),
      ...validation.form,
      votes: { safe: 0, pretty: 0, efficient: 0 },
      createdAt: new Date().toISOString(),
    }),
  };
}

export function getProducts() {
  return [...PRODUCTS];
}

export function getZones() {
  return Object.entries(ZONES).map(([id, zone]) => ({ id, ...zone }));
}

export function getTableOptions() {
  return Array.from({ length: 15 }, (_, index) => String(index + 1));
}

export function getBoxScale(input) {
  const item = normalizeForm(input);
  const length = Number(item.length) || 1;
  const width = Number(item.width) || 1;
  const height = Number(item.height) || 1;
  const maxDimension = Math.max(length, width, height, 1);

  return {
    width: Math.max(72, Math.round((length / maxDimension) * 180)),
    height: Math.max(54, Math.round((height / maxDimension) * 140)),
    depth: Math.max(18, Math.round((width / maxDimension) * 48)),
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: Number(value || 0) % 1 === 0 ? 0 : Math.min(decimals, 2),
  }).format(Number(value || 0));
}

function normalizeVotes(value) {
  return {
    safe: clampNumber(value?.safe, 0, 999, 0),
    pretty: clampNumber(value?.pretty, 0, 999, 0),
    efficient: clampNumber(value?.efficient, 0, 999, 0),
  };
}

function normalizeFilterTable(value) {
  if (value === "all") {
    return "all";
  }
  return normalizeTable(value, "all");
}

function normalizeTable(value, fallback) {
  const stringValue = String(value || "");
  return getTableOptions().includes(stringValue) ? stringValue : fallback;
}

function normalizeOptionalNumber(value, min, max) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "";
  }
  return Math.min(Math.max(number, min), max);
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(Math.max(Math.trunc(number), min), max);
}

function sanitizeInput(value, maxLength = 120) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function createId() {
  return `pkg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
