# Fase 1 — Reporte de neutralización de contenido de marca

**Proyecto:** Devmon v1 (base Heritage 3.5.1 + Wagon)  
**Fecha:** 2026-07-03  
**Alcance:** Solo contenido visible de marca. Sin refactor, rediseño, CSS, JS, assets ni tokens.

---

## Resumen ejecutivo

Se neutralizó la identidad **Chocolat Uzma** (Chicago) en **18 archivos** dentro del alcance permitido. Los textos visibles pasaron a placeholders genéricos de starter theme. No se alteró arquitectura, comportamiento, clases, IDs, blocks ni estructura HTML.

**Verificación final:** `rg` sobre `templates/`, `sections/` y `config/` no devuelve coincidencias para `uzma`, `chocolat-uzma`, `Chocolat Uzma`, `917 W`, `Anna@gmail`, `310 285`, `South Asian`, `Pakistani` ni `Uzma Sharif`.

---

## Archivos modificados

| Archivo | Tipo de cambio |
|---------|----------------|
| `config/settings_data.json` | Logos/favicon vacíos |
| `templates/index.json` | Homepage: hero, reviews, visit, contact, colecciones, imágenes |
| `templates/page.about.json` | About: misión, founder, timeline |
| `templates/product.json` | Acordeones PDP + cards shipping |
| `sections/footer-group.json` | Settings live del footer (email, dirección, copyright) |
| `sections/superhero.liquid` | Schema defaults hero |
| `sections/about-i.liquid` | Schema defaults misión |
| `sections/about-ii.liquid` | Schema defaults founder |
| `sections/about-iii.liquid` | Schema defaults + presets timeline |
| `sections/favorites-i.liquid` | Schema defaults heading/button |
| `sections/collections-i.liquid` | Schema defaults heading/button |
| `sections/reviews-i.liquid` | Schema defaults review block |
| `sections/visit-i.liquid` | Schema defaults dirección/horarios/parking |
| `sections/getintouch.liquid` | Schema defaults formulario |
| `sections/foot.liquid` | Schema defaults footer |
| `sections/header.liquid` | Texto hardcodeado bigmenu (email + dirección) |
| `sections/shipping-i.liquid` | Presets cards shipping/returns |
| `sections/product-i.liquid` | Default accordion 1 |

**No modificado (sin contenido de marca):** `sections/header-group.json`, resto de `templates/*.json`, `locales/*.json`.

---

## Textos reemplazados (por categoría)

### Identidad y marca

| Original | Reemplazo | Ubicación |
|----------|-----------|-----------|
| Chocolat Uzma | Brand Name | `foot.liquid`, `footer-group.json` |
| Meet Uzma Sharif | Meet Founder Name | `about-ii.liquid`, `page.about.json` |
| Biografía Uzma / chocolatier 20 años | Your brand story goes here. | `about-ii.liquid`, `page.about.json` |
| Timeline biográfico (Chicago, Pakistani American, culinary school…) | Timeline genérico 2020–2023 | `about-iii.liquid`, `page.about.json` |
| EXOTIC HANDCRAFTED CHOCOLATES INSPIRED BY OUR SOUTH ASIAN HERITAGE | PREMIUM PRODUCTS CRAFTED WITH CARE | `superhero.liquid`, `index.json` |
| Subheading urdu sobre chocolate pakistaní | Explore our collection. | `superhero.liquid`, `index.json` |

### Contacto

| Original | Reemplazo | Ubicación |
|----------|-----------|-----------|
| info@chocolat-uzma.com / Info@chocolat-uzma.com | hello@example.com | `foot.liquid`, `header.liquid`, `footer-group.json`, `getintouch`, `index.json`, `product.json` |
| Anna@gmail.com | hello@example.com | `foot.liquid`, `footer-group.json`, `getintouch`, `index.json` |
| +1 310 285 2913 | +1 000 000 0000 | `getintouch.liquid`, `index.json` |
| Anna (placeholder nombre) | Customer Name | `getintouch.liquid`, `index.json` |
| 917 W. 18th Street. Suite 101 | Store Address | `foot.liquid`, `header.liquid`, `visit-i.liquid`, `footer-group.json`, `index.json` |
| Notas acceso 18th Street / parking former location | Placeholders genéricos theme editor | `visit-i.liquid`, `index.json` |
| Horarios específicos Chicago | Horario genérico Lun–Vie 9–5 | `visit-i.liquid`, `index.json` |

### Copyright y copy corporativo

| Original | Reemplazo | Ubicación |
|----------|-----------|-----------|
| © 2025 Chocolat Uzma. All rights reserved. | © 2026 Brand Name. All rights reserved. | `foot.liquid`, `footer-group.json` |
| We create exceptional products… sustainability… | Your brand story goes here. | `foot.liquid`, `footer-group.json`, `about-i` |
| Hi! Need custom chocolate boxes… | Your message here. | `getintouch.liquid`, `index.json` |

### Testimonios

| Original | Reemplazo | Ubicación |
|----------|-----------|-----------|
| Review sobre chocolate/mom/nuts | Sample review genérico | `reviews-i.liquid`, `index.json` |
| Customer Review | Customer Name | `reviews-i.liquid`, `index.json` |

### Colecciones y CTAs

| Original | Reemplazo | Ubicación |
|----------|-----------|-----------|
| Handcrafted Favorites | Featured Products | `favorites-i.liquid`, `index.json` |
| Seasonal Collections | Collection Name | `collections-i.liquid`, `index.json` |
| See All / See More Collections | Explore our collection | `favorites-i`, `collections-i`, `index.json` |
| Colecciones `homepage`, `chocolate-bars` | `""` + `shopify://collections/all` | `index.json` |

### Shipping / returns / PDP

| Original | Reemplazo | Ubicación |
|----------|-----------|-----------|
| Política extensa Chocolat Uzma (USPS, UPS, perishable, Chicago courier…) | Placeholder genérico + hello@example.com | `product.json` accordion 3 |
| Dimensiones cajas chocolate específicas | Product Details genérico | `product.json` accordion 1 |
| Care instructions chocolate (68°F, freezing…) | Care genérico | `product.json` accordion 2 |
| Heat-sensitive / perishable / Mon–Thu | Copy neutro shipping/returns | `shipping-i.liquid`, `product.json` cards |

### Assets de marca (settings)

| Original | Reemplazo | Ubicación |
|----------|-----------|-----------|
| `shopify://shop_images/brand.svg`, `Logo.png` | `""` | `settings_data.json`, `footer-group.json` |
| Imágenes `shopify://` en homepage/about | `""` | `index.json`, `page.about.json` |
| Google Maps embed Chicago 917 W 18th | `""` | `index.json` |

---

## Referencias de marca neutralizadas (lista completa)

- Chocolat Uzma
- Uzma / Uzma Sharif
- Chicago / Illinois / Rocky Mountains (en timeline)
- Pakistani American / South Asian heritage
- 917 W. 18th Street
- info@chocolat-uzma.com
- Anna@gmail.com
- +1 310 285 2913
- Claims chocolatería artesanal / perishable / heat-sensitive
- Testimonios demo con copy chocolate
- FAQs shipping específicas del cliente
- Colecciones demo `homepage`, `chocolate-bars`
- Copyright de marca
- Subheading en urdu ligado a marca

---

## Referencias dejadas intactas (y por qué)

| Referencia | Ubicación | Motivo |
|------------|-----------|--------|
| `--color-chocolat`, `.btn-chocolat` | CSS en `sections/*.liquid`, `assets/*.css`, `blocks/filters.liquid` | Token/clase de estilo — fuera de alcance Fase 1 |
| URLs CDN `0658/2445/6946` | `header.liquid`, `foot.liquid`, `product-i.liquid`, `main-collection.liquid` | CDN de tienda ajena — explícitamente pendiente Fase 2 |
| `linklists.navbar` / `menu: "navbar"` | `header.liquid`, `header-group.json` | Resolver en Fase 2 (R-06) — tocar puede romper navegación |
| `metafields.custom.main_picture` | `product-i.liquid` (si presente) | Metafield funcional — pendiente Fase 2 |
| `color_schemes` con `#372223` | `settings_data.json` | Paleta de color — fuera de alcance |
| Fuentes `instrument_sans_n4` | `settings_data.json` | Fuentes — fuera de alcance |
| SVG paths con substrings `310`, `917` en coordenadas | `superhero.liquid`, `snippets/icon.liquid` | Datos geométricos, no texto de marca |
| `Uzman` en turco | `locales/tr.schema.json` | Traducción Heritage (“experto”), no marca cliente |
| Comentario CSS `Chocolate / flavor options` | `assets/wagon.css` | Comentario técnico, no visible al usuario |
| Contenido de páginas Shopify (`{{ page.content }}`) | `page.contact.json`, etc. | Contenido del admin de la tienda, no del theme repo |
| `stroke="#372223"` en iconos | `snippets/header-actions.liquid` | Color hardcodeado — Fase 2 (tokens) |

---

## Riesgos pendientes para Fase 2

| ID | Riesgo | Impacto |
|----|--------|---------|
| R-01 | CDN assets tienda `0658/2445/6946` | Imágenes decorativas rotas al desplegar en otra tienda |
| R-02 | `color_schemes` y `--color-chocolat` duplicados | Identidad visual sigue siendo la del cliente |
| R-03 | `linklists.navbar` hardcodeado | Menú depende de configuración de tienda origen |
| R-04 | `metafields.custom.main_picture` | PDP puede fallar sin metafield en tienda nueva |
| R-05 | Section groups no versionados históricamente | `footer-group.json` ahora neutralizado pero conviene confirmar sync con Shopify |
| R-06 | Colecciones vacías en `index.json` | Homepage muestra secciones sin productos hasta asignar colección |
| R-07 | Logos/imágenes vacíos | Hero, about, marquee, reviews sin imagen hasta subir assets |
| R-08 | Menús `foot`, `products`, `legal` referenciados | Pueden no existir en tienda destino |
| R-09 | Contenido de páginas en Shopify admin | Textos de marca pueden persistir en Pages fuera del theme |

---

## Comandos recomendados para revisar

```bash
# 1. Verificar ausencia de términos de marca en alcance
cd /Users/sublime/codevamon/dev/browser/shopify-themes/devmon-v1
rg -i "uzma|chocolat uzma|chocolat-uzma|917 w|anna@gmail|310 285|south asian|pakistani|uzma sharif" \
  templates/ sections/ config/

# 2. Ver diff completo de la fase
git diff --stat
git diff templates/ sections/ config/settings_data.json

# 3. Buscar referencias CDN pendientes (Fase 2)
rg "0658/2445/6946" sections/ snippets/ assets/

# 4. Buscar tokens de color de marca pendientes
rg "color-chocolat|btn-chocolat" --glob '*.{css,liquid}'

# 5. Preview local (requiere Shopify CLI + tienda dev)
shopify theme dev

# 6. Validar theme
shopify theme check
```

### Checklist visual en theme editor

- [ ] Homepage: hero sin copy Chocolat Uzma
- [ ] Footer: email `hello@example.com`, dirección placeholder, copyright Brand Name
- [ ] Header bigmenu: email y dirección neutros
- [ ] About page: timeline genérico, sin Uzma/Chicago
- [ ] PDP: acordeones sin política Chocolat Uzma
- [ ] Formulario contacto: placeholders neutros
- [ ] Sin logos de marca en settings (vacíos)

---

## Estadísticas

- **Archivos modificados:** 18
- **Líneas cambiadas (git diff):** ~52 inserciones / ~52 eliminaciones (sustitución 1:1)
- **Locales modificados:** 0
- **Assets modificados:** 0
- **Commits:** ninguno (según instrucción)

---

## Notas de alcance

1. **`sections/footer-group.json`** se incluyó porque contenía settings live con email, dirección y copyright de marca visibles en storefront. No estaba en la lista explícita del brief (`templates/*.json`, `sections/*.liquid`) pero es equivalente funcional a template JSON de section group.

2. **`sections/header.liquid`**: se modificó solo el bloque `data-bigmenu` (texto visible). El resto del archivo, incluyendo CDN y `linklists.navbar`, quedó intacto.

3. **Imágenes vacías** en templates: las secciones siguen renderizando; pueden mostrar placeholders o áreas vacías hasta Fase 2/3.
