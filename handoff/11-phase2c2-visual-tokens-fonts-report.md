# Fase 2C.2 + 2C.3 — Neutralización visual base: tokens y fuentes Wagon

**Fecha:** 2026-07-03  
**Alcance:** Paleta azul pastel en `master.css` + conexión de tipografía Wagon a variables Shopify Theme Settings.  
**Sin tocar:** `layout/theme.liquid`, `fonts.css`, `base.css`, snippets Heritage, JS, Liquid, templates, `settings_data.json`, SVG inline.

---

## Resumen ejecutivo

Se introdujo una paleta de marca neutra (`--color-brand-*`) en `:root` de `assets/master.css`, con aliases legacy para que ~93+ referencias existentes a `--color-chocolat`, `--color-orange`, etc. adopten los nuevos valores sin renombrar clases.

Se reemplazaron todas las `font-family` hardcodeadas en `assets/master.css` y `assets/wagon.css` por variables Shopify (`--font-heading--*`, `--font-body--*`, `--font-accent--*`). Las clases Wagon `.he-*` y `.bo-*` ahora heredan también `font-style` y `font-weight` del theme editor.

Se eliminó el carácter suelto `+` en `master.css` L198 (error CSS reportado en auditoría 2C.1).

**Resultado:** 2 archivos CSS modificados. Imports externos (Typekit, Google Fonts, Turnkey CDN) siguen cargándose pero ya no son referenciados directamente por la capa Wagon activa.

---

## Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `assets/master.css` | Tokens `:root`, aliases legacy, fuentes `.he-*` / `.bo-*` / `.sp-i` / `.number-i` / `.btn-*`, fix `+` suelto |
| `assets/wagon.css` | 8× `stevie-sans` → `--font-body--family`; 1× `obviously-narrow` → `--font-accent--*` |

**No modificados (intencional):** `layout/theme.liquid`, `assets/fonts.css`, `assets/base.css`, `snippets/theme-styles-variables.liquid`, `snippets/fonts.liquid`, `assets/home.css`, Liquid, JS, templates.

---

## Tokens agregados (`assets/master.css` `:root`)

| Token | Valor | Rol |
|-------|-------|-----|
| `--color-brand-primary` | `#1F4E79` | Azul profundo — texto/bordes/fondos oscuros |
| `--color-brand-secondary` | `#DCEEFF` | Azul pastel claro — highlights, fondos secundarios |
| `--color-brand-accent` | `#6FA8DC` | Azul medio — acentos, CTAs |
| `--color-brand-soft` | `#F5FAFF` | Fondo suave |
| `--color-brand-border` | `#D8E6F3` | Bordes / separadores |
| `--color-brand-text` | `#1E293B` | Texto principal (reservado; aún no cableado a selectores) |
| `--color-brand-white` | `#FFFFFF` | Blanco |

---

## Aliases legacy mantenidos

Para no romper CSS existente ni renombrar clases (`.btn-chocolat`, `.btn-tumeric`, `.btn-ivory`):

| Alias legacy | Apunta a | Hex efectivo |
|--------------|----------|--------------|
| `--color-chocolat` | `var(--color-brand-primary)` | `#1F4E79` |
| `--color-orange` | `var(--color-brand-accent)` | `#6FA8DC` |
| `--color-tumeric` | `var(--color-brand-secondary)` | `#DCEEFF` |
| `--color-dark-ivory` | `var(--color-brand-border)` | `#D8E6F3` |
| `--color-ivory` | `var(--color-brand-soft)` | `#F5FAFF` |
| `--color-light-ivory` | `var(--color-brand-secondary)` | `#DCEEFF` |
| `--color-white` | `var(--color-brand-white)` | `#FFFFFF` |

**Clases sin renombrar:** `.btn-chocolat`, `.btn-tumeric`, `.btn-ivory` — solo cambian valores vía aliases.

---

## Fuentes reemplazadas

### `assets/master.css`

| Selector / contexto | Antes | Después |
|---------------------|-------|---------|
| `.he-xxl` … `.he-xxs` | `'Turnkey Condensed', sans-serif` | `var(--font-heading--family)` + style/weight |
| `.he-l`, `.he-m` | `'stevie-sans', sans-serif` | `var(--font-heading--family)` + style/weight |
| `form input[type="email"]`, `.bo-xxl` … `.bo-xxs` | `'stevie-sans', sans-serif` | `var(--font-body--family)` + style/weight |
| `.sp-i` | `'inter', sans-serif` | `var(--font-accent--family, var(--font-body--family))` |
| `.number-i` | `'Turnkey Condensed'` | `var(--font-heading--family)` + style/weight |
| `.btn-i`, `.btn-ii`, `.btn-iii` (+ hijos) | `'stevie-sans', sans-serif` | `var(--font-body--family)` + style/weight |

**Propiedades añadidas donde aplica:**

- `.he-*`: `font-style: var(--font-heading--style);` `font-weight: var(--font-heading--weight);`
- `.bo-*`, botones, email input: `font-style: var(--font-body--style);` `font-weight: var(--font-body--weight);`

### `assets/wagon.css`

| Selector | Antes | Después |
|----------|-------|---------|
| `.cart-drawer__content`, `.cart-drawer__heading` | `'stevie-sans'` | `var(--font-body--family)` |
| `.field-wagon input/textarea` (6 breakpoints) | `'stevie-sans'` | `var(--font-body--family)` |
| `.menu-drawer … a` | `'obviously-narrow'` | `var(--font-accent--family, var(--font-body--family))` |

### Verificación post-cambio

```bash
grep -E "Turnkey|stevie-sans|obviously-narrow|'inter'|\"inter\"" assets/master.css assets/wagon.css
# → 0 coincidencias
```

---

## Corrección adicional

| Archivo | Línea | Problema | Fix |
|---------|-------|----------|-----|
| `assets/master.css` | ~198 | Carácter suelto `+` (selector inválido) | Eliminado |

---

## Referencias externas pendientes (Fase 2C.4+)

Estas cargas siguen activas pero **ya no son referenciadas** por `master.css` / `wagon.css`:

| Fuente | Ubicación | Estado |
|--------|-----------|--------|
| **Typekit** `ldm7ibv.css` | `layout/theme.liquid` L50–52 | Pendiente remover — servía `stevie-sans`, `obviously-narrow` |
| **Google Fonts** Inter + Inter Tight | `layout/theme.liquid` L54–56 | Pendiente remover — servía `.sp-i` |
| **Turnkey Condensed CDN** | `assets/fonts.css` (9 `@font-face`) | Pendiente — no tocado en 2C.3 |
| **Heritage fonts** | `snippets/fonts.liquid` | Activo — ahora alimenta Wagon vía CSS vars |

**Variables Wagon huérfanas** (usadas pero no definidas en `:root`):

| Variable | Usos | Notas |
|----------|------|-------|
| `--color-blanco` | `wagon.css` (5), `master.css` (1) | No mapeada a `--color-brand-white` — posible fallback inválido |
| `--color-azul-oscuro` | `wagon.css` (2) | No definida en tokens — drawer/menu puede no colorear |

---

## Riesgos visuales

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| Range slider hex hardcode | Media | `master.css` L79–100 usa `#FF791F` y `#F9EAD6` directamente — no pasa por aliases; seguirá mostrando naranja/crema hasta fase posterior |
| `--color-brand-text` sin uso | Baja | Token definido pero ningún selector lo consume aún |
| `--color-blanco` / `--color-azul-oscuro` | Media | Vars no definidas en `:root`; comportamiento depende del navegador (ignora o hereda) |
| Cambio semántico de aliases | Info | `.btn-tumeric` ya no es amarillo — ahora azul pastel (`--color-brand-secondary`) |
| `.btn-chocolat` | Info | Pasa de marrón `#372223` a azul `#1F4E79` |
| `font-weight` explícitos | Baja | Ej. `.cart-drawer__heading { font-weight: 800 }` puede anular `--font-body--weight` |
| `letter-spacing: -5%` etc. | Baja | Porcentajes no estándar; pueden renderizar distinto con fuentes Heritage |
| SVG inline `#372223` / `#FF791F` | Media | Fuera de alcance — iconos/strokes mantienen colores Chocolat Uzma |
| `assets/home.css` | Info | No auditado en esta fase; puede tener hex o fuentes propias |
| Imports CDN muertos | Baja | Typekit/Google/Turnkey siguen descargándose (peso de red) hasta 2C.4 |

---

## Comandos para revisar

```bash
# Tokens nuevos en :root
grep -n 'color-brand' assets/master.css | head -20

# Aliases legacy
grep -n 'color-chocolat\|color-orange\|color-tumeric\|color-ivory' assets/master.css | head -5

# Cero fuentes hardcodeadas en capa Wagon activa
grep -E "Turnkey|stevie-sans|obviously-narrow|'inter'" assets/master.css assets/wagon.css

# Hex legacy sueltos (pendientes)
grep -n '#372223\|#FF791F\|#FFC80A\|#F9EAD6\|#FFF3E3' assets/master.css assets/wagon.css assets/home.css

# Carácter + eliminado
grep -n '^[[:space:]]*+[[:space:]]*$' assets/master.css

# Imports externos aún presentes
grep -n 'typekit\|googleapis\|fonts.css' layout/theme.liquid

# Vars huérfanas
grep -rn 'color-blanco\|color-azul-oscuro' assets/
```

### QA manual recomendado

1. Theme editor → Typography: cambiar heading/body/accent fonts → verificar `.he-*`, `.bo-*`, botones Wagon, cart drawer.
2. Homepage: fondos ivory/soft, botones `.btn-chocolat` / `.btn-tumeric` / `.btn-ivory` con nueva paleta azul.
3. Header Wagon + minishop: contraste legible con `#1F4E79` sobre `#F5FAFF`.
4. PLP range slider: confirmar si sigue naranja (hex pendiente) — documentado como known issue.
5. Menu drawer mobile: revisar si `--color-azul-oscuro` / `--color-blanco` aplican color de fondo.

---

## Fuera de alcance (intencional)

- Remover Typekit / Google Fonts / `fonts.css`
- Cablear `--color-brand-text` a selectores
- Mapear `--color-blanco` / `--color-azul-oscuro`
- Reemplazar hex en range slider
- SVG inline en Liquid
- `settings_data.json` color schemes
- Renombrar clases `.btn-chocolat` etc.
- Commit (no solicitado)

---

## Próximo paso sugerido

**Fase 2C.4:** Remover imports externos muertos en `theme.liquid` + deprecar `fonts.css`.  
**Fase 2C.5:** Mapear vars huérfanas (`--color-blanco`, `--color-azul-oscuro`) y hex sueltos (range slider, `home.css`).  
**Fase 2C.6:** SVG inline + `settings_data.json` alignment con paleta brand.
