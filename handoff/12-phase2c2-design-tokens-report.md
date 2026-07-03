# Fase 2C.2 — Design Tokens v1 (Devmon)

**Fecha:** 2026-07-03  
**Alcance:** Sistema oficial de Design Tokens en `assets/master.css` únicamente.  
**Objetivo:** Reemplazar el sistema visual heredado de Chocolat Uzma por la guía Devmon, manteniendo compatibilidad total vía aliases legacy.

---

## Resumen ejecutivo

Se creó la sección **Devmon Design Tokens v1** en `:root` de `assets/master.css` con la escala de marca completa (inner-glow → 900, wild-pulse) y neutros (core-power, white). Los siete tokens legacy Wagon (`--color-chocolat`, `--color-orange`, etc.) se conservan como aliases que apuntan a los nuevos tokens — sin renombrar clases ni tocar selectores.

**Archivo modificado:** 1 (`assets/master.css`).  
**Sin commit.**

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `assets/master.css` | Bloque `:root` L28–55: tokens v1 + aliases legacy + neutros. Eliminados tokens temporales `--color-brand-*` de la iteración anterior. |

**No modificados (intencional):** HTML, Liquid, JS, `layout/theme.liquid`, `assets/fonts.css`, `assets/base.css`, `assets/wagon.css`, `assets/home.css`, SVG, Theme Settings.

---

## Tokens creados

### Brand colors

| Token | Valor | Rol |
|-------|-------|-----|
| `--color-inner-glow` | `#FCFBE3` | Glow cálido / fondo suave principal |
| `--color-100` | `#FFEDED` | Tono más claro de la escala |
| `--color-200` | `#FFDCE0` | Rosa claro |
| `--color-300` | `#FFB6D2` | Rosa medio-claro |
| `--color-400` | `#FF7AA4` | Rosa medio |
| `--color-500` | `#FF427E` | Rosa principal (escala) |
| `--color-wild-pulse` | `#E60259` | Acento principal de marca |
| `--color-600` | `#B8003A` | Magenta oscuro |
| `--color-700` | `#8A002C` | — |
| `--color-800` | `#61001F` | — |
| `--color-900` | `#380012` | Tono más oscuro de la escala |

### Neutrals

| Token | Valor |
|-------|-------|
| `--color-core-power` | `#000000` |
| `--color-white` | `#FFFFFF` |

---

## Aliases legacy

Tokens antiguos **conservados** — solo redirigidos:

| Alias legacy | Apunta a | Valor efectivo | Rol histórico |
|--------------|----------|----------------|---------------|
| `--color-chocolat` | `var(--color-900)` | `#380012` | Texto, bordes, fondos oscuros |
| `--color-orange` | `var(--color-wild-pulse)` | `#E60259` | Acento CTA, focus, swatches |
| `--color-tumeric` | `var(--color-300)` | `#FFB6D2` | Highlights, badges, `.btn-tumeric` |
| `--color-ivory` | `var(--color-inner-glow)` | `#FCFBE3` | Fondos suaves |
| `--color-light-ivory` | `var(--color-100)` | `#FFEDED` | Fondos secundarios claros |
| `--color-dark-ivory` | `var(--color-200)` | `#FFDCE0` | Tracks, fondos ligeramente más oscuros |

**Nota:** `--color-dark-ivory` no estaba en el brief explícito pero existía en el sistema legacy y se usa en `wagon.css` y `shipping-i.liquid`. Se mapeó a `--color-200` como tono intermedio entre `--color-100` y `--color-300`.

**Decisión de mapeo `--color-chocolat`:** Se usó `--color-900` (más oscuro de la escala de marca) en lugar de `--color-core-power` (#000), porque el rol histórico de `chocolat` era texto/borde oscuro de marca, no negro puro.

**Decisión de mapeo `--color-orange`:** Se usó `--color-wild-pulse` como acento principal de la guía Devmon.

---

## Compatibilidad mantenida

| Consumidor | Tokens usados | Estado |
|------------|---------------|--------|
| `assets/wagon.css` | `chocolat`, `orange`, `tumeric`, `ivory`, `light-ivory`, `dark-ivory` | ✅ Sin cambios en archivo — hereda nuevos valores |
| `assets/home.css` | Mismos aliases legacy | ✅ |
| `assets/master.css` (componentes) | Aliases en botones, range thumb, etc. | ✅ Selectores intactos |
| `sections/product-i.liquid` | `--color-chocolat` (inline styles) | ✅ |
| `sections/shipping-i.liquid` | `dark-ivory`, `chocolat`, `tumeric` | ✅ |
| `snippets/quick-add-modal-styles.liquid` | `--color-ivory` | ✅ |
| Clases `.btn-chocolat`, `.btn-tumeric`, `.btn-ivory` | Via aliases | ✅ Sin renombrar |

Ninguna clase, selector ni componente fue modificado.

---

## Riesgos encontrados

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| Hex hardcodeados fuera de tokens | Media | `master.css` L79–100 (range slider) usa `#FF791F` y `#F9EAD6` directamente — no pasan por aliases; seguirán mostrando colores Chocolat Uzma hasta fase posterior |
| Hex en `wagon.css` | Baja | `#37222342` (borde con alpha) L1654 — no conectado a tokens |
| SVG inline en Liquid | Media | Strokes/fills `#372223`, `#FF791F` en sections/snippets — fuera de alcance |
| Vars huérfanas Wagon | Media | `--color-blanco`, `--color-azul-oscuro` en `wagon.css` — no definidas en `:root` |
| Cambio visual global | Info | Toda la capa Wagon pasa de marrón/amarillo/naranja a escala rosa/magenta Devmon de forma inmediata vía aliases |
| `--color-dark-ivory` inferido | Baja | Mapeo a `--color-200` no estaba en el brief; validar visualmente range tracks y shipping |
| `--color-core-power` sin cablear | Baja | Token definido pero ningún alias legacy lo consume aún |
| Escala `--color-400`…`--color-800` | Info | Disponibles para uso futuro; consumidores actuales solo usan aliases legacy |
| Reporte 11 (paleta azul) | Info | Tokens `--color-brand-*` eliminados; este reporte es la fuente de verdad para colores |

---

## Comandos para revisar

```bash
# Sección oficial de tokens
grep -n 'Devmon Design Tokens' assets/master.css

# Tokens de marca
grep -n 'color-inner-glow\|color-wild-pulse\|color-[0-9]' assets/master.css | head -20

# Aliases legacy
grep -n 'color-chocolat\|color-orange\|color-tumeric\|color-ivory' assets/master.css | head -10

# Sin tokens brand temporales
grep 'color-brand' assets/master.css

# Hex legacy sueltos (pendientes)
grep -n '#372223\|#FF791F\|#FFC80A\|#F9EAD6\|#FFF3E3' assets/master.css assets/wagon.css assets/home.css

# Consumo de aliases en wagon/home (sin modificar)
grep -c 'var(--color-chocolat)' assets/wagon.css assets/home.css
```

### QA visual recomendado

1. Homepage (`home.css`): fondos ivory/inner-glow, texto chocolat → `#380012`.
2. Botones `.btn-chocolat` / `.btn-tumeric` / `.btn-ivory`: contrastes legibles con nueva escala.
3. Header Wagon + minishop: acentos orange → wild-pulse `#E60259`.
4. PLP range slider: confirmar si sigue naranja/crema (hex pendiente).
5. Product page badges y shipping section: tumeric → `#FFB6D2`.

---

## Fuera de alcance (intencional)

- Fuentes (Fase 2C.3 — ya aplicada en iteración anterior)
- Remover imports Typekit/Google/`fonts.css`
- Cablear `--color-400`…`--color-800` y `--color-core-power` a componentes
- Renombrar clases legacy (`btn-chocolat`, etc.)
- Commit

---

## Próximo paso sugerido

**2C.5:** Reemplazar hex sueltos (range slider, `#37222342`) por referencias a tokens v1.  
**2C.6:** SVG inline + vars huérfanas (`--color-blanco`, `--color-azul-oscuro`).
