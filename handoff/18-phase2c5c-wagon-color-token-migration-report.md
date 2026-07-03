# Fase 2C.5C — Migración aliases legacy → tokens Devmon en `wagon.css`

**Fecha:** 2026-07-03  
**Alcance:** Reemplazo mecánico de aliases legacy por tokens oficiales en `assets/wagon.css`.  
**Basado en:** `handoff/16-phase2c5a-wagon-color-audit.md`, `handoff/17-phase2c5b-wagon-safe-color-fixes-report.md`

---

## Resumen ejecutivo

Se migraron **88 referencias** de aliases legacy Chocolat Uzma a tokens oficiales Devmon Design Tokens v1. Solo se modificaron valores `var(...)`; selectores, propiedades y el bloque MOTION permanecen intactos.

**Archivo modificado:** 1. **Sin commit.**

---

## Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `assets/wagon.css` | 88 sustituciones `var()` legacy → token oficial |

**No modificados:** `master.css`, `home.css`, bloque MOTION, layout, Liquid, JS, templates, sections, settings.

---

## Reemplazos aplicados

| Alias legacy | Token Devmon | Ocurrencias |
|--------------|--------------|-------------|
| `var(--color-chocolat)` | `var(--color-900)` | **61** |
| `var(--color-orange)` | `var(--color-wild-pulse)` | **9** |
| `var(--color-ivory)` | `var(--color-inner-glow)` | **12** |
| `var(--color-light-ivory)` | `var(--color-100)` | **3** |
| `var(--color-tumeric)` | `var(--color-300)` | **2** |
| `var(--color-dark-ivory)` | `var(--color-200)` | **1** |
| **Total** | | **88** |

---

## Zonas afectadas (sin cambio estructural)

| Zona | Tokens predominantes |
|------|---------------------|
| Header / navbar / submenu | `--color-900`, `--color-inner-glow`, `--color-300` |
| Superhero | `--color-900`, `--color-inner-glow` |
| Bigmenu / btn-active-menu | `--color-900` |
| PLP cards / filters drawer | `--color-900`, `--color-100`, `--color-inner-glow`, `--color-wild-pulse` |
| PDP variants (radio/pill) | `--color-wild-pulse`, `--color-900`, `--color-inner-glow` |
| About sections | `--color-900`, `--color-200`, `--color-100` |
| Responsive `.field-wagon` | `--color-900` |

---

## Verificación estática

| Check | Resultado |
|-------|-----------|
| `--color-chocolat` en `wagon.css` | **0** |
| `--color-orange` | **0** |
| `--color-tumeric` | **0** |
| `--color-ivory` | **0** |
| `--color-light-ivory` | **0** |
| `--color-dark-ivory` | **0** |
| `rgb(255, 121, 31)` (MOTION) | **76** — intacto ✓ |
| Tokens oficiales Devmon en uso | **88+** (incl. fixes 2C.5B previos) |

### Tokens Devmon ya presentes desde 2C.5B (sin reemplazo en esta fase)

| Token | Origen |
|-------|--------|
| `var(--color-white)` | Huérfanas 2C.5B |
| `color-mix(… var(--color-900) …)` | Alpha borders 2C.5B |
| `var(--color-wild-pulse)` | Label form 2C.5B + 9 orange migrados |

---

## Referencias pendientes

| Item | Ubicación | Fase sugerida |
|------|-----------|---------------|
| `rgb(255, 121, 31)` keyframes MOTION L460–1410 | `wagon.css` | 2C.5D |
| Legacy aliases en `home.css` | `assets/home.css` | 2C.5E |
| Range slider hex en `master.css` | `assets/master.css` | 2C.5F |
| Aliases legacy en `master.css` `:root` | Mantener — otros consumidores pueden existir | — |

---

## Riesgos

| Riesgo | Severidad | Notas |
|--------|-----------|-------|
| Comportamiento visual | **Ninguno** | Tokens oficiales = mismos valores que aliases vía `master.css` |
| Regresión por typo | Baja | Replace_all verificado con grep |
| MOTION naranja legacy | Info | 76 reglas siguen `#FF791F` — inconsistente con wild-pulse hasta 2C.5D |
| `home.css` desalineado | Media | Sigue usando aliases legacy |

---

## Comandos de verificación

```bash
# Diff
git diff assets/wagon.css

# Cero legacy en wagon
grep -E 'color-chocolat|color-orange|color-tumeric|color-ivory|color-light-ivory|color-dark-ivory' assets/wagon.css

# MOTION intacto
grep -c 'rgb(255, 121, 31)' assets/wagon.css

# Conteo tokens oficiales
grep -c 'var(--color-900)' assets/wagon.css
grep -c 'var(--color-wild-pulse)' assets/wagon.css
grep -c 'var(--color-inner-glow)' assets/wagon.css
grep -c 'var(--color-100)' assets/wagon.css
grep -c 'var(--color-300)' assets/wagon.css
grep -c 'var(--color-200)' assets/wagon.css

# master.css intacto
git diff assets/master.css
```

### QA manual

1. Header, submenu, minishop — tonos oscuros/claros coherentes.
2. PLP cards hover — bordes y fondos.
3. PDP radio/pill variants — wild-pulse en swatches.
4. Filters drawer — fondos inner-glow, acentos wild-pulse.
5. Footer SVG animation — **sigue naranja legacy** (esperado).

---

## Fuera de alcance

- Bloque MOTION / keyframes
- `master.css`, `home.css`
- Commit

---

## Próximo paso sugerido

**Fase 2C.5D:** Migrar `rgb(255, 121, 31)` → `--color-wild-pulse` en keyframes MOTION.

---

**Estado:** Implementación completa. Sin commit.
