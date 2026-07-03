# Devmon v1 — Reglas de desarrollo

**Fase:** 0.5 (documentación)  
**Audiencia:** Desarrolladores que trabajen sobre el starter Devmon v1  
**Estado:** Reglas obligatorias hasta completar roadmap v1.0

---

## Propósito

Este documento define **reglas estrictas** para evitar regresiones en Heritage, roturas en Wagon y deuda técnica durante la conversión a starter theme. Cualquier excepción debe documentarse en el PR o commit message.

---

## 1. Reglas sobre archivos Heritage core

### 1.1 No tocar `assets/base.css` salvo causa justificada

**Regla:** `base.css` (~4.200 líneas) es el sistema visual de Heritage. No añadir estilos de marca, tokens Wagon ni overrides de cliente aquí.

**Causas justificadas (requieren PR dedicado):**
- Bugfix upstream confirmado en Heritage
- Parche de accesibilidad crítico sin alternativa en snippet
- Actualización de versión Heritage con merge documentado

**Alternativa correcta:** `wagon.css`, `home.css`, `master.css`, o `{% stylesheet %}` en la section afectada.

---

### 1.2 No tocar `snippets/scripts.liquid` sin revisar el importmap

**Regla:** `scripts.liquid` define el `importmap` con alias `@theme/*`. Cada entrada mapea a un archivo en `assets/`.

**Antes de editar:**
1. Listar qué módulos importan el alias afectado (`grep -r "@theme/nombre" assets/ snippets/ sections/ blocks/`).
2. Verificar preload links en el mismo archivo.
3. Comprobar carga condicional por `template.name`.
4. Probar cart, PDP, collection, search y quick-add tras el cambio.

**Prohibido:** eliminar entradas del importmap sin eliminar o refactorizar todos los importadores.

---

### 1.3 No tocar `layout/theme.liquid` sin entender el orden de carga

**Regla:** El orden en `<head>` determina cascada CSS y disponibilidad de globals JS.

**Checklist previo a cualquier edición:**
- [ ] ¿El cambio afecta Heritage, Wagon o ambos?
- [ ] ¿Los CDN nuevos deben ser globales o pueden cargarse por section?
- [ ] ¿Hay duplicación con `scripts.liquid`?
- [ ] ¿Los inline scripts de header siguen alineados con `utilities.js`?
- [ ] ¿`theme-check` RemoteAsset sigue siendo aceptable?

Ver detalle en `02-devmon-v1-architecture.md` §2.

---

## 2. Reglas sobre cambios en código existente

### 2.4 No cambiar clases existentes sin buscar dependencias

**Regla:** Antes de renombrar o eliminar una clase CSS o atributo `data-*`:

```bash
# Buscar en todo el theme
rg "nombre-clase" --glob "*.{liquid,css,js,json}"
```

**Ámbitos de dependencia típicos:**
- `wagon.js` — selectores de menú, Splide, Splitting, Lenis
- `assets/*.js` Heritage — custom elements, `querySelector`
- `sections/*.liquid` — markup
- `blocks/filters.liquid` — clases `shopping-i`, `filter-shopping-i`
- Templates JSON — no suelen tener clases, pero sí `style_class` en blocks

---

### 2.5 No borrar snippets ni sections sin verificar referencias

**Regla:** Toda eliminación requiere búsqueda de referencias:

| Buscar | Patrones |
|--------|----------|
| Snippets | `render 'nombre'`, `include 'nombre'` (legacy) |
| Sections | `"type": "nombre"` en `templates/`, `presets`, section groups |
| Blocks | `"type": "nombre"` en schemas y templates |

**Incluir:** referencias desde JavaScript (`section-rendering-product-card`, `predictive-search-empty`) y desde `wagon.js`.

Si una section no está en templates pero tiene `presets`, sigue siendo **añadible en Theme Editor** — no es "código muerto" automáticamente.

---

## 3. Reglas sobre identidad visual y contenido

### 3.6 No hardcodear colores nuevos

**Regla:** Usar en este orden de preferencia:

1. Variables Heritage: `var(--color-foreground)`, `rgb(var(--color-foreground-rgb) / …)`
2. Color scheme de section: `color-{{ section.settings.color_scheme }}`
3. Tokens Wagon existentes en `master.css` (`--color-chocolat`, etc.) — **temporal hasta Fase 4**
4. Settings de schema (`color` picker)

**Prohibido en código nuevo:**
- Hex/rgb literales en Liquid/CSS (`#372223`, `#FF791F`) salvo SVG decorativo pendiente de refactor
- Nuevos tokens de marca (`--color-chocolat-2`)

---

### 3.7 No hardcodear textos de marca

**Regla:**
- Strings visibles al merchant → claves `t:` en `locales/en.default.json` + schema `default` neutro
- Contenido demo → solo en `templates/*.json` con placeholders genéricos (Fase 1)
- Prohibido en código: nombres de empresa, emails, direcciones, copy legal específico

**Excepción temporal:** defaults en schemas de secciones Wagon hasta Fase 1.

---

## 4. Reglas sobre dependencias y configuración

### 4.8 No agregar CDN nuevos sin justificar

**Regla:** Cada CDN en `theme.liquid` debe tener:
- Razón técnica (no duplicar lib ya en assets/)
- Versión fijada en URL
- Evaluación de impacto en Lighthouse
- Entrada en `handoff/06-devmon-v1-roadmap.md` o doc de dependencias

**Preferir:** self-host en `assets/` o npm → asset pipeline si el theme lo adopta en Fase 3.

---

### 4.9 No cambiar schemas rompiendo Theme Editor

**Regla:** Al modificar `{% schema %}`:

- No eliminar `id` de settings existentes (rompe `settings_data` guardados)
- No cambiar `type` de un setting sin migración
- No renombrar `type` de blocks usados en templates JSON
- Mantener claves `t:` para labels visibles al merchant
- Probar en **Theme Editor** la section afectada

**Cambios seguros:** añadir settings nuevos, añadir blocks opcionales, actualizar `default` neutros.

---

### 4.10 No modificar `settings_data.json` sin entender impacto

**Regla:** `settings_data.json` controla el estado **actual** del theme en la tienda:

- `color_schemes` — toda la paleta activa
- `logo`, `favicon` — identidad
- `type_*_font` — tipografía Heritage
- `drawer_color_scheme`, `quick_add_*` — UX commerce

**Antes de editar:**
1. Backup del archivo
2. Identificar si el cambio es para **preset starter** (Fase 1) o runtime
3. No eliminar schemes referenciados por sections en templates (`scheme-7115b6b1-...` en product.json)

---

## 5. Reglas de proceso

### 5.11 Cada cambio debe pasar por `git diff`

**Regla:** Antes de commit/PR:
- Revisar diff completo — sin archivos accidentales
- Separar cambios por fase del roadmap cuando sea posible
- No mezclar limpieza de contenido (Fase 1) con refactor JS (Fase 5)

---

### 5.12 Cada cambio debe ser pequeño y reversible

**Regla:**
- Un PR = un objetivo claro (ej. "neutralizar index.json", "mover Turnkey a assets")
- Commits atómicos facilitan revert
- Evitar "big bang" en `header.liquid` + `wagon.css` + `templates` en un solo PR

**Tamaño orientativo:** < 500 líneas de diff por PR salvo migraciones acordadas.

---

## 6. Reglas por capa (resumen rápido)

| Capa | Puedes… | No puedes… |
|------|---------|------------|
| **Heritage core** | Bugfix mínimo, extender via blocks nuevos | Rebrand en `base.css`, romper importmap |
| **Wagon** | Tokens, componentes, secciones `-i` | Duplicar lógica cart/variants ya en Heritage |
| **Templates JSON** | Neutralizar demo (Fase 1) | Cambiar block IDs estáticos sin migrar section |
| **Config** | Reset starter (Fase 1–2) | Borrar scheme IDs en uso |
| **handoff/** | Documentar libremente | — |

---

## 7. Checklist pre-merge (mínimo)

- [ ] `shopify theme check` sin errores nuevos críticos
- [ ] Homepage, PDP, PLP, cart, search probados en dev store
- [ ] Theme Editor: sections tocadas abren sin error JSON
- [ ] `rg` confirma cero referencias rotas tras renombres
- [ ] Sin CDN nuevos no documentados
- [ ] Sin colores/textos de marca nuevos hardcodeados
- [ ] Diff revisado por segundo par si toca archivos §11 de `02-devmon-v1-architecture.md`

---

## 8. Escalación

Si un cambio requiere romper alguna regla de este documento:

1. Documentar por qué en el PR
2. Actualizar `05-devmon-v1-risk-map.md` si introduce riesgo nuevo
3. Obtener revisión explícita del maintainer del starter

---

*Documento generado en Fase 0.5. Vinculado a `02-devmon-v1-architecture.md` y `06-devmon-v1-roadmap.md`.*
