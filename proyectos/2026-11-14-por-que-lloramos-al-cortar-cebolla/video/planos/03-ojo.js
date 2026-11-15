// «...sube flotando hasta tus ojos. Ahí toca unos nervios que avisan: ¡algo te pica! Y tus ojos abren el grifo:
//  lágrimas para lavar el gas.»
// El ojo, enorme, una sola cámara. Se entra con un corte en «sube».
// - «sube flotando»: los hilos verdes suben desde abajo y en «ojos» llegan al ojo; los párpados se cierran un poco.
// - «Ahí toca»: la cámara se acerca a la superficie; «nervios»: bajo ella se encienden ramas de luz; el gas las toca;
//   «avisan»: se vuelven rojas y corren pulsos por ellas; «pica»: fogonazo rojo y el blanco del ojo se enrojece.
// - «Y tus ojos»: la cámara se aleja; «grifo»: el agua brota por el borde del párpado; «lágrimas»: una ola cruza el ojo
//   y se lleva el gas; caen lagrimones; «lavar el gas»: el ojo queda limpio y brillante.
import * as k from "#kit";
import { v } from "#voz";
import { vista, hilo, lagrima, velo, GAS } from "../mundo.js";

export const desde = (v) => v.frase(5).t("sube");
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra, azar } = k;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const T0 = f5.t("sube"), Tojos = f5.t("ojos");
const Tahi = f6.inicio, Tnerv = f6.t("nervios"), Tavis = f6.t("avisan"), Tpica = f6.t("pica");
const Ty = f7.inicio, Tgrifo = f7.t("grifo"), Tlag = f7.t("lagrimas"), Tlavar = f7.t("lavar"), FIN = v.frase(8).inicio;

const EX = 540, EY = 1060;                // el centro del ojo
const IR = 215;                           // el radio del iris
// los párpados: de la esquina de dentro (izquierda) a la de fuera (derecha)
const A = [70, 1085], B = [1010, 1040];
function abertura(g, abre) {
  const arriba = mez(EY - 30, EY - 440, abre), abajo = mez(EY + 40, EY + 300, Math.min(1, abre * 1.1));
  g.beginPath(); g.moveTo(A[0], A[1]);
  g.bezierCurveTo(260, arriba, 760, arriba - 20, B[0], B[1]);
  g.bezierCurveTo(780, abajo, 300, abajo + 10, A[0], A[1]);
  g.closePath();
}
const curvaArriba = (abre, x) => { // la y del párpado de arriba en x (aprox.)
  const u = (x - A[0]) / (B[0] - A[0]), arriba = mez(EY - 30, EY - 440, abre);
  const yb = (1 - u) ** 3 * A[1] + 3 * (1 - u) ** 2 * u * arriba + 3 * (1 - u) * u * u * (arriba - 20) + u ** 3 * B[1];
  return yb;
};
const curvaAbajo = (abre, x) => {
  const u = (B[0] - x) / (B[0] - A[0]), abajo = mez(EY + 40, EY + 300, Math.min(1, abre * 1.1));
  return (1 - u) ** 3 * B[1] + 3 * (1 - u) ** 2 * u * abajo + 3 * (1 - u) * u * u * (abajo + 10) + u ** 3 * A[1];
};

// la piel de alrededor, con su textura (una vez)
const PIEL = (() => {
  const l = k.lienzo(1600, 2400), c = l.getContext("2d");
  const gr = c.createRadialGradient(800, 1300, 100, 800, 1300, 1400);
  gr.addColorStop(0, "#e9b28c"); gr.addColorStop(0.6, "#c98563"); gr.addColorStop(1, "#7c4630");
  c.fillStyle = gr; c.fillRect(0, 0, 1600, 2400);
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.18; c.drawImage(k.manchas, 0, 0, 1600, 2400);
  c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
  // la ceja
  const az = azar(6);
  c.lineCap = "round";
  for (let i = 0; i < 520; i++) {
    const u = az(), x = 330 + u * 1000, y = 640 - Math.sin(u * Math.PI) * 120 + u * 30 + (az() - 0.5) * 70;
    c.strokeStyle = `rgba(${50 + az() * 30},${28 + az() * 15},${16},${0.55 + az() * 0.4})`; c.lineWidth = 3 + az() * 3;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + 30 + u * 30, y - 10 - (1 - u) * 14); c.stroke();
  }
  return k.fijar(l);
})();
// las venitas del blanco del ojo
const azV = azar(17);
const VENAS = [];
for (let i = 0; i < 26; i++) {
  const lado = i % 2 ? 1 : -1, x0 = lado > 0 ? 1000 : 80, y0 = EY + (azV() - 0.5) * 260;
  let x = x0, y = y0; const pts = [[x, y]];
  for (let j = 0; j < 7; j++) { x -= lado * (25 + azV() * 35); y += (azV() - 0.5) * 50; pts.push([x, y]); }
  VENAS.push(pts);
}
// los nervios: ramas que nacen en el borde y se reparten por el ojo (cada tramo sabe a qué distancia está de su raíz)
const azN = azar(41);
const NERV = [];
function rama(x, y, ang, largo, d, prof) {
  if (prof > 5 || largo < 14) return;
  const x2 = x + Math.cos(ang) * largo, y2 = y + Math.sin(ang) * largo;
  NERV.push({ x, y, x2, y2, d, d2: d + largo, w: Math.max(1.5, 6 - prof) });
  rama(x2, y2, ang + (azN() - 0.5) * 0.7, largo * (0.75 + azN() * 0.2), d + largo, prof + 1);
  if (azN() < 0.65) rama(x2, y2, ang + (azN() < 0.5 ? -1 : 1) * (0.5 + azN() * 0.5), largo * 0.65, d + largo, prof + 1);
}
for (let i = 0; i < 9; i++) { const x = 680 + (i % 3) * 110 + azN() * 40, y = 880 + Math.floor(i / 3) * 120; rama(x, y, -Math.PI / 2 + (azN() - 0.5) * 3.5, 60, 0, 0); }
const DMAX = Math.max(...NERV.map((n) => n.d2));
// dónde se mira de cerca: el blanco del ojo, a la derecha del iris
const ZX = 820, ZY = 1020;

const cam = (t) => {
  const cerca = su(tr(t, Tahi, Tnerv + 0.1)) * (1 - su(tr(t, Ty, Ty + 0.8)));
  return { x: mez(540, ZX, cerca), y: mez(1030, ZY, cerca), z: mez(1.12, 2.3, cerca) };
};
// los hilos de gas que suben desde abajo hasta el ojo
const HILOS = Array.from({ length: 12 }, (_, i) => ({ x: 160 + i * 70 + azV() * 40, t0: T0 - 1.0 + i * 0.08, s: i }));
// las lágrimas que caen del párpado de abajo
export const lagrimas = [[330, Tlag + 0.05], [700, Tlag + 0.25], [520, Tlag + 0.5], [820, Tlavar + 0.05], [420, Tlavar + 0.2]].map(([x, t0], i) => ({ x, t0, r: 46 + (i % 3) * 10 }));

export function dibuja(g, t) {
  const c = cam(t);
  // cuánto abre el ojo: se entorna cuando llega el gas y en «pica»
  const abre = 1 - 0.18 * su(tr(t, Tojos - 0.05, Tojos + 0.3)) * (1 - su(tr(t, Tojos + 0.5, Tahi))) - 0.2 * k.pulso(t, Tpica + 0.1, 0.25);
  const rojo = su(tr(t, Tpica - 0.1, Tpica + 0.3)) * (1 - 0.85 * su(tr(t, Tlag, Tlavar + 0.6)));
  const gasOjo = su(tr(t, Tojos - 0.2, Tojos + 0.4)) * (1 - su(tr(t, Tlag - 0.1, Tlavar + 0.2)));
  const ola = tr(t, Tlag - 0.25, Tlag + 0.6);           // el frente de la ola cruza el ojo
  const agua = su(tr(t, Tgrifo - 0.1, Tgrifo + 0.6));    // el agua del borde

  g.fillStyle = "#6a3a26"; g.fillRect(0, 0, 1080, 1920);
  g.save(); vista(g, c.x, c.y, c.z);
  g.drawImage(PIEL, -260, -240);
  // la sombra alrededor del ojo
  const sg = g.createRadialGradient(EX, EY, 300, EX, EY, 700); sg.addColorStop(0, "rgba(90,40,30,0.45)"); sg.addColorStop(1, "rgba(90,40,30,0)");
  g.fillStyle = sg; g.fillRect(-300, 400, 1700, 1400);
  // el pliegue del párpado de arriba
  g.strokeStyle = "rgba(110,55,35,0.6)"; g.lineWidth = 8; g.beginPath(); g.moveTo(110, 960); g.bezierCurveTo(300, 560, 780, 540, 990, 940); g.stroke();

  // dentro del ojo
  g.save(); abertura(g, abre); g.clip();
  const bl = g.createRadialGradient(EX, EY - 40, 100, EX, EY, 560);
  bl.addColorStop(0, `rgb(${255},${mez(250, 215, rojo) | 0},${mez(246, 205, rojo) | 0})`); bl.addColorStop(0.7, `rgb(${mez(232, 240, rojo) | 0},${mez(222, 170, rojo) | 0},${mez(218, 160, rojo) | 0})`); bl.addColorStop(1, "#b88a7a");
  g.fillStyle = bl; g.fillRect(0, 700, 1080, 700);
  // venitas
  g.lineCap = "round";
  for (const pts of VENAS) { g.strokeStyle = `rgba(200,40,40,${0.18 + 0.55 * rojo})`; g.lineWidth = 2 + 2 * rojo; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
  // el iris, con sus rayitas, y la pupila
  const ig = g.createRadialGradient(EX, EY, 40, EX, EY, IR);
  ig.addColorStop(0, "#3b1d08"); ig.addColorStop(0.35, "#9a5a1c"); ig.addColorStop(0.75, "#6b3a12"); ig.addColorStop(0.95, "#2c1606"); ig.addColorStop(1, "#1a0c04");
  g.fillStyle = ig; g.beginPath(); g.arc(EX, EY, IR, 0, 6.283); g.fill();
  for (let i = 0; i < 90; i++) { const a = i / 90 * 6.283; g.strokeStyle = i % 2 ? "rgba(255,190,110,0.35)" : "rgba(40,18,5,0.35)"; g.lineWidth = 3; g.beginPath(); g.moveTo(EX + Math.cos(a) * 85, EY + Math.sin(a) * 85); g.lineTo(EX + Math.cos(a + 0.05) * (IR - 12), EY + Math.sin(a + 0.05) * (IR - 12)); g.stroke(); }
  g.fillStyle = "#050302"; g.beginPath(); g.arc(EX, EY, 82, 0, 6.283); g.fill();
  // la sombra del párpado de arriba sobre el ojo
  const ps = g.createLinearGradient(0, EY - 420, 0, EY - 120); ps.addColorStop(0, "rgba(60,25,15,0.55)"); ps.addColorStop(1, "rgba(60,25,15,0)");
  g.fillStyle = ps; g.fillRect(0, EY - 450, 1080, 340);
  // los nervios, bajo la superficie
  const vNerv = su(tr(t, Tnerv - 0.2, Tnerv + 0.3)) * (1 - su(tr(t, Ty, Ty + 0.6)));
  if (vNerv > 0) {
    const act = su(tr(t, Tavis - 0.1, Tavis + 0.2));
    g.save(); g.globalCompositeOperation = act > 0.3 ? "source-over" : "lighter"; g.lineCap = "round";
    for (const n of NERV) {
      // los pulsos van del borde de la rama hacia su raíz, repetidos
      const fase = ((n.d2 / DMAX) + (t - Tavis) * 1.6) % 1, pulso = act * Math.exp(-Math.pow((fase - 0.5) / 0.07, 2));
      const col = k.mezRgb("255,235,190", "255,40,30", act);
      g.strokeStyle = `rgba(${col},${vNerv * (0.45 + 0.55 * pulso + 0.3 * act)})`; g.lineWidth = n.w * (1.3 + act * 0.8 + pulso * 2);
      g.beginPath(); g.moveTo(n.x, n.y); g.lineTo(n.x2, n.y2); g.stroke();
    }
    g.restore();
  }
  // el gas pegado al ojo
  if (gasOjo > 0) {
    g.save();
    for (let i = 0; i < 10; i++) {
      const x = 250 + i * 65 + Math.sin(t * 1.5 + i) * 30, y = EY + 60 + Math.cos(t * 1.2 + i * 2) * 120;
      const gr = g.createRadialGradient(x, y, 0, x, y, 170);
      gr.addColorStop(0, `rgba(150,235,70,${0.28 * gasOjo})`); gr.addColorStop(1, `rgba(150,235,70,0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, 170, 0, 6.283); g.fill();
    }
    g.restore();
  }
  // la ola de lágrimas: cruza el ojo desde arriba a la derecha y lo deja mojado
  if (ola > 0) {
    const fx = mez(1150, -200, entra(ola));
    g.save(); g.beginPath(); g.moveTo(fx, 700); g.lineTo(1200, 700); g.lineTo(1200, 1400); g.lineTo(fx - 250, 1400); g.closePath(); g.clip();
    g.fillStyle = "rgba(170,210,255,0.12)"; g.fillRect(0, 700, 1200, 700);
    g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.35 * (1 - 0.6 * tr(t, Tlavar, FIN));
    g.drawImage(k.causticas, -100 + t * 40, 650, 1300, 800);
    g.restore();
    if (ola < 1) {
      g.save(); g.globalCompositeOperation = "screen";
      for (let i = 0; i < 6; i++) { const d = i * 28; g.strokeStyle = `rgba(200,230,255,${0.22 - i * 0.03})`; g.lineWidth = 40; g.beginPath(); g.moveTo(fx + d, 700); g.quadraticCurveTo(fx - 80 + d, 1050, fx - 250 + d, 1400); g.stroke(); }
      g.restore();
    }
  }
  // el grifo: el agua brota por la esquina de fuera, arriba, y baja por el ojo
  const chorro = su(tr(t, Tgrifo - 0.15, Tgrifo + 0.45)) * (1 - su(tr(t, Tlag + 0.2, Tlag + 0.7)));
  if (chorro > 0) {
    const largo = 600 * chorro;
    g.save(); g.lineCap = "round";
    for (const [w, a] of [[70, 0.18], [44, 0.3], [16, 0.7]]) {
      g.strokeStyle = `rgba(210,235,255,${a})`; g.lineWidth = w;
      g.beginPath(); g.moveTo(960, 900); g.quadraticCurveTo(900, 900 + largo * 0.4, 860 - largo * 0.15, 900 + largo * 0.6); g.stroke();
    }
    g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.5 * chorro; g.drawImage(k.causticas, 700 + t * 30, 850, 400, 500);
    g.restore();
  }
  // el brillo del ojo (más fuerte cuando está mojado)
  g.fillStyle = `rgba(255,255,255,${0.85})`; g.beginPath(); g.ellipse(EX - 80, EY - 85, 46, 34, -0.4, 0, 6.283); g.fill();
  g.fillStyle = `rgba(255,255,255,${0.35 + 0.4 * ola})`; g.beginPath(); g.ellipse(EX + 120, EY + 70, 20, 14, -0.4, 0, 6.283); g.fill();
  g.restore();

  // el agua que sube por el borde de abajo
  if (agua > 0) {
    g.save(); g.lineCap = "round";
    g.strokeStyle = `rgba(200,230,255,${0.85 * agua})`; g.lineWidth = 14 + 34 * agua;
    g.beginPath(); for (let x = A[0] + 20; x <= B[0] - 20; x += 20) { const y = curvaAbajo(abre, x) - 6 * agua; x === A[0] + 20 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.8 * agua})`; g.lineWidth = 4;
    g.beginPath(); for (let x = A[0] + 40; x <= B[0] - 40; x += 20) { const y = curvaAbajo(abre, x) - 14 * agua; x === A[0] + 40 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    g.restore();
  }
  // el borde de los párpados y las pestañas
  g.save(); abertura(g, abre); g.strokeStyle = "rgba(120,50,40,0.9)"; g.lineWidth = 12; g.stroke(); g.restore();
  g.lineCap = "round";
  for (let i = 0; i <= 36; i++) {
    const x = A[0] + 40 + i * ((B[0] - A[0] - 80) / 36), y = curvaArriba(abre, x), u = (x - EX) / 470;
    g.strokeStyle = "#1a0e08"; g.lineWidth = 7 - Math.abs(u) * 3;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + u * 40, y - 60, x + u * 80 + 10, y - 95 - (1 - Math.abs(u)) * 20); g.stroke();
  }
  for (let i = 0; i <= 24; i++) {
    const x = A[0] + 120 + i * ((B[0] - A[0] - 200) / 24), y = curvaAbajo(abre, x), u = (x - EX) / 470;
    g.strokeStyle = "rgba(30,16,10,0.85)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x, y + 8); g.quadraticCurveTo(x + u * 15, y + 30, x + u * 30, y + 45); g.stroke();
  }
  // los hilos de gas que suben hasta el ojo
  for (const h of HILOS) if (t < Tojos + 1.2) hilo(g, t, h.x, 1950, h.t0, 2.4, 60, (EX - h.x) * 0.3, 1000, 1.1 * (1 - tr(t, Tojos + 0.4, Tojos + 1.2)), h.s);
  // las lágrimas que caen por la mejilla
  for (const [i, l] of lagrimas.entries()) {
    const u = t - l.t0; if (u < 0) continue;
    const y0 = curvaAbajo(abre, l.x) + 30, y = y0 + 120 * u + 900 * u * u;
    if (y > 2200) continue;
    // el rastro mojado
    const rg = g.createLinearGradient(0, y0, 0, y - l.r); rg.addColorStop(0, "rgba(230,245,255,0.05)"); rg.addColorStop(1, "rgba(230,245,255,0.3)"); g.strokeStyle = rg; g.lineWidth = l.r * 0.28; g.beginPath(); g.moveTo(l.x, y0); g.lineTo(l.x, y - l.r); g.stroke();
    lagrima(g, l.x, y, l.r * Math.min(1, u * 5 + 0.3), 1.2);
  }
  g.restore();
  // «pica»: un fogonazo rojo
  k.brillo(g, 540, 960, 1800, "255,60,50", 0.6 * k.pulso(t, Tpica + 0.05, 0.12));
  velo(g, 0.35);
}
