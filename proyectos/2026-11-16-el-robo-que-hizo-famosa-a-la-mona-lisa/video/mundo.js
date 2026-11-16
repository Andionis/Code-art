// Lo que comparten los planos: la Mona Lisa (siempre la misma), su marco, el Salon Carré del Louvre con sus cuatro
// ganchos, la gente (siluetas de 1911), la multitud de espaldas, los periódicos y la oscuridad con linterna.
import * as k from "#kit";

const { azar, mez } = k;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ la Mona Lisa
// 77 × 53 cm: ancho = 0,688 del alto. Se pinta una vez, grande, y se pone donde haga falta.
export const ML_W = 688, ML_H = 1000;
let _ml = null;
function pintarMona() {
  const c = k.lienzo(ML_W, ML_H), g = c.getContext("2d");
  const W = ML_W, H = ML_H;
  // el cielo y el paisaje del fondo
  let gr = g.createLinearGradient(0, 0, 0, H * 0.6);
  gr.addColorStop(0, "#a7b89a"); gr.addColorStop(0.5, "#b9bd8e"); gr.addColorStop(1, "#8f8a5a");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // montañas lejanas, azul verdoso
  const monte = (y0, amp, col, sem) => {
    const a = azar(sem); g.beginPath(); g.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) g.lineTo(x, y0 - amp * (0.5 + 0.5 * Math.sin(x * 0.011 + sem) * Math.cos(x * 0.027 + sem * 2)) - a() * 8);
    g.lineTo(W, H); g.closePath(); g.fillStyle = col; g.fill();
  };
  monte(H * 0.27, 70, "#7f9a88", 3);
  monte(H * 0.36, 60, "#6c836b", 7);
  monte(H * 0.47, 50, "#6f6740", 11);
  // el lago y el camino que serpentea (izquierda) y el puente (derecha)
  g.fillStyle = "rgba(200,210,180,0.7)"; g.beginPath(); g.ellipse(W * 0.16, H * 0.33, W * 0.14, H * 0.018, 0, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(W * 0.86, H * 0.3, W * 0.12, H * 0.014, 0, 0, TAU); g.fill();
  g.strokeStyle = "rgba(205,180,120,0.8)"; g.lineWidth = 9; g.beginPath();
  g.moveTo(W * 0.04, H * 0.52); g.bezierCurveTo(W * 0.2, H * 0.47, W * 0.05, H * 0.43, W * 0.2, H * 0.41); g.stroke();
  g.lineWidth = 6; g.beginPath(); g.moveTo(W * 0.78, H * 0.5); g.bezierCurveTo(W * 0.9, H * 0.46, W * 0.82, H * 0.43, W * 0.95, H * 0.42); g.stroke();
  // el parapeto detrás de ella
  g.fillStyle = "#4e4126"; g.fillRect(0, H * 0.5, W, H * 0.035);
  // el cuerpo: el vestido oscuro, como una pirámide
  gr = g.createLinearGradient(0, H * 0.45, 0, H);
  gr.addColorStop(0, "#2c2414"); gr.addColorStop(1, "#16120a");
  g.fillStyle = gr; g.beginPath();
  g.moveTo(W * 0.31, H * 0.47); g.quadraticCurveTo(W * 0.12, H * 0.55, W * 0.02, H * 0.8); g.lineTo(-10, H); g.lineTo(W + 10, H);
  g.lineTo(W * 0.99, H * 0.74); g.quadraticCurveTo(W * 0.88, H * 0.53, W * 0.69, H * 0.47); g.closePath(); g.fill();
  // el pecho: piel, con el escote curvo
  gr = g.createRadialGradient(W * 0.53, H * 0.5, 10, W * 0.5, H * 0.52, W * 0.25);
  gr.addColorStop(0, "#d9ad70"); gr.addColorStop(1, "#8f6434");
  g.fillStyle = gr; g.beginPath();
  g.moveTo(W * 0.37, H * 0.44); g.lineTo(W * 0.63, H * 0.44);
  g.quadraticCurveTo(W * 0.68, H * 0.5, W * 0.7, H * 0.53); g.quadraticCurveTo(W * 0.5, H * 0.6, W * 0.3, H * 0.53);
  g.quadraticCurveTo(W * 0.33, H * 0.49, W * 0.37, H * 0.44); g.fill();
  // el borde bordado del escote
  g.strokeStyle = "#5a4520"; g.lineWidth = 6; g.beginPath(); g.moveTo(W * 0.3, H * 0.53); g.quadraticCurveTo(W * 0.5, H * 0.6, W * 0.7, H * 0.53); g.stroke();
  // las mangas, ocre con pliegues, que bajan y se cruzan
  gr = g.createLinearGradient(0, H * 0.6, 0, H);
  gr.addColorStop(0, "#7a5a26"); gr.addColorStop(1, "#4a3615");
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(W * 0.1, H * 0.66); g.quadraticCurveTo(W * 0.25, H * 0.82, W * 0.55, H * 0.83);
  g.lineTo(W * 0.58, H * 0.92); g.quadraticCurveTo(W * 0.2, H * 0.95, W * 0.02, H * 0.86); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(W * 0.92, H * 0.62); g.quadraticCurveTo(W * 0.97, H * 0.8, W * 0.75, H * 0.86);
  g.lineTo(W * 0.62, H * 0.84); g.quadraticCurveTo(W * 0.8, H * 0.74, W * 0.82, H * 0.6); g.closePath(); g.fill();
  g.strokeStyle = "rgba(240,200,120,0.25)"; g.lineWidth = 3;
  for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(W * (0.08 + i * 0.05), H * (0.7 + i * 0.012)); g.quadraticCurveTo(W * (0.12 + i * 0.05), H * 0.85, W * (0.1 + i * 0.05), H * 0.91); g.stroke(); }
  // las manos: la izquierda debajo, la derecha encima con los dedos que caen sobre la muñeca
  const piel = (x0, y0, x1, y1) => { const m = g.createLinearGradient(x0, y0, x1, y1); m.addColorStop(0, "#f2cf96"); m.addColorStop(0.6, "#d9a868"); m.addColorStop(1, "#9c6c38"); return m; };
  // la izquierda (la de abajo): el dorso que asoma
  g.fillStyle = piel(W * 0.3, H * 0.84, W * 0.5, H * 0.95);
  g.beginPath(); g.moveTo(W * 0.27, H * 0.86); g.quadraticCurveTo(W * 0.38, H * 0.83, W * 0.5, H * 0.87);
  g.quadraticCurveTo(W * 0.52, H * 0.93, W * 0.45, H * 0.95); g.quadraticCurveTo(W * 0.35, H * 0.95, W * 0.28, H * 0.92); g.closePath(); g.fill();
  // la derecha: el dorso y los dedos
  g.fillStyle = piel(W * 0.5, H * 0.8, W * 0.7, H * 0.92);
  g.beginPath(); g.moveTo(W * 0.72, H * 0.8); g.quadraticCurveTo(W * 0.6, H * 0.79, W * 0.5, H * 0.83);
  g.quadraticCurveTo(W * 0.44, H * 0.86, W * 0.46, H * 0.89); g.quadraticCurveTo(W * 0.58, H * 0.9, W * 0.7, H * 0.87); g.closePath(); g.fill();
  for (let i = 0; i < 4; i++) {
    const fx = W * (0.44 + i * 0.035), fy = H * (0.865 + i * 0.004);
    g.fillStyle = piel(fx, fy - 10, fx, fy + 50);
    g.beginPath(); g.ellipse(fx, fy + 18, W * 0.02, H * 0.034, 0.25, 0, TAU); g.fill();
    g.strokeStyle = "rgba(120,75,35,0.45)"; g.lineWidth = 2; g.stroke();
  }
  // el cuello, en sombra
  gr = g.createLinearGradient(W * 0.44, 0, W * 0.57, 0);
  gr.addColorStop(0, "#7a5228"); gr.addColorStop(0.55, "#c8975a"); gr.addColorStop(1, "#8a5e30");
  g.fillStyle = gr; g.beginPath(); g.moveTo(W * 0.45, H * 0.33); g.lineTo(W * 0.56, H * 0.33); g.lineTo(W * 0.58, H * 0.45); g.lineTo(W * 0.43, H * 0.45); g.closePath(); g.fill();
  g.save(); g.translate(W * 0.5, H * 0.27); g.scale(1.08, 1.08); g.translate(-W * 0.5, -H * 0.25);
  // el pelo oscuro, que cae en ondas a los dos lados hasta los hombros
  g.fillStyle = "#22160b"; g.beginPath();
  g.moveTo(W * 0.5, H * 0.11); g.bezierCurveTo(W * 0.3, H * 0.11, W * 0.33, H * 0.3, W * 0.31, H * 0.45);
  g.bezierCurveTo(W * 0.34, H * 0.46, W * 0.37, H * 0.45, W * 0.4, H * 0.43);
  g.bezierCurveTo(W * 0.38, H * 0.33, W * 0.39, H * 0.22, W * 0.5, H * 0.19);
  g.bezierCurveTo(W * 0.61, H * 0.22, W * 0.62, H * 0.33, W * 0.61, H * 0.45);
  g.bezierCurveTo(W * 0.63, H * 0.45, W * 0.66, H * 0.46, W * 0.69, H * 0.45);
  g.bezierCurveTo(W * 0.67, H * 0.3, W * 0.7, H * 0.11, W * 0.5, H * 0.11); g.fill();
  g.strokeStyle = "rgba(90,60,30,0.5)"; g.lineWidth = 2.5;
  for (let i = 0; i < 6; i++) for (const L of [-1, 1]) {
    g.beginPath(); const x0 = W * (0.5 + L * (0.13 + i * 0.012));
    g.moveTo(x0, H * 0.25); g.bezierCurveTo(x0 + L * 8, H * 0.32, x0 - L * 8, H * 0.38, x0 + L * 10, H * 0.46); g.stroke();
  }
  // la cara: un óvalo ancho, con la luz desde la izquierda arriba
  gr = g.createRadialGradient(W * 0.46, H * 0.22, 10, W * 0.5, H * 0.26, W * 0.2);
  gr.addColorStop(0, "#f4d397"); gr.addColorStop(0.65, "#dcab68"); gr.addColorStop(1, "#9a6c36");
  g.fillStyle = gr; g.beginPath(); g.ellipse(W * 0.5, H * 0.255, W * 0.128, H * 0.112, 0, 0, TAU); g.fill();
  // la sombra del lado derecho de la cara y la barbilla
  g.fillStyle = "rgba(90,55,20,0.32)"; g.beginPath(); g.ellipse(W * 0.6, H * 0.27, W * 0.045, H * 0.085, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(90,55,20,0.25)"; g.beginPath(); g.ellipse(W * 0.5, H * 0.36, W * 0.07, H * 0.012, 0, 0, TAU); g.fill();
  // el velo fino
  g.strokeStyle = "rgba(40,28,14,0.45)"; g.lineWidth = 3; g.beginPath(); g.ellipse(W * 0.5, H * 0.2, W * 0.135, H * 0.095, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
  // la raya del pelo en medio
  g.fillStyle = "#22160b"; g.beginPath(); g.ellipse(W * 0.5, H * 0.165, W * 0.125, H * 0.05, 0, Math.PI, TAU); g.fill();
  // los ojos, la nariz y la sonrisa
  const ojo = (x) => {
    g.fillStyle = "rgba(70,45,20,0.6)"; g.beginPath(); g.ellipse(x, H * 0.235, W * 0.03, H * 0.009, 0, 0, TAU); g.fill();
    g.fillStyle = "#2a1a0c"; g.beginPath(); g.arc(x + 2, H * 0.235, W * 0.011, 0, TAU); g.fill();
    g.strokeStyle = "rgba(110,70,30,0.4)"; g.lineWidth = 3; g.beginPath(); g.ellipse(x, H * 0.228, W * 0.034, H * 0.013, 0, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  };
  ojo(W * 0.452); ojo(W * 0.558);
  g.strokeStyle = "rgba(120,78,36,0.5)"; g.lineWidth = 4; g.beginPath(); g.moveTo(W * 0.51, H * 0.245); g.quadraticCurveTo(W * 0.525, H * 0.285, W * 0.495, H * 0.295); g.stroke();
  g.strokeStyle = "rgba(95,50,25,0.85)"; g.lineWidth = 4.5; g.beginPath(); g.moveTo(W * 0.452, H * 0.318);
  g.quadraticCurveTo(W * 0.5, H * 0.33, W * 0.55, H * 0.31); g.stroke();
  g.fillStyle = "rgba(95,50,25,0.45)"; g.beginPath(); g.arc(W * 0.449, H * 0.315, 4, 0, TAU); g.arc(W * 0.553, H * 0.307, 4, 0, TAU); g.fill();
  g.restore();
  // el sfumato: todo un poco difuminado
  const c2 = k.lienzo(W, H), g2 = c2.getContext("2d");
  g2.filter = "blur(2.2px)"; g2.drawImage(c, 0, 0); g2.filter = "none";
  // el barniz amarillento y las grietas del óleo
  g2.globalCompositeOperation = "multiply";
  gr = g2.createRadialGradient(W * 0.5, H * 0.4, W * 0.2, W * 0.5, H * 0.5, W * 0.95);
  gr.addColorStop(0, "#f0d79a"); gr.addColorStop(1, "#6e5a2c");
  g2.fillStyle = gr; g2.fillRect(0, 0, W, H);
  g2.globalAlpha = 0.16; for (let yy = 0; yy < H; yy += 384) for (let xx = 0; xx < W; xx += 384) g2.drawImage(k.red, xx, yy, 384, 384); g2.globalAlpha = 0.18; g2.drawImage(k.manchas, 0, 0, W, H);
  g2.globalAlpha = 1; g2.globalCompositeOperation = "source-over";
  return k.fijar(c2);
}
export const mona = () => (_ml ??= pintarMona());

// La Mona Lisa en blanco y negro, de periódico: más contraste y una trama de puntos.
let _mlp = null;
export function monaPeriodico() {
  if (_mlp) return _mlp;
  const c = k.lienzo(ML_W, ML_H), g = c.getContext("2d");
  g.filter = "grayscale(1) contrast(1.5) brightness(1.05)"; g.drawImage(mona(), 0, 0); g.filter = "none";
  g.globalCompositeOperation = "multiply"; g.fillStyle = "rgba(225,215,190,1)"; g.fillRect(0, 0, ML_W, ML_H);
  g.fillStyle = "rgba(0,0,0,0.18)";
  for (let y = 0; y < ML_H; y += 7) for (let x = (y / 7) % 2 ? 3.5 : 0; x < ML_W; x += 7) { g.beginPath(); g.arc(x, y, 1.6, 0, TAU); g.fill(); }
  return (_mlp = k.fijar(c));
}

// ------------------------------------------------------------------ marcos de oro
// Un marco dorado alrededor del rectángulo (x, y, w, h), de grosor b.
export function marcoOro(g, x, y, w, h, b, luz = 1) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = b * 1.2; g.shadowOffsetY = b * 0.5;
  g.fillStyle = "#5a3d12"; g.fillRect(x - b, y - b, w + 2 * b, h + 2 * b);
  g.restore();
  const lados = [
    [[x - b, y - b], [x + w + b, y - b], [x + w, y], [x, y], 1.0],
    [[x + w + b, y - b], [x + w + b, y + h + b], [x + w, y + h], [x + w, y], 0.55],
    [[x + w + b, y + h + b], [x - b, y + h + b], [x, y + h], [x + w, y + h], 0.4],
    [[x - b, y + h + b], [x - b, y - b], [x, y], [x, y + h], 0.8],
  ];
  for (const [a, b2, c, d, l] of lados) {
    const gr = g.createLinearGradient(a[0], a[1], (c[0] + d[0]) / 2, (c[1] + d[1]) / 2);
    const L = l * luz;
    gr.addColorStop(0, `rgb(${Math.round(120 * L + 40)},${Math.round(85 * L + 25)},${Math.round(25 * L + 8)})`);
    gr.addColorStop(0.35, `rgb(${Math.round(235 * L + 20)},${Math.round(195 * L + 15)},${Math.round(105 * L + 10)})`);
    gr.addColorStop(0.6, `rgb(${Math.round(150 * L + 30)},${Math.round(105 * L + 20)},${Math.round(35 * L + 8)})`);
    gr.addColorStop(1, `rgb(${Math.round(200 * L + 25)},${Math.round(155 * L + 18)},${Math.round(65 * L + 8)})`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(...a); g.lineTo(...b2); g.lineTo(...c); g.lineTo(...d); g.closePath(); g.fill();
  }
  // el borde interior oscuro
  g.strokeStyle = "rgba(40,25,5,0.8)"; g.lineWidth = Math.max(2, b * 0.08); g.strokeRect(x, y, w, h);
  g.strokeStyle = `rgba(255,235,170,${0.5 * luz})`; g.lineWidth = Math.max(1.5, b * 0.05); g.strokeRect(x - b * 0.55, y - b * 0.55, w + b * 1.1, h + b * 1.1);
}

// La Mona Lisa con su marco, centrada en (cx, cy), de alto h (sin el marco).
export function monaEnMarco(g, cx, cy, h, op = {}) {
  const w = h * ML_W / ML_H, b = h * 0.075;
  if (op.marco !== false) marcoOro(g, cx - w / 2, cy - h / 2, w, h, b, op.luz ?? 1);
  g.drawImage(op.periodico ? monaPeriodico() : mona(), cx - w / 2, cy - h / 2, w, h);
}

// ------------------------------------------------------------------ el Salon Carré
// Un mundo de SW × SH píxeles: la pared roja con cuadros con marcos de oro, la moldura, el zócalo y el parquet.
// La Mona Lisa va en (MLX, MLY) con alto MLH; sus cuatro ganchos, siempre en la pared.
export const SW = 3000, SH = 2400, ESC_S = 1;
export const MLX = 1500, MLY = 1120, MLH = 520;
export const SUELO = 1820;
const ganchos = () => {
  const w = MLH * ML_W / ML_H, b = MLH * 0.075;
  return [[MLX - w / 2 - b * 0.4, MLY - MLH / 2 - b * 1.2], [MLX + w / 2 + b * 0.4, MLY - MLH / 2 - b * 1.2], [MLX - w / 2 - b * 0.4, MLY + MLH / 2 + b * 1.2], [MLX + w / 2 + b * 0.4, MLY + MLH / 2 + b * 1.2]];
};
export const GANCHOS = ganchos();

// Cuadros de la pared (genéricos: paisajes, retratos, escenas).
const CUADROS = (() => {
  const a = azar(41), L = [];
  const huecoML = (x, y, w, h) => Math.abs(x + w / 2 - MLX) < (MLH * 0.5 + w / 2 + 70) && Math.abs(y + h / 2 - MLY) < (MLH * 0.62 + h / 2 + 40);
  // filas de cuadros, al estilo de la época: de arriba abajo, apretados
  const filas = [[330, 380], [760, 300], [1110, 320], [1450, 260]];
  for (const [y0, hMax] of filas) {
    let x = 60 + a() * 60;
    while (x < SW - 200) {
      const h = hMax * (0.6 + a() * 0.4), w = h * (0.7 + a() * 0.9);
      const y = y0 + (hMax - h) / 2;
      if (!huecoML(x, y, w, h) && x + w < SW - 60) L.push({ x, y, w, h, tipo: Math.floor(a() * 4), s: Math.floor(a() * 1e6) });
      x += w + 70 + a() * 40;
    }
  }
  return L;
})();

function pintarCuadro(g, c) {
  const a = azar(c.s), { x, y, w, h } = c;
  marcoOro(g, x, y, w, h, Math.min(w, h) * 0.07, 0.8);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const paletas = [["#3d5a3a", "#7f9070", "#d8c898"], ["#3a2a1a", "#8a6a3a", "#f0c88a"], ["#2b4060", "#6a80a0", "#d8c8a0"], ["#5a2a1a", "#b05a3a", "#f4c880"]];
  const p = paletas[c.tipo];
  const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, p[1]); gr.addColorStop(1, p[0]);
  g.fillStyle = gr; g.fillRect(x, y, w, h);
  if (c.tipo === 1 || c.tipo === 3) {
    // un retrato: una figura oscura con la cara iluminada
    g.fillStyle = p[0]; g.beginPath(); g.ellipse(x + w / 2, y + h, w * 0.4, h * 0.45, 0, 0, TAU); g.fill();
    g.fillStyle = p[2]; g.beginPath(); g.ellipse(x + w / 2, y + h * 0.42, w * 0.12, h * 0.14, 0, 0, TAU); g.fill();
  } else {
    // un paisaje o una escena: cielo claro, colinas, unas figuras
    g.fillStyle = p[2]; g.globalAlpha = 0.35; g.fillRect(x, y, w, h * 0.45); g.globalAlpha = 1;
    for (let i = 0; i < 3; i++) { g.fillStyle = i % 2 ? p[0] : p[1]; g.beginPath(); g.ellipse(x + a() * w, y + h * (0.55 + i * 0.12), w * (0.4 + a() * 0.3), h * 0.15, 0, 0, TAU); g.fill(); }
    for (let i = 0; i < 4; i++) { g.fillStyle = ["#e0c080", "#a03a2a", "#2a2a3a"][i % 3]; g.beginPath(); g.ellipse(x + w * (0.2 + a() * 0.6), y + h * (0.65 + a() * 0.15), w * 0.025, h * 0.08, 0, 0, TAU); g.fill(); }
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red, x, y, w, h); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  g.restore();
}

let _salon = null;
function pintarSalon() {
  const c = k.lienzo(SW, SH), g = c.getContext("2d");
  // la pared: rojo oscuro, con su textura de tela
  let gr = g.createLinearGradient(0, 0, 0, SUELO);
  gr.addColorStop(0, "#3a0e10"); gr.addColorStop(0.35, "#7a2222"); gr.addColorStop(1, "#5a1618");
  g.fillStyle = gr; g.fillRect(0, 0, SW, SUELO);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45;
  for (let y = 0; y < SUELO; y += 768) for (let x = 0; x < SW; x += 768) g.drawImage(k.red, x, y);
  g.globalAlpha = 0.3; for (let y = 0; y < SUELO; y += 384) for (let x = 0; x < SW; x += 384) g.drawImage(k.manchas, x, y);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // la luz cenital del techo de cristal: más clara arriba en el centro
  gr = g.createRadialGradient(SW / 2, -200, 100, SW / 2, 400, 1800);
  gr.addColorStop(0, "rgba(255,220,170,0.35)"); gr.addColorStop(1, "rgba(255,220,170,0)");
  g.fillStyle = gr; g.fillRect(0, 0, SW, SUELO);
  // la cornisa dorada arriba
  gr = g.createLinearGradient(0, 120, 0, 230); gr.addColorStop(0, "#3a2808"); gr.addColorStop(0.4, "#d8b060"); gr.addColorStop(0.7, "#7a5518"); gr.addColorStop(1, "#2a1a05");
  g.fillStyle = gr; g.fillRect(0, 120, SW, 110);
  gr = g.createLinearGradient(0, 0, 0, 120); gr.addColorStop(0, "#d9cdb0"); gr.addColorStop(1, "#a89a7a");
  g.fillStyle = gr; g.fillRect(0, 0, SW, 120);
  // los cuadros
  for (const q of CUADROS) pintarCuadro(g, q);
  // la marca más clara de la pared donde va la Mona Lisa (se ve cuando no está) y los cuatro ganchos
  const w = MLH * ML_W / ML_H, b = MLH * 0.075;
  g.fillStyle = "rgba(205,115,100,0.32)"; g.fillRect(MLX - w / 2 - b, MLY - MLH / 2 - b, w + 2 * b, MLH + 2 * b);
  for (const [gx, gy] of GANCHOS) gancho(g, gx, gy, 1);
  // el zócalo de madera y el parquet
  gr = g.createLinearGradient(0, SUELO - 140, 0, SUELO); gr.addColorStop(0, "#3a2010"); gr.addColorStop(0.3, "#6a3e1e"); gr.addColorStop(1, "#24130a");
  g.fillStyle = gr; g.fillRect(0, SUELO - 140, SW, 140);
  gr = g.createLinearGradient(0, SUELO, 0, SH); gr.addColorStop(0, "#5a3418"); gr.addColorStop(1, "#8a5428");
  g.fillStyle = gr; g.fillRect(0, SUELO, SW, SH - SUELO);
  g.strokeStyle = "rgba(30,15,5,0.5)"; g.lineWidth = 3;
  for (let i = -40; i < 40; i++) { g.beginPath(); g.moveTo(SW / 2 + i * 60, SUELO); g.lineTo(SW / 2 + i * 260, SH); g.stroke(); }
  for (let y = SUELO + 30, d = 30; y < SH; d *= 1.35, y += d) { g.beginPath(); g.moveTo(0, y); g.lineTo(SW, y); g.stroke(); }
  // el brillo del suelo encerado
  gr = g.createRadialGradient(SW / 2, SUELO + 200, 50, SW / 2, SUELO + 200, 1200);
  gr.addColorStop(0, "rgba(255,210,150,0.25)"); gr.addColorStop(1, "rgba(255,210,150,0)");
  g.fillStyle = gr; g.fillRect(0, SUELO, SW, SH - SUELO);
  return k.fijar(c);
}
export const salon = () => (_salon ??= pintarSalon());

// Un gancho de hierro en la pared, en (x, y), de escala s.
export function gancho(g, x, y, s = 1, brillo = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.ellipse(4, 6, 13, 13, 0, 0, TAU); g.fill();
  const gr = g.createRadialGradient(-4, -4, 1, 0, 0, 14); gr.addColorStop(0, "#c8c8c8"); gr.addColorStop(1, "#2a2a2a");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 12, 0, TAU); g.fill();
  g.strokeStyle = "#1a1a1a"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 16); g.quadraticCurveTo(0, 26, 10, 22); g.stroke();
  g.strokeStyle = "#9a9a9a"; g.lineWidth = 2; g.beginPath(); g.moveTo(-2, 2); g.lineTo(-2, 15); g.stroke();
  g.restore();
  if (brillo > 0) k.brillo(g, x, y, 120 * s, "255,230,180", brillo);
}

// La cámara del Salon: (cx, cy) es el punto del Salon que queda en el centro de la pantalla; z, el zoom.
export function camSalon(g, cx, cy, z) { g.translate(540, 960); g.scale(z, z); g.translate(-cx, -cy); }

// El Salon entero, con o sin la Mona Lisa en su sitio. op.mona: { dx, dy, rot, esc, al } para moverla.
export function dibujaSalon(g, cx, cy, z, op = {}) {
  g.save(); camSalon(g, cx, cy, z);
  g.drawImage(salon(), 0, 0);
  if (op.mona !== null && op.mona !== undefined) {
    const m = op.mona;
    g.save(); g.globalAlpha *= m.al ?? 1;
    g.translate(MLX + (m.dx || 0), MLY + (m.dy || 0)); g.rotate(m.rot || 0); g.scale(m.esc || 1, m.esc || 1);
    monaEnMarco(g, 0, 0, MLH, { marco: m.marco });
    g.restore();
  }
  if (op.encima) op.encima(g);
  g.restore();
}

// ------------------------------------------------------------------ la oscuridad y la linterna
const _osc = k.fijar(k.lienzo(1080, 1920));
// Oscurece la imagen menos donde da la luz. luces: [{ x, y, r, al }]. fondo: lo oscura que queda el resto (0-1).
export function oscuridad(g, luces, fondo = 0.9, color = "4,6,14") {
  const o = _osc.getContext("2d");
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = "source-over"; o.globalAlpha = 1;
  o.clearRect(0, 0, 1080, 1920);
  o.fillStyle = `rgba(${color},${fondo})`; o.fillRect(0, 0, 1080, 1920);
  o.globalCompositeOperation = "destination-out";
  for (const l of luces) {
    const gr = o.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
    gr.addColorStop(0, `rgba(0,0,0,${l.al ?? 1})`); gr.addColorStop(0.6, `rgba(0,0,0,${0.8 * (l.al ?? 1)})`); gr.addColorStop(1, "rgba(0,0,0,0)");
    o.fillStyle = gr; o.fillRect(0, 0, 1080, 1920);
  }
  g.drawImage(_osc, 0, 0);
  // el color cálido de la luz
  g.save(); g.globalCompositeOperation = "lighter";
  for (const l of luces) { const gr = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); gr.addColorStop(0, `rgba(255,220,160,${0.16 * (l.al ?? 1)})`); gr.addColorStop(1, "rgba(255,220,160,0)"); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920); }
  g.restore();
}

// ------------------------------------------------------------------ la gente de 1911 (siluetas)
// Una persona de pie en (x, y) = sus pies, de alto h. op: { ropa, sombrero ("bombin"|"gorra"|"kepi"|"dama"|null),
// paso (fase de andar, en radianes; null = quieto), anda (0-1), bulto (0-1: el cuadro bajo la bata), luz (borde),
// espalda (true: de espaldas) }.
export function persona(g, x, y, h, op = {}) {
  const ropa = op.ropa ?? "#15161c", piel = op.piel ?? "#2a2020";
  const anda = op.anda ?? 0, ph = op.paso ?? 0;
  const sw = Math.sin(ph) * 0.32 * anda;
  g.save(); g.translate(x, y); g.scale(h / 1000, h / 1000);
  const rebote = -Math.abs(Math.cos(ph)) * 12 * anda;
  g.translate(0, rebote);
  // sombra en el suelo
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(0, -rebote, 170, 26, 0, 0, TAU); g.fill();
  // las piernas
  const pierna = (a, col) => {
    g.save(); g.translate(0, -470); g.rotate(a);
    g.fillStyle = col; g.beginPath(); g.moveTo(-42, 0); g.lineTo(42, 0); g.lineTo(30, 455); g.lineTo(-30, 455); g.closePath(); g.fill();
    g.fillStyle = "#0b0b0d"; g.beginPath(); g.ellipse(14, 462, 52, 20, 0, 0, TAU); g.fill();
    g.restore();
  };
  const pant = op.pantalon ?? "#101116";
  g.save(); g.translate(-45, 0); pierna(sw, pant); g.restore();
  g.save(); g.translate(45, 0); pierna(-sw, pant); g.restore();
  // los brazos (detrás del cuerpo un poco)
  const brazo = (lado, a) => {
    g.save(); g.translate(lado * 120, -800); g.rotate(a);
    g.fillStyle = op.bata ? "#cfcabb" : ropa; g.beginPath(); g.moveTo(-40, 0); g.lineTo(40, 0); g.lineTo(32, 330); g.lineTo(-32, 330); g.closePath(); g.fill();
    g.fillStyle = piel; g.beginPath(); g.ellipse(0, 352, 26, 34, 0, 0, TAU); g.fill();
    g.restore();
  };
  if (!op.sinBrazos) { brazo(-1, -sw * 0.8 + (op.brazoI ?? 0.06)); brazo(1, sw * 0.8 - (op.brazoD ?? 0.06)); }
  // el cuerpo: abrigo o bata, más largo con la bata
  const largo = op.bata ? 360 : 260;
  const gr = g.createLinearGradient(-150, 0, 150, 0);
  if (op.bata) { gr.addColorStop(0, "#9a988e"); gr.addColorStop(0.45, "#e8e4d6"); gr.addColorStop(1, "#b9b4a4"); }
  else { gr.addColorStop(0, ropa); gr.addColorStop(1, ropa); }
  g.fillStyle = gr; g.beginPath();
  g.moveTo(-120, -820); g.quadraticCurveTo(0, -850, 120, -820);
  const ab = op.bata ? 185 : 150;
  g.lineTo(ab, -470 + largo - 260); g.quadraticCurveTo(0, -470 + largo - 240, -ab, -470 + largo - 260); g.closePath(); g.fill();
  if (op.bata) {
    // los pliegues y botones de la bata
    g.strokeStyle = "rgba(120,115,100,0.6)"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(0, -810); g.lineTo(0, -470 + largo - 270); g.stroke();
    g.beginPath(); g.moveTo(-70, -700); g.lineTo(-95, -480 + largo - 270); g.moveTo(70, -700); g.lineTo(95, -480 + largo - 270); g.stroke();
    // el bulto rectangular del cuadro bajo la bata
    const bu = op.bulto ?? 0;
    if (bu > 0) {
      g.save(); g.globalAlpha *= bu;
      g.strokeStyle = "rgba(90,85,70,0.9)"; g.lineWidth = 7; g.strokeRect(-100, -760, 200, 300);
      const sh = g.createLinearGradient(-100, 0, 100, 0); sh.addColorStop(0, "rgba(255,255,255,0.0)"); sh.addColorStop(0.2, "rgba(255,255,255,0.35)"); sh.addColorStop(1, "rgba(60,55,45,0.35)");
      g.fillStyle = sh; g.fillRect(-100, -760, 200, 300);
      g.restore();
    }
  }
  // el cuello y la cabeza
  g.fillStyle = piel; g.fillRect(-26, -880, 52, 70);
  g.beginPath(); g.ellipse(0, -935, 62, 74, 0, 0, TAU); g.fill();
  if (op.pelo !== false) { g.fillStyle = "#0c0a08"; g.beginPath(); g.ellipse(0, -955, 64, 58, 0, Math.PI, TAU); g.fill(); }
  // el sombrero
  const s = op.sombrero;
  g.fillStyle = op.colorSombrero ?? "#0d0d10";
  if (s === "bombin") { g.beginPath(); g.ellipse(0, -985, 98, 18, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, -1000, 62, 58, 0, Math.PI, TAU); g.fill(); }
  else if (s === "gorra") { g.beginPath(); g.ellipse(0, -985, 70, 34, 0, Math.PI, TAU); g.fill(); g.beginPath(); g.ellipse(op.espalda ? -10 : 40, -982, 60, 12, 0, 0, TAU); g.fill(); }
  else if (s === "kepi") { g.fillRect(-58, -1050, 116, 70); g.beginPath(); g.ellipse(25, -982, 60, 12, 0, 0, TAU); g.fill(); g.fillStyle = "#c8a040"; g.fillRect(-58, -1000, 116, 8); }
  else if (s === "dama") { g.beginPath(); g.ellipse(0, -985, 150, 30, -0.05, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, -1005, 75, 50, 0, Math.PI, TAU); g.fill(); g.fillStyle = op.pluma ?? "#6a2a3a"; g.beginPath(); g.ellipse(50, -1040, 60, 18, -0.4, 0, TAU); g.fill(); }
  // el borde de luz
  if (op.luz) {
    g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,220,170,${op.luz})`; g.lineWidth = 10;

    g.beginPath(); g.moveTo(120, -820); g.lineTo(150, -470 + largo - 260); g.stroke();
    g.restore();
  }
  g.restore();
}

// Una cabeza y hombros de espaldas (para la multitud), en (x, y) = la base de los hombros, de ancho w.
export function espalda(g, x, y, w, tipo, col) {
  g.save(); g.translate(x, y); g.scale(w / 300, w / 300);
  g.fillStyle = col; g.beginPath(); g.moveTo(-150, 120); g.quadraticCurveTo(-150, -30, -60, -50); g.lineTo(60, -50); g.quadraticCurveTo(150, -30, 150, 120); g.closePath(); g.fill();
  g.fillRect(-28, -90, 56, 50);
  g.beginPath(); g.ellipse(0, -130, 58, 68, 0, 0, TAU); g.fill();
  g.fillStyle = "#08080a";
  if (tipo === 0) { g.beginPath(); g.ellipse(0, -168, 92, 16, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, -180, 58, 52, 0, Math.PI, TAU); g.fill(); }
  else if (tipo === 1) { g.beginPath(); g.ellipse(0, -170, 150, 28, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, -190, 70, 48, 0, Math.PI, TAU); g.fill(); }
  else if (tipo === 2) { g.fillRect(-70, -200, 140, 16); g.fillRect(-55, -260, 110, 64); }
  g.restore();
}

// Una multitud de espaldas: filas de cabezas que llenan la parte de abajo. n filas desde yTop hasta 1920+.
// t: para que se muevan un poco (se empujan). empuje: cuánto se mueven (0-1).
const MULT = (() => {
  const a = azar(77), L = [];
  for (let fila = 0; fila < 7; fila++) {
    const n = 7 + fila * 2;
    for (let i = 0; i < n; i++) L.push({ fila, u: (i + 0.5 + (a() - 0.5) * 0.7) / n, tipo: Math.floor(a() * 4), col: ["#141418", "#1c1a20", "#221c18", "#18181e"][Math.floor(a() * 4)], f: a() * 6 });
  }
  return L;
})();
export function multitud(g, t, yTop, op = {}) {
  const empuje = op.empuje ?? 0.2, filas = op.filas ?? 7, luz = op.luz ?? 0.25;
  for (let fila = 0; fila < filas; fila++) {
    const p = fila / 6, y = yTop + p * p * 900 + p * 250, w = 170 + p * 330, ancho = 1080 + p * 1300;
    for (const m of MULT) {
      if (m.fila !== fila) continue;
      const x = 540 + (m.u - 0.5) * ancho + Math.sin(t * 2.2 + m.f) * 18 * empuje * (1 + p);
      const yy = y + Math.abs(Math.sin(t * 3 + m.f)) * -14 * empuje;
      espalda(g, x, yy, w, m.tipo, m.col);
      if (luz > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,210,160,${luz * (1 - p * 0.6)})`; g.lineWidth = 3 + p * 3; g.beginPath(); g.ellipse(x, yy - (130 * w / 300), 58 * w / 300, 68 * w / 300, 0, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); g.restore(); }
    }
  }
}

// ------------------------------------------------------------------ los periódicos
const DIARIOS = [
  { cab: "EL DIARIO", tit: ["¡ROBARON LA", "MONA LISA!"] },
  { cab: "LE JOURNAL", tit: ["ON A VOLÉ", "LA JOCONDE!"] },
  { cab: "THE DAILY NEWS", tit: ["MONA LISA", "STOLEN!"] },
  { cab: "IL GIORNALE", tit: ["RUBATA LA", "GIOCONDA!"] },
  { cab: "LA PRENSA", tit: ["¿DÓNDE ESTÁ", "LA GIOCONDA?"] },
];
export const PW = 760, PH = 1000;
const _per = [];
export function periodico(i) {
  i = i % DIARIOS.length;
  if (_per[i]) return _per[i];
  const d = DIARIOS[i], c = k.lienzo(PW, PH), g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, PW, PH); gr.addColorStop(0, "#efe6cf"); gr.addColorStop(1, "#d9cdae");
  g.fillStyle = gr; g.fillRect(0, 0, PW, PH);
  g.fillStyle = "#151515"; g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.font = "800 82px Figtree"; g.fillText(d.cab, PW / 2, 100);
  g.fillRect(30, 122, PW - 60, 6); g.fillRect(30, 136, PW - 60, 2);
  g.font = "800 92px Figtree"; g.fillText(d.tit[0], PW / 2, 240); g.fillText(d.tit[1], PW / 2, 335);
  // la foto
  const fh = 520, fw = fh * ML_W / ML_H;
  g.drawImage(monaPeriodico(), 0, 0, ML_W, ML_H * 0.62, 40, 380, fw * 0.95, fh);
  g.strokeStyle = "#151515"; g.lineWidth = 3; g.strokeRect(40, 380, fw * 0.95, fh);
  // las columnas de texto
  g.fillStyle = "rgba(30,30,30,0.55)";
  const a = azar(90 + i);
  for (let col = 0; col < 2; col++) {
    const x0 = col === 0 ? 70 + fw * 0.95 : 70 + fw * 0.95, ww = PW - x0 - 40;
    if (col === 1) break;
    for (let yy = 395; yy < 900; yy += 22) g.fillRect(x0, yy, ww * (0.7 + a() * 0.3), 9);
  }
  for (let yy = 925; yy < PH - 20; yy += 22) g.fillRect(40, yy, (PW - 80) * (0.75 + a() * 0.25), 9);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, 0, 0, PW, PH); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  return (_per[i] = k.fijar(c));
}

// ------------------------------------------------------------------ fondos
// Un fondo oscuro con luz cálida (para sitios de noche, cuartos, comisarías).
export function fondoCuarto(g, col1 = "#2a1c12", col2 = "#0a0705", lx = 540, ly = 700) {
  const gr = g.createRadialGradient(lx, ly, 50, lx, ly, 1500);
  gr.addColorStop(0, col1); gr.addColorStop(1, col2);
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4;
  g.drawImage(k.red, 0, 0, 1080, 1080); g.drawImage(k.red, 0, 1080, 1080, 1080);
  g.restore();
}

// Velo oscuro arriba, detrás del subtítulo.
export function veloArriba(g, al = 0.5) {
  const vg = g.createLinearGradient(0, 200, 0, 640); vg.addColorStop(0, `rgba(5,5,10,${al})`); vg.addColorStop(1, "rgba(5,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
  g.fillStyle = `rgba(5,5,10,${al})`; g.fillRect(0, 0, 1080, 200);
}

// ------------------------------------------------------------------ la huella
// Una huella dactilar (un lazo), en líneas claras sobre transparente. 400 × 520.
let _hu = null;
export function huella() {
  if (_hu) return _hu;
  const c = k.lienzo(400, 520), g = c.getContext("2d");
  g.save(); g.beginPath(); g.ellipse(200, 260, 185, 250, 0, 0, TAU); g.clip();
  g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 7; g.lineCap = "round";
  // los lazos del centro
  for (let i = 0; i < 16; i++) {
    const r = 18 + i * 17;
    g.beginPath();
    for (let a = Math.PI * 0.95; a <= Math.PI * 2.05; a += 0.05) {
      const w = r * (1 + 0.05 * Math.sin(a * 5 + i));
      const x = 200 + Math.cos(a) * w * 0.8, y = 250 + Math.sin(a) * w;
      if (a === Math.PI * 0.95) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.lineTo(200 + r * 0.8 + 10, 250 + 40 + i * 6);
    g.stroke();
  }
  // las líneas de abajo, casi horizontales
  for (let i = 0; i < 12; i++) {
    const y = 300 + i * 20;
    g.beginPath(); g.moveTo(0, y + 30); g.quadraticCurveTo(200, y - 30 + i * 2, 400, y + 25); g.stroke();
  }
  g.restore();
  return (_hu = k.fijar(c));
}

// La silueta de una mano abierta (derecha si lado = 1, izquierda si -1), en (x, y) = el centro de la palma, de alto h.
export function manoSilueta(g, x, y, h, lado = 1, color = "rgba(255,255,255,0.9)") {
  g.save(); g.translate(x, y); g.scale(lado * h / 1000, h / 1000);
  g.fillStyle = color; g.strokeStyle = color; g.lineJoin = "round";
  k.redondo(g, -200, -120, 400, 430, 130); g.fill();
  const dedo = (dx, dy, w, l, r) => { g.save(); g.translate(dx, dy); g.rotate(r); k.redondo(g, -w / 2, -l, w, l + 60, w / 2); g.fill(); g.restore(); };
  dedo(-140, -80, 95, 300, -0.12); dedo(-45, -100, 100, 380, -0.03); dedo(55, -100, 98, 360, 0.04); dedo(150, -70, 88, 280, 0.13);
  dedo(-170, 160, 105, 280, -1.0);
  g.restore();
}
