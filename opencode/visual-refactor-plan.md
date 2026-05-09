# Visual Refactor Plan — AreaDot

## 1. Project Context

AreaDot es una aplicación de estimación de área de manchas en imágenes radiográficas usando el método de Monte Carlo. El usuario sube una imagen PNG en blanco y negro o escala de grises, la aplicación genera puntos aleatorios sobre el canvas, cuenta cuántos caen sobre la mancha (píxeles blancos) y estima el área proporcional.

**Dominio:** salud / radiografía / análisis de imagen médica.
**Objetivo visual:** transmitir confianza, precisión, profesionalismo y calma. La interfaz debe sentirse como una herramienta clínica seria, no como un demo técnico.

---

## 2. Framework and Styling System Detected

| Capa | Tecnología |
|------|-----------|
| **Framework** | Angular 18.2 (standalone components, signals) |
| **UI Library** | Angular Material 18 (tabs, table, button, dialog, progress-spinner) |
| **Styling** | Tailwind CSS v3.4.17 + SCSS |
| **Icon System** | FontAwesome 6 (free solid + brands) |
| **Typography** | Roboto (300, 400, 500) via Google Fonts |
| **Routing** | Hash-based (`withHashLocation`) |
| **State** | Angular signals (`ImageSignalStateService`) |
| **Theme** | Material: azure primary, blue tertiary, density 0 |
| **Background** | `--background-color: #F6F7F8` |
| **Path Aliases** | `@core/*`, `@shared/*`, `@Pages/*` |

---

## 3. Screens and Areas Found

### Layout Shell (`shared/components/layout/`)
- Header con logo circular "A" + título "AreaDot" + subtítulo
- Contenedor card con `MatTabs` para navegación entre "Calcular área" y "Resultados anteriores"
- `<router-outlet>` para contenido de páginas hijas

### Home Page (`pages/home/`)
- **Stepper** de 5 pasos (subir imagen, validar, generar puntos, contar, estimar)
- **Panel izquierdo:** upload zone con canvas oculto, preview de imagen, empty state con icono
- **Panel derecho:** canvas de visualización con puntos (verdes = mancha, rojos = fuera), empty state
- **Toast notifications:** fixed position, verde (válida) / rojo (inválida)
- **Slider** para número de puntos (1,000 - 100,000)
- **Botón** "Calcular área"
- **Panel de fórmula:** explicación del método Monte Carlo
- **Panel de resultados:** métricas calculadas (total puntos, puntos en mancha, área total, área estimada)
- **Warning banner** cuando la proporción de puntos en mancha es < 1%
- **Loading overlay** con spinner y mensaje

### Record Page (`pages/record/`)
- **Título** con icono + botón "Limpiar tabla"
- **Mat-Table** con 5 columnas: fecha, total puntos, área total, puntos en mancha, área estimada
- **Empty state:** texto simple "No hay resultados aún."
- **Color condicional** en área estimada (rojo si < 1%, azul si > 1%)

### Shared UI Components
- **Stepper:** barra horizontal con círculos, checkmarks, flechas conectoras CSS
- **Loading:** overlay fullscreen con `mat-progress-spinner`
- **AlertDialog:** Material dialog con título centrado, mensaje, botón aceptar

---

## 4. Current Visual State

### Impresión general
La aplicación es funcional pero visualmente básica. Parece un scaffold de Angular Material con Tailwind añadido superficialmente. No hay dirección visual coherente que comunique el dominio médico/radiológico.

### Lo que funciona
- Estructura de layout clara con header + tabs + content
- Cards con bordes redondeados y sombras sutiles
- Uso consistente de FontAwesome para iconografía
- Stepper visual con estados completado/activo/pendiente
- Toast de feedback para validación de imagen
- Loading overlay durante cálculo
- Tabla con datos formateados (pipe `NumerosPipe`)

### Lo que se siente incompleto
- El título HTML dice "AngularStain" en lugar de "AreaDot"
- Logo es una letra "A" genérica en círculo azul
- Empty states son texto plano con icono grande, sin ilustración ni guía
- Toast notifications con posición fija hardcoded (`top-40 left-7`)
- Tabla sin hover states, sin zebra striping, sin paginación visual
- No hay footer ni branding consistente
- `* { outline: none !important; }` elimina todos los focus rings (problema de accesibilidad)
- Colores inconsistentes: azul en header, índigo en stepper, verde/rojo en toast, azul en botones
- Sin tema Tailwind personalizado (sin colores de marca, sin spacing system)
- Altura fija de `35rem` en paneles de canvas no se adapta bien
- Fórmula mostrada como texto plano sin estilo matemático

---

## 5. Visual Problems Detected

| # | Problema | Severidad | Ubicación |
|---|----------|-----------|-----------|
| 1 | `outline: none !important` global elimina focus visible | **Alta** (a11y) | `styles.scss` |
| 2 | Título HTML "AngularStain" no refleja marca | Media | `index.html` |
| 3 | Logo genérico sin identidad visual | Media | `layout.component.html` |
| 4 | Toast con posición fija hardcoded, puede solapar | Media | `home.component.html` |
| 5 | Empty state de record page es solo texto | Media | `record.component.html` |
| 6 | Tabla sin hover, sin zebra, sin bordes limpios | Media | `record.component.html` |
| 7 | Stepper flechas conectoras con CSS hack complejo | Baja | `stepper.component.html` |
| 8 | Altura fija `35rem` en canvas panels | Media | `home.component.html` |
| 9 | Sin tema Tailwind extendido (colores, spacing) | Media | `tailwind.config.js` |
| 10 | Colores inconsistentes entre componentes | Media | Global |
| 11 | Sin estados de focus/hover en botones interactivos | Media | Global |
| 12 | Fórmula sin estilo tipográfico destacado | Baja | `home.component.html` |
| 13 | Sin responsive refinado para mobile | Media | Global |
| 14 | Loading overlay sin backdrop blur | Baja | `loading.component.html` |
| 15 | Sin transiciones entre tabs | Baja | `layout.component.html` |
| 16 | Botón "Limpiar tabla" rojo sin confirmación visual | Media | `record.component.html` |

---

## 6. Proposed Visual Direction

### Mood & Tone
- **Clínico pero moderno:** limpio, preciso, calmado
- **Profesional:** tipografía clara, espaciado generoso, jerarquía visual fuerte
- **Confiable:** colores sobrios con acentos controlados, estados claros
- **No intimidante:** evitar rojos agresivos, usar amber para warnings

### Color System
- **Primary:** slate/blue médico (`#1E40AF` → `#3B82F6`) — confianza y precisión
- **Surface:** white cards sobre fondo `#F1F5F9` (slate-100) — limpieza
- **Success:** emerald (`#059669`) — resultados válidos
- **Warning:** amber (`#D97706`) — advertencias de muestreo bajo
- **Error:** rose (`#E11D48`) — errores, no rojo puro
- **Neutral:** slate palette para textos y bordes

### Typography
- Mantener Roboto pero usar pesos 400/500/700 (agregar 700)
- Jerarquía clara: `text-2xl` para títulos de sección, `text-lg` para subsecciones, `text-sm` para datos
- Números de resultados en `font-mono` o `font-semibold` para legibilidad

### Layout
- Cards con `rounded-xl`, `shadow-sm`, bordes sutiles `border border-slate-200`
- Espaciado consistente: `gap-6` entre secciones, `p-6` dentro de cards
- Canvas panels con altura responsive (`min-h-[24rem]` en lugar de `35rem` fijo)
- Header más compacto y profesional con icono de radiografía/imagen

### Component Feel
- **Stepper:** más limpio, con línea conectora horizontal en lugar de flechas CSS
- **Tabla:** hover states, zebra striping sutil, header con fondo slate-50
- **Botones:** consistentes, con focus rings visibles, iconos alineados
- **Empty states:** ilustración o icono grande + texto descriptivo + call-to-action
- **Toast:** posicionado top-right, con icono y animación de entrada
- **Loading:** backdrop con blur sutil, spinner centrado con mensaje

### Domain-Specific
- Iconografía médica/radiológica donde aplique (fa-x-ray, fa-image, fa-microscope si disponible)
- Lenguaje visual que refuerce "análisis de imagen" no "demo técnico"
- Resultados presentados como "reporte" no como "datos crudos"

---

## 7. Visual Consistency Rules

### Spacing
- Secciones: `gap-6` entre cards, `mb-6` entre bloques
- Cards internas: `p-6` padding
- Header: `h-16` con `px-6`
- Contenido principal: `px-4 md:px-6 lg:px-8`

### Cards
- `bg-white rounded-xl shadow-sm border border-slate-200`
- Hover: `shadow-md transition-shadow`
- Sin bordes redondeados excesivos (`rounded-2xl` → `rounded-xl`)

### Headers / Titles
- Sección: `text-xl font-semibold text-slate-800 flex items-center gap-2`
- Icono de sección: color primary (`text-blue-600`)
- Subtítulo: `text-sm text-slate-500`

### Buttons
- Primary: `bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 font-medium`
- Danger: `bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-5 py-2.5 font-medium`
- Focus: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- Iconos: `mr-2` con alineación vertical

### Forms / Inputs
- Slider: `accent-blue-600` consistente
- File input: zona de drop visual con borde dashed, hover state

### Tables
- Header: `bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wide`
- Rows: `hover:bg-slate-50 transition-colors`
- Borders: `border-b border-slate-200`
- Cells: `px-4 py-3`

### Icons
- FontAwesome solid, tamaño consistente por contexto
- En headers: `text-lg`
- En tablas: `text-sm mr-1`
- En empty states: `text-5xl` o `text-6xl`

### Badges / Status
- Success: `bg-emerald-50 text-emerald-700 border border-emerald-200`
- Warning: `bg-amber-50 text-amber-700 border border-amber-200`
- Error: `bg-rose-50 text-rose-700 border border-rose-200`

### Empty States
- Icono grande centrado (`text-5xl text-slate-300`)
- Título descriptivo (`text-lg font-medium text-slate-600`)
- Subtexto explicativo (`text-sm text-slate-400`)
- Call-to-action si aplica (botón o enlace)

### Loading States
- Backdrop: `bg-white/70 backdrop-blur-sm`
- Spinner: `mat-progress-spinner` con color primary
- Mensaje: `text-slate-700 font-medium`
- Subtexto: `text-slate-500 text-sm`

### Error States
- Banner con icono de warning
- Mensaje claro y accionable
- Color amber para warnings, rose para errores

### Responsive Behavior
- Mobile: stack vertical, tabs full-width, canvas panels apilados
- Tablet: 2 columnas donde aplique
- Desktop: layout completo con sidebar si fuera necesario

### Focus States
- **REMOVER** `* { outline: none !important; }`
- Reemplazar con: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` en elementos interactivos

---

## 8. Refactor Scope

### In Scope (cambios visuales permitidos)
- Colores, espaciado, tipografía, bordes, sombras
- Empty states, loading states, error states
- Header branding y logo
- Tabla estilos (hover, zebra, headers)
- Stepper diseño (línea conectora limpia)
- Toast posición y estilo
- Canvas panel alturas responsive
- Focus rings y accesibilidad visual
- Transiciones y microinteracciones
- HTML title y meta description
- Tailwind theme extension (colores de marca)

### Out of Scope (NO tocar)
- **Lógica de cálculo** (`CalculateAreaService`, `GeneratePointsService`)
- **API contracts** (no hay API externa, pero localStorage key `'historial'` se mantiene)
- **Routing behavior** (hash location, lazy loading, tab navigation)
- **Data models** (`ResultRow`, `LastResult`, `Dialog`)
- **Business logic** (stain detection, Monte Carlo formula, PNG validation)
- **File upload behavior** (accept PNG, canvas processing)
- **Component functionality** (stepper steps, loading visibility, dialog behavior)
- **Services** (all 5 services remain unchanged)
- **Pipes** (`NumerosPipe` unchanged)
- **Tests** (specs remain as-is)

---

## 9. Candidate Files or Areas to Modify

| Archivo | Tipo de Cambio |
|---------|---------------|
| `src/index.html` | Title, meta description, font weights |
| `src/styles.scss` | Remover `outline: none`, agregar focus ring utilities, Tailwind theme |
| `src/assets/styles/global.scss` | Actualizar CSS variables, responsive font sizes |
| `tailwind.config.js` | Extender tema con colores de marca, spacing, typography |
| `src/app/shared/components/layout/layout.component.html` | Header branding, logo, tab styling |
| `src/app/shared/components/layout/layout.component.scss` | Tab group custom styles |
| `src/app/pages/home/home.component.html` | Canvas panels, toast, formula panel, results panel, empty states |
| `src/app/pages/home/home.component.scss` | Agregar estilos si necesarios |
| `src/app/pages/record/record.component.html` | Table styling, empty state, button styling |
| `src/app/pages/record/record.component.scss` | Agregar estilos si necesarios |
| `src/app/shared/components/ui/stepper/stepper.component.html` | Línea conectora limpia |
| `src/app/shared/components/ui/stepper/stepper.component.scss` | Stepper styles |
| `src/app/shared/components/ui/loading/loading.component.html` | Backdrop blur, mejor layout |
| `src/app/shared/components/ui/loading/loading.component.scss` | Loading overlay styles |
| `src/app/shared/components/ui/alert-dialog/alert-dialog.component.html` | Dialog styling |
| `src/app/shared/components/ui/alert-dialog/alert-dialog.component.scss` | Dialog styles |

---

## 10. Implementation Phases

### Phase 1: Foundation & Shared Layout
**Objetivo:** Establecer el sistema visual base y mejorar el shell de la aplicación.
- Extender Tailwind config con colores de marca (slate/blue medical palette)
- Remover `outline: none !important` y agregar focus ring utilities globales
- Actualizar `index.html`: title "AreaDot", meta description, agregar Roboto 700
- Mejorar header: logo con icono de imagen/radiografía, branding consistente
- Refinar tab group: mejor integración visual con el header
- Actualizar `global.scss` con CSS variables del nuevo sistema de colores

**Archivos:** `tailwind.config.js`, `styles.scss`, `index.html`, `global.scss`, `layout.component.html`, `layout.component.scss`

### Phase 2: Home Page — Main Screens
**Objetivo:** Mejorar visualmente la página principal de cálculo.
- Canvas panels: alturas responsive, bordes mejorados, empty states con diseño
- Upload zone: dashed border, hover state, mejor empty state
- Formula panel: estilo tipográfico destacado, fondo sutil
- Results panel: layout de métricas tipo "dashboard cards"
- Slider: estilo mejorado, label consistente
- Botón calcular: estilo consistente con focus ring

**Archivos:** `home.component.html`, `home.component.scss`

### Phase 3: States & Feedback
**Objetivo:** Mejorar todos los estados de feedback.
- Toast notifications: posición top-right, icono, animación de entrada
- Loading overlay: backdrop blur, mejor layout
- Warning banner: estilo amber consistente
- Stepper: línea conectora horizontal limpia, mejor spacing

**Archivos:** `home.component.html`, `stepper.component.html`, `stepper.component.scss`, `loading.component.html`, `loading.component.scss`

### Phase 4: Record Page
**Objetivo:** Mejorar la página de historial.
- Tabla: header con fondo slate-50, hover rows, zebra striping sutil
- Empty state: diseño con icono grande + texto + guía
- Botón "Limpiar tabla": estilo consistente, posible confirmación visual
- Color condicional en área estimada: emerald/amber en lugar de rojo/azul

**Archivos:** `record.component.html`, `record.component.scss`

### Phase 5: Dialog & Polish
**Objetivo:** Refinar componentes compartidos y detalles finales.
- AlertDialog: mejor tipografía, icono de alerta, espaciado
- Transiciones entre tabs
- Microinteracciones (hover en cards, focus en inputs)
- Responsive refinado para mobile
- Validación de consistencia visual global

**Archivos:** `alert-dialog.component.html`, `alert-dialog.component.scss`, todos los componentes para polish final

### Phase 6: Accessibility & Validation
**Objetivo:** Asegurar accesibilidad y validar que nada se rompió.
- Verificar focus rings en todos los elementos interactivos
- Verificar contraste de colores (WCAG AA)
- Verificar navegación por teclado
- Verificar responsive en mobile/tablet/desktop
- Verificar que la app compila sin errores
- Verificar que todos los flujos funcionales siguen operativos

---

## 11. Validation Checklist

### Build & Compilation
- [ ] `npm run build` compila sin errores
- [ ] `npm start` levanta sin warnings de consola
- [ ] No hay errores de TypeScript
- [ ] No hay warnings de Angular compiler

### Functional Flows (sin cambios de comportamiento)
- [ ] Subir imagen PNG funciona igual
- [ ] Validación de escala de grises funciona igual
- [ ] Slider de puntos funciona igual
- [ ] Cálculo de área produce mismos resultados
- [ ] Historial se guarda en localStorage igual
- [ ] Tabla de historial muestra datos igual
- [ ] Limpiar historial funciona igual
- [ ] Tabs navegan entre páginas igual
- [ ] Dialog de alerta se muestra igual
- [ ] Loading overlay aparece durante cálculo igual

### Visual Validation
- [ ] Header con branding consistente
- [ ] Cards con estilo uniforme
- [ ] Tabla con hover y headers estilizados
- [ ] Empty states con diseño completo
- [ ] Toast posicionado correctamente
- [ ] Stepper con línea conectora limpia
- [ ] Loading overlay con backdrop blur
- [ ] Focus rings visibles en elementos interactivos
- [ ] Colores consistentes en toda la app

### Responsive
- [ ] Mobile (< 640px): layout apilado, tabs funcionales
- [ ] Tablet (640px - 1280px): 2 columnas donde aplique
- [ ] Desktop (> 1280px): layout completo

### Accessibility
- [ ] Navegación por teclado funcional
- [ ] Focus rings visibles en todos los elementos interactivos
- [ ] Contraste de texto cumple WCAG AA
- [ ] Alt texts en imágenes
- [ ] Labels en inputs de formulario

### No Regression
- [ ] No se modificó lógica de servicios
- [ ] No se modificaron modelos de datos
- [ ] No se modificaron rutas
- [ ] No se modificó comportamiento de localStorage
- [ ] No se modificaron tests existentes

---

## 12. Risks

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Remover `outline: none` puede revelar estilos de Material no deseados | Medio | Agregar focus ring utilities consistentes en todos los elementos interactivos |
| Cambiar colores de Material theme puede afectar componentes internos | Medio | Usar Tailwind para overrides visuales, no cambiar Material theme base |
| Stepper conector CSS puede romper en diferentes navegadores | Bajo | Usar approach más simple con pseudo-elementos o SVG |
| Canvas panels con altura responsive pueden cortar imágenes | Medio | Usar `min-h` en lugar de `h` fija, verificar con imágenes de diferentes tamaños |
| Tailwind config extendido puede conflictuar con Material styles | Bajo | Usar prefijos de Tailwind, verificar build |
| Cambios visuales pueden afectar tests visuales si existen | Bajo | No hay tests visuales, solo unit tests básicos |
| Refactor de múltiples archivos puede introducir regresiones | Medio | Trabajar por fases, validar cada fase antes de continuar |

---

## 13. Agent Handoff

### Agente recomendado: `frontend-angular-senior`

Este es un proyecto Angular 18 standalone con Angular Material, Tailwind CSS y SCSS. El agente `frontend-angular-senior` es el especialista correcto para implementar las fases de refactor visual.

### Instrucciones para el agente

1. **Empezar por Phase 1** (Foundation & Shared Layout) — es la base de todo lo demás
2. **No modificar** ningún archivo de `src/app/core/` (servicios, modelos, pipes)
3. **No modificar** la lógica de componentes (métodos, properties, constructors)
4. **Solo cambiar** templates HTML, archivos SCSS/CSS, y `tailwind.config.js`
5. **Validar** que `npm start` funciona después de cada fase
6. **Mantener** toda la funcionalidad existente intacta
7. **Usar** Tailwind utilities siempre que sea posible, SCSS solo para overrides de Material
8. **Preservar** los path aliases `@core/*`, `@shared/*`, `@Pages/*`
9. **No agregar** nuevas dependencias sin justificación
10. **Seguir** el orden de fases propuesto — no saltar fases

### Archivos de referencia para el agente
- `AGENTS.md` — contiene stack, arquitectura, convenciones y comandos
- `tailwind.config.js` — actualmente vacío de extensiones, necesita tema de marca
- `src/styles.scss` — contiene Material theme + Tailwind imports + global styles
- `src/assets/styles/global.scss` — CSS variables y responsive font sizes
