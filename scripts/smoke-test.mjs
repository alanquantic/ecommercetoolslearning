import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

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
  await expectVisible(page.locator("text=Diagnostica la mejor ruta"));
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
      const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
      const filePath = path.normalize(path.join(rootPath, normalizedPath));
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
