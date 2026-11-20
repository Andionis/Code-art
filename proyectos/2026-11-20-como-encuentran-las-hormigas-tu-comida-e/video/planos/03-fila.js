// «Las demás lo huelen y lo siguen hasta tu comida. Y cada una que vuelve cargada lo marca otra vez... Si hay dos
// caminos, acaban en el más corto...»
// El mismo sitio y la misma cámara (../historia.js): salen del hueco y siguen el rastro (se enciende bajo ellas);
// la cámara baja con la primera; luego todo el camino: vuelven cargadas y marcan; en «fuerte», el rastro brilla más
// grueso; con los dos caminos alrededor de la taza, el corto se enciende y el largo se apaga.
import { escena } from "../historia.js";

export const desde = (v) => v.frase(6).inicio;
export const entrada = "sigue";

export function dibuja(g, t) {
  escena(g, t);
}
