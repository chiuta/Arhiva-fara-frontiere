# Arhiva fără frontiere — explorador de Internet Archive

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versión:** 1.1.0 · **Última actualización:** 2026-10-14

Un solo archivo HTML para buscar y explorar colecciones, autores y subidas públicas de Internet Archive (archive.org), en 7 idiomas.

**En línea:** https://chiuta.github.io/Arhiva-fara-frontiere/

![Captura de pantalla](screenshot.png)

*(La captura usa datos de ejemplo simulados localmente, no resultados reales de archive.org.)*

## Qué es

Un cliente web no oficial para la API pública de Internet Archive: escribes una colección, un uploader, un autor o un tema (o pegas un enlace `archive.org/details/...`) y ves los resultados como fichas, con vista previa en la aplicación cuando es posible. No está afiliado a Internet Archive. No es una herramienta de búsqueda en archivos web (Wayback Machine, Arquivo.pt, etc.): solo consulta `advancedsearch.php` y `metadata` de archive.org.

## Funciones

Verificadas en el código:
- Búsqueda por colección, uploader, autor, tema o «Auto» (colección OR uploader OR autor); se reconocen el prefijo `@` y los enlaces `archive.org/details|metadata|download|embed/...`.
- Filtros: tipo de contenido (vídeo, audio, textos, imágenes, software, etree, datos, archivos web, colecciones), orden (incluido aleatorio), 24/48/96 resultados por página, idioma, rango de años; «Cargar más» (tope de ~10 000 resultados).
- Ficha de detalle: descripción (convertida a texto plano), temas, colecciones superiores, los primeros 25 archivos con enlace de descarga, enlace «Abrir en archive.org».
- Vista previa incrustada (iframe `archive.org/embed/...`) para vídeo, audio, textos, software, etree; la imagen más grande para el tipo «imágenes».
- Favoritos guardados localmente en el navegador (localStorage, clave `arhiva-ff-favorite-v1`), con exportación/importación JSON.
- Las últimas 8 búsquedas correctas se sugieren en el campo de búsqueda (localmente, en el navegador; botón «Borrar búsquedas recientes»).
- Ante un error de red aparece un enlace «Probar la misma búsqueda en archive.org →» a la búsqueda oficial.
- Mensaje claro cuando estás sin conexión (sin peticiones de red inútiles); los favoritos siguen consultables.
- Atajo: `/` lleva el foco al campo de búsqueda.
- Interfaz en rumano, inglés, francés, italiano, español, portugués y alemán (`?lang=xx` o el idioma del navegador).
- Teclado: fichas enfocables (Intro/Espacio), Esc cierra la ventana, foco atrapado en la ventana.

## Manual de uso

1. Escribe en el campo de búsqueda una colección (p. ej., `prelinger`), un `@uploader`, un autor o pega un enlace de archive.org.
2. Elige el modo (Auto / Colección / Uploader / Autor / Tema) y, opcionalmente, los filtros.
3. Pulsa «Buscar»; pulsa «Cargar más» para la página siguiente.
4. Pulsa una ficha para ver detalles y vista previa; Esc cierra la ventana.
5. Marca los favoritos con ☆; «Exportar favoritos» los guarda en un archivo JSON, «Importar favoritos» los vuelve a cargar.

## Privacidad y red

- El único host externo contactado: `archive.org` (y sus subdominios, mediante redirecciones). Las búsquedas, los metadatos, las miniaturas, las imágenes, el reproductor incrustado y las descargas son peticiones directas a Internet Archive: reciben tu dirección IP, tu navegador, lo que buscas y lo que abres, y pueden establecer cookies dentro del reproductor. La aplicación no tiene servidor propio, analítica ni cuenta, pero la ausencia de seguimiento no puede garantizarse por parte de Internet Archive; consulta su política de privacidad.
- Almacenamiento local: la lista de favoritos (metadatos mínimos: identificador, título, tipo, autor, fecha; clave `arhiva-ff-favorite-v1`) y las últimas 8 búsquedas (clave `arhiva-ff-recente-v1`) en `localStorage`, en tu dispositivo; no se envían a ningún sitio. Los eliminas vaciando los favoritos, con el botón «Borrar búsquedas recientes» o desde los datos del sitio. Si el almacenamiento está bloqueado, los favoritos quedan solo en memoria.
- Permisos del navegador: no solicita ninguno.
- Seguridad: los textos recibidos de archive.org se muestran como texto (no HTML); las descripciones se convierten con `DOMParser`; la política CSP limita la red a archive.org y permite el script solo mediante hash (sin `unsafe-inline` para scripts); el marco de vista previa tiene `sandbox`. La importación de favoritos se valida.

## Límites y advertencias

- El contenido pertenece a Internet Archive y a quienes lo subieron; los derechos de autor son de los titulares. Comprueba la situación jurídica de cada material antes de reutilizarlo.
- Si archive.org no está disponible o limita las peticiones, la aplicación muestra un mensaje de error (las peticiones caducan a los 20 segundos).
- La vista previa incrustada depende del reproductor de Internet Archive y puede ser bloqueada por el navegador o por la configuración de cookies; no se ha probado en este repositorio con una red real.
- El tope de la API limita la búsqueda a aproximadamente los primeros 10 000 resultados.

## Uso local / sin conexión

Descarga `index.html` y ábrelo en un navegador. No funciona sin internet (todos los datos vienen de archive.org).

## Licencia

MIT — consulta el archivo [LICENSE](LICENSE).

## Historial / Changelog

### 1.1.0 — 2026-10-14
- Copia de seguridad y etiquetado de datos (fff-kit).

### 1.0.0 — 2026-10-12
- La versión y la fecha de la última actualización se muestran en la aplicación (pie de página, en 7 idiomas).

### 11 de octubre de 2026 (ronda 7)
- Corregido: el texto del pie de página (7 idiomas) decía que la aplicación no guarda nada en el navegador, aunque los favoritos se conservan en `localStorage`.
- Nuevo: búsquedas recientes con sugerencias y borrado; enlace a la búsqueda oficial de archive.org cuando la petición falla (traducidos a 7 idiomas).

### 11 de octubre de 2026 (ronda 6)
- Nuevo: los favoritos se conservan en `localStorage`; mensaje específico en 7 idiomas cuando estás sin conexión; atajo `/` para la búsqueda.
- Seguridad: CSP con `script-src` por hash (sin `'unsafe-inline'` para scripts).

### 11 de octubre de 2026
- Corregido: el botón «Cargar más» ya no aparece en el estado vacío (el atributo hidden era anulado por el CSS).
- Corregido: los campos «año desde / año hasta» ya no se truncan en pantallas estrechas (ancho aumentado, paso a una nueva línea).
- Verificado: 0 violaciones de axe-core a 1280 y 360 px, sin errores de consola.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contacto: alexio@trom.tf

## Resumen

Un explorador no oficial, en un solo archivo, para las API públicas de búsqueda y metadatos de Internet Archive (interfaz en 7 idiomas): búsqueda por colección, uploader, creador o tema, filtros, vista previa de los elementos en un reproductor incrustado, exportación de favoritos como JSON. Solo contacta con archive.org (que ve tu IP y tus consultas); solo almacena localmente tu lista de favoritos (localStorage) y no tiene analítica. No es una herramienta de búsqueda en archivos web (Wayback). Licencia: MIT (consulta LICENSE).
