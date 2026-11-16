// «Y eran billetes usados, sin números en orden: no había forma de rastrearlos.»
// Los billetes de cerca.
// - «Y eran billetes usados»: un billete de 50 enorme, arrugado y gastado, que gira despacio.
// - «sin números en orden»: la cámara se aleja: seis billetes en abanico; el número de cada uno se marca y no sigue
//   al anterior.
// - «rastrearlos»: una línea roja intenta unirlos en orden, salta de uno a otro y se rompe en pedazos. Reposa.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (v) => v.frase(9).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, azar } = k;
const f9 = v.frase(9);
const Tusa = f9.t("usados"), Tsin = f9.t("sin"), Tnum = f9.t("numeros"), Tno = f9.t("no"), Tras = f9.t("rastrearlos");
export const momentos = { abanico: Tsin, marcas: [], linea: Tno, rompe: Tras + 0.1 };

// la textura del billete (una vez): ocre y marrón, sus guardas, el 50 y su número
const W = 900, H = 420;
let base;
function hacerBase() {
  const l = k.lienzo(W, H), g = l.getContext("2d");
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "#f4bd62"); gr.addColorStop(0.5, "#e0913a"); gr.addColorStop(1, "#b8611f");
  g.fillStyle = gr; k.redondo(g, 0, 0, W, H, 18); g.fill();
  // guilloché: líneas onduladas finas
  g.strokeStyle = "rgba(120,60,20,0.25)"; g.lineWidth = 1.5;
  for (let i = 0; i < 26; i++) { g.beginPath(); for (let x = 0; x <= W; x += 8) { const y = 30 + i * 14 + Math.sin(x * 0.03 + i) * 6; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  // el marco
  g.strokeStyle = "rgba(90,40,10,0.7)"; g.lineWidth = 5; k.redondo(g, 18, 18, W - 36, H - 36, 12); g.stroke();
  // el óvalo claro (la marca de agua)
  const ov = g.createRadialGradient(W * 0.72, H * 0.5, 10, W * 0.72, H * 0.5, 140); ov.addColorStop(0, "rgba(255,240,210,0.85)"); ov.addColorStop(1, "rgba(255,240,210,0)");
  g.fillStyle = ov; g.beginPath(); g.ellipse(W * 0.72, H * 0.5, 120, 150, 0, 0, 6.283); g.fill();
  // los rosetones
  g.strokeStyle = "rgba(110,50,15,0.5)"; g.lineWidth = 2;
  for (let r = 20; r < 110; r += 12) { g.beginPath(); g.ellipse(W * 0.3, H * 0.52, r * 1.3, r, 0, 0, 6.283); g.stroke(); }
  // textos
  g.fillStyle = "#5a2a0a"; g.textAlign = "left"; g.textBaseline = "alphabetic";
  g.font = "900 120px Figtree"; g.fillText("50", 40, 140); g.textAlign = "right"; g.fillText("50", W - 40, H - 40);
  g.font = "800 34px Figtree"; g.textAlign = "center"; g.fillText("BANCO CENTRAL DO BRASIL", W * 0.5, 64);
  g.font = "900 54px Figtree"; g.fillText("CINQUENTA REAIS", W * 0.42, H - 52);
  return l;
}
// las arrugas de un billete usado (una vez): pliegues claros y oscuros, manchas
let arrugas;
function hacerArrugas() {
  const l = k.lienzo(W, H), g = l.getContext("2d"), az = azar(17);
  for (let i = 0; i < 9; i++) {
    const x0 = az() * W, y0 = 0, x1 = x0 + (az() - 0.5) * 300, y1 = H;
    g.strokeStyle = "rgba(255,240,210,0.45)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    g.strokeStyle = "rgba(70,30,5,0.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 4, y0); g.lineTo(x1 + 4, y1); g.stroke();
  }
  g.strokeStyle = "rgba(255,240,210,0.5)"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, H / 2 + 6); g.lineTo(W, H / 2 - 8); g.stroke();
  g.strokeStyle = "rgba(70,30,5,0.4)"; g.beginPath(); g.moveTo(0, H / 2 + 11); g.lineTo(W, H / 2 - 3); g.stroke();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22; g.drawImage(k.manchas, 0, 0, W, H);
  return l;
}

const SERIES = ["CB 04829137", "FA 73100562", "AD 51908443", "HE 20067719", "BF 96215308", "CA 38754021"];
// el abanico: dónde va cada billete (centro, ancho, giro)
const POS = [[300, 760, 420, -0.22], [760, 720, 420, 0.18], [280, 1040, 420, 0.12], [780, 1020, 420, -0.15], [320, 1310, 420, -0.06], [770, 1300, 420, 0.2]];
function billete(g, x, y, w, ang, serie, marca, al = 1) {
  base ??= hacerBase(); arrugas ??= hacerArrugas();
  const h = (w * H) / W;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = w * 0.06; g.shadowOffsetY = w * 0.03;
  g.drawImage(base, -w / 2, -h / 2, w, h); g.shadowColor = "rgba(0,0,0,0)";
  g.drawImage(arrugas, -w / 2, -h / 2, w, h);
  // el número de serie
  const fs = w * 0.062, sx = -w * 0.05, sy = -h * 0.22;
  g.font = `800 ${fs}px Figtree`; g.textAlign = "left"; g.textBaseline = "middle"; g.fillStyle = "#2a1205";
  g.fillText(serie, sx, sy);
  if (marca > 0) {
    const tw = g.measureText(serie).width;
    g.strokeStyle = `rgba(255,50,40,${marca})`; g.lineWidth = Math.max(3, w * 0.012); k.redondo(g, sx - fs * 0.3, sy - fs * 0.75, tw + fs * 0.6, fs * 1.5, fs * 0.3); g.stroke();
  }
  g.restore();
}

export function dibuja(g, t) {
  // el fondo: oscuro y cálido, con luz
  const gr = g.createRadialGradient(540, 900, 50, 540, 960, 1300); gr.addColorStop(0, "#3a2a1c"); gr.addColorStop(1, "#0e0a07");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  const ab = su(tr(t, Tsin - 0.25, Tnum + 0.2));
  // el billete grande pasa a ser el primero del abanico; los otros llegan
  for (let i = POS.length - 1; i >= 0; i--) {
    const [px, py, pw, pa] = POS[i];
    const marca = su(tr(t, Tnum - 0.1 + i * 0.1, Tnum + 0.05 + i * 0.1));
    if (i === 0) {
      const grande = [540, 980, 980, -0.12 + 0.08 * Math.sin((t - f9.inicio) * 1.4)];
      billete(g, mez(grande[0], px, ab), mez(grande[1], py, ab), mez(grande[2], pw, ab), mez(grande[3], pa, ab), SERIES[i], marca);
    } else {
      const u = k.entra(tr(t, Tsin - 0.2 + i * 0.07, Tsin + 0.35 + i * 0.07)); if (u <= 0) continue;
      billete(g, mez(540, px, u), mez(1900, py, u), pw, pa * u, SERIES[i], marca, u);
    }
  }
  // la línea roja que intenta seguir el orden y se rompe
  const orden = [0, 1, 2, 3, 4, 5].map((i) => [POS[i][0] + 30, POS[i][1] - 40]);
  const traza = tr(t, Tno - 0.05, Tras), rompe = tr(t, Tras + 0.05, Tras + 0.7);
  if (traza > 0) {
    const n = traza * (orden.length - 1);
    g.save(); g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = `rgba(255,50,40,${1 - rompe})`; g.lineWidth = 10; g.setLineDash([26, 18]);
    g.shadowColor = "rgba(255,40,30,0.8)"; g.shadowBlur = 16;
    for (let i = 0; i < Math.min(n, orden.length - 1); i++) {
      const a = orden[i], b = orden[i + 1], f = Math.min(1, n - i);
      const caida = rompe * rompe * 700 * (0.6 + 0.4 * Math.sin(i * 3.1));
      const dx = (i % 2 ? 1 : -1) * rompe * 60;
      g.beginPath(); g.moveTo(a[0] + dx, a[1] + caida); g.lineTo(mez(a[0], b[0], f) + dx, mez(a[1], b[1], f) + caida * 1.2); g.stroke();
    }
    g.restore();
  }
  k.brillo(g, 540, 1000, 900, "255,80,60", 0.35 * k.pulso(t, Tras + 0.1, 0.12));
  velo(g, 0.5);
}
