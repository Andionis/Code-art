// Los efectos: cada uno en lo que se mueve, en su fotograma (guia/sonido.md).
import { v } from "#voz";
import { arranca } from "./video/planos/01-hook.js";
import { pasos } from "./video/planos/02-pasillo.js";
import { llegaVenus } from "./video/planos/03-dia.js";
import { levanta, baja as bajaCuadro } from "./video/planos/04-lunes.js";
import { caeMarco, poneVidrio, mete, sale as saleLadron } from "./video/planos/05-escalera.js";
import { encienden, lanza } from "./video/planos/06-pintor.js";
import { cierran, llegan as diarios } from "./video/planos/07-periodicos.js";
import { polvo, aparece, baja as bajaArchivo, fichas, sale as saleFicha, llegaHuella, cruz } from "./video/planos/08-huella.js";
import { rejas } from "./video/planos/09-poeta.js";
import { toman, llegan as llegaTaller } from "./video/planos/10-estatuillas.js";
import { marco, pregunta } from "./video/planos/11-declarar.js";
import { enciende } from "./video/planos/12-multitud.js";
import { abre, levanta as levantaFondo, cierra, puerta, puertaCierra } from "./video/planos/13-baul.js";
import { llega as llegaItalia, vinci } from "./video/planos/14-mapa.js";
import { empuja, billetes, gira, sello, puerta as puertaPolicia } from "./video/planos/15-florencia.js";
import { flashes as flashesIt } from "./video/planos/16-exposicion.js";
import { cuelga, flashes } from "./video/planos/17-final.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });

// 1 · el hook
pon("aire", 0.05, { ancla: "empieza", db: -10, vel: 0.7, que: "la cámara se aleja de su cara" });
pon("aire", v.t("alguien") - 0.2, { ancla: "empieza", db: -15, vel: 0.9, que: "la sombra cruza" });
pon("empujon", arranca + 0.35, { db: -8, que: "la arrancan de la pared" });
pon("enganche", arranca + 0.5, { db: -15, que: "los ganchos vacíos brillan" });
// 2 · el pasillo
pasos.forEach((p, i) => { if (i % 2 === 0) pon("tic", p, { db: -19, lp: 3000, vel: 0.6 + (i % 4) * 0.03, que: "pasos" }); });
pon("clic", v.t("escondida") + 0.05, { db: -13, que: "el cuadro se ve bajo la bata" });
// 3 · el Louvre de día
pon("aire", v.frase(3).inicio + 0.3, { ancla: "empieza", db: -17, vel: 0.5, que: "la cámara pasea" });
pon("aire", v.t("estrella") - 0.15, { ancla: "empieza", db: -12, vel: 0.7, que: "la cámara va a la Venus" });
pon("clic", llegaVenus, { db: -13, que: "la Venus" });
// 4 · el lunes
pon("aire", v.frase(4).inicio + 0.2, { ancla: "empieza", db: -13, vel: 0.6, que: "el cartel pasa" });
pon("tic", v.t("italiano"), { db: -18, lp: 3000, vel: 0.6, que: "pasos" });
pon("tic", v.t("italiano") + 0.5, { db: -18, lp: 3000, vel: 0.62, que: "pasos" });
pon("tic", v.t("italiano") + 1.0, { db: -18, lp: 3000, vel: 0.6, que: "pasos" });
pon("enganche", levanta + 0.1, { db: -11, que: "sale de los ganchos" });
pon("aire", bajaCuadro, { ancla: "empieza", db: -14, vel: 0.8, que: "la baja" });
// 5 · la escalera
pon("cuadro", caeMarco + 0.02, { db: -10, que: "el marco cae en el escalón" });
pon("cristal", poneVidrio, { db: -12, que: "el vidrio" });
pon("desliza", mete + 0.1, { db: -14, que: "la mete bajo la bata" });
pon("tic", saleLadron + 0.3, { db: -18, lp: 3000, vel: 0.6, que: "pasos" });
pon("tic", saleLadron + 0.65, { db: -19, lp: 3000, vel: 0.62, que: "pasos" });
// 6 · el pintor
pon("tic", v.frase(6).inicio + 0.2, { db: -19, lp: 3000, vel: 0.6, que: "pasos de los guardias" });
pon("tic", v.frase(6).inicio + 0.75, { db: -19, lp: 3000, vel: 0.6, que: "pasos de los guardias" });
pon("madera", v.t("copiarla") + 0.1, { db: -15, que: "el caballete se posa" });
pon("empujon", lanza + 0.6, { db: -11, que: "la cámara se lanza a la pared" });
encienden.forEach((t, i) => pon("clic", t + 0.03, { db: -13, vel: 1 + i * 0.05, que: "un gancho" }));
// 7 · las puertas y los periódicos
pon("golpe-hondo", cierran, { db: -8, que: "las puertas se cierran" });
diarios.forEach((t, i) => pon("papel", t, { db: -11 - (i % 2) * 2, vel: 0.95 + (i % 3) * 0.05, que: "un periódico cae" }));
pon("aire", v.t("cara") - 0.1, { ancla: "empieza", db: -12, vel: 0.7, que: "la cámara entra en la foto" });
// 8 · la huella y el archivo
polvo.forEach((t) => pon("tic", t, { db: -18, lp: 6000, que: "el polvo" }));
pon("sube", aparece, { db: -11, que: "la huella aparece" });
pon("aire", bajaArchivo, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara baja al archivo" });
fichas.forEach((t, i) => { if (i % 2 === 0) pon("papel", t + 0.15, { db: -17, vel: 1.2, que: "fichas" }); });
pon("aire", saleFicha, { ancla: "empieza", db: -12, vel: 0.9, que: "sale la ficha" });
pon("clic", v.t("derecha") - 0.05, { db: -13, que: "la mano derecha" });
pon("aire", llegaHuella, { ancla: "empieza", db: -14, vel: 1, que: "llega la huella" });
pon("golpe", cruz + 0.1, { db: -10, que: "no encaja: la X" });
// 9 · el poeta
pon("aire", v.frase(11).inicio + 0.2, { ancla: "empieza", db: -16, vel: 0.6, que: "la linterna busca" });
pon("metal", rejas, { db: -9, que: "las rejas" });
pon("clic", v.t("poeta") + 0.05, { db: -14, que: "su nombre" });
// 10 · las estatuillas
pon("roca", toman + 0.1, { db: -14, vel: 1.2, que: "se llevan dos estatuillas" });
pon("clic", v.t("estatuillas") + 0.05, { db: -14, que: "la etiqueta" });
pon("clic", v.t("dos", 1) + 0.05, { db: -13, que: "el 2" });
pon("aire", llegaTaller - 0.3, { ancla: "empieza", db: -12, vel: 0.7, que: "la cámara va al taller" });
// 11 · declarar
pon("madera", v.t("declarar") + 0.05, { db: -15, que: "la mesa" });
pon("aire", marco, { ancla: "empieza", db: -13, vel: 0.9, que: "el marco vacío" });
pon("golpe", pregunta + 0.05, { db: -11, que: "la pregunta" });
// 12 · la pared vacía
pon("aire", v.frase(14).inicio + 0.2, { ancla: "empieza", db: -11, vel: 0.5, que: "la cámara se aleja" });
pon("tic", v.t("miles") + 0.1, { db: -18, lp: 4000, que: "la gente" });
pon("tic", v.t("personas") + 0.2, { db: -18, lp: 4000, que: "la gente" });
pon("clic", enciende + 0.05, { db: -12, que: "la pared vacía se enciende" });
// 13 · el baúl
pon("madera", abre + 0.3, { db: -12, que: "se abre la tapa" });
pon("desliza", levantaFondo + 0.2, { db: -13, que: "el doble fondo" });
pon("sube", levantaFondo + 0.35, { db: -14, que: "el cuadro brilla" });
pon("madera", cierra + 0.3, { db: -11, vel: 0.9, que: "se cierra la tapa" });
pon("madera", puerta + 0.25, { db: -14, vel: 1.1, que: "la puerta" });
pon("aire", v.t("interrogarlo") - 0.3, { ancla: "empieza", db: -15, vel: 0.6, que: "la linterna barre" });
pon("golpe", puertaCierra + 0.3, { db: -12, que: "la puerta se cierra" });
for (let i = 0; i < 4; i++) pon("tic", v.t("pasaron") + i * 0.35, { db: -16, vel: 1 + i * 0.05, que: "el año corre" });
// 14 · el mapa
pon("aire", v.frase(18).inicio + 0.2, { ancla: "empieza", db: -15, vel: 0.6, que: "la ruta" });
pon("clic", llegaItalia, { db: -11, que: "Italia se enciende" });
pon("clic", vinci + 0.05, { db: -14, que: "Vinci" });
// 15 · Florencia
pon("desliza", empuja + 0.1, { db: -13, que: "el cuadro se desliza" });
pon("papel", billetes + 0.25, { db: -14, que: "los billetes" });
pon("tic", v.t("director") - 0.4, { db: -18, lp: 3000, que: "pasos del director" });
pon("aire", gira, { ancla: "empieza", db: -13, vel: 1, que: "lo gira" });
pon("pitido", sello + 0.1, { db: -14, que: "el sello: es la de verdad" });
pon("golpe-hondo", puertaPolicia + 0.12, { db: -8, que: "la puerta se abre de golpe" });
// 16 · la exposición
pon("aire", v.frase(21).inicio + 0.1, { ancla: "empieza", db: -15, vel: 0.5, que: "la cámara se acerca" });
flashesIt.forEach((t, i) => pon("clic", t, { db: -12, vel: 0.8 + (i % 3) * 0.1, que: "flash" }));
// 17 · el final
pon("aire", v.frase(22).inicio + 0.25, { ancla: "empieza", db: -12, vel: 0.6, que: "el cuadro baja" });
pon("enganche", cuelga + 0.03, { db: -10, que: "se cuelga en sus ganchos" });
flashes.forEach((t, i) => pon("clic", t, { db: -12, vel: 0.85 + (i % 3) * 0.1, que: "flash" }));
pon("aire", v.frase(23).inicio + 0.05, { ancla: "empieza", db: -13, vel: 0.5, que: "la cámara vuelve a su cara" });
pon("tic", v.t("amigo"), { db: -18, lp: 6000, que: "el cierre" });

// rellenos: lo que se mueve en los huecos
pon("aire", 1.3, { ancla: "empieza", db: -17, vel: 0.5, que: "la linterna sobre ella" });
pon("tic", 2.3, { db: -19, lp: 3000, vel: 0.6, que: "un paso en la oscuridad" });
pon("tic", 9.6, { db: -19, lp: 3000, vel: 0.6, que: "pasos de la gente" });
pon("tic", 10.5, { db: -19, lp: 3000, vel: 0.62, que: "pasos de la gente" });
pon("tic", 27.6, { db: -19, lp: 3000, vel: 0.6, que: "pasos de los guardias" });
pon("tic", 28.5, { db: -19, lp: 3000, vel: 0.6, que: "pasos del pintor" });
pon("tic", 29.1, { db: -19, lp: 3000, vel: 0.62, que: "pasos del pintor" });
pon("papel", 45.8, { db: -17, vel: 1.1, que: "la ficha se asienta" });
pon("tic", 46.9, { db: -18, lp: 5000, que: "la ficha" });
pon("aire", 54.7, { ancla: "empieza", db: -17, vel: 0.5, que: "el estante" });
pon("tic", 55.6, { db: -18, lp: 4000, que: "una mano en el estante" });
pon("clic", v.t("picasso", 1) + 0.05, { db: -13, que: "Picasso" });
pon("aire", 60.1, { ancla: "empieza", db: -17, vel: 0.5, que: "la lámpara se balancea" });
pon("aire", 71.1, { ancla: "empieza", db: -17, vel: 0.5, que: "el cuarto" });
pon("tic", 72.5, { db: -19, lp: 4000, que: "la vela" });
pon("aire", 72.6, { ancla: "empieza", db: -16, vel: 0.7, que: "la cámara cerca del baúl" });
pon("tic", 78.6, { db: -18, lp: 3000, vel: 0.6, que: "pasos del policía" });
pon("tic", 79.4, { db: -18, lp: 3000, vel: 0.6, que: "pasos del policía" });
pon("aire", 87.8, { ancla: "empieza", db: -17, vel: 0.5, que: "el cuarto de Florencia" });
pon("tic", 88.7, { db: -18, lp: 4000, que: "el cuadro en la mesa" });
pon("clic", v.t("florencia") + 0.05, { db: -14, que: "la cúpula se enciende" });
pon("tic", 92.9, { db: -18, lp: 3000, que: "pasos" });
pon("aire", 105.2, { ancla: "empieza", db: -15, vel: 0.6, que: "el cuadro sigue bajando" });

export default e;
