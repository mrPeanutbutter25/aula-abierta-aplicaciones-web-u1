# Aula Abierta

Sitio web responsivo y accesible para promocionar una iniciativa académica de talleres tecnológicos.

**Autora:** Bianchi Sujey Navarro Cortez  
**Asignatura:** Aplicaciones Web · Unidad 1  
**Institución:** Universidad Politécnica Salesiana

- [Demostración](https://mrpeanutbutter25.github.io/aula-abierta-aplicaciones-web-u1/)
- [Repositorio](https://github.com/mrPeanutbutter25/aula-abierta-aplicaciones-web-u1)
- [Informe técnico](documentacion/Navarro_Cortez_Bianchi_Sujey_AplWeb_U1.pdf)

## Ejecutar

Se puede abrir `index.html` directamente, sin compilación ni instalación. Para usar un servidor local:

```sh
python -m http.server 8000
```

Abrir http://localhost:8000. Para publicar en GitHub Pages: Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.

## Funcionalidad

Seis secciones: inicio, iniciativa, talleres, ruta de aprendizaje, formulario y preguntas frecuentes. Menú móvil con `aria-expanded`, cierre con Escape y recuperación del foco; filtro de talleres con estado pulsado y anuncio de resultados; validación del formulario con errores asociados, foco en el primer campo inválido y confirmación. Los enlaces de talleres preseleccionan una opción. Las preguntas usan `details` y `summary` nativos.

El contenido es demostrativo. No hay inscripciones reales, backend, analítica ni almacenamiento de datos. El formulario se habilita mediante JavaScript y nunca envía datos. Sin JavaScript se conservan el contenido, las preguntas frecuentes y la navegación.

## Diseño y accesibilidad

HTML5 semántico, un `h1`, encabezados ordenados, `lang="es"`, enlace de salto, etiquetas explícitas, alternativa textual de la ilustración y foco visible. CSS mobile first con variables, Grid/Flexbox e imágenes SVG fluidas creadas para este proyecto. No se usan fuentes externas, frameworks ni bibliotecas en producción.

- **Base:** una columna, menú plegable y controles táctiles.
- **48rem / 768px:** navegación horizontal y columnas cuando existe espacio suficiente.
- **70rem / 1120px:** tres tarjetas por fila y mayor separación de bloques.
- `prefers-reduced-motion` desactiva el desplazamiento suave.

## Evidencias y pruebas

En `evidencias/` se incluyen capturas completas a **390 × 844**, **768 × 1024** y **1440 × 1000** píxeles de viewport, y `resultados-pruebas.json` con los resultados reales de las comprobaciones en Chrome mediante Playwright. La altura de cada PNG es mayor por tratarse de una captura completa.

Se probaron: ausencia de desbordamiento; Tab, salto al contenido y foco; menú móvil y Escape; filtros; formulario vacío, correo incorrecto y datos válidos; enlaces internos; IDs únicos; etiquetas y alternativas; reflow a 320px; texto al 200%; contenido sin JavaScript y ausencia de errores de ejecución. Los seis pares principales de texto/fondo superan 4.5:1. La prueba estructural es básica, no sustituye una validación completa W3C ni una auditoría WCAG.

Para reproducir las comprobaciones automatizadas se incluye `pruebas/verificar.cjs`. Requiere Node.js, `npm install` y `npx playwright install chromium`; después ejecutar `npm test`. `CHROME_PATH` permite utilizar un Chrome instalado. Las dependencias son solo de desarrollo.

## Mejoras pendientes

Probar con NVDA/VoiceOver, Firefox y Safari; ejecutar un validador HTML completo; ensayar zoom real en navegadores y usuarios con necesidades de acceso. Una inscripción real requeriría backend, tratamiento de errores de red, consentimiento informado y política de privacidad.

## Referencias de la consigna (APA)

Frain, B. (2022). *Responsive Web Design with HTML5 and CSS* (4.ª ed.). Packt.

DuRocher, D. (2021). *HTML and CSS QuickStart Guide*. ClydeBank Media.

Robbins, J. N. (2018). *Learning Web Design* (5.ª ed.). O'Reilly Media.
