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

## Cómo se presenta

Durante la charla alcanza con la flecha **→** (o espacio, o el clicker): cada slide va mostrando sus elementos de a uno y las demos se disparan solas en el momento justo (la cadena se falsifica y se rompe, la calculadora de gas recorre los valores, la ruta de la plata pasa de «hoy» a «con wFIAT», los tracks se resaltan uno por uno, la autoevaluación se completa, el mapa recorre las seis sedes). Cuando la slide terminó, → pasa a la siguiente. Los puntitos abajo a la izquierda muestran cuántos pasos quedan. **←** deshace el último paso.

Todo sigue siendo clicable si querés intervenir a mano. En el celular en vertical no hay pasos: se ve todo junto.

## Controles

| Tecla | Acción |
| --- | --- |
| `→` `Espacio` `PgDn` | Siguiente |
| `←` `PgUp` | Anterior |
| `1`–`9`, `Inicio`, `Fin` | Saltar a slide |
| `O` | Índice de todas las slides |
| `F` | Pantalla completa |

En el celu: deslizar a los costados; en vertical las slides se muestran en una columna con scroll. Cada slide tiene su URL (`#/7`). La barra de progreso de arriba es clicable por sección. `Ctrl+P` exporta a PDF, una slide por página.

## Qué es interactivo

- **02 · Quién soy** — Franco, Cole Juy, jujuy.dev y QRs (comunidad, Instagram, X, GitHub). Los links se editan en `links.js`.
- **07 · ¿Para qué sirve la Web3?** — 6 ventajas con comparación “con un banco / app” vs. “con Web3”.
- **08 · ¿Por qué se habla tanto ahora?** — acordeón con los 4 motivos + el caso LatAm.
- **05 · Blockchain** — cadena de 3 bloques editable: cambiá un movimiento y la cadena se rompe.
- **06 · Conceptos** — clave privada que “no se muestra”, conversor ARS → wARS 1:1, costo de gas por cantidad de tx.
- **10 · Números** — contadores animados y calculadora de gas mensual.
- **11 / 20** — cuenta regresiva al cierre (lun 9/11, 06:00 ART).
- **12 · wFIAT** — ruta de la plata: hoy (vía USD) vs. con wFIAT.
- **13 · Tracks** — barra de premios y tarjetas para enfocar cada track (Track 1 abre su detalle).
- **14 / 16 / 20** — checklists que se guardan en el navegador.
- **15 · Evaluación** — autoevaluación de 5 criterios (20 % c/u).
- **17 · Ideas** — “elegí una al azar”.
- **18 · Stack** — comandos con copiar al portapapeles.
- **19 · Prompt y skills** — comandos de skills (Celopedia y Celo Builders), contexto llms.txt y un prompt para el coding agent con botón de copiar.
- **20 · Sedes** — mapa con las 6 ciudades y quién organiza cada una.

## Archivos

```
index.html   slides
deck.css     estilos (lienzo 960×540, las medidas del PDF, escalado al viewport; en celular vertical fluye en una columna)
deck.js      navegación + interacciones
landing.html landing anterior de la sede (fuentes en fonts/)
links.js     links de los QR (comunidad, redes, esta presentación)
vendor/      qrcode.js (MIT) para generar los QR
assets/      mapa, logos y artes de los tracks (extraídos del PDF v9)
```
