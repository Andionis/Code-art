// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { Tgolpe as golpe1, lagrimas as lag1 } from "./video/planos/01-tabla.js";
import { estallidos, chispas } from "./video/planos/02-celulas.js";
import { lagrimas as lag3 } from "./video/planos/03-ojo.js";
import { mordisco, huye } from "./video/planos/04-huerto.js";
import { Tgolpe as golpe5, Tcae } from "./video/planos/05-frio.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f = (n) => v.frase(n);

// 1. La tabla: el tajo, el jugo, las lágrimas y el chorro de gas
pon("aire", 0, { ancla: "empieza", db: -13, vel: 1.2, que: "el cuchillo baja" });
pon("madera", golpe1, { db: -7, que: "el cuchillo parte la cebolla y da en la tabla" });
pon("aprieta", golpe1 + 0.05, { db: -12, que: "salta el jugo" });
pon("aire", golpe1 + 0.3, { db: -15, vel: 1.1, que: "el cuchillo sube" });
lag1.forEach((l, i) => pon("cristal", l.llega + 0.02, { db: -13 - (i % 2) * 2, vel: 0.9 + (i % 3) * 0.1, que: "una lágrima revienta en la tabla" }));
pon("sube", f(2).inicio + 0.2, { db: -15, que: "empiezan a subir los hilos verdes" });
pon("sube", f(2).t("triste") + 0.3, { db: -14, vel: 0.9, que: "más hilos" });
pon("empujon", f(2).t("atacando") + 0.2, { db: -8, que: "el chorro de gas hacia la cámara" });

// 2. Dentro de la cebolla
pon("aire", f(3).inicio + 0.15, { ancla: "empieza", db: -12, vel: 0.8, que: "entramos en las cajitas" });
pon("aire", f(3).t("millones") - 0.1, { ancla: "empieza", db: -11, vel: 0.6, que: "la cámara se aleja: miles" });
pon("aire", f(3).t("cada") - 0.1, { ancla: "empieza", db: -12, vel: 0.7, que: "la cámara se acerca a una" });
pon("clic", f(3).t("dos") + 0.1, { db: -13, que: "se enciende la bolsa azul" });
pon("clic", f(3).t("cosas") + 0.1, { db: -13, vel: 1.15, que: "se encienden las bolitas amarillas" });
pon("late", f(3).t("separado") + 0.1, { db: -12, que: "brilla la pared entre las dos" });
pon("aire", f(4).inicio + 0.05, { ancla: "empieza", db: -13, vel: 0.9, que: "la cámara se aleja" });
pon("desliza", f(4).t("cuchillo"), { db: -10, que: "el filo baja" });
{ let ult = -1, i = 0; for (const t of [...estallidos].sort((a, b) => a - b)) { if (t - ult < 0.12) continue; pon("cristal", t, { db: -12 - (i % 3) * 2, vel: 0.85 + (i % 3) * 0.12, que: "revienta una cajita" }); ult = t; i++; } }
pon("aire", f(4).t("y") , { ancla: "empieza", db: -15, vel: 0.5, que: "el remolino" });
pon("aire", f(4).t("mezclan") - 0.3, { ancla: "empieza", db: -15, vel: 0.6, que: "se mezclan" });
{ let ult = -1, i = 0; for (const t of [...chispas].sort((a, b) => a - b)) { if (t - ult < 0.18) continue; pon("clic", t, { db: -16 - (i % 2) * 2, vel: 1.2 + (i % 3) * 0.1, que: "una chispa" }); ult = t; i++; } }
pon("sube", f(5).t("gas") + 0.1, { db: -12, que: "sube el gas" });

// 3. El ojo
pon("sube", f(5).t("flotando"), { db: -12, vel: 0.85, que: "el gas sube hasta el ojo" });
pon("aprieta", f(5).t("ojos") + 0.1, { db: -13, que: "el ojo se entorna" });
pon("aire", f(6).inicio, { ancla: "empieza", db: -12, vel: 0.7, que: "la cámara se acerca al ojo" });
pon("clic", f(6).t("nervios") + 0.05, { db: -13, que: "se encienden los nervios" });
for (let t = f(6).t("avisan"), i = 0; t < f(6).t("pica") - 0.1; t += 0.22, i++) pon("tic", t, { db: -15, vel: 1 + (i % 2) * 0.15, que: "los pulsos de los nervios" });
pon("golpe", f(6).t("pica") + 0.05, { db: -8, que: "¡pica!: fogonazo rojo" });
pon("aire", f(7).inicio, { ancla: "empieza", db: -13, vel: 0.8, que: "la cámara se aleja" });
pon("sube", f(7).t("grifo"), { db: -11, reves: true, que: "brota el agua" });
pon("empujon", f(7).t("lagrimas") + 0.25, { db: -10, que: "la ola cruza el ojo" });
lag3.forEach((l, i) => pon("late", l.t0 + 0.05, { db: -14, vel: 0.9 + (i % 3) * 0.1, que: "cae un lagrimón" }));

// 4. El huerto
pon("sube", f(8).t("defensa"), { db: -11, que: "el escudo de gas" });
pon("aire", f(8).t("animal") - 0.6, { ancla: "empieza", db: -14, vel: 1.2, que: "llega el ratón" });
pon("aprieta", mordisco, { db: -10, que: "el mordisco" });
pon("empujon", f(8).t("quiera") - 0.05, { db: -10, vel: 1.1, que: "la nube en la cara" });
pon("aire", huye, { db: -12, vel: 1.2, que: "el ratón salta y huye" });

// 5. La cebolla fría y el final
pon("aire", f(9).inicio + 0.2, { ancla: "empieza", db: -16, vel: 0.5, que: "la cámara se acerca a la cebolla" });
pon("cristal", f(9).t("fria"), { db: -11, que: "se cubre de escarcha" });
pon("cristal", f(9).t("fria") + 0.25, { db: -15, vel: 1.2, que: "más escarcha" });
pon("aire", golpe5 - 0.25, { ancla: "empieza", db: -13, vel: 1.2, que: "baja el cuchillo" });
pon("madera", golpe5, { db: -8, que: "parte la cebolla fría" });
pon("sube", f(9).t("menos"), { db: -16, vel: 1.1, que: "un hilito" });
pon("cristal", f(9).t("frena") + 0.2, { db: -12, vel: 1.1, que: "el hilito se congela" });
pon("cristal", f(9).t("frena") + 0.45, { db: -15, vel: 1.3, que: "más cristalitos" });
pon("aire", f(10).inicio + 0.1, { ancla: "empieza", db: -15, vel: 0.6, reves: true, que: "la escarcha se va" });
pon("cristal", Tcae + 0.02, { db: -13, que: "la lágrima en la tabla" });
pon("sube", f(10).t("lloras#2"), { db: -15, que: "empieza a soltar gas" });
pon("empujon", f(10).t("defiende") + 0.2, { db: -8, que: "el chorro de gas" });
pon("aire", f(11).inicio + 0.05, { ancla: "empieza", db: -12, vel: 0.6, que: "la cámara se aleja" });
pon("desliza", f(11).inicio + 0.45, { db: -14, que: "el cuchillo se apoya en la tabla" });
pon("clic", f(11).t("amigo"), { db: -14, que: "amigo" });
pon("late", f(11).t("interesar") + 0.4, { db: -13, que: "el final" });

export default e;
