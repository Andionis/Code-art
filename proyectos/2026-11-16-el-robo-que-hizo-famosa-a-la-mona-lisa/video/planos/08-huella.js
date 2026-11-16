// «En el vidrio, la policía encontró una huella del ladrón. / Y sus huellas estaban en los archivos de la policía,
// porque ya lo habían detenido antes. / Pero solo guardaban las de la mano derecha… y esa era de la izquierda.»
// El laboratorio de la policía, bajo una lámpara: el vidrio sobre la mesa; el polvo descubre la huella. La cámara baja
// al archivo: miles de fichas que pasan; sale la del ladrón, con su mano derecha. «izquierda»: la huella del vidrio
// llega a su lado, gira y no encaja: una X roja.
import * as k from "#kit";
import { v } from "#voz";
import { huella, manoSilueta, persona, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;
const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const T0 = f8.inicio, Thue = f8.t("huella"), Tarc = f9.t("archivos"), Tdet = f9.t("detenido"), Tder = f10.t("derecha"), Tizq = f10.t("izquierda"), Fin = f10.fin;
export const polvo = [T0 + 0.5, T0 + 1.1, Thue - 0.3];
export const aparece = Thue;
export const baja = f9.inicio - 0.1;
export const fichas = Array.from({ length: 10 }, (_, i) => Tarc - 0.4 + i * 0.12);
export const sale = Tdet - 0.1, llegaHuella = Tizq - 0.45, cruz = Tizq + 0.05;

// las fichas del archivo: una cuadrícula de cajones
function archivo(g, y0, t) {
  const gr = g.createLinearGradient(0, y0, 0, y0 + 1920); gr.addColorStop(0, "#3a2a1a"); gr.addColorStop(1, "#1a120a");
  g.fillStyle = gr; g.fillRect(0, y0, 1080, 1920);
  for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) {
    const x = 40 + c * 255, y = y0 + 80 + r * 260;
    g.fillStyle = "#6a4626"; g.fillRect(x, y, 235, 230);
    g.fillStyle = "#4a2e16"; g.fillRect(x + 12, y + 12, 211, 206);
    g.fillStyle = "#e8dcc0"; g.fillRect(x + 80, y + 40, 75, 34);
    g.fillStyle = "#c89a40"; g.fillRect(x + 92, y + 150, 50, 16);
    // las fichas que asoman
    for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "#efe6cf" : "#e2d6b8"; g.fillRect(x + 25 + i * 3, y + 90 + i * 4, 185, 10); }
  }
}

// la ficha del ladrón: su foto de perfil y las cinco huellas de la mano derecha
function ficha(g, x, y, esc, t) {
  g.save(); g.translate(x, y); g.scale(esc, esc);
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 20;
  g.fillStyle = "#efe6cf"; g.fillRect(-420, -520, 840, 1040); g.shadowColor = "rgba(0,0,0,0)";
  g.fillStyle = "#222"; g.font = "800 46px Figtree"; g.textAlign = "left"; g.textBaseline = "alphabetic";
  g.fillText("PRÉFECTURE DE POLICE", -380, -455);
  g.fillRect(-380, -435, 760, 4);
  // la foto: de frente y de perfil, en sepia
  for (let i = 0; i < 2; i++) {
    const fx = -380 + i * 200;
    g.fillStyle = "#8a7a62"; g.fillRect(fx, -410, 180, 230);
    g.save(); g.beginPath(); g.rect(fx, -410, 180, 230); g.clip();
    persona(g, fx + 90, -60, 330, { ropa: "#2a2218", piel: "#3a2e24", sinBrazos: true });
    g.restore();
  }
  g.font = "700 34px Figtree"; g.fillStyle = "#333";
  g.fillText("Nombre: V. P.", 30, -370); g.fillText("Detenido antes: sí", 30, -320);
  // las huellas: los cinco dedos de la derecha
  g.fillStyle = "#222"; g.font = "800 40px Figtree"; g.fillText("MANO DERECHA", -380, -110);
  for (let i = 0; i < 5; i++) {
    const hx = -380 + i * 155;
    g.strokeStyle = "#555"; g.lineWidth = 3; g.strokeRect(hx, -80, 140, 190);
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.8; g.filter = "invert(1)"; g.drawImage(huella(), hx + 15, -70, 110, 150); g.filter = "none"; g.restore();
  }
  g.restore();
}

export function dibuja(g, t) {
  // la cámara: arriba la mesa con el vidrio; baja al archivo
  const bU = su(tr(t, baja, Tarc + 0.1));
  const camY = mez(0, 1920, bU);
  g.save(); g.translate(0, -camY);
  // --- la mesa con el vidrio, bajo la lámpara
  const gr = g.createRadialGradient(540, 980, 100, 540, 980, 1200); gr.addColorStop(0, "#2a3a4a"); gr.addColorStop(1, "#06080c");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.manchas, 0, 0, 1080, 1920); g.restore();
  // el vidrio, grande
  const zv = mez(1, 1.25, su(tr(t, T0, Thue + 0.4)));
  g.save(); g.translate(540, 1050); g.scale(zv, zv); g.rotate(-0.05);
  g.fillStyle = "rgba(170,210,230,0.16)"; g.fillRect(-380, -520, 760, 1040);
  g.strokeStyle = "rgba(220,240,255,0.7)"; g.lineWidth = 6; g.strokeRect(-380, -520, 760, 1040);
  const rg = g.createLinearGradient(-380, -520, 380, 520); rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,255,255,0.25)"); rg.addColorStop(0.38, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(-380, -520, 760, 1040);
  // el polvo cae y la huella aparece
  const ap = su(tr(t, aparece - 0.5, aparece + 0.15));
  const az = k.azar(5);
  for (let i = 0; i < 160; i++) {
    const x = (az() - 0.5) * 420, y0 = (az() - 0.5) * 400, d = az();
    const u = tr(t, T0 + d * 1.6, T0 + d * 1.6 + 0.6);
    if (u <= 0) continue;
    g.fillStyle = `rgba(255,255,255,${0.7 * (1 - 0.6 * u)})`; g.beginPath(); g.arc(x, y0 - 300 * (1 - u) - 40, 3 + az() * 3, 0, Math.PI * 2); g.fill();
  }
  if (ap > 0) {
    g.save(); g.globalAlpha = ap; g.drawImage(huella(), -200, -300, 400, 520); g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, -40, 900, "190,230,255", 0.35 * ap + 0.4 * k.pulso(t, aparece + 0.05, 0.15)); g.restore();
  }
  g.restore();
  // la lámpara arriba
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 520, 1300, "255,230,180", 0.3); g.restore();
  // --- el archivo, debajo
  archivo(g, 1920, t);
  g.restore();
  // las fichas pasan volando por delante
  for (let i = 0; i < fichas.length; i++) {
    const u = tr(t, fichas[i], fichas[i] + 0.5);
    if (u <= 0 || u >= 1) continue;
    const x = mez(-300, 1400, u), y = 800 + (i % 3) * 300 + Math.sin(i) * 80;
    g.save(); g.translate(x, y); g.rotate(-0.4 + u * 0.8 + i);
    g.fillStyle = "#efe6cf"; g.fillRect(-140, -90, 280, 180); g.fillStyle = "rgba(0,0,0,0.4)"; for (let l = 0; l < 5; l++) g.fillRect(-110, -60 + l * 28, 200, 8);
    g.restore();
  }
  // la ficha del ladrón sale del archivo y llena la pantalla
  const sU = k.entra(tr(t, sale, sale + 0.6));
  if (sU > 0) {
    g.fillStyle = `rgba(0,0,0,${0.5 * sU})`; g.fillRect(0, 0, 1080, 1920);
    const desliza = su(tr(t, llegaHuella - 0.2, llegaHuella + 0.3));
    const acerca = su(tr(t, sale + 0.5, llegaHuella - 0.2));
    ficha(g, 540 + 30 * Math.sin(acerca * 3), mez(1700, 1150, sU) - 170 * desliza + 60 * acerca * (1 - desliza), mez(0.2, 1.15, sU) * mez(1, 0.75, desliza) * (1 + 0.12 * acerca * (1 - desliza)), t);
    // «derecha»: la silueta de la mano derecha brilla sobre la ficha
    const md = su(tr(t, Tder - 0.25, Tder + 0.1)) * (1 - su(tr(t, llegaHuella - 0.2, llegaHuella)));
    if (md > 0) { g.save(); g.globalAlpha = md; manoSilueta(g, 540, mez(1700, 1380, md), 520, 1, "rgba(80,200,120,0.55)"); g.restore(); }
  }
  // «izquierda»: la huella del vidrio llega abajo, con su mano izquierda; no encaja
  const lh = k.entra(tr(t, llegaHuella, llegaHuella + 0.45));
  if (lh > 0) {
    const y = mez(2300, 1350, lh);
    g.save(); g.fillStyle = "rgba(20,30,40,0.9)"; k.redondo(g, 140, y - 220, 800, 470, 30); g.fill(); g.restore();
    manoSilueta(g, 330, y + 40, 330, -1, "rgba(255,255,255,0.85)");
    g.drawImage(huella(), 560, y - 170, 260, 340);
    g.fillStyle = "#fff"; g.font = "800 52px Figtree"; g.textAlign = "center"; g.fillText("IZQUIERDA", 690, y + 215);
    const x = su(tr(t, cruz, cruz + 0.2));
    if (x > 0) {
      g.strokeStyle = "rgba(255,50,45,0.95)"; g.lineWidth = 30; g.lineCap = "round";
      g.beginPath(); g.moveTo(540 - 260 * x, 1100 - 260 * x); g.lineTo(540 + 260 * x, 1100 + 260 * x); g.moveTo(540 + 260 * x, 1100 - 260 * x); g.lineTo(540 - 260 * x, 1100 + 260 * x); g.stroke();
      k.brillo(g, 540, 1100, 900, "255,60,50", 0.4 * x);
    }
  }
  veloArriba(g, 0.45);
}
