# Devmon v1 — Inventario de sections

**Fase:** 0.5 (documentación)  
**Total sections:** 54 archivos en `sections/*.liquid`  
**Clasificación:** Heritage core · Heritage modificada · Wagon custom · Demo/internal · No referenciada

### Leyenda de tipos

| Tipo | Descripción |
|------|-------------|
| **Heritage core** | Section Shopify Heritage sin modificaciones sustanciales de markup/comportamiento |
| **Heritage modificada** | Heritage con integración Wagon (clases, CDN, menús, filtros) |
| **Wagon custom** | Section creada para el design system / marca |
| **Demo/internal** | Herramientas internas o showcase, no para producción starter |
| **No referenciada** | No aparece en templates JSON ni section groups versionados; solo presets o runtime |

### Leyenda de riesgo

| Riesgo | Criterio |
|--------|----------|
| **Bajo** | Aislada, poco acoplamiento, presets opcionales |
| **Medio** | Usada en flujos commerce o con dependencias JS/CSS moderadas |
| **Alto** | Global, híbrida Heritage+Wagon, o crítica para checkout/navegación |

---

## Tabla completa

| Archivo | Clasificación | Propósito | Riesgo | Notas |
|---------|---------------|-----------|--------|-------|
| `_blocks.liquid` | Heritage core | Section genérica de bloques (`@theme`, `@app`) | Bajo | Presets para págenes composables |
| `about-i.liquid` | Wagon custom | Hero/misión About (eyebrow, heading, imagen, ornamento) | Medio | `page.about.json`; defaults marca Uzma |
| `about-ii.liquid` | Wagon custom | Bloque fundador About | Medio | `page.about.json`; copy biográfico demo |
| `about-iii.liquid` | Wagon custom | Timeline con blocks `timeline_item` | Medio | `page.about.json`; años/copy demo |
| `carousel.liquid` | Heritage core | Carrusel de contenido composable | Bajo | Solo theme editor (presets) |
| `collection-links.liquid` | Heritage core | Enlaces a colecciones | Bajo | Presets |
| `collection-list.liquid` | Heritage core | Lista/grid de colecciones | Bajo | Presets |
| `collections-i.liquid` | Wagon custom | Grid colección estacional con fondo | Medio | `index.json`; colección demo hardcodeada |
| `custom-liquid.liquid` | Heritage core | Liquid libre del merchant | Bajo | Presets |
| `divider.liquid` | Heritage core | Separador visual | Bajo | Presets |
| `favorites-i.liquid` | Wagon custom | Grid productos destacados | Alto | `index.json`; usa `metafields.custom.main_picture` |
| `featured-blog-posts.liquid` | Heritage core | Posts de blog destacados | Bajo | Presets |
| `featured-product.liquid` | Heritage core | Producto destacado composable | Medio | Presets; JS variant-picker aware |
| `featured-product-information.liquid` | Heritage core | PDP featured con carousel | Medio | Presets; no en `product.json` actual |
| `foot.liquid` | Wagon custom | Footer marca (newsletter, menús, redes, decoración CDN) | Alto | **Pendiente:** footer-group no versionado; reemplaza `footer` Heritage |
| `footer.liquid` | Heritage core | Footer composable por blocks | Medio | Puede coexistir con `foot`; grid de blocks Heritage |
| `footer-utilities.liquid` | Heritage core | Barra inferior (copyright, policies) | Bajo | Max 3 blocks; presets |
| `getintouch.liquid` | Wagon custom | Formulario contacto `{% form 'contact' %}` | Medio | `index.json`; clases `field-wagon` |
| `header.liquid` | Heritage modificada | Header global: menú, minishop Splide, bigmenu Bootstrap | **Alto** | `linklists.navbar` hardcodeado; CDN decoración; ~2.1k líneas |
| `header-announcements.liquid` | Heritage core | Barra de anuncios | Medio | Típicamente en header-group |
| `hero.liquid` | Heritage core | Hero composable Heritage | Bajo | Presets; no en templates actuales |
| `layered-slideshow.liquid` | Heritage core | Slideshow en capas | Bajo | Presets |
| `logo.liquid` | Heritage core | Section logo standalone | Bajo | Presets; block `logo` en password |
| `main-404.liquid` | Heritage core | Página 404 | Medio | `404.json` + product-list |
| `main-blog.liquid` | Heritage core | Listado de blog | Medio | `blog.json` |
| `main-blog-post.liquid` | Heritage core | Artículo individual | Medio | `article.json` |
| `main-cart.liquid` | Heritage core | Página carrito | **Alto** | `cart.json`; blocks estáticos cart |
| `main-collection.liquid` | Heritage modificada | PLP con markup `shopping-i` + facets Heritage | **Alto** | `collection.json`; integra `blocks/filters` Wagon |
| `main-collection-list.liquid` | Heritage core | Listado de todas las colecciones | Medio | `list-collections.json` |
| `main-page.liquid` | Heritage core | Página genérica con blocks | Medio | `page.contact.json` |
| `marquee.liquid` | Heritage core | Marquee Heritage | Bajo | Presets |
| `marquee-i.liquid` | Wagon custom | Marquee de logos (blocks `logo`) | Medio | `index.json` |
| `master.liquid` | Demo/internal | Showcase tipografía y botones Wagon | Bajo | `page.master.json`, `page.json` — utilidad dev |
| `media-with-content.liquid` | Heritage core | Media + contenido lado a lado | Bajo | Presets |
| `password.liquid` | Heritage core | Contenido tienda con contraseña | Medio | `password.json` |
| `password-footer.liquid` | Heritage core | Footer password layout | Bajo | `layout/password.liquid` directo |
| `predictive-search.liquid` | Heritage core | Resultados búsqueda predictiva (AJAX) | **Alto** | Runtime; invocado por `predictive-search.js` |
| `predictive-search-empty.liquid` | Heritage core | Estado vacío búsqueda predictiva | Medio | Runtime; ID `predictive-search-empty` |
| `product-hotspots.liquid` | Heritage core | Imagen con hotspots de producto | Bajo | Presets |
| `product-i.liquid` | Wagon custom | PDP custom: Splide gallery + blocks estáticos | **Alto** | `product.json`; envuelve variant-picker, buy-buttons |
| `product-information.liquid` | Heritage core | PDP estándar Heritage | Medio | **No referenciada** en templates actuales (reemplazada por product-i) |
| `product-list.liquid` | Heritage core | Lista de productos composable | Medio | `cart.json`, `404.json` |
| `product-recommendations.liquid` | Heritage core | Recomendaciones Shopify | Medio | `product.json` |
| `quick-order-list.liquid` | Heritage core | Pedido rápido B2B en PDP | Medio | Schema `templates: ["product"]` pero **no en product.json** |
| `reviews-i.liquid` | Wagon custom | Testimonios con blocks `review` | Medio | `index.json`; copy demo repetido |
| `search-header.liquid` | Heritage core | Cabecera búsqueda | Medio | `search.json` |
| `search-results.liquid` | Heritage core | Resultados búsqueda + facets | **Alto** | `search.json`; filters block |
| `section-rendering-product-card.liquid` | Heritage core | Section Rendering API para cards | **Alto** | No en templates; usada por `variant-picker.js`, quick-add |
| `section.liquid` | Heritage core | Section composable universal | Medio | `page.contact.json`; muchos presets |
| `shipping-i.liquid` | Wagon custom | Cards envío/devoluciones en PDP | Medio | `product.json`; SVG `#372223` inline |
| `shopping-i.liquid` | No referenciada | PLP alternativa standalone | Medio | Duplica lógica de `main-collection`; presets only |
| `slideshow.liquid` | Heritage core | Slideshow composable | Bajo | Presets |
| `superhero.liquid` | Wagon custom | Hero split homepage con SVG ornamentos | Alto | `index.json`; SVG masivo `#FF791F` |
| `visit-i.liquid` | Wagon custom | Mapa + horarios + dirección tienda | Medio | `index.json`; Google Maps embed Chicago |

---

## Resumen por clasificación

| Clasificación | Cantidad | Archivos |
|---------------|----------|----------|
| Heritage core | 32 | Ver tabla |
| Heritage modificada | 2 | `header.liquid`, `main-collection.liquid` |
| Wagon custom | 15 | `about-*`, `*-i`, `superhero`, `getintouch`, `foot` |
| Demo/internal | 1 | `master.liquid` |
| No referenciada (en templates) | 4 | `shopping-i`, `product-information`, `quick-order-list`*, `hero`† |

\* `quick-order-list` disponible en editor para product template pero ausente en `product.json` actual.  
† `hero` y otras con solo presets son **referenciables por merchant** — clasificadas Heritage core, no "muertas".

---

## Sections por template JSON

| Template | Sections |
|----------|----------|
| `index.json` | superhero, favorites-i, collections-i, marquee-i, reviews-i, visit-i, getintouch |
| `product.json` | product-i, shipping-i, product-recommendations |
| `collection.json` | main-collection |
| `page.about.json` | about-i, about-ii, about-iii |
| `page.master.json` | master |
| `page.json` | master |
| `page.contact.json` | main-page, section |
| `cart.json` | main-cart, product-list |
| `search.json` | search-header, search-results |
| `blog.json` | main-blog |
| `article.json` | main-blog-post |
| `list-collections.json` | main-collection-list |
| `404.json` | main-404, product-list |
| `password.json` | password |

---

## Section groups (pendiente de verificación)

| Group | Sections probables | Estado en repo |
|-------|-------------------|----------------|
| `header-group` | `header`, `header-announcements` | JSON **no versionado** |
| `footer-group` | `foot` (custom) y/o `footer`, `footer-utilities` | JSON **no versionado** |

Confirmar con Theme Editor o `shopify theme pull` antes de Fase 1.

---

## Sections runtime (sin template JSON)

| Section | Invocación |
|---------|------------|
| `predictive-search` | Fetch AJAX desde búsqueda |
| `predictive-search-empty` | Fetch cuando sin resultados |
| `section-rendering-product-card` | Section Rendering API / variant-picker / quick-add |

---

## Recomendaciones por fase (referencia)

| Fase | Sections prioritarias |
|------|----------------------|
| Fase 1 | Templates + defaults schemas: superhero, about-*, reviews-i, visit-i, foot, getintouch |
| Fase 2 | `header.liquid` (menú setting), `foot.liquid` |
| Fase 3 | CDN en header, foot, main-collection, product-i |
| Fase 4 | Todas Wagon custom + `master.css` tokens |
| Fase 5 | `header`, `main-collection`, `product-i`, `wagon.js` |
| Fase 6 | QA en todas las filas con riesgo Alto |

---

*Inventario generado en Fase 0.5. Relacionado con `02-devmon-v1-architecture.md` y `05-devmon-v1-risk-map.md`.*
