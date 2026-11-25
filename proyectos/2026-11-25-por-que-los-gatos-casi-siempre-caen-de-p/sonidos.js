// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-hook.js";
import { momentos as m2 } from "./video/planos/02-oido.js";
import { momentos as m3 } from "./video/planos/03-nivel.js";
import { momentos as m4, EMPUJES } from "./video/planos/04-imposible.js";
import { momentos as m5 } from "./video/planos/05-delantera.js";
import { momentos as m6 } from "./video/planos/06-patinadora.js";
import { momentos as m7 } from "./video/planos/07-trasera.js";
import { momentos as m8 } from "./video/planos/08-aterriza.js";
import { momentos as m9 } from "./video/planos/09-gatitos.js";
import { momentos as m10 } from "./video/planos/10-sofa.js";
import { momentos as m11 } from "./video/planos/11-tira.js";
import { momentos as m12 } from "./video/planos/12-cierre.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const F = (n) => v.frase(n);

// el hook: la caída entre nubes, las patas que buscan, el giro y el aterrizaje
pon("aire", 0.0, { ancla: "empieza", db: -9, vel: 0.6, que: "cae entre las nubes" });
pon("aire", 1.8, { ancla: "empieza", db: -13, vel: 0.55, que: "sigue cayendo" });
pon("aire", 3.6, { ancla: "empieza", db: -13, vel: 0.6, que: "sigue cayendo" });
pon("aire", F(2).t("aire") - 0.2, { ancla: "empieza", db: -12, vel: 0.8, que: "estira las patas buscando" });
pon("aire", F(2).t("agarrarse") - 0.1, { ancla: "empieza", db: -13, vel: 0.7, que: "las patas no agarran nada" });
pon("aire", m1.giro, { ancla: "empieza", db: -11, vel: 1.2, que: "gira la mitad de delante" });
pon("empujon", m1.giroAtras + 0.45, { db: -9, que: "gira la de atrás y queda derecho" });
pon("tierra", m1.suelo, { db: -8, que: "aterriza en el pasto" });

// el oído y el nivel
pon("aire", F(3).inicio + 0.12, { ancla: "empieza", db: -15, vel: 0.5, que: "la cabeza cae despacio" });
pon("clic", m2.enciende + 0.05, { db: -13, que: "se enciende el oído" });
pon("sube", m2.corre, { reves: true, db: -14, que: "el líquido corre hacia abajo" });
pon("aire", F(3).t("nivel") + 0.12, { ancla: "empieza", db: -15, vel: 0.8, que: "entra el nivel" });
pon("desliza", m3.inclina + 0.2, { db: -14, que: "se inclina, la burbuja corre" });
pon("desliza", m3.otro - 0.3, { db: -15, vel: 1.1, que: "se inclina al otro lado" });
pon("desliza", F(3).t("instante") + 0.15, { db: -16, vel: 1.2, que: "casi recto" });
pon("clic", m3.recto + 0.12, { db: -12, que: "la burbuja se para en el centro" });

// imposible y las dos mitades
pon("aire", F(4).inicio + 0.12, { ancla: "empieza", db: -15, vel: 0.45, que: "cámara lenta en el cielo" });
pon("aire", F(4).t("imposible"), { ancla: "empieza", db: -16, vel: 0.5, que: "sigue cayendo despacio" });
EMPUJES.forEach((p, i) => pon("aire", p.t + 0.05, { ancla: "empieza", db: -15 + (i % 2), vel: 1.3 + 0.1 * (i % 2), que: "un remolino de aire" }));
pon("aire", F(5).t("truco"), { ancla: "empieza", db: -15, vel: 0.6, que: "la cámara se acerca" });
pon("aire", F(5).t("flexible") - 0.3, { ancla: "empieza", db: -16, vel: 0.5, que: "cae despacio, se prepara" });
pon("aprieta", m4.dobla + 0.3, { db: -12, que: "se dobla por la mitad" });
pon("clic", m4.mitad + 0.05, { db: -12, que: "se marcan las dos mitades" });
pon("late", m4.pegados + 0.1, { db: -12, que: "brilla la costura" });

// la mitad de delante y la patinadora
pon("aprieta", m5.encoge + 0.2, { db: -12, vel: 1.1, que: "encoge las patas de delante" });
pon("aire", F(6).t("adelante") + 0.4, { ancla: "empieza", db: -16, vel: 0.5, que: "patas encogidas, cae despacio" });
pon("aire", m5.gira, { ancla: "empieza", db: -11, vel: 1.3, que: "gira la mitad de delante" });
pon("empujon", m5.giraFin, { db: -10, vel: 1.1, que: "queda patas abajo" });
pon("desliza", F(6).t("como") + 0.15, { db: -15, vel: 0.8, que: "la patinadora se desliza" });
pon("aire", m6.cierra, { ancla: "empieza", db: -11, vel: 1.4, que: "cierra los brazos y gira rápido" });
pon("aire", m6.rapido + 0.35, { ancla: "empieza", db: -12, vel: 1.6, que: "gira rapidísimo" });

// la mitad de atrás
pon("aire", m7.estira + 0.05, { ancla: "empieza", db: -14, vel: 0.9, que: "estira las de delante" });
pon("aprieta", m7.encoge + 0.2, { db: -12, vel: 1.1, que: "encoge las de atrás" });
pon("aire", m7.gira, { ancla: "empieza", db: -11, vel: 1.3, que: "gira la mitad de atrás" });
pon("empujon", m7.giraFin, { db: -10, vel: 1.1, que: "queda derecho" });

// el aterrizaje
pon("aire", F(8).inicio + 0.1, { ancla: "empieza", db: -13, vel: 0.7, que: "baja hacia el pasto" });
pon("tierra", m8.toca, { db: -9, que: "toca el pasto" });
pon("pelota", m8.rebota, { db: -15, vel: 1.1, que: "rebota como un muelle" });
pon("tierra", m8.golpe, { db: -12, vel: 1.1, que: "se asienta" });

// los gatitos
pon("aire", m9.toca1 - 1.4, { ancla: "empieza", db: -14, vel: 0.6, que: "cae el primer gatito" });
pon("aprieta", m9.toca1 + 0.03, { db: -10, que: "cae de lado en el cojín" });
pon("aire", m9.toca2 - 0.8, { ancla: "empieza", db: -13, vel: 1.1, que: "el segundo gira" });
pon("aprieta", m9.toca2 + 0.03, { db: -11, vel: 1.15, que: "cae de pie en el cojín" });
pon("clic", m9.brillo + 0.05, { db: -12, que: "perfecto" });

// el sofá
pon("desliza", m10.resbala - 0.3, { db: -14, vel: 0.8, que: "resbala del sofá" });
pon("aire", m10.resbala, { ancla: "empieza", db: -14, vel: 1.2, que: "cae" });
pon("golpe", m10.golpe + 0.03, { db: -8, que: "se da contra la alfombra" });
pon("aprieta", m10.golpe + 1.0, { db: -16, vel: 0.8, que: "se queda tumbado" });
pon("aire", m10.levanta, { ancla: "empieza", db: -15, vel: 0.8, que: "se levanta" });
pon("tic", m10.levanta + 0.75, { db: -15, lp: 6000, que: "se sacude" });

// la tira de fotos
pon("papel", F(11).inicio + 0.15, { db: -11, que: "la tira cae sobre la mesa" });
m11.fotos.forEach((t, i) => pon("clic", t + 0.05, { db: -15 + (i % 2), vel: 1 + 0.04 * i, que: `se enciende la foto ${i + 1}` }));
pon("sube", m11.todas, { db: -13, que: "brillan todas" });

// el cierre: el botón, el confeti y el lanzamiento al cielo (enlaza con el principio)
pon("aire", F(12).inicio + 0.12, { ancla: "empieza", db: -15, vel: 0.8, que: "entra el botón" });
pon("tic", F(12).inicio + 0.5, { db: -17, lp: 6000, que: "el gato camina" });
pon("tic", F(12).inicio + 0.85, { db: -17, lp: 6000, vel: 1.1, que: "el gato camina" });
pon("aire", m12.salta, { ancla: "empieza", db: -13, vel: 1.1, que: "salta al botón" });
pon("aprieta", m12.aprieta + 0.03, { db: -9, que: "aprieta el botón" });
pon("timbre", m12.aprieta + 0.12, { db: -14, que: "confeti" });
pon("pelota", m12.lanza, { db: -12, vel: 0.8, que: "el botón hace de muelle" });
pon("empujon", m12.lanza + 0.4, { db: -9, que: "sale disparado al cielo" });

export default e;
