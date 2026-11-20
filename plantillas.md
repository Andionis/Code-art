# Plantillas

Formatos que ya se hicieron y funcionaron: su estructura, para que el siguiente de ese tipo salga en menos pasos. Son un
punto de partida, no un molde: el guion lo decide el creador y el video se hace con `METODO.md`. Las piezas, en
`piezas/`.

## Lyric video Michi Lyrics (~25 s)

El formato de todos los videos del creador (`preferencias.md`): un tramo de una canción con su letra en pantalla, sobre
un video de fondo que él manda. Aprobado en «Hombre» y «Dios Primero» (Lil Naay, `proyectos/2026-11-19-lyric-*`).
No lleva guion, voz ni cierre: la canción es la voz. No pidas aprobar guion; sí el borrador.

**Lo que se le pide** (en un mensaje, solo lo que falte): la canción (mp3), el tramo (desde-hasta, en segundos o
palabras), la letra de ese tramo tal cual, y el video de fondo. Si dice «desde que dice X», búscalo en lo oído.

**Cómo se hace:**
1. La letra, en un .txt de la carpeta temporal: una línea por frase, tal cual la escribió (sus «'» y todo); la palabra
   clave de cada línea entre *asteriscos* (la que más pega: un sustantivo o un verbo fuerte, no «que» ni «yo»).
   Lo que va entre paréntesis (ad-libs) no sale, salvo que lo pida (entonces, una línea propia).
2. `node piezas/lyric/preparar.mjs lyric-<nombre> --cancion … --desde … --hasta … --letra … --fondo … [--x 0.5]
   [--funde …] [--sin-marca]` (`--ayuda`). Crea el proyecto, corta la canción, sincroniza la letra (ElevenLabs,
   speech-to-text: céntimos), saca el ritmo, recorta el fondo en vertical y pone el plano. Imprime cada línea con su
   segundo: si algo no cuadra, mira `audio/oido.json`.
3. Mira el fondo antes (`ffmpeg … fps=1,tile`) para elegir `--x`: el artista dentro del recorte vertical. Si se mueve
   mucho de lado, recorta tú los fotogramas con un `crop` que lo siga (así se hizo en «Hombre»).
4. `ver.mjs` en 4-6 segundos (cada línea con su clave), y el borrador:
   `node motor/render.mjs <proyecto> --borrador --salida "tmp v1.mp4"` y luego
   `node piezas/lyric/preparar.mjs <proyecto> --poner-audio "revisar/tmp v1.mp4" --salida "revisar/<Canción> v1 (borrador).mp4"`.
5. Final igual, sin `--borrador`, con `--salida "../../salida/<carpeta>/<Artista> - <Canción> (letra).mp4"` en
   `--poner-audio`. Portada con `SIN_LETRA=1 node motor/portada.mjs … --titulo "<Artista> *<Canción>*" --etiqueta "con letra"`
   (`--dy` para que se vea la cara). Descripciones como las de `salida/2026-11-19-lyric-*`.

**El look aprobado** (`piezas/planos/letra.js`; se ajusta en `guion.json` → `"lyric"`):
- Fondo: su video en bucle, en blanco y negro con algo de contraste (`"bn": false` para color), sin latido (sin zoom con el ritmo).
- Letra: Figtree ExtraBold en mayúsculas, centrada (y ≈ 1060), palabra a palabra cuando se canta, chica (70 px; la clave, 140); como mucho 2 filas
  por pantalla (las líneas largas, en pantallas seguidas); la clave más grande, en el color de su línea, con brillo.
- Final: tras la última palabra, la letra se va en 1 s y la canción sigue sonando sin letra mientras imagen y música
  se desvanecen a negro hasta el final (`--funde` = el segundo de la canción en que acaba la última palabra).
- Marca de agua Michi Lyrics, salvo que diga que no para ese video (`--sin-marca`).

## Promo en celular: «comenta la palabra» (~25 s)

Para promocionar este tipo de videos. Todo pasa en un celular en primera persona, sin cortes (todos los planos
`entrada = "sigue"`, una escena común):
1. Reel 1 a pantalla completa: un gancho con un dato visual y una cifra que corre.
2. Scroll. Reel 2: «¿Por qué…?» (solo la pregunta).
3. Scroll. Reel 3: «¿Sabías que…?», con la frase entera antes de seguir.
4. Desliz a la izquierda al perfil; «Seguir»; la cuadrícula sube; abre la portada del reel 1.
5. Comentarios; la cámara se aleja y se ve la mano con el celular; escribe la palabra del CTA; publica.
6. Llegan comentarios iguales y las vistas suben. Cierre: el del creador, con su palabra.

Piezas: `celular.js` (`telefono`, `reel`, `pulgar`, `gesto`, `cargarClips`). Los reels de dentro, de videos ya hechos
(sus fotogramas sin subtítulos: `aprendido.md`, Técnica). Sin interfaz de Instagram sobre los reels.

## Video de venta: «botón comprar» (~1:30-2:00)

Para la página de venta de un producto o un servicio.

| Parte | Lo que se dice | Lo que se ve |
|---|---|---|
| Gancho | «Es tu momento de aprender a…» (lo que se vende, con lo que más desea quien mira) | Un celular; el pulgar (por fuera) hace scroll por videos distintos con sus vistas subiendo. |
| Lo fácil | los pasos en una frase («le das una idea… y listo») | Lo que se hace, pasando: una ventana de chat, entra la carpeta, se escribe la idea, sale el resultado. |
| Por qué funciona | la razón, en palabras de la calle (la gente se queda hasta el final, lo guarda, lo comparte) | El resultado; barra de progreso, guardar, compartir; un muro de celulares con portadas distintas. |
| Prueba | «Mira estas tres cuentas…» y «Y mira esta: acumula más de N millones» | 3 capturas enteras en abanico (`planos/cuentas.js`); la de más vistas al frente, círculos rojos, la cifra. |
| Para cualquiera | «Imagínate un video así para…» (3 o 4 negocios) | Una calle de negocios; la portada de cada uno (`titulo-portada.js`). |
| Caso real | «¿No me crees? Mira este perfil…» y dónde comprobarlo | La captura (`capturas.js`), zoom y círculo rojo en la cifra; dónde buscarlo. |
| Objeciones | lo que no hace falta (salir en cámara, saber editar, tener seguidores) | Tres cosas tachadas con una X roja. |
| Diferencia | por qué este y no otro, sin insultar a nadie | Lo de otros, apagado y con pocas vistas; se transforma en lo de este; «este video» dentro de un celular. |
| La oferta | qué incluye, en una frase | Lo que se compra, abierto: sus partes, la idea que entra, lo que sale. |
| Urgencia | «Mientras lo piensas…» | Reloj de arena; las vistas se van al celular de otro. |
| CTA | «Dale clic al botón comprar y empieza hoy» | El botón (`boton-comprar.js`, `planos/comprar.js`); el pulgar aprieta en «comprar». |
| Remate | lo sencillo que es, lo que vale, por qué ahora y, en susurro, un secreto que invita a entrar | Los pasos; la etiqueta de precio; el calendario; la oreja y el susurro (`planos/susurro.js`); una puerta y el botón. |

Pedir al creador antes de la voz: las capturas (enteras, con su barra de estado), las cifras que se dicen (con su
captura de prueba), lo que incluye la compra, el CTA y la palabra o el botón del cierre. Decirle al entregar en qué
segundo suena «comprar» (para su página).
