// Lo que comparten los planos de este vídeo: el túnel de la nariz, el moco y lo que atrapa (polen, virus, polvo).
import * as k from "#kit";

const { azar, proyecta, F } = k;

// ---------------------------------------------------------------- el túnel de la nariz
// Un túnel de carne rosada y húmeda. La cámara va por dentro mirando hacia -z; d es lo que ha avanzado.
export const R = 1.5;
export const eje = (z) => [0.4 * Math.sin(z * 0.17), 0.3 * Math.cos(z * 0.13) - 0.3, 0];
const N = 56, ANG = Array.from({ length: N }, (_, i) => (i / N) * 6.2832);
// el radio de la pared en cada ángulo, con sus pliegues
const radio = (a, zz) => R * (1 + 0.1 * Math.sin(3 * a + zz * 0.7) + 0.06 * Math.sin(5 * a - zz * 1.3));

// Los colores de la carne: de cerca rosa claro, de lejos rojo oscuro. irrita (0-1) la vuelve roja e hinchada.
const carne = (luz, pliegue, irrita) => {
  const base = k.mezRgb(k.mezRgb("70,8,22", "236,120,132", luz), k.mezRgb("80,4,10", "236,52,52", luz), irrita);
  return k.mezRgb(base, "40,0,8", 0.18 * pliegue);
};

// Dibuja el túnel. o: { irrita, estrecha(zz) → factor del radio (para el trago), largo }
export function tunel(g, cam, d, o = {}) {
  const irrita = o.irrita || 0, largo = o.largo || 26, paso = 0.55, estrecha = o.estrecha || (() => 1);
  // el fondo: lo más lejano, oscuro y con un brillo rojo
  g.fillStyle = k.mezColor("#1c0208", "#2a0204", irrita); g.fillRect(0, 0, 1080, 1920);
  const lejos = proyecta(cam, [...eje(largo + d).slice(0, 2), -largo]);
  if (lejos) k.brillo(g, lejos.x, lejos.y, 700, irrita > 0.5 ? "255,80,60" : "255,110,120", 0.35);
  for (let i = Math.floor(largo / paso); i >= 0; i--) {
    const zz = i * paso - (d % paso) + 0.25, z = -zz, c = eje(zz + d), est = estrecha(zz);
    const P = [];
    let ok = true;
    for (const a of ANG) {
      const r = radio(a, zz + d) * est * (1 + 0.08 * irrita);
      const q = proyecta(cam, [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r * 0.9, z]);
      if (!q) { ok = false; break; }
      P.push(q);
    }
    if (!ok) continue;
    const luz = Math.min(1, Math.pow(1.9 / zz, 1.35)), pliegue = 0.5 + 0.5 * Math.sin((zz + d) * 2.1);
    g.beginPath(); g.rect(-60, -60, 1200, 2040);
    g.moveTo(P[0].x, P[0].y); for (let j = 1; j < N; j++) g.lineTo(P[j].x, P[j].y); g.closePath();
    g.fillStyle = `rgb(${carne(luz, pliegue, irrita)})`; g.fill("evenodd");
    // el borde húmedo del pliegue: brilla por arriba (de donde viene la luz)
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    g.strokeStyle = `rgba(255,215,220,${0.3 * luz * luz * (0.3 + 0.7 * pliegue)})`; g.lineWidth = Math.max(1, 34 * luz * luz);
    g.beginPath();
    for (let j = Math.floor(N * 0.55); j < Math.floor(N * 0.95); j++) { const q = P[j]; j === Math.floor(N * 0.55) ? g.moveTo(q.x, q.y) : g.lineTo(q.x, q.y); }
    g.stroke(); g.restore();
  }
  // la textura de la carne y su humedad
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35;
  g.drawImage(k.manchas, -300 + ((d * 40) % 200), -300, 1680, 2520); g.restore();
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.08; g.drawImage(k.red, -200, -200, 1480, 2320); g.restore();
}

// Un punto de la pared (ángulo a, profundidad zz delante de la cámara), un poco hacia dentro (h: 0 en la pared).
export function enPared(d, a, zz, h = 0, irrita = 0) {
  const c = eje(zz + d), r = radio(a, zz + d) * (1 + 0.08 * irrita) * (1 - h);
  return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r * 0.9, -zz];
}

// ---------------------------------------------------------------- el moco
// Una bola de moco brillante que tiembla. tono 0: claro y transparente (el de siempre); 1: amarillo verdoso; 2: verde.
const TONOS = [
  ["rgba(255,250,245,0.30)", "rgba(250,225,230,0.42)", "rgba(255,245,240,0.85)"],
  ["#f4f59a", "#c7d94e", "#7d9a1f"],
  ["#c9f27a", "#6fc12e", "#2f6d10"],
];
const mezT = (a, b, u) => {
  const p = (s) => s.startsWith("#") ? [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), 1] : s.slice(5, -1).split(",").map(Number);
  const x = p(a), y = p(b);
  return `rgba(${x.slice(0, 3).map((v, i) => Math.round(v + (y[i] - v) * u)).join(",")},${(x[3] + (y[3] - x[3]) * u).toFixed(3)})`;
};
export function colorMoco(tono, i) {
  const a = Math.min(2, Math.max(0, Math.floor(tono))), b = Math.min(2, a + 1), u = Math.min(1, tono - a);
  return mezT(TONOS[a][i], TONOS[b][i], u);
}

// moco(g, x, y, r, t, semilla, o): o = { tono, estira (alarga hacia abajo), al, temblor }
export function moco(g, x, y, r, t, semilla = 1, o = {}) {
  if (r < 1) return;
  const tono = o.tono ?? 1, estira = o.estira ?? 0, tiembla = o.temblor ?? 1, az = azar(semilla);
  const fases = [az() * 6.28, az() * 6.28, az() * 6.28];
  g.save(); g.globalAlpha *= o.al ?? 1;
  g.translate(x, y);
  // la forma: un círculo que ondula y se alarga hacia abajo (cuelga)
  g.beginPath();
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * 6.2832, s = Math.sin(a);
    const w = 1 + tiembla * (0.06 * Math.sin(3 * a + t * 5 + fases[0]) + 0.04 * Math.sin(5 * a - t * 7 + fases[1]));
    const rr = r * w * (1 + (s > 0 ? estira * s * s : 0));
    const px = Math.cos(a) * rr * (1 - 0.25 * estira * Math.max(0, s)), py = s * rr;
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.closePath();
  const cy = r * estira * 0.4;
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35 + cy, r * 0.05, 0, cy, r * (1.05 + estira * 0.5));
  gr.addColorStop(0, colorMoco(tono, 0)); gr.addColorStop(0.6, colorMoco(tono, 1)); gr.addColorStop(1, colorMoco(tono, 2));
  g.fillStyle = gr; g.fill();
  // el borde, un poco más oscuro, y la luz que pasa por dentro (es translúcido)
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.25; g.drawImage(k.manchas, -r * 1.2 + fases[2] * 3, -r * 1.2, r * 2.4, r * 2.4 * (1 + estira));
  g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  const in2 = g.createRadialGradient(r * 0.25, r * 0.35 + cy, 0, r * 0.25, r * 0.35 + cy, r * 0.7);
  in2.addColorStop(0, `rgba(255,255,200,${0.22})`); in2.addColorStop(1, "rgba(255,255,200,0)");
  g.fillStyle = in2; g.beginPath(); g.arc(r * 0.25, r * 0.35 + cy, r * 0.7, 0, 6.2832); g.fill();
  // burbujitas dentro
  for (let b = 0; b < 4; b++) {
    const bx = (az() - 0.5) * r, by = (az() - 0.5) * r + cy, br = r * (0.04 + az() * 0.07);
    g.strokeStyle = "rgba(255,255,240,0.35)"; g.lineWidth = Math.max(1, br * 0.25); g.beginPath(); g.arc(bx, by, br, 0, 6.2832); g.stroke();
  }
  // el brillo húmedo: una mancha blanca arriba a la izquierda y un borde de luz
  const hx = -r * 0.36, hy = -r * 0.42, hg = g.createRadialGradient(hx, hy, 0, hx, hy, r * 0.3);
  hg.addColorStop(0, "rgba(255,255,255,0.95)"); hg.addColorStop(0.45, "rgba(255,255,255,0.6)"); hg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = hg; g.beginPath(); g.ellipse(hx, hy, r * 0.3, r * 0.17, -0.6, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.beginPath(); g.ellipse(-r * 0.12, -r * 0.62, r * 0.07, r * 0.04, -0.3, 0, 6.2832); g.fill();
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- lo que atrapa el moco
// Un virus: una bola morada con pinchos y corona.
export function virus(g, x, y, r, ang = 0, al = 1) {
  if (r < 1) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * 6.2832;
    g.strokeStyle = "#7b3bb0"; g.lineWidth = r * 0.12; g.lineCap = "round";
    g.beginPath(); g.moveTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); g.lineTo(Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3); g.stroke();
    const pg = g.createRadialGradient(Math.cos(a) * r * 1.33, Math.sin(a) * r * 1.33, 0, Math.cos(a) * r * 1.35, Math.sin(a) * r * 1.35, r * 0.2);
    pg.addColorStop(0, "#ff9de0"); pg.addColorStop(1, "#c03c9a");
    g.fillStyle = pg; g.beginPath(); g.arc(Math.cos(a) * r * 1.35, Math.sin(a) * r * 1.35, r * 0.17, 0, 6.2832); g.fill();
  }
  const gr = g.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  gr.addColorStop(0, "#d9a4ff"); gr.addColorStop(0.55, "#8e4fd0"); gr.addColorStop(1, "#3c1470");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.4; g.drawImage(k.manchas, -r, -r, r * 2, r * 2); g.restore();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(-r * 0.4, -r * 0.45, r * 0.22, r * 0.12, -0.6, 0, 6.2832); g.fill();
  g.restore();
}

// Un grano de polen: una bola amarilla llena de pinchitos.
export function polen(g, x, y, r, ang = 0, al = 1) {
  if (r < 1) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  g.fillStyle = "#c98a0c";
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * 6.2832;
    g.beginPath(); g.moveTo(Math.cos(a - 0.12) * r * 0.92, Math.sin(a - 0.12) * r * 0.92); g.lineTo(Math.cos(a) * r * 1.22, Math.sin(a) * r * 1.22); g.lineTo(Math.cos(a + 0.12) * r * 0.92, Math.sin(a + 0.12) * r * 0.92); g.fill();
  }
  const gr = g.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  gr.addColorStop(0, "#fff3a0"); gr.addColorStop(0.5, "#f5c21b"); gr.addColorStop(1, "#a96a06");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.5; g.drawImage(k.red, -r * 1.2, -r * 1.2, r * 2.4, r * 2.4); g.restore();
  g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(-r * 0.4, -r * 0.45, r * 0.2, r * 0.1, -0.6, 0, 6.2832); g.fill();
  g.restore();
}

// Una mota de polvo: una piedrecita gris marrón irregular.
export function polvo(g, x, y, r, semilla = 1, al = 1) {
  if (r < 1) return;
  const az = azar(semilla);
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(az() * 6.28);
  g.beginPath();
  for (let i = 0; i < 9; i++) { const a = (i / 9) * 6.2832, rr = r * (0.7 + az() * 0.45); i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  g.closePath();
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 1.1);
  gr.addColorStop(0, "#e2e2e6"); gr.addColorStop(0.55, "#8a8a94"); gr.addColorStop(1, "#3a3a44");
  g.fillStyle = gr; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.6; g.drawImage(k.red, -r, -r, r * 2, r * 2); g.restore();
  g.restore();
}

// El velo oscuro de arriba, para que el subtítulo se lea sobre la carne clara.
export function velo(g, al = 0.6) {
  const vg = g.createLinearGradient(0, 200, 0, 640);
  vg.addColorStop(0, `rgba(25,2,8,${al})`); vg.addColorStop(1, "rgba(25,2,8,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export { F };
