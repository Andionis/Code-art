// «Y cuando se acaba la comida... el rastro se borra solo. Así que no te encontró la colonia: te encontró una sola
// hormiga, y se lo contó a todas con un olor. Envíaselo a un amigo que le pueda interesar.»
// El mismo sitio y la misma cámara (../historia.js): la concha se acaba en migas, vuelven a casa y el rastro se apaga;
// en el hueco, la colonia asomada; sale una sola (el anillo), su olor llega a todas y salen detrás de ella; la cámara
// entra hasta su cara. Al acabar la voz, su cara se funde con la del primer fotograma: el último fotograma es el
// primero (preferencias.md: que termine como si fuera a empezar de nuevo).
import * as k from "#kit";
import { v } from "#voz";
import { escena } from "../historia.js";

export const desde = (vz) => vz.frase(9).inicio;
export const entrada = "sigue";

let primero = null;
const hacerPrimero = () => { const l = k.lienzo(1080, 1920), c = l.getContext("2d"); c.fillStyle = "#000"; c.fillRect(0, 0, 1080, 1920); escena(c, 0); return k.fijar(l); };

export function dibuja(g, t) {
  escena(g, t);
  const fin = v.duracion - 1 / 60;
  const u = k.suave(k.tramo(t, v.frase(11).fin + 0.05, fin));
  if (u > 0) {
    primero ??= hacerPrimero();
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = t >= fin ? 1 : u; g.drawImage(primero, 0, 0); g.restore();
  }
}
