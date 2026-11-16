// «Arriba los esperaban billetes de cincuenta:»
// La bóveda del hook, ahora desde el hoyo recién abierto: la cámara asoma por el piso y ve las pilas de fajos
// alrededor. «cincuenta»: la cifra «R$ 50».
import * as k from "#kit";
import { v } from "#voz";
import { BLOQUES, BOV, PISO, ZH, caraBoveda, caraTunel, fajo, focos, lamparas, luzBoveda, luzTunel, pinta, puerta, varillas, velo } from "../mundo.js";

export const desde = "arriba";
export const entrada = "corte";

const { suave: su, tramo: tr, mez, mezV } = k;
const f8 = v.frase(8);
const Tarr = f8.inicio, Tcin = f8.t("cincuenta"), Ttre = f8.t("tres");
export const momentos = { asoma: Tarr + 0.35, cincuenta: Tcin };

const ESTATICOS = BLOQUES.flatMap((b) => fajo(b.c, b.dim));

function camara(t) {
  const sube = su(tr(t, Tarr - 0.05, Tarr + 0.9));
  const pos = [mez(0, 0.2, sube), mez(PISO - 0.25, PISO + 0.9, sube), ZH + 0.05];
  // mira arriba y adelante; al asomar, gira despacio hacia las pilas de la izquierda
  const nivel = su(tr(t, Tarr + 0.2, Tarr + 1.1)), gira = su(tr(t, Tarr + 0.6, Ttre + 0.1));
  let dir = mezV([0, 0.55, -1], [0, -0.12, -1], nivel);
  dir = mezV(dir, [-0.42, -0.1, -0.9], gira);
  const d = Math.hypot(...dir);
  return k.mira(pos, [pos[0] + dir[0] / d, pos[1] + dir[1] / d, pos[2] + dir[2] / d]);
}

export function dibuja(g, t) {
  const cam = camara(t);
  g.fillStyle = "#050302"; g.fillRect(0, 0, 1080, 1920);
  const lb = luzBoveda(1, 0);
  const lt = (P, c) => luzTunel(P, c, 1, 0);
  const bov = [...caraBoveda, ...ESTATICOS];
  if (cam.p[1] < PISO) {
    pinta(g, cam, bov, lb, { lejos: 30 });
    lamparas(g, cam, 1);
    pinta(g, cam, caraTunel, lt, { lejos: 12, niebla: [8, 4, 2] });
    varillas(g, cam, 0.9);
    focos(g, cam, 1);
  } else {
    pinta(g, cam, caraTunel, lt, { lejos: 12, niebla: [8, 4, 2] });
    pinta(g, cam, bov, lb, { lejos: 30 });
    varillas(g, cam, 1);
    lamparas(g, cam, 1);
    puerta(g, cam, 1, 0, 0);
  }
  // el destello dorado al asomar
  k.brillo(g, 540, 1000, 1800, "255,200,110", 0.35 * k.pulso(t, Tarr + 0.45, 0.25));
  const al = su(tr(t, Tcin - 0.2, Tcin + 0.1));
  k.pastilla(g, 540, 700, "R$ 50", "", "255,214,120", al, 130);
  velo(g, 0.5);
}
