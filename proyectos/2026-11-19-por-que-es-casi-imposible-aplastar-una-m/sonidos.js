// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-hook.js";
import { momentos as m2 } from "./video/planos/02-peliculas.js";
import { momentos as m3 } from "./video/planos/03-camara-lenta.js";
import { momentos as m4 } from "./video/planos/04-ojo.js";
import { momentos as m5 } from "./video/planos/05-arriba.js";
import { momentos as m6 } from "./video/planos/06-escape.js";
import { momentos as m7 } from "./video/planos/07-parpadeo.js";
import { momentos as m8 } from "./video/planos/08-truco.js";
import { momentos as m9 } from "./video/planos/09-tiempo.js";
import { momentos as m10 } from "./video/planos/10-siguenos.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f = (n) => v.frase(n);

// el hook: la mano que cae, la mosca que se va, el golpe en la mesa
pon("aire", 0.0, { ancla: "empieza", db: -13, vel: 0.6, que: "la mano empieza a bajar" });
pon("aire", m1.despega - 0.05, { db: -12, vel: 1.3, que: "la mosca despega" });
pon("empujon", m1.golpe - 0.02, { db: -8, que: "la mano cae" });
pon("madera", m1.golpe, { db: -7, que: "la mano golpea la mesa" });
pon("golpe-hondo", m1.golpe + 0.01, { db: -11, que: "el golpe retumba" });
pon("sube", m1.golpe + 0.4, { db: -15, que: "la mano se levanta" });
pon("aire", m1.posa - 0.15, { db: -16, vel: 1.2, que: "la mosca se posa" });
pon("aire", m1.lenta, { ancla: "empieza", db: -14, vel: 0.45, que: "la mano baja en cámara lenta" });

pon("aire", f(2).t("lenta") - 0.2, { db: -16, vel: 0.5, que: "la mano sigue bajando lenta" });

// las películas
pon("clic", f(3).inicio + 0.15, { db: -15, que: "el ojo se abre" });
pon("aire", f(3).inicio + 0.3, { ancla: "empieza", db: -16, vel: 0.6, que: "la tira baja" });
pon("clic", m2.sesenta, { db: -12, que: "aparece 60" });
pon("aire", f(3).t("segundo") - 0.3, { db: -16, vel: 0.6, que: "las casillas bajan" });
pon("aire", m2.entraMosca + 0.1, { ancla: "empieza", db: -13, vel: 0.8, que: "entra la mosca y su tira" });
[0, 0.16, 0.32, 0.48].forEach((d, i) => pon("tic", m2.d250 - 0.3 + d, { db: -16, vel: 1 + 0.08 * i, que: "corre la cifra" }));
pon("clic", m2.d250 + 0.4, { db: -12, que: "250 se para" });
pon("empujon", m2.x4 + 0.05, { db: -11, vel: 1.1, que: "×4 llega" });

// cámara lenta: pasos de la mosca y la mano que baja
pon("aire", f(5).inicio + 0.12, { ancla: "empieza", db: -15, vel: 0.45, que: "la mano baja despacio" });
m3.pasos.forEach((t) => pon("tic", t, { db: -19, lp: 6000, que: "un paso" }));
pon("aire", f(5).t("pelicula") - 0.3, { ancla: "empieza", db: -16, vel: 0.6, que: "la cámara se aleja" });

// el ojo
pon("aire", f(6).inicio + 0.15, { ancla: "empieza", db: -15, vel: 0.6, que: "la cámara se acerca al ojo" });
pon("empujon", m4.entra + 0.45, { db: -9, que: "la cámara entra en el ojo" });
pon("sube", m4.brillo, { db: -14, que: "el brillo recorre las lentes" });
pon("aire", m4.rayos - 0.35, { ancla: "empieza", db: -12, vel: 0.8, que: "la cámara sale" });
pon("sube", m4.rayos + 0.25, { db: -13, vel: 0.9, que: "salen los rayos" });

// desde arriba
pon("aire", m5.campo + 0.05, { ancla: "empieza", db: -14, vel: 0.7, que: "se abre el campo de visión" });
pon("aire", f(7).t("venir") - 0.2, { ancla: "empieza", db: -15, vel: 0.6, que: "llega la mano" });
pon("late", m5.detras + 0.1, { db: -10, que: "la zona de detrás se enciende" });

// el escape
pon("aire", f(8).inicio + 0.15, { ancla: "empieza", db: -15, vel: 0.45, que: "la cámara se acerca" });
pon("aire", f(8).t("sorprendente") + 0.6, { db: -16, vel: 0.5, que: "la mano se acerca despacio" });
pon("clic", m6.flecha, { db: -14, que: "empieza la flecha" });
pon("clic", m6.flecha + 0.6, { db: -16, vel: 1.1, que: "la flecha se completa" });
pon("aprieta", m6.patas, { db: -13, que: "recoge las patas" });
pon("aire", m6.inclina, { db: -15, vel: 0.9, que: "se inclina" });
pon("late", f(9).t("contrario") + 0.1, { db: -13, que: "la flecha brilla" });
pon("aire", f(9).t("mano") - 0.1, { ancla: "empieza", db: -17, vel: 0.5, que: "la mano sigue bajando" });
pon("empujon", m6.salta + 0.05, { db: -9, vel: 1.2, que: "salta" });

// a velocidad de verdad
pon("estallido", f(10).inicio + 0.1, { db: -16, reves: true, lp: 1400, que: "rebobina" });
pon("aire", m7.salta, { db: -12, vel: 1.4, que: "la mosca sale disparada" });
pon("madera", m7.golpe, { db: -8, que: "la mano golpea la mesa" });
pon("clic", m7.golpe + 0.25, { db: -13, que: "aparece 0,2 s" });
pon("aire", m7.parpadeo + 0.05, { db: -13, vel: 1.4, que: "el parpadeo" });

// el truco
pon("aire", f(11).inicio + 0.15, { ancla: "empieza", db: -16, vel: 0.6, que: "la flecha aparece" });
pon("empujon", m8.golpe1 - 0.02, { db: -9, que: "la mano cae rápido" });
pon("madera", m8.golpe1, { db: -9, que: "golpea la mesa vacía" });
pon("estallido", m8.golpe1 + 0.5, { db: -17, reves: true, lp: 1400, que: "la mosca vuelve atrás" });
pon("clic", m8.diana, { db: -12, que: "aparece la diana" });
pon("late", v.frase(11).t("delante") + 0.1, { db: -12, que: "la diana late" });
pon("aire", m8.salta2 - 0.3, { ancla: "empieza", db: -13, vel: 0.9, que: "la mano baja hacia la diana" });
pon("golpe-hondo", m8.golpe2, { db: -8, que: "la mano cae justo donde llega la mosca" });
pon("sube", m8.golpe2 + 0.15, { db: -14, que: "el fogonazo dorado" });

// el otro tiempo y el cierre
pon("aire", f(12).inicio + 0.15, { ancla: "empieza", db: -15, vel: 0.4, que: "la mosca vuela lenta" });
pon("cristal", f(12).t("lento") + 0.1, { db: -17, vel: 0.7, que: "la gota brilla" });
pon("aire", f(12).t("vive") - 0.1, { ancla: "empieza", db: -16, vel: 0.4, que: "rodea la gota" });
pon("aire", f(12).t("tiempo") - 0.45, { ancla: "empieza", db: -14, vel: 0.6, que: "la cámara se aleja" });
pon("tierra", m9.posa + 0.2, { db: -16, vel: 1.3, que: "la mosca se posa" });

// el botón de seguir y la vuelta al principio
pon("clic", m10.entra + 0.1, { db: -12, que: "salta el botón" });
pon("aire", m10.entra + 0.15, { ancla: "empieza", db: -16, vel: 0.9, que: "llega el pulgar" });
pon("toque", m10.aprieta, { db: -8, que: "el pulgar aprieta" });
pon("sube", m10.aprieta + 0.05, { db: -12, que: "el confeti" });
pon("aire", m10.sevan, { ancla: "empieza", db: -13, vel: 1.1, que: "el botón se va" });
pon("estallido", m10.rebobina + 0.3, { db: -14, reves: true, lp: 1400, que: "rebobina" });
pon("aire", m10.mano, { ancla: "empieza", db: -13, vel: 0.6, que: "la mano vuelve a entrar" });

export default e;
