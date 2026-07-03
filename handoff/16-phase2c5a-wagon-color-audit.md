# Fase 2C.5A — Auditoría de colores en `wagon.css`

**Fecha:** 2026-07-03  
**Alcance:** Solo lectura — `assets/wagon.css` auditado contra tokens Devmon en `assets/master.css`.  
**Objetivo:** Mapear todos los colores para migración al sistema oficial Devmon Design Tokens v1.

---

## Resumen ejecutivo

`wagon.css` contiene **~167 referencias de color** repartidas en:

| Categoría | Ocurrencias | Estado vs Devmon |
|-----------|-------------|------------------|
| Legacy aliases (`--color-chocolat`, etc.) | **103** | Resuelven vía aliases en `master.css` — funcional pero no usan tokens oficiales directos |
| Variables huérfanas (`--color-blanco`, `--color-azul-oscuro`, `--color-cream`) | **7** | **No definidas** en `master.css` — riesgo alto |
| Hex directo | **2** | Hardcode Chocolat Uzma — no siguen paleta |
| `rgb()` / `rgba()` directo | **78** | 76× naranja legacy en keyframes SVG + 2× borde chocolat alpha |
| `hsl()` | **0** | — |

**Conclusión:** La mayoría del archivo ya hereda la paleta Devmon *indirectamente* por aliases legacy (2C.2). Los bloqueadores reales son **7 vars huérfanas**, **80 valores hardcodeados** (hex/rgb/rgba) y la **inconsistencia semántica** (legacy names vs `--color-900`, `--color-wild-pulse`, etc.).

---

## Referencia — Tokens Devmon (`master.css` :root)

| Token oficial | Hex | Alias legacy (si existe) |
|---------------|-----|--------------------------|
| `--color-inner-glow` | `#FCFBE3` | `--color-ivory` |
| `--color-100` | `#FFEDED` | `--color-light-ivory` |
| `--color-200` | `#FFDCE0` | `--color-dark-ivory` |
| `--color-300` | `#FFB6D2` | `--color-tumeric` |
| `--color-400` | `#FF7AA4` | — |
| `--color-500` | `#FF427E` | — |
| `--color-wild-pulse` | `#E60259` | `--color-orange` |
| `--color-600` | `#B8003A` | — |
| `--color-700` | `#8A002C` | — |
| `--color-800` | `#61001F` | — |
| `--color-900` | `#380012` | `--color-chocolat` |
| `--color-core-power` | `#000000` | — |
| `--color-white` | `#FFFFFF` | — |

---

## Inventario por token legacy

| Token en `wagon.css` | Usos | Ya mapea a (vía alias) | Token Devmon recomendado |
|----------------------|------|--------------------------|--------------------------|
| `--color-chocolat` | **61** | `--color-900` | `var(--color-900)` |
| `--color-orange` | **9** | `--color-wild-pulse` | `var(--color-wild-pulse)` |
| `--color-ivory` | **12** | `--color-inner-glow` | `var(--color-inner-glow)` |
| `--color-light-ivory` | **3** | `--color-100` | `var(--color-100)` |
| `--color-dark-ivory` | **1** | `--color-200` | `var(--color-200)` |
| `--color-tumeric` | **2** | `--color-300` | `var(--color-300)` |
| `--color-blanco` | **4** | *(indefinido)* | `var(--color-white)` |
| `--color-azul-oscuro` | **2** | *(indefinido)* | `var(--color-900)` o `var(--color-800)` † |
| `--color-cream` | **1** | *(indefinido)* | `var(--color-inner-glow)` |

† Drawer oscuro: `--color-900` (#380012) alinea con rol “fondo oscuro de marca”; validar contraste con `--color-white` en texto.

---

## Tabla detallada — Variables huérfanas (prioridad ALTA)

| Línea | Selector | Propiedad | Token actual | Token Devmon recomendado | Prioridad | Riesgo visual |
|-------|----------|-----------|--------------|--------------------------|-----------|---------------|
| 21 | `body` | `background` | `var(--color-blanco)` | `var(--color-white)` | **Alta** | Body sin fondo definido hoy → fallback inválido |
| 85 | `.header__icon--summary … span.line` | `background` | `var(--color-blanco)` | `var(--color-white)` | **Alta** | Líneas hamburger invisibles/incorrectas |
| 89 | `.menu-drawer.color-scheme-1` | `background` | `var(--color-azul-oscuro)` | `var(--color-900)` | **Alta** | Drawer sin fondo oscuro |
| 90 | `.menu-drawer.color-scheme-1` | `color` | `var(--color-blanco)` | `var(--color-white)` | **Alta** | Texto drawer |
| 98 | `.menu-drawer … a` | `color` | `var(--color-blanco)` | `var(--color-white)` | **Alta** | Links drawer |
| 2240 | `.product-i-option--pill input:checked + label` | `color` | `var(--color-cream)` | `var(--color-inner-glow)` | **Alta** | Pill seleccionado — texto posiblemente heredado incorrecto |
| 2418 | `.field-wagon input/textarea` (media) | `color` | `var(--color-azul-oscuro)` | `var(--color-900)` | **Media** | Inputs — posible inconsistencia con `chocolat` en otros breakpoints |

---

## Tabla detallada — Hex / rgb / rgba directos (prioridad ALTA)

| Línea(s) | Selector / contexto | Propiedad | Valor actual | Equiv. legacy | Token Devmon recomendado | Prioridad | Riesgo visual |
|----------|----------------------|-----------|--------------|---------------|--------------------------|-----------|---------------|
| 1654 | `.card-shopping-product-i` | `border` | `#37222342` | `#372223` @ ~26% alpha | `color-mix(in srgb, var(--color-900) 26%, transparent)` o nuevo token `--color-900-alpha-26` en `master.css` | **Alta** | Borde PLP card — **único hex con alpha** |
| 3076 | `.field-wagon input/textarea` (media) | `border` | `rgba(55, 34, 35, 0.50)` | `#372223` @ 50% | `color-mix(in srgb, var(--color-900) 50%, transparent)` | **Alta** | Duplicado semántico de L1654 en otro breakpoint |
| 3213 | `.field-wagon input/textarea` (media) | `border` | `rgba(55, 34, 35, 0.50)` | idem | idem | **Alta** | Tercera instancia mismo borde alpha |
| 3229 | `.field-wagon label>strong` | `color` | `#F2272B` | Rojo suelt (~≠ wild-pulse) | `var(--color-wild-pulse)` o `var(--color-500)` | **Alta** | Label formulario — rojo hardcode fuera de sistema |
| 466–1410 | `@keyframes animate-svg-fill-1` … `-38` (×38 pares webkit+standard) | `fill` | `rgb(255, 121, 31)` | `#FF791F` naranja CU | `var(--color-wild-pulse)` † | **Alta** | Animación SVG footer/motion — **76 reglas** |

† **Nota keyframes:** `@keyframes` no interpolan custom properties en todos los browsers si se usa `fill: var(--x)` con cambio de var. Estrategia 2C.5B: definir `--color-wild-pulse-rgb: 230, 2, 89` en `master.css` y usar `fill: rgb(var(--color-wild-pulse-rgb))`, o reemplazar bloque MOTION L460–1410 en un solo paso atómico.

**No encontrados:** `#372223` sin alpha como hex literal (solo vía rgba). `#F2272B` solo L3229.

---

## Tabla por zona — Legacy aliases (prioridad MEDIA)

Migración recomendada: reemplazar alias → token oficial (comportamiento idéntico hoy, desacopla de nombres Chocolat Uzma).

### HEADER (L19–~450)

| Línea | Selector | Propiedad | Token actual | → Devmon | Riesgo |
|-------|----------|-----------|--------------|----------|--------|
| 24 | `.header__row.header__row--top` | `color` | `--color-chocolat` | `--color-900` | Bajo |
| 122 | `header-component … figure.detail-i:before` | `background` | `--color-tumeric` | `--color-300` | Bajo — acento decorativo header |
| 155 | `…navbar-menu-i__submenu` | `background` | `--color-ivory` | `--color-inner-glow` | Bajo |
| 156 | idem | `color` | `--color-chocolat` | `--color-900` | Bajo |
| 200 | *(submenu links — ver archivo ~L200)* | `color` | `--color-chocolat` | `--color-900` | Bajo |
| 249 | `section.superhero-i .item-superhero-1` | `background` | `--color-chocolat` | `--color-900` | **Medio** — hero panel oscuro |
| 250 | idem | `color` | `--color-ivory` | `--color-inner-glow` | Bajo |

### MOTION / BIGMENU (L1436–1488)

| Línea | Selector | Propiedad | Token actual | → Devmon | Riesgo |
|-------|----------|-----------|--------------|----------|--------|
| 1436 | `button.btn-active-menu span.in span` | `background` | `--color-chocolat` | `--color-900` | Bajo |
| 1467 | `.bigmenu ul li a` | `color` | `--color-chocolat` | `--color-900` | Bajo |
| 1481 | `.bigmenu .social-bigmenu a` | `color` | `--color-chocolat` | `--color-900` | Bajo |
| 1487 | `.bigmenu .data-bigmenu *` | `color` | `--color-chocolat` | `--color-900` | Bajo |

### PLP / SHOPPING (L1650–1815)

| Línea | Selector | Propiedad | Token actual | → Devmon | Riesgo |
|-------|----------|-----------|--------------|----------|--------|
| 1651 | `.data-link-shopping-product-i *` | `color` | `--color-chocolat` | `--color-900` | Bajo |
| 1656 | `.card-shopping-product-i` | `background` | `--color-light-ivory` | `--color-100` | Bajo |
| 1659 | `.card-shopping-product-i:hover` | `border` | `--color-chocolat` | `--color-900` | Bajo |
| 1660 | idem | `background` | `--color-ivory` | `--color-inner-glow` | Bajo |
| 1683–1691 | `#filters-drawer` / dialog | `background`, `color` | `--color-ivory`, `--color-chocolat` | inner-glow, `--color-900` | Bajo |
| 1695 | `.facets-drawer__close *` | `color` | `--color-orange` | `--color-wild-pulse` | Bajo |
| 1713 | `.facets-drawer__filters nav.menu-shopping-i` | `border-bottom` | `--color-chocolat` | `--color-900` | Bajo |
| 1724–1814 | Facets / mobile filters | varios | `--color-ivory`, `--color-chocolat` | inner-glow, `--color-900` | Bajo |

### PRODUCT / PDP (L1819–2240)

| Línea | Selector | Propiedad | Token actual | → Devmon | Riesgo |
|-------|----------|-----------|--------------|----------|--------|
| 1820 | `section.product-i` | `background` | `--color-light-ivory` | `--color-100` | Bajo |
| 1831–1843 | `.description-product-i`, quantity | `color`, `border` | `--color-chocolat` | `--color-900` | Bajo |
| 1865, 1892, 1903, 1917, 1939 | Radio variant options | `border`, `background` | `--color-orange` | `--color-wild-pulse` | **Medio** — swatches visibles |
| 1957–2070 | Pill variants | bg/border/color | `--color-chocolat`, `--color-ivory` | `--color-900`, inner-glow | **Medio** |
| 2106–2107 | Badge / highlight | bg/color | `--color-tumeric`, `--color-chocolat` | `--color-300`, `--color-900` | Bajo |
| 2194, 2203 | Focus / selected borders | `border` | `--color-orange` | `--color-wild-pulse` | Medio |

### ABOUT (L2288–2303)

| Línea | Selector | Propiedad | Token actual | → Devmon | Riesgo |
|-------|----------|-----------|--------------|----------|--------|
| 2289–2290 | `section.about-i` | `color`, `background` | `--color-chocolat`, `--color-dark-ivory` | `--color-900`, `--color-200` | Bajo |
| 2302–2303 | `section.about-ii` | `background`, `color` | `--color-light-ivory`, `--color-chocolat` | `--color-100`, `--color-900` | Bajo |

### RESPONSIVE `.field-wagon` borders (L2417–3214)

| Líneas | Contexto | Propiedad | Token actual | → Devmon | Riesgo |
|--------|----------|-----------|--------------|----------|--------|
| 2417, 2563, 2694, 2837, 2967 | `.field-wagon input/textarea` (5 breakpoints) | `border` | `--color-chocolat` | `--color-900` | Bajo |
| 2418 | idem (breakpoint 1) | `color` | `--color-azul-oscuro` | `--color-900` | Medio — ver huérfanas |
| 2564, 2695, 2838, 2968, 3214 | otros breakpoints | `color` | `--color-chocolat` | `--color-900` | Bajo |

### OTROS selectores sueltos con `--color-chocolat` (L1556–3081)

Incluye: `.header-actions`, minishop, breadcrumbs, shipping, cart, pagination — **~25 usos adicionales** con patrón `color` / `border` / `background` → migración mecánica a `--color-900`. Riesgo bajo individual; alto en volumen (regresión por typo).

---

## Valores especiales (sin cambio de token)

| Línea | Valor | Notas |
|-------|-------|-------|
| 26 | `background-color: transparent` | OK — no migrar |
| 181 | `color: currentColor` | OK — hereda |
| 1496, 1834 | `background: transparent` | OK |

---

## hsl()

**0 ocurrencias** en `wagon.css`.

---

## Plan de cambios atómicos (Fase 2C.5B+)

### Prompt 2 — Huérfanas (1 archivo, ~7 líneas)

**Archivo:** `wagon.css`  
**Cambio:** `--color-blanco` → `--color-white`; `--color-azul-oscuro` → `--color-900`; `--color-cream` → `--color-inner-glow`  
**Validar:** menu drawer, body bg, pill selected, field L2418  
**Riesgo:** Bajo — corrige vars rotas

### Prompt 3 — Bordes alpha (1 archivo, 3 líneas)

**Archivo:** `wagon.css` L1654, L3076, L3213  
**Cambio:** `#37222342` / `rgba(55,34,35,0.5)` → `color-mix(in srgb, var(--color-900) X%, transparent)`  
**Opcional en `master.css`:** token `--color-900-alpha-26`, `--color-900-alpha-50`  
**Riesgo:** Medio — verificar soporte `color-mix` (baseline 2023+)

### Prompt 4 — Form label rojo (1 línea)

**Archivo:** `wagon.css` L3229  
**Cambio:** `#F2272B` → `var(--color-wild-pulse)`  
**Riesgo:** Bajo — ligero shift `#F2272B` → `#E60259`

### Prompt 5 — SVG keyframes MOTION (bloque único L460–1410)

**Archivo:** `wagon.css`  
**Cambio:** 76× `rgb(255, 121, 31)` → estrategia con custom property RGB o `@property`  
**Pre-requisito:** añadir en `master.css`:
```css
--color-wild-pulse-rgb: 230, 2, 89;
```
**Reemplazo:** `fill: rgb(var(--color-wild-pulse-rgb));`  
**Riesgo:** **Alto** — bloque grande; probar animación footer; hacer en commit aislado

### Prompt 6 — Bulk alias → token oficial (mecánico)

**Archivo:** `wagon.css`  
**Cambios replace_all seguros:**
| Buscar | Reemplazar |
|--------|------------|
| `var(--color-chocolat)` | `var(--color-900)` |
| `var(--color-orange)` | `var(--color-wild-pulse)` |
| `var(--color-ivory)` | `var(--color-inner-glow)` |
| `var(--color-light-ivory)` | `var(--color-100)` |
| `var(--color-dark-ivory)` | `var(--color-200)` |
| `var(--color-tumeric)` | `var(--color-300)` |

**Orden:** Después de Prompts 2–5 (evitar doble trabajo en líneas ya tocadas)  
**Riesgo:** Bajo — equivalente semántico; diff grande (~103 líneas)

### Prompt 7 — Tokens alpha en `master.css` (opcional)

**Archivo:** `master.css`  
**Añadir:**
```css
--color-900-alpha-26: color-mix(in srgb, var(--color-900) 26%, transparent);
--color-900-alpha-50: color-mix(in srgb, var(--color-900) 50%, transparent);
```
**Riesgo:** Bajo — mejora reutilización en wagon + home + master range slider

---

## Matriz prioridad global

| Prioridad | Ítems | Ocurrencias | Impacto |
|-----------|-------|-------------|---------|
| **Alta** | Huérfanas + hex/rgb/rgba | **85** | Colores rotos o fuera de paleta |
| **Media** | Alias → token oficial (bulk) | **103** | Deuda nomenclatura; funciona hoy |
| **Baja** | `--color-400`…`--color-800` sin uso | 0 | Oportunidad futura acentos |

---

## Riesgos globales de migración

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Vars huérfanas sin definir | **Crítica** | Prompt 2 primero |
| Keyframes SVG 76 reglas | **Alta** | Commit aislado + QA animación |
| `color-mix` en borders | Media | Fallback `rgba()` calculado desde `--color-900` |
| `#F2272B` ≠ wild-pulse | Baja | Aceptar shift o usar `--color-500` |
| Diff masivo bulk replace | Media | `replace_all` + grep verificación |
| Drawer `--color-900` vs `--color-800` | Media | QA contraste WCAG texto blanco |
| Aliases legacy en `home.css` | Info | Auditar en 2C.5A-home (fase paralela) |

---

## Comandos para revisar

```bash
# Conteo por token
grep -c 'var(--color-chocolat)' assets/wagon.css
grep -c 'var(--color-orange)' assets/wagon.css
grep -c 'var(--color-ivory)' assets/wagon.css
grep -c 'var(--color-light-ivory)' assets/wagon.css
grep -c 'var(--color-dark-ivory)' assets/wagon.css
grep -c 'var(--color-tumeric)' assets/wagon.css

# Huérfanas
grep -n 'color-blanco\|color-azul-oscuro\|color-cream' assets/wagon.css

# Hardcodes
grep -nE '#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(' assets/wagon.css

# Cero hsl
grep -n 'hsl' assets/wagon.css

# Tokens oficiales en master (referencia)
grep -n 'color-brand\|color-inner-glow\|color-wild-pulse\|Legacy aliases' assets/master.css
```

---

## Fuera de alcance (esta fase)

- Modificar `wagon.css`, `master.css`, `home.css`
- SVG inline en Liquid
- `master.css` range slider hex (`#FF791F`, `#F9EAD6`) — auditoría separada
- Commit

---

## Referencias

| Documento | Relación |
|-----------|----------|
| `handoff/12-phase2c2-design-tokens-report.md` | Tokens Devmon + aliases |
| `handoff/09-phase2c1-visual-system-audit.md` | Auditoría visual dual |
| `assets/master.css` L28–55 | Fuente de verdad colores |

---

**Estado:** Auditoría completa. Sin modificaciones de código. Sin commit.
