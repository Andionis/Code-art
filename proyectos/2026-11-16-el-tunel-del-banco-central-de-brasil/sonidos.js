// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-hook.js";
import { momentos as m3 } from "./video/planos/03-corte.js";
import { momentos as m4 } from "./video/planos/04-concreto.js";
import { momentos as m5 } from "./video/planos/05-arriba.js";
import { momentos as m6 } from "./video/planos/06-bascula.js";
import { momentos as m7 } from "./video/planos/07-billetes.js";
import { momentos as m8 } from "./video/planos/08-lunes.js";
import { momentos as m9 } from "./video/planos/09-final.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f12 = v.frase(12);

// ---------------------------------------------------------------- 1. el hook: el túnel y la bóveda
pon("aire", 0.0, { ancla: "empieza", db: -9, vel: 1.1, que: "el vuelo por el túnel" });
pon("aire", 0.9, { ancla: "empieza", db: -13, vel: 1.2, que: "pasan los focos" });
pon("aire", 1.75, { ancla: "empieza", db: -13, vel: 0.9, que: "frena y mira arriba" });
pon("roca", m1.sale - 0.35, { db: -12, que: "sube por el concreto roto" });
pon("empujon", m1.sale - 0.2, { db: -8, que: "asoma en la bóveda" });
pon("aire", m1.sale + 0.2, { ancla: "empieza", db: -15, vel: 0.6, que: "la cámara se echa atrás" });
const Tlle = f1.t("llevaron"), T164 = f1.t("164"), Trea = f1.t("reales");
pon("aire", Tlle + 0.05, { ancla: "empieza", db: -13, vel: 0.7, que: "los fajos saltan" });
[0, 0.45, 0.9, 1.35, 1.8, 2.25].forEach((d, i) => pon("papel", Tlle + 0.35 + d, { db: -15 + (i % 2) * 2, vel: 0.9 + 0.08 * (i % 3), que: "caen fajos al hoyo" }));
[0, 1, 2, 3].forEach((i) => pon("tic", T164 - 0.1 + i * (Trea - T164 + 0.2) / 4, { db: -17, que: "corre la cifra" }));
pon("cash", Trea + 0.15, { db: -12, que: "la cifra llega a 164 millones" });
pon("aire", f2.t("nadie") - 0.05, { ancla: "empieza", db: -17, vel: 0.5, que: "las luces bajan" });
pon("clic", f2.t("lunes") + 0.05, { db: -14, que: "la raya de luz en la puerta" });

// ---------------------------------------------------------------- 2. la calle
const Tren = f3.t("rentaron"), Tdis = f3.t("disfrazaron");
pon("aire", f3.inicio + 0.15, { ancla: "empieza", db: -17, vel: 0.5, que: "la cámara se acerca a la casa" });
pon("papel", Tren + 0.5, { db: -13, que: "cae el letrero SE RENTA" });
pon("aire", f3.t("cerca") - 0.1, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara se abre y sube: el banco" });
pon("aire", Tdis - 0.15, { ancla: "empieza", db: -15, vel: 0.8, que: "cae el letrero verde" });
pon("madera", Tdis + 0.36, { db: -10, que: "el letrero golpea la fachada" });
[0, 1, 2, 3, 4].forEach((i) => pon("tierra", Tdis + 0.55 + i * 0.16 + 0.33, { db: -16 + (i % 2), vel: 1.1 + 0.05 * i, que: "cae un rollo de pasto" }));
const Tsac = f4.t("sacos"), Tno4 = f4.t("no"), Tdias0 = f4.t("todos") - 0.1;
const llegadas = Array.from({ length: 18 }, (_, i) => (i < 4 ? Tsac - 0.45 + (i / 4) * 1.15 : Tsac + 0.75 + ((i - 4) / 13) * (Tno4 + 0.25 - 0.4 - Tsac - 0.75)) + 0.55);
let ult = -1;
llegadas.forEach((t, i) => { if (t - ult < 0.18) return; ult = t; pon("tierra", t, { db: -14 + (i % 2) * 2, vel: 0.9 + 0.06 * (i % 4), que: "un saco cae en la camioneta" }); });
pon("aire", Tdias0, { ancla: "empieza", db: -15, vel: 0.5, que: "pasan los días" });
pon("aire", Tdias0 + 0.6, { ancla: "empieza", db: -17, vel: 0.5, que: "pasan los días" });
[0, 0.4, 0.8, 1.2, 1.6].forEach((d, i) => pon("tic", f4.t("raros") - 0.6 + d, { db: -21, lp: 5000, vel: 0.8, que: "los pasos de la gente" }));

// ---------------------------------------------------------------- 3. el corte del suelo
[0.25, 0.65, 1.05, 1.45].forEach((d, i) => pon("tierra", m3.pozo[0] + d, { db: -15 + (i % 2) * 2, vel: 0.9 + 0.1 * (i % 2), que: "cavan el pozo" }));
pon("clic", m3.cota4, { db: -14, que: "la cota 4 m" });
pon("aire", m3.tunel[0] + 0.1, { ancla: "empieza", db: -12, vel: 0.5, que: "el túnel avanza y la cámara se aleja" });
[0.4, 1.0, 1.6, 2.2].forEach((d, i) => pon("tierra", m3.tunel[0] + d, { db: -18 + (i % 2), vel: 1.1, que: "la punta echa tierra" }));
pon("clic", m3.cota80 + 0.05, { db: -13, que: "la cota 80 m" });
pon("aire", m3.cancha - 0.2, { ancla: "empieza", db: -14, vel: 0.8, que: "llega la cancha" });
pon("golpe", m3.cancha + 0.3, { db: -15, que: "la cancha se posa" });
const Tang = f6.t("angosto");
pon("aire", Tang - 0.6, { ancla: "empieza", db: -11, vel: 0.7, que: "la cámara entra al túnel" });
[0.3, 1.2, 2.1].forEach((d, i) => pon("tierra", Tang + d, { db: -20, vel: 1.3, que: "gatea" }));
pon("clic", m3.luz + 0.25, { db: -13, que: "se enciende un foco" });
pon("clic", m3.luz + 0.55, { db: -14, vel: 1.1, que: "se enciende otro foco" });
pon("aire", m3.aire - 0.25, { ancla: "empieza", db: -11, vel: 0.5, que: "sopla el aire frío" });
pon("aire", m3.aire + 0.6, { ancla: "empieza", db: -15, vel: 0.5, que: "sigue el aire" });

// ---------------------------------------------------------------- 4. el concreto, la bóveda, la balanza, los billetes
pon("aire", v.frase(7).inicio + 0.05, { ancla: "empieza", db: -11, vel: 0.7, que: "la cámara corre hasta la bóveda" });
pon("golpe", m4.llega, { db: -17, que: "llega bajo la bóveda" });
m4.golpes.forEach((t, i) => pon("roca", t, { db: -14 + (i % 2) * 2, vel: 1.1 + 0.08 * (i % 3), que: "pican el concreto" }));
pon("cruje", m4.rompe + 0.9, { db: -15, que: "el concreto se agrieta" });
pon("roca", m4.abre, { db: -9, vel: 0.85, que: "se abre el hoyo" });
pon("golpe-hondo", m4.abre + 0.05, { db: -10, que: "se abre el hoyo" });
pon("tierra", m4.abre + 0.45, { db: -15, que: "caen los trozos al túnel" });
pon("aire", m5.asoma - 0.25, { ancla: "empieza", db: -12, vel: 0.8, que: "asoma por el hoyo" });
pon("sube", m5.asoma, { db: -15, que: "sube a la bóveda" });
pon("cash", m5.cincuenta + 0.05, { db: -13, que: "R$ 50" });
let uf = -1;
m6.fajos.forEach((t, i) => { if (t - uf < 0.12) return; uf = t; pon("papel", t, { db: -15 + (i % 2) * 2, vel: 0.9 + 0.05 * (i % 3), que: "cae un fajo en la balanza" }); });
pon("lingote", m6.fajos[0] + 0.05, { db: -12, que: "el plato se hunde" });
pon("metal", m6.fajos[m6.fajos.length - 1] + 0.3, { db: -15, que: "la viga rebota" });
pon("golpe-hondo", m6.autos[0], { db: -10, que: "cae el primer auto" });
pon("metal", m6.autos[1], { db: -11, que: "cae el segundo auto" });
pon("papel", v.frase(9).inicio + 0.15, { db: -13, que: "el billete" });
pon("aire", m7.abanico - 0.1, { ancla: "empieza", db: -13, vel: 0.7, que: "llegan los billetes en abanico" });
pon("papel", m7.abanico + 0.2, { db: -15, vel: 1.1, que: "se posan los billetes" });
const Tnum = v.frase(9).t("numeros");
[0, 0.2, 0.4].forEach((d, i) => pon("clic", Tnum + 0.05 + d, { db: -15 + i, vel: 1 + 0.1 * i, que: "se marcan los números" }));
pon("desliza", m7.linea + 0.1, { db: -15, vel: 1.2, que: "la línea roja intenta unirlos" });
pon("cristal", m7.rompe, { db: -11, que: "la línea se rompe" });

// ---------------------------------------------------------------- 5. el lunes y el final
pon("aire", v.frase(10).inicio + 0.15, { ancla: "empieza", db: -17, vel: 0.5, que: "la bóveda vacía" });
pon("metal", m8.abre, { db: -9, que: "se abre la puerta" });
pon("desliza", m8.abre + 0.15, { db: -13, vel: 0.6, que: "la puerta gira" });
pon("clic", m8.luces, { db: -13, que: "se encienden las luces" });
pon("aire", m8.hoyo - 0.75, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara va al hoyo" });
pon("hueco", m8.hoyo + 0.05, { db: -15, que: "el hoyo" });
pon("aire", v.frase(11).inicio + 0.05, { ancla: "empieza", db: -14, vel: 0.7, que: "mira a la puerta" });
pon("aire", m8.salto - 0.1, { ancla: "empieza", db: -12, vel: 0.9, que: "se lanza al hoyo" });
pon("empujon", m8.cae, { db: -9, que: "cae al túnel" });
pon("aire", m9.corren + 0.1, { ancla: "empieza", db: -12, vel: 1.0, que: "el dinero corre por el túnel" });
pon("sube", m9.salen, { db: -12, que: "los billetes salen volando" });
pon("papel", m9.salen + 0.35, { db: -15, que: "billetes al viento" });
pon("papel", m9.salen + 0.75, { db: -16, vel: 1.1, que: "billetes al viento" });
pon("aire", m9.apagan + 0.3, { ancla: "empieza", db: -15, vel: 0.5, que: "los billetes se apagan" });
pon("sube", m9.apagan + 1.0, { db: -17, vel: 0.8, reves: true, que: "se apaga el último" });
pon("aire", m9.lanza, { ancla: "empieza", db: -11, vel: 0.8, que: "la cámara se lanza a la boca del túnel" });
pon("empujon", f12.inicio + 1.08, { db: -10, que: "entra al túnel" });
pon("aire", f12.inicio + 1.5, { ancla: "empieza", db: -11, vel: 1.1, que: "vuela por el túnel (como al principio)" });

export default e;
