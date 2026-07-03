# Devmon v1 — Mapa de riesgos

**Fase:** 0.5 (documentación)  
**Fuente:** `01-devmon-v1-theme-audit.md` + verificación de repositorio

Para cada riesgo: descripción, impacto, archivos relacionados, fase futura recomendada, y si debe abordarse en **Fase 1** (neutralización de contenido de marca).

---

## R-01 — Dos stacks JS/CSS

| Campo | Detalle |
|-------|---------|
| **Descripción** | Coexisten el stack Heritage (ES modules + `base.css` + variables de settings) y el stack Wagon (jQuery, Bootstrap, GSAP, Lenis, Splide, `wagon.css/js`) cargados globalmente en cada página. |
| **Impacto** | Conflictos de scroll (Lenis vs nativo), peso de bundle, dificultad de debug, dos patrones de código para el mismo DOM, mayor superficie de regresión en actualizaciones. |
| **Archivos** | `layout/theme.liquid`, `snippets/scripts.liquid`, `snippets/stylesheets.liquid`, `assets/wagon.js`, `assets/wagon.css`, `assets/base.css`, todos los `assets/*.js` Heritage |
| **Fase recomendada** | **Fase 5** (refactor JS/CSS); análisis en **Fase 3** |
| **¿Tocar en Fase 1?** | **No** — Fase 1 solo neutraliza contenido; no reestructura stacks |

---

## R-02 — CDN externos globales

| Campo | Detalle |
|-------|---------|
| **Descripción** | El layout carga desde CDN: Bootstrap 5.3.3, Bootstrap Icons, Splide 4.1.4, Splitting 1.0.6, jQuery 3.6.0, GSAP 3.12.5, Lenis 1.0.44, Adobe Typekit, Google Fonts. Envuelto en `theme-check-disable RemoteAsset`. |
| **Impacto** | Dependencia de disponibilidad de terceros, CSP, GDPR/privacidad, render-blocking, imposible reproducir build offline, versiones no fijadas por lockfile (excepto URL). |
| **Archivos** | `layout/theme.liquid` (líneas ~37–104) |
| **Fase recomendada** | **Fase 3** (assets y dependencias) |
| **¿Tocar en Fase 1?** | **No** |

---

## R-03 — Fuentes externas múltiples

| Campo | Detalle |
|-------|---------|
| **Descripción** | Cuatro fuentes de tipografía en paralelo: (1) Shopify font picker → `instrument_sans` en settings, (2) Turnkey Condensed en `fonts.css`, (3) Adobe Typekit `stevie-sans` / `obviously-narrow`, (4) Google Inter/Inter Tight. Las visuales reales no coinciden con `settings_data`. |
| **Impacto** | Theme editor muestra tipografía distinta al storefront; FOUT/FOIT; licencias Typekit atadas a kit `ldm7ibv`; imposible clonar theme sin reconfigurar fuentes. |
| **Archivos** | `layout/theme.liquid`, `assets/fonts.css`, `assets/master.css`, `assets/wagon.css`, `config/settings_data.json`, `snippets/theme-styles-variables.liquid`, `snippets/fonts.liquid` |
| **Fase recomendada** | **Fase 3** (self-host / consolidar) + **Fase 4** (tokens) |
| **¿Tocar en Fase 1?** | **Parcial** — resetear font settings en `settings_data.json` a defaults genéricos **sí**; eliminar Typekit **no** (Fase 3) |

---

## R-04 — Assets de otra tienda (CDN Shopify)

| Campo | Detalle |
|-------|---------|
| **Descripción** | URLs hardcodeadas a la tienda `0658/2445/6946` para fuentes Turnkey, decoración de menú/footer, icono filtro, imagen collection-all, detalle PDP. |
| **Impacto** | En otra tienda: imágenes/fuentes rotas (404), fuga de dependencia al proyecto anterior, posible incumplimiento de licencia de fuentes. |
| **Archivos** | `assets/fonts.css`, `sections/header.liquid`, `sections/foot.liquid`, `sections/main-collection.liquid`, `sections/product-i.liquid`, `snippets/header-drawer.liquid`, `snippets/sorting.liquid` |
| **Fase recomendada** | **Fase 3** (migrar a `/assets` o `image_picker`) |
| **¿Tocar en Fase 1?** | **No** — requiere assets nuevos; Fase 1 solo templates/settings textuales |

---

## R-05 — `linklists.navbar` hardcodeado

| Campo | Detalle |
|-------|---------|
| **Descripción** | `header.liquid` asigna `{% assign navbar_menu = linklists.navbar %}`. El handle `navbar` debe existir en la tienda; no es configurable desde schema. |
| **Impacto** | Tienda nueva sin ese menú → header vacío o roto; minishop Splide depende de ítem "shop" en ese menú. |
| **Archivos** | `sections/header.liquid` (~línea 414), `assets/wagon.js` (comportamiento menú) |
| **Fase recomendada** | **Fase 2** (configuración y hardcodes → `link_list` setting) |
| **¿Tocar en Fase 1?** | **No** |

---

## R-06 — Metafield `custom.main_picture`

| Campo | Detalle |
|-------|---------|
| **Descripción** | Product cards usan `product.metafields.custom.main_picture.value` como imagen alternativa y para clase `darker`. |
| **Impacto** | Sin definición del metafield en tienda nueva: comportamiento degradado (sin imagen alt, sin estilo darker); cards siguen funcionando con fallback parcial. |
| **Archivos** | `snippets/product-card.liquid`, `snippets/card-gallery.liquid`, `sections/favorites-i.liquid`, `sections/shopping-i.liquid` |
| **Fase recomendada** | **Fase 2** (documentar + setting opcional) o **Fase 4** |
| **¿Tocar en Fase 1?** | **No** — no eliminar lógica; documentar en handoff |

---

## R-07 — Header/footer groups ausentes o no versionados

| Campo | Detalle |
|-------|---------|
| **Descripción** | `layout/theme.liquid` usa `{% sections 'header-group' %}` y `{% sections 'footer-group' %}`, pero no hay `sections/header-group.json` ni `footer-group.json` en el repositorio. |
| **Impacto** | Deploy desde git puro puede no reproducir header/footer; onboarding imposible sin pull del admin; incertidumbre sobre `foot` vs `footer` Heritage. |
| **Archivos** | `layout/theme.liquid`, composición en Theme Editor (no en repo) |
| **Fase recomendada** | **Fase 1** (exportar y versionar groups) — **acción documental/técnica mínima** |
| **¿Tocar en Fase 1?** | **Sí** — exportar JSON de groups sin cambiar Liquid |

---

## R-08 — `settings_data.json` con identidad del cliente

| Campo | Detalle |
|-------|---------|
| **Descripción** | Logos `brand.svg`, paleta Chocolat Uzma en 9 color schemes, UUIDs custom, preset Heritage duplicado con colores de marca, fonts instrument_sans desalineadas. |
| **Impacto** | Clonar theme instala identidad del cliente anterior; merchant ve colores/logos incorrectos; schemes referenciados en `product.json`. |
| **Archivos** | `config/settings_data.json`, referencias en `templates/product.json` (`scheme-7115b6b1-...`) |
| **Fase recomendada** | **Fase 1** (reset a preset starter neutro) |
| **¿Tocar en Fase 1?** | **Sí** — con cuidado de no romper referencias scheme en templates |

---

## R-09 — `settings_schema` todavía como Heritage

| Campo | Detalle |
|-------|---------|
| **Descripción** | `theme_info.theme_name` = "Heritage", versión 3.5.1, autor Shopify. Sin branding Devmon Starter. |
| **Impacto** | Confusión en admin de Shopify; no refleja naturaleza del proyecto; actualizaciones Heritage no diferenciadas de custom. |
| **Archivos** | `config/settings_schema.json` (bloque `theme_info` únicamente) |
| **Fase recomendada** | **Fase 1** o **Fase 6** (release v1.0) |
| **¿Tocar en Fase 1?** | **Sí** — solo `theme_info` (nombre, versión starter); **no** reestructurar schema groups |

---

## R-10 — Sistemas de color duplicados

| Campo | Detalle |
|-------|---------|
| **Descripción** | Heritage: `color_schemes` → `--color-*-rgb` vía `color-schemes.liquid`. Wagon: `--color-chocolat`, `--color-ivory`, etc. en `master.css`. Uso mixto en CSS y SVG. |
| **Impacto** | Cambiar color en theme editor no afecta gran parte del UI Wagon; mantenimiento doble; starter no "themeable" de un solo lugar. |
| **Archivos** | `assets/master.css`, `assets/home.css`, `assets/wagon.css`, `snippets/color-schemes.liquid`, `config/settings_data.json`, múltiples sections `-i` |
| **Fase recomendada** | **Fase 4** (tokens visuales) |
| **¿Tocar en Fase 1?** | **No** |

---

## R-11 — Customer account oculto

| Campo | Detalle |
|-------|---------|
| **Descripción** | `wagon.css` aplica `.header__column .account-button { display: none; }`. |
| **Impacto** | Usuarios no acceden a cuenta desde header; puede ser intencional de marca pero rompe UX estándar Shopify; conflictos con Customer Accounts. |
| **Archivos** | `assets/wagon.css` (~líneas 60–62) |
| **Fase recomendada** | **Fase 2** o **Fase 5** (decisión de producto + CSS) |
| **¿Tocar en Fase 1?** | **No** |

---

## R-12 — Dependencia Bootstrap / jQuery / GSAP / Lenis / Splide / Splitting

| Campo | Detalle |
|-------|---------|
| **Descripción** | Wagon depende de estas libs para grid (`w-*`), collapse menú, carruseles (header minishop, PDP gallery), smooth scroll, animaciones de texto en header. |
| **Impacto** | Eliminar cualquiera sin migración rompe: menú mobile, PLP/PDP galleries, animaciones de entrada, layout de todas las secciones `-i`. |
| **Archivos** | `layout/theme.liquid`, `assets/wagon.js`, `sections/header.liquid`, `sections/product-i.liquid`, `sections/superhero.liquid`, todas las sections `-i` con clases Bootstrap |
| **Fase recomendada** | **Fase 5** (refactor); evaluación de necesidad en **Fase 3** |
| **¿Tocar en Fase 1?** | **No** |

---

## R-13 — Contenido demo en templates JSON

| Campo | Detalle |
|-------|---------|
| **Descripción** | `index.json`, `page.about.json`, `product.json` contienen copy, imágenes `shopify://shop_images/*`, colecciones `homepage`/`chocolate-bars`, mapa Chicago, políticas legales Chocolat Uzma. |
| **Impacto** | Starter no usable; exposición de marca cliente; referencias a recursos inexistentes en tienda nueva. |
| **Archivos** | `templates/index.json`, `templates/page.about.json`, `templates/product.json`, parcialmente otros templates |
| **Fase recomendada** | **Fase 1** |
| **¿Tocar en Fase 1?** | **Sí** — objetivo principal de Fase 1 |

---

## R-14 — Defaults de marca en schemas de sections

| Campo | Detalle |
|-------|---------|
| **Descripción** | Schemas con `default` específicos: superhero heading, foot email/copyright, about-ii/iii biografía, reviews-i quotes. |
| **Impacto** | Al añadir section en editor aparece contenido Chocolat Uzma aunque template esté limpio. |
| **Archivos** | `sections/superhero.liquid`, `sections/foot.liquid`, `sections/about-ii.liquid`, `sections/about-iii.liquid`, `sections/reviews-i.liquid`, `sections/getintouch.liquid` |
| **Fase recomendada** | **Fase 1** |
| **¿Tocar en Fase 1?** | **Sí** — neutralizar defaults (cambio de schema, no estructura) |

---

## R-15 — PDP híbrido `product-i` + blocks estáticos

| Campo | Detalle |
|-------|---------|
| **Descripción** | `product.json` usa section custom `product-i` con blocks Heritage estáticos (`variant-picker`, `buy-buttons`). Acordeones con HTML legal embebido en settings. |
| **Impacto** | Cambiar estructura de blocks rompe PDP; `product-information.liquid` Heritage queda sin uso; quick-order-list no montado. |
| **Archivos** | `templates/product.json`, `sections/product-i.liquid`, blocks `variant-picker`, `buy-buttons`, `accelerated-checkout` |
| **Fase recomendada** | **Fase 5** (evaluar convergencia con Heritage PDP) |
| **¿Tocar en Fase 1?** | **Parcial** — solo neutralizar textos en settings de `product.json`; **no** cambiar estructura blocks |

---

## R-16 — `product-information` Heritage sin uso

| Campo | Detalle |
|-------|---------|
| **Descripción** | La PDP oficial del theme es `product-i`; `product-information.liquid` (Heritage) no está en `product.json`. |
| **Impacto** | Duplicidad de patrones PDP; confusión para desarrolladores; features Heritage solo en PDP custom si no se portan. |
| **Archivos** | `sections/product-information.liquid`, `snippets/product-information-content.liquid` |
| **Fase recomendada** | **Fase 5** o decisión de producto en **Fase 4** |
| **¿Tocar en Fase 1?** | **No** |

---

## R-17 — Typo CSS potencial en wagon.css

| Campo | Detalle |
|-------|---------|
| **Descripción** | En `wagon.css` ~línea 37: `!i;!;` en regla `.menu-list` — posible sintaxis inválida. |
| **Impacto** | Regla ignorada por navegador; comportamiento de menú inconsistente. |
| **Archivos** | `assets/wagon.css` |
| **Fase recomendada** | **Fase 5** |
| **¿Tocar en Fase 1?** | **No** |

---

## Matriz resumen: Fase 1

| Riesgo | ID | ¿Fase 1? |
|--------|-----|----------|
| Dos stacks JS/CSS | R-01 | No |
| CDN externos | R-02 | No |
| Fuentes externas | R-03 | Parcial (settings only) |
| Assets otra tienda | R-04 | No |
| navbar hardcodeado | R-05 | No |
| main_picture metafield | R-06 | No |
| Section groups | R-07 | **Sí** (exportar) |
| settings_data identidad | R-08 | **Sí** |
| settings_schema Heritage | R-09 | **Sí** (theme_info) |
| Colores duplicados | R-10 | No |
| Account oculto | R-11 | No |
| Deps Bootstrap/GSAP/etc | R-12 | No |
| Templates demo | R-13 | **Sí** |
| Schema defaults marca | R-14 | **Sí** |
| PDP híbrido | R-15 | Parcial (textos) |
| product-information sin uso | R-16 | No |
| Typo wagon.css | R-17 | No |

---

*Mapa generado en Fase 0.5. Actualizar al resolver cada riesgo.*
