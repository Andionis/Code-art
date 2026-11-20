// «¿Cómo encuentran las hormigas tu comida en minutos? Ninguna te vio dejarla: la encontró una sola, caminando al azar.»
// El piso de la cocina, a escala de hormiga (todo el dibujo, en ../historia.js).
// - Fotograma 0: la cara de una hormiga llena la pantalla, con un cristal de azúcar; la cámara sale disparada hacia
//   arriba y se ve el río de hormigas sobre la concha.
// - «Ninguna»: el tiempo va hacia atrás; todas vuelven de espaldas al hueco del zócalo.
// - «una sola»: entra una hormiga en zigzag, la cámara la sigue y toca la concha en «azar».
import { escena } from "../historia.js";

export const desde = 0;

export function dibuja(g, t) {
  escena(g, t);
}
