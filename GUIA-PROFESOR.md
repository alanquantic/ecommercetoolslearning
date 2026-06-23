# Guía del profesor · Ruta E-commerce

Documento de bolsillo para llevar tu clase con las 8 herramientas. Pensado para
diplomado de e-commerce, sesión de logística, ~80 alumnos en aula con escritorio
o móvil.

URL pública: <https://ecommercetoolslearning.vercel.app>

---

## Plan de sesión completa (3 horas)

| Bloque | Minutos | Herramienta | Objetivo del alumno |
|---|---|---|---|
| 1. Apertura | 15 min | **LogiBingo** | Romper el hielo, compartir anécdotas reales de errores logísticos. |
| 2. Decisión estratégica | 20 min | **Diagnóstico de ruta** | Decidir tienda propia vs marketplace vs híbrido para su proyecto. |
| 3. Operación de tienda | 30 min | **Ficha de producto** + **Mensajes de tienda** | Generar página de producto y kit de mensajes con IA. |
| 4. Logística operativa | 25 min | **Logística clara** + **Peso volumétrico** | Mensajes de envío y simulación de caja. |
| 5. Examen LogiMatch | 25 min | **LogiMatch** | Cada alumno empareja productos con paquetería o servicios con canal de entrega y descarga evidencia. |
| 6. Auditoría individual | 30 min | **LogiCoach** | Plan logístico personal, entrega Markdown al LMS. |
| 7. Cierre | 15 min | Discusión con anécdotas recibidas | Lectura grupal de 3-4 anécdotas anónimas de LogiBingo. |

---

## Antes de empezar la sesión

**Configura las variables de entorno en Vercel** si quieres modo IA real:

- `OPENAI_API_KEY` — para Diagnóstico, Ficha, Mensajes y Logística clara.
- `RESEND_API_KEY` — para envío de correos (resúmenes, anécdotas anónimas).
- `REPORT_RECIPIENTS` — tu correo (y el de tus colegas, separado por coma).

Si falta alguna, la app cae a "modo demostración" automáticamente. El alumno
ve un badge amber. **Útil para clase**, pero los correos no llegan.

**Prueba antes de clase:**

1. Abre la app, ve a la home, deja el panel "Plan de sesión" abierto al
   proyectar.
2. Pasa por LogiBingo y completa una línea para asegurarte de que el modal de
   anécdota se abre y enviar funciona (te debe llegar correo si Resend está
   configurado).
3. Verifica el badge "IA en vivo" en Diagnóstico al generar un análisis.

---

## Herramienta 1 · LogiBingo · "Lotería del e-commerce"

**URL:** `/logibingo` · **Tiempo:** 12-15 min · **Tab:** Dinámica en clase

### Qué es

Tablero 4×4 con 16 horrores logísticos clásicos. **Funciona como lotería
mexicana**: el alumno marca cada carta que **ya le tocó vivir como cliente**
comprando en tiendas en línea. Cuando completa una línea (fila, columna o
diagonal) se abre un modal pidiendo que cuente, **de forma anónima**, esa
experiencia. La anécdota llega a tu correo.

> El enfoque es **como cliente**, no como vendedor. Es más fácil para los
> alumnos (todos han comprado online, no todos han vendido), genera más
> material y quita el peso de auto-juzgarse.

### Cómo presentarlo (script sugerido)

> "Vamos a empezar con algo divertido. Esto es una lotería — como la mexicana,
> pero de **horrores de e-commerce**. Abren LogiBingo. Verán 16 cartas con
> errores comunes. **Marquen cada carta que YA les tocó vivir como cliente**
> comprando online. No es examen, es memoria colectiva. Cuando junten 4 en
> línea, **gritan ¡lotería!** y cuentan esa peor experiencia. Llega anónima a
> mí, sin nombre. Vamos a leer las más jugosas al final."

### Lo que vas a ver tú

- En tu bandeja de entrada (Resend → tu correo): un email por cada anécdota
  enviada. Asunto: `LogiBingo · carta cantada: [error]`.
- Cada correo trae la carta que se cantó, cuántas marcó el alumno (de 16) y
  su índice de horrores (verde/ámbar/rojo).

### Qué hacer al final de la clase

Lee en voz alta 3-4 anécdotas que te parezcan más jugosas. Pregunta:
**"¿Cuando te pase a ti como vendedor, qué vas a hacer distinto?"**. Ahí
está la conexión pedagógica clave — pasar de cliente sufrido a vendedor
consciente.

### Cartas que más se marcan típicamente

- "Vender producto agotado" — clásico: el cliente paga y le cancelan.
- "Promesa 'te llega rápido' sin fecha" — viral en redes.
- "Cliente molesto sin respuesta" — el silencio post-venta.
- "No compartir guía al cliente" — la guía existe pero nunca llegó.

### Índice de horrores presenciados (lo que ven los alumnos)

- 🟢 0-3 cartas: **Cliente afortunado** — pocos sustos en su historial.
- 🟡 4-8 cartas: **Has vivido los clásicos del e-commerce** — sabes lo que NO repetir.
- 🔴 9+ cartas: **Coleccionista de horrores logísticos** — el alumno con más
  contexto del salón.

> Tip: pide a un alumno con tablero rojo que cuente en voz alta. Tiene más
> historias que el resto y le da naturalidad a la dinámica.

---

## Herramienta 2 · Diagnóstico de ruta

**URL:** `/diagnostico` · **Tiempo:** 15-20 min · **Tab:** Antes de operar

### Qué es

Quiz de 5 preguntas + contexto del proyecto. Recomienda tienda propia,
marketplace o modelo híbrido. Genera análisis con IA (OpenAI) y envía un
resumen por correo al alumno.

### Cómo presentarlo

> "Antes de invertir en una plataforma, hay que decidir el modelo. Esta
> herramienta te pregunta 5 cosas sobre tu negocio y te da una recomendación
> con argumentos. Pongan datos reales de su proyecto, no inventen — el análisis
> se vuelve mucho más útil."

### Campos del intake (lo que pide)

- **Nombre y proyecto**: identifica al alumno.
- **Correo**: aquí llega el resumen.
- **Descripción del producto, cliente y modelo de negocio**: alimenta a la IA.
- **Ticket promedio**: ayuda a calibrar la recomendación.
- **Canal de ventas y mercado primario**: contexto operativo.

### Lo que el alumno recibe por correo

Un email con:
- La ruta recomendada y por qué.
- Por qué esa ruta encaja con su perfil.
- Primer experimento sugerido.
- Métricas a medir.

Tú recibes copia con el contexto completo para conversar uno a uno si quieres.

### Cómo interpretar resultados

- **Tienda propia**: alumno con marca, comunidad y capital.
- **Marketplace**: alumno con producto comparable o sin tracción.
- **Híbrido**: alumno con catálogo mixto.

Si la **afinidad es <70%**, el sistema lo marca como "perfil mixto" — buen
punto para conversar en clase sobre orquestación de canales.

---

## Herramienta 3 · Ficha de producto

**URL:** `/ficha-producto` · **Tiempo:** 15 min · **Tab:** Operación de la tienda

### Qué es

Genera un wireframe de página de producto a partir de la descripción del
alumno: hero, fotos sugeridas, prueba social, FAQs, métricas a medir.

### Cómo presentarlo

> "Esta no es de logística, es de página de producto. Si su producto está en su
> propia tienda, esto les da una guía visual de cómo armar la ficha que más
> convierte. Describe tu producto en una sola frase clara."

### Pista útil

- Si describe el producto en menos de 20 palabras, el wireframe sale genérico.
- Si pone "Pasteles artesanales con frutas locales para regalo en Aguascalientes"
  → el wireframe se vuelve específico.

### Qué entrega

- Texto sugerido para hero y subtítulo.
- 4 fotos clave con descripción de qué debe mostrar cada una.
- 3 beneficios principales.
- 5 preguntas frecuentes sugeridas.
- Descargable como `.txt` para llevárselo.

---

## Herramienta 4 · Mensajes de tienda

**URL:** `/mensajes` · **Tiempo:** 15 min · **Tab:** Operación de la tienda

### Qué es

Genera 10 mensajes operativos listos para copiar a WhatsApp/email: bienvenida,
producto, precio, pedido, pago, envío, retraso, entrega, postventa, devolución.

### Cómo presentarlo

> "Estos son los mensajes que TODA tienda en línea necesita. Ya escritos con tu
> tono, tu producto, tu canal. Después los copias y los pegas en tu WhatsApp
> Business o en tu correo automático."

### Campos que pide (ayuda al alumno con estos)

- **Tono**: cercano-amable / profesional-claro / juvenil-divertido /
  experto-confiable. **Tip:** que elijan el que más se parezca a cómo hablan en
  sus stories.
- **Canal de ventas**: WhatsApp, Instagram, Shopify, etc. (cambia el tono y la
  longitud).
- **Tipo de envío**: paquetería nacional, mensajería local, digital. (cambia
  los mensajes de envío y retraso).

### Diferencia clave con "Logística clara"

- **Mensajes de tienda** = 10 mensajes para todo el ciclo de venta y postventa.
- **Logística clara** = enfocado solo en comunicación de envío (entrega,
  guía, retraso, daño, devolución).

Si el alumno va a mandar el kit completo por WhatsApp, usa Mensajes. Si va a
revisar específicamente cómo comunicar el envío, usa Logística clara.

---

## Herramienta 5 · Logística clara

**URL:** `/logistica` · **Tiempo:** 10 min · **Tab:** Operación de la tienda

### Qué es

Variante especializada de Mensajes. Pide datos de logística específicos
(preparación, costo de envío, paqueterías, política de daños) y genera 5
mensajes logísticos + ejemplos "débil vs claro".

### El check-list de errores

> "Aquí van a ver una lista de errores logísticos. **Marca los que sí cometes
> actualmente** — no los que quieres corregir. La IA va a tomar eso para
> hacerte mensajes que prevengan precisamente esos errores."

### Lo que entrega

5 mensajes:

1. Respuesta a pregunta de entrega.
2. Confirmación de pedido.
3. Aviso de envío o entrega.
4. Comunicación de retraso.
5. Protocolo de daño o problema.

Cada mensaje viene en versión "débil" vs "clara" para que el alumno vea el
contraste.

---

## Herramienta 6 · Peso volumétrico

**URL:** `/peso-volumetrico` · **Tiempo:** 10-15 min · **Tab:** Operación

### Qué es

Calculadora interactiva: dimensiones de caja + peso real → peso volumétrico,
peso cobrable, riesgo de cobro inflado, costo estimado.

### Cómo presentarlo (demo en vivo)

> "Activen el preset **Caja grande ligera**. Miren: el peso real es 0.8 kg pero
> el peso cobrable es 6 kg. **Están pagando 7 veces más por aire**. Ahora pulsen
> 'Generar sugerencia compacta' y vean cuánto bajaría si reducen la caja
> un 10%."

### Conceptos que explicar al inicio

- **Peso real**: lo que pesa en báscula.
- **Peso volumétrico**: (L × A × H) ÷ factor.
- **Factor**: divisor que define la paquetería. 5000 = terrestre nacional
  (Estafeta, FedEx terrestre). 6000 = aéreo o internacional (DHL Express).
  4000 = más estricto.
- **Peso cobrable**: el mayor de los dos.

### Lo que vas a ver

Cada alumno tiene su simulador. El riesgo se etiqueta visualmente:

- 🟢 Bajo: peso real domina.
- 🟡 Medio: volumétrico gana por poco.
- 🔴 Alto: volumétrico es 5× o más que el real. **Está pagando aire en
  serio**.

---

## Herramienta 7 · LogiMatch · examen individual

**URL:** `/logimatch` · **Tiempo:** 20-30 min · **Tab:** Dinámica en clase /
asincrónica

### Qué es

**Examen interactivo individual.** Cada alumno con la URL elige un modo y hace
los **6 pares** correspondientes. Recibe una calificación 0-100. Hay dos modos:

- **Productos físicos**: MiPyME → paquetería.
- **Servicios online**: servicio → canal de entrega.

Hay dos tabs:

1. **Catálogo de fichas**: 6 paqueterías (Estafeta, FedEx, DHL, 99 Minutos,
   Uber Direct, Cadete Local) + 6 perfiles de MiPyME (Pastelería, Joyería,
   Ropa, Electrónicos, Cosmética, Alimentos). Cada uno con todos sus datos
   técnicos. Material de estudio.
2. En modo servicios, el catálogo cambia a 6 canales de entrega (WhatsApp
   Business, Calendly + Meet, Zoom Webinar, LMS/Hotmart, Drive + Notion,
   Helpdesk/CRM) + 6 casos de servicio online.
3. **Hacer el examen**: el alumno escribe su nombre, asigna una opción a cada
   uno de los 6 perfiles (dropdowns), pulsa "Calificar mis 6 pares" y recibe
   score global + detalle por par + evidencia descargable.

### Cómo correrlo en clase

> "Abran LogiMatch. Primero vayan al **catálogo de fichas** para entender cada
> perfil y cada opción de entrega. Si están resolviendo producto físico,
> piensen en paquetería; si están resolviendo servicio online, piensen en
> agenda, acceso, entregables y soporte. Después, en la pestaña **Hacer el
> examen**, escriben su nombre, asignan la mejor opción, califican y descargan
> la evidencia que van a subir al LMS."

### Cómo correrlo asincrónico

Manda el link directo: `<https://ecommercetoolslearning.vercel.app/logimatch>`
y un instructivo en el LMS. El alumno entra, resuelve, descarga su evidencia
y la sube. No depende de horario.

### Calificación que el sistema entrega

| Score | Nivel | Significado |
|---|---|---|
| 90-100% | **Excelente** | Dominas la lógica de canales por perfil. |
| 75-89% | **Bueno** | Panorama claro, afinación fina en algunos perfiles. |
| 60-74% | **Regular** | Identificas lo básico; revisa las fichas. |
| <60% | **Necesita reforzar** | Varios perfiles mal pareados. |

### Pares perfectos esperados (matriz)

| MiPyME | Paquetería(s) óptima(s) | Score |
|---|---|---|
| Pastelería "Dulce Agua" | Uber Direct **o** Cadete Local | 100% |
| Joyería "Luz de Plata" | FedEx **o** DHL | 100% |
| Ropa "Oficina + Casual" | Estafeta | 100% |
| Electrónicos "Gadgetzac" | 99 Minutos **o** FedEx | 100% |
| Cosmética "Agave Bello" | Estafeta **o** 99 Minutos | 95% |
| Alimentos "Despensa Seca" | Estafeta | 100% |

### Pares perfectos para servicios online

| Servicio | Canal óptimo | Score |
|---|---|---|
| Consultoría "Estrategia 1:1" | Calendly + Google Meet | 100% |
| Curso "Excel para Emprender" | LMS / Hotmart / Classroom | 100% |
| Estudio "Marca Clara" | Drive + Notion | 100% |
| Taller "Ventas en Vivo" | Zoom Webinar / Meet grupal | 100% |
| Soporte "Tienda Sin Caos" | Helpdesk / CRM por correo | 100% |
| Coaching "Nutrición Práctica" | Calendly + Google Meet | 100% |

### El error trampa

**Pastelería + FedEx/DHL/Estafeta = 20%** con alerta de fracaso:

> "🚨 ¡Fracaso total! El pastel pasó 3 días en tránsito terrestre, se derritió
> y llegó destruido."

Si un alumno saca <60%, es señal de que pareó la pastelería con paquetería
terrestre. Buen punto para discutir en clase.

### La evidencia descargable

Al pulsar "💾 Descargar evidencia para el LMS" descarga un `.txt` con:

- Nombre del alumno.
- Calificación final (0-100%) y nivel.
- Pares perfectos (>=95%) acertados.
- Pares aceptables (>=80%) acertados.
- **Detalle de cada uno de los 6 pares**: MiPyME/servicio, paquetería o canal asignado,
  score del par, feedback de la consultoría.
- Fecha y hora.

El nombre del archivo es `logimatch-{nombre-alumno}-{score}pct.txt`. **Para
los 80 alumnos, llegan archivos con el mismo formato y nombre estándar**.
Puedes abrirlos en bulk y calificarlos en minutos.

### Tarea sugerida

> "Suban su evidencia al LMS junto con una reflexión de 100 palabras: ¿qué
> par les costó más? ¿Qué cambiarías si tuvieras que volver a empezar?"

---

## Herramienta 8 · LogiCoach

**URL:** `/logicoach` · **Tiempo:** 25-30 min · **Tab:** Diagnóstico operativo

### Qué es

Wizard de 12 preguntas dividido en 4 pasos (3 preguntas cada uno). Audita el
plan logístico personal del alumno y genera:

- **Score de madurez (0-100)**.
- **Nivel**: Inicial (<40), En Desarrollo (40-69), Optimizado (70+).
- **Hasta 3 alertas críticas** con keyword matching.
- **Formato Markdown listo para LMS**.

Antes de responder, el alumno elige el tipo de oferta:

- **Producto físico**: inventario, empaque, paquetería y distribución.
- **Servicio online**: agenda, canal, acceso, entregables, no-shows y soporte.
- **Modelo mixto**: combina producto, servicio o entregables digitales.

### Cómo presentarlo

> "Esta es la herramienta de cierre. Voy a darles 25 minutos para responder
> 12 preguntas sobre cómo cumplen su promesa al cliente: si venden producto,
> piensen en inventario, empaque y envío; si venden servicio, piensen en agenda,
> acceso, entregables y seguimiento. **Sean honestos** — el sistema
> detecta respuestas vagas y baja la calificación. Cuando terminen, pulsan
> 'Copiar formato' y pegan en el LMS lo que les sale."

### Las 12 preguntas para producto físico

**Paso 1 · Canales y registro**

1. ¿Por dónde recibo pedidos?
2. ¿Dónde los registro?
3. ¿Qué datos pido siempre antes de aceptar un pedido?

**Paso 2 · Transacciones y stock**

4. ¿Cómo confirmo el pago antes de procesar?
5. ¿Cómo controlo el inventario?
6. ¿Quién prepara el pedido físicamente?

**Paso 3 · Empaque y logística de envío**

7. ¿Qué checklist o revisión uso antes de cerrar el paquete?
8. ¿Cuál es mi opción principal de envío?
9. ¿Cuál es mi opción alternativa?

**Paso 4 · Promesas y control**

10. ¿Cuál es el tiempo de preparación que prometo?
11. ¿Qué haré si hay retraso o problema?
12. ¿Qué indicador mediré cada semana?

### Las píldoras de respuesta rápida

Cada pregunta tiene 3-4 píldoras con respuestas comunes (WhatsApp, Excel,
FedEx, "A ojo", etc.). El alumno puede pulsar y la respuesta se inyecta en el
textarea. **Acelera muchísimo el llenado.**

### Las 3 alertas que dispara el sistema

1. **⚠️ Riesgo de cuello de botella** — si en Q1/Q2 detecta "WhatsApp",
   "Instagram" o "Libreta".
2. **🚨 Peligro de quiebre de stock** — si en Q5 detecta "A ojo", "Memoria"
   o "No controlo".
3. **⚠️ Vulnerabilidad en distribución** — si Q8 y Q9 mencionan la misma
   paquetería o Q9 está vacío.

En modo **Servicio online**, las preguntas equivalentes cambian el lenguaje:

- "Inventario" se convierte en **capacidad, agenda o cupos disponibles**.
- "Quién prepara el pedido" se convierte en **quién entrega el servicio y por qué canal**.
- "Empaque y logística de envío" se convierte en **entrega del servicio**.
- "Paquetería principal/alternativa" se convierte en **canal principal/alternativo de entrega**.
- "Problema con paquetería" se convierte en **retraso, no-show o falla técnica**.

Las alertas también se adaptan:

1. **⚠️ Riesgo de cuello de botella** — si todo vive en WhatsApp, Instagram o libreta.
2. **🚨 Peligro de sobreventa de agenda** — si no controla cupos, calendario o capacidad.
3. **⚠️ Vulnerabilidad de canal de entrega** — si no tiene canal alternativo a Zoom/Meet/WhatsApp/correo.

### Cómo se calcula el score

El motor mide **presencia de conceptos clave** (no solo longitud):

- Q1 espera: canal + diferenciación principal/alterno.
- Q5 espera: herramienta + frecuencia. Penaliza "a ojo".
- Q10 espera: número de horas/días. Penaliza "rápido" sin tiempo.

Si un alumno pega lorem ipsum largo → 30 puntos (no 100). El scoring
distingue calidad de contenido.

### El botón crítico de evaluación masiva

**"📋 Copiar formato de entrega estándar"** copia al portapapeles un Markdown
con:

- Score y nivel.
- Alertas activas.
- Las 12 preguntas con sus respuestas.

**Los 80 alumnos pegan EXACTAMENTE el mismo formato** en el LMS. Tú abres y
revisas en bloque sin tener que descifrar formatos personales.

### Cómo calificar

Sugerencia de rúbrica rápida:

- **Score 70+ con 0 alertas**: 10/10. Plan operativo sólido.
- **Score 70+ con alertas**: 9/10. Plan profundo pero con áreas críticas.
- **Score 40-69**: 7-8/10. Bases pero falta detalle.
- **Score <40**: 5-6/10. Falta llenar o respuestas vagas. Pide reentrega.

---

## Modo demostración vs IA en vivo

Las 4 herramientas con IA muestran un badge:

- 🟢 **IA en vivo**: OpenAI respondió. Análisis personalizado.
- 🟡 **Modo demostración**: la app usó su mock local. Sigue siendo útil
  pedagógicamente pero menos específico.

**Si proyectas para clase y ves badge amber:** revisa que `OPENAI_API_KEY`
esté configurada en Vercel y que el modelo definido en `OPENAI_MODEL` exista.

---

## Errores comunes que vas a ver y cómo manejarlos

### "No me llegó el correo del resumen"

1. Verifica que el alumno haya escrito bien su correo.
2. Verifica que `RESEND_API_KEY` esté en Vercel.
3. Que el dominio `updates.ceoslogica.com` esté verificado en Resend.

### "Mi tablero LogiBingo se ve diferente al de mi compañero"

Es **a propósito**: cada alumno recibe un orden aleatorio (Fisher-Yates).
Evita que copien.

### "El modal de anécdota ya no se abre"

Solo abre en líneas **nuevas**. Si el alumno ya envió anécdota por una línea,
necesita completar otra línea distinta para que vuelva a abrir.

### "Mi LogiMatch dice 20% pero yo elegí bien"

Es la dinámica: hay matches buenos (>80%), aceptables (50-79%) y trampa
(<50%). Si saca 20%, **es lección, no error técnico**. Discútelo en mesa.

---

## Tarea de cierre sugerida

> "Cada quien entrega tres cosas al LMS:
>
> 1. La evidencia `.txt` de LogiMatch (mejor combinación que encontraron).
> 2. El Markdown de LogiCoach con su plan personal.
> 3. Una reflexión de 200 palabras: ¿cuál de las 3 alertas de LogiCoach me
>    salió y qué voy a hacer en los próximos 30 días para resolverla?"

Eso te da 3 entregables comparables por alumno × 80 alumnos = 240 documentos
que abres y calificas con los criterios de arriba.

---

## Lo que falta y podría agregarse

- Dashboard del profesor con todas las entregas centralizadas (hoy llegan por
  correo).
- Persistencia en base de datos (hoy es localStorage del navegador).
- Modo "kiosco" para proyección en aula.

Si necesitas alguna de estas, abre un issue en el repo o pídeselo a tu
desarrollador de cabecera.
