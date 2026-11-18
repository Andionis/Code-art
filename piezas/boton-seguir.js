// El botón «+ SEGUIR» (pieza): rojo con su canto, que al apretarlo pasa a «✓ SIGUIENDO» gris claro; y la foto de perfil
// redonda con el anillo de colores. Para el cierre «Síguenos para más».
//   import { botonSeguir, avatar } from "#piezas/boton-seguir.js";
//   botonSeguir(g, 540, 1080, hunde, hecho, brilla)   centro, 760 × 200; hunde 0-1; hecho: 1 = SIGUIENDO; brilla 0-1
//   avatar(g, 540, 760, 150, (g, x, y, r) => { ...dibuja la cosa del vídeo dentro... })
// Ejemplo con el pulgar y el confeti: proyectos/2026-11-18-imprimir-billetes/video/planos/09-siguenos.js.
import * as k from "#kit";

export function botonSeguir(g, x, y, hunde, hecho, brilla) {
  const W = 760, H = 200;
  g.save(); g.translate(x, y + 14 * hunde);
  if (brilla > 0) k.brillo(g, 0, 0, 1500, hecho > 0.5 ? "255,255,255" : "255,80,60", 0.5 * brilla);
  const cara = hecho > 0.5 ? ["#d9d9de", "#f4f4f6", "#c7c7cd"] : ["#ff6a5c", "#ff3b30", "#d42a20"];
  k.redondo(g, -W / 2, -H / 2 + 24 * (1 - hunde), W, H, H / 2); g.fillStyle = hecho > 0.5 ? "#8e8e96" : "#8f140d"; g.fill();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2); bg.addColorStop(0, cara[0]); bg.addColorStop(0.5, cara[1]); bg.addColorStop(1, cara[2]);
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.3)"; k.redondo(g, -W / 2 + 40, -H / 2 + 16, W - 80, 48, 24); g.fill();
  const col = hecho > 0.5 ? "#2a2a30" : "#ffffff";
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 14; g.lineCap = "round"; g.lineJoin = "round";
  g.save(); g.translate(-262, 4);
  if (hecho > 0.5) { g.beginPath(); g.moveTo(-34, 0); g.lineTo(-8, 26); g.lineTo(38, -26); g.stroke(); }
  else { g.beginPath(); g.moveTo(-34, 0); g.lineTo(34, 0); g.moveTo(0, -34); g.lineTo(0, 34); g.stroke(); }
  g.restore();
  g.font = `900 ${hecho > 0.5 ? 84 : 100}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = hecho > 0.5 ? "rgba(0,0,0,0)" : "rgba(120,10,5,0.6)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
  g.fillText(hecho > 0.5 ? "SIGUIENDO" : "SEGUIR", 60, 8);
  g.restore();
}

export function avatar(g, x, y, r, foto) {
  g.save();
  const ag = g.createLinearGradient(x - r, y - r, x + r, y + r); ag.addColorStop(0, "#ffd23f"); ag.addColorStop(0.5, "#ff3b30"); ag.addColorStop(1, "#c13584");
  g.fillStyle = ag; g.beginPath(); g.arc(x, y, r + 14, 0, 6.2832); g.fill();
  g.fillStyle = "#2a1206"; g.beginPath(); g.arc(x, y, r + 4, 0, 6.2832); g.fill();
  const bg = g.createRadialGradient(x, y - r * 0.3, 10, x, y, r); bg.addColorStop(0, "#a65a26"); bg.addColorStop(1, "#4a200c");
  g.fillStyle = bg; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.clip();
  if (foto) foto(g, x, y, r);
  g.restore();
}
