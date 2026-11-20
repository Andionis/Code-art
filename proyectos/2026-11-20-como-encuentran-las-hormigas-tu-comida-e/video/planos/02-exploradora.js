// «Con sus antenas huele el azúcar... Toma un poquito y vuelve a casa tocando el piso con la punta de su cuerpo. Así
// deja un rastro de olor, como migas de pan por el camino, pero invisibles.»
// El mismo sitio y la misma cámara (../historia.js): entra a su cabeza (las antenas, el olor rosa del azúcar), muerde,
// se da la vuelta; la punta del abdomen deja gotas cian; la cámara se aleja con ella; en «migas» el rastro se ve de
// migas de pan; en «invisibles» se queda en un brillo tenue, y ella entra en el hueco.
import { escena } from "../historia.js";

export const desde = (v) => v.frase(3).inicio;
export const entrada = "sigue";

export function dibuja(g, t) {
  escena(g, t);
}
