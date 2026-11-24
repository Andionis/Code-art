// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-cabeza.js";
import { momentos as m2 } from "./video/planos/02-disco.js";
import { momentos as m3 } from "./video/planos/03-gente.js";
import { momentos as m4 } from "./video/planos/04-cinta.js";
import { momentos as m5 } from "./video/planos/05-experimento.js";
import { momentos as m6 } from "./video/planos/06-final.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f1 = v.frase(1), f2 = v.frase(2), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);

// el hook: el vuelo entre notas, el remolino, se meten por la oreja, la cabeza, la nota que choca
pon("aire", 0.0, { ancla: "empieza", db: -9, vel: 1.1, que: "el vuelo entre las notas" });
pon("aire", f1.t("cancion") - 0.05, { ancla: "empieza", db: -12, vel: 0.8, que: "el remolino de notas" });
pon("empujon", m1.pegada, { db: -7, que: "las notas se meten por la oreja" });
pon("aire", m1.pegada + 0.15, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara se aleja" });
pon("clic", m1.cabeza + 0.2, { db: -15, que: "la cabeza, entera" });
pon("sube", m1.choque - 0.4, { db: -15, vel: 1.2, que: "una nota intenta salir" });
pon("golpe", m1.choque, { db: -10, que: "choca con la frente" });

// el disco
pon("desliza", f2.inicio + 0.15, { db: -16, vel: 0.8, que: "el disco gira" });
pon("sube", f2.t("cancion") - 0.05, { db: -14, que: "se enciende toda la canción" });
pon("clic", m2.pedacito, { db: -13, que: "solo queda el pedacito" });
m2.saltos.forEach((t, i) => { pon("tic", t + 0.03, { db: -10 + i, vel: 0.9, que: "la aguja salta en la raya" }); pon("enganche", t + 0.06, { db: -14, que: "la aguja vuelve atrás" }); });

// la gente
m3.enciende.forEach((t, i) => i % 2 === 0 && pon("clic", t + 0.05, { db: -16 + (i % 3), vel: 1 + 0.06 * i, que: "se enciende una cabeza" }));
pon("pitido", v.frase(3).t("diez") - 0.15, { db: -18, que: "9 de cada 10" });
pon("late", m3.semana + 0.15, { db: -11, que: "laten todas" });

// la cinta del coro
pon("aire", f4.inicio + 0.12, { ancla: "empieza", db: -13, vel: 0.6, que: "la cinta pasa y frena" });
pon("sube", m4.coro, { db: -13, que: "el coro se enciende" });
pon("clic", f4.t("quince") - 0.1, { db: -14, que: "15-30 s" });
pon("aire", f4.t("cerebro") - 0.05, { ancla: "empieza", db: -13, vel: 0.8, que: "el coro se enrolla" });
pon("late", m4.bucle + 0.1, { db: -12, que: "el bucle" });
pon("aire", f5.t("rapidas"), { ancla: "empieza", db: -14, vel: 1.2, que: "el aro gira más deprisa" });
pon("aire", f5.t("faciles") - 0.1, { ancla: "empieza", db: -15, vel: 0.8, que: "el aro se abre en notas" });
pon("sube", f5.t("suben"), { db: -15, vel: 1.1, que: "suben" });
pon("clic", m4.estrella, { db: -13, que: "la estrella" });
m4.saltos.forEach((t, i) => i % 2 === 0 && pon("pelota", t, { db: -19 + (i % 4 === 0 ? 1 : 0), vel: 1.3 + 0.04 * i, que: "las notas saltan" }));

// el experimento
pon("aire", f6.inicio + 0.12, { ancla: "empieza", db: -15, vel: 0.5, que: "la cámara se acerca" });
pon("clic", m5.apaga, { db: -14, que: "el audífono se apaga" });
pon("late", f6.t("escucharla") + 0.1, { db: -11, que: "la parte que oye late" });
pon("aire", f7.t("experimento") - 0.4, { ancla: "empieza", db: -14, vel: 0.7, que: "la cámara se aleja y sale la cinta" });
pon("clic", m5.apagaron, { db: -12, que: "silencio" });
pon("pitido", m5.apagaron + 0.4, { db: -21, que: "la raya plana" });
pon("tic", m5.apagaron + 1.95, { db: -17, que: "vuelve el sonido" });
pon("late", m5.encendida + 0.1, { db: -9, que: "sigue encendida" });
pon("aire", f8.inicio - 0.05, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara baja" });
m5.rellena.forEach((t, i) => i % 2 === 0 && pon("tic", t + 0.05, { db: -17 + (i % 3), vel: 1.1 + 0.05 * i, que: "se rellena una barra" }));
pon("sube", f8.t("cantando"), { db: -14, que: "las notas suben a la cabeza" });

// el final
pon("aire", m6.otra - 0.1, { ancla: "empieza", db: -13, vel: 0.9, que: "entra la otra canción" });
pon("empujon", m6.peor, { db: -9, que: "el bucle crece y echa a las azules" });
pon("aire", m6.mastica - 0.8, { ancla: "empieza", db: -14, vel: 0.6, que: "la cámara baja a la boca" });
[0, 0.48, 0.96, 1.44, 1.92, 2.4, 2.88, 3.36].forEach((d, i) => pon("aprieta", m6.mastica + 0.24 + d, { db: -17 + (i % 2), vel: 1.1 + 0.05 * (i % 3), que: "mastica" }));
pon("sube", m6.chicle + 0.05, { db: -13, vel: 0.8, que: "se infla el globo" });
pon("aire", f10.t("cuesta") - 0.2, { ancla: "empieza", db: -16, vel: 0.5, que: "el bucle se frena" });
pon("aire", f11.inicio - 0.05, { ancla: "empieza", db: -13, vel: 0.6, que: "el globo se desinfla y la cámara se aleja" });
pon("sube", f11.t("sigues") - 0.1, { db: -13, que: "las notas suben de la boca" });
pon("late", m6.cantando + 0.2, { db: -10, que: "el bucle se vuelve a encender" });
pon("aire", f12.inicio + 0.05, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara se aleja" });
pon("late", m6.amigo + 0.1, { db: -13, que: "el bucle late" });
pon("aire", f12.t("interesar"), { ancla: "empieza", db: -16, vel: 0.5, que: "las notas frenan" });

// sin huecos: lo que se sigue moviendo
pon("aire", f5.t("donde") - 0.1, { ancla: "empieza", db: -17, vel: 0.5, que: "la melodía sigue saltando" });
pon("desliza", m5.apagaron + 0.7, { db: -19, vel: 0.8, que: "el cursor avanza en el silencio" });
pon("tic", v.frase(7).t("canciones"), { db: -18, vel: 1.2, que: "el cursor sigue" });
pon("aire", v.frase(7).t("conocidas") + 0.2, { ancla: "empieza", db: -17, vel: 0.5, que: "vuelven las ondas" });
pon("clic", v.frase(7).t("parte") + 0.05, { db: -17, que: "la parte que oye brilla" });
pon("aire", f8.t("dentro") - 0.1, { ancla: "empieza", db: -17, vel: 0.5, que: "las notas suben a la cabeza" });
pon("aire", v.frase(9).t("intentas"), { ancla: "empieza", db: -16, vel: 0.6, que: "el bucle gira" });
pon("aire", f11.t("vaya") - 0.1, { ancla: "empieza", db: -17, vel: 0.5, que: "el bucle gira despacio" });
pon("tic", f11.t("cancion") + 0.05, { db: -18, vel: 1.1, que: "una nota del bucle" });

export default e;
