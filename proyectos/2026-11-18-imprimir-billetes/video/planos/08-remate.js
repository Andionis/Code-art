// «Porque el dinero no es la riqueza: imprimir más no hace más pan, solo hace que cada billete valga menos.»
// «Envíaselo a un amigo que le pueda interesar.»
// La panadería: un solo pan grande y dorado en el mostrador, y billetes que llueven alrededor.
// - «riqueza»: el pan brilla (la riqueza es el pan).
// - «imprimir más»: la lluvia de billetes se vuelve un diluvio; «no hace más pan»: el pan sigue siendo uno.
// - «cada billete»: un billete llega grande delante; «valga menos»: se encoge y se apaga, gris.
// - El cierre: la lluvia se calma y la cámara se aleja despacio; reposa al final.
import * as k from "#kit";
import { v } from "#voz";
import { billete } from "../mundo.js";
import { escena, pan, mezCam, CAM0 } from "../panaderia.js";

export const desde = "porque";
const { suave: su, tramo: tr, mez } = k;

const f11 = v.frase(11), f12 = v.frase(12);
const Tini = f11.inicio, Triq = f11.t("riqueza"), Timp = f11.t("imprimir"), Tpan = f11.t("pan"), Tsolo = f11.t("solo");
const Tcada = f11.t("cada"), Tval = f11.t("valga"), Tmen = f11.t("menos"), T12 = f12.inicio, Tfin = v.duracion;

// La lluvia: cada billete nace arriba en su segundo y cae hasta salir por abajo. Una lluvia fina todo el rato y, de
// «imprimir» al cierre, un diluvio. Al cierre dejan de nacer y la pantalla se vacía sola, sin transparencias.
const azL = k.azar(2024);
const nacer = (desde, hasta, ritmo, sem) => { const az = k.azar(sem), out = []; for (let te = desde; te < hasta; te += 1 / ritmo) out.push({ te: te + az() * 0.5 / ritmo, x: az() * 1180 - 50, v: 750 + az() * 450, a0: az() * 6.28, f: az() * 6.28, w: 140 + az() * 130 }); return out; };
const LLUVIA = [...nacer(Tini - 3.5, T12 - 0.2, 9, 11), ...nacer(Timp - 2.2, T12 - 0.9, 30, 12)];
function lluvia(g, t, frente) {
  for (const b of LLUVIA) {
    if ((b.w > 240) !== frente) continue;
    const y = -300 + (t - b.te) * b.v;
    if (y < -300 || y > 2250) continue;
    billete(g, b.x + 50 * Math.sin(t * 2 + b.f), y, b.w, Math.sin(t * 1.5 + b.f) * 0.6, b.a0 + t * 3, 1);
  }
}

const camara = (t) => mezCam({ x: 540, y: 1180, z: 1.18 }, { x: 540, y: 1040, z: 0.98 }, su(tr(t, T12 - 0.1, Tfin - 0.3)));

export function dibuja(g, t) {
  escena(g, t, camara(t), {
    panes: 0, fajo1: 0, cartelAl: 0,
    extra: (g) => {
      lluvia(g, t, false);
      const late = 0.9 * k.pulso(t, Triq + 0.2, 0.25) + 0.7 * k.pulso(t, Tpan + 0.1, 0.2);
      pan(g, 540, 1330 - 6 * Math.sin(t * 2), 520, -0.04, 1, late);
      lluvia(g, t, true);
      // el billete que pierde valor
      const llega = k.entra(tr(t, Tcada - 0.35, Tcada + 0.2)), pierde = su(tr(t, Tval - 0.05, Tmen + 0.45)), va = su(tr(t, T12 + 0.2, T12 + 0.8));
      if (llega > 0 && va < 1) {
        const w = mez(760, 230, pierde), x = mez(1400, 540, llega) + mez(0, 300, va), y = mez(900, 960, pierde) + mez(0, -1100, va);
        billete(g, x, y, w, mez(0.25, -0.1, llega) + pierde * 0.3, 0.15 * Math.sin(t * 3), 1);
        if (pierde > 0.01) { g.save(); g.globalAlpha = 0.6 * pierde; g.translate(x, y); g.rotate(mez(0.25, -0.1, llega) + pierde * 0.3); g.fillStyle = "rgb(70,70,70)"; g.globalCompositeOperation = "saturation"; g.fillRect(-w / 2, -w * 0.23, w, w * 0.46); g.restore(); }
      }
    },
  });
}
export const momentos = { riqueza: Triq + 0.2, imprimir: Timp, pan: Tpan + 0.1, cada: Tcada - 0.1, menos: Tval, fin: Tfin };
