// «Envíaselo a un amigo que le pueda interesar, y sígueme para más.»
// Corte en «Envíaselo»: el jardín del principio, con el cielo y las nubes quietas. El gato, de pie en el pasto; delante,
// un botón rojo enorme: «SÍGUEME». «sígueme»: el gato salta encima y lo aprieta con las patas: el botón se hunde, un
// fogonazo y confeti. «para más»: el botón hace de muelle y lanza al gato hacia el cielo; la cámara sube con él, el
// gato da media vuelta en el aire y vuelve a caer de espaldas entre las nubes: el último fotograma es el primero del
// vídeo (bucle).
import * as k from "#kit";
import { v } from "#voz";
import { gato, cielo, pasto, sombraEnSuelo, veloArriba } from "../mundo.js";

export const desde = "enviaselo";
const { suave: su, tramo: tr, mez, claves, entra } = k;
const PI = Math.PI;
const f12 = v.frase(12);
const T0 = f12.inicio, Tsig = f12.t("sigueme"), Tmas = f12.t("mas");
const END = v.duracion;
const Tsalta = Tsig - 0.35, Tapr = Tsig + 0.02, Tlanza = Math.min(Tmas, END - 1.05), Tapex = Tlanza + 0.45;
export const momentos = { salta: Tsalta, aprieta: Tapr, lanza: Tlanza };

const SUELO = 1020;                 // el borde del pasto (en el jardín, antes de subir)
const BX = 560, BY = 1330;          // el botón
const S0 = 0.72, PATAS = 345 * S0;  // del centro del gato a los pies
// la cámara: quieta; en el lanzamiento sube (todo baja) y luego el gato cae
const sube = (t) => 2200 * entra(tr(t, Tlanza, Tapex));
// las nubes: quietas, suben con la cámara y al final caen como en el primer fotograma (cae = 0 y 2600 px/s al acabar)
const Dfall = END - Tapex, CAEAPEX = -0.5 * 2600 * Dfall, CST = CAEAPEX + 1500;
function cae(t) {
  if (t < Tlanza) return CST;
  if (t < Tapex) return mez(CST, CAEAPEX, entra(tr(t, Tlanza, Tapex)));
  const d = t - Tapex; return CAEAPEX + 0.5 * (2600 / Dfall) * d * d;
}
const velC = (t) => (t < Tapex ? 0 : (2600 * (t - Tapex)) / Dfall);

const CONFETI = (() => { const az = k.azar(1515), l = []; for (let i = 0; i < 90; i++) { const a = az() * PI * 2, s = 600 + az() * 1400; l.push({ vx: Math.cos(a) * s, vy: Math.sin(a) * s - 700, giro: (az() - 0.5) * 16, c: ["#ff3b30", "#ffd23f", "#4a90e2", "#7ed321", "#bd10e0", "#ffffff"][i % 6], w: 14 + az() * 18 }); } return l; })();

function boton(g, x, y, hunde, brilla) {
  const W = 760, H = 210;
  g.save(); g.translate(x, y + 18 * hunde);
  if (brilla > 0) k.brillo(g, 0, 0, 1400, "255,80,60", 0.55 * brilla);
  g.fillStyle = "rgba(20,60,10,0.4)"; g.beginPath(); g.ellipse(0, H / 2 + 20, W * 0.52, 40, 0, 0, 2 * PI); g.fill();
  k.redondo(g, -W / 2, -H / 2 + 30 * (1 - hunde), W, H, H / 2); g.fillStyle = "#8f140d"; g.fill();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2); bg.addColorStop(0, "#ff6a5c"); bg.addColorStop(0.5, "#ff3b30"); bg.addColorStop(1, "#d42a20");
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)"; k.redondo(g, -W / 2 + 40, -H / 2 + 16, W - 80, 50, 25); g.fill();
  // el «+» de seguir
  g.save(); g.translate(-268, 4); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, 50, 0, 2 * PI); g.fill();
  g.fillStyle = "#ff3b30"; g.fillRect(-28, -8, 56, 16); g.fillRect(-8, -28, 16, 56); g.restore();
  g.fillStyle = "#fff"; g.font = "900 100px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(120,10,5,0.6)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
  g.fillText("SÍGUEME", 70, 8);
  g.restore();
}

export function dibuja(g, t) {
  const up = sube(t);
  cielo(g, cae(t), velC(t));
  const yS = SUELO + up;
  pasto(g, yS, t);
  // el botón: entra creciendo, se hunde en «sígueme» y salta como un muelle al lanzar
  const ent = entra(tr(t, T0 - 0.03, T0 + 0.4));
  const hunde = claves([[0, 0], [Tapr - 0.02, 0], [Tapr + 0.08, 1], [Tlanza - 0.1, 0.9], [Tlanza, -0.6], [Tlanza + 0.2, 0]])(t);
  const brilla = su(tr(t, Tapr, Tapr + 0.3)) * (1 - su(tr(t, Tlanza, Tlanza + 0.4)));
  if (BY + up < 2200) {
    g.save(); g.translate(BX, BY + up); g.scale(mez(0.6, 1, ent), mez(0.6, 1, ent)); g.translate(-BX, -(BY + up));
    boton(g, BX, BY + up, hunde, brilla); g.restore();
  }
  // el gato: de pie en el pasto; salta al botón; lo lanza; da media vuelta y cae de espaldas (el primer fotograma)
  const encima = BY - 105 + 18 * Math.max(0, hunde) - PATAS + 25;
  let x, y, s, ang = 0, rf = 0, rb = 0, ef = 0.1, eb = 0.1, opc = { colaFase: t * 3 };
  const tt = t - END; // al final, el tiempo del primer fotograma (t = 0)
  if (t < Tsalta) { const w = tr(t, T0, T0 + 1.4); x = mez(80, 330, su(w)); y = SUELO - PATAS + 30 - 10 * Math.abs(Math.sin(t * 11)) * (1 - su(tr(w, 0.8, 1))); s = S0; opc = { colaFase: t * 3, agita: 0.5 * (1 - su(tr(w, 0.8, 1))) }; }
  else if (t < Tlanza) {
    const u = tr(t, Tsalta, Tapr);
    x = mez(330, BX - 20, su(u)); y = mez(SUELO - PATAS + 30, encima, u) - 260 * Math.sin(PI * u); s = S0;
    ef = eb = t < Tapr ? 0.35 * Math.sin(PI * u) : 0.25 * Math.max(0, hunde);
  } else {
    const u = tr(t, Tlanza, END);
    const a = su(u);
    x = mez(BX - 20, 430, a); y = mez(encima, 980, entra(tr(t, Tlanza, Tapex))); s = mez(S0, 1.5, a);
    rf = mez(0, PI, su(tr(t, Tlanza + 0.1, Tapex + 0.15))); rb = mez(0, PI, su(tr(t, Tlanza + 0.2, Tapex + 0.3)));
    ef = mez(0.1, 0.35, a); eb = mez(0.1, 0.5, a);
    opc = { agita: 0.6 * su(tr(t, Tapex, END)), colaFase: mez(t * 3, tt * 5, a) };
  }
  if (yS < 1960) sombraEnSuelo(g, x + 20, yS + 30, 300, 1 - su(tr(t, Tlanza, Tlanza + 0.3)));
  const tg = t < Tlanza ? t : mez(t, tt, su(tr(t, Tlanza, END)));
  gato(g, x, y, s, ang, rf, rb, ef, eb, 0, tg, opc);
  // confeti al apretar
  const w = t - Tapr;
  if (w > 0 && w < 2.5) for (const p of CONFETI) {
    const cx = BX + p.vx * w * (1 - 0.3 * w), cy = BY + up + p.vy * w + 1400 * w * w;
    if (cy > 2000) continue;
    g.save(); g.translate(cx, cy); g.rotate(p.giro * w); g.fillStyle = p.c; g.globalAlpha *= 1 - tr(w, 1.6, 2.5); g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore();
  }
  if (t > Tapr && t < Tapr + 1) k.fogonazo(g, BX, BY + up, (t - Tapr) * 1.4, 1000, "255,200,150");
  veloArriba(g, 1);
}
