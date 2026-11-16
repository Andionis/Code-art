// «Primero rentaron una casa cerca del banco y la disfrazaron de tienda de pasto sintético.
//  Así, los sacos de tierra que salían todos los días no le parecían raros a nadie.»
// La calle, de día, con una sola cámara.
// - «Primero»: la casa, normal, con su letrero «SE RENTA» en la ventana; «rentaron»: el letrero se cae.
// - «cerca del banco»: la cámara se abre y sube: detrás, el edificio enorme del Banco Central.
// - «disfrazaron»: cae un letrero verde «PASTO SINTÉTICO», la casa se pinta de verde y salen rollos de pasto.
// - «sacos de tierra»: salen sacos por la puerta y saltan a la camioneta; la pila crece.
// - «todos los días»: el cielo pasa de día a noche y otra vez a día, dos veces; la pila sigue creciendo.
// - «a nadie»: dos personas pasan por la vereda sin mirar. Reposa.
import * as k from "#kit";
import { v } from "#voz";
import { cubo, pinta, aCam, velo } from "../mundo.js";
import { sombraContacto } from "#piezas/objetos.js";

export const desde = "primero";
export const entrada = "corte";

const { suave: su, tramo: tr, mez, mezV, azar, CX, CY, F } = k;
const f3 = v.frase(3), f4 = v.frase(4);
const Tren = f3.t("rentaron"), Tcer = f3.t("cerca"), Tban = f3.t("banco"), Tdis = f3.t("disfrazaron"), Tpas = f3.t("pasto");
const Tsac = f4.t("sacos"), Ttod = f4.t("todos"), Tdia = f4.t("dias"), Tno = f4.t("no"), Tnad = f4.t("nadie");
const Tdias0 = Ttod - 0.1, Tdias1 = Tno + 0.25; // el tiempo pasa: dos días en ese tramo

// ---------------------------------------------------------------- la cámara
function camara(t) {
  const A = { pos: [-0.9, 1.9, 8.2], mira: [-0.9, 1.9, 0] };
  const B = { pos: [0.6, 3.6, 14.5], mira: [2.0, 5.6, -6] };
  const C = { pos: [-1.1, 2.1, 9.8], mira: [-0.2, 3.4, -2] };
  const u1 = su(tr(t, Tcer - 0.15, Tban + 0.35)), u2 = su(tr(t, Tdis - 0.3, Tdis + 0.5));
  let pos = mezV(mezV(A.pos, B.pos, u1), C.pos, u2), mi = mezV(mezV(A.mira, B.mira, u1), C.mira, u2);
  // se acerca despacio desde el principio (nunca quieta)
  pos = [pos[0] + 0.35 * su(tr(t, Tpas - 0.2, Tsac + 0.3)), pos[1] - 0.15 * su(tr(t, Tpas - 0.2, Tsac)), pos[2] - 0.5 * tr(t, f3.inicio, f4.fin) - 0.7 * su(tr(t, Tpas - 0.2, Tsac + 0.3))];
  return k.mira(pos, mi);
}

// ---------------------------------------------------------------- el mundo de la calle
const CASA = { x: [-3.4, 0.6], y: [0, 3.0], z: [-3, 0] };
const BANCO = { x: [0.9, 9.2], y: [0, 15], z: [-22, -10] };
const fijas = [];
// el suelo: la vereda, la calle de asfalto y la vereda de enfrente
fijas.push({ p: [[-30, 0, 0], [30, 0, 0], [30, 0, 1.8], [-30, 0, 1.8]], c: [196, 190, 176] });
fijas.push({ p: [[-30, 0, 1.8], [30, 0, 1.8], [30, 0, 9], [-30, 0, 9]], c: [72, 74, 80] });
fijas.push({ p: [[-30, 0, 9], [30, 0, 9], [30, 0, 40], [-30, 0, 40]], c: [190, 184, 170] });
for (let x = -28; x < 28; x += 3) fijas.push({ p: [[x, 0.005, 5.3], [x + 1.6, 0.005, 5.3], [x + 1.6, 0.005, 5.5], [x, 0.005, 5.5]], c: [235, 220, 120], sesgo: 0.3 });
fijas.push({ p: [[-30, 0, -30], [30, 0, -30], [30, 0, 0], [-30, 0, 0]], c: [176, 170, 154] }); // detrás, otra calle
// el banco: un edificio alto de vidrio azul y concreto claro
fijas.push(...cubo([(BANCO.x[0] + BANCO.x[1]) / 2, 7.5, (BANCO.z[0] + BANCO.z[1]) / 2], [BANCO.x[1] - BANCO.x[0], 15, BANCO.z[1] - BANCO.z[0]], { frente: [228, 226, 218], arriba: [200, 198, 192], izquierda: [210, 208, 200], derecha: [190, 188, 180] }));
for (let y = 1.4; y < 14.2; y += 1.25) for (let x = BANCO.x[0] + 0.5; x < BANCO.x[1] - 0.6; x += 1.05) {
  fijas.push({ p: [[x, y, BANCO.z[1] + 0.02], [x + 0.75, y, BANCO.z[1] + 0.02], [x + 0.75, y + 0.85, BANCO.z[1] + 0.02], [x, y + 0.85, BANCO.z[1] + 0.02]], c: [60, 130, 190], sesgo: 0.5, vidrio: true });
}
for (let y = 1.4; y < 14.2; y += 1.25) for (let z = BANCO.z[0] + 0.5; z < BANCO.z[1] - 0.6; z += 1.05) {
  fijas.push({ p: [[BANCO.x[0] - 0.02, y, z], [BANCO.x[0] - 0.02, y, z + 0.75], [BANCO.x[0] - 0.02, y + 0.85, z + 0.75], [BANCO.x[0] - 0.02, y + 0.85, z]], c: [50, 112, 170], sesgo: 0.5, vidrio: true });
}
// otros edificios bajos del barrio, a los lados
const azB = azar(77);
for (const [x0, x1, h, z0] of [[-14, -8, 5, -14], [-8, -4, 3.4, -6], [12, 18, 7, -14], [-22, -15, 9, -20]]) {
  const col = [[230, 196, 150], [214, 170, 140], [196, 210, 220], [236, 214, 170]][Math.floor(azB() * 4)];
  fijas.push(...cubo([(x0 + x1) / 2, h / 2, z0 - 2], [x1 - x0, h, 4], col));
}

// la casa: paredes, techo plano con su pretil, la puerta y la ventana
function casa(t) {
  const verde = su(tr(t, Tdis + 0.15, Tdis + 0.6));
  const pared = [mez(238, 120, verde), mez(214, 206, verde), mez(170, 120, verde)];
  const c = [];
  c.push(...cubo([-1.4, 1.5, -1.5], [4, 3, 3], { frente: pared, izquierda: pared.map((x) => x * 0.9), derecha: pared.map((x) => x * 0.85), arriba: [200, 190, 170] }));
  c.push(...cubo([-1.4, 3.1, -1.5], [4.2, 0.2, 3.2], [250, 248, 240]));
  // la puerta (por donde salen los sacos) y la ventana
  c.push({ p: [[-0.7, 0, 0.02], [0.2, 0, 0.02], [0.2, 2.1, 0.02], [-0.7, 2.1, 0.02]], c: [104, 66, 40], sesgo: 0.3, borde: "rgba(40,20,10,0.7)" });
  c.push({ p: [[-0.6, 0, 0.03], [0.1, 0, 0.03], [0.1, 1.95, 0.03], [-0.6, 1.95, 0.03]], c: [26, 18, 14], sesgo: 0.32, al: su(tr(t, Tsac - 0.6, Tsac - 0.2)) }); // abierta
  c.push({ p: [[-2.9, 1.0, 0.02], [-1.4, 1.0, 0.02], [-1.4, 2.2, 0.02], [-2.9, 2.2, 0.02]], c: [120, 170, 200], sesgo: 0.3, borde: "rgba(250,250,250,0.9)", vidrio: true });
  return c;
}

// la camioneta, estacionada delante, con la caja hacia la puerta
const CAM = { x: 1.1, z: 2.5 };
function camioneta() {
  const c = [], R = [210, 40, 36];
  c.push(...cubo([CAM.x + 2.6, 1.0, CAM.z], [1.6, 1.0, 1.8], R));          // el motor
  c.push(...cubo([CAM.x + 1.5, 1.5, CAM.z], [1.2, 1.4, 1.8], R));          // la cabina
  c.push({ p: [[CAM.x + 2.06, 1.45, CAM.z + 0.91], [CAM.x + 1.0, 1.45, CAM.z + 0.91], [CAM.x + 1.0, 2.1, CAM.z + 0.91], [CAM.x + 1.9, 2.1, CAM.z + 0.91]].reverse(), c: [150, 200, 230], sesgo: 0.2, vidrio: true });
  c.push(...cubo([CAM.x - 0.2, 0.62, CAM.z], [2.2, 0.24, 1.8], [150, 30, 28])); // el piso de la caja
  for (const [dx, dz, w, d] of [[0, 0.86, 2.2, 0.08], [0, -0.86, 2.2, 0.08], [-1.26, 0, 0.08, 1.8]]) c.push(...cubo([CAM.x - 0.2 + dx, 0.95, CAM.z + dz], [w, 0.5, d], R));
  return c;
}
function ruedas(g, cam, luz) {
  for (const x of [CAM.x - 0.6, CAM.x + 2.6]) {
    const P = aCam(cam, [x, 0.42, CAM.z + 0.92]); if (P[2] < 0.1) continue;
    const X = CX + (F * P[0]) / P[2], Y = CY - (F * P[1]) / P[2], r = (F * 0.42) / P[2];
    g.fillStyle = `rgb(${Math.round(24 * luz)},${Math.round(24 * luz)},${Math.round(28 * luz)})`; g.beginPath(); g.arc(X, Y, r, 0, 6.283); g.fill();
    g.fillStyle = `rgb(${Math.round(170 * luz)},${Math.round(172 * luz)},${Math.round(178 * luz)})`; g.beginPath(); g.arc(X, Y, r * 0.45, 0, 6.283); g.fill();
  }
}

// los sacos: salen por la puerta, saltan a la caja y se apilan
const azS = azar(4040);
const NS = 18;
const SACOS = Array.from({ length: NS }, (_, i) => {
  const t0 = i < 4 ? mez(Tsac - 0.45, Tsac + 0.7, i / 4) : mez(Tsac + 0.75, Tdias1 - 0.4, (i - 4) / (NS - 5));
  const capa = Math.floor(i / 6), j = i % 6;
  return { t0, dest: [CAM.x - 0.95 + (j % 3) * 0.62, 0.95 + capa * 0.38, CAM.z - 0.42 + Math.floor(j / 3) * 0.84], gira: (azS() - 0.5) * 0.6, sem: azS() };
});
function saco(g, x, y, r, ang, luz) {
  g.save(); g.translate(x, y); g.rotate(ang);
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r * 1.3);
  gr.addColorStop(0, `rgb(${Math.round(232 * luz)},${Math.round(204 * luz)},${Math.round(150 * luz)})`); gr.addColorStop(1, `rgb(${Math.round(150 * luz)},${Math.round(116 * luz)},${Math.round(72 * luz)})`);
  g.fillStyle = gr; g.beginPath();
  g.moveTo(-r * 0.9, r * 0.6); g.quadraticCurveTo(-r * 1.1, -r * 0.5, -r * 0.35, -r * 0.75); g.lineTo(-r * 0.15, -r * 1.05); g.lineTo(r * 0.15, -r * 1.05); g.lineTo(r * 0.35, -r * 0.75);
  g.quadraticCurveTo(r * 1.1, -r * 0.5, r * 0.9, r * 0.6); g.quadraticCurveTo(0, r * 0.95, -r * 0.9, r * 0.6); g.closePath(); g.fill();
  g.strokeStyle = `rgba(90,60,30,0.7)`; g.lineWidth = Math.max(1, r * 0.08); g.stroke();
  g.beginPath(); g.moveTo(-r * 0.3, -r * 0.72); g.lineTo(r * 0.3, -r * 0.72); g.stroke(); // el amarre
  // la tierra que asoma arriba
  g.fillStyle = `rgb(${Math.round(150 * luz)},${Math.round(76 * luz)},${Math.round(40 * luz)})`; g.beginPath(); g.ellipse(0, -r * 1.02, r * 0.17, r * 0.07, 0, 0, 6.283); g.fill();
  g.restore();
}
function sacos(t, cam, luz) {
  const cosas = [];
  for (const s of SACOS) {
    if (t < s.t0) continue;
    const u = tr(t, s.t0, s.t0 + 0.55), w = su(u);
    const A = [-0.25, 0.45, 0.3], B = s.dest;
    const p = [mez(A[0], B[0], w), mez(A[1], B[1], w) + 1.3 * Math.sin(Math.PI * w), mez(A[2], B[2], w)];
    const P = aCam(cam, p); if (P[2] < 0.1) continue;
    const r = (F * 0.3) / P[2], ang = s.gira * w + Math.sin(u * Math.PI) * 0.8 * (s.sem - 0.5);
    cosas.push({ z: P[2], dibuja: (g) => saco(g, CX + (F * P[0]) / P[2], CY - (F * P[1]) / P[2], r, ang, luz * (u < 1 ? 1 : 0.92)) });
  }
  return cosas;
}

// los rollos de pasto delante de la casa
const ROLLOS = [[-3.0, 0.3, 0.9], [-2.2, 0.3, 0.95], [-2.6, 0.82, 0.9], [-3.2, 0.3, 1.55], [-2.4, 0.3, 1.55]];
function rollos(g, t, cam, luz) {
  ROLLOS.forEach(([x, y, z], i) => {
    const t0 = Tdis + 0.55 + i * 0.16, u = k.entra(tr(t, t0, t0 + 0.35));
    if (u <= 0) return;
    const yy = y + (1 - u) * 1.5;
    const A = aCam(cam, [x - 0.4, yy, z]), B = aCam(cam, [x + 0.4, yy, z]);
    if (A[2] < 0.1 || B[2] < 0.1) return;
    const ax = CX + (F * A[0]) / A[2], ay = CY - (F * A[1]) / A[2], bx = CX + (F * B[0]) / B[2], by = CY - (F * B[1]) / B[2], r = (F * 0.28) / A[2];
    const L = (c) => Math.round(c * luz);
    const gr = g.createLinearGradient(ax, ay - r, ax, ay + r);
    gr.addColorStop(0, `rgb(${L(140)},${L(230)},${L(90)})`); gr.addColorStop(0.5, `rgb(${L(70)},${L(180)},${L(50)})`); gr.addColorStop(1, `rgb(${L(30)},${L(110)},${L(30)})`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(ax, ay - r); g.lineTo(bx, by - r); g.lineTo(bx, by + r); g.lineTo(ax, ay + r); g.closePath(); g.fill();
    // la punta: la espiral del rollo
    g.fillStyle = `rgb(${L(60)},${L(150)},${L(40)})`; g.beginPath(); g.ellipse(bx, by, r * 0.38, r, 0, 0, 6.283); g.fill();
    g.strokeStyle = `rgba(20,70,20,0.8)`; g.lineWidth = Math.max(1, r * 0.06); g.beginPath();
    for (let a = 0; a < 14; a += 0.3) { const rr = (r * (a / 14)) * 0.95; g.lineTo(bx + Math.cos(a) * rr * 0.38, by + Math.sin(a) * rr); } g.stroke();
    // las hojitas del pasto, arriba
    g.strokeStyle = `rgba(${L(170)},${L(250)},${L(120)},0.8)`; g.lineWidth = Math.max(1, r * 0.05); g.beginPath();
    for (let q = 0; q < 14; q++) { const x0 = mez(ax, bx, q / 14), y0 = mez(ay, by, q / 14) - r; g.moveTo(x0, y0); g.lineTo(x0 + r * 0.05, y0 - r * 0.16); } g.stroke();
  });
}

// texto en una cara del mundo: A arriba-izq, B arriba-der, D abajo-izq
function textoEnCara(g, cam, A, B, D, texto, o = {}) {
  const a = aCam(cam, A), b = aCam(cam, B), d = aCam(cam, D);
  if (a[2] < 0.1 || b[2] < 0.1 || d[2] < 0.1) return;
  const pa = [CX + (F * a[0]) / a[2], CY - (F * a[1]) / a[2]], pb = [CX + (F * b[0]) / b[2], CY - (F * b[1]) / b[2]], pd = [CX + (F * d[0]) / d[2], CY - (F * d[1]) / d[2]];
  const W = 1000, H = o.alto || 200;
  g.save(); g.transform((pb[0] - pa[0]) / W, (pb[1] - pa[1]) / W, (pd[0] - pa[0]) / H, (pd[1] - pa[1]) / H, pa[0], pa[1]);
  g.font = `900 ${o.letra || 120}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  if (o.sombra) { g.shadowColor = o.sombra; g.shadowBlur = 20; }
  g.fillStyle = o.color || "#fff"; g.fillText(texto, W / 2, H / 2 + 6, W * 0.94);
  g.restore();
}

// ---------------------------------------------------------------- el cielo y el paso de los días
function dia(t) { // 1 = mediodía, 0 = noche
  const u = tr(t, Tdias0, Tdias1);
  if (u <= 0 || u >= 1) return 1;
  return 0.5 + 0.5 * Math.cos(u * 2 * 2 * Math.PI);
}
function cielo(g, t, d) {
  const gr = g.createLinearGradient(0, 0, 0, 1300);
  gr.addColorStop(0, `rgb(${mez(10, 40, d)},${mez(16, 140, d)},${mez(48, 230, d)})`);
  gr.addColorStop(1, `rgb(${mez(60, 190, d)},${mez(40, 225, d)},${mez(90, 250, d)})`);
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // el sol cruza el cielo cada día
  const u = tr(t, Tdias0, Tdias1), fase = (u * 2) % 1;
  const sx = u > 0 && u < 1 ? mez(-100, 1180, fase) : 820, sy = u > 0 && u < 1 ? 520 - 300 * Math.sin(fase * Math.PI) : 300;
  k.brillo(g, sx, sy, 700, "255,236,170", 0.9 * d);
  g.fillStyle = `rgba(255,250,220,${d})`; g.beginPath(); g.arc(sx, sy, 46, 0, 6.283); g.fill();
  // de noche, la luna y estrellas
  if (d < 0.6) {
    const n = 1 - d / 0.6;
    g.fillStyle = `rgba(240,244,255,${0.9 * n})`; g.beginPath(); g.arc(mez(1180, -100, fase), 560 - 260 * Math.sin(fase * Math.PI), 34, 0, 6.283); g.fill();
    const az = azar(9);
    for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${n * (0.3 + 0.6 * az())})`; g.fillRect(az() * 1080, az() * 1100, 3, 3); }
  }
}

// ---------------------------------------------------------------- las dos personas que pasan
function persona(g, cam, x, z, fase, luz, ropa) {
  const pies = aCam(cam, [x, 0, z]), cab = aCam(cam, [x, 1.68, z]);
  if (pies[2] < 0.1) return null;
  return {
    z: pies[2], dibuja: (gg) => {
      const X = CX + (F * pies[0]) / pies[2], Y = CY - (F * pies[1]) / pies[2], Yc = CY - (F * cab[1]) / cab[2], h = Y - Yc, L = (c) => Math.round(c * luz);
      gg.save(); gg.lineCap = "round";
      // piernas
      gg.strokeStyle = `rgb(${L(40)},${L(46)},${L(70)})`; gg.lineWidth = h * 0.09;
      const p = Math.sin(fase) * h * 0.13;
      gg.beginPath(); gg.moveTo(X, Y - h * 0.47); gg.lineTo(X + p, Y); gg.moveTo(X, Y - h * 0.47); gg.lineTo(X - p, Y); gg.stroke();
      // cuerpo
      gg.strokeStyle = `rgb(${L(ropa[0])},${L(ropa[1])},${L(ropa[2])})`; gg.lineWidth = h * 0.2;
      gg.beginPath(); gg.moveTo(X, Y - h * 0.5); gg.lineTo(X, Y - h * 0.8); gg.stroke();
      // brazos
      gg.lineWidth = h * 0.07; gg.beginPath(); gg.moveTo(X, Y - h * 0.78); gg.lineTo(X - p * 0.8, Y - h * 0.52); gg.moveTo(X, Y - h * 0.78); gg.lineTo(X + p * 0.8, Y - h * 0.52); gg.stroke();
      // cabeza
      gg.fillStyle = `rgb(${L(190)},${L(140)},${L(105)})`; gg.beginPath(); gg.arc(X, Y - h * 0.9, h * 0.085, 0, 6.283); gg.fill();
      gg.fillStyle = `rgb(${L(40)},${L(28)},${L(20)})`; gg.beginPath(); gg.arc(X, Y - h * 0.93, h * 0.085, Math.PI, 0); gg.fill();
      gg.restore();
    },
  };
}

// ---------------------------------------------------------------- el dibujo
export function dibuja(g, t) {
  const cam = camara(t), d = dia(t), luz = mez(0.38, 1, d);
  cielo(g, t, d);
  pinta(g, cam, fijas.slice(0, 5), () => [luz, luz, luz], { lejos: 80 });
  sombraContacto(g, cam, { x: [-3.4, 0.6], z: [-3, 0.5], y: 0.01 }, { al: 0.45 * d, corre: [0.9, 0] });
  sombraContacto(g, cam, { x: [CAM.x - 1.3, CAM.x + 3.4], z: [CAM.z - 0.9, CAM.z + 0.9], y: 0.01 }, { al: 0.55, blur: 22 });
  const caras = [...fijas.slice(5), ...casa(t), ...camioneta()];
  pinta(g, cam, caras, (P, c) => (c.vidrio && d < 0.6 ? [1.25, 1.1, 0.7].map((x) => mez(x, luz, d / 0.6)) : [luz, luz, luz * mez(1.25, 1, d)]), { lejos: 80 });
  // el letrero «SE RENTA» en la ventana: se cae en «rentaron»
  {
    const u = tr(t, Tren, Tren + 0.5), cae = k.sale(u);
    if (u < 1) {
      const y = 1.95 - 2.2 * cae;
      const zz = 0.06 + cae * 0.4;
      pinta(g, cam, [{ p: [[-2.8, y - 0.62, zz], [-1.5, y - 0.62, zz], [-1.5, y + 0.05, zz], [-2.8, y + 0.05, zz]], c: [250, 248, 240], borde: "rgba(200,30,20,0.9)" }], () => [luz, luz, luz]);
      textoEnCara(g, cam, [-2.75, y, zz + 0.01], [-1.55, y, zz + 0.01], [-2.75, y - 0.57, zz + 0.01], "SE RENTA", { letra: 230, alto: 480, color: "#d0261c" });
    }
  }
  // el letrero verde de la tienda: cae en «disfrazaron»
  {
    const u = tr(t, Tdis - 0.05, Tdis + 0.35), y = 2.9 + 3 * (1 - k.entra(u)) - 0.05 * k.pulso(t, Tdis + 0.38, 0.06);
    if (u > 0) {
      pinta(g, cam, cubo([-1.4, y - 0.38, 0.12], [3.9, 0.76, 0.16], [30, 150, 60], { borde: "rgba(255,255,255,0.9)" }), () => [luz, luz, luz], {});
      textoEnCara(g, cam, [-3.3, y, 0.21], [0.5, y, 0.21], [-3.3, y - 0.76, 0.21], "PASTO SINTÉTICO", { letra: 132, alto: 200, color: "#fff7c2", sombra: "rgba(0,0,0,0.5)" });
    }
  }
  // el letrero del banco, arriba del edificio
  textoEnCara(g, cam, [BANCO.x[0] + 0.4, 15.9, BANCO.z[1] + 0.05], [BANCO.x[1] - 0.4, 15.9, BANCO.z[1] + 0.05], [BANCO.x[0] + 0.4, 14.9, BANCO.z[1] + 0.05], "BANCO CENTRAL", { letra: 150, alto: 140, color: d > 0.5 ? "#16406e" : "#ffe9a8", sombra: d > 0.5 ? null : "rgba(255,220,140,0.9)" });
  ruedas(g, cam, luz);
  rollos(g, t, cam, luz);
  const cosas = [...sacos(t, cam, luz)];
  const pasa = tr(t, Tno - 0.5, f4.fin + 0.6);
  if (pasa > 0 && pasa < 1) {
    const a = persona(g, cam, mez(-4.6, -1.2, pasa), 1.75, pasa * 26, luz, [60, 120, 220]); if (a) cosas.push(a);
    const b = persona(g, cam, mez(-1.0, -4.8, pasa), 1.95, pasa * 24 + 1.5, luz, [230, 140, 40]); if (b) cosas.push(b);
  }
  k.deLejosACerca(cosas.map((c) => ({ z: c.z, dibuja: () => c.dibuja(g) })));
  velo(g, 0.35);
}
