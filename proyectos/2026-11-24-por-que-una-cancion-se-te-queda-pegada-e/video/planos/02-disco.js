// «Y ni siquiera es la canción entera: es un pedacito que se repite solo, como un disco rayado.»
// - El tocadiscos de cerca: el disco negro girando, la aguja tocando y notas que suben de ella.
// - «canción entera»: todos los surcos se encienden de colores.
// - «pedacito»: solo queda encendido un anillo, con una raya al final. La cámara baja hacia la aguja.
// - «repite» y «rayado»: cada vez que la raya pasa por la aguja, chispazo y la aguja salta atrás.
import * as k from "#kit";
import { v } from "#voz";
import { NEON, fondo, nota, velo } from "../mundo.js";

export const desde = (vv) => vv.frase(2).inicio;

const { suave: su, tramo: tr, mez, pulso } = k;
const f2 = v.frase(2);
const Tini = f2.inicio, Tcan = f2.t("cancion"), Tped = f2.t("pedacito"), Trep = f2.t("repite"), Tray = f2.t("rayado"), Tfin = f2.fin;

const CX = 560, CY = 1120, RX = 660, RY = 430;
const W = 3.5;                     // el giro del disco (rad/s)
const AGUJA = -1.0;                // el ángulo (en pantalla) donde toca la aguja
const RB = 0.7;                    // el radio del anillo encendido
// la raya pasa por la aguja en «rayado» y una vuelta antes
const fase = (t) => W * (t - Tray);            // 0 en «rayado»
const SALTOS = [Tray - 6.2832 / W, Tray].filter((x) => x > Tped - 0.1);
export const momentos = { saltos: SALTOS, pedacito: Tped };

const punto = (ang, r) => [CX + Math.cos(ang) * RX * r, CY + Math.sin(ang) * RY * r];

export function dibuja(g, t) {
  // la cámara baja hacia la aguja
  const acerca = su(tr(t, Tped - 0.2, Trep + 0.3));
  const foco = punto(AGUJA, RB), esc = 1 + 0.35 * acerca;
  fondo(g, 540, 1000, 0.2);
  g.save();
  g.translate(mez(540, foco[0], acerca * 0.6), mez(960, foco[1], acerca * 0.6));
  g.scale(esc, esc);
  g.translate(-mez(540, foco[0], acerca * 0.6), -mez(960, foco[1], acerca * 0.6));

  // la base del tocadiscos: madera oscura con borde
  g.save();
  const bx = CX - RX - 90, by = CY - RY - 130, bw = 2 * RX + 180, bh = 2 * RY + 300;
  const bgr = g.createLinearGradient(0, by, 0, by + bh);
  bgr.addColorStop(0, "#4a2a1a"); bgr.addColorStop(1, "#1d0d07");
  g.fillStyle = bgr; k.redondo(g, bx, by, bw, bh, 60); g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45; g.drawImage(k.red2, bx, by, bw, bh); g.restore();
  g.strokeStyle = "rgba(255,200,150,0.25)"; g.lineWidth = 4; k.redondo(g, bx, by, bw, bh, 60); g.stroke();
  g.restore();
  // el plato (metal) y su sombra
  g.save(); g.translate(CX, CY + 24); g.scale(1, RY / RX);
  g.fillStyle = "rgba(0,0,0,0.6)"; g.beginPath(); g.arc(0, 0, RX * 1.03, 0, 6.2832); g.fill();
  g.restore();
  g.save(); g.translate(CX, CY + 10); g.scale(1, RY / RX);
  const mg = g.createLinearGradient(-RX, 0, RX, 0);
  mg.addColorStop(0, "#5c626a"); mg.addColorStop(0.45, "#dfe4ea"); mg.addColorStop(1, "#4a5058");
  g.fillStyle = mg; g.beginPath(); g.arc(0, 0, RX * 1.02, 0, 6.2832); g.fill();
  g.restore();

  // el disco, en su marco que gira (aplastado por la perspectiva)
  const giro = W * (t - Tini);
  const todo = su(tr(t, Tcan - 0.1, Tcan + 0.5)) * (1 - su(tr(t, Tped - 0.25, Tped + 0.25)));
  const anillo = su(tr(t, Tped - 0.25, Tped + 0.25));
  g.save(); g.translate(CX, CY); g.scale(1, RY / RX);
  const dg = g.createRadialGradient(0, 0, RX * 0.3, 0, 0, RX);
  dg.addColorStop(0, "#1a1a20"); dg.addColorStop(1, "#060608");
  g.fillStyle = dg; g.beginPath(); g.arc(0, 0, RX, 0, 6.2832); g.fill();
  // los surcos
  for (let i = 0; i < 60; i++) {
    const r = 0.36 + (i / 60) * 0.6;
    g.strokeStyle = `rgba(120,120,140,${0.12 + 0.08 * (i % 2)})`; g.lineWidth = 2;
    g.beginPath(); g.arc(0, 0, RX * r, 0, 6.2832); g.stroke();
  }
  // toda la canción, encendida de colores
  if (todo > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 24; i++) {
      const r = 0.38 + (i / 24) * 0.58, c = NEON[i % NEON.length];
      g.strokeStyle = `rgba(${c},${0.55 * todo})`; g.lineWidth = 9;
      g.beginPath(); g.arc(0, 0, RX * r, 0, 6.2832); g.stroke();
    }
    g.restore();
  }
  // el pedacito: un anillo encendido que gira con el disco y acaba en la raya
  if (anillo > 0) {
    g.save(); g.rotate(giro);
    // el ángulo del disco que está bajo la aguja en «rayado» es la raya
    const raya = AGUJA - W * (Tray - Tini);
    g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    const largo = 5.3 * anillo, N = 60;
    for (const [ancho, al] of [[44, 0.16], [20, 0.4], [9, 1]]) {
      g.lineWidth = ancho;
      for (let j = 0; j < N; j++) {
        const u0 = j / N, u1 = (j + 1.15) / N, c = k.mezRgb(k.mezRgb("60,220,255", "255,80,170", Math.min(1, u0 * 2)), "255,190,40", Math.max(0, u0 * 2 - 1));
        g.strokeStyle = `rgba(${c},${al * Math.min(1, u0 * 8)})`;
        g.beginPath(); g.arc(0, 0, RX * RB, raya - largo * (1 - u0), raya - largo * (1 - Math.min(1, u1))); g.stroke();
      }
    }
    // la raya: un corte blanco atravesando los surcos
    g.globalCompositeOperation = "source-over";
    g.strokeStyle = `rgba(240,240,255,${0.9 * anillo})`; g.lineWidth = 5;
    g.beginPath(); g.moveTo(Math.cos(raya) * RX * (RB - 0.06), Math.sin(raya) * RX * (RB - 0.06)); g.lineTo(Math.cos(raya + 0.05) * RX * (RB + 0.06), Math.sin(raya + 0.05) * RX * (RB + 0.06)); g.stroke();
    g.restore();
  }
  // la etiqueta del centro, que gira (con su marca, para que se vea girar)
  g.save(); g.rotate(giro);
  const lg = g.createRadialGradient(-RX * 0.08, -RX * 0.08, 5, 0, 0, RX * 0.3);
  lg.addColorStop(0, "#ff6a6a"); lg.addColorStop(1, "#9c0f2e");
  g.fillStyle = lg; g.beginPath(); g.arc(0, 0, RX * 0.3, 0, 6.2832); g.fill();
  g.strokeStyle = "#ffcc4d"; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, RX * 0.27, 0, 6.2832); g.stroke();
  g.fillStyle = "#ffcc4d"; g.beginPath(); g.arc(RX * 0.17, 0, RX * 0.045, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,230,200,0.85)"; g.fillRect(-RX * 0.16, -RX * 0.11, RX * 0.22, RX * 0.03); g.fillRect(-RX * 0.16, -RX * 0.05, RX * 0.14, RX * 0.03);
  g.restore();
  g.fillStyle = "#d9dde3"; g.beginPath(); g.arc(0, 0, RX * 0.025, 0, 6.2832); g.fill();
  // el brillo del vinilo: dos cuñas de luz quietas
  g.save(); g.globalCompositeOperation = "lighter";
  for (const a of [-2.3, 0.85]) {
    const sg = g.createConicGradient(a - 0.35, 0, 0);
    sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.055, "rgba(200,210,255,0.16)"); sg.addColorStop(0.11, "rgba(255,255,255,0)"); sg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, RX, 0, 6.2832); g.arc(0, 0, RX * 0.31, 0, 6.2832, true); g.fill();
  }
  g.restore();
  g.restore();

  // la aguja salta en cada raya
  let salto = 0, chispa = 0;
  for (const s of SALTOS) { salto += pulso(t, s + 0.06, 0.09); chispa += pulso(t, s + 0.03, 0.08); }
  const pa = punto(AGUJA, RB + 0.05 * salto);
  // las notas que suben de la aguja mientras toca
  for (let i = 0; i < 10; i++) {
    const per = 1.6, tt = (t - Tini + i * per / 10) % per, u = tt / per;
    const al = Math.sin(u * Math.PI) * (0.6 + 0.4 * anillo);
    nota(g, pa[0] - 80 - 380 * u + 50 * Math.sin(i * 2.1 + u * 4), pa[1] - 30 - 170 * u, 20 + 22 * u, NEON[i % NEON.length], 0.3 * Math.sin(i + u * 3), al, i % 3);
  }
  // el brazo
  const piv = [930, 540];
  g.save(); g.lineCap = "round";
  g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 26; g.beginPath(); g.moveTo(piv[0] + 14, piv[1] + 30); g.lineTo(pa[0] + 14, pa[1] + 22); g.stroke();
  const ag = g.createLinearGradient(piv[0], piv[1] - 10, piv[0] - 10, piv[1] + 10);
  ag.addColorStop(0, "#f4f6f9"); ag.addColorStop(1, "#7a818b");
  g.strokeStyle = "#8d949e"; g.lineWidth = 22; g.beginPath(); g.moveTo(piv[0], piv[1]); g.lineTo(pa[0] + 40, pa[1] - 40); g.stroke();
  g.strokeStyle = "#eef1f5"; g.lineWidth = 8; g.beginPath(); g.moveTo(piv[0] - 4, piv[1] - 5); g.lineTo(pa[0] + 36, pa[1] - 46); g.stroke();
  // la cabeza del brazo
  g.save(); g.translate(pa[0], pa[1]); g.rotate(Math.atan2(pa[1] - piv[1], pa[0] - piv[0]));
  g.fillStyle = "rgba(0,0,0,0.45)"; k.redondo(g, -40, -10, 150, 70, 12); g.fill();
  const hg = g.createLinearGradient(0, -36, 0, 36);
  hg.addColorStop(0, "#eef1f5"); hg.addColorStop(0.5, "#8d949e"); hg.addColorStop(1, "#2b2e34");
  g.fillStyle = hg; k.redondo(g, -40, -34, 150, 68, 12); g.fill();
  g.fillStyle = "#1c1e22"; k.redondo(g, -20, -18, 70, 40, 6); g.fill();
  g.fillStyle = "#ff3b5c"; g.fillRect(-12, -10, 20, 8);
  g.restore();
  // el pivote
  const pg = g.createRadialGradient(piv[0] - 15, piv[1] - 15, 5, piv[0], piv[1], 60);
  pg.addColorStop(0, "#ffffff"); pg.addColorStop(0.5, "#aab1bb"); pg.addColorStop(1, "#3c4148");
  g.fillStyle = pg; g.beginPath(); g.arc(piv[0], piv[1], 58, 0, 6.2832); g.fill();
  g.restore();
  // el punto donde toca, y el chispazo
  k.brillo(g, pa[0], pa[1], 220, "255,200,120", 0.5 + 0.3 * anillo);
  k.brillo(g, pa[0], pa[1], 520, "255,230,150", Math.min(1, 1.2 * chispa));
  g.restore();
  velo(g, 0.55);
}
