// «Síguenos para más.»
// Corte a la cabeza de cristal con su granizado, como en el hook, un poco a oscuras.
// - «Síguenos»: llega rebotando un botón rojo «SEGUIR» con su icono de persona y un +, y late.
// - «más»: el pulgar llega desde abajo y lo aprieta: se hunde, un fogonazo, chispas, y pasa a blanco «SIGUIENDO ✓».
// - Al final, el video se rebobina: la imagen vuelve deprisa hacia atrás por el hook (rayas de cinta y ◀◀) y frena
//   justo en su primer fotograma, como si fuera a empezar de nuevo.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vista, sinVista, cabeza, granizado, vineta } from "../mundo.js";
import { pulgar } from "#piezas/celular.js";
import { dibuja as hook } from "./01-hook.js";

const f = v.frase(12);
export const desde = (vz) => vz.frase(12).inicio - 0.04;
export const entrada = "corte";

const { suave: su, tramo: tr, entra, pulso, mez } = k;
const Tsig = f.t("siguenos"), Tmas = f.t("mas"), Tfin = v.duracion;
const Tap = Tmas + 0.05;                    // el pulgar aprieta
const R0 = Math.max(Tap + 0.9, Tfin - 1.45), R1 = Tfin - 1 / 60;   // el rebobinado
const BX = 540, BY = 1080;

// el botón: rojo «SEGUIR» o, apretado, blanco «SIGUIENDO ✓». hunde y cambia de 0 a 1.
function boton(g, x, y, esc, hunde, cambia, brilla) {
  const W = 640, H = 176;
  g.save(); g.translate(x, y + 12 * hunde); g.scale(esc, esc);
  if (brilla > 0) k.brillo(g, 0, 0, 1400, "255,80,60", 0.5 * brilla);
  k.redondo(g, -W / 2, -H / 2 + 22 * (1 - hunde), W, H, H / 2); g.fillStyle = `rgb(${k.mezRgb("143,20,13", "150,160,175", cambia)})`; g.fill();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2);
  bg.addColorStop(0, `rgb(${k.mezRgb("255,106,92", "255,255,255", cambia)})`); bg.addColorStop(0.5, `rgb(${k.mezRgb("255,59,48", "240,243,248", cambia)})`); bg.addColorStop(1, `rgb(${k.mezRgb("212,42,32", "214,220,230", cambia)})`);
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.3)"; k.redondo(g, -W / 2 + 40, -H / 2 + 14, W - 80, 42, 21); g.fill();
  const col = cambia < 0.5 ? "#ffffff" : "#1b2433";
  g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round"; g.lineJoin = "round";
  if (cambia < 0.5) {
    // persona con un +
    g.save(); g.translate(-218, 4);
    g.beginPath(); g.arc(-10, -22, 22, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(-50, 40); g.quadraticCurveTo(-48, 2, -10, 2); g.quadraticCurveTo(28, 2, 30, 40); g.closePath(); g.fill();
    g.lineWidth = 9; g.beginPath(); g.moveTo(48, -6); g.lineTo(48, 30); g.moveTo(30, 12); g.lineTo(66, 12); g.stroke();
    g.restore();
    g.font = "900 88px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("SEGUIR", 52, 6);
  } else {
    // la marca de hecho
    g.lineWidth = 12; g.beginPath(); g.moveTo(-250, 6); g.lineTo(-226, 30); g.lineTo(-184, -22); g.stroke();
    g.font = "900 74px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("SIGUIENDO", 46, 6);
  }
  g.restore();
}

const CHISPAS = (() => { const az = k.azar(3131); return Array.from({ length: 40 }, (_, i) => ({ a: az() * 6.283, v: 500 + az() * 900, c: ["255,80,60", "255,210,90", "255,255,255", "120,200,255"][i % 4], r: 10 + az() * 14 })); })();

function escena(g, t) {
  fondo(g, t, 0);
  vista(g, 0.7, -200, 160 - 20 * su(tr(t, f.inicio, R0)));
  granizado(g, t, 0.85, 1);
  cabeza(g, t, { trans: 0 });
  sinVista(g);
  g.fillStyle = "rgba(3,5,14,0.45)"; g.fillRect(0, 0, 1080, 1920);
  vineta(g);
  // el botón
  const llega = tr(t, Tsig - 0.1, Tsig + 0.45);
  const rebote = llega <= 0 ? 0 : 1 + 0.18 * Math.sin(llega * Math.PI * 2.2) * (1 - llega) - (1 - entra(llega));
  const late = 0.03 * Math.sin((t - Tsig) * 7) * (1 - su(tr(t, Tap - 0.3, Tap)));
  const hunde = pulso(t, Tap, 0.07) > 0.05 ? pulso(t, Tap, 0.07) : 0;
  const cambia = su(tr(t, Tap + 0.02, Tap + 0.15));
  if (rebote > 0.01) boton(g, BX, BY, rebote + late, hunde, cambia, su(tr(t, Tap, Tap + 0.3)) * (1 - su(tr(t, Tap + 0.5, R0))));
  // el fogonazo y las chispas
  if (t > Tap) k.fogonazo(g, BX, BY, (t - Tap) * 1.4, 900, "255,200,170");
  const w = t - Tap;
  if (w > 0 && w < 0.9) for (const p of CHISPAS) {
    const d = p.v * entra(w / 0.9) * 0.9;
    k.brillo(g, BX + Math.cos(p.a) * d * 1.2, BY + Math.sin(p.a) * d * 0.7, p.r * 4, p.c, 1 - w / 0.9);
  }
  // el pulgar: sube desde abajo, aprieta en «más» y se va
  const sube = su(tr(t, Tsig + 0.35, Tap)), baja = su(tr(t, Tap + 0.25, Tap + 0.75));
  const py = mez(2100, BY + 30, sube) + (2100 - BY) * baja;
  if (py < 2000) pulgar(g, BX + 150, py, -0.25, hunde, 950);
}

// el rebobinado: rayas de cinta, un ligero corrimiento y ◀◀
function rebobina(g, t) {
  const u = tr(t, R0, R1), h = 7.6 * (1 - entra(u));
  hook(g, h);
  const fx = 1 - su(tr(u, 0.75, 1));            // el efecto se apaga al llegar al principio
  if (fx <= 0.01) return;
  g.save();
  g.globalAlpha = 0.25 * fx; g.fillStyle = "#000";
  for (let y = 0; y < 1920; y += 6) g.fillRect(0, y, 1080, 2);
  g.globalAlpha = 0.35 * fx; g.globalCompositeOperation = "lighter";
  const az = k.azar(Math.floor(t * 60));
  for (let i = 0; i < 4; i++) { const y = az() * 1920; g.fillStyle = "rgba(200,220,255,0.6)"; g.fillRect(0, y, 1080, 4 + az() * 10); }
  g.restore();
  g.save(); g.globalAlpha = fx; g.fillStyle = "#ffffff"; g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 18;
  for (const dx of [0, 70]) { g.beginPath(); g.moveTo(150 + dx, 620); g.lineTo(210 + dx, 580); g.lineTo(210 + dx, 660); g.closePath(); g.fill(); }
  g.restore();
}

export function dibuja(g, t) {
  if (t >= R0) rebobina(g, t); else escena(g, t);
}

export const momentos = { boton: Tsig, aprieta: Tap, rebobina: R0 };
