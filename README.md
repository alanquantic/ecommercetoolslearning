# Ruta E-commerce

Herramienta local para orientar a alumnos sobre la mejor ruta para lanzar un e-commerce.

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
- guarda capturas en `output/playwright/`.

## Lo que ya hace

- Diagnostica entre tienda propia, marketplace o modelo híbrido.
- Permite describir producto, cliente, mercado y etapa del negocio.
- Explica por qué importa cada pregunta.
- Guarda avance y datos localmente en `localStorage`.
- Genera una lectura personalizada con una capa de IA mock lista para conectar a backend.
- Permite copiar, descargar o imprimir el resumen.

## Vercel

Este proyecto esta preparado para desplegarse como sitio estatico en Vercel.

Archivos relevantes:

- `vercel.json` fuerza el preset `Other`.
- La app vive en la raiz del repo y no requiere build para desplegarse.

Configuracion recomendada en Vercel:

- Framework Preset: `Other`
- Build Command: vacio
- Output Directory: vacio

Si luego agregamos la integracion real con OpenAI, la idea es montar funciones en `api/` y guardar la API key en variables de entorno de Vercel.

## Lo que falta para la siguiente fase

- Envío real de correos.
- Captura de leads en backend.
- Sustituir el mock de IA por una ruta segura en Vercel.
- Persistencia compartida entre dispositivos.
- Preparación formal para despliegue en Vercel.
