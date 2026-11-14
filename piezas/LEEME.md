# Piezas

Lo que ya se hizo bien en un video y sirve para otros: se importa, no se rehace. Cada pieza dice arriba cómo se usa.
`muestras.jpg`: cómo se ven. Se importan con `#piezas/…` desde cualquier archivo de un proyecto.

| Pieza | Qué es | Para qué |
|---|---|---|
| `celular.js` | El celular (`telefono`), un reel dentro (`reel`), el fondo de noche (`fondo`), el pulgar por fuera (`pulgar` en `encima`), los gestos (`gesto`) y los clips de otros videos (`cargarClips`). `CEL`: dónde queda; a escala `LLENA` la pantalla llena la imagen (pasar de pantalla completa al celular sin salto). | promos, videos de venta, todo lo que pasa en un celular |
| `capturas.js` | Capturas de perfiles dentro del celular, que parezcan de verdad: barra de estado simulada si está recortada, barra de Instagram abajo, cabecera fija al subir. Mientras falte una captura, un perfil de muestra (`perfilMuestra`). | enseñar cuentas o resultados de verdad |
| `subtitulos.js` | Más sombra a los subtítulos (`sombraSubtitulos(g, t)` al final de cada `dibuja`). | fondos con detalle (capturas, fotos, clips) |
| `boton-comprar.js` | El botón «COMPRAR» (o la palabra que se le pase). | el CTA de un video de venta |
| `titulo-portada.js` | El título de portada: blanco arriba, la clave en rojo. | enseñar portadas dentro de un video |
| `objetos.js` | Objetos con acabado, en 3D con la cámara del kit: cajas sombreadas con bisel (`caja`), la madera clara de veta fina (`conMadera`), la sombra de contacto de lo que apoya (`sombraContacto`) y la cota con topes, flechas y su cifra (`cota`). Para que un objeto no parezca de juguete. | herramientas, piezas, medidas |
| `planos/susurro.js` | Plano entero: primer plano de una oreja de lado; unos labios con la mano ahuecada le susurran (para «la verdad…», un secreto). Cambia `SUSURRO` y `OYE` por tus palabras. | un secreto, una confesión |
| `planos/comprar.js` | Plano entero: el botón COMPRAR, el pulgar lo aprieta, confeti. Cambia `APRIETA`, `BRILLA` y `TEXTO`. | el CTA de un video de venta |
| `planos/cuentas.js` | Plano entero: tres capturas de cuentas en abanico; luego la de más vistas al frente con círculos rojos en sus vistas y la cifra que corre. Cambia las palabras de `T`, `CIFRA` y `ETIQUETAS`. | la prueba social de un video de venta |

Los planos de `planos/` son para copiarlos al proyecto (`video/planos/`) y cambiar sus palabras: ya importan de
`#piezas/…`. Las piezas `.js` de arriba no se copian: se importan.

## Cómo añadir una pieza

Al terminar un video, si algo costó trabajo y servirá otra vez (y el creador lo aprobó), sácalo aquí: sin nada del
proyecto dentro (ni palabras de su voz ni rutas a sus datos: que se pasen como parámetros), con su comentario de uso
arriba, una fila en esta tabla y, si se ve, en `muestras.jpg`.
