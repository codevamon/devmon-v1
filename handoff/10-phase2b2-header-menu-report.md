# Fase 2B.2 — Header menu: auditoría y corrección mínima

**Fecha:** 2026-07-03  
**Alcance:** Reemplazar `linklists.navbar` por el menú configurable del theme en la capa Wagon del header, sin cambiar diseño, clases, JS ni CSS.

---

## Resumen ejecutivo

El header Wagon usaba un menú Liquid hardcodeado (`linklists.navbar`) independiente del block Heritage `_header-menu`, que ya expone un setting `link_list` con default `main-menu`. Se unificó la fuente del menú: la navegación Wagon (desktop, minishop y bigmenu mobile) lee ahora el mismo `block.settings.menu` que el resto del header.

**Resultado:** 2 archivos modificados, 0 referencias activas a `linklists.navbar`, fallback seguro si el menú no existe o está vacío.

---

## Archivos auditados

| Archivo | Hallazgo |
|---------|----------|
| `sections/header.liquid` | Única referencia activa a `linklists.navbar` (L414). Tres consumidores: nav desktop Wagon, minishop Splide, bigmenu mobile. |
| `sections/header-group.json` | Block estático `header-menu` (`_header-menu`) con `"menu": "navbar"`. |
| `blocks/_header-menu.liquid` | Schema con `"type": "link_list", "id": "menu", "default": "main-menu"`. Heritage ya usa `block.settings.menu`. |
| `sections/header-drawer.liquid` | Usa `linklist: block_settings.menu` — sin cambios necesarios. |
| `layout/theme.liquid` | Sin referencias a navbar — no tocado. |
| Assets / JS / CSS | Sin referencias a `linklists.navbar` — no tocados. |

**Nota sobre `section.settings.menu`:** No existe un setting de menú a nivel de sección en `header.liquid`. El setting canónico del theme editor es el del block `_header-menu` (`Menu` en el editor). La implementación usa ese block en lugar de inventar un setting duplicado.

---

## Archivos modificados

### 1. `sections/header.liquid`

**Referencia original (L414):**
```liquid
{% assign navbar_menu = linklists.navbar %}
```

**Cambio aplicado:**
```liquid
{% liquid
  assign wagon_menu = blank
  for block in section.blocks
    if block.type == '_header-menu'
      assign wagon_menu = block.settings.menu
      break
    endif
  endfor
%}
```

**Reemplazos adicionales (6 usos):**

| Ubicación | Antes | Después |
|-----------|-------|---------|
| Nav desktop Wagon (~L430) | `{% if navbar_menu.links.size > 0 %}` | `{% if wagon_menu != blank and wagon_menu.links.size > 0 %}` |
| Loop nav desktop (~L432) | `{% for link in navbar_menu.links %}` | `{% for link in wagon_menu.links %}` |
| Minishop — detección shop (~L518) | `{% for link in navbar_menu.links %}` | `{% if wagon_menu != blank %}` + loop sobre `wagon_menu.links` |
| Bigmenu mobile (~L596) | `{% if navbar_menu.links.size > 0 %}` | `{% if wagon_menu != blank and wagon_menu.links.size > 0 %}` |
| Loop bigmenu (~L598) | `{% for link in navbar_menu.links %}` | `{% for link in wagon_menu.links %}` |

**Sin cambios en:** HTML structure, clases, IDs, labels visibles, lógica minishop (`contains 'shop'`), animaciones Splide/Bootstrap, schema de la sección.

### 2. `sections/header-group.json`

**Referencia original:**
```json
"menu": "navbar"
```

**Cambio aplicado:**
```json
"menu": "main-menu"
```

Alinea el preset del theme group con el default del schema `_header-menu` y con el handle estándar de Shopify en tiendas nuevas.

---

## Por qué es seguro

1. **Misma fuente que Heritage:** Wagon y Heritage leen el mismo block `_header-menu`. Un solo menú en theme editor controla ambas capas.
2. **Fallback defensivo:** Si no hay block `_header-menu`, si `block.settings.menu` está vacío o el link list no tiene links, las condiciones `wagon_menu != blank and wagon_menu.links.size > 0` evitan errores Liquid; la nav Wagon simplemente no renderiza items (comportamiento equivalente a un `navbar` inexistente).
3. **Minishop protegido:** El loop de detección del link "shop" está envuelto en `{% if wagon_menu != blank %}`; si no hay menú, `shop_menu_link` queda en blank y el bloque minishop no se muestra (igual que antes sin links shop).
4. **Diff mínimo:** Solo cambia la asignación Liquid y el handle en JSON preset. Cero cambios en CSS, JS, assets, layout ni schema.
5. **Portable:** Tiendas nuevas con `main-menu` (default Shopify) funcionan sin crear un menú `navbar`.

---

## Riesgos pendientes

| Riesgo | Severidad | Notas |
|--------|-----------|-------|
| Título "shop" en minishop | Media | El minishop sigue dependiendo de un link cuyo título contenga `shop` (case-insensitive). En tiendas con otro idión/label el minishop no aparecerá hasta renombrar o ajustar en fase futura. |
| Contenido del menú distinto al de Chocolat Uzma | Baja | `main-menu` puede tener otros links que `navbar`; es esperado al migrar. Estructura visual intacta. |
| Block `_header-menu` deshabilitado/eliminado | Baja | Si el merchant quita el block estático, Wagon queda sin nav. Heritage drawer también dependería del mismo block. |
| Doble fila de menú visible | Info | Heritage (top row) y Wagon (`content-header`) pueden mostrarse simultáneamente según settings; no es regresión de esta fase. |
| Otros hardcodes header (Fase 2B) | Info | URLs CDN, SVG stroke, etc. documentados en `08-phase2a-hardcodes-audit.md` — fuera de alcance 2B.2. |

---

## Verificación

### Comandos

```bash
# Cero referencias activas a linklists.navbar (solo docs handoff)
rg 'linklists\.navbar' --glob '!handoff/**'

# Confirmar uso de wagon_menu en header
rg 'wagon_menu|navbar_menu' sections/header.liquid

# Confirmar preset main-menu en header group
rg '"menu"' sections/header-group.json

# Confirmar que no quedó "navbar" como handle de menú en código activo
rg '"menu"\s*:\s*"navbar"' --glob '!handoff/**'
```

### Resultado esperado

- `linklists.navbar`: 0 hits fuera de `handoff/`
- `navbar_menu`: 0 hits en `sections/header.liquid`
- `wagon_menu`: 6 referencias en `sections/header.liquid`
- `header-group.json`: `"menu":"main-menu"`

### QA manual recomendado (theme dev / preview)

1. Abrir theme editor → Header → block Menu → verificar que apunta a `main-menu`.
2. Desktop: nav Wagon (`navbar-menu-i`) muestra links del menú configurado.
3. Mobile: bigmenu (`list-bigmenu`) muestra los mismos links.
4. Si existe un link con "shop" en el título y sublinks: minishop Splide visible al hover/expand.
5. Cambiar menú en editor a otro link list → Wagon refleja el cambio sin editar código.
6. Tienda sin links en el menú seleccionado → header no rompe, nav vacía.

---

## Fuera de alcance (intencional)

- CSS, JS, assets, `layout/theme.liquid`
- Schema nuevo en `header.liquid` (se reutilizó block existente)
- Neutralización del criterio `contains 'shop'` del minishop
- Menús footer (`foot`, `products`, `legal`) — otras fases 2B
- Commit (no solicitado)

---

## Próximo paso sugerido

Fase 2B.3 o continuación 2B según roadmap: metafields `custom.main_picture`, `collection.json`, menús footer, u otros ítems de `08-phase2a-hardcodes-audit.md`.
