# Fase 2C.3 — Tipografía Devmon (Typography Tokens)

**Fecha:** 2026-07-03  
**Alcance:** Sistema tipográfico oficial en `assets/master.css` únicamente.  
**Objetivo:** Definir fuentes Devmon (Reckless Condensed, PP Mori, IBM Plex Mono) y reemplazar referencias legacy/Shopify por aliases semánticos.

---

## Resumen ejecutivo

Se creó la sección **Devmon Typography Tokens** en `:root` con tres familias base y cuatro aliases semánticos. Todas las `font-family` de clases Wagon en `master.css` (`.he-*`, `.bo-*`, `.sp-i`, `.number-i`, botones) apuntan ahora a `--font-display`, `--font-body` o `--font-mono`.

Se eliminó la dependencia de variables Shopify (`--font-heading--family`, `--font-body--family`, `--font-accent--*`) dentro de `master.css`.

**Archivo modificado:** 1. **Sin commit.**

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `assets/master.css` | Tokens tipográficos en `:root` L57–68; 12 selectores actualizados; regla `.code` añadida |

**No modificados (intencional):** `assets/wagon.css`, `assets/home.css`, `assets/fonts.css`, `layout/theme.liquid`, Liquid, JS, Theme Settings.

---

## Tokens base creados

| Token | Valor |
|-------|-------|
| `--font-reckless-condensed` | `"Reckless Condensed", serif` |
| `--font-pp-mori` | `"PP Mori", sans-serif` |
| `--font-ibm-plex-mono` | `"IBM Plex Mono", monospace` |

---

## Aliases creados

| Alias | Apunta a | Rol semántico |
|-------|----------|---------------|
| `--font-display` | `var(--font-reckless-condensed)` | Titulares display, números grandes |
| `--font-heading` | `var(--font-reckless-condensed)` | Reservado — misma familia que display |
| `--font-body` | `var(--font-pp-mori)` | Cuerpo, botones, formularios |
| `--font-mono` | `var(--font-ibm-plex-mono)` | Código, texto especial (`.sp-i`) |

**Nota:** `--font-heading` está definido para uso futuro; consumidores actuales en `master.css` usan `--font-display` para `.he-*` según el brief.

---

## Referencias reemplazadas

### Origen: variables Shopify (iteración 2C.3 anterior)

| Selector | Antes | Después |
|----------|-------|---------|
| `.he-xxl` … `.he-xxs`, `.he-l`, `.he-m` | `var(--font-heading--family)` + style/weight | `var(--font-display)` |
| `form input[type="email"]`, `.bo-xxl` … `.bo-xxs` | `var(--font-body--family)` + style/weight | `var(--font-body)` |
| `.sp-i` | `var(--font-accent--family, var(--font-body--family))` | `var(--font-mono)` |
| `.number-i` | `var(--font-heading--family)` + style/weight | `var(--font-display)` |
| `.btn-i`, `.btn-ii`, `.btn-iii` (+ hijos) | `var(--font-body--family)` + style/weight | `var(--font-body)` |

### Origen: fuentes legacy Chocolat Uzma (mapeo semántico)

| Fuente legacy | Reemplazada por | Selectores |
|---------------|-----------------|------------|
| Turnkey Condensed | `--font-display` → Reckless Condensed | `.he-*`, `.number-i` |
| stevie-sans | `--font-body` → PP Mori | `.bo-*`, `input[email]`, `.btn-*` |
| Inter | `--font-mono` → IBM Plex Mono | `.sp-i` |
| obviously-narrow | — | No presente en `master.css` |

### Regla añadida

| Selector | `font-family` |
|----------|---------------|
| `.code`, `.code *` | `var(--font-mono)` |

### Sin cambios (intencional)

| Selector | Motivo |
|----------|--------|
| `.emojis` | Stack de sistema para emoji — no es fuente de marca |

---

## Referencias externas pendientes

Estas cargas siguen activas pero **no alimentan** las familias Devmon definidas en tokens (fuentes aún no `@font-face` en theme):

| Fuente externa | Ubicación | Servía a |
|----------------|-----------|----------|
| **Turnkey Condensed CDN** | `assets/fonts.css` (9 `@font-face`) | Turnkey — nombre distinto a Reckless |
| **Typekit** `ldm7ibv.css` | `layout/theme.liquid` L50–52 | `stevie-sans`, `obviously-narrow` |
| **Google Fonts** Inter + Inter Tight | `layout/theme.liquid` L54–56 | Inter |
| **Heritage Theme Settings** | `snippets/fonts.liquid` + `theme-styles-variables.liquid` | `--font-heading--family`, etc. |

### Desconexión wagon.css (fuera de alcance)

`assets/wagon.css` sigue usando variables Shopify:

```
var(--font-body--family)     → 8 usos
var(--font-accent--family)   → 1 uso (menu drawer)
```

Hasta conectar `wagon.css` en fase posterior, cart drawer, fields y menu drawer **no** usarán PP Mori / Reckless vía tokens Devmon.

---

## Riesgos

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| Fuentes no cargadas | **Alta** | Reckless Condensed, PP Mori e IBM Plex Mono no tienen `@font-face` en theme — fallback a serif/sans/mono genéricos del sistema |
| wagon.css desconectado | **Alta** | Capa Wagon en header/cart/fields sigue en Shopify vars o fallbacks Heritage |
| `--font-heading` sin consumidor | Baja | Alias definido pero no referenciado aún en selectores |
| Pérdida de Theme Settings sync | Info | Cambiar fonts en editor ya no afecta clases `.he-*`/`.bo-*` en `master.css` |
| Imports muertos en red | Media | Typekit, Google, Turnkey CDN siguen descargándose sin uso en `master.css` |
| `font-weight` explícitos | Baja | Reglas con `font-weight: 700/800` en otros CSS pueden diferir del peso real de PP Mori |
| `letter-spacing: -5%` | Baja | Porcentajes no estándar — render variable entre familias |
| Reporte 11 obsoleto (fuentes) | Info | Conexión Shopify de reporte 11 sustituida por tokens Devmon en `master.css` |

---

## Comandos para revisar

```bash
# Sección tipográfica
grep -n 'Devmon Typography Tokens' assets/master.css

# Tokens y aliases
grep -n 'font-reckless\|font-pp-mori\|font-ibm\|font-display\|font-heading\|font-body\|font-mono' assets/master.css | head -20

# Cero referencias legacy/Shopify en master.css
grep -E 'Turnkey|stevie-sans|obviously-narrow|font-heading--|font-body--|font-accent--' assets/master.css

# Uso de aliases en selectores
grep -n 'font-family: var(--font-' assets/master.css

# Pendiente en wagon.css (no tocado)
grep -n 'font-family' assets/wagon.css

# Imports externos activos
grep -n 'typekit\|googleapis\|fonts.css' layout/theme.liquid
```

### QA visual recomendado

1. Homepage: `.he-*` debe intentar Reckless Condensed (o serif fallback); `.bo-*` → PP Mori (o sans fallback).
2. Botones `.btn-i`: PP Mori / sans-serif del sistema.
3. Elementos `.sp-i`: monospace (IBM Plex Mono o fallback).
4. Cart drawer / header Wagon: **puede diferir** — aún en `wagon.css` con vars Shopify.
5. Inspeccionar computed `font-family` en DevTools para confirmar cascada.

---

## Fuera de alcance (intencional)

- `@font-face` para Reckless / PP Mori / IBM Plex Mono
- Migrar `wagon.css` / `home.css`
- Remover Typekit, Google Fonts, `fonts.css`
- Reconectar Theme Settings
- Commit

---

## Próximo paso sugerido

**2C.4:** Cargar fuentes Devmon (`@font-face` o CDN propio) y remover imports legacy en `theme.liquid` / `fonts.css`.  
**2C.4b:** Migrar `wagon.css` de `--font-body--family` a `var(--font-body)`.
