# ✈️ DS GeoWorld

Plataforma web inteligente de planificación de viajes desarrollada con HTML5, CSS3 y JavaScript Vanilla como proyecto final del curso de Diseño Web.

---

## 🌐 LINK GitHub



---

## 👥 Integrantes

(diego isaias rodriguez suarez)(diego_rodriguez4489@americana.edu.co)

(Santiago jose alvear bolaño)(santiago_alvear8569@americana.edu.co)

---

## 📋 Descripción General

DS GeoWorld centraliza toda la información necesaria para planificar un viaje internacional en una sola interfaz: datos del país, clima actual, conversión de moneda y atracciones turísticas. El usuario puede guardar favoritos, consultar su historial y personalizar su experiencia.

### Funcionalidades implementadas

- 🔍 Buscador de países en tiempo real
- 🌍 Información completa del país (REST Countries API)
- 🌤️ Clima actual del destino (Open-Meteo API)
- 💱 Conversor de monedas COP / USD / EUR / GBP (Frankfurter API)
- 📍 Atracciones turísticas con categoría y descripción (OpenTripMap API)
- ♥ Favoritos de países y atracciones (LocalStorage)
- 🕐 Historial de búsquedas con fecha y hora (LocalStorage)
- 👤 Registro y bienvenida personalizada (LocalStorage)
- 📊 Dashboard con estadísticas del usuario
- 🌙 Modo oscuro persistente (LocalStorage)
- 📱 Diseño responsive para móvil, tablet y escritorio

---

## 🔌 APIs Utilizadas

| API | Uso |
|-----|-----|
| [REST Countries](https://restcountries.com) | Nombre, bandera, capital, región, población, moneda, idioma |
| [Open-Meteo](https://open-meteo.com) | Temperatura, humedad, viento, condición climática usando coordenadas del país |
| [Frankfurter](https://www.frankfurter.app) | Conversión en tiempo real entre COP, USD, EUR y GBP |
| [OpenTripMap](https://opentripmap.io) | Atracciones turísticas cercanas a la capital del país consultado |

---

## 🗂️ Arquitectura del Proyecto

```
TravelPlannerPro/
├── index.html          # Estructura principal, secciones y modal de registro
├── css/
│   └── styles.css      # Estilos, variables CSS, responsive, modo oscuro
├── js/
│   ├── app.js          # Controlador principal, eventos, navegación
│   ├── countries.js    # Consumo REST Countries API, renderizado de tarjeta
│   ├── weather.js      # Consumo Open-Meteo API, renderizado clima
│   ├── currency.js     # Consumo Frankfurter API, renderizado conversión
│   ├── tourism.js      # Consumo OpenTripMap API, renderizado atracciones
│   └── storage.js      # Toda la lógica de LocalStorage (usuario, favoritos, historial)
└── README.md
```

### Descripción de módulos JS

- **app.js** — Orquesta la aplicación. Maneja búsqueda, navegación entre secciones, modo oscuro, loader, notificaciones y coordinación entre módulos.
- **countries.js** — Consulta la REST Countries API y genera el HTML de la tarjeta del país.
- **weather.js** — Usa las coordenadas del país para consultar Open-Meteo y renderiza el clima actual.
- **currency.js** — Conecta con Frankfurter API para convertir montos entre divisas.
- **tourism.js** — Obtiene atracciones de OpenTripMap por radio geográfico y renderiza cada tarjeta.
- **storage.js** — Abstrae todo el manejo de LocalStorage: usuario, favoritos (países y atracciones), historial y preferencia de tema.

---

## 🚀 Cómo ejecutar el proyecto

### Opción 1 — Abrir directamente (más sencillo)

1. Descarga o clona este repositorio
2. Abre la carpeta del proyecto
3. Haz doble clic en `index.html`
4. Se abre en tu navegador por defecto — no requiere servidor ni instalación

### Opción 2 — Con servidor local (recomendado para evitar problemas CORS en algunos navegadores)

```bash
# Con Python
python -m http.server 5500

# O con Node.js (npx)
npx serve .
```

Luego abre `http://localhost:5500` en tu navegador.

### Primera vez

Al abrir la aplicación aparecerá un modal de registro. Completa tu nombre, correo y país de residencia. Esta información se guarda en LocalStorage y no se envía a ningún servidor.

---

## 💾 Datos en LocalStorage

| Clave | Contenido |
|-------|-----------|
| `tpp_user` | Nombre, correo y país del usuario |
| `tpp_fav_countries` | Array de países favoritos |
| `tpp_fav_attractions` | Array de atracciones favoritas |
| `tpp_history` | Historial de búsquedas con fecha y hora |
| `tpp_dark_mode` | Preferencia de tema (`true` / `false`) |

---

## 🛠️ Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables, grid, flexbox, animaciones, media queries)
- JavaScript ES6+ (módulos IIFE, async/await, Fetch API, destructuring)
- LocalStorage API
- Google Fonts (Playfair Display + DM Sans)

---

## 📌 Notas

No se utilizaron frameworks (React, Angular, Vue, etc.)
Algunas APIs de atracciones presentaron fallos, por lo que se utilizaron alternativas gratuitas
La búsqueda de países debe realizarse en inglés