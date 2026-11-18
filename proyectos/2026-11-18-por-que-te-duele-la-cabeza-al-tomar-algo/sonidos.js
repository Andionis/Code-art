// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-hook.js";
import { momentos as m2 } from "./video/planos/02-paladar.js";
import { momentos as m3 } from "./video/planos/03-presion.js";
import { momentos as m4 } from "./video/planos/04-nervio.js";
import { momentos as m5 } from "./video/planos/05-prisa.js";
import { momentos as m6 } from "./video/planos/06-cierre.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f = (n) => v.frase(n);

// el hook: el sorbo, el hielo que salta, el dolor, la escarcha, la cámara que se aleja, el cerebro
pon("empujon", 0.0, { ancla: "empieza", db: -8, vel: 1.2, que: "el granizado sube disparado por la pajita" });
pon("cristal", 0.12, { db: -13, vel: 1.1, que: "saltan trozos de hielo" });
pon("cristal", 0.35, { db: -16, vel: 1.3, que: "más trozos de hielo" });
pon("golpe", m1.duele + 0.02, { db: -9, que: "rayos de dolor en la frente" });
pon("cruje", m1.cabeza + 0.05, { db: -15, vel: 1.2, que: "la escarcha se extiende y cruje" });
pon("aire", m1.cabeza + 0.6, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara se aleja hasta la cabeza entera" });
pon("late", m1.helado + 0.1, { db: -11, que: "latido de dolor en «helado»" });
pon("sube", m1.cerebro - 0.05, { db: -14, que: "la piel se vuelve transparente" });
pon("late", m1.cerebro + 0.7, { db: -15, que: "el cerebro late, cálido" });
pon("aire", m1.congelando + 0.1, { ancla: "empieza", db: -16, vel: 0.5, que: "la escarcha se derrite" });
pon("aire", m1.frio, { ancla: "empieza", db: -15, vel: 0.7, que: "el frío baja a la boca" });
pon("late", f(2).t("llega") + 0.1, { db: -17, que: "el frío se queda en la boca" });

// el paladar
pon("aire", f(3).inicio + 0.1, { ancla: "empieza", db: -14, vel: 0.6, que: "la cámara entra en la boca" });
pon("aire", f(3).t("boca") - 0.1, { ancla: "empieza", db: -16, vel: 0.7, que: "la cámara baja a la boca" });
pon("clic", f(3).t("paladar") + 0.05, { db: -13, que: "se enciende el paladar" });
pon("empujon", m2.choque - 0.25, { db: -10, vel: 1.1, que: "la ola de granizado entra" });
pon("golpe-hondo", m2.choque, { db: -8, que: "la ola choca contra el paladar" });
pon("cristal", m2.choque + 0.08, { db: -14, vel: 0.9, que: "se escarcha" });
pon("aire", f(4).t("vasos") - 0.1, { ancla: "empieza", db: -16, vel: 0.6, que: "la cámara se acerca a los vasos" });
pon("aprieta", m2.cierran + 0.1, { db: -9, que: "los vasos se cierran de golpe" });
pon("sube", m2.cierran + 0.5, { db: -16, vel: 0.8, que: "el calor sube y se guarda" });
pon("sube", m2.cierran + 1.4, { db: -17, vel: 0.9, que: "más calor que sube" });
pon("late", f(5).t("segundo"), { db: -15, que: "espera un segundo" });
pon("estallido", m2.abren + 0.05, { db: -11, lp: 1400, vel: 1.2, que: "los vasos se abren de golpe" });
pon("aire", m2.sangre, { ancla: "empieza", db: -12, vel: 0.8, que: "la sangre corre hacia arriba" });
pon("aire", f(5).t("velocidad"), { ancla: "empieza", db: -15, vel: 0.6, que: "la cámara sigue la sangre" });

// la presión
pon("late", f(6).t("frente") + 0.05, { db: -16, que: "la sangre llega detrás de la frente" });
pon("aire", f(6).t("arteria") - 0.15, { ancla: "empieza", db: -16, vel: 0.6, que: "la cámara llega a la frente" });
pon("sube", m3.infla, { db: -12, vel: 0.7, que: "la arteria se infla" });
pon("late", m3.globo + 0.1, { db: -10, que: "el globo late" });
pon("late", m3.globo + 0.95, { db: -13, que: "el globo late" });
pon("aire", f(7).t("caja") - 0.05, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara se aleja" });
pon("muro", m3.cerrada + 0.1, { db: -12, que: "el cráneo se cierra como una caja" });
pon("late", f(7).t("cientificos") + 0.1, { db: -15, que: "las ondas de presión" });
pon("golpe-hondo", m3.presion + 0.05, { db: -11, que: "la presión empuja" });
pon("golpe", m3.duele + 0.02, { db: -8, que: "estalla el dolor" });

// el nervio
pon("aire", f(8).inicio + 0.1, { ancla: "empieza", db: -15, vel: 0.6, que: "la cámara baja al paladar" });
pon("clic", m4.aviso, { db: -12, que: "sale la chispa del paladar" });
pon("sube", m4.nervio - 0.1, { db: -12, que: "se enciende el nervio" });
pon("sube", f(8).t("tambien") + 0.1, { db: -14, vel: 1.1, que: "la chispa sube a la frente" });
pon("clic", m4.frente + 0.05, { db: -13, que: "la chispa llega a la frente" });
pon("tic", m4.confunde, { db: -14, que: "el cerebro duda" });
pon("tic", m4.confunde + 0.26, { db: -15, vel: 1.1, que: "duda" });
pon("tic", m4.confunde + 0.52, { db: -14, que: "duda" });
pon("golpe", m4.duele + 0.03, { db: -8, que: "duele la frente" });
pon("aire", f(9).t("no") + 0.1, { ancla: "empieza", db: -16, vel: 0.6, que: "la cámara se aleja" });
pon("late", f(10).t("dura") + 0.05, { db: -16, que: "el dolor late" });
pon("clic", m4.minuto - 0.05, { db: -12, que: "aparece el reloj" });
[0.6, 1.3, 2.0].forEach((d, i) => pon("tic", m4.minuto + d, { db: -17 + (i % 2), que: "el reloj se va llenando" }));
pon("aire", f(10).t("calienta") - 0.3, { ancla: "empieza", db: -15, vel: 0.5, que: "la boca se calienta" });
pon("estallido", m4.apaga + 0.05, { db: -16, lp: 900, reves: true, vel: 1.3, que: "todo se apaga" });

// la prisa
pon("aire", f(11).inicio + 0.12, { ancla: "empieza", db: -13, vel: 1.2, que: "sorbe rápido" });
pon("golpe", m5.duele1, { db: -11, que: "duele arriba" });
pon("golpe", m5.duele2, { db: -10, vel: 0.95, que: "duele otra vez arriba y una abajo" });
pon("clic", m5.duele2 + 0.12, { db: -13, que: "salen 27 % y 13 %" });
pon("late", m5.helado, { db: -13, que: "los dos granizados brillan; el =" });
pon("empujon", m5.prisa + 0.05, { db: -10, vel: 1.2, que: "rayas de velocidad" });
pon("golpe", m5.prisa + 0.15, { db: -12, que: "duele arriba en «prisa»" });

// el cierre: el botón, el apretón y el rebobinado
pon("pelota", m6.boton + 0.15, { db: -12, vel: 1.2, que: "el botón llega rebotando" });
pon("aire", m6.boton + 0.4, { ancla: "empieza", db: -16, vel: 0.8, que: "sube el pulgar" });
pon("toque", m6.aprieta, { db: -8, que: "el pulgar aprieta el botón" });
pon("clic", m6.aprieta + 0.12, { db: -11, que: "pasa a SIGUIENDO" });
pon("timbre", m6.aprieta + 0.2, { db: -16, vel: 1.1, que: "chispas" });
pon("empujon", m6.rebobina, { ancla: "empieza", db: -10, reves: true, vel: 1.3, que: "el video se rebobina" });

export default e;
