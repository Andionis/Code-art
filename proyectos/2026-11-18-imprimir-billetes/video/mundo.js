// Lo que comparten los planos de este vídeo: el billete (el mismo verde en todo el vídeo), los billetes que vuelan en
// 3D, la rotativa que los imprime y su nave oscura.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar, F } = k;

// ---------------------------------------------------------------- el billete
// La textura se hace la primera vez que se dibuja (nunca fillText al cargar el módulo).
export const BW = 600, BH = 270;            // proporción del billete (como uno de verdad: ~2,2 : 1)
let texBillete = null;
function hacerBillete() {
  const l = k.lienzo(BW, BH), g = l.getContext("2d");
  const bg = g.createLinearGradient(0, 0, BW, BH);
  bg.addColorStop(0, "#1f6a42"); bg.addColorStop(0.35, "#5fae6e"); bg.addColorStop(0.55, "#b9e3a8"); bg.addColorStop(0.75, "#5fae6e"); bg.addColorStop(1, "#1d5e3b");
  k.redondo(g, 0, 0, BW, BH, 14); g.fillStyle = bg; g.fill();
  g.save(); k.redondo(g, 0, 0, BW, BH, 14); g.clip();
  // las líneas finas de seguridad (guilloché)
  g.lineWidth = 1.4;
  for (let i = 0; i < 26; i++) {
    g.strokeStyle = `rgba(${i % 2 ? "230,255,220" : "20,70,40"},0.32)`;
    g.beginPath();
    for (let x = 0; x <= BW; x += 6) { const y = 20 + i * 9.6 + 8 * Math.sin(x / 26 + i * 0.7) + 5 * Math.sin(x / 9 + i); x ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, 0, 0, BW, BH);
  g.restore();
  // los marcos
  g.strokeStyle = "#103d25"; g.lineWidth = 7; k.redondo(g, 14, 14, BW - 28, BH - 28, 10); g.stroke();
  g.strokeStyle = "rgba(235,255,225,0.7)"; g.lineWidth = 2.5; k.redondo(g, 26, 26, BW - 52, BH - 52, 8); g.stroke();
  // el medallón del centro: un sol con rayos
  const mx = BW / 2, my = BH / 2;
  const mg = g.createRadialGradient(mx - 20, my - 25, 8, mx, my, 92);
  mg.addColorStop(0, "#f2ffe8"); mg.addColorStop(0.6, "#8fcf8c"); mg.addColorStop(1, "#215f3d");
  g.fillStyle = mg; g.beginPath(); g.ellipse(mx, my, 80, 92, 0, 0, 6.28); g.fill();
  g.strokeStyle = "#103d25"; g.lineWidth = 5; g.stroke();
  g.strokeStyle = "rgba(16,61,37,0.75)"; g.lineWidth = 3;
  for (let i = 0; i < 24; i++) { const a = (i / 24) * 6.2832; g.beginPath(); g.moveTo(mx + Math.cos(a) * 26, my + Math.sin(a) * 30); g.lineTo(mx + Math.cos(a) * 60, my + Math.sin(a) * 70); g.stroke(); }
  g.fillStyle = "#1c5a37"; g.beginPath(); g.arc(mx, my, 24, 0, 6.28); g.fill();
  // las cifras de las esquinas
  g.fillStyle = "#0f3a23"; g.font = "900 78px Figtree"; g.textBaseline = "middle"; g.textAlign = "center";
  g.fillText("1", 74, 74); g.fillText("1", BW - 74, BH - 72);
  g.font = "800 30px Figtree"; g.fillText("UN BILLETE", BW - 128, 62); g.fillText("UN BILLETE", 128, BH - 60);
  // un brillo suave, como papel satinado
  const sg = g.createLinearGradient(0, 0, BW, BH * 0.6);
  sg.addColorStop(0, "rgba(255,255,255,0.25)"); sg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = sg; k.redondo(g, 0, 0, BW, BH, 14); g.fill();
  return l;
}
export const billeteTex = () => (texBillete ??= hacerBillete());

// Un billete plano en pantalla, centrado en (x, y), de ancho w, girado ang; flip (radianes) lo voltea sobre su eje
// largo (aleteo): de canto se ve fino y más oscuro.
export function billete(g, x, y, w, ang = 0, flip = 0, al = 1) {
  if (al <= 0.003 || w < 2) return;
  const c = Math.cos(flip), h = (w * BH) / BW;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y); g.rotate(ang); g.scale(1, Math.max(0.04, Math.abs(c)));
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = w * 0.06; g.shadowOffsetY = w * 0.03;
  g.drawImage(billeteTex(), -w / 2, -h / 2, w, h);
  g.shadowColor = "rgba(0,0,0,0)";
  // la luz según hacia dónde mira: de cara, brillo; de canto o del revés, sombra
  const osc = (1 - Math.abs(c)) * 0.55 + (c < 0 ? 0.18 : 0);
  if (osc > 0.02) { g.fillStyle = `rgba(4,20,12,${osc})`; g.fillRect(-w / 2, -h / 2, w, h); }
  const luz = Math.max(0, c) * Math.max(0, Math.sin(flip * 0.7 + ang * 2)) * 0.35;
  if (luz > 0.02) { g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(220,255,210,${luz})`; g.fillRect(-w / 2, -h / 2, w, h); }
  g.restore();
}

// Un billete en el mundo 3D: centro X, ancho s (unidades del mundo).
export function billete3D(g, cam, X, s, ang, flip, al = 1) {
  const p = k.proyecta(cam, X);
  if (!p || p.z < 0.3) return null;
  const w = (F * s) / p.z;
  if (w > 2600 || p.x < -w || p.x > 1080 + w || p.y < -w || p.y > 1920 + w) return null;
  return { z: p.z, dibuja: () => billete(g, p.x, p.y, w, ang, flip, al * Math.min(1, (p.z - 0.3) / 0.6)) };
}

// ---------------------------------------------------------------- la nave de la imprenta
const polvo = (() => { const az = azar(404); return Array.from({ length: 160 }, () => ({ x: az() * 1080, y: az() * 1920, s: 1 + az() * 3, f: az() * 6.28, v: 10 + az() * 30 })); })();
let texNave = null;
export function nave(g, t, tinte = 0) {
  texNave ??= k.tenir(k.ruido(256, 313, 3, 4, "manchas"), "#0f3b35");
  const bg = g.createRadialGradient(540, 820, 60, 540, 900, 1300);
  bg.addColorStop(0, k.mezColor("#1d5a4c", "#6a1a12", tinte)); bg.addColorStop(0.45, k.mezColor("#0b2722", "#2a0907", tinte)); bg.addColorStop(1, "#03080a");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.35; g.drawImage(texNave, -60 + Math.sin(t * 0.3) * 40, 0, 1200, 1920); g.restore();
  k.rayos(g, t, 1500, 0.8, 6, tinte > 0.5 ? "255,150,110" : "190,255,220");
  for (const m of polvo) { const y = (((m.y - t * m.v) % 1920) + 1920) % 1920; g.fillStyle = `rgba(220,255,230,${0.2 + 0.2 * Math.sin(t * 2 + m.f)})`; g.fillRect(m.x + 8 * Math.sin(t + m.f), y, m.s, m.s); }
}

// ---------------------------------------------------------------- la rotativa
// Dibujada de frente, centrada en (cx, cy) (la boca entre los dos rodillos), con s píxeles por unidad del mundo.
// gira: cuánto han girado los rodillos (en unidades de su superficie); furia: 0 a 1, tiembla y se pone al rojo.
const RW = 9.5, RR = 1.25;                  // medio ancho de los rodillos y su radio
function rodillo(g, cx, cy, s, gira, tono) {
  const x0 = cx - RW * s, w = RW * 2 * s, r = RR * s;
  const mg = g.createLinearGradient(0, cy - r, 0, cy + r);
  mg.addColorStop(0, "#2a3138"); mg.addColorStop(0.18, tono[0]); mg.addColorStop(0.38, "#f6fbff"); mg.addColorStop(0.55, tono[1]); mg.addColorStop(0.85, "#1c2228"); mg.addColorStop(1, "#0b0e11");
  g.fillStyle = mg; g.fillRect(x0, cy - r, w, r * 2);
  // las ranuras grabadas, que giran (se aprietan hacia los bordes del cilindro)
  g.save(); g.beginPath(); g.rect(x0, cy - r, w, r * 2); g.clip();
  g.strokeStyle = "rgba(10,14,18,0.55)"; g.lineWidth = Math.max(1, s * 0.06);
  for (let i = 0; i < 12; i++) {
    const a = ((((i / 12) * 6.2832 + gira / RR) % 6.2832) + 6.2832) % 6.2832;
    if (Math.cos(a) <= 0.05) continue;
    const y = cy - Math.sin(a) * r;
    g.globalAlpha = Math.cos(a); g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w, y); g.stroke();
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.12; g.drawImage(k.red, x0, cy - r, w, r * 2);
  g.restore();
}
export function rotativa(g, cx, cy, s, t, gira, furia = 0) {
  const sx = furia * Math.sin(t * 61) * 0.06 * s, sy = furia * Math.cos(t * 47) * 0.05 * s;
  cx += sx; cy += sy;
  // el cuerpo: un bloque de hierro pintado, detrás de los rodillos
  const cuerpo = (x, y, w, h, c1, c2) => { const gg = g.createLinearGradient(x, y, x, y + h); gg.addColorStop(0, c1); gg.addColorStop(1, c2); k.redondo(g, x, y, w, h, s * 0.4); g.fillStyle = gg; g.fill(); };
  // el suelo, con el reflejo de la boca
  const sy0 = cy + 7.5 * s, fg = g.createLinearGradient(0, sy0, 0, 1920);
  fg.addColorStop(0, "#16302b"); fg.addColorStop(1, "#040a09");
  g.fillStyle = fg; g.fillRect(0, sy0, 1080, Math.max(0, 1920 - sy0));
  g.save(); g.globalCompositeOperation = "lighter";
  const rg = g.createRadialGradient(cx, sy0 + 40, 10, cx, sy0 + 40, 12 * s); rg.addColorStop(0, `rgba(${k.mezRgb("120,255,170", "255,120,80", furia)},0.35)`); rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg; g.fillRect(cx - 12 * s, sy0, 24 * s, 12 * s); g.restore();
  // las patas
  for (const lado of [-1, 1]) cuerpo(cx + lado * (RW - 0.5) * s - 0.9 * s, cy + 4 * s, 1.8 * s, 3.6 * s, "#25424d", "#0a1418");
  // la campana de arriba, con su panel de luces cálidas
  cuerpo(cx - (RW - 0.6) * s, cy - 10.5 * s, (RW - 0.6) * 2 * s, 5 * s, k.mezColor("#3b6676", "#6e2a22", furia), "#16303a");
  g.fillStyle = "rgba(255,255,255,0.16)"; g.fillRect(cx - (RW - 1) * s, cy - 10.4 * s, (RW - 1) * 2 * s, 0.12 * s);
  for (let i = 0; i < 7; i++) {
    const lx = cx + (i - 3) * 1.9 * s, ly = cy - 8 * s, on = 0.6 + 0.4 * Math.sin(t * 6 + i * 1.3 + furia * t * 20);
    g.fillStyle = `rgb(${k.mezRgb("255,190,90", "255,80,60", furia)})`; g.beginPath(); g.arc(lx, ly, 0.28 * s, 0, 6.28); g.fill();
    k.brillo(g, lx, ly, 2.4 * s, furia > 0.3 ? "255,90,60" : "255,190,90", on);
  }
  cuerpo(cx - (RW + 1.4) * s, cy - 6.5 * s, (RW + 1.4) * 2 * s, 11 * s, k.mezColor("#2e4f5c", "#5c2420", furia), "#0d1a1f");
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.08; g.drawImage(k.red, cx - (RW + 1.4) * s, cy - 6.5 * s, (RW + 1.4) * 2 * s, 11 * s); g.restore();
  g.fillStyle = "rgba(255,255,255,0.14)"; g.fillRect(cx - (RW + 1.2) * s, cy - 6.45 * s, (RW + 1.2) * 2 * s, 0.1 * s);
  // la boca: luz verde entre los rodillos
  const bg = g.createLinearGradient(0, cy - 0.6 * s, 0, cy + 0.6 * s);
  bg.addColorStop(0, "rgba(120,255,170,0)"); bg.addColorStop(0.5, `rgba(${k.mezRgb("170,255,190", "255,150,90", furia)},1)`); bg.addColorStop(1, "rgba(120,255,170,0)");
  g.fillStyle = bg; g.fillRect(cx - RW * s, cy - 0.6 * s, RW * 2 * s, 1.2 * s);
  rodillo(g, cx, cy - RR * s - 0.12 * s, s, gira, ["#7c8794", "#aab5c2"]);
  rodillo(g, cx, cy + RR * s + 0.12 * s, s, -gira, ["#7c8794", "#aab5c2"]);
  // las placas laterales con sus tornillos y el engranaje
  for (const lado of [-1, 1]) {
    const px = cx + lado * (RW + 0.7) * s;
    cuerpo(px - 1.1 * s, cy - 4.2 * s, 2.2 * s, 8.4 * s, k.mezColor("#3d6878", "#8a2c22", furia), "#122830");
    g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(px - 1.1 * s, cy - 4.2 * s, 2.2 * s, 0.15 * s);
    for (const dy of [-3.4, -1.3, 1.3, 3.4]) {
      const bx = px, by = cy + dy * s, br = 0.22 * s;
      const tg = g.createRadialGradient(bx - br * 0.3, by - br * 0.3, br * 0.1, bx, by, br);
      tg.addColorStop(0, "#e9eef2"); tg.addColorStop(1, "#3a444c");
      g.fillStyle = tg; g.beginPath(); g.arc(bx, by, br, 0, 6.28); g.fill();
    }
  }
  // el engranaje grande, arriba a la izquierda, girando con los rodillos
  engranaje(g, cx - (RW + 0.2) * s, cy - 6.2 * s, 2.6 * s, gira / 2.6);
  engranaje(g, cx + (RW - 2.4) * s, cy - 10.3 * s, 1.6 * s, -gira / 1.6);
  // la luz de aviso: verde que respira; con furia, roja y parpadeando suave
  const lx = cx + (RW + 0.6) * s, ly = cy - 5.4 * s;
  const lc = furia > 0.3 ? "255,70,50" : "120,255,150", la = furia > 0.3 ? 0.6 + 0.4 * Math.sin(t * 10) : 0.7;
  g.fillStyle = `rgb(${lc})`; g.beginPath(); g.arc(lx, ly, 0.35 * s, 0, 6.28); g.fill();
  k.brillo(g, lx, ly, 3.5 * s, lc, la);
  k.brillo(g, cx, cy, 14 * s, furia > 0.3 ? "255,120,80" : "120,255,170", 0.35 + 0.25 * furia);
}
export function engranaje(g, x, y, r, a) {
  g.save(); g.translate(x, y); g.rotate(a);
  g.beginPath();
  const n = 14;
  for (let i = 0; i < n * 2; i++) { const aa = (i / (n * 2)) * 6.2832, rr = i % 2 ? r * 0.82 : r; const a0 = aa - 0.11, a1 = aa + 0.11; g.lineTo(Math.cos(a0) * rr, Math.sin(a0) * rr); g.lineTo(Math.cos(a1) * rr, Math.sin(a1) * rr); }
  g.closePath();
  const gg = g.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  gg.addColorStop(0, "#f0d78a"); gg.addColorStop(0.6, "#b8862e"); gg.addColorStop(1, "#5a3a10");
  g.fillStyle = gg; g.fill();
  g.strokeStyle = "rgba(40,25,5,0.6)"; g.lineWidth = r * 0.04; g.stroke();
  g.fillStyle = "#3a2508"; g.beginPath(); g.arc(0, 0, r * 0.22, 0, 6.28); g.fill();
  g.fillStyle = "rgba(255,240,190,0.5)";
  for (let i = 0; i < 5; i++) { const aa = (i / 5) * 6.2832; g.beginPath(); g.arc(Math.cos(aa) * r * 0.52, Math.sin(aa) * r * 0.52, r * 0.1, 0, 6.28); g.fill(); }
  g.restore();
}

// ---------------------------------------------------------------- billetes que salen de la boca
// Un chorro: billetes que nacen en la boca (0, 0, 0) cada 1/ritmo s y vuelan hacia +z (hacia la cámara), con aleteo.
// Devuelve la lista para k.deLejosACerca. desde/hasta: entre qué segundos nacen.
const azC = azar(909);
const CHORRO = Array.from({ length: 900 }, () => ({ dx: (azC() - 0.5) * 2, dy: (azC() - 0.3), v: 9 + azC() * 7, a0: azC() * 6.28, va: (azC() - 0.5) * 4, f0: azC() * 6.28, vf: 4 + azC() * 6, s: 2.2 + azC() * 0.8, j: azC() }));
export function chorro(g, cam, t, { desde = -6, ritmo = 60, vel = 1, abre = 1, al = 1, hasta = 1e9 } = {}) {
  const out = [];
  for (let i = 0; i < CHORRO.length; i++) {
    const b = CHORRO[i], te = desde + (i + b.j * 0.8) / ritmo;
    if (te > t || te > hasta) break;
    const a = (t - te) * vel;
    if (a > 4) continue;
    const X = [b.dx * RW * 0.9 + b.dx * a * 4 * abre, b.dy * a * 3 * abre - 1.2 * a * a * 0.3, a * b.v];
    const o = billete3D(g, cam, X, b.s, b.a0 + b.va * a, b.f0 + b.vf * a, al);
    if (o) out.push(o);
  }
  return out;
}

// Una explosión de billetes desde un punto P, en el segundo t0: salen en todas direcciones y caen despacio.
const azE = azar(4242);
const EXPLO = Array.from({ length: 260 }, () => { const th = azE() * 6.2832, ph = Math.acos(1 - azE() * 1.2); return { d: [Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph)], v: 6 + azE() * 16, a0: azE() * 6.28, va: (azE() - 0.5) * 6, f0: azE() * 6.28, vf: 3 + azE() * 7, s: 2 + azE() * 1.2 }; });
export function explosion(g, cam, t, t0, P, { n = 260, fuerza = 1, al = 1, sinFreno = false } = {}) {
  const out = [], u = t - t0;
  if (u <= 0) return out;
  for (let i = 0; i < n; i++) {
    const b = EXPLO[i], fr = sinFreno ? u * (1 + u) : Math.min(u, 0.5) + Math.max(0, u - 0.5) * 0.25;   // frenan como papel en el aire
    const X = [P[0] + b.d[0] * b.v * fr * fuerza, P[1] + b.d[1] * b.v * fr * fuerza - 1.5 * u * u, P[2] + b.d[2] * b.v * fr * fuerza];
    const o = billete3D(g, cam, X, b.s, b.a0 + b.va * u, b.f0 + b.vf * u, al);
    if (o) out.push(o);
  }
  return out;
}

export const velo = (g, al = 0.55) => { const vg = g.createLinearGradient(0, 180, 0, 640); vg.addColorStop(0, `rgba(2,8,6,${al})`); vg.addColorStop(1, "rgba(2,8,6,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 640); };
export const destello = (g, al, c = "255,255,255") => { if (al > 0.003) { g.fillStyle = `rgba(${c},${Math.min(1, al)})`; g.fillRect(0, 0, 1080, 1920); } };
export { su, tr, mez };
