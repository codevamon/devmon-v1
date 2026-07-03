# Fase 2A — Auditoría de hardcodes e infraestructura

**Proyecto:** Devmon v1 (Heritage 3.5.1 + Wagon)  
**Fecha:** 2026-07-03  
**Alcance:** Solo lectura. Cero modificaciones al theme.  
**Objetivo:** Inventariar todo lo que impide portabilidad entre tiendas Shopify.

---

## Resumen ejecutivo

Devmon v1 **no es portable hoy** sin configuración manual post-instalación. Los bloqueadores principales son:

1. **19 URLs CDN** apuntando a la tienda origen (`0658/2445/6946`) — fuentes Turnkey + decoración SVG/JPG.
2. **Menú hardcodeado** `linklists.navbar` en el header Wagon, independiente del menú Heritage configurado en theme editor.
3. **Metafield obligatorio implícito** `custom.main_picture` en cards/galerías Wagon (sin fallback documentado en UI).
4. **Stack dual de fuentes** — Heritage (`instrument_sans_n4`) + Wagon (Turnkey CDN, Adobe Typekit, Google Fonts) cargadas en paralelo.
5. **Identidad visual anterior** en tokens CSS (`--color-chocolat`, `#372223`) y 3 color schemes custom con UUID.
6. **8 dependencias CDN públicas** cargadas globalmente desde `layout/theme.liquid`.
7. **Section groups** con handles de menú específicos (`foot`, `products`, `legal`, `navbar`).
8. **Templates incompletos** — no existe `templates/collection.json`; homepage con colecciones/imágenes vacías.

**Conteo rápido:**

| Categoría | Ocurrencias |
|-----------|-------------|
| CDN tienda `0658/2445/6946` | 19 refs en 8 archivos |
| `--color-chocolat` / `.btn-chocolat` | ~99 refs en `assets/` |
| `#372223` hardcodeado en SVG/CSS | ~15+ refs en sections + assets |
| Metafields directos | 2 namespaces, 5 archivos |
| Handles menú hardcodeados | 5 handles |
| CDN públicos (layout) | 11 URLs en `theme.liquid` |

---

## Tabla maestra de hardcodes

### 1. CDN tienda anterior (`0658/2445/6946`)

| Tipo | Archivo | Línea aprox. | Valor actual | Impacto | Solución recomendada | Fase | Prioridad |
|------|---------|--------------|--------------|---------|----------------------|------|-----------|
| Fuente remota | `assets/fonts.css` | 7–71 | 9× `@font-face` Turnkey Condensed → CDN tienda | Headings Wagon no cargan en tienda nueva; FOUT/FOIT | Self-host `.woff2` en `/assets` o reemplazar por font picker Heritage | 3 | **Alta** |
| Imagen decorativa | `sections/header.liquid` | 535 | `collection-all.jpg` | Minishop “All collections” sin imagen | `image_picker` en schema o asset local | 3 | **Alta** |
| Imagen decorativa | `sections/header.liquid` | 708–709 | `bg-menu-big.svg`, `bg-menu-drawer-2.svg` | Decoración menú rota | Asset local en `/assets` | 3 | Media |
| Imagen decorativa | `sections/foot.liquid` | 3–4, 208 | `detail-footer1.svg`, `superdetail-footer-responsive.svg`, `superdetail-footer.svg` | Footer decorativo roto | Asset local o setting opcional | 3 | Media |
| Imagen decorativa | `sections/product-i.liquid` | 122 | `mimidetail_1.svg` | Detalle PDP roto | Asset local o eliminar si decorativo | 3 | Media |
| Imagen decorativa | `sections/main-collection.liquid` | 169 | `icon-filter.svg` | Icono filtro PLP roto | Inline SVG o asset local | 3 | Media |
| Imagen decorativa | `snippets/sorting.liquid` | 99 | `icon-filter.svg` | Mismo icono en sort mobile | Unificar en snippet/asset local | 3 | Media |
| Imagen decorativa | `snippets/header-drawer.liquid` | 762 | `bg-menu-drawer-2.svg` | Drawer mobile sin fondo | Asset local | 3 | Media |

---

### 2. Handles y referencias de configuración hardcodeados

| Tipo | Archivo | Línea aprox. | Valor actual | Impacto | Solución recomendada | Fase | Prioridad |
|------|---------|--------------|--------------|---------|----------------------|------|-----------|
| Menú Liquid | `sections/header.liquid` | 414 | `linklists.navbar` | Nav Wagon vacío si no existe menú `navbar` en tienda nueva | Setting `link_list` en schema; fallback a `section.settings.menu` Heritage | 2B | **Alta** |
| Menú JSON | `sections/header-group.json` | 1 | `"menu": "navbar"` | Heritage drawer usa menú inexistente | Mismo setting unificado; default `main-menu` o vacío | 2B | **Alta** |
| Detección minishop | `sections/header.liquid` | 427, 432, 512 | `link.title \| downcase contains 'shop'` | Minishop Splide solo si ítem se llama “shop”; frágil en otros idiomas | Setting explícito “Minishop menu item” o checkbox por link | 2B | **Alta** |
| Menú footer | `sections/footer-group.json` | 1 | `"footer_menu": "foot"` | Columna footer vacía | Setting `link_list` sin default hardcodeado; documentar en install guide | 2B | **Alta** |
| Menú footer | `sections/footer-group.json` | 1 | `"products_menu": "products"` | Columna productos vacía | Idem | 2B | **Alta** |
| Menú footer | `sections/footer-group.json` | 1 | `"legal_menu": "legal"` | Links legales vacíos | Idem | 2B | Media |
| Menú cuenta | `sections/header-group.json` | 1 | `"customer_account_menu": "customer-account-main-menu"` | Menú cuenta cliente vacío (Heritage) | Default genérico o setting visible | 2B | Media |
| Menú cuenta schema | `sections/header.liquid` | ~1674 | `"default": "customer-account-main-menu"` | Mismo riesgo al añadir section nueva | Cambiar default a `""` o menú estándar | 2B | Media |
| Colección vacía | `templates/index.json` | 1 | `"collection": ""` (×2) | Homepage favorites/collections sin productos | Asignar `all` o documentar paso post-install | 2B | **Alta** |
| Página styleguide | `templates/page.json` | 13 | `"type": "master"` | Páginas genéricas muestran styleguide, no contenido | Cambiar a `main-page` Heritage | 2B | Media |
| Página styleguide | `templates/page.master.json` | 13 | `"type": "master"` | OK para demo; confuso en prod | Renombrar template o documentar | 2B | Baja |
| Template ausente | — | — | No existe `templates/collection.json` | PLP Wagon (`main-collection`) no versionada; depende de asignación manual en admin | Crear `collection.json` con `main-collection` | 2B | **Alta** |
| Colección preset Heritage | `templates/404.json`, `cart.json` | — | `"collection": "all"` | OK — handle estándar Shopify | Ninguna | — | Baja |
| URL genérica | `templates/index.json` | 1 | `shopify://collections/all` | Portable | Ninguna | — | Baja |
| Redes sociales placeholder | `sections/footer-group.json` | 1 | `facebook.com`, `instagram.com`, `youtube.com` | Links genéricos no rotos pero inútiles | Settings URL con defaults vacíos | 2B | Baja |

---

### 3. Metafields hardcodeados

| Tipo | Archivo | Línea aprox. | Valor actual | Impacto | Solución recomendada | Fase | Prioridad |
|------|---------|--------------|--------------|---------|----------------------|------|-----------|
| Metafield producto | `snippets/product-card.liquid` | 39 | `product.metafields.custom.main_picture.value` | Cards Wagon sin imagen hero si metafield no existe; clase `darker` no aplica | Fallback a `featured_media`; setting “Use metafield for card image”; documentar definición metafield | 2B | **Alta** |
| Metafield producto | `snippets/card-gallery.liquid` | 15, 97–98 | `custom.main_picture` | Galería Heritage/Wagon prioriza metafield sobre featured | Idem + verificar en theme editor preview | 2B | **Alta** |
| Metafield producto | `sections/favorites-i.liquid` | 44 | `custom.main_picture` | Carousel homepage sin imagen custom | Idem | 2B | **Alta** |
| Metafield producto | `sections/shopping-i.liquid` | 80 | `custom.main_picture` | Grid shopping sin imagen custom | Idem | 2B | **Alta** |
| Metafield reviews | `blocks/review.liquid` | 6–8 | `reviews.rating`, `reviews.rating_count` | Ratings ocultos sin app Shopify Reviews | Fallback silencioso OK; documentar dependencia de app; defaults solo en preview | 2B | Media |
| Metafield reviews preview | `blocks/review.liquid` | 12–14 | Defaults `4`, `5`, `3` en design mode | Solo afecta preview | OK mantener | — | Baja |

**Nota:** No se encontraron otros `metafields.*` en el codebase fuera de los listados.

---

### 4. Dependencias externas (CDN públicos)

Todas cargadas globalmente en `layout/theme.liquid` (post-Fase 1, sin cambios).

| Tipo | Archivo | Línea aprox. | Valor actual | Impacto | Solución recomendada | Fase | Prioridad |
|------|---------|--------------|--------------|---------|----------------------|------|-----------|
| CSS framework | `layout/theme.liquid` | 39 | Bootstrap 5.3.3 CSS (jsdelivr) | Grid/utilities Wagon dependen de CDN; SPOF externo | Self-host en `/assets` o migrar grid (Fase 5) | 3 / 5 | **Alta** |
| Iconos | `layout/theme.liquid` | 42 | Bootstrap Icons 1.13.1 | Iconos PLP/sort (`bi bi-chevron-down`) rotos sin CDN | Self-host subset usado | 3 | Media |
| Carrusel CSS | `layout/theme.liquid` | 46 | Splide 4.1.4 core CSS | 8 sections con Splide sin estilos | Self-host | 3 | **Alta** |
| Adobe fonts | `layout/theme.liquid` | 50–52 | Typekit `ldm7ibv.css` | `stevie-sans`, `obviously-narrow` en `wagon.css` no cargan sin licencia | Eliminar o reemplazar; mapear a font picker | 3 / 4 | **Alta** |
| Google fonts | `layout/theme.liquid` | 54–56 | Inter + Inter Tight | Carga redundante con Heritage fonts | Eliminar si no se usan en CSS activo | 3 / 4 | Media |
| jQuery | `layout/theme.liquid` | 74 | jQuery 3.6.0 | Dependencia para Bootstrap collapse; no usado directamente en Wagon | Evaluar eliminación con Bootstrap nativo (Fase 5) | 5 | Media |
| GSAP | `layout/theme.liquid` | 79–80 | GSAP 3.12.5 + ScrollTrigger | Animaciones `wagon.js` fallan silenciosamente | Self-host; version pin | 3 | **Alta** |
| Lenis | `layout/theme.liquid` | 84 | Lenis 1.0.44 | Smooth scroll Wagon desactivado | Self-host o feature flag setting | 3 | Media |
| Splide JS | `layout/theme.liquid` | 90 | Splide 4.1.4 JS | Carruseles header/PDP/home rotos | Self-host | 3 | **Alta** |
| Splitting JS | `layout/theme.liquid` | 95 | Splitting 1.0.6 | Text animations en `wagon.js` rotas | Self-host; CSS ya local | 3 | Media |
| Bootstrap JS | `layout/theme.liquid` | 99 | Bootstrap 5.3.3 bundle | Collapse bigmenu/minishop/filters rotos | Self-host | 3 | **Alta** |
| Init global | `assets/wagon.js` | ~681 | `initGSAP`, `initLenis`, `initSplide`, `initSplitting` | Todo el runtime Wagon depende de globals CDN | Guard clauses OK; documentar orden de carga | 3 | Media |
| Splide inline | `sections/header.liquid` | 849–854 | `new Splide(...)` inline | Duplica init de `wagon.js` | Consolidar en `wagon.js` | 5 | Baja |
| Splide inline | `sections/product-i.liquid` | 201–217 | Gallery + thumbs Splide | PDP gallery rota sin Splide JS | Idem | 3 | **Alta** |
| Splide inline | `sections/favorites-i.liquid`, `collections-i.liquid`, `reviews-i.liquid`, `marquee-i.liquid`, `about-iii.liquid`, `product-recommendations.liquid` | — | Init inline por section | Mismo riesgo | Idem | 3 | Media |
| Bootstrap inline | `sections/header.liquid` | 717–838 | `bootstrap.Collapse.getOrCreateInstance` | Menú mobile/desktop roto | Idem | 3 | **Alta** |
| Bootstrap inline | `sections/main-collection.liquid`, `blocks/filters.liquid` | — | `data-bs-toggle="collapse"` | Sort/filter collapse roto | Idem | 3 | Media |

**Assets locales relacionados (OK pero acoplados):**

| Tipo | Archivo | Impacto | Fase |
|------|---------|---------|------|
| CSS Splitting | `assets/splitting.css`, `splitting-cells.css` | Requieren JS CDN | 3 |
| Runtime Wagon | `assets/wagon.js` (~786 líneas) | Depende de 6 globals | 3 / 5 |
| CSS Wagon | `assets/wagon.css`, `home.css`, `master.css` | Referencian fuentes externas por nombre | 4 |

---

### 5. Configuración crítica

| Tipo | Archivo | Línea aprox. | Valor actual | Impacto | Solución recomendada | Fase | Prioridad |
|------|---------|--------------|--------------|---------|----------------------|------|-----------|
| Theme identity | `config/settings_schema.json` | 4–8 | `theme_name: Heritage`, `theme_version: 3.5.1`, `theme_author: Shopify` | Theme editor muestra identidad incorrecta | Actualizar a Devmon v1 en release | 6 | Media |
| Logos | `config/settings_data.json` | 1 | `logo: ""`, `logo_inverse: ""`, `favicon: ""` | Sin logo hasta upload manual | OK post-Fase 1; documentar en install | 6 | Baja |
| Fuentes Heritage | `config/settings_data.json` | 1 | `instrument_sans_n4` (body/heading/accent) | Heritage typography OK vía Shopify font CDN | Alinear con decisión Wagon (eliminar triple stack) | 4 | Media |
| Color scheme custom | `config/settings_data.json` | — | `scheme-0bb914f3…` bg `#fff3e3` fg `#372223` | Identidad Chocolat Uzma en drawer/cart | Resetear a schemes Heritage neutros | 4 | **Alta** |
| Color scheme custom | `config/settings_data.json` | — | `scheme-8ead3727…` bg `#ffc80a` fg `#372223` | Header top amarillo/marrón cliente | Idem | 4 | **Alta** |
| Color scheme custom | `config/settings_data.json` | — | `scheme-7115b6b1…` bg `#faf5ef` fg `#372223` | PDP recommendations scheme cliente | Idem; verificar refs en `product.json` | 4 | **Alta** |
| Scheme refs templates | `sections/header-group.json` | 1 | `color_scheme_top: scheme-8ead3727…` | Header amarillo hardcodeado en JSON | Reasignar a `scheme-1` o setting | 4 | **Alta** |
| Scheme refs templates | `templates/product.json` | 1 | `color_scheme: scheme-7115b6b1…` | Bloque recomendaciones con palette cliente | Idem | 4 | Media |
| Drawer scheme | `config/settings_data.json` | 1 | `drawer_color_scheme: scheme-0bb914f3…` | Cart drawer con colores cliente | Idem | 4 | Media |
| Token CSS marca | `assets/master.css` | 27 | `--color-chocolat: #372223` | Toda la capa Wagon usa token de marca | Renombrar a `--color-brand`; mapear a scheme | 4 | **Alta** |
| Clase CSS marca | `assets/master.css`, `wagon.css`, sections | — | `.btn-chocolat`, `var(--color-chocolat)` (~99 refs) | Botones/ bordes atados a nombre cliente | Renombrar a semántico (`btn-brand`) | 4 | Media |
| SVG color hardcode | `snippets/header-actions.liquid` | 32–33 | `stroke="#372223"` | Iconos carrito/cuenta no siguen scheme | `currentColor` o CSS variable | 4 | Media |
| SVG color hardcode | `snippets/header-drawer.liquid` | 64–66 | `stroke="#372223"` | Hamburger icon | Idem | 4 | Media |
| SVG color hardcode | `sections/product-i.liquid`, `foot.liquid`, `visit-i.liquid` | — | `fill="#372223"` | Decoración secciones | Idem | 4 | Baja |
| Fuentes CSS nombre | `assets/wagon.css` | 49, 99 | `'stevie-sans'`, `'obviously-narrow'` | Requieren Typekit activo | Eliminar o self-host con licencia | 3 / 4 | **Alta** |
| Fuentes CSS nombre | `assets/master.css` | 156 | `'Turnkey Condensed'` | Requiere CDN tienda o self-host | Idem | 3 | **Alta** |
| Header group | `sections/header-group.json` | — | Versionado en repo | OK — portable si se neutralizan refs | Validar sync con Shopify pull | 2B | Media |
| Footer group | `sections/footer-group.json` | — | Versionado; menús hardcodeados | Parcialmente portable post-Fase 1 | Neutralizar menu defaults | 2B | Media |

---

### 6. Riesgos de portabilidad (matriz de impacto)

| Escenario en tienda nueva | Qué se rompe / queda vacío | Depende de admin Shopify | Debería ser setting |
|---------------------------|----------------------------|--------------------------|---------------------|
| Instalar theme sin menús `navbar`, `foot`, `products`, `legal` | Nav Wagon vacío; footer sin links | Crear 4 navigation menus con handles exactos | Sí — `link_list` settings con picker |
| Sin metafield `custom.main_picture` | Product cards Wagon usan featured image (fallback parcial); estilos `darker` inconsistentes | Crear metafield definition en Settings → Custom data | Sí — toggle + documentación |
| Sin app Shopify Product Reviews | Block `review` no renderiza ratings | Instalar app o eliminar block | Documentar dependencia |
| Sin productos/colecciones | Homepage favorites/collections vacíos; minishop vacío si menú shop existe | Añadir productos y asignar colecciones en theme editor | Sí — defaults a `all` |
| Sin logos subidos | Header/footer sin logo (texto shop name) | Upload en theme settings | OK — ya es setting |
| CDN tienda origen caído/borrado | Fuentes Turnkey + 10 imágenes decorativas 404 | N/A | Self-host assets |
| CDN públicos bloqueados (GDPR/firewall) | Bootstrap, GSAP, Splide, menús collapse, animaciones | N/A | Self-host |
| Typekit kit `ldm7ibv` no autorizado | Body text Wagon cae a sans-serif genérico | Cuenta Adobe Fonts | Eliminar o reemplazar |
| `templates/collection.json` ausente | PLP usa template default Heritage, no Wagon | Asignar manualmente template por colección | Crear template en repo |
| `page.json` → section `master` | Páginas CMS muestran styleguide | Reasignar template por página | Cambiar a `main-page` |
| Color schemes UUID huérfanos | Si se resetean schemes, templates con refs UUID pierden estilo | Editar templates en theme editor | Mapear a scheme-1..6 |
| Doble menú header | Heritage `_header-menu` + Wagon `linklists.navbar` pueden divergir | Mantener dos menús sincronizados manualmente | Unificar en un setting |
| Contact form `getintouch` | Funciona vía Shopify native (`{% form 'contact' %}`) | Email destino en admin Settings → Notifications | OK portable |
| Newsletter footer | Requiere Shopify customer accounts / marketing | Configurar en admin | OK portable |

---

## Qué se vería vacío al instalar en tienda nueva (sin config)

| Área | Estado esperado |
|------|-----------------|
| Homepage hero | Sin imagen (setting vacío) |
| Homepage favorites / collections | Sin productos (collection `""`) |
| Marquee logos | 5 blocks sin imagen |
| Reviews | Texto placeholder OK; sin fotos |
| Visit store | Sin mapa ni imagen |
| Header minishop | Vacío si no hay menú “shop” con sublinks |
| Header nav Wagon | Vacío sin `linklists.navbar` |
| Footer columns | Vacías sin menús `foot`/`products`/`legal` |
| Logos | Vacíos (correcto post-Fase 1) |
| PDP gallery | Funciona con product media nativo |
| PLP Wagon | No activa hasta asignar template `main-collection` |
| Fuentes headings | Turnkey 404 desde CDN ajeno |
| Decoración SVG | Múltiples 404 en header/footer/PLP/PDP |

---

## Comandos recomendados para revisión

```bash
cd /Users/sublime/codevamon/dev/browser/shopify-themes/devmon-v1

# CDN tienda origen
rg "0658/2445/6946" --glob '!handoff/**'

# Menús hardcodeados
rg "linklists\.|\"menu\":\s*\"|footer_menu|products_menu|legal_menu" \
  sections/ config/ templates/

# Metafields
rg "metafields\." --glob '*.{liquid,json,js}'

# Dependencias externas
rg "cdn\.jsdelivr|cdnjs\.cloudflare|unpkg\.com|use\.typekit|fonts\.googleapis|code\.jquery" \
  layout/ assets/

# Tokens identidad anterior
rg "color-chocolat|btn-chocolat|#372223" assets/ sections/ snippets/ blocks/

# Color schemes custom UUID
rg "scheme-[0-9a-f-]{36}" config/ sections/ templates/

# Splide/Bootstrap inline
rg "new Splide|bootstrap\.Collapse" sections/

# Verificar templates faltantes
ls templates/collection.json 2>/dev/null || echo "MISSING: templates/collection.json"
```

---

## Mapa de fases recomendadas (post-auditoría)

| Fase | Enfoque | Hardcodes que aborda |
|------|---------|---------------------|
| **2B** | Configuración → settings | Menús, metafield fallbacks, `collection.json`, page template, section group defaults |
| **3** | Assets + CDN | CDN `0658/2445/6946`, self-host Bootstrap/GSAP/Splide, fuentes Turnkey |
| **4** | Tokens visuales | `--color-chocolat`, `#372223`, schemes UUID, Typekit/Google cleanup |
| **5** | Refactor JS/CSS | Consolidar Splide init, evaluar jQuery/Bootstrap, dual-stack fonts |
| **6** | Release | `theme_info` Devmon, install guide, QA portabilidad |

---

## Notas metodológicas

- Auditoría ejecutada sobre working tree post-Fase 1 (contenido neutralizado; infraestructura intacta).
- `layout/password.liquid` **no carga stack Wagon** — password page es Heritage puro (portable).
- `snippets/scripts.liquid` + importmap Heritage **no dependen** de CDN Wagon; stacks coexisten sin integración.
- Handles `collection.handle == 'all'` en PLP son **portables** (handle estándar Shopify).
- No se modificó ningún archivo del theme durante esta fase.

---

## Siguiente paso recomendado

**Fase 2B — Convertir hardcodes de configuración en settings:**

1. Añadir `link_list` setting para nav Wagon en `header.liquid` (reemplazar `linklists.navbar`).
2. Documentar + fallback para `custom.main_picture`.
3. Crear `templates/collection.json` con `main-collection`.
4. Resetear defaults de menús en `footer-group.json` a vacío.
5. Corregir `templates/page.json` → `main-page`.
