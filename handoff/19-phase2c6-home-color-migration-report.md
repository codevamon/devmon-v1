# Fase 2C.6 — Migración colores Devmon en `home.css`

**Fecha:** 2026-07-03  
**Alcance:** Migración de aliases legacy y hex directo a tokens oficiales Devmon en `assets/home.css`.  
**Basado en:** `handoff/16-phase2c5a-wagon-color-audit.md`, `handoff/18-phase2c5c-wagon-color-token-migration-report.md`

---

## Resumen ejecutivo

Se migraron **38 referencias** legacy `var()` y **1 hex** directo en `home.css` al sistema Devmon Design Tokens v1. Sin cambios en selectores, propiedades, spacing, animaciones ni layout.

**Archivo modificado:** 1. **Total sustituciones:** 39. **Sin commit.**

---

## Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `assets/home.css` | 38× `var()` legacy + 1× hex gradient |

**No modificados:** `master.css`, `wagon.css`, `base.css`, `theme.liquid`, Liquid, JS, templates, sections, snippets, settings.

---

## Cantidad de reemplazos

### Aliases legacy → tokens oficiales

| Alias legacy | Token Devmon | Ocurrencias |
|--------------|--------------|-------------|
| `var(--color-chocolat)` | `var(--color-900)` | **21** |
| `var(--color-ivory)` | `var(--color-inner-glow)` | **13** |
| `var(--color-light-ivory)` | `var(--color-100)` | **3** |
| `var(--color-tumeric)` | `var(--color-300)` | **1** |
| `var(--color-orange)` | — | **0** (no existía) |
| `var(--color-dark-ivory)` | — | **0** (no existía) |
| **Subtotal legacy** | | **38** |

### Hex / valores directos corregidos

| Línea | Selector | Propiedad | Antes | Después |
|-------|----------|-----------|-------|---------|
| 164 | `section.collections-i .in-collections-i:before` | `background` | `linear-gradient(0, #000000d4, transparent)` | `linear-gradient(0, color-mix(in srgb, var(--color-core-power) 83%, transparent), transparent)` |

**Equivalencia:** `#000000d4` = negro al ~83% alpha → `--color-core-power` (#000000).

### Variables huérfanas

| Variable | Resultado |
|----------|-----------|
| `--color-blanco` | **0** — no presente |
| `--color-azul-oscuro` | **0** — no presente |
| `--color-cream` | **0** — no presente |

### rgba derivados de Chocolat

| Patrón | Resultado |
|--------|-----------|
| `rgba(55, 34, 35` / `#372223` | **0** — no presente en `home.css` |

---

## Zonas afectadas

| Sección | Tokens usados |
|---------|---------------|
| Favorites | `--color-inner-glow`, `--color-900` |
| Collections | `--color-inner-glow`, gradient `--color-core-power` |
| Marquee | `--color-inner-glow` |
| Reviews | `--color-900`, `--color-100` |
| Visit | `--color-900`, `--color-inner-glow` |
| Get in touch | `--color-900`, `--color-100` |
| Footer | `--color-300`, `--color-900` |
| Shopping (PLP sidebar) | `--color-100`, `--color-900` |

---

## Referencias legacy restantes

| Patrón | `home.css` |
|--------|------------|
| `--color-chocolat` | **0** |
| `--color-orange` | **0** |
| `--color-tumeric` | **0** |
| `--color-ivory` | **0** |
| `--color-light-ivory` | **0** |
| `--color-dark-ivory` | **0** |

**Capa Wagon completa (`wagon.css` + `home.css`):** aliases legacy eliminados en ambos archivos CSS Wagon de homepage/PLP.

---

## Hex restantes

| Patrón | `home.css` |
|--------|------------|
| `#…` hex directo | **0** |
| `rgb()` / `rgba()` directo | **0** |
| `hsl()` | **0** |

---

## Riesgos

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| Comportamiento visual | **Ninguno** | Tokens oficiales = mismos valores que aliases vía `master.css` |
| Gradient alpha 83% | Baja | `#000000d4` ≈ `color-mix(83%)` — ligera diferencia posible en bordes del gradient |
| `color-mix()` soporte | Baja | Baseline 2023+ browsers |
| Range slider PLP | Info | `.range-shopping-i` vive en `master.css` con hex legacy — fuera de alcance |
| MOTION `wagon.css` | Info | 76× `rgb(255,121,31)` pendiente 2C.5D |
| Typo L158 `absolute;ñ` | Info | Preexistente; no tocado (fuera de alcance) |

---

## Comandos de verificación

```bash
# Diff
git diff assets/home.css

# Cero legacy en home
grep -E 'color-chocolat|color-orange|color-tumeric|color-ivory|color-light-ivory|color-dark-ivory' assets/home.css

# Cero hex/rgb directo
grep -nE '#[0-9A-Fa-f]{3,8}|rgba?\(' assets/home.css

# Tokens oficiales en uso
grep -c 'var(--color-900)' assets/home.css
grep -c 'var(--color-inner-glow)' assets/home.css
grep -c 'var(--color-100)' assets/home.css
grep -c 'var(--color-300)' assets/home.css
grep -c 'color-core-power' assets/home.css

# master/wagon intactos
git diff assets/master.css assets/wagon.css
```

### QA manual

1. **Favorites** — fondo inner-glow, tags chocolat/ivory invert en `.darker`.
2. **Collections** — overlay gradient inferior sobre imagen; paginación Splide ivory.
3. **Marquee** — fondo inner-glow.
4. **Reviews / Get in touch / Shopping** — fondos `--color-100`, texto `--color-900`.
5. **Footer** — fondo `--color-300`, links `--color-900`.
6. **Visit** — cards inner-glow sobre imágenes.

---

## Fuera de alcance

- `master.css` range slider hex
- `wagon.css` MOTION keyframes
- Aliases legacy en `:root` de `master.css` (mantener compatibilidad otros consumidores)
- Commit

---

## Próximo paso sugerido

**Fase 2C.5D:** Migrar bloque MOTION `rgb(255, 121, 31)` en `wagon.css`.  
**Fase 2C.7:** Range slider y hex sueltos en `master.css`.

---

**Estado:** Implementación completa. Sin commit.
