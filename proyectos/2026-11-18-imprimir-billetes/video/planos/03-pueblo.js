// «Imagina un pueblo con diez panes y diez billetes: cada pan cuesta un billete.»
// La panadería del pueblo, cálida, con el horno encendido al fondo.
// - «diez panes»: diez panes dorados caen uno a uno y forman una pirámide sobre el mostrador.
// - «diez billetes»: diez billetes caen aleteando y forman un fajo.
// - «cada pan cuesta un billete»: baja colgado el cartel de pizarra «1 PAN = 1 billete».
// La cámara empieza cerca y se aleja despacio hasta ver la panadería entera; reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { escena, billeteCae, FAJOS, mezCam, CAM0 } from "../panaderia.js";

export const desde = "imagina";
const { suave: su, tramo: tr, mez } = k;

const f3 = v.frase(3);
const Tini = f3.inicio, Tpan = f3.t("panes"), Tdiez2 = f3.t("diez#2"), Tbil = f3.t("billetes"), Tcada = f3.t("cada"), Tfin = f3.fin;
// los panes: de abajo arriba, entre «diez» y poco después de «panes»
export const tPanes = Array.from({ length: 10 }, (_, i) => mez(Tini + 0.85, Tpan + 0.3, i / 9));
// los billetes: diez que caen entre «diez» (el segundo) y un poco después de «billetes»
export const tBill = Array.from({ length: 10 }, (_, i) => mez(Tdiez2 - 0.15, Tbil + 0.55, i / 9));
const CAE = 0.45;

export function dibuja(g, t) {
  const cam = mezCam({ x: 520, y: 1020, z: 1.14 }, CAM0, su(tr(t, Tini, Tcada + 0.4)));
  const llegados = tBill.filter((x) => t >= x + CAE).length;
  const baja = k.entra(tr(t, Tcada - 0.1, Tcada + 0.45));
  escena(g, t, cam, {
    tPanes,
    fajo1: llegados,
    cartelDy: -700 * (1 - baja), cartelAl: baja > 0 ? 1 : 0,
    brilloPanes: 0.6 * k.pulso(t, Tpan + 0.35, 0.15),
    extra: (g) => tBill.forEach((tb, i) => billeteCae(g, t, tb, tb + CAE, FAJOS[0], i, i * 1.37)),
  });
}

export const panes = tPanes.map((x) => x + 0.28);
export const billetes = tBill.map((x) => x + CAE);
export const momentos = { cartel: Tcada + 0.3, fin: Tfin };
