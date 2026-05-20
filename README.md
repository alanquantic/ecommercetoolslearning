# Ruta E-commerce

Herramienta local para orientar a alumnos sobre decisiones clave al lanzar un e-commerce.

## Ejecutar local

```bash
cd /Users/alanceoslogica/Documents/ECOMMERCETOOLSLEARNING
python3 -m http.server 4173
```

Luego abre:

```text
http://127.0.0.1:4173
```

## Prueba de humo

Instala dependencias y corre la validación del flujo completo:

```bash
cd /Users/alanceoslogica/Documents/ECOMMERCETOOLSLEARNING
npm install
npm run smoke
```

Esto:

- levanta un servidor estático temporal;
- responde el diagnóstico;
- valida el resultado;
- comprueba la descarga del resumen;
- valida el generador de ficha de producto y el kit de mensajes;
- guarda capturas en `output/playwright/`.

## Lo que ya hace

- Diagnostica entre tienda propia, marketplace o modelo híbrido.
- Genera wireframes sugeridos para fichas de producto a partir de una descripcion.
- Genera mensajes operativos para tienda en linea: bienvenida, producto, precio, pedido, pago, envio, retraso, entrega, postventa y cambios/devoluciones.
- Genera mensajes de logistica clara para tiempos de entrega, confirmacion de pedido, avisos, retrasos y problemas.
- Simula peso volumetrico, peso cobrable y costo estimado por kg con cajas estandar.
- Facilita un taller LogiChallenged con registro por mesa, galeria y votacion de empaques.
- Permite describir producto, cliente, mercado y etapa del negocio.
- Explica por qué importa cada pregunta.
- Guarda avance y datos localmente en `localStorage`.
- Genera una lectura personalizada con OpenAI desde `api/analyze` y conserva fallback local.
- Permite enviar el resumen por correo con Resend desde `api/send-summary`.
- Permite enviar el kit de mensajes con Resend desde `api/send-store-messages`.
- Permite enviar el kit de logistica con Resend desde `api/send-logistics-messages`.
- Permite copiar, descargar o imprimir el resumen.

## Variables de entorno

Revisa `.env.example`.

Variables esperadas:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `REPORT_RECIPIENTS`
- `APP_BASE_URL`

Nota:

- El codigo acepta el modelo por `OPENAI_MODEL`, pero si ese nombre no existe en la API hace fallback a `gpt-5.4`.

## Vercel

Este proyecto esta preparado para desplegarse como sitio estatico en Vercel.

Rutas publicas:

- `/diagnostico`
- `/ficha-producto`
- `/mensajes`
- `/logistica`
- `/peso-volumetrico`
- `/logichallenged`

Archivos relevantes:

- `vercel.json` fuerza el preset `Other`.
- `vercel.json` reescribe las rutas internas hacia `index.html` para que puedan recargarse o compartirse.
- La app vive en la raiz del repo y no requiere build para desplegarse.

Configuracion recomendada en Vercel:

- Framework Preset: `Other`
- Build Command: vacio
- Output Directory: vacio

La integracion ya vive en `api/`. Para que funcione en deploy, las variables de entorno deben existir en Vercel.

## Lo que falta para la siguiente fase

- Captura de leads en backend.
- Panel o log interno para consultar diagnosticos enviados.
- Persistencia compartida entre dispositivos.
- Afinar prompts, guardrails y trazabilidad del analisis de IA.
