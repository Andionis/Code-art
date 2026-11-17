// Los efectos: cada uno en lo que se mueve, con los momentos que exportan los planos.
// Sello del video: «late» en cada brillo del oro (el anillo, el oro que nace, el núcleo, el cubo).
import { v } from "#voz";
import { choque as choqueHook, cruce } from "./video/planos/01-hook.js";
import { fusiones, golpeHierro } from "./video/planos/02-estrella.js";
import { revienta } from "./video/planos/03-muerte.js";
import { golpe, lluvia } from "./video/planos/04-balanza.js";
import { choque, llegaTierra, naceOro, pegan } from "./video/planos/05-choque.js";
import { enciendeSol, naceTierra, hunde } from "./video/planos/06-disco.js";
import { caen, cuboListo } from "./video/planos/07-cubo.js";
import { choque as choqueFinal } from "./video/planos/08-final.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f = (n) => v.frase(n);

// ---- escena 1: el anillo y el choque
pon("aire", 0, { ancla: "empieza", db: -11, vel: 0.8, que: "la cámara se lanza hacia el anillo" });
pon("late", v.t("oro") + 0.1, { db: -11, que: "el destello del anillo" });
pon("aire", cruce - 0.3, { db: -10, que: "la cámara cruza el anillo" });
pon("empujon", choqueHook, { db: -10, que: "las dos estrellas se juntan" });
pon("estallido", choqueHook + 0.05, { db: -7, lp: 1400, corta: f(3).inicio - 0.05, que: "el choque" });
pon("aire", choqueHook + 1.4, { ancla: "empieza", db: -17, vel: 0.5, que: "la nube de oro se abre" });

pon("sube", v.frase(2).t("sol"), { db: -17, vel: 0.8, que: "la nube dorada se calma" });

// ---- escena 2: dentro de la estrella
pon("aire", f(3).inicio + 0.2, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara va hacia la estrella" });
pon("empujon", f(3).t("apretando") + 0.5, { db: -10, que: "la cámara entra en la estrella" });
pon("aire", f(3).t("centro") - 0.2, { db: -16, vel: 0.7, que: "el plasma que corre" });
pon("clic", f(3).t("hidrogeno") + 0.02, { db: -13, que: "llega el protón" });
fusiones.forEach((t, i) => pon(i === 2 ? "golpe-hondo" : "golpe", t + 0.03, { db: i === 2 ? -9 : -12, vel: 1.1 - i * 0.1, que: "dos núcleos se juntan" }));
pon("metal", golpeHierro + 0.02, { db: -11, que: "el hierro choca y rebota" });
pon("clic", f(4).t("pesado") + 0.1, { db: -16, que: "llegan más hierros" });
pon("sube", f(4).t("oro") - 0.1, { db: -13, que: "aparece el oro fantasma" });
pon("aire", f(4).t("no") + 0.3, { db: -15, vel: 0.6, que: "el oro se deshace" });

// ---- escena 3: la estrella muere; la balanza
pon("aire", f(5).inicio + 0.15, { ancla: "empieza", db: -12, vel: 0.6, que: "la cámara sale de la estrella" });
pon("empujon", revienta, { db: -9, que: "la estrella se desploma" });
pon("estallido", revienta + 0.05, { db: -7, lp: 1400, que: "la estrella revienta" });
pon("aprieta", f(5).t("aplasta") + 0.35, { db: -11, que: "el centro se aprieta" });
pon("aire", f(5).t("bola") + 0.2, { db: -15, vel: 0.7, que: "la cámara se acerca a la bola" });
pon("clic", f(5).t("ciudad") + 0.02, { db: -12, que: "llega la ciudad" });
pon("clic", f(5).t("neutrones") + 0.3, { db: -14, vel: 0.8, que: "la bola late" });
pon("aire", f(6).t("densa"), { db: -15, vel: 0.6, que: "la cámara se acerca" });
pon("aire", f(6).t("cucharadita") + 0.2, { ancla: "empieza", db: -13, vel: 1.1, que: "la cucharadita cae" });
pon("golpe-hondo", golpe, { db: -7, que: "la cucharadita hunde el plato" });
pon("sube", golpe + 0.08, { db: -12, que: "la gente sale volando" });
for (let i = 0; i < 6; i++) pon("golpe", lluvia + 0.25 + i * 0.19, { db: -17 - (i % 2), vel: 1.2 - (i % 3) * 0.1, que: "cae más gente" });

// ---- escena 4: el choque
pon("aire", f(7).inicio + 0.2, { ancla: "empieza", db: -15, vel: 0.5, que: "las estrellas giran" });
pon("aire", f(7).t("giran") + 0.3, { db: -14, vel: 0.7, que: "una onda se abre" });
pon("aire", f(7).t("otra") + 0.2, { db: -14, vel: 0.75, que: "otra onda" });
pon("aire", f(7).t("rapido"), { db: -13, vel: 0.8, que: "cada vez más rápido" });
pon("empujon", choque, { db: -9, que: "se juntan" });
pon("estallido", choque + 0.05, { db: -7, lp: 1400, que: "chocan" });
pon("aire", f(8).t("lanza"), { db: -12, que: "la nube se abre" });
pon("empujon", f(8).t("neutrones") + 0.6, { db: -12, que: "la cámara entra en la nube" });
for (let t = pegan + 0.15, i = 0; t < f(8).t("segundo") + 0.45; t += 0.17, i++) pon("tic", t, { db: -17, vel: 0.9 + (i % 3) * 0.1, que: "un neutrón se pega" });
pon("late", naceOro + 0.1, { db: -9, que: "nace el oro" });
pon("aire", f(9).inicio, { db: -12, vel: 0.7, que: "la cámara sale de la nube" });
pon("sube", f(9).t("fabrico"), { db: -14, que: "el oro sale de la nube" });
pon("aire", f(9).t("tanto") + 0.3, { db: -16, vel: 0.6, que: "el chorro de oro" });
llegaTierra.forEach((t, i) => pon("golpe", t - 0.25, { db: -13, vel: 1.15 - i * 0.07, que: "se forma una Tierra de oro" }));

// ---- escena 5: del polvo al anillo
pon("estallido", f(10).inicio + 0.15, { db: -17, lp: 1200, vel: 1.3, que: "un choque lejano" });
pon("estallido", f(10).inicio + 0.95, { db: -18, lp: 1200, vel: 1.4, que: "otro choque lejano" });
pon("aire", f(10).t("llenaron"), { db: -14, vel: 0.6, que: "llueve oro en la nube" });
pon("sube", f(10).t("polvo") + 0.1, { db: -16, que: "el disco se aprieta" });
pon("estallido", enciendeSol + 0.1, { db: -12, lp: 1400, vel: 1.2, que: "se enciende el Sol" });
pon("clic", naceTierra + 0.15, { db: -12, que: "nace la Tierra" });
pon("aire", naceTierra + 0.7, { db: -12, que: "la cámara va a la Tierra" });
pon("sube", hunde, { db: -14, reves: true, que: "el oro se hunde" });
pon("late", f(11).t("centro") + 0.1, { db: -12, que: "el núcleo brilla de oro" });
caen.forEach((t, i) => { if (i % 5 === 2) pon("lingote", t, { db: -15 - (i % 2) * 2, vel: 1 + ((i * 7) % 3) * 0.06, que: "caen lingotes" }); });
pon("muro", cuboListo + 0.05, { db: -10, que: "el cubo termina" });
pon("late", cuboListo + 0.2, { db: -13, que: "el cubo brilla" });
pon("clic", f(11).t("metros") - 0.1, { db: -13, que: "22 m" });
pon("aire", f(12).inicio + 0.15, { ancla: "empieza", db: -13, vel: 0.8, que: "el anillo gira" });
pon("late", f(12).t("anillo") + 0.1, { db: -12, que: "el anillo brilla" });
pon("clic", f(12).t("sol"), { db: -15, que: "aparece el Sol" });
pon("estallido", choqueFinal + 0.05, { db: -13, lp: 1400, vel: 1.2, que: "chocan las estrellas del fondo" });
pon("sube", choqueFinal + 0.6, { db: -13, que: "el oro viaja al anillo" });
pon("late", choqueFinal + 1.0, { db: -10, que: "el anillo brilla con el oro" });
pon("aire", f(13).t("amigo") - 0.3, { ancla: "empieza", db: -15, vel: 0.6, que: "la cámara se aleja" });

export default e;
