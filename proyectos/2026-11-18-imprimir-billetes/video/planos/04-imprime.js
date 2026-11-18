// «Ahora la máquina imprime diez billetes más.»
// La rotativa otra vez, de frente; en «imprime» los rodillos dan un golpe y escupen diez billetes, uno a uno, que
// vuelan hacia la cámara y pasan de largo; un contador «+1 … +10» sube con cada uno. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { billete3D, nave, rotativa, velo } from "../mundo.js";

export const desde = "ahora";
const { suave: su, tramo: tr, mez } = k;

const f4 = v.frase(4);
const Timp = f4.t("imprime"), Tmas = f4.t("mas"), Tfin = v.frase(5).inicio;
export const tSale = Array.from({ length: 10 }, (_, i) => mez(Timp - 0.1, Tmas - 0.15, i / 9));
const VUELO = 0.48;
const cam = (t) => k.mira([0, 2.4, k.mez(36, 30, su(tr(t, f4.inicio - 0.1, Tmas + 0.3)))], [0, 0.4, 0]);
const gira = (t) => 6 * t + 20 * su(tr(t, Timp - 0.15, Tmas + 0.2)) * (t - Timp + 0.15) * 0.5;

export function dibuja(g, t) {
  const c = cam(t);
  nave(g, t);
  const p = k.proyecta(c, [0, 0, 0]), s = k.F / p.z;
  rotativa(g, p.x, p.y, s, t, gira(t), 0);
  const cosas = [];
  tSale.forEach((ts, i) => {
    const u = (t - ts) / VUELO;
    if (u < 0 || u > 1) return;
    const lado = (i % 2 ? 1 : -1) * (1 + (i % 3)) * 0.9;
    const X = [lado * u * 5, 0.2 + u * 6 - u * u * 2, u * 33];
    const o = billete3D(g, c, X, 4.2, lado * 0.25 * u, 1.2 - u * 1.2 + i);
    if (o) cosas.push(o);
  });
  k.deLejosACerca(cosas);
  const n = tSale.filter((ts) => t >= ts).length;
  if (n > 0) k.pastilla(g, 540, 1560, `+${n}`, n === 1 ? "billete" : "billetes", "150,255,150", su(tr(t, tSale[0], tSale[0] + 0.15)), 120);
  k.brillo(g, p.x, p.y, 900, "150,255,170", 0.5 * tSale.reduce((a, ts) => a + k.pulso(t, ts + 0.03, 0.05), 0));
  velo(g);
}
export const salen = tSale;
export const momentos = { fin: Tfin };
