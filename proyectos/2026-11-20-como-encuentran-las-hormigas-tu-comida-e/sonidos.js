// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";
import { T, momentos } from "./video/historia.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const pasos = (t0, t1, cada, db = -18) => { for (let t = t0, i = 0; t < t1; t += cada, i++) pon("tic", t, { db: db - (i % 2) * 2, lp: 6000, vel: i % 2 ? 0.9 : 1.05, que: "patitas" }); };

// 1. el hook: la cámara sale disparada de la cara de la hormiga
pon("aire", 0, { ancla: "empieza", db: -8, vel: 0.75, que: "la cámara se aleja deprisa" });
pasos(0.15, 1.4, 0.22, -17);
pon("clic", v.t("hormigas") + 0.05, { db: -15, que: "se ve la fila entera" });
pasos(1.9, 2.9, 0.3, -19);
// 2. el tiempo va hacia atrás; entra la exploradora
pon("empujon", momentos.rebobina + 1.4, { reves: true, db: -9, que: "todas vuelven de espaldas al hueco" });
pon("aire", momentos.rebobina + 0.1, { ancla: "empieza", reves: true, db: -12, vel: 0.8, que: "rebobina" });
pon("aire", v.t("encontro") - 0.05, { ancla: "empieza", db: -14, vel: 0.8, que: "la cámara va hacia ella" });
pon("clic", momentos.sola + 0.15, { db: -11, que: "el anillo: una sola" });
pasos(momentos.sola + 0.45, momentos.llega, 0.28, -17);
pon("clic", momentos.llega, { db: -14, vel: 0.9, que: "toca la concha" });
// 3. sus antenas y el olor del azúcar
pon("aire", T.f3, { ancla: "empieza", db: -12, vel: 0.7, que: "la cámara entra a su cabeza" });
pon("sube", T.huele + 0.1, { db: -13, que: "sube el olor del azúcar" });
pon("sube", T.azucar + 0.3, { db: -15, vel: 1.1, que: "más olor" });
for (const [i, t] of [T.narices, T.narices + 0.45, T.narices + 0.9, T.narices + 1.3].entries()) pon("tic", t, { db: -18, vel: 1.2 + 0.1 * (i % 2), que: "las antenas" });
// 4. muerde, se da la vuelta, la punta toca el piso
pon("aprieta", T.poquito, { db: -11, que: "muerde un trocito" });
pon("aire", T.vuelve, { ancla: "empieza", db: -14, vel: 0.9, que: "se da la vuelta" });
for (const [i, t] of [T.tocando + 0.15, T.tocando + 0.6, T.punta + 0.15, T.punta + 0.75].entries()) pon("late", t, { db: i === 2 ? -9 : -15, que: "una gota de olor" });
// 5. el rastro, las migas, invisibles
pon("aire", T.f4fin - 0.4, { ancla: "empieza", db: -14, vel: 0.5, que: "la cámara se aleja con ella" });
pon("clic", T.rastro + 0.1, { db: -14, que: "el rastro" });
for (const [i, t] of [T.migas, T.migas + 0.25, T.migas + 0.55].entries()) pon("tic", t, { db: -15 - i, lp: 5000, que: "migas de pan" });
pon("aire", T.invisibles, { reves: true, db: -14, vel: 0.8, que: "se vuelve invisible" });
// 6. la fila sale y sigue el rastro
pon("aire", T.f6 + 0.1, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara baja con la fila" });
pon("sube", T.huelen + 0.1, { db: -15, que: "el rastro se enciende" });
pasos(T.siguen, T.comida6, 0.25, -17);
pon("clic", T.comida6 + 0.1, { db: -13, que: "llega a la concha" });
// 7. vuelve cargada, marca; más fuerte
pon("aire", T.f7, { ancla: "empieza", db: -12, vel: 0.8, que: "la cámara va a la que vuelve" });
pasos(T.f7 + 0.6, T.marca, 0.3, -18);
pon("late", T.marca + 0.05, { db: -11, que: "marca" });
pon("late", T.vez + 0.05, { db: -13, que: "otra vez" });
pon("aire", T.vez + 0.3, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara se aleja" });
pon("empujon", T.fuerte + 0.08, { db: -8, que: "el rastro brilla más fuerte" });
pasos(T.llegan, T.f7fin + 0.3, 0.2, -18);
// 8. dos caminos: gana el corto
pon("clic", T.dos + 0.1, { db: -13, que: "dos caminos" });
pon("clic", T.corto + 0.05, { db: -11, vel: 1.1, que: "el corto se enciende" });
pon("aire", T.rapido, { db: -15, vel: 1.1, que: "más rápido" });
pon("late", T.marca8 + 0.05, { db: -11, que: "se marca más" });
pon("late", T.huele8 + 0.1, { db: -9, que: "huele más" });
pon("sube", T.huele8 + 0.25, { db: -15, que: "brilla el corto" });
// 9. se acaba la comida; el rastro se borra
pon("aprieta", T.acaba + 0.2, { db: -11, que: "se comen la concha" });
pon("aprieta", T.comida9 + 0.3, { db: -13, vel: 1.15, que: "las últimas migas" });
pon("aire", T.nadie, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara se aleja" });
pasos(T.nadie + 0.8, T.borra - 0.3, 0.3, -19);
pon("aire", T.borra + 0.2, { reves: true, db: -12, vel: 0.7, que: "el rastro se borra" });
// 10. la colonia, una sola, todas detrás
pon("aire", T.f10, { ancla: "empieza", db: -12, vel: 0.7, que: "la cámara va al hueco" });
pasos(T.colonia - 0.2, T.encontro10b + 0.2, 0.18, -17);
pon("clic", T.sola10 + 0.15, { db: -11, que: "el anillo: una sola" });
pon("sube", T.conto + 0.1, { db: -12, que: "el olor llega a todas" });
pasos(T.todas, T.f10fin, 0.16, -17);
pon("late", T.olor10 + 0.1, { db: -9, que: "olor" });
// 11. la cámara entra hasta su cara
pon("empujon", T.f11 + 1.9, { db: -10, que: "la cámara entra hasta su cara" });
pasos(T.f11 + 2.2, v.duracion - 0.2, 0.35, -19);

export default e;
