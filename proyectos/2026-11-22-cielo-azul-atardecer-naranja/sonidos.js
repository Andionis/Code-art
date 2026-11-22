// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-cielo.js";
import { momentos as m2 } from "./video/planos/02-espacio.js";
import { momentos as m3 } from "./video/planos/03-luz.js";
import { momentos as m4 } from "./video/planos/04-aire.js";
import { momentos as m5 } from "./video/planos/05-camino.js";
import { momentos as m6 } from "./video/planos/06-franjas.js";
import { momentos as m7 } from "./video/planos/07-nubes.js";
import { momentos as m8 } from "./video/planos/08-vaso.js";
import { momentos as m9 } from "./video/planos/09-final.js";
import { momentos as m10 } from "./video/planos/10-seguir.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const espaciados = (lista, min) => { const r = []; let u = -9; for (const t of [...lista].sort((a, b) => a - b)) if (t - u >= min) { r.push(t); u = t; } return r; };
const f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f8 = v.frase(8), f10 = v.frase(10), f12 = v.frase(12), f14 = v.frase(14);

// 1. el vuelo entre nubes y el Sol que se hunde
pon("aire", 0.0, { ancla: "empieza", db: -8, vel: 1.1, que: "el vuelo entre las nubes" });
pon("aire", 0.55, { ancla: "empieza", db: -12, vel: 0.9, que: "pasa una nube cerca" });
pon("empujon", m1.azul + 0.1, { db: -11, vel: 0.9, que: "sale al cielo abierto" });
pon("empujon", m1.naranja + 0.15, { db: -8, vel: 0.7, que: "el Sol se desploma hasta el mar" });
pon("estallido", m1.naranja + 0.25, { db: -16, lp: 1400, corta: f2.inicio - 0.05, que: "el cielo arde" });

// 2. el Sol y la Tierra
pon("aire", f2.inicio + 0.15, { ancla: "empieza", db: -14, vel: 0.6, que: "nos acercamos al Sol" });
pon("aire", f2.t("lo") - 0.1, { ancla: "empieza", db: -11, vel: 0.7, que: "la cámara se aleja; entra la Tierra" });
pon("sube", m2.rayo1, { db: -14, reves: true, que: "baja el rayo corto" });
pon("clic", m2.rayo1 + 0.4, { db: -15, que: "el rayo llega arriba" });
pon("sube", m2.rayo2, { db: -12, reves: true, vel: 0.8, que: "baja el rayo largo" });
pon("clic", m2.rayo2 + 0.6, { db: -13, que: "el rayo largo llega naranja" });

// 3. la luz: rayo, abanico, arcoíris, ondas
pon("aire", f3.inicio + 0.12, { ancla: "empieza", db: -12, vel: 0.7, que: "entra el rayo blanco" });
pon("aire", f3.t("blanca"), { ancla: "empieza", db: -17, vel: 0.5, que: "el rayo avanza" });
pon("sube", m3.abre + 0.2, { db: -10, que: "se abre en colores" });
pon("sube", m3.arco + 0.15, { db: -12, vel: 0.8, que: "se curva en arcoíris" });
pon("clic", m3.arco + 0.6, { db: -16, que: "el arcoíris se queda" });
pon("aire", m3.ondas, { ancla: "empieza", db: -13, vel: 0.6, que: "los arcos se vuelven ondas" });
pon("aire", m3.rojo - 0.3, { ancla: "empieza", db: -14, vel: 0.5, que: "la cámara se acerca a la roja" });
pon("aire", m3.azul - 0.4, { ancla: "empieza", db: -13, vel: 0.8, que: "la cámara baja a la azul" });
pon("aire", f4.t("largas") - 0.1, { ancla: "empieza", db: -17, vel: 0.5, que: "la onda roja avanza tranquila" });
[0.5, 0.75, 1.0, 1.25].forEach((d, i) => pon("tic", m3.azul + d, { db: -19 + (i % 2), lp: 6000, que: "la onda azul, nerviosa" }));

// 4. dentro del aire
pon("aire", f5.inicio + 0.12, { ancla: "empieza", db: -11, vel: 0.8, que: "la luz entra en el aire" });
pon("golpe", m4.choca, { db: -9, que: "choca con una partícula" });
pon("aire", f5.t("millones") - 0.2, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara se aleja: miles" });
espaciados(m4.rebotes, 0.22).forEach((t, i) => pon(i % 3 === 2 ? "tic" : "pelota", t, { db: i % 3 === 2 ? -17 : -18 + (i % 2), vel: 1.3 + 0.1 * (i % 3), que: "el azul rebota" }));
pon("clic", v.frase(6).t("cinco") - 0.05, { db: -12, que: "×5" });
pon("estallido", m4.disparo + 0.2, { db: -10, lp: 2000, que: "el azul sale disparado" });
pon("aire", v.frase(7).t("llena"), { ancla: "empieza", db: -12, vel: 0.6, que: "todo se vuelve cielo azul" });

// 5. el atardecer desde el espacio
pon("aire", f8.inicio + 0.15, { ancla: "empieza", db: -14, vel: 0.7, que: "la Tierra otra vez" });
pon("empujon", m5.gira + 0.7, { db: -11, vel: 0.8, que: "la cámara gira y se acerca" });
pon("clic", m5.cuarenta, { db: -11, que: "×40" });
pon("aire", f8.t("veces") + 0.2, { ancla: "empieza", db: -17, vel: 0.5, que: "la luz cruza la capa de aire" });
pon("sube", f8.t("llegar") - 0.1, { db: -18, vel: 0.7, que: "la luz llega a la persona" });
pon("aire", v.frase(9).inicio, { ancla: "empieza", db: -13, vel: 0.5, que: "viajamos por el rayo" });
espaciados(m5.chispas, 0.25).forEach((t, i) => pon("sube", t + 0.05, { db: -17 + (i % 2), vel: 1.2 + 0.1 * (i % 3), que: "salta una chispa azul" }));

// 6. las franjas del cielo
pon("aire", f10.inicio + 0.15, { ancla: "empieza", db: -13, vel: 0.6, que: "llegan los colores cálidos" });
pon("aire", f10.t("colores"), { ancla: "empieza", db: -15, vel: 0.7, que: "más colores llegan" });
[m6.amarillo, m6.naranja, m6.rojo].forEach((t, i) => pon("sube", t + 0.05, { db: -11 - i, vel: 1 - 0.12 * i, que: "se enciende una franja" }));

// 7. la nube
pon("empujon", m7.entra + 0.1, { db: -9, que: "entramos en la nube" });
pon("aire", m7.gotas + 0.4, { ancla: "empieza", db: -15, vel: 0.5, que: "las gotas flotan" });
pon("clic", v.frase(11).t("grandes"), { db: -16, que: "las partículas diminutas al lado" });
espaciados(m7.rebotes, 0.2).forEach((t, i) => pon("cristal", t, { db: -17 + (i % 2), vel: 1.1 + 0.1 * (i % 3), que: "un color rebota en una gota" }));
pon("aire", v.frase(11).t("todos", 2), { ancla: "empieza", db: -12, vel: 0.8, que: "los colores se juntan" });
pon("estallido", m7.blanco + 0.05, { db: -12, lp: 3000, corta: f12.inicio - 0.05, que: "fogonazo blanco" });

// 8. el vaso
pon("cristal", f12.inicio + 0.3, { db: -15, vel: 0.9, que: "el vaso en la mesa" });
pon("aire", f12.t("vaso"), { ancla: "empieza", db: -17, vel: 0.5, que: "la cámara se acerca" });
m8.gotas.forEach((t, i) => pon("aprieta", t, { db: -12 - i, vel: 1.3, que: "cae una gota de leche" }));
pon("clic", m8.luz, { db: -10, que: "se enciende la linterna" });
pon("aire", v.frase(12).t("celular") + 0.2, { ancla: "empieza", db: -16, vel: 0.5, que: "el haz cruza el vaso" });
pon("aire", v.frase(13).t("lado"), { ancla: "empieza", db: -17, vel: 0.5, que: "el agua se ilumina" });
pon("sube", v.frase(13).t("azulada"), { db: -14, que: "el agua brilla azul" });
pon("aire", m8.gira - 0.2, { ancla: "empieza", db: -11, vel: 0.6, que: "la cámara gira alrededor del vaso" });
pon("sube", m8.naranja, { db: -12, vel: 0.8, que: "la luz se ve naranja" });
pon("aire", v.frase(13).t("atardecer"), { ancla: "empieza", db: -15, vel: 0.5, que: "el resplandor del atardecer" });

// 9. el final y SEGUIR
pon("aire", f14.inicio + 0.15, { ancla: "empieza", db: -13, vel: 0.6, que: "el atardecer otra vez" });
pon("aire", f14.t("color"), { ancla: "empieza", db: -16, vel: 0.5, que: "la cámara avanza entre las nubes" });
pon("sube", m9.rayo, { db: -12, reves: true, vel: 0.8, que: "el rayo viene hacia ti" });
espaciados(m9.chispas, 0.3).forEach((t, i) => pon("sube", t + 0.05, { db: -18, vel: 1.3, que: "chispa azul" }));
pon("aire", v.frase(15).inicio + 0.12, { ancla: "empieza", db: -13, vel: 0.9, que: "llega el botón" });
pon("toque", m10.aprieta, { db: -8, que: "el dedo aprieta SEGUIR" });
pon("estallido", m10.aprieta + 0.05, { db: -14, lp: 3000, que: "confeti" });
pon("clic", m10.brilla, { db: -13, que: "el anillo de luz" });

export default e;
