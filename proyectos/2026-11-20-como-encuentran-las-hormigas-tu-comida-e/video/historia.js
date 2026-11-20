// La historia entera en el mismo sitio, sin cortes: los relojes de las colonias, la exploradora, la cámara y el
// dibujo de cada fotograma. Los planos (planos/*.js) solo la ordenan por escenas.
import * as k from "#kit";
import { v } from "#voz";
import * as M from "./mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f = (n) => v.frase(n);

// ---------------------------------------------------------------- tiempos
export const T = {
  rebobina: f(2).t("ninguna"), sola: f(2).t("sola"), azar: f(2).t("azar"),
  f3: f(3).inicio, antenas: f(3).t("antenas"), huele: f(3).t("huele"), azucar: f(3).t("azucar"), narices: f(3).t("narices"),
  toma: f(4).t("toma"), poquito: f(4).t("poquito"), vuelve: f(4).t("vuelve"), tocando: f(4).t("tocando"), punta: f(4).t("punta"), f4fin: f(4).fin,
  rastro: f(5).t("rastro"), migas: f(5).t("migas"), invisibles: f(5).t("invisibles"), f5fin: f(5).fin,
};

// ---------------------------------------------------------------- la colonia del hook (la fila ya formada, por el corto)
export const COL_HOOK = M.colonia(330, 31, { d0: 0, d1: 12, eligeCorto: () => true });
// la protagonista del primer fotograma: vuelve con un cristal de azúcar, recién salida de la concha
const HERO = COL_HOOK[0];
Object.assign(HERO, { corto: true, v: 500, lado: 44, carga: "azucar", come: 1.2, P: [CONCHA_P()[0], CONCHA_P()[1]] });
function CONCHA_P() { return [M.CONCHA[0] - 60, M.CONCHA[1] - 120]; }
const TAU0 = 9;
{
  const E = M.CORTO.at(M.CORTO.L), dP = Math.hypot(HERO.P[0] - E.x, HERO.P[1] - E.y), tB = dP / (HERO.v * 0.45);
  HERO.d = TAU0 - (M.CORTO.L / HERO.v + 2 * tB + HERO.come + 0.75);
}
// el reloj de la colonia: empieza a cámara lenta en la cara de la hormiga y va hacia atrás en «Ninguna»
const RITMO = [];
{ let tau = TAU0; for (let i = 0; i <= 600; i++) { RITMO.push(tau); const t = i / 120; tau += (0.12 + 0.88 * su(tr(t, 0.05, 1.4))) / 120; } }
export function tauHook(t) {
  const adelante = (s) => RITMO[Math.max(0, Math.min(600, Math.round(s * 120)))];
  if (t < T.rebobina - 0.1) return adelante(t);
  const t0 = T.rebobina - 0.1, tau0 = adelante(t0);
  return tau0 * (1 - su(tr(t, t0, T.rebobina + 1.55)));
}

// ---------------------------------------------------------------- la exploradora
const VEL_PASEO = 400;
const TLLEGA = T.azar + 0.2;
export function exploradora(t) {
  if (t < TLLEGA) {
    const s = M.PASEO.L - VEL_PASEO * (TLLEGA - t);
    if (s < 0) return null;
    // en zigzag: tuerce la cabeza a un lado y a otro mientras anda
    const p = M.PASEO.at(s);
    return { x: p.x, y: p.y, a: p.a + Math.sin(t * 9) * 0.25, anda: s, ant: 0.5 };
  }
  const E = M.PASEO.at(M.PASEO.L);
  return { x: E.x, y: E.y, a: E.a, anda: M.PASEO.L, ant: 0.5 + 0.8 * su(tr(t, T.antenas - 0.2, T.antenas + 0.3)) };
}
// la cabeza de la exploradora (para que la cámara la mire)
export const cabeza = (p, d = 15) => [p.x + Math.cos(p.a) * d, p.y + Math.sin(p.a) * d];

// ---------------------------------------------------------------- la cámara: [zoom, x, y]
const lg = Math.log;
export function camara(t) {
  // 1. de la cara de la hormiga (zoom 30) a ver la fila entera, deprisa desde el fotograma 0
  const tauH = tauHook(Math.min(t, 1.6)), hp = M.donde(HERO, tauH) || { x: 0, y: 0, a: 0 };
  const cara = cabeza(hp, 17);
  const u1 = entra(tr(t, 0, 1.55));
  let Z = Math.exp(mez(lg(24), lg(1.0), u1)), cx = mez(cara[0], 0, su(tr(t, 0.05, 1.5))), cy = mez(cara[1], 60, su(tr(t, 0.05, 1.5)));
  Z = Math.exp(mez(lg(Z), lg(0.9), su(tr(t, 1.5, 3.0))));
  cx = mez(cx, -40, su(tr(t, 1.5, 3.0))); cy = mez(cy, 0, su(tr(t, 1.5, 3.0)));
  // 2. sigue a la exploradora y se acerca a ella cuando toca la concha
  const e = exploradora(t);
  if (e) {
    const Te = f(2).t("encontro");
    const w = su(tr(t, Te - 0.1, T.sola + 0.2));
    const Ze = Math.exp(mez(lg(2.6), lg(3.3), su(tr(t, T.sola + 0.2, TLLEGA + 0.1))));
    Z = Math.exp(mez(lg(Z), lg(Ze), w)); cx = mez(cx, e.x, w); cy = mez(cy, e.y + 60 * (1 - su(tr(t, T.sola, TLLEGA))), w);
  }
  return [Z, cx, cy];
}

// ---------------------------------------------------------------- el fotograma
export function escena(g, t) {
  const c = camara(t);
  M.vista(g, ...c);
  M.piso(g, c);
  M.zocalo(g, c);
  M.taza(g);
  M.granos(g, c);
  M.concha(g, 1);
  // la colonia del hook (por el corto), con su rastro suave
  const tauH = tauHook(t);
  const hayHook = t < T.rebobina + 1.7;
  if (hayHook) M.rastro(g, "corto", 0, M.CORTO.L, 0.55 * (1 - su(tr(t, T.rebobina, T.rebobina + 1.5))), t);
  g.save(); M.recortePiso(g);
  if (hayHook) M.dibujaColonia(g, c, COL_HOOK, tauH, t, { ant: 0.3 });
  // la exploradora
  const e = exploradora(t);
  if (e) {
    // sus pasos al azar: un hilo blanco tenue que se va borrando detrás de ella
    const s1 = e.anda, s0 = Math.max(0, s1 - 900), borra = 1 - su(tr(t, T.f3, T.f3 + 1));
    if (borra > 0.01) {
      g.save(); g.setLineDash([6, 9]); g.lineCap = "round"; g.lineWidth = 2.2;
      for (let s = s0; s < s1 - 30; s += 30) { const a = M.PASEO.at(s), b = M.PASEO.at(s + 30); g.strokeStyle = `rgba(255,255,255,${0.5 * borra * ((s - s0) / 900)})`; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
      g.restore();
    }
    M.hormiga(g, e.x, e.y, e.a, { fase: e.anda, t, semilla: 3, zoom: c[0], ant: e.ant });
    // en «sola», un anillo de luz que la señala
    const an = k.pulso(t, T.sola + 0.15, 0.35);
    if (an > 0.02) { g.save(); g.strokeStyle = `rgba(255,255,255,${0.85 * an})`; g.lineWidth = 4 / c[0] * 1.5; g.beginPath(); g.arc(e.x, e.y, 34 + 30 * (1 - an), 0, M.TAU); g.stroke(); g.restore(); }
  }
  g.restore();
  M.luzCocina(g);
}

export const momentos = { rebobina: T.rebobina, sola: T.sola, llega: TLLEGA };
