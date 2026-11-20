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
  f6: f(6).inicio, huelen: f(6).t("huelen"), siguen: f(6).t("siguen"), comida6: f(6).t("comida"), f6fin: f(6).fin,
  f7: f(7).inicio, vez: f(7).t("vez"), cargada: f(7).t("cargada"), marca: f(7).t("marca"), fuerte: f(7).t("fuerte"), llegan: f(7).t("llegan"), f7fin: f(7).fin,
  dos: f(8).t("dos"), corto: f(8).t("corto"), rapido: f(8).t("rapido"), marca8: f(8).t("marca"), huele8: f(8).t("huele"), f8fin: f(8).fin,
  f9: f(9).inicio, acaba: f(9).t("acaba"), comida9: f(9).t("comida"), nadie: f(9).t("nadie"), borra: f(9).t("borra"), f9fin: f(9).fin,
  f10: f(10).inicio, encontro10: f(10).t("encontro"), colonia: f(10).t("colonia"), encontro10b: f(10).t("encontro", 2), sola10: f(10).t("sola"), hormiga10: f(10).t("hormiga"), conto: f(10).t("conto"), todas: f(10).t("todas"), olor10: f(10).t("olor"), f10fin: f(10).fin,
  f11: f(11).inicio,
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
export const HERO_A = () => (M.donde(HERO, TAU0) || { a: 0 }).a;
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
  const ant = 0.5 + 0.9 * su(tr(t, T.antenas - 0.2, T.antenas + 0.3)) - 0.6 * su(tr(t, T.toma - 0.2, T.toma + 0.3));
  if (t < T.vuelve + 0.05) {
    // olfatea, muerde un trocito y se queda con él
    const boca = k.pulso(t, T.poquito, 0.22) + 0.6 * k.pulso(t, T.toma + 0.1, 0.15);
    return { x: E.x, y: E.y, a: E.a + 0.1 * Math.sin(t * 2.2) * (1 - su(tr(t, T.toma - 0.3, T.toma))), anda: M.PASEO.L + 10 * k.pulso(t, T.poquito, 0.3), ant, boca, carga: t > T.poquito + 0.12 ? "rosa" : null };
  }
  // se da la vuelta y vuelve a casa por el camino largo, tocando el piso con la punta
  const aVuelta = M.LARGO.at(M.LARGO.L).a + Math.PI;
  if (t < T_SALE) {
    let da = aVuelta - E.a; while (da > Math.PI) da -= M.TAU; while (da < -Math.PI) da += M.TAU;
    return { x: E.x, y: E.y, a: E.a + da * su(tr(t, T.vuelve, T_SALE)), anda: M.PASEO.L + 60 * tr(t, T.vuelve, T_SALE), ant: 0.4, carga: "rosa" };
  }
  const s = sVuelta(t);
  if (s <= 0) return null;
  const p = M.LARGO.at(s);
  return { x: p.x, y: p.y, a: p.a + Math.PI, anda: M.PASEO.L + 60 + (M.LARGO.L - s), ant: 0.4, carga: "rosa", punta: su(tr(t, T.tocando - 0.1, T.tocando + 0.3)), s };
}
// el camino de vuelta: más despacio cuando la cámara mira la punta, y entra en el hueco al final de la frase 5
export const T_SALE = T.vuelve + 0.5, T_NIDO = T.f5fin - 0.25;
const VUELTA = [];
{
  const N = 2000, vel = (t) => 1 - 0.65 * k.pulso(t, T.punta + 0.25, 0.55);
  let tot = 0; const acc = [0];
  for (let i = 1; i <= N; i++) { tot += vel(mez(T_SALE, T_NIDO, i / N)); acc.push(tot); }
  for (const a of acc) VUELTA.push(M.LARGO.L * (1 - a / tot));
}
export function sVuelta(t) { const u = tr(t, T_SALE, T_NIDO) * 2000; const i = Math.floor(u); return mez(VUELTA[i], VUELTA[Math.min(2000, i + 1)], u - i) - (t > T_NIDO ? 300 * (t - T_NIDO) : 0); }
// donde empezó a dejar el rastro
export const S_RASTRO = () => sVuelta(T.tocando);
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
  if (t > TLLEGA) {
    // 3. entra hasta su cabeza: las antenas
    const E = M.PASEO.at(M.PASEO.L), cab = cabeza({ x: E.x, y: E.y, a: E.a }, 22);
    const w = su(tr(t, T.f3 - 0.1, T.antenas + 0.35));
    Z = Math.exp(mez(lg(Z), lg(mez(13, 15, tr(t, T.antenas, T.toma))), w)); cx = mez(cx, cab[0], w); cy = mez(cy, cab[1], w);
    // 4. se aleja un poco cuando ella se da la vuelta y la sigue
    if (t > T.vuelve - 0.1 && e) {
      const w2 = su(tr(t, T.vuelve - 0.1, T_SALE + 0.3));
      Z = Math.exp(mez(lg(Z), lg(6.5), w2)); cx = mez(cx, e.x, w2); cy = mez(cy, e.y, w2);
      // 5. la punta de su abdomen, de cerca
      const pt = cabeza(e, -22), w3 = su(tr(t, T.punta - 0.55, T.punta + 0.05)) * (1 - su(tr(t, T.f4fin - 0.6, T.f4fin + 0.2)));
      Z = Math.exp(mez(lg(Z), lg(13), w3)); cx = mez(cx, pt[0], w3); cy = mez(cy, pt[1], w3);
      // 6. se aleja con ella mientras deja el rastro, hasta ver todo el camino
      const w4 = su(tr(t, T.f4fin - 0.6, T.migas));
      Z = Math.exp(mez(lg(Z), lg(2.2), w4));
      const w5 = su(tr(t, T.migas - 0.4, T_NIDO));
      Z = Math.exp(mez(lg(Z), lg(0.85), w5)); cx = mez(cx, 60, w5); cy = mez(cy, -370, w5);
    } else if (t > T.vuelve - 0.1 && !e) { Z = 0.85; cx = 60; cy = -370; }
  }
  if (t > T.f6 - 0.3) {
    // 7. baja con la primera de la fila hasta la concha
    const p = M.donde(COL2[0], tau2(t)) || { x: 85, y: 172 };
    const w = su(tr(t, T.f6 - 0.1, T.huelen + 0.2)) * (1 - su(tr(t, T.comida6 + 0.2, T.f6fin + 0.5)));
    Z = Math.exp(mez(lg(Z), lg(1.35), w)); cx = mez(cx, mez(60, p.x, 0.7), w); cy = mez(cy, p.y + 120, w);
    // 8. todo el camino, del hueco a la concha
    const w2 = su(tr(t, T.comida6 + 0.2, T.f6fin + 0.5));
    Z = Math.exp(mez(lg(Z), lg(0.76), w2)); cx = mez(cx, 40, w2); cy = mez(cy, -190, w2);
    // 9. una que vuelve cargada, de cerca, marcando; y fuera otra vez antes de «fuerte»
    const q = M.donde(CARGADA, tau2(t));
    if (q) {
      const w3 = su(tr(t, T.f7 - 0.1, T.cargada + 0.1)) * (1 - su(tr(t, T.vez + 0.1, T.fuerte - 0.15)));
      Z = Math.exp(mez(lg(Z), lg(3.2), w3)); cx = mez(cx, q.x, w3); cy = mez(cy, q.y, w3);
    }
  }
  if (t > T.f9 - 0.2) {
    // 10. a la concha cuando se acaba, y fuera otra vez mientras se borra el rastro
    const w = su(tr(t, T.f9 - 0.1, T.comida9)) * (1 - su(tr(t, T.nadie - 0.1, T.borra - 0.3)));
    Z = Math.exp(mez(lg(Z), lg(1.45), w)); cx = mez(cx, 40, w); cy = mez(cy, 380, w);
    // 11. al hueco: la colonia
    const w2 = su(tr(t, T.f10 - 0.1, T.encontro10 + 0.6));
    Z = Math.exp(mez(lg(Z), lg(4.2), w2)); cx = mez(cx, M.NIDO[0], w2); cy = mez(cy, -882, w2);
    // 12. la sigue a ella, con todas detrás
    const x = exploradora2(t);
    if (x) {
      const w3 = su(tr(t, T.sola10 - 0.2, T.olor10));
      Z = Math.exp(mez(lg(Z), lg(1.7), w3)); cx = mez(cx, x.x, w3); cy = mez(cy, x.y - 160, w3);
      // 13. hasta su cara, como al principio
      const cara = cabeza(x, 17), w4 = entra(tr(t, T.f11, T.f11 + 2.1));
      Z = Math.exp(mez(lg(Z), lg(24), w4)); cx = mez(cx, cara[0], su(tr(t, T.f11, T.f11 + 1.6))); cy = mez(cy, cara[1], su(tr(t, T.f11, T.f11 + 1.6)));
    }
  }
  return [Z, cx, cy];
}

// ---------------------------------------------------------------- el final: la exploradora sale otra vez, y todas detrás
const T_SALE2 = () => T.encontro10b - 0.1;
const VEL2 = [];
{ let s = 0; for (let i = 0; i <= 1200; i++) { VEL2.push(s); const tt = T_SALE2() + i / 120; s += (tt < T.f11 + 0.2 ? 200 : mez(200, 7, su(tr(tt, T.f11 + 0.2, T.f11 + 1.6)))) / 120; } }
const sExp2 = (t) => t < T_SALE2() ? 0 : VEL2[Math.min(1200, Math.round((t - T_SALE2()) * 120))];
export function exploradora2(t) {
  if (t < T_SALE2()) return null;
  const s = sExp2(t), p = M.CORTO.at(s);
  // al final se gira hasta quedar como la del primer fotograma (para que el video empiece otra vez sin salto)
  const aH = HERO_A(); let da = aH - p.a; while (da > Math.PI) da -= M.TAU; while (da < -Math.PI) da += M.TAU;
  return { x: p.x, y: p.y, a: p.a + da * su(tr(t, T.f11 + 0.5, T.f11 + 2.0)), anda: s, s };
}
// las demás, detrás de ella, desde «todas»
const N_DETRAS = 26;
function detras(t, i) {
  const sE = sExp2(t), sF = Math.min(sE - 62, 420 * (t - (T.todas - 0.25)));
  return sF - 48 * i;
}
// las cabezas de la colonia, asomadas en el hueco
const azC = k.azar(6060);
const ASOMADAS = Array.from({ length: 9 }, (_, i) => ({ x: M.NIDO[0] + (i / 8 - 0.5) * 115 + (azC() - 0.5) * 8, y: M.PARED - 22 - azC() * 18 - Math.abs(i / 8 - 0.5) * 30, a: Math.PI / 2 + (azC() - 0.5) * 0.7, sem: azC() * 9 }));

// ---------------------------------------------------------------- el fotograma
export function escena(g, t) {
  const c = camara(t);
  M.vista(g, ...c);
  M.piso(g, c);
  M.zocalo(g, c);
  M.taza(g);
  M.granos(g, c);
  const entera = 1 - su(tr(t, T.acaba - 0.05, T.comida9 + 0.6));
  M.concha(g, entera);
  if (t > T.acaba) migasConcha(g, t);
  // la colonia del hook (por el corto), con su rastro suave
  const tauH = tauHook(t);
  const hayHook = t < T.rebobina + 1.7;
  if (hayHook) M.rastro(g, "corto", 0, M.CORTO.L, 0.55 * (1 - su(tr(t, T.rebobina, T.rebobina + 1.5))), t);
  // el rastro de la exploradora: de donde está ella hasta donde empezó a marcarlo
  if (t > T.tocando) {
    const e0 = exploradora(t), sE = e0 && e0.s != null ? e0.s : -400;
    const pan = su(tr(t, T.migas - 0.15, T.migas + 0.3)) * (1 - su(tr(t, T.invisibles - 0.45, T.invisibles + 0.1)));
    M.rastro(g, "largo", Math.max(0, sE + 12), S_RASTRO(), fuerzaLargo(t) * (1 - 0.7 * pan), t, { pan });
  }
  // la fila: el rastro largo (que se enciende bajo las que lo siguen), el corto, y las hormigas
  if (t > T.f6 - 0.2) {
    const tau = tau2(t), lead = Math.min(M.LARGO.L, Math.max(0, tau * COL2[0].v));
    const ola = (sv) => sv < lead ? 1 : 0.35;
    M.rastro(g, "largo", 0, M.LARGO.L, fuerzaLargo(t), t, { ola, ancho: anchoLargo(t) });
    M.rastro(g, "corto", 0, M.CORTO.L, fuerzaCorto(t), t, { ancho: anchoCorto(t) });
  }
  // el olor del azúcar sube del pan hacia sus antenas
  { const E = M.PASEO.at(M.PASEO.L), cab = cabeza({ x: E.x, y: E.y, a: E.a }, 30); M.olorAzucar(g, cab[0] + 30, cab[1] + 90, cab, t, oler(t)); }
  g.save(); M.recortePiso(g);
  if (hayHook) M.dibujaColonia(g, c, COL_HOOK, tauH, t, { ant: 0.3 });
  if (t > T.f6 - 0.2) {
    const tau = tau2(t), marca = su(tr(t, T.marca - 0.3, T.marca + 0.2)) * (1 - su(tr(t, T.nadie - 0.2, T.nadie + 0.4)));
    M.dibujaColonia(g, c, COL2, tau, t, { ant: 0.35 });
    // las que vuelven cargadas tocan el piso con la punta: una gota detrás de cada una
    if (marca > 0.01) for (const h of COL2) { const p = M.donde(h, tau); if (p && p.vuelve) { const pt = cabeza(p, -22.5); M.gota(g, pt[0], pt[1], marca * (h.corto ? 1 : 1 - 0.8 * su(tr(t, T.corto, T.huele8))) * (0.5 + 0.5 * Math.max(0, Math.sin(p.anda * 0.32)))); } }
    // el corto, que huele más, brilla también por encima de la fila
    const fc = fuerzaCorto(t) * su(tr(t, T.corto - 0.3, T.rapido));
    if (fc > 0.01) M.rastro(g, "corto", 0, M.CORTO.L, 0.55 * fc, t, { ancho: anchoCorto(t) });
  }
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
    M.hormiga(g, e.x, e.y, e.a, { fase: e.anda, t, semilla: 3, zoom: c[0], ant: e.ant, boca: e.boca || 0, carga: e.carga, punta: e.punta || 0, puntasLuz: oler(t) * (0.6 + 0.4 * Math.sin(t * 11)) });
    // la gota de olor en la punta del abdomen, cada vez que toca
    if (e.punta > 0.05) { const pt = cabeza(e, -22.5), late = 0.55 + 0.45 * Math.max(0, Math.sin(e.anda * 0.32)); M.gota(g, pt[0], pt[1], e.punta * late * (1 + 0.5 * k.pulso(t, T.punta + 0.15, 0.3))); }
    // en «sola», un anillo de luz que la señala
    const an = k.pulso(t, T.sola + 0.15, 0.35);
    if (an > 0.02) { g.save(); g.strokeStyle = `rgba(255,255,255,${0.85 * an})`; g.lineWidth = 4 / c[0] * 1.5; g.beginPath(); g.arc(e.x, e.y, 34 + 30 * (1 - an), 0, M.TAU); g.stroke(); g.restore(); }
  }
  g.restore();
  if (t > T.f10 - 0.3) final(g, t, c);
  M.luzCocina(g);
}

// lo que queda de la concha: migas rosas
const azM = k.azar(1212);
const RESTOS = Array.from({ length: 34 }, () => { const a = azM() * M.TAU, r = Math.sqrt(azM()) * M.RC * 0.9; return { x: M.CONCHA[0] + Math.cos(a) * r, y: M.CONCHA[1] + Math.sin(a) * r, a: azM() * 6, s: 3 + azM() * 5, sale: azM() }; });
function migasConcha(g, t) {
  const u = tr(t, T.acaba, T.comida9 + 0.6);
  for (const m of RESTOS) {
    if (u < m.sale * 0.9) continue;
    const al = 1 - su(tr(t, T.borra, T.f9fin + 0.6));
    g.save(); g.translate(m.x, m.y); g.rotate(m.a); g.globalAlpha *= al;
    const gr = g.createRadialGradient(-1, -1, 0.5, 0, 0, m.s); gr.addColorStop(0, "#ffd7e6"); gr.addColorStop(0.6, "#f590b2"); gr.addColorStop(1, "#c25a2c");
    g.fillStyle = "rgba(90,45,15,0.25)"; g.beginPath(); g.ellipse(1.5, 2, m.s, m.s * 0.7, 0, 0, M.TAU); g.fill();
    g.fillStyle = gr; g.beginPath(); g.moveTo(-m.s, -m.s * 0.6); g.lineTo(m.s * 0.7, -m.s); g.lineTo(m.s, m.s * 0.4); g.lineTo(-m.s * 0.3, m.s); g.closePath(); g.fill();
    g.restore();
  }
}

// el final: la colonia asomada en el hueco; sale ella; el olor llega a todas y salen detrás
function final(g, t, c) {
  const asoma = su(tr(t, T.encontro10 - 0.1, T.colonia + 0.2));
  const avisa = su(tr(t, T.conto - 0.1, T.todas + 0.1));
  // dentro del hueco
  if (asoma > 0.01) {
    g.save(); M.huecoRecorte(g);
    for (const a of ASOMADAS) {
      const sale = 14 * avisa;
      M.hormiga(g, a.x, a.y - 14 * (1 - asoma) + sale, a.a, { t, semilla: a.sem, zoom: c[0], ant: 0.6 + 0.6 * avisa, al: asoma });
      if (avisa > 0.01) M.gota(g, a.x + Math.cos(a.a) * 30, a.y + sale + Math.sin(a.a) * 30, avisa * (0.6 + 0.6 * k.pulso(t, T.olor10 + 0.1, 0.2)));
    }
    const sombra = g.createLinearGradient(0, M.PARED - 80, 0, M.PARED);
    sombra.addColorStop(0, "rgba(5,2,1,0.8)"); sombra.addColorStop(0.6, "rgba(5,2,1,0.25)"); sombra.addColorStop(1, "rgba(5,2,1,0)");
    g.fillStyle = sombra; g.fillRect(M.NIDO[0] - 90, M.PARED - 90, 180, 95);
    g.restore();
  }
  // su rastro, desde el hueco hasta ella, que se enciende y viaja hacia atrás en «contó»
  const x = exploradora2(t);
  if (x) {
    const fz = 0.5 + 0.6 * avisa + 0.6 * k.pulso(t, T.olor10 + 0.1, 0.22);
    const frente = mez(x.s, 0, su(tr(t, T.conto - 0.1, T.todas + 0.2)));
    M.rastro(g, "corto", 0, x.s - 25, fz, t, { ola: (sv) => (avisa > 0 && sv >= frente ? 1.6 : 0.8), ancho: 1 + 0.4 * avisa });
    g.save(); M.recortePiso(g);
    for (let i = 0; i < N_DETRAS; i++) {
      const sv = detras(t, i);
      if (sv <= -30) continue;
      const p = M.CORTO.at(Math.max(0, sv)), lado = ((i * 37) % 7 - 3) * 3;
      const px = p.x - Math.sin(p.a) * lado, py = p.y + Math.cos(p.a) * lado + (sv < 0 ? sv : 0);
      M.hormiga(g, px, py, p.a, { fase: sv, t, semilla: i * 1.3, zoom: c[0], ant: 0.4 });
    }
    M.hormiga(g, x.x, x.y, x.a, { fase: x.anda, t, semilla: 3, zoom: c[0], ant: 0.5 });
    const pt = cabeza(x, -22.5); M.gota(g, pt[0], pt[1], 0.6 + 0.4 * Math.max(0, Math.sin(x.anda * 0.32)));
    const an = k.pulso(t, T.sola10 + 0.15, 0.35);
    if (an > 0.02) { g.strokeStyle = `rgba(255,255,255,${0.85 * an})`; g.lineWidth = 6 / c[0]; g.beginPath(); g.arc(x.x, x.y, 34 + 30 * (1 - an), 0, M.TAU); g.stroke(); }
    g.restore();
  }
}

// cuánto huele el azúcar (las puntas de las antenas se encienden)
function oler(t) { return su(tr(t, T.huele - 0.2, T.azucar + 0.2)) * (1 - su(tr(t, T.toma, T.vuelve))); }
// la fuerza del rastro largo: brilla al dejarlo y se vuelve casi invisible
export function fuerzaLargo(t) {
  let f = 0.95 - 0.62 * su(tr(t, T.invisibles - 0.1, T.invisibles + 0.6));
  f += 0.45 * su(tr(t, T.huelen - 0.2, T.siguen));                       // se enciende al seguirlo
  f += 0.4 * su(tr(t, T.marca - 0.3, T.fuerte)) + 0.5 * k.pulso(t, T.fuerte + 0.08, 0.18); // más fuerte
  f *= 1 - 0.93 * su(tr(t, T.corto - 0.2, T.huele8 + 0.3));              // el largo se apaga
  return f * (1 - su(tr(t, T.acaba + 1.2, T.acaba + 3.3)));
}
export const anchoLargo = (t) => 1 + 0.7 * su(tr(t, T.marca - 0.3, T.fuerte)) - 0.5 * su(tr(t, T.corto, T.huele8));
export function fuerzaCorto(t) {
  let f = 0.45 * su(tr(t, T.dos - 0.3, T.dos + 0.4));
  f += 0.5 * su(tr(t, T.corto - 0.3, T.rapido)) + 0.35 * su(tr(t, T.marca8 - 0.2, T.huele8 + 0.3));
  f += 0.35 * k.pulso(t, T.marca8 + 0.05, 0.15) + 0.35 * k.pulso(t, T.huele8 + 0.1, 0.18);
  return f * (1 - su(tr(t, T.acaba + 1.2, T.acaba + 3.3)));
}
export const anchoCorto = (t) => 1 + 0.8 * su(tr(t, T.corto - 0.3, T.huele8));

// ---------------------------------------------------------------- la fila: las que siguen el rastro
// Salen del hueco desde «Las demás»; cada vez más; las que salen más tarde van más por el corto.
const T0_FILA = 0; // en segundos del vídeo se fija abajo
export function tau2(t) { return t - (T.f6 - 0.15); }
const absT = (d) => d + T.f6 - 0.15;
const pCorto = (d) => { const a = absT(d); return 0.05 + 0.25 * su(tr(a, T.marca, T.dos - 1.5)) + 0.69 * su(tr(a, T.dos - 1.5, T.corto)); };
export const COL2 = M.colonia(520, 77, { d0: 0, d1: T.acaba - 2.2 - (T.f6 - 0.15), ritmo: 2.4, vel: 1.2, eligeCorto: (d, r) => r < pCorto(d) });
Object.assign(COL2[0], { d: 0, v: 560, lado: 0, corto: false });
// cuando se acaba la concha, ninguna se queda comiendo: las que están en ella se van
{
  const tauC = tau2(T.comida9 + 0.2);
  for (const h of COL2) {
    const ruta = h.corto ? M.CORTO : M.LARGO, E = ruta.at(ruta.L);
    const llega = h.d + ruta.L / h.v + Math.hypot(h.P[0] - E.x, h.P[1] - E.y) / (h.v * 0.45);
    if (llega + h.come > tauC) h.come = Math.max(0.15, tauC - llega);
  }
}
// la que la cámara sigue cuando vuelve cargada: sale de la concha justo al empezar la frase 7 y sube por el largo
export const CARGADA = (() => {
  const h = COL2[1], E = M.LARGO.at(M.LARGO.L);
  Object.assign(h, { corto: false, lado: 0, v: 420, come: 0.5, P: [E.x + 10, E.y + 40], carga: "rosa" });
  const tA = M.LARGO.L / h.v, tB = Math.hypot(10, 40) / (h.v * 0.45);
  h.d = tau2(T.f7 - 0.3) - (tA + 2 * tB + h.come);
  return h;
})();
void T0_FILA;

export const momentos = { rebobina: T.rebobina, sola: T.sola, llega: TLLEGA };
