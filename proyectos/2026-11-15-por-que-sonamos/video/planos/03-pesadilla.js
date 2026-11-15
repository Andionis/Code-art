// «La primera: un simulacro. Por eso tantos sueños son de que te persiguen o te caes.»
// «Tu cerebro ensaya el peligro sin riesgo, ...»
// Dentro de la burbuja roja (la cámara acaba de entrar): la pesadilla de la calle, a pantalla completa.
// - «simulacro»: él corre asustado; detrás, la sombra enorme con ojos rojos.
// - «persiguen»: la sombra se le echa encima, los brazos estirados, los ojos se encienden.
// - «caes»: el suelo se rompe bajo sus pies y cae; la cámara cae con él por un pozo oscuro, entre trozos de asfalto.
// - «sin riesgo»: cae sobre su cama, blanda; rebota y se queda; la pesadilla se apaga a un violeta tranquilo.
import * as k from "#kit";
import { v } from "#voz";
import { TAU, corredor, velo, vineta } from "../mundo.js";
import { SUELO, fondoCalle, sombra } from "../suenos.js";

const f5 = v.frase(5), f6 = v.frase(6);
const Tsim = f5.t("simulacro");
export const desde = (vv) => vv.frase(5).t("simulacro") + 0.05;
export const entrada = "sigue";
const { suave: su, tramo: tr, mez, azar } = k;
const Tpers = f5.t("persiguen"), To = f5.t("o"), Tcaes = f5.t("caes"), Tsin = f6.t("sin"), Tries = f6.t("riesgo"), Tcomo = f6.t("como");

const Tg = To - 0.05;                 // el suelo empieza a romperse
const Tf = Tcaes + 0.02;              // empieza a caer
const Tland = Tsin + 0.06;            // cae en la cama
const D = 2600;                       // lo que cae
const XR = 160;                        // dónde corre
// la carrera: frena al romperse el suelo
const av = (t) => t * 520 - Math.max(0, t - Tg) * 520 + 520 * 0.25 * (1 - Math.exp(-Math.max(0, t - Tg) * 4));
const caida = (t) => D * Math.pow(tr(t, Tf, Tland), 1.7);
const bote = (t) => { const w = t - Tland; return w > 0 ? 70 * Math.exp(-w * 5) * Math.abs(Math.sin(w * 11)) : 0; };
const aplasta = (t) => { const w = t - Tland; return w > 0 ? Math.exp(-w * 6) * Math.max(0, Math.cos(w * 11)) : 0; };

const azD = azar(66);
const TROZOS = Array.from({ length: 16 }, () => ({ x: XR + (azD() - 0.5) * 900, f: 0.55 + azD() * 0.4, d: (azD() - 0.3) * 300, r: 30 + azD() * 60, g: (azD() - 0.5) * 6, s: 1 + Math.floor(azD() * 99) }));
const BRASAS = Array.from({ length: 60 }, () => ({ x: (azD() - 0.5) * 1300, y: SUELO + azD() * (D + 600), r: 2 + azD() * 4 }));

export function dibuja(g, t) {
  const y = caida(t), oy = y, calm = su(tr(t, Tland - 0.1, Tland + 0.5));
  g.save(); g.translate(540, 960 - oy);
  // el pozo (debajo de la calle)
  const pg = g.createLinearGradient(0, SUELO, 0, SUELO + D + 800);
  pg.addColorStop(0, "#1a0208"); pg.addColorStop(0.5, "#2a0616"); pg.addColorStop(1, k.mezColor("#3a0a20", "#3a2a7a", calm));
  g.fillStyle = pg; g.fillRect(-700, SUELO, 1400, D + 1200);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BRASAS) { const by = b.y - (t - Tf) * 60; if (Math.abs(by - oy) > 1200) continue; g.fillStyle = `rgba(255,${mez(90, 200, calm)},${mez(60, 255, calm)},0.5)`; g.beginPath(); g.arc(b.x, by, b.r, 0, TAU); g.fill(); }
  g.restore();
  // la calle (arriba), con la grieta
  if (oy < 2200) {
    g.save(); g.beginPath(); g.rect(-700, -1500, 1400, SUELO + 1500 + 800); g.clip();
    fondoCalle(g, t, av(t), { grieta: tr(t, Tg, Tf + 0.3), xg: XR });
    // la sombra: se le echa encima en «persiguen»
    const lanza = su(tr(t, Tpers - 0.4, Tpers + 0.3));
    sombra(g, mez(-330, -190, lanza), mez(760, 860, lanza), t, 1);
    if (lanza > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, mez(-330, -190, lanza) + 100, SUELO - mez(660, 750, lanza), 400, "255,40,40", 0.4 * k.pulso(t, Tpers + 0.1, 0.25)); g.restore(); }
    g.restore();
  }
  // los trozos de asfalto que caen con él
  if (t > Tf) for (const p of TROZOS) {
    const ty = SUELO + 40 + y * p.f + p.d;
    if (Math.abs(ty - oy) > 1300) continue;
    k.roca(g, p.x, ty, p.r, (t - Tf) * p.g, p.s, -0.5, -1, 0.15 * (1 - calm));
  }
  // la cama, abajo
  cama(g, SUELO + D, aplasta(t), t);
  // él: corre, cae dando vueltas y se queda tumbado en la cama
  const ang = t < Tf ? 0 : t < Tland ? -(t - Tf) * 2.2 : mez(-(Tland - Tf) * 2.2, -Math.PI * 2.5, su(tr(t, Tland, Tland + 0.35)));
  const fase = t < Tf ? t * 1.9 : Tf * 1.9 + (t - Tf) * (t < Tland ? 3 : 0);
  const tumba = su(tr(t, Tland, Tland + 0.35));
  g.save(); g.translate(XR, SUELO + y - mez(260, 55, tumba) - bote(t)); g.rotate(ang);
  corredor(g, 0, 260, 520, fase, { miedo: 1 - calm });
  g.restore();
  g.restore();
  // la pesadilla se apaga: un velo violeta
  if (calm > 0) { g.fillStyle = `rgba(90,60,170,${0.18 * calm})`; g.fillRect(0, 0, 1080, 1920); }
  vineta(g, 0.5);
  velo(g, 0.35);
}

// La cama blanda donde cae: un colchón ancho con edredón y almohada; aplasta: se hunde.
function cama(g, y, aplasta, t) {
  const hund = 50 * aplasta;
  g.save();
  k.brillo(g, XR, y, 900, "200,170,255", 0.35);
  const cg = g.createLinearGradient(0, y - 40, 0, y + 340); cg.addColorStop(0, "#e8e4ff"); cg.addColorStop(1, "#6a5ab8");
  g.fillStyle = cg;
  g.beginPath(); g.moveTo(-620, y + 40);
  g.bezierCurveTo(-400, y - 20, XR - 260, y + hund, XR, y + hund); g.bezierCurveTo(XR + 260, y + hund, 400, y - 20, 620, y + 40);
  g.lineTo(620, y + 400); g.lineTo(-620, y + 400); g.closePath(); g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.15; g.drawImage(k.manchas, -620, y - 40, 1240, 440); g.restore();
  g.strokeStyle = "rgba(90,70,170,0.35)"; g.lineWidth = 6; for (const x of [-420, -160, 440]) { g.beginPath(); g.moveTo(x, y + 30); g.quadraticCurveTo(x + 40, y + 150, x - 10, y + 300); g.stroke(); }
  // la almohada
  const ag = g.createRadialGradient(-280, y - 40, 10, -260, y - 20, 200); ag.addColorStop(0, "#ffffff"); ag.addColorStop(1, "#b0a8ee");
  g.fillStyle = ag; g.beginPath(); g.ellipse(-260, y - 10, 190, 62, -0.04, 0, TAU); g.fill();
  g.restore();
}

export const momentos = { grieta: Tg, cae: Tf, cama: Tland, lanza: Tpers };
