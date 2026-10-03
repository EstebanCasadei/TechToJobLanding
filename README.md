# TechToJob

Landing estática de TechToJob, una comunidad de desarrolladores y empresas tech en español. Explica que las oportunidades nacen de participar, construir y mostrar cómo se trabaja, y dirige a la persona al Discord de la comunidad.

## Stack

Next.js 16 (App Router, generación estática) · React 19 · TypeScript estricto · Tailwind CSS 4 · `next-intl` (español en `/`) · Sora mediante `next/font/google` · Blobatar · GSAP cargado de forma diferida.

## Instalación y uso

```sh
pnpm install --frozen-lockfile
pnpm dev                        # http://localhost:3000
pnpm dev --hostname 0.0.0.0     # probar desde un móvil en la misma red
pnpm check                      # ESLint + comprobación estricta de tipos
pnpm build                      # página estática, metadata, robots y sitemap
```

## Diseño, contenido e IA

El diseño visual es propio, la IA se utilizó únicamente para el pasaje a código y algunas decisiones de diseño.

Los testimonios, noticias, conversaciones y perfiles son contenido editorial provisional de demostración para esta entrega del torneo; cada testimonio admite fotografía y enlace verificable sin rediseñar componentes. No se muestran empleos garantizados ni métricas inventadas. La newsletter es un formulario estático que no envía datos.

## El muro de la comunidad

La sección de cierre muestra un muro interactivo y arrastrable donde cada Blobatar representa a una persona de la comunidad. En el centro queda un hueco libre: "Este hueco tiene tu nombre" que la visita puede reclamar entrando al Discord.

Hoy los nombres son editoriales (`messages/es.json`). La implementación prevista: al entrar al Discord se preguntará a cada persona si quiere aparecer en la web, explicando qué se muestra (solo su nombre, sin otros datos). Un bot de Discord, u otro mecanismo equivalente, recogerá los nombres de quienes acepten y el muro pasará a alimentarse de esa lista real sustituyendo el contenido de demostración, sin cambios de diseño.

## Editar las noticias

Todo el contenido de esta sección está en `data/news.json`, bajo la clave `es`. No hace falta editar componentes ni `messages/es.json`: `next-intl` incorpora este JSON durante la generación estática. Las tres entradas actuales y `og-cover.png` son ejemplos aprobados.

- `title`: título de la sección.
- `items`: las tres noticias en orden. La primera es la principal, ocupa dos filas a la izquierda en escritorio y aparece primero en móvil. Las otras dos van a la derecha; en móvil se apilan en el mismo orden.
- Cada noticia incluye `title`, `category`, `summary`, `date` (formato `YYYY-MM-DD`), `dateLabel` (fecha visible) y `links` (uno o varios objetos con `label` y una URL real en `url`). Actualiza ambas fechas conjuntamente.
- La primera noticia incluye `image`: `src`, `alt`, `width` y `height`. Usa una imagen local dentro de `public/images`, escribe su ruta pública (por ejemplo, `/images/og-cover.png`) y sus dimensiones reales. Las otras dos tarjetas no muestran imagen.

Para publicar cambios: edita el JSON, comprueba `pnpm check` y `pnpm build`, y haz push a la rama de producción configurada en Vercel. Con la integración de Git activada, Vercel reconstruye y publica el contenido; un push a otra rama genera una preview. No hay backend ni actualización en vivo. Si cambias la imagen, incluye también el archivo en el push.

La grilla usa dos columnas desde 960 px y una columna por debajo. Las tarjetas tienen encabezados semánticos, fechas con `<time>`, enlaces descriptivos y una imagen optimizada con `next/image` y carga diferida. No incorpora JavaScript de cliente. Los datos se comprueban contra tipos TypeScript.

Validación local: lint, tipos, build y navegador de producción en móvil, tablet y escritorio, incluido un ancho equivalente a zoom del 200 %. Capturas en `artifacts/news-grid`. La comprobación en móvil real y la validación final en la URL pública siguen pendientes.

## Fondos oscuros

El azul pizarra `#263544` reemplaza los fondos blancos de secciones, tarjetas y controles, salvo las tarjetas de testimonios, que conservan su blanco original. El color está centralizado en `--color-slate` (`app/global.css`) y se consume mediante Tailwind. Se mantienen los fondos verdes, el gris de marca y los post-its beige para conservar los cambios de color entre secciones.

Los textos, las fechas, los enlaces, el placeholder del email, los bordes y el globo del muro se adaptaron al fondo oscuro. No se sustituyeron recursos ni se añadió JavaScript. La cuadrícula de «Cómo funciona» sigue presente.

Comprobaciones locales: `pnpm check`, build estático de producción, revisión responsive a 320, 390, 768, 1440 y 1920 px y reflujo a 720 px. Se comprobaron los colores calculados y el contraste de los textos sobre los fondos afectados, el foco del formulario y el globo de la comunidad. Capturas en `artifacts/slate-backgrounds`. La verificación en móvil real y Lighthouse final en producción siguen pendientes.

## Recursos y licencias

| Recurso | Procedencia | Condiciones |
| --- | --- | --- |
| Marca (logotipo, símbolo, flechas, trazos) | Material proporcionado por TechToJob | Uso autorizado para esta landing; sin licencia abierta. |
| Sora | Google Fonts | SIL Open Font License 1.1; copia en `public/licenses/Sora-OFL.txt`. |
| Blobatar y `@blobatar/react` | [blobatar.dev](https://blobatar.dev/) | MIT. Avatares generados localmente. |
| Icono de Discord | Recurso del diseño | Condiciones de marca de Discord. |
| `og-cover.png` | Generada con IA a partir de la marca oficial | Mismas condiciones que el resto de la marca. |

No se utilizan fotografías externas ni recursos remotos durante la carga.
