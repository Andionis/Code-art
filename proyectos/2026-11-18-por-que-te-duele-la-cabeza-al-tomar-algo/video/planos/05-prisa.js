// «Y si tomas rápido, te pasa el doble de veces. No es el helado: es la prisa.»
// Corte a dos cabezas de cristal, una encima de otra, cada una con su granizado (el mismo).
// - Fotograma 0: arriba, «Rápido», sorbe a toda velocidad y el vaso baja; abajo, «Despacio», sorbe tranquila.
// - «rápido»: a la de arriba le duele una vez; «doble»: otra vez arriba, y una sola abajo; salen 27 % y 13 %.
// - «helado»: los dos granizados brillan igual (es el mismo). «prisa»: arriba sorbe lo último y la etiqueta «Rápido»
//   se enciende en rojo.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vista, sinVista, cabeza, granizado, velo, vineta, FRENTE } from "../mundo.js";

export const desde = (v) => v.frase(11).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, pulso } = k;
const f = v.frase(11);
const Tini = f.inicio, Trap = f.t("rapido"), Tdob = f.t("doble"), Thel = f.t("helado"), Tpri = f.t("prisa");
const S = 0.46;
const VASO2 = { x: -560, y: 530, h: 300 };
const PANELES = [
  { y0: 505, rapido: true, nombre: "Rápido", cifra: "27 %" },
  { y0: 965, rapido: false, nombre: "Despacio", cifra: "13 %" },
];

function panel(g, t, p) {
  const H = 455, X = 40 + 690 * S, Y = p.y0 + 10 + 430 * S;
  // el marco
  g.save(); sinVista(g);
  k.redondo(g, 30, p.y0, 920, H, 44);
  const bg = g.createLinearGradient(0, p.y0, 0, p.y0 + H); bg.addColorStop(0, "rgba(30,50,110,0.55)"); bg.addColorStop(1, "rgba(8,14,40,0.65)");
  g.fillStyle = bg; g.fill(); g.strokeStyle = "rgba(150,200,255,0.25)"; g.lineWidth = 3; g.stroke();
  g.clip();
  // la cabeza y su vaso
  g.setTransform(S, 0, 0, S, X, Y);
  const dolores = p.rapido ? [Trap + 0.45, Tdob + 0.05, Tpri + 0.1] : [Tdob + 0.05];
  const dolor = Math.min(1, dolores.reduce((a, d) => a + 0.95 * pulso(t, d, 0.22), 0));
  const nivel = p.rapido ? k.mez(0.85, 0.16, su(tr(t, Tini + 0.1, Thel - 0.2))) - 0.16 * su(tr(t, Tpri - 0.25, Tpri + 0.15)) : k.mez(0.85, 0.55, tr(t, Tini, f.fin));
  const sorbe = p.rapido ? 1 - su(tr(t, Tpri + 0.2, Tpri + 0.5)) : 0.6;
  const brilla = pulso(t, Thel + 0.15, 0.3);
  granizado(g, p.rapido ? t : t * 0.25, Math.max(0, nivel), sorbe, undefined, VASO2);
  if (brilla > 0.01) k.brillo(g, VASO2.x, VASO2.y - VASO2.h * 0.5, 1100, "120,200,255", brilla);
  cabeza(g, t, { trans: 0, frio: p.rapido ? 0.8 * su(tr(t, Trap + 0.3, Tdob + 0.2)) * (1 - su(tr(t, Tpri + 0.3, f.fin))) : 0, fuera: 0.6, dolor });
  g.restore();
  if (p.rapido) { g.save(); sinVista(g); k.redondo(g, 30, p.y0, 920, H, 44); g.strokeStyle = `rgba(255,80,70,${su(tr(t, Tpri - 0.1, Tpri + 0.2)) * (1 - su(tr(t, f.fin - 0.3, f.fin)))})`; g.lineWidth = 8; g.stroke(); g.restore(); }
  // el nombre y la cifra
  g.save(); sinVista(g);
  const rojo = p.rapido ? su(tr(t, Tpri - 0.1, Tpri + 0.2)) : 0;
  g.font = "800 50px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 16;
  g.fillStyle = `rgb(${k.mezRgb("235,245,255", "255,90,80", rojo)})`;
  g.fillText(p.nombre, 800, p.y0 + 90);
  g.restore();
  const al = su(tr(t, Tdob - 0.1, Tdob + 0.2));
  k.pastilla(g, 800, p.y0 + 230, p.cifra, "", p.rapido ? "255,120,100" : "160,220,255", al, 92);
}

const Tno = f.t("no");
// las rayas de velocidad que cruzan el panel de arriba en «prisa»
const RAYAS = (() => { const az = k.azar(4545); return Array.from({ length: 14 }, () => ({ y: 540 + az() * 380, l: 120 + az() * 260, d: az() * 0.25 })); })();

export function dibuja(g, t) {
  fondo(g, t, 0.5);
  for (const p of PANELES) panel(g, t, p);
  // «No es el helado»: los dos granizados son el mismo (un = entre los dos vasos)
  const ig = su(tr(t, Thel - 0.1, Thel + 0.2)) * (1 - su(tr(t, f.fin - 0.3, f.fin)));
  if (ig > 0) {
    const vx = 40 + 690 * S + VASO2.x * S;
    g.save(); g.translate(vx, 960); g.scale(0.6 + 0.4 * k.entra(ig), 0.6 + 0.4 * k.entra(ig)); g.globalAlpha = ig;
    g.beginPath(); g.arc(0, 0, 58, 0, 6.283); g.fillStyle = "rgba(10,30,80,0.9)"; g.fill(); g.strokeStyle = "rgba(140,210,255,0.9)"; g.lineWidth = 5; g.stroke();
    g.font = "900 84px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#bfe6ff"; g.fillText("=", 0, 4);
    g.restore();
  }
  // «prisa»: rayas de velocidad en el de arriba
  g.save(); g.lineCap = "round";
  for (const r of RAYAS) {
    const u = tr(t, Tpri - 0.2 + r.d, Tpri + 0.45 + r.d);
    if (u <= 0 || u >= 1) continue;
    const x = k.mez(-300, 1300, u);
    g.strokeStyle = `rgba(255,110,90,${0.7 * Math.sin(u * Math.PI)})`; g.lineWidth = 6;
    g.beginPath(); g.moveTo(x - r.l, r.y); g.lineTo(x, r.y); g.stroke();
  }
  g.restore();
  vineta(g, 0.4);
  velo(g, 0.45);
}

export const momentos = { duele1: Trap + 0.45, duele2: Tdob + 0.05, helado: Thel + 0.15, prisa: Tpri };
