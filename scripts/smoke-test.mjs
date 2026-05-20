import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

import { buildMockAiAnalysis } from "../lib/ai-analysis.js";
import { buildMockProductWireframe } from "../lib/product-wireframe.js";
import { buildMockStoreMessages } from "../lib/store-messages.js";
import { buildMockLogisticsMessages } from "../lib/logistics-messages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "output", "playwright");

await ensureOutputDirectory();

const server = createStaticServer(rootDir);
const port = await startServer(server);
const baseUrl = `http://127.0.0.1:${port}`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

const severeConsoleMessages = [];
const pageErrors = [];

page.on("console", (message) => {
  if (message.type() === "error") {
    severeConsoleMessages.push(message.text());
  }
});

page.on("pageerror", (error) => {
  pageErrors.push(error.message);
});

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await expectVisible(page.getByRole("heading", { name: /modelo de negocio/ }));
  const sharedHeroCount = await page.locator(".hero").count();
  const supportPanelCount = await page.locator(".support-panel").count();
  if (sharedHeroCount > 0 || supportPanelCount > 0) {
    throw new Error("Las herramientas no deben renderizar el home/hero ni el panel lateral compartido.");
  }
  if (!page.url().endsWith("/diagnostico")) {
    throw new Error(`La ruta inicial debería normalizar a /diagnostico. URL actual: ${page.url()}`);
  }
  await page.screenshot({ path: path.join(outputDir, "intro.png"), fullPage: true });

  await page.locator("#student-name").fill("Andrea López");
  await page.locator("#project-name").fill("Skin Routine Lab");
  await page.locator("#product-description").fill("Skincare facial de marca propia con kits para piel sensible.");
  await page.locator("#target-customer").fill("Mujeres de 25 a 40 años que compran por Instagram y recomendacion.");
  await page.locator("#business-model").selectOption("marca-propia");
  await page.locator("#average-ticket").fill("$899 MXN");
  await page.locator("#sales-channels").fill("Instagram y WhatsApp");
  await page.locator("#primary-market").fill("Mexico");

  await page.getByRole("button", { name: /iniciar diagnóstico/i }).click();
  const emailIsInvalid = await page.locator("#email").evaluate((element) => !element.checkValidity());
  if (!emailIsInvalid) {
    throw new Error("El correo debería ser obligatorio antes de comenzar el diagnóstico.");
  }

  await page.locator("#email").fill("andrea@example.com");
  await page.getByRole("button", { name: /iniciar diagnóstico/i }).click();

  for (let index = 0; index < 7; index += 1) {
    await page.locator('[data-option-type="marketplace"]').first().click();
    await page.getByRole("button", { name: index === 6 ? /ver diagnóstico/i : /siguiente/i }).click();
  }

  await expectVisible(page.getByRole("heading", { name: "Marketplace" }));
  await expectVisible(page.getByRole("heading", { name: "Stack sugerido" }));
  await expectVisible(page.getByText("Lectura personalizada"));
  await expectVisible(page.getByText("Primer experimento sugerido"));
  await expectVisible(page.getByText("El resumen se envio"));
  await page.screenshot({ path: path.join(outputDir, "result-marketplace.png"), fullPage: true });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /descargar \.txt/i }).click(),
  ]);

  const suggestedFilename = download.suggestedFilename();
  if (!suggestedFilename.endsWith("-ruta-ecommerce.txt")) {
    throw new Error(`Nombre de descarga inesperado: ${suggestedFilename}`);
  }

  const localStorageState = await page.evaluate(() => window.localStorage.getItem("ecommerce-learning-route-v1"));
  if (!localStorageState) {
    throw new Error("No se guardó el progreso en localStorage.");
  }

  await page.getByRole("button", { name: /ficha de producto/i }).click();
  if (!page.url().endsWith("/ficha-producto")) {
    throw new Error(`La ficha de producto debería vivir en /ficha-producto. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: /La ficha de producto/ }));
  await page.locator("#wireframe-product-description").fill("Guantes de nitrilo industriales naranjas con textura para uso rudo.");
  await page.locator("#wireframe-target-customer").fill("Personas del mercado industrial y talleres.");
  await page.locator("#wireframe-price-reference").fill("399");
  await page.locator("#wireframe-differentiator").fill("Gran durabilidad.");
  await page.getByRole("button", { name: /generar wireframe/i }).click();
  await expectVisible(page.getByText("Wireframe sugerido", { exact: true }));
  await expectVisible(page.getByText("Industrial / B2B"));
  await expectVisible(page.getByText("Zona decisiva"));
  await expectVisible(page.getByText("Objeciones a resolver"));
  await page.screenshot({ path: path.join(outputDir, "wireframe-producto.png"), fullPage: true });

  await page.getByRole("button", { name: /mensajes de tienda/i }).click();
  if (!page.url().endsWith("/mensajes")) {
    throw new Error(`Mensajes de tienda debería vivir en /mensajes. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: /Toda tienda necesita respuestas/ }));
  await page.locator("#messages-student-name").fill("Andrea López");
  await page.locator("#messages-student-email").fill("andrea@example.com");
  await page.locator("#messages-store-name").fill("Industrial Supply Lab");
  await page.locator("#messages-product-description").fill("Guantes de nitrilo industriales naranjas con textura para talleres y laboratorios.");
  await page.locator("#messages-target-customer").fill("Compradores B2B que necesitan seguridad, disponibilidad y facturacion clara.");
  await page.locator("#messages-product-type").selectOption("fisico");
  await page.locator("#messages-tone").selectOption("tecnico");
  await page.locator("#messages-sales-channel").selectOption("whatsapp");
  await page.locator("#messages-shipping-type").selectOption("paqueteria");
  await page.locator("#messages-delivery-time").fill("2 a 4 dias habiles");
  await page.locator("#messages-payment-methods").fill("Transferencia y tarjeta");
  await page.locator("#messages-return-policy").fill("Cambios dentro de 7 dias si el empaque esta cerrado.");
  await page.getByRole("button", { name: /generar mensajes/i }).click();
  await expectVisible(page.getByText("Kit de mensajes", { exact: true }));
  await expectVisible(page.getByRole("heading", { name: "Bienvenida" }));
  await expectVisible(page.getByRole("heading", { name: "Retraso" }));
  await expectVisible(page.getByRole("heading", { name: "Cambio o devolucion" }));
  await expectVisible(page.getByText("Los mensajes se enviaron"));
  await page.screenshot({ path: path.join(outputDir, "mensajes-tienda.png"), fullPage: true });

  await page.goto(`${baseUrl}/ficha-producto`, { waitUntil: "networkidle" });
  await expectVisible(page.getByRole("heading", { name: /La ficha de producto/ }));

  await page.getByRole("button", { name: /logistica clara/i }).click();
  if (!page.url().endsWith("/logistica")) {
    throw new Error(`Logistica clara deberia vivir en /logistica. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: /No prometas rapido/ }));
  await page.locator("#logistics-student-name").fill("Andrea López");
  await page.locator("#logistics-student-email").fill("andrea@example.com");
  await page.locator("#logistics-business-name").fill("Babal Wines");
  await page.locator("#logistics-product-description").fill("Vinos artesanales boutique de Aguascalientes, botellas de 750 ml.");
  await page.locator("#logistics-business-type").selectOption("producto_fisico");
  await page.locator("#logistics-coverage").selectOption("nacional");
  await page.locator("#logistics-prep-time").selectOption("24 a 48 horas");
  await page.locator("#logistics-shipping-cost").fill("$150 MXN");
  await page.locator("#logistics-carriers").fill("DHL y FedEx");
  await page.locator("#logistics-damage-policy").fill("Revisamos fotos de empaque y producto en 24 horas.");
  await page.locator('input[name="currentErrors"][value="sin_fecha"]').check();
  await page.locator('input[name="currentErrors"][value="sin_aviso"]').check();
  await page.getByRole("button", { name: /generar mensajes claros/i }).click();
  await expectVisible(page.getByText("Comunicacion logistica para Babal Wines"));
  await expectVisible(page.getByText("Mensaje debil"));
  await expectVisible(page.getByRole("heading", { name: "Comunicacion de retraso" }));
  await expectVisible(page.getByText("Los mensajes logisticos se enviaron"));
  await page.screenshot({ path: path.join(outputDir, "logistica-clara.png"), fullPage: true });

  await page.getByRole("button", { name: /peso volumetrico/i }).click();
  if (!page.url().endsWith("/peso-volumetrico")) {
    throw new Error(`Peso volumetrico deberia vivir en /peso-volumetrico. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: /Peso volumetrico/ }));
  await page.locator("#volumetric-preset").selectOption("large-light");
  await expectVisible(page.getByText("Gana el peso volumetrico"));
  await expectVisible(page.getByText("6 kg volumetricos", { exact: true }));
  await expectVisible(page.getByText("Peso cobrable"));
  await page.locator("#volumetric-rate").fill("95");
  await page.getByRole("button", { name: /actualizar simulacion/i }).click();
  await expectVisible(page.getByText("$570 MXN estimados"));
  await page.screenshot({ path: path.join(outputDir, "peso-volumetrico.png"), fullPage: true });

  await page.getByRole("button", { name: /logichallenged/i }).click();
  if (!page.url().endsWith("/logichallenged")) {
    throw new Error(`LogiChallenged deberia vivir en /logichallenged. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: "LogiChallenged" }));
  await expectVisible(page.getByText("Taller de Optimizacion"));
  await expectVisible(page.getByText("12:00"));
  await page.locator("#logi-table").selectOption("3");
  await page.locator("#logi-store").fill("Wrap Lab");
  await page.locator("#logi-product").selectOption("Bombillo o foco (Extremadamente frágil, dimensiones difíciles)");
  await page.locator("#logi-price").fill("250");
  await page.locator("#logi-weight").fill("0.4");
  await page.getByRole("button", { name: /Caja Mediana/i }).click();
  await page.locator(".logi-zone-group label").filter({ hasText: "Zona Extendida" }).click();
  await expectVisible(page.getByText("¡Alerta de Costo!"));
  await page.getByRole("button", { name: /Publicar empaque/i }).click();
  await expectVisible(page.getByText("Empaque de Mesa 3 publicado"));
  await page.getByRole("button", { name: /Galeria Walk/i }).click();
  await expectVisible(page.getByText("Wrap Lab"));
  await page.locator('[data-action="logi-filter"]').selectOption("3");
  await expectVisible(page.locator(".logi-package-card").filter({ hasText: "Mesa 3" }));
  await page.getByRole("button", { name: /Más Eficiente/i }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, "logichallenged.png"), fullPage: true });

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 1200 }, isMobile: true });
  await mobilePage.goto(`${baseUrl}/logichallenged`, { waitUntil: "networkidle" });
  await expectVisible(mobilePage.getByRole("heading", { name: "LogiChallenged" }));
  const hasHorizontalOverflow = await mobilePage.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
  if (hasHorizontalOverflow) {
    throw new Error("La vista movil de LogiChallenged tiene overflow horizontal.");
  }
  await mobilePage.screenshot({ path: path.join(outputDir, "logichallenged-mobile.png"), fullPage: true });
  await mobilePage.close();

  if (pageErrors.length > 0) {
    throw new Error(`Errores de página detectados: ${pageErrors.join(" | ")}`);
  }

  if (severeConsoleMessages.length > 0) {
    throw new Error(`Errores de consola detectados: ${severeConsoleMessages.join(" | ")}`);
  }

  console.log("Smoke test completado.");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Descarga validada: ${suggestedFilename}`);
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function ensureOutputDirectory() {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(outputDir, { recursive: true });
}

function createStaticServer(rootPath) {
  return http.createServer(async (request, response) => {
    try {
      const requestPath = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);

      if (request.method === "POST" && requestPath === "/api/analyze") {
        const body = await readRequestBody(request);
        const analysis = buildMockAiAnalysis(body.context);
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", model: "mock", analysis }));
        return;
      }

      if (request.method === "POST" && requestPath === "/api/send-summary") {
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", delivered: true, studentEmailId: "test-student", teacherEmailId: "test-teacher" }));
        return;
      }

      if (request.method === "POST" && requestPath === "/api/product-wireframe") {
        const body = await readRequestBody(request);
        const result = buildMockProductWireframe(body.brief);
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", model: "mock", result }));
        return;
      }

      if (request.method === "POST" && requestPath === "/api/store-messages") {
        const body = await readRequestBody(request);
        const result = buildMockStoreMessages(body.brief);
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", model: "mock", result }));
        return;
      }

      if (request.method === "POST" && requestPath === "/api/send-store-messages") {
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", delivered: true, studentEmailId: "test-student", teacherEmailId: "test-teacher" }));
        return;
      }

      if (request.method === "POST" && requestPath === "/api/logistics-messages") {
        const body = await readRequestBody(request);
        const result = buildMockLogisticsMessages(body.brief);
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", model: "mock", result }));
        return;
      }

      if (request.method === "POST" && requestPath === "/api/send-logistics-messages") {
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", delivered: true, studentEmailId: "test-student", teacherEmailId: "test-teacher" }));
        return;
      }

      const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
      const routeFallbacks = new Set([
        "/diagnostico",
        "/ficha-producto",
        "/mensajes",
        "/logistica",
        "/peso-volumetrico",
        "/logichallenged",
      ]);
      const pathToServe = routeFallbacks.has(normalizedPath) ? "/index.html" : normalizedPath;
      const filePath = path.normalize(path.join(rootPath, pathToServe));
      const relativePath = path.relative(rootPath, filePath);

      if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const fileInfo = await stat(filePath);
      if (!fileInfo.isFile()) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, { "Content-Type": getContentType(filePath) });
      response.end(body);
    } catch (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
    }
  });
}

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch (error) {
    return {};
  }
}

async function startServer(serverInstance) {
  return new Promise((resolve, reject) => {
    serverInstance.listen(0, "127.0.0.1", () => {
      const address = serverInstance.address();
      if (!address || typeof address === "string") {
        reject(new Error("No se pudo obtener el puerto del servidor."));
        return;
      }
      resolve(address.port);
    });

    serverInstance.on("error", reject);
  });
}

async function expectVisible(locator) {
  await locator.waitFor({ state: "visible", timeout: 10000 });
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
