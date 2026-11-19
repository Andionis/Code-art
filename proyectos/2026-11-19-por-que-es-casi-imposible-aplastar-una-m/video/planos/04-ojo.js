// «Y no necesita girar la cabeza: cada ojo tiene miles de lentes que miran hacia casi todos lados.»
// Corte en «Y» a la cabeza de la mosca, enorme, de lado; una sola cámara que entra en su ojo y vuelve a salir.
// - «no necesita girar la cabeza»: su cabeza quieta llena la imagen; se limpia las patas; la cámara se acerca al ojo.
// - «cada ojo»: la cámara se lanza dentro del ojo; «miles de lentes»: un panal de lentes rojas, cada una con la mano
//   reflejada; la cámara se aleja dentro del panal y caben cada vez más; «lentes»: un brillo las recorre.
// - «que miran hacia casi todos lados»: la cámara sale; del ojo salen rayos de luz hacia todos lados menos detrás.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, mosca, mano } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra } = k;
const TAU = Math.PI * 2;
const f6 = v.frase(6);
const T0 = f6.inicio, Tcada = f6.t("cada"), Tmiles = f6.t("miles"), Tlentes = f6.t("lentes"), Ttodos = f6.t("todos"), Fin = f6.fin;
export const momentos = { entra: Tcada, brillo: Tlentes, rayos: Ttodos - 0.3 };

const S = 2600, EX = 520, EY = 1050;
const MX = EX - 0.26 * S, MY = EY + 0.272 * S;

// la mano reflejada, pequeña (se hace la primera vez)
let REF = null;
function reflejo() {
  const big = k.lienzo(1080, 1920), c = big.getContext("2d");
  mano(c, 540, 960, 700, 0.75, 1, Math.PI);
  const r = k.lienzo(240); r.getContext("2d").drawImage(big, 90, 260, 900, 1300, 30, 0, 180, 240);
  return k.fijar(r);
}

function panal(g, t, R, al) {
  REF ??= reflejo();
  g.save(); g.globalAlpha *= al;
  g.fillStyle = "#1a0303"; g.fillRect(0, 0, 1080, 1920);
  const h = R * Math.sqrt(3), barrido = tr(t, Tlentes - 0.25, Tlentes + 0.7);
  const ni = Math.ceil(600 / (R * 1.5)) + 1, nj = Math.ceil(1000 / h) + 1;
  for (let i = -ni; i <= ni; i++) for (let j = -nj; j <= nj; j++) {
    const cx = 540 + i * R * 1.5, cy = 960 + j * h + (((i % 2) + 2) % 2 ? h / 2 : 0);
    if (cx < -R || cx > 1080 + R || cy < -R || cy > 1920 + R) continue;
    g.beginPath(); for (let s = 0; s < 6; s++) { const a = (s * Math.PI) / 3; g.lineTo(cx + R * 0.94 * Math.cos(a), cy + R * 0.94 * Math.sin(a)); } g.closePath();
    const dg = g.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R);
    dg.addColorStop(0, "#ff8a6a"); dg.addColorStop(0.35, "#c3271c"); dg.addColorStop(0.8, "#6a0d08"); dg.addColorStop(1, "#2a0403");
    g.fillStyle = dg; g.fill();
    // la mano reflejada en cada lente, un poco distinta según dónde está
    g.save(); g.clip(); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.55;
    const dx = ((cx - 540) / 1080) * R * 0.5, dy = ((cy - 960) / 1920) * R * 0.5;
    g.drawImage(REF, cx - R * 0.45 - dx, cy - R * 0.55 - dy, R * 0.9, R * 0.9 * 1.0);
    g.restore();
    // el brillo de cristal; en «lentes», una ola de luz las recorre
    const ola = k.pulso(cy / 1920 + cx / 4000, mez(-0.3, 1.4, barrido), 0.12);
    g.save(); g.globalCompositeOperation = "lighter";
    const bg = g.createRadialGradient(cx - R * 0.32, cy - R * 0.38, 0, cx - R * 0.32, cy - R * 0.38, R * 0.35);
    bg.addColorStop(0, `rgba(255,240,230,${0.55 + 0.45 * ola})`); bg.addColorStop(1, "rgba(255,240,230,0)");
    g.fillStyle = bg; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    if (ola > 0.02) { g.fillStyle = `rgba(255,200,170,${0.35 * ola})`; g.beginPath(); g.arc(cx, cy, R * 0.9, 0, TAU); g.fill(); }
    g.restore();
  }
  g.restore();
}

export function dibuja(g, t) {
  // la cámara: se acerca al ojo, entra, y vuelve a salir hasta ver la cabeza entera
  const zIn = mez(1, 1.15, su(tr(t, T0, Tcada - 0.1)));
  const dive = Math.pow(tr(t, Tcada - 0.1, Tcada + 0.55), 2.2);
  const sal = su(tr(t, Ttodos - 0.75, Ttodos + 0.1));
  const z = sal > 0 ? Math.exp(mez(Math.log(14), Math.log(0.42), sal)) : Math.exp(mez(Math.log(zIn), Math.log(14), dive));
  const enPanal = Math.min(tr(z, 4, 9), 1);
  if (enPanal < 1) {
    const zf = Math.max(1, z);
    g.save(); g.translate(EX, EY); g.scale(zf, zf); g.translate(-EX, -EY); cocina(g, 1280, 0.9); g.restore();
    g.save(); g.translate(EX, EY); g.scale(z, z); g.translate(-EX, -EY);
    mosca(g, MX, MY, S, { t, frota: 1 - tr(t, Tcada - 0.6, Tcada - 0.2) });
    g.restore();
  }
  if (enPanal > 0) {
    // dentro del panal: lentes grandes que se van haciendo pequeñas (caben cada vez más)
    const R = mez(150, 46, su(tr(t, Tmiles - 0.3, Tlentes + 0.6)));
    panal(g, t, sal > 0 ? R : R * mez(2.4, 1, entra(tr(t, Tcada + 0.15, Tcada + 0.6))), enPanal);
  }
  // los rayos de lo que ve: hacia todos lados menos detrás (a la izquierda)
  const ray = entra(tr(t, Ttodos - 0.15, Ttodos + 0.5));
  if (ray > 0 && sal > 0.98) {
    const ex = EX, ey = EY, n = 44;
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const a = Math.PI + 0.42 + (i / (n - 1)) * (TAU - 0.84);
      const L = 1300 * ray, r0 = 95;
      const x0 = ex + Math.cos(a) * r0, y0 = ey + Math.sin(a) * r0, x1 = ex + Math.cos(a) * (r0 + L), y1 = ey + Math.sin(a) * (r0 + L);
      const lg = g.createLinearGradient(x0, y0, x1, y1); lg.addColorStop(0, "rgba(255,170,140,0.75)"); lg.addColorStop(0.5, "rgba(255,130,100,0.25)"); lg.addColorStop(1, "rgba(255,120,90,0)");
      g.strokeStyle = lg; g.lineWidth = 5; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    }
    k.brillo(g, ex, ey, 520, "255,120,90", 0.5 * ray);
    g.restore();
  }
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(15,6,4,0.55)"); vg.addColorStop(1, "rgba(15,6,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}
