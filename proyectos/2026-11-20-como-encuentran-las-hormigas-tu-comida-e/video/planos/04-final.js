// «Y cuando se acaba la comida... el rastro se borra solo. Así que no te encontró la colonia: te encontró una sola
// hormiga, y se lo contó a todas con un olor. Envíaselo a un amigo que le pueda interesar.»
// El mismo sitio y la misma cámara (../historia.js): la concha se acaba en migas, vuelven a casa y el rastro se apaga;
// en el hueco, la colonia asomada; sale una sola (el anillo), su olor llega a todas y salen detrás de ella; la cámara
// entra hasta su cara, como en el primer fotograma.
import { escena } from "../historia.js";

export const desde = (v) => v.frase(9).inicio;
export const entrada = "sigue";

export function dibuja(g, t) {
  escena(g, t);
}
