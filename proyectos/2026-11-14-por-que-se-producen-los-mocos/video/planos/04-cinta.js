// «... como la cinta de la caja del súper, y te lo tragas.»
// La comparación de casa: la cinta de la caja de un supermercado, vista un poco desde arriba. Corte en «como».
// - Primer fotograma: la cinta negra ya corre, con una bola de moco dorada encima, con su polen y sus virus.
// - «cinta»: la bola viaja sola hacia el final de la cinta, sin que nadie la empuje.
// - «tragas»: llega al rodillo, cae por el borde al hueco oscuro y desaparece. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { moco, polen, virus, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(7).t("como");

const { suave: su, tramo: tr, mez, claves, entra } = k;
const f7 = v.frase(7);
const T0 = f7.t("como"), Ttra = f7.t("tragas"), Tfin = f7.fin;
export const cae = Ttra + 0.12;

// la cinta en perspectiva: de lejos (arriba a la izquierda) a cerca (abajo a la derecha)
const A = { x: -60, y: 1080 }, B = { x: 860, y: 1080 }; // el centro de la cinta, de su principio a su rodillo
const ANCHO_A = 330, ANCHO_B = 330;
const en = (u) => ({ x: mez(A.x, B.x, u), y: mez(A.y, B.y, u), w: mez(ANCHO_A, ANCHO_B, u) });
const dir = Math.atan2(B.y - A.y, B.x - A.x), nx = -Math.sin(dir), ny = Math.cos(dir);

// por dónde va la bola: avanza con la cinta hasta el rodillo y cae
const ubola = claves([[T0, 0.3], [Ttra - 0.05, 0.93]]);
const caida = (t) => tr(t, Ttra - 0.05, Ttra + 0.45);

export function dibuja(g, t) {
  // la tienda: luz cálida de arriba, desenfocada
  const fg = g.createLinearGradient(0, 0, 0, 1920);
  fg.addColorStop(0, "#3b2d26"); fg.addColorStop(0.5, "#6b5240"); fg.addColorStop(1, "#2a1d16");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  for (const [x, y, s] of [[200, 520, 700], [880, 600, 600], [560, 1650, 900]]) k.brillo(g, x, y, s, "255,214,160", 0.28);
  // el mostrador de debajo
  const pa = en(0), pb = en(1);
  g.fillStyle = "#b9b4ac";
  g.beginPath(); g.moveTo(pa.x + nx * (pa.w / 2 + 60), pa.y + ny * (pa.w / 2 + 60)); g.lineTo(pb.x + nx * (pb.w / 2 + 90), pb.y + ny * (pb.w / 2 + 90));
  g.lineTo(pb.x + nx * (pb.w / 2 + 90), pb.y + ny * (pb.w / 2 + 90) + 260); g.lineTo(pa.x + nx * (pa.w / 2 + 60), pa.y + ny * (pa.w / 2 + 60) + 200); g.closePath(); g.fill();
  g.fillStyle = "#8d8780"; g.fillRect(0, 1500, 1080, 420);
  // el hueco oscuro después del rodillo
  const hg = g.createRadialGradient(pb.x + 120, pb.y + 160, 10, pb.x + 120, pb.y + 160, 380);
  hg.addColorStop(0, "#000"); hg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = hg; g.beginPath(); g.ellipse(pb.x + 130, pb.y + 170, 330, 230, dir, 0, 6.2832); g.fill();
  // la cinta: goma negra con sus rayas que corren hacia el rodillo
  const esq = (p, s) => ({ x: p.x + nx * (p.w / 2) * s, y: p.y + ny * (p.w / 2) * s });
  const a1 = esq(pa, -1), a2 = esq(pa, 1), b1 = esq(pb, -1), b2 = esq(pb, 1);
  const cg = g.createLinearGradient(a1.x, a1.y, a2.x, a2.y);
  cg.addColorStop(0, "#2c2c30"); cg.addColorStop(0.5, "#18181b"); cg.addColorStop(1, "#0e0e10");
  g.fillStyle = cg; g.beginPath(); g.moveTo(a1.x, a1.y); g.lineTo(b1.x, b1.y); g.lineTo(b2.x, b2.y); g.lineTo(a2.x, a2.y); g.closePath(); g.fill();
  g.save(); g.clip();
  const corre = (t * 0.22) % (1 / 60);
  for (let i = 0; i < 62; i++) {
    const u = i / 60 + corre; if (u > 1) continue;
    const p = en(u), e1 = esq(p, -1), e2 = esq(p, 1);
    g.strokeStyle = "rgba(70,70,78,0.18)"; g.lineWidth = mez(1, 2, u); g.beginPath(); g.moveTo(e1.x, e1.y); g.lineTo(e2.x, e2.y); g.stroke();
  }
  // el reflejo de la luz en la goma
  g.globalCompositeOperation = "lighter";
  const rg = g.createLinearGradient(a1.x, a1.y, b2.x, b2.y); rg.addColorStop(0, "rgba(255,220,180,0)"); rg.addColorStop(0.55, "rgba(255,220,180,0.12)"); rg.addColorStop(1, "rgba(255,220,180,0)");
  g.fillStyle = rg; g.fillRect(0, 0, 1080, 1920);
  g.restore();
  // los bordes de metal a los lados
  for (const s of [-1, 1]) {
    const p1 = esq(pa, s * 1.08), p2 = esq(pb, s * 1.08);
    g.strokeStyle = "#d9dde3"; g.lineWidth = s > 0 ? 22 : 14; g.lineCap = "round"; g.beginPath(); g.moveTo(p1.x, p1.y); g.lineTo(p2.x, p2.y); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 4; g.beginPath(); g.moveTo(p1.x, p1.y - 5); g.lineTo(p2.x, p2.y - 5); g.stroke();
  }
  // el lector de la caja, al final: un cristal con su luz roja
  {
    const q = en(0.8), e1 = esq(q, -0.9), e2 = esq(q, 0.9);
    g.save(); g.globalCompositeOperation = "lighter";
    g.strokeStyle = "rgba(255,40,40,0.55)"; g.lineWidth = 10; g.beginPath(); g.moveTo(e1.x, e1.y); g.lineTo(e2.x, e2.y); g.stroke();
    k.brillo(g, q.x, q.y, 420, "255,60,50", 0.35);
    g.restore();
  }
  // el rodillo del final, de metal
  const r1 = esq(pb, -1.05), r2 = esq(pb, 1.05);
  g.strokeStyle = "#9aa0a8"; g.lineWidth = 40; g.beginPath(); g.moveTo(r1.x, r1.y); g.lineTo(r2.x, r2.y); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 8; g.beginPath(); g.moveTo(r1.x + 4, r1.y - 10); g.lineTo(r2.x + 4, r2.y - 10); g.stroke();
  // lo que va detrás en la cinta: el separador de clientes y una manzana
  {
    const ub = ubola(t), ps = en(Math.max(0, ub - 0.36)), s1 = esq(ps, -0.85), s2 = esq(ps, 0.85);
    g.lineCap = "butt";
    g.strokeStyle = "#5a6068"; g.lineWidth = 34; g.beginPath(); g.moveTo(s1.x, s1.y + 6); g.lineTo(s2.x, s2.y + 6); g.stroke();
    g.strokeStyle = "#aeb5be"; g.lineWidth = 24; g.beginPath(); g.moveTo(s1.x, s1.y - 8); g.lineTo(s2.x, s2.y - 8); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 5; g.beginPath(); g.moveTo(s1.x, s1.y - 16); g.lineTo(s2.x, s2.y - 16); g.stroke();
    const pm = en(Math.max(0, ub - 0.2)), rm = mez(60, 80, ub);
    g.save(); g.globalAlpha = 0.4; g.fillStyle = "#000"; g.beginPath(); g.ellipse(pm.x, pm.y + 8, rm, rm * 0.35, dir, 0, 6.2832); g.fill(); g.restore();
    const ay = pm.y - rm * 0.85, mg = g.createRadialGradient(pm.x - rm * 0.35, ay - rm * 0.35, rm * 0.1, pm.x, ay, rm);
    mg.addColorStop(0, "#ff8a7a"); mg.addColorStop(0.45, "#e0242b"); mg.addColorStop(1, "#7a0710");
    g.fillStyle = mg; g.beginPath(); g.arc(pm.x, ay, rm, 0, 6.2832); g.fill();
    g.strokeStyle = "#5a3a1a"; g.lineWidth = 7; g.beginPath(); g.moveTo(pm.x, ay - rm * 0.8); g.quadraticCurveTo(pm.x + 6, ay - rm * 1.15, pm.x + 14, ay - rm * 1.25); g.stroke();
    g.fillStyle = "#4caf3a"; g.beginPath(); g.ellipse(pm.x + 30, ay - rm * 1.05, 26, 11, -0.4, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.ellipse(pm.x - rm * 0.4, ay - rm * 0.4, rm * 0.2, rm * 0.1, -0.6, 0, 6.2832); g.fill();
  }
  // la bola de moco: viaja, cae por el borde y desaparece en el hueco
  const u = ubola(t), c = caida(t), p = en(u);
  const r = mez(150, 210, u) * (1 - 0.5 * c);
  const x = p.x + 220 * entra(c), y = p.y - r * 0.7 + 520 * c * c;
  const al = 1 - su(tr(c, 0.55, 1));
  if (al > 0) {
    g.save(); g.globalAlpha = 0.45 * al * (1 - c); g.fillStyle = "#000"; g.beginPath(); g.ellipse(p.x, p.y + 10, r * 0.95, r * 0.35, dir, 0, 6.2832); g.fill(); g.restore();
    g.save(); g.globalAlpha = al; g.translate(x, y); g.rotate(c * 2.5);
    moco(g, 0, 0, r, t, 31, { tono: 0.55, estira: 0.1 });
    polen(g, -r * 0.35, -r * 0.1, r * 0.2, 0.4);
    virus(g, r * 0.3, r * 0.2, r * 0.2, 1.2);
    polen(g, r * 0.1, -r * 0.45, r * 0.16, 2);
    g.restore();
  }
  velo(g, 0.45);
}

export const momentos = { cae };
