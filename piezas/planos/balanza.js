// Plano entero: una balanza enorme. En la palabra CAE, los fajos de billetes caen al plato de la izquierda y la
// balanza se va hacia el dinero (con su cifra, CIFRA y UNIDAD); en CONTRA1 y CONTRA2, dos autos bajan al otro plato
// y la balanza sube un poco, pero se queda del lado del dinero. Sale de «El túnel del Banco Central de Brasil».
// Pieza: cópiala a video/planos/ de tu proyecto y cambia FRASE, EMPIEZA, CAE, CONTRA1, CONTRA2, CIFRA y UNIDAD.
// Para que gane el otro lado, cambia los signos de angulo().
import * as k from "#kit";
import { v } from "#voz";

const FRASE = 8, EMPIEZA = "tres", CAE = "toneladas", CONTRA1 = "dos", CONTRA2 = "autos", CIFRA = "3,5", UNIDAD = "toneladas";
export const desde = (v) => v.frase(FRASE).t(EMPIEZA);
export const entrada = "corte";

const { suave: su, tramo: tr, mez, azar, entra } = k;
const f8 = v.frase(FRASE);
const Ttre = f8.t(EMPIEZA), Tton = f8.t(CAE), Tdos = f8.t(CONTRA1), Taut = f8.t(CONTRA2);
const NF = 24;
const az = azar(808);
const FAJOS = Array.from({ length: NF }, (_, i) => {
  // una pirámide de fajos: 6, 5, 5, 4, 3, 1
  const filas = [6, 5, 5, 4, 3, 1];
  let f = 0, n = i; while (n >= filas[f]) { n -= filas[f]; f++; }
  return { f, n, w: filas[f], t0: mez(Tton - 0.15, Tton + 0.75, i / NF) + az() * 0.05, gira: (az() - 0.5) * 0.3 };
});
export const momentos = { fajos: FAJOS.map((q) => q.t0 + 0.25), autos: [Tdos + 0.25, Taut + 0.25] };

// el ángulo de la viga: positivo, baja la izquierda
function angulo(t) {
  const dinero = tr(t, Tton - 0.1, Tton + 0.9);
  const autos = tr(t, Tdos + 0.2, Taut + 0.3);
  let a = 0.2 * su(dinero) * (1 - autos * 0) - 0.09 * su(autos);
  a += 0.03 * Math.sin((t - Tton - 0.9) * 10) * Math.exp(-Math.max(0, t - Tton - 0.9) * 3) * (t > Tton + 0.9 ? 1 : 0);
  a += -0.025 * Math.sin((t - Taut - 0.3) * 10) * Math.exp(-Math.max(0, t - Taut - 0.3) * 3) * (t > Taut + 0.3 ? 1 : 0);
  return a;
}

const PIV = [540, 640], L = 360, CAD = 480;
function plato(g, x, y) {
  // cadenas
  g.strokeStyle = "#c9a54a"; g.lineWidth = 5;
  g.beginPath(); g.moveTo(x, y); g.lineTo(x - 170, y + CAD); g.moveTo(x, y); g.lineTo(x + 170, y + CAD); g.stroke();
  // el plato
  y += CAD - 330;
  const gr = g.createLinearGradient(0, y + 320, 0, y + 370);
  gr.addColorStop(0, "#ffe9a0"); gr.addColorStop(0.5, "#d9a63a"); gr.addColorStop(1, "#8a6216");
  g.fillStyle = gr; g.beginPath(); g.ellipse(x, y + 340, 210, 32, 0, 0, 6.283); g.fill();
  g.fillStyle = "#6a4a12"; g.beginPath(); g.ellipse(x, y + 338, 200, 22, 0, Math.PI, 2 * Math.PI); g.fill();
}
function fajo(g, x, y, w, h, ang) {
  g.save(); g.translate(x, y); g.rotate(ang);
  const gr = g.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, "#f6c06c"); gr.addColorStop(1, "#b9772e");
  g.fillStyle = gr; g.fillRect(-w / 2, -h / 2, w, h);
  g.strokeStyle = "rgba(110,60,20,0.55)"; g.lineWidth = 1.5; g.beginPath();
  for (let i = 1; i < 6; i++) { g.moveTo(-w / 2, -h / 2 + (h * i) / 6); g.lineTo(w / 2, -h / 2 + (h * i) / 6); } g.stroke();
  g.fillStyle = "#fff4d6"; g.fillRect(-w * 0.07, -h / 2, w * 0.14, h);
  g.strokeStyle = "rgba(90,50,10,0.8)"; g.lineWidth = 2; g.strokeRect(-w / 2, -h / 2, w, h);
  g.restore();
}
function auto(g, x, y, w, color) {
  const h = w * 0.36;
  g.save(); g.translate(x, y);
  // cuerpo
  const gr = g.createLinearGradient(0, -h, 0, 0); gr.addColorStop(0, color[0]); gr.addColorStop(1, color[1]);
  g.fillStyle = gr; g.beginPath();
  g.moveTo(-w / 2, -h * 0.25); g.lineTo(-w / 2 + w * 0.04, -h * 0.55); g.lineTo(-w * 0.25, -h * 0.6); g.lineTo(-w * 0.14, -h); g.lineTo(w * 0.2, -h);
  g.lineTo(w * 0.32, -h * 0.6); g.lineTo(w / 2 - w * 0.03, -h * 0.52); g.lineTo(w / 2, -h * 0.25); g.lineTo(w / 2 - 4, 0); g.lineTo(-w / 2 + 4, 0); g.closePath(); g.fill();
  g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3; g.stroke();
  // ventanas
  g.fillStyle = "#bfe4f5"; g.beginPath(); g.moveTo(-w * 0.21, -h * 0.62); g.lineTo(-w * 0.12, -h * 0.92); g.lineTo(w * 0.02, -h * 0.92); g.lineTo(w * 0.02, -h * 0.62); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(w * 0.06, -h * 0.62); g.lineTo(w * 0.06, -h * 0.92); g.lineTo(w * 0.18, -h * 0.92); g.lineTo(w * 0.27, -h * 0.62); g.closePath(); g.fill();
  // brillo
  g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-w * 0.45, -h * 0.5, w * 0.9, h * 0.07);
  // ruedas
  for (const rx of [-w * 0.3, w * 0.3]) {
    g.fillStyle = "#1b1b1f"; g.beginPath(); g.arc(rx, 0, h * 0.28, 0, 6.283); g.fill();
    g.fillStyle = "#b8bcc4"; g.beginPath(); g.arc(rx, 0, h * 0.13, 0, 6.283); g.fill();
  }
  // faros
  g.fillStyle = "#fff6c0"; g.fillRect(w / 2 - 12, -h * 0.42, 10, h * 0.1);
  g.restore();
}

export function dibuja(g, t) {
  // el fondo: la pared de acero de la bóveda y el piso
  const gr = g.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, "#1d3a46"); gr.addColorStop(0.62, "#3f7486"); gr.addColorStop(0.62, "#4a4e56"); gr.addColorStop(1, "#2a2d33");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.strokeStyle = "rgba(10,25,32,0.5)"; g.lineWidth = 3;
  for (let x = 0; x < 1080; x += 180) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1190); g.stroke(); }
  for (let y = 200; y < 1190; y += 250) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  k.brillo(g, 540, 600, 1600, "200,235,255", 0.25);
  // la cámara se acerca despacio
  const z = 1 + 0.06 * tr(t, Ttre, f8.fin + 0.4);
  g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -960);
  // el pie
  g.fillStyle = "#c9a54a"; g.fillRect(522, PIV[1], 36, 1300 - PIV[1]);
  g.fillStyle = "#8a6a20"; g.beginPath(); g.ellipse(540, 1305, 200, 34, 0, 0, 6.283); g.fill();
  const a = angulo(t), ca = Math.cos(a), sa = Math.sin(a);
  const LI = [PIV[0] - L * ca, PIV[1] + L * sa], LD = [PIV[0] + L * ca, PIV[1] - L * sa];
  // los platos con lo que llevan
  plato(g, LI[0], LI[1]);
  plato(g, LD[0], LD[1]);
  for (const q of FAJOS) {
    const u = tr(t, q.t0, q.t0 + 0.3); if (u <= 0) continue;
    const w = 64, h = 56, base = LI[1] + CAD - 8;
    const x = LI[0] + (q.n - (q.w - 1) / 2) * w * 1.02, yf = base - h / 2 - q.f * h;
    const y = mez(-200, yf, u * u);
    fajo(g, x, y, w, h, q.gira * (1 - u) + (u >= 1 ? 0 : 0));
  }
  for (const [i, col] of [[0, ["#e8463a", "#a01f18"]], [1, ["#3d8fe0", "#1d4f96"]]]) {
    const t0 = i === 0 ? Tdos - 0.05 : Taut - 0.05, u = tr(t, t0, t0 + 0.4); if (u <= 0) continue;
    const yf = LD[1] + CAD - 8 - 18 - i * 112;
    auto(g, LD[0], mez(-260, yf, u * u), 300, col);
  }
  // la viga
  g.save(); g.translate(PIV[0], PIV[1]); g.rotate(-a);
  const gv = g.createLinearGradient(0, -16, 0, 16); gv.addColorStop(0, "#ffe9a0"); gv.addColorStop(1, "#a07a1e");
  g.fillStyle = gv; k.redondo(g, -L - 20, -16, 2 * L + 40, 32, 14); g.fill();
  g.restore();
  g.fillStyle = "#ffe08a"; g.beginPath(); g.arc(PIV[0], PIV[1], 30, 0, 6.283); g.fill();
  g.fillStyle = "#8a6216"; g.beginPath(); g.arc(PIV[0], PIV[1], 12, 0, 6.283); g.fill();
  g.restore();
  // las cifras
  const a1 = su(tr(t, Tton + 0.3, Tton + 0.6));
  k.pastilla(g, 255, 560, CIFRA, UNIDAD, "255,214,120", a1, 104);
  const vg = g.createLinearGradient(0, 200, 0, 640); vg.addColorStop(0, "rgba(6,4,2,0.5)"); vg.addColorStop(1, "rgba(6,4,2,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}
