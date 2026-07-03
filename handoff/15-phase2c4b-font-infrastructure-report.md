# Fase 2C.4B — Infraestructura tipográfica Devmon

**Fecha:** 2026-07-03  
**Alcance:** Orden de carga CSS + migración `wagon.css` a tokens Devmon.  
**Basado en:** `handoff/14-phase2c4a-scalable-font-system-audit.md`, `handoff/13-phase2c3-typography-report.md`

---

## Resumen ejecutivo

Se reordenó la carga de stylesheets Wagon en `layout/theme.liquid` para que `fonts.css` preceda a `master.css` (fix P4 de auditoría 2C.4A). Se migraron **9 referencias** en `assets/wagon.css` de variables Heritage (`--font-body--family`, `--font-accent--*`) a tokens Devmon (`--font-body`, `--font-display`).

Toda la capa Wagon que declaraba `font-family` explícita consume ahora el stack Devmon definido en `master.css`. Imports Typekit/Google y `fonts.css` Turnkey permanecen intactos.

**Archivos modificados:** 2. **Sin commit.**

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `layout/theme.liquid` | Reorden CSS Wagon: `fonts.css` antes de `master.css` |
| `assets/wagon.css` | 8× `--font-body--family` → `--font-body`; 1× `--font-accent--*` → `--font-display` |

**No modificados (intencional):** `master.css`, `home.css`, `base.css`, `fonts.css`, snippets Heritage, `config/`, templates, sections, JS, imports externos.

---

## Orden de carga antes / después

### Bloque Wagon en `layout/theme.liquid` (L58–62)

**Antes:**
```
wagon.css → home.css → master.css → fonts.css
```

**Después:**
```
wagon.css → home.css → fonts.css → master.css
```

### Contexto completo del `<head>` (sin cambios fuera del bloque Wagon)

```
stylesheets.liquid (base.css)
fonts.liquid (preload Heritage)
theme-styles-variables.liquid (Heritage @font-face + --font-body--family etc.)
[Bootstrap, Splide, splitting, Typekit, Google — sin cambios]
wagon.css → home.css → fonts.css → master.css   ← ajustado
```

### Por qué este orden

| Hoja | Rol en cadena |
|------|---------------|
| `fonts.css` | `@font-face` disponible antes de que `master.css` referencie familias |
| `master.css` | Define `:root` tokens Devmon (`--font-body`, `--font-display`, etc.) |
| `wagon.css` / `home.css` antes | OK — custom properties se resuelven en computed-value; al first paint las cuatro hojas ya están cargadas |

---

## Variables reemplazadas en `wagon.css`

| Línea | Selector / contexto | Antes | Después |
|-------|---------------------|-------|---------|
| 49 | `.cart-items-component .cart-drawer__content>.flex-i` | `var(--font-body--family)` | `var(--font-body)` |
| 53 | `.cart-drawer--empty .cart-drawer__heading` | `var(--font-body--family)` | `var(--font-body)` |
| 99 | `.menu-drawer.color-scheme-1 ul.menu-drawer__menu.has-submenu a` | `var(--font-accent--family, var(--font-body--family))` | `var(--font-display)` |
| 2414 | `.field-wagon input, .field-wagon textarea` (breakpoint 1) | `var(--font-body--family)` | `var(--font-body)` |
| 2560 | `.field-wagon input, .field-wagon textarea` (breakpoint 2) | `var(--font-body--family)` | `var(--font-body)` |
| 2691 | `.field-wagon input, .field-wagon textarea` (breakpoint 3) | `var(--font-body--family)` | `var(--font-body)` |
| 2834 | `.field-wagon input, .field-wagon textarea` (breakpoint 4) | `var(--font-body--family)` | `var(--font-body)` |
| 2964 | `.field-wagon input, .field-wagon textarea` (breakpoint 5) | `var(--font-body--family)` | `var(--font-body)` |
| 3210 | `.field-wagon input, .field-wagon textarea` (breakpoint 6) | `var(--font-body--family)` | `var(--font-body)` |

**Total:** 9 reemplazos (`font-family` únicamente).

### Variables Heritage style/weight

**Ninguna** referencia a `--font-body--style`, `--font-body--weight`, `--font-accent--style` o `--font-accent--weight` existía en `wagon.css`. No hubo cambios ni eliminaciones.

**Nota:** `.cart-drawer__heading` mantiene `font-weight: 800` explícito (L55) — no es variable Heritage; no tocado.

---

## Verificación estática

### `assets/wagon.css` — patrones buscados

| Patrón | Resultado |
|--------|-----------|
| `--font-body--family` | **0** |
| `--font-accent--family` | **0** |
| `Turnkey` | **0** |
| `stevie-sans` | **0** |
| `obviously-narrow` | **0** |
| `Inter` | **0** (solo coincidencias en `pointer`/`inherit` — falsos positivos descartados) |

### Referencias Devmon activas en `wagon.css`

```
L49, L53, L2414, L2560, L2691, L2834, L2964, L3210 → var(--font-body)
L99  → var(--font-display)
L2001 → font-family: inherit (sin cambio)
```

### `assets/home.css`

Sin `font-family` directa — hereda clases `.he-*`/`.bo-*` de `master.css`. **Sin cambios necesarios.**

---

## Referencias pendientes (fuera de alcance 2C.4B)

| Item | Ubicación | Notas |
|------|-----------|-------|
| `@font-face` Turnkey Condensed | `assets/fonts.css` | Nombre no coincide con tokens Devmon — Fase 2C.4C/D |
| Typekit `ldm7ibv.css` | `theme.liquid` L50–52 | Legacy; sin consumidor directo en CSS post-migración |
| Google Inter + Inter Tight | `theme.liquid` L54–56 | Sin consumidor activo |
| Heritage `--font-body--family` | `snippets/theme-styles-variables.liquid` + ~30 archivos Heritage | Stack Heritage independiente |
| Tokens sin fuente real | `master.css` `:root` | Reckless/PP Mori/IBM Plex → fallback sistema hasta 2C.4C |
| `font-weight: 800` cart heading | `wagon.css` L55 | Peso explícito; validar cuando exista PP Mori real |

---

## Riesgos

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| Fuentes aún en fallback | **Alta** | Tokens Devmon apuntan a familias sin `@font-face` Devmon conectado — cart/drawer/fields verán sans-serif genérico |
| Menu drawer accent | Media | `--font-display` (Reckless) reemplaza `--font-accent--*` (obviously-narrow) — cambio visual esperado al conectar proveedor |
| `wagon.css` antes de `master.css` | Baja | Custom properties OK en runtime; no hay dependencia de orden para vars |
| Heritage blocks sin cambio | Info | PDP/cart Heritage nativo sigue Instrument Sans vía `--font-body--family` |
| Orden parcial vs auditoría | Info | Auditoría 2C.4A sugería `fonts.css` antes de `wagon.css`; brief 2C.4B fija `wagon → home → fonts → master` — cumplido según instrucción |

---

## Comandos para revisar diff

```bash
# Diff de archivos tocados
git diff layout/theme.liquid assets/wagon.css

# Orden de carga Wagon
grep -n "wagon.css\|home.css\|fonts.css\|master.css" layout/theme.liquid

# Cero Heritage vars en wagon
grep -E 'font-body--|font-accent--' assets/wagon.css

# Tokens Devmon en wagon
grep -n 'font-family' assets/wagon.css

# Legacy font names en capa Wagon
grep -E 'Turnkey|stevie-sans|obviously-narrow' assets/wagon.css assets/master.css assets/home.css

# Confirmar master.css intacto
git diff assets/master.css
```

### QA manual recomendado

1. Cart drawer vacío y con items — tipografía coherente con homepage `.bo-*`.
2. Menu drawer mobile — links usan `--font-display` (serif fallback hasta 2C.4C).
3. Formularios `.field-wagon` en todos los breakpoints — `--font-body`.
4. DevTools → Computed → `font-family` en `.cart-drawer__heading` debe mostrar stack PP Mori/fallback, no Instrument Sans.
5. Heritage header nativo — sin regresión (no migrado).

---

## Próximo paso sugerido

**Fase 2C.4C:** Google Fonts puente (DM Sans + IBM Plex Mono) + limpieza Typekit/Turnkey según `handoff/14-phase2c4a-scalable-font-system-audit.md` §10.

---

**Estado:** Implementación completa. Sin commit.
