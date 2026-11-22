// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-hook.js";
import { momentos as m2 } from "./video/planos/02-gota.js";
import { momentos as m3 } from "./video/planos/03-roca.js";
import { sacudidas } from "./video/planos/04-cocina.js";
import { momentos as m5 } from "./video/planos/05-ciclo.js";
import { momentos as m6 } from "./video/planos/06-fondo.js";
import { momentos as m7 } from "./video/planos/07-tiempo.js";
import { momentos as m8 } from "./video/planos/08-jarra.js";
import { momentos as m9 } from "./video/planos/09-tierra.js";
import { momentos as m10 } from "./video/planos/10-edificio.js";
import { momentos as m11 } from "./video/planos/11-final.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });

// 1. el hook: el vuelo sobre las olas, la ola que revienta, la sal en el cristal, el río, la lluvia y la gota
pon("aire", 0, { ancla: "empieza", db: -9, vel: 0.9, que: "el vuelo a ras de las olas" });
pon("empujon", m1.ola, { db: -6, que: "la ola revienta contra la pantalla" });
pon("cristal", m1.escurre + 0.1, { db: -14, vel: 1.1, que: "se pegan los cristales de sal" });
pon("cristal", m1.escurre + 0.35, { db: -16, vel: 1.25, que: "otro cristal" });
pon("aire", m1.rios - 0.3, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara sube y ve el río" });
pon("sube", m1.dulce + 0.1, { db: -15, que: "el río brilla" });
pon("aire", m1.nubes - 0.2, { ancla: "empieza", db: -13, vel: 0.6, que: "la cámara mira al cielo; entran las nubes" });
pon("tierra", m1.lluvia, { db: -15, vel: 1.3, lp: 5000, que: "empieza a llover" });
pon("aire", m1.gota, { ancla: "empieza", db: -11, vel: 1.1, que: "la gota llega a la cámara" });

// 2. la gota, la roca y el salero
pon("aire", v.frase(3).inicio + 0.5, { ancla: "empieza", db: -15, vel: 0.5, que: "cae con la gota" });
pon("aire", m2.aire - 0.5, { ancla: "empieza", db: -12, vel: 0.7, que: "entran los hilos de aire" });
pon("aprieta", m2.acida + 0.05, { db: -14, vel: 1.2, que: "la gota se vuelve ácida" });
[0, 0.25, 0.5, 0.75].forEach((d, i) => pon("sube", m2.gas + d, { db: -15 - (i % 2), vel: 1.2 + 0.1 * i, que: "burbujas de gas" }));
m3.golpes.slice().sort((a, b) => a - b).filter((t, i, l) => i === 0 || t - l[i - 1] > 0.25).slice(0, 12)
  .forEach((t, i) => pon(i === 0 ? "golpe" : "tierra", i === 0 ? t + 0.1 : t, { db: i === 0 ? -9 : -17 + (i % 2), vel: 1.4 + 0.1 * (i % 3), lp: 6000, que: "gota contra la roca" }));
pon("roca", m3.arranca, { db: -10, que: "saltan los granos de la roca" });
pon("roca", m3.arranca + 0.35, { db: -14, vel: 1.2, que: "más granos" });
pon("aire", v.frase(5).inicio, { ancla: "empieza", db: -12, vel: 0.6, que: "la cámara entra hacia el cristal de sal" });
pon("cristal", m3.sal, { db: -11, que: "el cristal de sal brilla" });
sacudidas.forEach((t, i) => i % 2 === 0 && pon("tic", t + 0.12, { db: -15 + (i % 4 ? 1 : 0), lp: 6000, vel: 1 + 0.05 * (i % 3), que: "el salero traquetea" }));

// 3. el río, el sol, el vapor y la lluvia
pon("aire", v.frase(6).inicio + 0.15, { ancla: "empieza", db: -12, vel: 0.5, que: "la cámara va con el río" });
pon("aire", m5.poquita - 0.4, { ancla: "empieza", db: -14, vel: 0.6, que: "baja hasta el agua" });
pon("cristal", m5.poquita + 0.4, { db: -17, vel: 1.2, que: "un granito en el agua" });
pon("aire", v.frase(7).inicio, { ancla: "empieza", db: -11, vel: 0.6, que: "sale sobre el mar" });
pon("sube", m5.sol + 0.2, { db: -14, vel: 0.8, que: "el sol calienta" });
[0, 0.5, 1.0, 1.5].forEach((d, i) => pon("sube", m5.evapora + d, { db: -15 - (i % 2), vel: 0.9 + 0.1 * i, que: "sube el vapor" }));
pon("cristal", m5.queda + 0.1, { db: -11, que: "brillan los granos que se quedan" });
pon("aire", v.frase(8).inicio, { ancla: "empieza", db: -12, vel: 0.5, que: "la cámara sube con el vapor" });
pon("sube", m5.nubes, { db: -14, vel: 0.7, que: "se forman las nubes" });
pon("tierra", m5.lluvia + 0.1, { db: -15, vel: 1.3, lp: 5000, que: "llueve sobre las montañas" });
pon("cristal", m5.mas + 0.1, { db: -13, vel: 1.1, que: "el río baja con más sal" });

// 4. el fondo del mar
pon("empujon", m6.zambulle, { db: -9, vel: 0.9, que: "la cámara se mete en el mar" });
pon("aire", m6.zambulle + 0.4, { ancla: "empieza", db: -15, vel: 0.5, lp: 2500, que: "baja a lo oscuro" });
pon("estallido", m6.volcanes + 0.05, { db: -12, lp: 1400, vel: 0.8, que: "aparecen los volcanes" });
pon("roca", m6.grietas + 0.05, { db: -14, vel: 0.8, que: "se encienden las grietas" });
pon("empujon", m6.escupen + 0.15, { db: -11, vel: 0.7, lp: 2500, que: "escupen el humo" });
[0, 0.3, 0.6].forEach((d, i) => pon("sube", m6.hirviendo + d, { db: -15, vel: 1.3 + 0.1 * i, que: "burbujas hirviendo" }));
pon("cristal", m6.minerales + 0.1, { db: -13, que: "suben los minerales" });

// 5. millones de años, la jarra, la Tierra y el edificio
m7.dias.forEach((t, i) => pon("aire", t, { db: -14 - (i % 2), vel: 0.8 + 0.15 * i, que: "pasa un día" }));
pon("clic", v.frase(10).t("litro") + 0.05, { db: -13, que: "aparece «1 litro»" });
m8.vuelca.forEach((t, i) => { pon("metal", t - 0.12, { db: -15, vel: 1.2, que: "la cuchara llega" }); pon("tic", t + 0.25, { db: -13, lp: 6000, vel: 0.9 + 0.1 * i, que: "la sal cae al agua" }); });
pon("aire", v.frase(11).inicio + 0.1, { ancla: "empieza", db: -13, vel: 0.7, que: "entra la Tierra" });
pon("sube", m9.sube, { db: -12, que: "la sal sale de los mares" });
pon("aire", m9.cae, { ancla: "empieza", db: -14, vel: 0.7, que: "la sal vuelve a caer" });
pon("cristal", m9.blanco + 0.1, { db: -12, que: "los continentes se vuelven blancos" });
pon("aire", v.frase(11).t("capa") + 0.12, { ancla: "empieza", db: -12, vel: 0.7, que: "la sal empieza a subir" });
pon("sube", v.frase(11).t("haria"), { db: -16, vel: 0.8, que: "la Tierra blanca gira" });
pon("empujon", m10.frena, { db: -9, vel: 0.8, que: "la pared de sal sube y frena" });
pon("muro", m10.frena + 0.05, { db: -13, que: "la sal se para arriba" });
pon("clic", m10.cuarenta + 0.05, { db: -12, que: "aparecen «40 pisos» y «+150 m»" });

// 6. el remate y el botón
pon("aire", v.frase(12).inicio + 0.15, { ancla: "empieza", db: -13, vel: 0.5, que: "el mar con lluvia" });
pon("sube", v.frase(12).t("dulce") + 0.15, { db: -15, que: "el río brilla" });
pon("aire", m11.cae - 0.5, { ancla: "empieza", db: -14, vel: 0.9, que: "cae la gota grande" });
pon("golpe", m11.cae, { db: -10, lp: 5000, que: "la gota revienta en el mar" });
pon("aire", m11.boton, { ancla: "empieza", db: -13, vel: 1.0, que: "entra el botón" });
pon("toque", m11.aprieta, { db: -9, que: "el pulgar aprieta Seguir" });
pon("clic", m11.aprieta + 0.12, { db: -12, que: "cambia a Siguiendo" });
pon("sube", m11.aprieta + 0.5, { db: -16, vel: 0.8, que: "el anillo de luz" });

export default e;
