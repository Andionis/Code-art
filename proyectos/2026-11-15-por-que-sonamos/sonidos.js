// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-sueno-cuarto.js";
import { momentos as m3 } from "./video/planos/03-pesadilla.js";
import { momentos as m4 } from "./video/planos/04-simulador.js";
import { momentos as m5 } from "./video/planos/05-estres.js";
import { momentos as m6 } from "./video/planos/06-nube.js";
import { momentos as m7 } from "./video/planos/07-estudio.js";
import { momentos as m8 } from "./video/planos/08-final.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

// el sueño: volando, la ballena que pasa, la cámara que se aleja, la burbuja que revienta
pon("aire", 0.0, { ancla: "empieza", db: -9, vel: 1.0, que: "volando por el sueño" });
pon("aire", 0.45, { ancla: "empieza", db: -12, vel: 0.7, que: "la ballena pasa" });
pon("empujon", f1.t("despertar") + 0.7, { db: -9, que: "la cámara se aleja de golpe al cuarto" });
pon("cristal", m1.pop + 0.1, { db: -10, vel: 1.1, que: "la burbuja revienta" });
pon("sube", m1.pop + 0.35, { db: -15, vel: 0.9, que: "las chispas suben" });
// el reloj corre, la cámara entra en la cabeza, el cerebro se enciende, la película
for (let i = 0; i < 4; i++) pon("tic", f2.t("cada") + 0.15 + i * 0.3, { db: -16 - (i % 2), vel: 1 + (i % 2) * 0.1, lp: 6000, que: "el reloj corre" });
pon("aire", f2.t("cerebro"), { ancla: "empieza", db: -11, vel: 0.8, que: "la cámara entra en la cabeza" });
pon("late", m1.enciende, { db: -9, que: "el cerebro se enciende" });
pon("late", f2.t("despierto") + 0.15, { db: -12, que: "late más fuerte" });
pon("sube", f2.t("pone") - 0.1, { db: -11, que: "el haz sube de la frente" });
pon("clic", m1.pelicula + 0.2, { db: -13, que: "la burbuja vuelve a formarse" });
// el cuerpo: la manta, la pierna, los músculos que se apagan, la escarcha
pon("aire", f3.inicio + 0.1, { ancla: "empieza", db: -15, vel: 0.6, que: "la manta se vuelve transparente" });
pon("sube", f3.t("levantes"), { db: -14, vel: 0.8, que: "la pierna se levanta" });
pon("golpe", f3.t("apaga") + 0.75, { db: -13, que: "la pierna cae" });
for (let i = 0; i < 3; i++) pon("clic", f3.t("apaga") + i * 0.32, { db: -15 - i, vel: 0.9 + i * 0.05, que: "se apagan los músculos" });
pon("cristal", f3.t("paralizado") + 0.05, { db: -11, vel: 0.8, que: "el cuerpo se congela" });
pon("cristal", f3.t("paralizado") + 0.55, { db: -16, vel: 1.2, que: "brilla la escarcha" });
// el cerebro y las dos ideas
pon("late", f4.inicio + 0.12, { db: -11, que: "el cerebro enorme" });
pon("late", f4.t("trabajo") + 0.2, { db: -12, que: "el cerebro trabaja" });
[0, 0.45, 0.9].forEach((d, i) => pon("aire", f4.t("ciencia") + d, { ancla: "empieza", db: -15 - i, vel: 0.6, que: "las ondas buscan" }));
pon("sube", f4.t("dos") - 0.05, { db: -10, que: "salen las dos burbujas" });
pon("clic", f4.t("ideas") + 0.15, { db: -14, que: "se quedan a cada lado" });
pon("empujon", f5.t("simulacro"), { db: -9, que: "la cámara se lanza dentro de la burbuja roja" });
// la pesadilla: corre, la sombra se le echa encima, el suelo se rompe y cae; la cama blanda
for (let i = 0; i < 5; i++) pon("tic", f5.t("simulacro") + 0.5 + i * 0.27, { db: -17, vel: 0.7 + (i % 2) * 0.1, lp: 3000, que: "pasos" });
pon("aire", m3.lanza - 0.3, { ancla: "empieza", db: -11, vel: 0.7, que: "la sombra se le echa encima" });
pon("golpe-hondo", m3.lanza + 0.1, { db: -10, que: "se encienden los ojos" });
pon("roca", m3.grieta + 0.1, { db: -9, que: "el suelo se rompe" });
pon("empujon", m3.cae + 0.6, { db: -11, vel: 0.8, que: "cae por el pozo" });
pon("roca", m3.cae + 0.9, { db: -16, vel: 1.2, que: "trozos que caen" });
pon("aire", m3.cae + 1.4, { ancla: "empieza", db: -13, vel: 0.6, que: "sigue cayendo" });
pon("aprieta", m3.cama, { db: -8, que: "cae en la cama blanda" });
pon("pelota", m3.cama + 0.12, { db: -16, que: "rebota" });
// el simulador: el rayo, las sacudidas, la cámara se aleja
pon("hueco", m4.rayo + 0.02, { db: -10, vel: 0.8, que: "el rayo en la pantalla" });
pon("metal", m4.rayo + 0.25, { db: -15, vel: 0.9, que: "la cabina se sacude" });
pon("aire", f6.t("simulador") - 0.1, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara se aleja" });
pon("desliza", f6.t("simulador") + 0.5, { db: -16, que: "las patas se asientan" });
// el estrés: la onda de terapia, el remolino que se va
pon("sube", m5.terapia, { db: -12, vel: 0.7, que: "la onda azul" });
pon("aire", f7.t("suenas"), { ancla: "empieza", db: -16, vel: 0.5, que: "todo se vuelve azul" });
pon("aire", m5.baja - 0.1, { ancla: "empieza", db: -11, vel: 0.6, que: "las chispas se van por el desagüe" });
pon("sube", m5.baja + 0.6, { db: -14, vel: 0.6, reves: true, que: "se absorben" });
// la nube: el trueno, la lluvia, el sol
pon("aire", v.frase(8).inicio + 0.1, { ancla: "empieza", db: -15, vel: 0.5, que: "la lluvia" });
pon("canon", m6.rayo, { db: -10, que: "el trueno" });
pon("aire", m6.aclara + 0.2, { ancla: "empieza", db: -13, vel: 0.6, que: "la nube se aclara" });
pon("timbre", v.frase(8).t("angustia") + 0.15, { db: -20, vel: 1.2, que: "sale el sol" });
// el estudio
pon("clic", m7.foto1 + 0.15, { db: -13, que: "se enciende la pantalla" });
pon("pitido", m7.susto, { db: -11, que: "el medidor se dispara" });
pon("golpe", m7.susto + 0.05, { db: -13, que: "se echa atrás" });
pon("aire", f9.t("gente"), { ancla: "empieza", db: -14, vel: 0.5, que: "cae la noche" });
pon("aire", f9.t("volvio") - 0.2, { ancla: "empieza", db: -15, vel: 0.7, que: "vuelve el día" });
pon("clic", m7.foto2 + 0.08, { db: -13, que: "la misma foto" });
pon("tic", f9.t("fuertes") + 0.1, { db: -16, que: "la araña se acerca" });
pon("pitido", m7.menos + 0.25, { db: -16, vel: 0.8, que: "el medidor apenas sube" });
// el final: la burbuja, el salto, la luz, la ciudad
pon("aire", f10.inicio + 0.15, { ancla: "empieza", db: -15, vel: 0.6, que: "el cuarto otra vez" });
pon("sube", f9.t("menos") + 0.3, { db: -17, vel: 0.8, que: "el medidor se queda bajo" });
pon("late", m8.hincha, { db: -11, que: "la burbuja se hincha" });
pon("aire", f10.t("es", 2) - 0.2, { ancla: "empieza", db: -15, vel: 0.7, que: "la cámara se acerca" });
pon("empujon", m8.salto + 0.35, { db: -12, que: "salta la grieta" });
pon("sube", m8.cura, { db: -10, que: "todo se llena de luz" });
pon("aire", f10.t("duermes") - 0.2, { ancla: "empieza", db: -11, vel: 0.6, que: "la cámara sale por la ventana" });
pon("aire", f11.inicio + 0.3, { ancla: "empieza", db: -13, vel: 0.5, que: "se ve la ciudad" });
pon("late", f11.t("amigo"), { db: -14, que: "todas las burbujas" });
pon("clic", f11.fin + 0.3, { db: -16, que: "se queda la ciudad" });

export default e;
