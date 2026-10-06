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

## Recursos y licencias

| Recurso | Procedencia | Condiciones |
| --- | --- | --- |
| Marca (logotipo, símbolo, flechas, trazos) | Material proporcionado por TechToJob | Uso autorizado para esta landing; sin licencia abierta. |
| Sora | Google Fonts | SIL Open Font License 1.1; copia en `public/licenses/Sora-OFL.txt`. |
| Blobatar y `@blobatar/react` | [blobatar.dev](https://blobatar.dev/) | MIT. Avatares generados localmente. |
| Icono de Discord | Recurso del diseño | Condiciones de marca de Discord. |
| `og-cover.png` | Generada con IA a partir de la marca oficial | Mismas condiciones que el resto de la marca. |

No se utilizan fotografías externas ni recursos remotos durante la carga.
