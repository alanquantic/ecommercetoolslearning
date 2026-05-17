const DEFAULT_SIMULATOR = {
  boxPreset: "custom",
  length: 40,
  width: 30,
  height: 25,
  realWeight: 0.8,
  factor: 5000,
  ratePerKg: "",
  rounding: "ceil",
};

const BOX_PRESETS = [
  {
    id: "small-heavy",
    label: "Caja chica pesada",
    description: "Ejemplo didactico: el peso real gana.",
    length: 20,
    width: 15,
    height: 10,
    realWeight: 1.5,
  },
  {
    id: "large-light",
    label: "Caja grande ligera",
    description: "Ejemplo peligroso: el volumen dispara el cobro.",
    length: 40,
    width: 30,
    height: 25,
    realWeight: 0.8,
  },
  {
    id: "jewelry",
    label: "Accesorios pequenos",
    description: "Caja compacta para joyeria, cosmetica o accesorios.",
    length: 18,
    width: 14,
    height: 8,
    realWeight: 0.4,
  },
  {
    id: "shoe-box",
    label: "Caja tipo zapatos",
    description: "Referencia comun para moda y calzado.",
    length: 35,
    width: 25,
    height: 12,
    realWeight: 1.1,
  },
  {
    id: "medium-box",
    label: "Caja mediana",
    description: "Uso frecuente para kits o bundles.",
    length: 30,
    width: 25,
    height: 20,
    realWeight: 2.2,
  },
  {
    id: "bulky-box",
    label: "Producto voluminoso",
    description: "Mucho aire y poco peso real.",
    length: 60,
    width: 40,
    height: 35,
    realWeight: 3,
  },
];

const FACTOR_OPTIONS = [
  { value: 5000, label: "5000 - terrestre frecuente en Mexico" },
  { value: 6000, label: "6000 - aereo o internacional frecuente" },
  { value: 4000, label: "4000 - factor mas estricto" },
];

export function createDefaultVolumetricState() {
  return {
    simulator: { ...DEFAULT_SIMULATOR },
  };
}

export function normalizeVolumetricState(value) {
  const base = createDefaultVolumetricState();
  if (!value || typeof value !== "object") {
    return base;
  }

  return {
    simulator: normalizeVolumetricSimulator(value.simulator),
  };
}

export function normalizeVolumetricSimulator(value) {
  const factor = clampNumber(value?.factor, 1000, 10000, DEFAULT_SIMULATOR.factor);
  const presetIds = new Set(["custom", ...BOX_PRESETS.map((box) => box.id)]);

  return {
    boxPreset: presetIds.has(value?.boxPreset) ? value.boxPreset : "custom",
    length: clampNumber(value?.length, 1, 300, DEFAULT_SIMULATOR.length),
    width: clampNumber(value?.width, 1, 300, DEFAULT_SIMULATOR.width),
    height: clampNumber(value?.height, 1, 300, DEFAULT_SIMULATOR.height),
    realWeight: clampNumber(value?.realWeight, 0.01, 300, DEFAULT_SIMULATOR.realWeight),
    factor,
    ratePerKg: normalizeOptionalNumber(value?.ratePerKg, 0, 100000),
    rounding: ["none", "half", "ceil"].includes(value?.rounding) ? value.rounding : "ceil",
  };
}

export function applyBoxPreset(simulator, presetId) {
  const preset = BOX_PRESETS.find((box) => box.id === presetId);
  const base = normalizeVolumetricSimulator(simulator);
  if (!preset) {
    return {
      ...base,
      boxPreset: "custom",
    };
  }

  return normalizeVolumetricSimulator({
    ...base,
    boxPreset: preset.id,
    length: preset.length,
    width: preset.width,
    height: preset.height,
    realWeight: preset.realWeight,
  });
}

export function calculateVolumetric(simulator) {
  const normalized = normalizeVolumetricSimulator(simulator);
  const volumeCm3 = normalized.length * normalized.width * normalized.height;
  const volumetricWeight = volumeCm3 / normalized.factor;
  const chargeableRaw = Math.max(normalized.realWeight, volumetricWeight);
  const chargeableWeight = roundChargeableWeight(chargeableRaw, normalized.rounding);
  const realWeightBillable = roundChargeableWeight(normalized.realWeight, normalized.rounding);
  const volumetricBillable = roundChargeableWeight(volumetricWeight, normalized.rounding);
  const dominant = volumetricWeight > normalized.realWeight ? "volumetric" : "real";
  const multiplier = normalized.realWeight > 0 ? chargeableWeight / normalized.realWeight : 1;
  const rate = Number(normalized.ratePerKg || 0);
  const estimatedCost = rate > 0 ? chargeableWeight * rate : null;
  const compactSuggestion = buildCompactSuggestion(normalized);

  return {
    simulator: normalized,
    volumeCm3,
    volumetricWeight,
    chargeableRaw,
    chargeableWeight,
    realWeightBillable,
    volumetricBillable,
    dominant,
    multiplier,
    estimatedCost,
    riskLevel: getRiskLevel(multiplier, dominant),
    explanation: buildExplanation(normalized, volumetricWeight, chargeableWeight, dominant, multiplier),
    compactSuggestion,
  };
}

export function getBoxPresets() {
  return BOX_PRESETS.map((box) => ({ ...box }));
}

export function getFactorOptions() {
  return FACTOR_OPTIONS.map((option) => ({ ...option }));
}

export function formatNumber(value, decimals = 2) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: number % 1 === 0 ? 0 : Math.min(decimals, 2),
  }).format(number);
}

function buildExplanation(simulator, volumetricWeight, chargeableWeight, dominant, multiplier) {
  if (dominant === "real") {
    return `El peso real (${formatNumber(simulator.realWeight)} kg) es mayor que el peso volumetrico (${formatNumber(
      volumetricWeight
    )} kg). En este caso la caja no te castiga: cobrarian principalmente por peso real.`;
  }

  if (multiplier >= 5) {
    return `Cuidado: el paquete pesa ${formatNumber(simulator.realWeight)} kg, pero podria cobrarse como ${formatNumber(
      chargeableWeight
    )} kg. Estas pagando aire por usar una caja demasiado grande.`;
  }

  return `El peso volumetrico (${formatNumber(volumetricWeight)} kg) supera al peso real (${formatNumber(
    simulator.realWeight
  )} kg). Conviene revisar si puedes reducir caja, relleno o altura.`;
}

function buildCompactSuggestion(simulator) {
  const suggestedLength = Math.max(1, Math.round(simulator.length * 0.9));
  const suggestedWidth = Math.max(1, Math.round(simulator.width * 0.9));
  const suggestedHeight = Math.max(1, Math.round(simulator.height * 0.85));
  const suggestedVolume = suggestedLength * suggestedWidth * suggestedHeight;
  const suggestedVolumetric = suggestedVolume / simulator.factor;
  const current = calculateRawVolumetric(simulator);
  const potentialReduction = current > 0 ? Math.max(0, ((current - suggestedVolumetric) / current) * 100) : 0;

  return {
    length: suggestedLength,
    width: suggestedWidth,
    height: suggestedHeight,
    volumetricWeight: suggestedVolumetric,
    potentialReduction,
  };
}

function calculateRawVolumetric(simulator) {
  return (simulator.length * simulator.width * simulator.height) / simulator.factor;
}

function getRiskLevel(multiplier, dominant) {
  if (dominant === "real") {
    return {
      label: "Riesgo bajo",
      tone: "success",
      detail: "El peso real domina el cobro.",
    };
  }
  if (multiplier >= 5) {
    return {
      label: "Riesgo alto",
      tone: "danger",
      detail: "El volumen puede multiplicar mucho el costo.",
    };
  }
  if (multiplier >= 2) {
    return {
      label: "Riesgo medio",
      tone: "warning",
      detail: "La caja ya esta afectando el cobro.",
    };
  }
  return {
    label: "Riesgo moderado",
    tone: "warning",
    detail: "El volumen gana por poco.",
  };
}

function roundChargeableWeight(value, mode) {
  if (mode === "none") {
    return roundTo(value, 2);
  }
  if (mode === "half") {
    return Math.ceil(value * 2) / 2;
  }
  return Math.ceil(value);
}

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(Number(value || 0) * factor) / factor;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(Math.max(number, min), max);
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
