# Plantillas

Formatos que ya se hicieron y funcionaron: su estructura, para que el siguiente de ese tipo salga en menos pasos. Son un
punto de partida, no un molde: el guion lo decide el creador y el video se hace con `METODO.md`. Las piezas, en
`piezas/`.

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
