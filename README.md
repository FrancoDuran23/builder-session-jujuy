# Builder Session Jujuy
Agents on Open Rails (Celo × Ripio) · sáb 17/10

Deck interactivo de la sesión: HTML + CSS + JS, sin build ni dependencias.

## Ver la presentación

Online: https://francoduran23.github.io/builder-session-jujuy/

En local, abrí `index.html` en el navegador (doble clic), o serví la carpeta:

```bash
npx serve .        # o: python3 -m http.server
```


GitHub Pages lo sirve desde `main` / `/ (root)`; `.nojekyll` evita que Jekyll procese el sitio. La landing anterior quedó en `landing.html`.

## Controles

| Tecla | Acción |
| --- | --- |
| `→` `Espacio` `PgDn` | Siguiente |
| `←` `PgUp` | Anterior |
| `1`–`9`, `Inicio`, `Fin` | Saltar a slide |
| `O` | Índice de todas las slides |
| `F` | Pantalla completa |

En el celu/tablet: deslizar a los costados. Cada slide tiene su URL (`#/7`). La barra de progreso de arriba es clicable por sección. `Ctrl+P` exporta a PDF, una slide por página.

## Qué es interactivo

- **04 · Blockchain** — cadena de 3 bloques editable: cambiá un movimiento y la cadena se rompe.
- **05 · Conceptos** — clave privada que “no se muestra”, conversor ARS → wARS 1:1, costo de gas por cantidad de tx.
- **07 · Números** — contadores animados y calculadora de gas mensual.
- **08 / 17** — cuenta regresiva al cierre (lun 9/11, 06:00 ART).
- **09 · wFIAT** — ruta de la plata: hoy (vía USD) vs. con wFIAT.
- **10 · Tracks** — barra de premios y tarjetas para enfocar cada track (Track 1 abre su detalle).
- **11 / 13 / 17** — checklists que se guardan en el navegador.
- **12 · Evaluación** — autoevaluación de 5 criterios (20 % c/u).
- **14 · Ideas** — “elegí una al azar”.
- **15 · Stack** — comandos con copiar al portapapeles.
- **16 · Sedes** — mapa con las 6 ciudades y quién organiza cada una.

## Archivos

```
index.html   slides
deck.css     estilos (lienzo 1600×900 escalado al viewport)
deck.js      navegación + interacciones
landing.html landing anterior de la sede (fuentes en fonts/)
assets/      mapa, logos y artes de los tracks (extraídos del PDF v9)
```
