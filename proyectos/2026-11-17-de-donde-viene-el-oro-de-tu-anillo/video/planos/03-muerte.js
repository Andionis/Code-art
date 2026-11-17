// «Cuando una estrella gigante muere, su centro se aplasta en una bola del tamaño de una ciudad: una estrella de
// neutrones. Es tan densa que...»
// - Sigue desde el centro de la estrella: la cámara sale y el centro con sus hierros se encoge dentro del disco de la
//   estrella, que se vuelve roja y se hincha («gigante»).
// - «muere»: se desploma hacia dentro y revienta (fogonazo, nube roja).
// - «su centro se aplasta»: en medio queda una bola azul blanca que se aprieta hasta hacerse pequeña.
// - «bola del tamaño de una ciudad»: la cámara se acerca; en «ciudad», una ciudad de noche llega a su lado, del mismo
//   ancho, con «20 km».
// - «una estrella de neutrones»: la ciudad se va; la bola late y la cámara se le acerca («Es tan densa»), y frena antes
//   del corte a la balanza.
import * as k from "#kit";
import { v } from "#voz";
import { ciudad, neutrones } from "../mundo.js";
import { dibuja as centro02 } from "./02-estrella.js";

export const desde = "cuando";
export const entrada = "sigue";

const { suave, tramo, entra, pulso } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.inicio, Tgig = f5.t("gigante"), Tmuere = f5.t("muere"), Tcentro = f5.t("centro"), Tapl = f5.t("aplasta");
const Tbola = f5.t("bola"), Tciudad = f5.t("ciudad"), Tneu = f5.t("neutrones"), Tdensa = f6.t("densa"), Tcuch = f6.t("cucharadita");
const Texp = Tmuere + 0.32;

const cielo = k.cielo(33, 1600, [0, 0, 0], 300, 20);
const cam = k.mira([0, 0, 10], [0, 0, 0]);
const CY = 1060;

// la estrella: de muy grande (estábamos dentro) a entera; se hincha; se desploma
const radio = k.claves([[T0 - 0.01, 3600], [T0 + 0.75, 520], [Tgig, 560], [Tmuere, 690], [Texp, 120]]);
const lienzo02 = k.lienzo(1080, 1920);

// la bola: aparece al reventar, se aprieta, la cámara se le acerca, se corre a un lado para la ciudad, y vuelve
const rBola = k.claves([[Texp, 200], [Tcentro, 150], [Tapl + 0.5, 58], [Tbola, 60], [Tciudad - 0.25, 225], [Tneu - 0.2, 225], [Tneu + 0.6, 300], [f5.fin, 320], [Tdensa, 420], [Tcuch - 0.35, 560]]);
const xBola = k.claves([[Tbola, 540], [Tciudad - 0.25, 290], [Tneu - 0.2, 290], [Tneu + 0.6, 540]]);
const xCiudad = (t) => k.mez(1150, 545, entra(tramo(t, Tciudad - 0.5, Tciudad))) + k.mez(0, 700, suave(tramo(t, Tneu - 0.2, Tneu + 0.5)));

export function dibuja(g, t) {
  k.fondo(g, cam);
  k.estrellas(g, cam, null, cielo, 1 - 0.5 * pulso(t, Texp, 0.4));
  // ---- la estrella (antes de reventar)
  if (t < Texp + 0.05) {
    const R = radio(t), P = k.paleta("amarilla", "gigante", suave(tramo(t, T0 + 0.2, Tgig + 0.3)));
    const tiembla = t > Tmuere ? 1 : 0;
    k.estrella(g, P, 540, CY, R, t * 0.15, 0.3 + 0.9 * tiembla * tramo(t, Tmuere, Texp));
    // el centro de antes, encogiéndose dentro del disco mientras la cámara sale
    const al = 1 - suave(tramo(t, T0, T0 + 0.6));
    if (al > 0) {
      const lg = lienzo02.getContext("2d");
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalAlpha = 1; lg.globalCompositeOperation = "source-over";
      lg.fillStyle = "#000"; lg.fillRect(0, 0, 1080, 1920);
      centro02(lg, t);
      const s = Math.min(1, R / 1100);
      g.save(); g.globalAlpha = al;
      g.beginPath(); g.arc(540, CY, R, 0, Math.PI * 2); g.clip();
      g.drawImage(lienzo02, 540 - 540 * s, (CY - 1130 * s) * (1 - s), 1080 * s, 1920 * s);
      g.restore();
    }
  }
  // ---- revienta
  if (t >= Texp) {
    const u = t - Texp;
    g.save(); g.globalAlpha = Math.exp(-u * 0.9);
    k.estallido(g, 540, CY, u * 0.8, "255,120,60", 1.7, 5, 200, 0);
    g.restore();
    k.fogonazo(g, 540, CY, u * 0.9, 2000, "255,190,140");
    // la bola que queda
    const late = pulso(t, Tneu + 0.3, 0.22) + 0.6 * pulso(t, Tdensa + 0.1, 0.2);
    neutrones(g, xBola(t), CY - 60 * tramo(t, Tbola, Tciudad - 0.25) * (1 - tramo(t, Tneu - 0.2, Tneu + 0.6)), rBola(t), t, late, Math.min(1, u * 6));
    // la ciudad a su lado, del mismo ancho
    const ac = tramo(t, Tciudad - 0.5, Tciudad - 0.3) * (1 - tramo(t, Tneu + 0.2, Tneu + 0.5));
    if (ac > 0) {
      ciudad(g, xCiudad(t), CY + 160, 470, ac);
      const ap = tramo(t, Tciudad + 0.05, Tciudad + 0.3) * (1 - tramo(t, Tneu - 0.25, Tneu + 0.05));
      k.pastilla(g, 290 + (xCiudad(t) - 545) * 0, 1330, "20", "km", "190,220,255", ap, 96);
      k.pastilla(g, xCiudad(t) + 235, 1330, "20", "km", "255,214,120", ap, 96);
    }
  }
}

export const revienta = Texp;
