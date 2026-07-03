# Fase 2C.5B — Corrección segura de colores en `wagon.css`

**Fecha:** 2026-07-03  
**Alcance:** Variables huérfanas, hex directos y alpha chocolat en `assets/wagon.css` únicamente.  
**Basado en:** `handoff/16-phase2c5a-wagon-color-audit.md`

---

## Resumen ejecutivo

Se corrigieron **11 referencias rotas o hardcodeadas** en `wagon.css`, mapeándolas a tokens oficiales Devmon definidos en `master.css`. Sin cambios en selectores, propiedades, spacing ni bloque MOTION.

**Archivo modificado:** 1. **Sin commit.**

---

## Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `assets/wagon.css` | 11 sustituciones de valor (7 huérfanas + 1 hex + 1 hex-alpha + 2 rgba) |

**No modificados (intencional):** `master.css`, `home.css`, `base.css`, `theme.liquid`, Liquid, JS, templates, sections, snippets, settings.

---

## Variables huérfanas corregidas

| Línea | Selector | Propiedad | Antes | Después |
|-------|----------|-----------|-------|---------|
| 21 | `body` | `background` | `var(--color-blanco)` | `var(--color-white)` |
| 85 | `.header__icon--summary … span.line` | `background` | `var(--color-blanco)` | `var(--color-white)` |
| 89 | `.menu-drawer.color-scheme-1` | `background` | `var(--color-azul-oscuro)` | `var(--color-900)` |
| 90 | `.menu-drawer.color-scheme-1` | `color` | `var(--color-blanco)` | `var(--color-white)` |
| 98 | `.menu-drawer … ul.menu-drawer__menu.has-submenu a` | `color` | `var(--color-blanco)` | `var(--color-white)` |
| 2240 | `.product-i-option--pill input:checked + label` | `color` | `var(--color-cream)` | `var(--color-inner-glow)` |
| 2418 | `.field-wagon input/textarea` (media query) | `color` | `var(--color-azul-oscuro)` | `var(--color-900)` |

**Totales:** 4× `--color-blanco`, 2× `--color-azul-oscuro`, 1× `--color-cream`.

---

## Hex / rgba corregidos

| Línea | Selector | Propiedad | Antes | Después |
|-------|----------|-----------|-------|---------|
| 1654 | `.card-shopping-product-i` | `border` | `#37222342` | `color-mix(in srgb, var(--color-900) 26%, transparent)` |
| 3076 | `.field-wagon input/textarea` | `border` | `rgba(55, 34, 35, 0.50)` | `color-mix(in srgb, var(--color-900) 50%, transparent)` |
| 3213 | `.field-wagon input/textarea` | `border` | `rgba(55, 34, 35, 0.50)` | `color-mix(in srgb, var(--color-900) 50%, transparent)` |
| 3229 | `.field-wagon label>strong` | `color` | `#F2272B` | `var(--color-wild-pulse)` |

---

## Verificación estática post-cambio

| Patrón | Resultado |
|--------|-----------|
| `--color-blanco` | **0** |
| `--color-azul-oscuro` | **0** |
| `--color-cream` | **0** |
| Hex `#…` en `wagon.css` | **0** |
| `rgba(55, 34, 35` | **0** |
| `rgb(255, 121, 31)` (MOTION) | **76** — intacto ✓ |
| Legacy aliases (`--color-chocolat`, etc.) | **103** — sin cambio ✓ |

---

## Referencias pendientes (Fase 2C.5C+)

| Item | Ocurrencias | Fase sugerida |
|------|-------------|---------------|
| `rgb(255, 121, 31)` en keyframes MOTION L460–1410 | 76 | 2C.5C — bloque SVG |
| Bulk alias → token oficial (`chocolat` → `--color-900`, etc.) | ~103 | 2C.5D — mecánico |
| Legacy aliases en `home.css` | ~40+ | 2C.5E — home.css |
| Range slider hex en `master.css` | 5 | 2C.5F — master.css |
| Tokens alpha dedicados en `master.css` (`--color-900-alpha-26`) | 0 | Opcional — DRY para color-mix |

---

## Riesgos

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| `color-mix()` soporte | Media | Safari 16.2+, Chrome 111+, Firefox 113+ — acceptable para Shopify 2026 |
| Drawer fondo `--color-900` | Baja | Sustituye `--color-azul-oscuro` indefinido; validar contraste texto blanco |
| `#F2272B` → wild-pulse | Baja | Shift sutil `#F2272B` → `#E60259` en labels form |
| Pill selected text inner-glow | Baja | `--color-cream` → inner-glow sobre fondo chocolat — verificar legibilidad |
| Alpha 26% vs `#37222342` | Baja | Aproximación; hex tenía ~26% alpha en canal |
| Field L2418 color `--color-900` | Info | Alineado con otros breakpoints que usan `--color-chocolat` |

---

## Comandos de verificación

```bash
# Diff del cambio
git diff assets/wagon.css

# Cero huérfanas y hex
grep -nE 'color-blanco|color-azul|color-cream|#[0-9A-Fa-f]{3,8}|rgba\(55' assets/wagon.css

# MOTION intacto
grep -c 'rgb(255, 121, 31)' assets/wagon.css

# Nuevos tokens usados
grep -n 'color-white\|color-900\|color-inner-glow\|color-wild-pulse\|color-mix' assets/wagon.css

# Legacy aliases sin tocar
grep -c 'var(--color-chocolat)' assets/wagon.css

# master.css intacto
git diff assets/master.css
```

### QA manual

1. **Body** — fondo blanco `#FFFFFF`.
2. **Menu drawer mobile** — fondo `#380012`, texto blanco.
3. **PLP card** — borde sutil alpha en reposo; sólido en hover.
4. **Form fields** — borde 50% alpha; label `<strong>` en wild-pulse.
5. **PDP pill selected** — texto inner-glow sobre fondo oscuro.
6. **Footer SVG animation** — sigue naranja legacy (pendiente 2C.5C).

---

## Fuera de alcance (intencional)

- Bloque MOTION / keyframes
- Bulk replace legacy aliases
- `master.css`, `home.css`
- Commit

---

## Próximo paso sugerido

**Fase 2C.5C:** Migrar bloque MOTION `rgb(255, 121, 31)` → `--color-wild-pulse` vía custom property RGB.

---

**Estado:** Implementación completa. Sin commit.
