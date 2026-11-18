// «Todos tienen el doble, pero del horno siguen saliendo diez panes.» / «Así que el panadero sube el precio: ahora
// cada pan cuesta dos billetes.» / «Nadie es más rico: solo hay más papel.»
// La panadería, con una sola cámara que va de una cosa a otra:
// - «Todos»: los diez billetes nuevos caen sobre el fajo, que dobla su altura; en «doble», brilla y «20 billetes».
// - «horno»: la cámara va al horno, la puerta sube, el fuego se aviva y sale la pala con diez panes, ni uno más.
// - «panadero sube el precio»: la cámara va al cartel; una flecha roja sube y el cartel tiembla; gira y en «dos»
//   queda «2 billetes».
// - «Nadie es más rico»: la cámara se aleja; «10 panes» y «20 billetes», uno al lado del otro; en «papel», el fajo
//   brilla. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { escena, billeteCae, pan, FAJOS, mezCam, CAM0, HORNO, CARTEL } from "../panaderia.js";

export const desde = "todos#2";
const { suave: su, tramo: tr, mez } = k;

const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const Tini = f5.inicio, Tdob = f5.t("doble"), Thor = f5.t("horno"), Tdiez = f5.t("diez"), Tpan5 = f5.t("panes");
const Tsube = f6.t("sube"), Tahora = f6.t("ahora"), Tdos = f6.t("dos");
const Tnad = f7.t("nadie"), Trico = f7.t("rico"), Tpap = f7.t("papel"), Tfin = v.frase(8).inicio;

export const tBill = Array.from({ length: 10 }, (_, i) => mez(Tini - 0.35, Tdob - 0.05, i / 9));
const CAE = 0.38;

const CHORNO = { x: HORNO.x - 60, y: HORNO.y + 210, z: 1.55 }, CCARTEL = { x: CARTEL.x + 60, y: CARTEL.y + 60, z: 1.55 };
function camara(t) {
  let c = CAM0;
  c = mezCam(c, CHORNO, su(tr(t, Thor - 0.35, Thor + 0.2)));
  c = mezCam(c, CAM0, su(tr(t, Tpan5 + 0.3, f6.inicio + 0.1)));
  c = mezCam(c, CCARTEL, su(tr(t, f6.t("el") , Tsube + 0.1)));
  c = mezCam(c, CAM0, su(tr(t, Tnad - 0.1, Trico + 0.2)));
  return c;
}
// la pala con los diez panes que sale del horno
const abre = (t) => su(tr(t, Thor - 0.15, Thor + 0.2)) * (1 - su(tr(t, Tpan5 + 0.45, f6.inicio + 0.2)));
const pala = (t) => k.entra(tr(t, Thor + 0.15, Tdiez + 0.1)) * (1 - su(tr(t, Tpan5 + 0.3, Tpan5 + 0.7)));
function dibujaPala(g, t) {
  const u = pala(t);
  if (u <= 0.001) return;
  const mx = HORNO.x - 40, my = HORNO.y + 215, sal = 170 * u, sc = mez(0.55, 1.15, u);
  g.save(); g.translate(mx, my + sal); g.scale(sc, sc);
  g.fillStyle = "#6a3d18"; g.fillRect(-18, -70 - 200 * u, 36, 200 * u);
  const pg = g.createLinearGradient(0, -60, 0, 80); pg.addColorStop(0, "#c78a4a"); pg.addColorStop(1, "#7a4a20");
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30; g.shadowOffsetY = 14;
  g.fillStyle = pg; k.redondo(g, -190, -70, 380, 150, 30); g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  for (let i = 0; i < 10; i++) { const fila = i < 5 ? 0 : 1, j = i % 5; pan(g, -150 + j * 75 + fila * 18, -28 + fila * 52, 78, 0.05 * ((i % 3) - 1), 1, 0.4 * k.pulso(t, Tdiez + 0.1, 0.2)); }
  g.restore();
  k.etiqueta(g, mx - 175, my + sal + 110 * sc, "10 panes", "255,210,120", su(tr(t, Tdiez, Tdiez + 0.2)) * (1 - su(tr(t, Tpan5 + 0.3, Tpan5 + 0.5))), 60);
}

export function dibuja(g, t) {
  const llegados = 10 + tBill.filter((x) => t >= x + CAE).length;
  const giro = su(tr(t, Tdos - 0.75, Tdos + 0.02));
  escena(g, t, camara(t), {
    fajo1: llegados,
    abre: abre(t), fuego: abre(t),
    giro, sube: tr(t, Tsube - 0.05, Tsube + 0.35) * (1 - su(tr(t, Tdos + 0.4, Tdos + 0.8))),
    brilloFajos: 0.8 * k.pulso(t, Tdob + 0.1, 0.18) + 0.8 * k.pulso(t, Tpap + 0.1, 0.18),
    brilloPanes: 0.5 * k.pulso(t, Trico + 0.15, 0.2),
    extra: (g) => {
      dibujaPala(g, t);
      tBill.forEach((tb, i) => billeteCae(g, t, tb, tb + CAE, FAJOS[0], 10 + i, i * 1.91 + 4));
      const e1 = su(tr(t, Tdob - 0.05, Tdob + 0.2)) * (1 - su(tr(t, Thor - 0.4, Thor - 0.2)));
      const e2 = su(tr(t, Trico, Trico + 0.25));
      k.etiqueta(g, FAJOS[0].x - 150, FAJOS[0].y + 70, "20 billetes", "150,255,150", Math.max(e1, e2), 64);
      k.etiqueta(g, 170, 1500, "10 panes", "255,210,120", e2, 64);
      k.fogonazo(g, CARTEL.x, CARTEL.y, t - Tdos - 0.02, 600, "255,220,140");
    },
  });
}
export const billetes = tBill.map((x) => x + CAE);
export const momentos = { doble: Tdob + 0.1, horno: Thor - 0.1, pala: Thor + 0.15, sube: Tsube, dos: Tdos, papel: Tpap + 0.1, fin: Tfin };
