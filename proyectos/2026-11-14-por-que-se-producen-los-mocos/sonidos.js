// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-hook.js";
import { momentos as m2 } from "./video/planos/02-pared.js";
import { momentos as m3 } from "./video/planos/03-pelitos.js";
import { momentos as m4 } from "./video/planos/04-cinta.js";
import { momentos as m5 } from "./video/planos/05-estomago.js";
import { momentos as m6 } from "./video/planos/06-virus.js";
import { momentos as m7 } from "./video/planos/07-lavamanos.js";
import { momentos as m8 } from "./video/planos/08-defensas.js";
import { momentos as m9 } from "./video/planos/09-trampa.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f2 = v.frase(2), f3 = v.frase(3), f6 = v.frase(6), f7 = v.frase(7), f10 = v.frase(10), f12 = v.frase(12), f13 = v.frase(13);

// el hook: el vuelo por el túnel, la bola que llega, las gotas y el trago
pon("aire", 0.0, { ancla: "empieza", db: -9, vel: 1.1, que: "el vuelo por el túnel" });
pon("empujon", m1.llega, { db: -7, que: "la bola llega contra la pantalla" });
pon("aprieta", m1.llega + 0.03, { db: -11, que: "la bola se aplasta" });
pon("aire", m1.cae - 0.4, { ancla: "empieza", db: -15, vel: 0.7, que: "la bola se aparta" });
pon("tierra", m1.cae, { db: -16, que: "la bola cae al suelo del túnel" });
[0, 0.7, 1.4, 2.0].forEach((d, i) => pon("aprieta", m1.fabrica + d, { db: -18 + (i % 2), vel: 1.2 + 0.1 * i, que: "salen gotas" }));
pon("aire", f2.t("casi") - 0.1, { ancla: "empieza", db: -15, vel: 0.6, que: "la bola resbala y la cámara la sigue" });
pon("aprieta", m1.trago + 0.08, { db: -9, vel: 0.8, que: "el trago" });
pon("empujon", m1.trago, { db: -12, vel: 0.9, que: "el túnel se cierra" });

// la pared: las gotas, la entrada en la gota, la gelatina, lo que se pega
pon("aire", f3.inicio + 0.12, { ancla: "empieza", db: -14, vel: 0.6, que: "la cámara se aleja de la pared" });
pon("aire", f3.t("forrada") - 0.1, { ancla: "empieza", db: -17, vel: 0.5, que: "el brillo barre la pared" });
m2.gotas.filter((t, i) => i % 4 === 0).forEach((t, i) => pon("aprieta", t + 0.25, { db: -17 + (i % 2) * 2, vel: 1.1 + 0.05 * (i % 3), que: "sale una gota" }));
pon("empujon", m2.entra + 0.35, { db: -10, que: "la cámara entra en la gota" });
pon("aire", m2.agua, { ancla: "empieza", db: -16, vel: 0.5, que: "el agua por dentro" });
pon("sube", m2.proteinas, { db: -15, que: "llegan las hebras" });
pon("sube", m2.proteinas + 0.6, { db: -16, vel: 1.1, que: "más hebras" });
pon("aire", m2.espesa - 0.2, { ancla: "empieza", db: -15, vel: 0.5, que: "se vuelve espesa" });
pon("aprieta", m2.gelatina + 0.05, { db: -10, que: "la gelatina tiembla" });
pon("aire", m2.sale + 0.05, { ancla: "empieza", db: -12, vel: 0.8, que: "la cámara sale de la gota" });
pon("aire", v.frase(5).t("papel"), { ancla: "empieza", db: -15, vel: 0.5, que: "la cámara se aleja y se ve la capa" });
pon("clic", v.frase(5).t("atrapamoscas") + 0.3, { db: -17, que: "la capa brilla" });
let ultimo = -1;
for (const c of m2.choques) {
  if (c.t - ultimo < 0.12) continue; ultimo = c.t;
  pon(c.tipo === "polvo" ? "tic" : c.tipo === "polen" ? "pelota" : "aprieta", c.t, { db: c.tipo === "polen" ? -17 : -14, vel: c.tipo === "polen" ? 1.5 : 1.1, que: `se pega ${c.tipo}` });
}
pon("aprieta", m2.pegados + 0.15, { db: -11, vel: 0.9, que: "la capa tiembla con todo pegado" });

// los pelitos: bajan la cámara, reman, empujan y cae a la garganta
pon("aire", f6.inicio + 0.1, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara baja por la capa" });
[0, 0.35, 0.7].forEach((d, i) => pon("desliza", m3.pelitos + d, { db: -18, vel: 1.2 + 0.1 * i, que: "los pelitos reman" }));
[0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5].forEach((d, i) => pon("tic", m3.remos + d, { db: -17 + (i % 2), lp: 6000, que: "los pelitos reman más rápido" }));
pon("desliza", m3.empujan, { db: -13, vel: 0.7, que: "la capa avanza" });
pon("aire", m3.empujan + 0.6, { ancla: "empieza", db: -15, vel: 0.5, que: "la cámara sigue a la capa" });
pon("aire", m3.cae, { ancla: "empieza", db: -11, vel: 0.9, que: "la capa cae a la garganta" });

// la cinta del súper
pon("desliza", f7.t("cinta") + 0.05, { db: -13, vel: 0.8, que: "la cinta corre" });
pon("pitido", f7.t("super") + 0.05, { db: -18, que: "el lector de la caja" });
pon("tierra", m4.cae + 0.25, { db: -12, que: "la bola cae por el borde" });

// el estómago
pon("aire", v.frase(8).inicio + 0.12, { ancla: "empieza", db: -13, vel: 0.9, que: "la bola cae" });
pon("aprieta", m5.salpica, { db: -8, vel: 0.8, que: "la bola cae al ácido" });
pon("estallido", m5.deshace + 0.1, { db: -15, lp: 1400, vel: 1.3, que: "se deshace en burbujas" });
pon("aire", m5.deshace + 0.6, { ancla: "empieza", db: -16, vel: 0.5, que: "el hervidero" });

// el virus y el resfriado
pon("aire", v.frase(9).inicio + 0.15, { ancla: "empieza", db: -12, vel: 0.7, que: "el virus llega girando" });
pon("aprieta", m6.pega, { db: -10, que: "el virus se pega" });
pon("late", m6.irrita + 0.2, { db: -12, que: "la nariz se irrita" });
pon("late", m6.irrita + 1.1, { db: -13, que: "late otra vez" });
[0, 0.3, 0.55, 0.85].forEach((d, i) => pon("aprieta", m6.mas - 0.2 + d, { db: -12 + (i % 2), vel: 0.9 + 0.1 * i, que: "chorrea moco" }));

// el lavamanos
pon("aire", f10.inicio + 0.15, { ancla: "empieza", db: -13, vel: 0.5, que: "el chorro del grifo" });
pon("empujon", m7.rebosa + 0.1, { db: -11, vel: 0.8, que: "se desborda" });
pon("aire", m7.rebosa + 0.8, { ancla: "empieza", db: -15, vel: 0.5, que: "la cortina de agua cae" });

// las defensas y el verde
pon("empujon", m8.lanza + 0.4, { db: -9, que: "la cámara se lanza dentro del moco verde" });
m8.llegan.forEach((t, i) => pon("aprieta", t, { db: -14 + (i % 2), vel: 1 + 0.1 * i, que: "un glóbulo se traga un virus" }));
m8.revientan.forEach((t, i) => pon("estallido", t + 0.05, { db: -14 + (i % 2), lp: 1400, vel: 1.2 + 0.1 * i, que: "un glóbulo revienta" }));
pon("sube", v.frase(11).t("verde", 2) - 0.1, { db: -13, que: "todo se vuelve verde" });

// la trampa y el final
pon("aire", f12.inicio + 0.15, { ancla: "empieza", db: -15, vel: 0.5, que: "la cámara avanza por la nariz" });
ultimo = -1;
m9.pegan.forEach((t, i) => { if (t - ultimo < 0.12) return; ultimo = t; pon("aprieta", t, { db: -15 + (i % 2), vel: 1 + 0.08 * (i % 4), que: "se pega en la trampa" }); });
pon("aire", f12.t("respiras"), { ancla: "empieza", db: -16, vel: 0.6, que: "la cámara sigue" });
pon("empujon", m9.lanza + 0.2, { db: -10, vel: 1.1, que: "la cámara se lanza por el túnel" });
pon("aire", f13.t("amigo"), { ancla: "empieza", db: -11, vel: 1.1, que: "el vuelo por el túnel" });

export default e;
