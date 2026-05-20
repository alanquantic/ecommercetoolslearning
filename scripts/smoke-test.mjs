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
  await expectVisible(page.getByRole("heading", { name: /Tu kit para vender en linea/i }));
  await expectVisible(page.getByRole("heading", { name: /Antes de operar/i }));
  if (page.url() !== `${baseUrl}/` && !page.url().endsWith("/")) {
    throw new Error(`La ruta inicial debe ser /. URL actual: ${page.url()}`);
  }
  await page.screenshot({ path: path.join(outputDir, "home.png"), fullPage: true });

  await page.getByRole("button", { name: /Diagnostico inicial\s+Diagnostico de ruta/i }).click();
  await expectVisible(page.getByRole("heading", { name: /modelo de negocio/ }));
  if (!page.url().endsWith("/diagnostico")) {
    throw new Error(`Al abrir Diagnostico debe ir a /diagnostico. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("button", { name: /Volver al menu/i }));
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

  await page.goto(`${baseUrl}/ficha-producto`, { waitUntil: "networkidle" });
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

  await page.goto(`${baseUrl}/mensajes`, { waitUntil: "networkidle" });
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
  await expectVisible(page.getByText(/Kit de mensajes de venta/));
  await expectVisible(page.getByRole("heading", { name: "Bienvenida" }));
  await expectVisible(page.getByRole("heading", { name: "Retraso" }));
  await expectVisible(page.getByRole("heading", { name: "Cambio o devolucion" }));
  await expectVisible(page.getByText("Los mensajes se enviaron"));
  await page.screenshot({ path: path.join(outputDir, "mensajes-tienda.png"), fullPage: true });

  await page.goto(`${baseUrl}/ficha-producto`, { waitUntil: "networkidle" });
  await expectVisible(page.getByRole("heading", { name: /La ficha de producto/ }));

  await page.goto(`${baseUrl}/logistica`, { waitUntil: "networkidle" });
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

  await page.goto(`${baseUrl}/peso-volumetrico`, { waitUntil: "networkidle" });
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

  await page.goto(`${baseUrl}/logibingo`, { waitUntil: "networkidle" });
  if (!page.url().endsWith("/logibingo")) {
    throw new Error(`LogiBingo deberia vivir en /logibingo. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: /LogiBingo/ }));
  await expectVisible(page.getByText(/Tu indice de horrores/i));
  const cells = page.locator(".logibingo-cell");
  await page.waitForFunction(() => document.querySelectorAll(".logibingo-cell").length === 16);
  for (let index = 0; index < 4; index += 1) {
    await cells.nth(index).click();
  }
  await expectVisible(page.getByText(/¡Loteria! Te toco esta carta/i));
  await page.locator('[data-input="logibingo-anecdote"]').fill(
    "Vendi un producto que estaba agotado y me toco escribirle al cliente para cancelar."
  );
  await page.getByRole("button", { name: /Enviar anecdota anonima/i }).click();
  await expectVisible(page.getByText(/Mis cartas cantadas/i));
  await expectVisible(page.getByText(/Vendi un producto que estaba agotado/));
  await expectVisible(page.getByText(/Has vivido los clasicos|Cliente afortunado/));
  // Mark 5 more cells without completing a new line: row 0 already done, this sequence leaves
  // every other row/column/diagonal one cell short.
  for (const idx of [4, 5, 6, 9, 10]) {
    await cells.nth(idx).click();
  }
  await expectVisible(page.getByText(/Coleccionista de horrores/i));
  await page.screenshot({ path: path.join(outputDir, "logibingo.png"), fullPage: true });

  await page.goto(`${baseUrl}/logimatch`, { waitUntil: "networkidle" });
  if (!page.url().endsWith("/logimatch")) {
    throw new Error(`LogiMatch deberia vivir en /logimatch. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: /LogiMatch/ }));
  await expectVisible(page.getByRole("heading", { name: /Paqueterias/ }));
  await page.getByRole("button", { name: /Hacer el examen/ }).click();
  await expectVisible(page.getByRole("heading", { name: /Quien resuelve el examen/i }));
  await page.locator("#logimatch-student").fill("Andrea Lopez");
  await page.locator('select[data-input="logimatch-assignment"][data-mipyme="bakery"]').selectOption("uber");
  await page.locator('select[data-input="logimatch-assignment"][data-mipyme="jewelry"]').selectOption("fedex");
  await page.locator('select[data-input="logimatch-assignment"][data-mipyme="clothing"]').selectOption("estafeta");
  await page.locator('select[data-input="logimatch-assignment"][data-mipyme="electronics"]').selectOption("min99");
  await page.locator('select[data-input="logimatch-assignment"][data-mipyme="cosmetics"]').selectOption("estafeta");
  await page.locator('select[data-input="logimatch-assignment"][data-mipyme="food"]').selectOption("estafeta");
  await page.getByRole("button", { name: /Calificar mis 6 pares/i }).click();
  await expectVisible(page.getByText(/Examen calificado:/i));
  await expectVisible(page.getByText(/Detalle por par/));
  await expectVisible(page.getByText(/Las respuestas ideales y por que/i));
  const matchDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Descargar evidencia/i }).click();
  const matchDownload = await matchDownloadPromise;
  const matchDownloadName = matchDownload.suggestedFilename();
  if (!matchDownloadName.startsWith("logimatch-andrea-lopez")) {
    throw new Error(`Evidencia con nombre inesperado: ${matchDownloadName}`);
  }
  await page.screenshot({ path: path.join(outputDir, "logimatch.png"), fullPage: true });

  await page.goto(`${baseUrl}/logicoach`, { waitUntil: "networkidle" });
  if (!page.url().endsWith("/logicoach")) {
    throw new Error(`LogiCoach deberia vivir en /logicoach. URL actual: ${page.url()}`);
  }
  await expectVisible(page.getByRole("heading", { name: /LogiCoach/ }));
  await expectVisible(page.getByText(/Paso 1 · Canales y registro/));
  await page.locator('[data-input="logicoach-email"]').fill("alumno@example.com");
  await page.locator('[data-input="logicoach-activity"]').fill("Pasteleria artesanal en Aguascalientes con ventas locales");
  await page.getByRole("button", { name: "WhatsApp" }).first().click();
  await page.locator('textarea[data-question="q2"]').fill("Libreta manual donde anoto numero de pedido y nombre del cliente.");
  await page.locator('textarea[data-question="q3"]').fill("Nombre, telefono, direccion con CP y comprobante de pago.");
  await page.getByRole("button", { name: /Siguiente paso/ }).click();
  await expectVisible(page.getByText(/Paso 2 · Transacciones/i));
  await page.locator('textarea[data-question="q4"]').fill("Reviso transferencia bancaria en la app antes de armar.");
  await page.locator('textarea[data-question="q5"]').fill("A ojo cuando voy a la bodega, sin sistema formal.");
  await page.locator('textarea[data-question="q6"]').fill("Yo mismo desde casa por la tarde.");
  await page.getByRole("button", { name: /Siguiente paso/ }).click();
  await expectVisible(page.getByText(/Paso 3 · Empaque/i));
  await page.locator('textarea[data-question="q7"]').fill("Reviso talla, fotografio el contenido y sello con cinta firmada.");
  await page.locator('textarea[data-question="q8"]').fill("FedEx terrestre como opcion principal nacional.");
  await page.locator('textarea[data-question="q9"]').fill("FedEx tambien si la primera falla.");
  await page.getByRole("button", { name: /Siguiente paso/ }).click();
  await expectVisible(page.getByText(/Paso 4 · Promesas/i));
  await page.locator('textarea[data-question="q10"]').fill("24 horas habiles desde la confirmacion del pago.");
  await page.locator('textarea[data-question="q11"]').fill("Aviso al cliente antes de 24h con guia nueva y un detalle de cortesia.");
  await page.locator('textarea[data-question="q12"]').fill("Porcentaje de pedidos entregados a tiempo y quejas por logistica.");
  await page.getByRole("button", { name: /Generar diagnostico/ }).click();
  await expectVisible(page.getByRole("heading", { name: /Diagnostico final|Optimizado|En desarrollo|Inicial/i }));
  await expectVisible(page.getByText(/Riesgo de cuello de botella/));
  await expectVisible(page.getByText(/Peligro de quiebre de stock/));
  await expectVisible(page.getByText(/Vulnerabilidad en distribucion/));
  await expectVisible(page.getByRole("button", { name: /Copiar formato/ }));
  await page.screenshot({ path: path.join(outputDir, "logicoach.png"), fullPage: true });

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 1200 }, isMobile: true });
  await mobilePage.goto(`${baseUrl}/logibingo`, { waitUntil: "networkidle" });
  await expectVisible(mobilePage.getByRole("heading", { name: /LogiBingo/ }));
  const hasHorizontalOverflow = await mobilePage.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
  if (hasHorizontalOverflow) {
    throw new Error("La vista movil de LogiBingo tiene overflow horizontal.");
  }
  await mobilePage.screenshot({ path: path.join(outputDir, "logibingo-mobile.png"), fullPage: true });
  await mobilePage.goto(`${baseUrl}/logimatch`, { waitUntil: "networkidle" });
  await expectVisible(mobilePage.getByRole("heading", { name: /LogiMatch/ }));
  const matchOverflow = await mobilePage.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
  if (matchOverflow) {
    throw new Error("La vista movil de LogiMatch tiene overflow horizontal.");
  }
  await mobilePage.screenshot({ path: path.join(outputDir, "logimatch-mobile.png"), fullPage: true });
  await mobilePage.goto(`${baseUrl}/logicoach`, { waitUntil: "networkidle" });
  await expectVisible(mobilePage.getByRole("heading", { name: /LogiCoach/ }));
  const coachOverflow = await mobilePage.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
  if (coachOverflow) {
    throw new Error("La vista movil de LogiCoach tiene overflow horizontal.");
  }
  await mobilePage.screenshot({ path: path.join(outputDir, "logicoach-mobile.png"), fullPage: true });
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

      if (request.method === "POST" && requestPath === "/api/send-bingo-anecdote") {
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ mode: "mock", delivered: true, teacherEmailId: "test-anecdote" }));
        return;
      }

      if (request.method === "POST" && requestPath === "/api/logicoach-plan") {
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(
          JSON.stringify({
            mode: "mock",
            model: "mock",
            plan: {
              headline: "Plan inicial para tu pasteleria local",
              summary: "Tu plan logistico arranca con bases solidas pero hay riesgos en inventario y canales.",
              strengths: ["Identificas canales claros", "Reconoces el riesgo de stock"],
              risks: ["Inventario a ojo", "Sin plan B de paqueteria"],
              thirtyDayPlan: [
                { week: "Semana 1", focus: "Centralizar pedidos", actions: ["Hoja unica de pedidos"] },
                { week: "Semana 2", focus: "Inventario controlado", actions: ["Kardex con stock minimo"] },
                { week: "Semana 3", focus: "Plan logistico B", actions: ["Cuenta alterna de paqueteria"] },
                { week: "Semana 4", focus: "Medicion semanal", actions: ["KPI de pedidos a tiempo"] },
              ],
              checklist: ["Define canal alterno", "Documenta protocolo de retraso"],
              metrics: ["% a tiempo", "# incidencias"],
            },
          })
        );
        return;
      }

      if (request.method === "POST" && requestPath === "/api/send-logicoach-plan") {
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
        "/logibingo",
        "/logimatch",
        "/logicoach",
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
