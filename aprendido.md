# Lo aprendido

Lo que ya costó un error, para no pagarlo otra vez. Se lee antes de cada video, junto con `METODO.md`,
`piezas/LEEME.md` y `plantillas.md`. El objetivo con cada video: **mejor calidad, menos costo y menos tiempo**. Al
entregar un video, propón en 2-3 líneas qué añadir aquí o a `piezas/`; entra solo lo que el creador apruebe.

## Lo que ya se corrigió (que no vuelva a pasar)

- Nada de la interfaz de Instagram encima de los videos que se enseñan (iconos, nombres, «Seguir»…), salvo que sea una
  captura de un perfil.
- En un scroll de videos, ninguno se repite.
- El pulgar va por fuera del celular (`encima` en `telefono`), nunca recortado dentro de la pantalla.
- Ninguna frase se corta a medias por un cambio de escena: el cambio llega al terminarla.
- Subtítulos con más sombra (`#piezas/subtitulos.js`) cuando el fondo tiene detalle.
- Las tildes, siempre bien: en los subtítulos, en el texto en pantalla y en la portada.
- Capturas: el nombre de la cuenta no puede quedar bajo la cámara del celular; si la captura viene recortada, barra de
  estado simulada (`#piezas/capturas.js`); nada de franjas negras donde acaba la captura.
- Lo que se dibuja tiene que leerse a la primera: una mano que parece una oreja no sirve; una oreja, de lado y derecha,
  no en diagonal. Si una forma es difícil (manos, caras, orejas), mira el fotograma grande antes de enseñarlo.
- Borradores siempre con nombre propio y versión (`escenas 1-3 v2 (borrador).mp4`), nunca el mismo nombre: al abrirlos
  se confunden.
- **Objetos que se explican** (una herramienta, una pieza, una medida):
  - Un video de referencia no siempre es mejor que lo que ya se hace: se iguala a un original solo cuando el creador lo
    pide, y en lo que pida.
  - Como el de verdad: de una sola pieza si lo es, pulido, con los huecos huecos (no una mancha negra), cada parte en su
    sitio, con bisel, sombra de contacto y materiales de verdad (`#piezas/objetos.js`). Unas cajas lisas se ven básicas.
  - Que se vea el mecanismo (qué se mueve, por dónde, contra qué); una versión translúcida («fantasma») lo explica
    mejor, sin mezclas ni tintes raros.
  - Lo que se explica, grande y en el centro; las medidas, precisas, sobre el objeto, con topes y flechas hacia dentro.
  - Cada cosa toca lo que debe tocar (la herramienta, el punto que mide).
  - Nada se solapa: las cifras, libres y fuera de la franja de los subtítulos; el texto en pantalla, con sombra.
  - Fondo neutro, sin tintes.
  - Pantalla partida: una cámara por mitad, en un solo eje y alineadas, con el objeto centrado.

## Técnica (el motor y el kit)

- **Nunca `fillText` al cargar un módulo** (texturas con letras): los subtítulos del render salen sin tildes. Las
  texturas con texto se hacen la primera vez que se dibujan (`hecha ??= hacer()`).
- `ellipse` con un barrido de 2π o más se queda en un arco pequeño: para un círculo que se dibuja de un trazo, como
  mucho 1,98π.
- Un lienzo que se reutiliza en cada fotograma: `k.fijar` vacío; el desenfoque, calentarlo la primera vez.
- Un patrón (`createPattern`) de un lienzo se copia entero en cada uso: conviértelo en imagen.
- Las capturas de pantalla de macOS llevan un espacio especial en el nombre: cópialas con un comodín (`ls -t …12.09.02*`;
  en Windows, `Get-ChildItem *12.09.02*`).
- Insertar una frase en el guion cambia los números de las siguientes: los planos que usan `v.frase(n)` hay que
  renumerarlos (todos a la vez, con una sustitución, y comprobar con `grep`). Anclar en palabras únicas evita el lío.
- Un efecto de sonido en el fotograma de un corte no suena: ponlo ≥ 0,1 s después.
- Usar otro video ya hecho dentro de este: saca sus fotogramas sin subtítulos con `motor/lib/cuadro.mjs`
  (`dibujar(proy, est, t, { subtitulos: false })`), a 15 fps y a 540 × 960; cárgalos todos al empezar con `loadImage`
  (`new Image()` + `src` se decodifica después y sale en negro). Las salidas de ffmpeg `f%04d.jpg` empiezan en 1, no en
  0. Para que se vea «dibujado», sus líneas: `edgedetect=mode=wires` y un tinte cian.
- Voz: lo que se pronuncia raro va en `dicho` («CODE ART» → «coud art», «ChatGPT» → «chat yi pi ti», «Claude» →
  «clod», «IA» → «i a», «2,5 millones» → «dos millones y medio», «30» → «treinta»). Para susurrar una frase, su
  `dicho` empieza por `[whispers]` (sale ~6 dB más baja y no se pronuncia la etiqueta).
- Dentro de algo que se desvanece, cada parte usa `g.globalAlpha *= x`, nunca `= x`: si no, se queda opaca y
  desaparece de golpe al final. Al revisar saltos, busca `globalAlpha =`.
- Las texturas `k.red` y `k.red2` (modo "lineas") en multiplicar vuelven piedra agrietada el metal, la madera y la pared: en metal, como mucho al
  10 %; la madera, con vetas dibujadas.
- Saltos que avisa el render cada 0,067 s dentro de un clip a 15 fps, o en los cortes propios de un video que se
  enseña en el celular, son del clip: se miran una vez y se aceptan.
- **Que el final enlace con el principio:** el último plano vuelve al primer fotograma del hook (con `fundido`, llamando al `dibuja` del hook). Así, al repetirse, no se nota el salto y el video se ve dos veces.
- `revisar.mjs` avisa de cortes parecidos entre fondos oscuros distintos: si son sitios distintos y se ven distintos,
  se acepta.

## Costo y tiempo

- **Un chat por video.** Para seguir uno en otra conversación, «continúa el proyecto …» (lee su `CONTINUAR.md`).
- **Cerrar el guion antes de la voz:** cada cambio de frase rehace la voz entera (cuesta dinero en ElevenLabs y mueve
  todos los tiempos). Junta los cambios del creador y haz la voz una vez.
- **El cierre también se cierra antes de la voz,** y la toma se comprueba escuchándola o transcribiéndola (una vez dijo
  «a posar» por «a hacer»).
- **Escena por escena:** cada escena se enseña en un borrador corto (`--hasta`) y se aprueba antes de la siguiente.
  Enseñar el video entero en cada ronda llegó a costar ~24 versiones en ~4 h; casi la mitad de las notas eran de forma.
- **Objeto nuevo, primero su fotograma:** si el kit no sabe dibujar el objeto, primero un fotograma grande para que el
  creador apruebe el look; luego su escena.
- **Miniatura y descripciones mientras el creador mira el borrador completo** (`METODO.md`, paso 6): no dependen de su
  visto bueno; se entregan con el render final (paso 7), que así sale en cuanto aprueba.
- **Datos con letra pequeña:** cada «nunca» o «siempre» lleva en `idea.md` su línea «Cuidado» (un río «sin puentes»
  puede tenerlos en sus afluentes), para que el guion no diga más de lo que dice la fuente.
- **Ver antes que renderizar:** `ver.mjs` (un segundo, un tramo, una frase) tarda segundos; un borrador, ~1 min.
  Render en calidad completa solo al final.
- **Piezas antes que código nuevo:** mira `piezas/` antes de dibujar un celular, una captura, un botón o una portada.
- **Plantillas:** si el video es una promo o una venta, empieza por `plantillas.md`.
- **Agentes con cuidado:** solo si tu IA los tiene y el creador dice que sí. Un agente que hereda toda la conversación
  cuesta muchísimo (uno costó ~1 M de tokens). Úsalos solo para piezas grandes e independientes, con encargos cerrados (un archivo nuevo cada uno,
  sin tocar los demás), y pídeles que devuelvan lo que hay que pegar (los sonidos) en vez de editar archivos compartidos.
