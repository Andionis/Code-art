// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-hook.js";
import { momentos as m2, ceros } from "./video/planos/02-zimbabue.js";
import { momentos as m3, panes, billetes as b3 } from "./video/planos/03-pueblo.js";
import { salen } from "./video/planos/04-imprime.js";
import { momentos as m5, billetes as b5 } from "./video/planos/05-doble.js";
import { momentos as m6 } from "./video/planos/06-inflacion.js";
import { momentos as m7, hojas } from "./video/planos/07-precios.js";
import { momentos as m8 } from "./video/planos/08-remate.js";
import { momentos as m9 } from "./video/planos/09-rebobina.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
// de una lista rápida, los que se oyen: sin dos en menos de 0,1 s
const espacia = (l, min = 0.11) => l.slice().sort((a, b) => a - b).filter((t, i, a) => i === 0 || t - a[i - 1] >= min);
const espaciados = (l, min) => { const out = []; for (const t of l.slice().sort((a, b) => a - b)) if (!out.length || t - out[out.length - 1] >= min) out.push(t); return out; };

// el hook: la cámara entra en la imprenta, los rodillos, la explosión
pon("empujon", 0.0, { ancla: "empieza", db: -9, vel: 1.1, que: "la cámara entra disparada entre billetes" });
pon("metal", m1.imprimen, { db: -11, vel: 0.9, que: "los rodillos dan el golpe" });
pon("aire", m1.imprimen + 0.4, { ancla: "empieza", db: -14, vel: 0.7, que: "el chorro de billetes" });
pon("papel", 1.6, { db: -15, vel: 1.1, que: "billetes que pasan" });
pon("estallido", m1.ricos, { db: -8, lp: 2500, corta: m1.fin - 0.05, que: "la explosión de billetes" });
pon("cash", m1.ricos + 0.12, { db: -11, que: "ka-ching en «ricos»" });
// Zimbabue: el billete entra y se llena de ceros
pon("desliza", m2.entra + 0.1, { db: -12, que: "entra el billete" });
espaciados(ceros, 0.14).forEach((t, i) => pon("clic", t, { db: -13 - (i % 2) * 2, vel: 0.9 + i * 0.03, que: "un cero más" }));
pon("aire", m2.aleja, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara se aleja" });
// el pueblo: panes, billetes y el cartel
espaciados(panes, 0.1).forEach((t, i) => pon("madera", t, { db: -14 - (i % 2) * 2, vel: 0.95 + (i % 3) * 0.06, que: "cae un pan" }));
espaciados(b3, 0.11).forEach((t, i) => pon("papel", t, { db: -15 - (i % 2), vel: 1 + (i % 3) * 0.08, que: "cae un billete" }));
pon("cuadro", m3.cartel, { db: -12, que: "baja el cartel" });
pon("aire", v.frase(4).inicio + 0.15, { ancla: "empieza", db: -14, vel: 0.7, que: "la cámara se acerca a la máquina" });
pon("metal", v.frase(4).t("maquina") + 0.05, { db: -15, vel: 1.2, que: "los rodillos giran" });
// la máquina imprime diez más
espaciados(salen, 0.11).forEach((t, i) => pon(i % 2 ? "tic" : "clic", t + 0.02, { db: -13, vel: 1 + i * 0.03, que: "sale un billete (+1)" }));
pon("aire", salen[4], { ancla: "empieza", db: -15, vel: 0.9, que: "los billetes vuelan" });
// el doble, el horno, el precio
espaciados(b5.filter((t) => t > v.frase(5).inicio + 0.05), 0.11).forEach((t, i) => pon("papel", t, { db: -15 - (i % 2), vel: 1 + (i % 3) * 0.08, que: "cae un billete nuevo" }));
pon("clic", m5.doble + 0.05, { db: -12, que: "«20 billetes»" });
pon("aire", m5.horno - 0.25, { ancla: "empieza", db: -14, vel: 0.8, que: "la cámara va al horno" });
pon("metal", m5.horno + 0.15, { db: -12, vel: 0.8, que: "sube la puerta del horno" });
pon("desliza", m5.pala, { db: -12, vel: 0.8, que: "sale la pala con los panes" });
pon("clic", v.frase(5).t("diez") + 0.05, { db: -12, que: "«10 panes»" });
pon("desliza", v.frase(5).t("panes") + 0.45, { db: -14, vel: 0.9, reves: true, que: "la pala vuelve al horno" });
pon("aire", v.frase(6).t("el") - 0.05, { ancla: "empieza", db: -15, vel: 0.8, que: "la cámara va al cartel" });
pon("sube", m5.sube, { db: -10, que: "la flecha roja sube" });
pon("aire", m5.dos - 0.7, { ancla: "empieza", db: -15, vel: 1.1, que: "el cartel gira" });
pon("cuadro", m5.dos, { db: -10, que: "«2 billetes»" });
pon("aire", v.frase(7).t("nadie") - 0.1, { ancla: "empieza", db: -15, vel: 0.7, que: "la cámara se aleja" });
pon("clic", v.frase(7).t("rico") + 0.05, { db: -13, que: "«10 panes» y «20 billetes»" });
pon("papel", m5.papel, { db: -12, que: "el fajo brilla: más papel" });
// la inflación: la máquina se descontrola
pon("aire", m6.inflacion, { ancla: "empieza", db: -12, vel: 0.9, que: "los rodillos aceleran" });
pon("cruje", m6.paras + 0.2, { db: -12, que: "la máquina se pone al rojo y tiembla" });
pon("empujon", m6.descontrola - 0.35, { ancla: "empieza", db: -10, que: "a punto de reventar" });
pon("estallido", m6.descontrola, { db: -7, lp: 2000, corta: m6.fin - 0.05, que: "revienta en billetes" });
// los precios: el calendario y el precio que corre
espaciados(hojas.filter((t) => t < m7.aleman), 0.15).forEach((t, i) => pon("tic", t + 0.03, { db: -13, vel: 1 + i * 0.05, que: "una hoja: el precio se duplica" }));
pon("papel", m7.aleman + 0.05, { db: -13, que: "el calendario vuelve a DIC 1922" });
pon("clic", v.frase(10).t("160") + 0.05, { db: -13, que: "160 marcos" });
espaciados(hojas.filter((t) => t > m7.aleman + 0.2), 0.15).forEach((t, i) => pon("tic", t + 0.03, { db: -14 + (i % 2), vel: 1 + i * 0.04, que: "un mes más" }));
pon("lingote", m7.monte + 0.6, { db: -14, vel: 1.1, que: "crece la montaña de billetes" });
pon("lingote", m7.monte + 1.4, { db: -12, que: "más billetes" });
pon("cash", m7.millones + 0.4, { db: -10, que: "200.000.000.000" });
pon("aire", m7.millones + 0.6, { ancla: "empieza", db: -15, vel: 0.6, que: "la cámara se aleja" });
// el remate y el cierre
pon("aire", v.frase(11).inicio + 0.1, { ancla: "empieza", db: -15, vel: 0.7, que: "billetes que caen" });
pon("sube", m8.riqueza, { db: -12, vel: 0.9, que: "el pan brilla" });
pon("empujon", m8.imprimir - 0.25, { ancla: "empieza", db: -11, que: "el diluvio de billetes" });
pon("papel", m8.imprimir + 0.8, { db: -14, que: "billetes" });
pon("clic", m8.pan, { db: -12, que: "el pan sigue siendo uno" });
pon("papel", m8.pan + 0.9, { db: -15, vel: 1.1, que: "billetes" });
pon("aire", m8.cada, { ancla: "empieza", db: -12, vel: 1.1, que: "llega el billete grande" });
pon("aire", m8.menos, { ancla: "empieza", db: -12, vel: 0.5, reves: true, que: "el billete se encoge y se apaga" });
pon("aire", v.frase(12).inicio, { ancla: "empieza", db: -15, vel: 0.5, que: "la cámara se aleja, la lluvia se calma" });
pon("clic", v.frase(12).t("amigo"), { db: -15, vel: 0.9, que: "el cierre" });
pon("empujon", m9.empieza + 0.12, { ancla: "empieza", db: -11, vel: 1.4, reves: true, corta: v.duracion, que: "el vídeo rebobina" });
pon("tic", m9.empieza + 0.3, { db: -15, vel: 1.6, que: "la cinta" });
pon("tic", m9.empieza + 0.45, { db: -15, vel: 1.8, que: "la cinta" });

void espacia;
export default e;
