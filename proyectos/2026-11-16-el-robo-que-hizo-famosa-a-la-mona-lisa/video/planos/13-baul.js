// «Mientras tanto, la Mona Lisa estaba escondida en un baúl con doble fondo, en el cuarto del ladrón. / La policía
// llegó a interrogarlo ahí mismo, y no la encontró. / Así pasaron dos años.»
// Un cuarto pobre de París, a la luz de una vela: el baúl se abre, el doble fondo se levanta y dentro brilla la Mona
// Lisa; se cierra. Se abre la puerta: la linterna de un policía barre el cuarto, pasa sobre el baúl y se va. Luego los
// días pasan por la ventana y el año corre de 1911 a 1913.
import * as k from "#kit";
import { v } from "#voz";
import { persona, mona, ML_W, ML_H, oscuridad, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(15).inicio;
const { suave: su, tramo: tr, mez } = k;
const f15 = v.frase(15), f16 = v.frase(16), f17 = v.frase(17);
const T0 = f15.inicio, Tbau = f15.t("baul"), Tfon = f15.t("fondo"), Tcua = f15.t("cuarto"), Tpol = f16.t("policia"), Tint = f16.t("interrogarlo"), Tenc = f16.t("encontro"), Tpas = f17.t("pasaron"), Tano = f17.t("anos"), Fin = f17.fin;
export const abre = Tbau - 0.15, levanta = Tfon - 0.2, cierra = Tcua + 0.25, puerta = f16.inicio - 0.05, puertaCierra = Tenc + 0.35;

const BX = 540, BY = 1500, BW = 620, BH = 300;   // el baúl: el centro de su frente

function madera(g, x, y, w, h, c1, c2) {
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
  g.fillStyle = gr; g.fillRect(x, y, w, h);
  g.strokeStyle = "rgba(40,20,5,0.35)"; g.lineWidth = 3;
  for (let i = 1; i < h / 22; i++) { g.beginPath(); g.moveTo(x, y + i * 22); g.bezierCurveTo(x + w * 0.3, y + i * 22 - 6, x + w * 0.6, y + i * 22 + 6, x + w, y + i * 22); g.stroke(); }
}

function baul(g, t) {
  const tapa = su(tr(t, abre, abre + 0.45)) * (1 - su(tr(t, cierra, cierra + 0.35)));
  const fondo = su(tr(t, levanta, levanta + 0.4)) * (1 - su(tr(t, cierra - 0.3, cierra)));
  const top = BY - BH / 2;
  // la tapa abierta: se levanta detrás (vemos su cara de dentro)
  if (tapa > 0.02) {
    const lh = 330 * tapa;
    madera(g, BX - BW / 2 - 10, top - lh, BW + 20, lh, "#5a3416", "#3a200c");
    g.fillStyle = "#2a2a2a"; for (const dx of [-220, 220]) g.fillRect(BX + dx - 18, top - lh, 36, lh);
    // el interior oscuro
    g.fillStyle = "#140a04"; g.fillRect(BX - BW / 2 + 16, top - 40 * tapa, BW - 32, 40 * tapa);
  }
  // el cuadro sale de debajo del doble fondo
  if (fondo > 0) {
    const w = 250, h = w * ML_H / ML_W;
    g.save(); g.beginPath(); g.rect(BX - BW / 2, top - 600, BW, 600); g.clip();
    g.drawImage(mona(), BX - w / 2, top - h * 0.8 * fondo + 20, w, h);
    g.restore();
    k.brillo(g, BX, top - 160, 760, "255,215,140", 0.45 * fondo);
  }
  // el doble fondo con la ropa: se aparta a la derecha
  if (tapa > 0.3) {
    const sx = BX + fondo * 420, sy = top - 30 - fondo * 60;
    g.save(); g.globalAlpha = 1 - 0.0 * fondo;
    g.fillStyle = "#6a4426"; g.fillRect(sx - 200, sy, 400, 28);
    g.fillStyle = "#c8b8a0"; g.beginPath(); g.ellipse(sx - 70, sy - 14, 110, 30, 0.1, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#5a6a8a"; g.beginPath(); g.ellipse(sx + 80, sy - 16, 100, 30, -0.1, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  // el frente del baúl
  madera(g, BX - BW / 2, top, BW, BH, "#8a5428", "#3a200c");
  g.fillStyle = "#2a2a2a"; for (const dx of [-220, 220]) g.fillRect(BX + dx - 18, top, 36, BH);
  g.fillStyle = "#3a3a3a"; g.fillRect(BX - BW / 2, top, BW, 14); g.fillRect(BX - BW / 2, top + BH - 14, BW, 14);
  g.fillStyle = "#c8a040"; g.fillRect(BX - 30, top + 20, 60, 70); g.fillStyle = "#3a2a10"; g.fillRect(BX - 6, top + 45, 12, 26);
  // la tapa cerrada
  if (tapa < 0.98) {
    const th = 90 * (1 - tapa);
    madera(g, BX - BW / 2 - 10, top - th, BW + 20, th, "#9a6232", "#5a3416");
    g.fillStyle = "#2a2a2a"; for (const dx of [-220, 220]) g.fillRect(BX + dx - 18, top - th, 36, th);
  }
}

export function dibuja(g, t) {
  // la cámara: pegada al baúl; en «cuarto» se aleja para ver el cuarto entero
  const zu = su(tr(t, Tcua - 0.3, Tcua + 0.9));
  const Z = mez(1.75, 1.0, zu), CX = mez(BX, 540, zu), CY = mez(BY - 280, 960, zu);
  const S = (x, y) => ({ x: 540 + (x - CX) * Z, y: 960 + (y - CY) * Z });
  g.save(); g.translate(540, 960); g.scale(Z, Z); g.translate(-CX, -CY);
  // el cuarto: papel pintado, cama, ventana
  const gr = g.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, "#3a3020"); gr.addColorStop(1, "#1a140c");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 10; for (let x = 30; x < 1080; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1350); g.stroke(); }
  g.fillStyle = "#2a1a0e"; g.fillRect(0, 1350, 1080, 570);
  // la ventana: los días pasan
  const dias = tr(t, Tpas - 0.2, Fin - 0.35);
  const fase = dias >= 1 ? 0.5 : dias > 0 ? (dias * 5.5) % 1 : 0, luz = dias > 0 ? 0.5 + 0.5 * Math.sin(fase * Math.PI * 2 - Math.PI / 2) : 0.1;
  const wx = 640, wy = 560, ww = 330, wh = 430;
  g.fillStyle = `rgb(${Math.round(mez(20, 200, luz))},${Math.round(mez(30, 210, luz))},${Math.round(mez(60, 230, luz))})`; g.fillRect(wx, wy, ww, wh);
  g.strokeStyle = "#4a3018"; g.lineWidth = 18; g.strokeRect(wx, wy, ww, wh); g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.stroke();
  // la cama
  g.fillStyle = "#5a4a3a"; g.fillRect(40, 1150, 420, 200); g.fillStyle = "#d8ccb4"; g.fillRect(40, 1110, 420, 70); g.fillStyle = "#3a2410"; g.fillRect(30, 1000, 30, 400);
  // la vela
  g.fillStyle = "#efe6cf"; g.fillRect(905, 1220, 34, 110); g.fillStyle = "#3a2410"; g.fillRect(860, 1330, 160, 20);
  g.fillStyle = "#ffd27a"; g.beginPath(); g.ellipse(922, 1195 + Math.sin(t * 13) * 3, 12, 26, 0, 0, Math.PI * 2); g.fill();
  baul(g, t);
  // el polvo que se va posando sobre el baúl con los días
  if (dias > 0) { g.fillStyle = `rgba(200,190,170,${0.35 * dias})`; g.fillRect(BX - BW / 2 - 10, BY - BH / 2 - 96, BW + 20, 12); }
  // la puerta se abre: el policía y su linterna
  const pa = su(tr(t, puerta, puerta + 0.4)) * (1 - su(tr(t, puertaCierra, puertaCierra + 0.35)));
  const dx = 40, dy = 700, dw = 300, dh = 650;
  g.fillStyle = "#0a0806"; g.fillRect(dx, dy, dw, dh);
  if (pa > 0) {
    g.fillStyle = "#c8c0a8"; g.fillRect(dx, dy, dw * pa, dh);
    persona(g, dx + 150, dy + dh + 10, 640 * Math.min(1, pa * 1.3), { sombrero: "kepi", ropa: "#141a2a", luz: 0.4 });
  }
  g.fillStyle = "#4a2e16"; g.fillRect(dx + dw * pa, dy, dw * (1 - pa) * 0.15 + 20, dh);
  g.restore();
  // la noche y las luces: la vela, la ventana y la linterna que barre
  const luces = [{ x: 922, y: 1200, r: 620, al: 0.9 }];
  if (dias > 0) luces.push({ x: wx + ww / 2, y: wy + wh / 2 + 300, r: 1100, al: luz });
  if (pa > 0) {
    const barre = tr(t, Tint - 0.4, Tenc + 0.1);
    const lx = mez(250, 1000, su(barre)), ly = mez(1350, 1300, barre) + Math.sin(barre * 9) * 60;
    luces.push({ x: lx, y: ly, r: 380, al: pa });
  }
  luces.push({ x: BX, y: BY - 300, r: 600, al: su(tr(t, abre, abre + 0.4)) * (1 - su(tr(t, cierra, cierra + 0.4))) });
  oscuridad(g, luces.map((l) => ({ ...S(l.x, l.y), r: l.r * Z, al: l.al })), 0.78);
  // el año corre
  const an = su(tr(t, Tpas - 0.1, Tano + 0.3));
  if (an > 0) k.pastilla(g, 540, 820, String(Math.round(mez(1911, 1913, an))), "", "255,220,150", Math.min(1, an * 3), 140);
  veloArriba(g, 0.3);
}
