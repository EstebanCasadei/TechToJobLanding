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

Validación local: lint, tipos, build y navegador de producción en móvil, tablet y escritorio, incluido un ancho equivalente a zoom del 200 %. La comprobación en móvil real y la validación final en la URL pública siguen pendientes.

## Fondos oscuros

El gris claro de fondo `#3b4245` reemplaza únicamente los fondos blancos de las secciones «Cómo funciona», Networking y Noticias. Todas comparten la misma cuadrícula verde de 5 rem, centrada y definida en `.section-grid` (`app/global.css`). El color está centralizado en `--color-slate` y se consume mediante Tailwind.

Las tarjetas, los rankings, el formulario y el globo del muro conservan sus superficies blancas originales y su texto oscuro; los testimonios también siguen blancos. Se mantienen los fondos verdes, el gris de marca y los post-its beige. Los títulos y textos que aparecen directamente sobre el gris de fondo usan colores claros. No se añadieron recursos, dependencias ni JavaScript.

Cada sección con cuadrícula incorpora degradados negros al 50 % desde el borde superior e inferior hacia el interior. Su profundidad se adapta entre 4 y 8 rem y permanece unida a la sección, sin cubrir el contenido.

La cuadrícula y los degradados se desplazan con la sección mediante `background-attachment: scroll`, sin efecto de paralaje. Las etiquetas de canales de Networking usan fondo verde y texto oscuro para destacar sobre el gris de fondo. Se verificaron los estilos calculados de las capas de fondo en el navegador de producción.

Comprobaciones locales: `pnpm check`, build estático de producción y revisión responsive a 320, 390, 768, 1440 y 1920 px. Se comprobaron la cuadrícula compartida, las superficies blancas y el foco de los controles. La verificación en móvil real y Lighthouse final en producción siguen pendientes.

## Crédito de autor

La etiqueta «Construida por Esteban Casadei» enlaza directamente a su LinkedIn y permanece en la esquina inferior derecha. Es un componente de servidor sin JavaScript adicional: el texto está en `messages/es.json` y los datos del autor en `lib/site.ts`. Usa los colores y la fuente del sitio, un área táctil mínima de 44 px, foco visible y márgenes que respetan el área segura del dispositivo. El footer reserva espacio inferior para evitar que el crédito cubra su contenido.

Verificación local: `pnpm check`, `pnpm build` y revisión del servidor de producción en anchos de 320, 390, 768, 1440 y 1920 px. La comprobación en un móvil real queda pendiente.

## Verificación sin capturas

Por decisión del propietario, no se toman ni se guardan capturas de pantalla, tampoco durante las comprobaciones de navegador. Las verificaciones se documentan mediante resultados de comandos y observaciones. No se incluyen archivos de `artifacts` en el repositorio.

## Recursos y licencias

| Recurso | Procedencia | Condiciones |
| --- | --- | --- |
| Marca (logotipo, símbolo, flechas, trazos) | Material proporcionado por TechToJob | Uso autorizado para esta landing; sin licencia abierta. |
| Sora | Google Fonts | SIL Open Font License 1.1; copia en `public/licenses/Sora-OFL.txt`. |
| Blobatar y `@blobatar/react` | [blobatar.dev](https://blobatar.dev/) | MIT. Avatares generados localmente. |
| Icono de Discord | Recurso del diseño | Condiciones de marca de Discord. |
| `og-cover.png` | Generada con IA a partir de la marca oficial | Mismas condiciones que el resto de la marca. |

No se utilizan fotografías externas ni recursos remotos durante la carga.
