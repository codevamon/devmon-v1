# Fase 3B — Fixes seguros en `master.css`

**Fecha:** 2026-07-04  
**Alcance:** Corrección de bugs y valores legacy sueltos en `assets/master.css`. Sin reorganización.  
**Basado en:** `handoff/20-master-css-architecture.md`

---

## Resumen ejecutivo

Se aplicaron **11 correcciones puntuales** en `master.css`: 1 variable huérfana, 6 valores hex en range slider, 2 aliases en thumbs del slider, y 3 declaraciones `padding` con sintaxis inválida. Sin cambios en estructura, media queries duplicadas, clases muertas ni nombres de clases.

**Archivo modificado:** 1. **Sin commit.**

---

## Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `assets/master.css` | 11 sustituciones en 4 zonas |

**No modificados:** `wagon.css`, `home.css`, `base.css`, layout, Liquid, JS, templates, sections, snippets, settings.

---

## Fixes aplicados

### 1. Variable huérfana

| Línea | Selector | Propiedad | Antes | Después |
|-------|----------|-----------|-------|---------|
| ~465 | `.header-menu nav a:after` | `background` | `var(--color-blanco)` | `var(--color-white)` |

### 2. Range slider — hex legacy → tokens Devmon

| Línea | Selector | Antes | Después |
|-------|----------|-------|---------|
| ~106 | `.range-shopping-i` | `background: #F9EAD6` | `var(--color-200)` |
| ~117–120 | `.range-shopping-i::-webkit-slider-runnable-track` gradient | `#FF791F` / `#F9EAD6` | `var(--color-wild-pulse)` / `var(--color-200)` |
| ~127 | `.range-shopping-i::-moz-range-track` | `background: #F9EAD6` | `var(--color-200)` |

**Mapeo visual:**
| Hex legacy | Token Devmon | Hex efectivo |
|------------|--------------|--------------|
| `#FF791F` (naranja CU) | `--color-wild-pulse` | `#E60259` |
| `#F9EAD6` (dark ivory CU) | `--color-200` | `#FFDCE0` |

### 3. Range slider — alias legacy en thumbs

| Línea | Selector | Antes | Después |
|-------|----------|-------|---------|
| ~135 | `.range-shopping-i::-webkit-slider-thumb` | `var(--color-chocolat)` | `var(--color-900)` |
| ~142 | `.range-shopping-i::-moz-range-thumb` | `var(--color-chocolat)` | `var(--color-900)` |

**Nota:** `--color-chocolat` en botones `.btn-chocolat` (L310–356) **no tocado** — fuera del alcance explícito de este fix.

### 4. Sintaxis CSS inválida — `.btn-iii`

| Línea | Media query | Antes | Después |
|-------|-------------|-------|---------|
| ~557 | `(min-width:1600px)` | `padding:vw 0.5vw 1.5vw` | `padding: 0.5vw 0.5vw 1.5vw` |
| ~686 | `(1200px–1600px)` | `padding:vw 0.5vw 1.5vw` | `padding: 0.5vw 0.5vw 1.5vw` |
| ~812 | `(992px–1200px)` | `padding:vw 0.5vw 1.5vw` | `padding: 0.5vw 0.5vw 1.5vw` |

**Razonamiento:** el primer token `vw` carecía de valor numérico. Se asumió `0.5vw` como padding-top para preservar la intención de 3 valores (top / horizontal / bottom) sin alterar los otros dos.

---

## Verificación estática post-cambio

| Patrón | Resultado |
|--------|-----------|
| `--color-blanco` | **0** |
| `#FF791F` | **0** |
| `#F9EAD6` | **0** |
| `padding:vw` | **0** |
| `var(--color-chocolat)` en range slider | **0** |
| `var(--color-chocolat)` en botones | **10** — intacto ✓ |

---

## Riesgos

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| Range slider color shift | **Media** | Track pasa de naranja/crema CU a wild-pulse/rosa `--color-200` — alineado con Devmon |
| `.btn-iii` padding top | **Baja** | `0.5vw` top es inferencia; validar en `sections/master.liquid` demo |
| Header underline blanco | **Baja** | `--color-white` corrige var indefinida; comportamiento esperado |
| `linear-gradient` con CSS vars | **Baja** | Soporte amplio en browsers modernos |

---

## Pendiente (fuera de alcance 3B)

| Item | Fase sugerida |
|------|---------------|
| `var(--color-chocolat)` en `.btn-chocolat` / outline | 3H legacy sunset |
| 7 bloques `@media` duplicados (~850 líneas) | 3D dedup |
| Clases muertas (`.gap-vii-x`, `.footer-i`, `.tag-i`, `.link-iii`) | 3F prune |
| `.flex-ii`, `.btn-icon-ii` misplaced en width utils | 3E |
| `.btn-i` duplicate `display:flex` L296–301 | 3C+ |
| Comentarios banner L1–6 | 3C headers |
| MOTION `rgb(255,121,31)` en `wagon.css` | 2C.5D |
| Reorganización secciones 01–10 | 3C–3G |

---

## Comandos de verificación

```bash
# Diff
git diff assets/master.css

# Cero huérfanos y hex en master
grep -nE 'color-blanco|#FF791F|#F9EAD6|padding:vw' assets/master.css

# Range slider tokens
grep -n 'range-shopping' assets/master.css | head -20

# Chocolat solo en botones (no slider)
grep -n 'color-chocolat' assets/master.css

# Otros archivos intactos
git diff assets/wagon.css assets/home.css
```

### QA manual

1. **PLP filters** — range slider: track rosa/wild-pulse, thumb `#380012`.
2. **Heritage header** — underline nav links visible en hover (blanco).
3. **`sections/master.liquid`** — botón `.btn-iii` en breakpoints XL/LG/MD sin padding roto.

---

## Fuera de alcance (intencional)

- Reorganización / mover bloques
- Eliminar clases muertas
- Dedup media queries
- Renombrar clases `btn-chocolat`
- Commit

---

**Estado:** Implementación completa. Sin commit.
