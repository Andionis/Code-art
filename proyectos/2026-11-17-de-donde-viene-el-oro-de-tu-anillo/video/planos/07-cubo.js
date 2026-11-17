// «...todo el oro que hemos sacado en la historia cabe en un cubo de veintidós metros.»
// - Corte en «todo»: una plaza al atardecer, con un edificio de 7 pisos y gente pequeñita. Del cielo caen lingotes de
//   oro y se apilan a su lado: el montón sube capa a capa.
// - «cubo»: el montón termina de ser un cubo, tan alto como el edificio; brilla.
// - «veintidós metros»: su altura marcada, «22 m». Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { ciudad, destello, ORO } from "../mundo.js";

export const desde = (v) => v.frase(11).t("todo", 2);
export const entrada = "corte";

const { suave, tramo, entra, sale, pulso } = k;
const f11 = v.frase(11);
const T0 = f11.t("todo", 2), Tcubo = f11.t("cubo"), Tmetros = f11.t("metros"), Tfin = f11.fin;

const SUELO = 1360, LADO = 500, CX0 = 450, FONDO = 70;   // el cubo: de CX0 a CX0 + LADO; su cara de arriba va FONDO px hacia atrás
const EX0 = 70, EX1 = 380;                              // el edificio
const alto = (t) => LADO * k.tramo(t, T0 + 0.15, Tcubo + 0.05);

// los lingotes que caen: cada uno aterriza cuando el montón llega a su altura
const az = k.azar(808);
const lingotes = Array.from({ length: 70 }, (_, i) => {
  const tl = T0 + 0.15 + (i / 70) * (Tcubo - T0 - 0.1);
  return { tl, x: CX0 + 20 + az() * (LADO - 110), gira: (az() - 0.5) * 0.6, dur: 0.45 + az() * 0.2 };
});

function lingote(g, x, y, ang, s = 1) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.beginPath(); g.moveTo(-38, 14); g.lineTo(38, 14); g.lineTo(30, -12); g.lineTo(-30, -12); g.closePath();
  const gr = g.createLinearGradient(0, -12, 0, 14);
  gr.addColorStop(0, ORO.luz); gr.addColorStop(0.4, ORO.claro); gr.addColorStop(1, ORO.oscuro);
  g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(120,70,10,0.6)"; g.lineWidth = 1.5; g.stroke();
  g.restore();
}

function edificio(g) {
  const top = SUELO - LADO * 0.98;
  const gr = g.createLinearGradient(EX0, 0, EX1, 0);
  gr.addColorStop(0, "#3a4566"); gr.addColorStop(0.7, "#56648c"); gr.addColorStop(1, "#2c3552");
  g.fillStyle = gr; g.fillRect(EX0, top, EX1 - EX0, SUELO - top);
  // el lado
  g.fillStyle = "#232a42"; g.beginPath(); g.moveTo(EX1, top); g.lineTo(EX1 + 26, top - 30); g.lineTo(EX1 + 26, SUELO - 30); g.lineTo(EX1, SUELO); g.closePath(); g.fill();
  g.fillStyle = "#6a78a3"; g.beginPath(); g.moveTo(EX0, top); g.lineTo(EX0 + 26, top - 30); g.lineTo(EX1 + 26, top - 30); g.lineTo(EX1, top); g.closePath(); g.fill();
  // 7 pisos de ventanas
  const piso = (SUELO - top) / 7;
  for (let p = 0; p < 7; p++) {
    g.fillStyle = "rgba(20,24,40,0.5)"; g.fillRect(EX0, top + p * piso - 2, EX1 - EX0, 4);
    for (let c = 0; c < 4; c++) {
      const on = ((p * 7 + c * 3) % 5) < 3;
      g.fillStyle = on ? "#ffd27a" : "#1c2238";
      g.fillRect(EX0 + 22 + c * 72, top + p * piso + 16, 44, piso - 34);
    }
  }
  g.fillStyle = "#151a2b"; g.fillRect(EX0 + 120, SUELO - 50, 70, 50);
}

function cubo(g, h, t, brilla) {
  if (h < 2) return;
  const top = SUELO - h, x0 = CX0, x1 = CX0 + LADO;
  // la cara de delante, de oro, con los lingotes apilados que se adivinan
  const gr = g.createLinearGradient(x0, top, x1, SUELO);
  gr.addColorStop(0, ORO.claro); gr.addColorStop(0.35, ORO.medio); gr.addColorStop(0.55, "#ffd970"); gr.addColorStop(0.8, ORO.medio); gr.addColorStop(1, ORO.oscuro);
  g.fillStyle = gr; g.fillRect(x0, top, LADO, h);
  g.save(); g.beginPath(); g.rect(x0, top, LADO, h); g.clip();
  g.strokeStyle = "rgba(110,60,5,0.35)"; g.lineWidth = 2;
  for (let y = SUELO, f = 0; y > top; y -= 26, f++) {
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    for (let x = x0 + (f % 2 ? 38 : 0); x < x1; x += 76) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 26); g.stroke(); }
  }
  // el reflejo del cielo que lo recorre
  g.globalCompositeOperation = "lighter";
  const rx = x0 - 200 + ((t - T0) * 160) % 900;
  const rg = g.createLinearGradient(rx, 0, rx + 160, 0);
  rg.addColorStop(0, "rgba(255,240,200,0)"); rg.addColorStop(0.5, `rgba(255,240,200,${0.3 + 0.4 * brilla})`); rg.addColorStop(1, "rgba(255,240,200,0)");
  g.fillStyle = rg; g.beginPath(); g.moveTo(rx, SUELO); g.lineTo(rx + 160, SUELO); g.lineTo(rx + 360, top); g.lineTo(rx + 200, top); g.closePath(); g.fill();
  g.restore();
  // la cara de arriba y la del lado
  g.fillStyle = k.mezColor(ORO.claro, ORO.luz, 0.4 + 0.4 * brilla);
  g.beginPath(); g.moveTo(x0, top); g.lineTo(x0 + FONDO * 0.6, top - FONDO * 0.5); g.lineTo(x1 + FONDO * 0.6, top - FONDO * 0.5); g.lineTo(x1, top); g.closePath(); g.fill();
  const lg = g.createLinearGradient(x1, 0, x1 + FONDO * 0.6, 0);
  lg.addColorStop(0, ORO.oscuro); lg.addColorStop(1, ORO.fondo);
  g.fillStyle = lg; g.beginPath(); g.moveTo(x1, top); g.lineTo(x1 + FONDO * 0.6, top - FONDO * 0.5); g.lineTo(x1 + FONDO * 0.6, SUELO - FONDO * 0.5); g.lineTo(x1, SUELO); g.closePath(); g.fill();
}

const gente = Array.from({ length: 9 }, (_, i) => ({ x: 60 + i * 110 + az() * 40, ropa: ["#e94b3c", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"][i % 5] }));

export function dibuja(g, t) {
  // el cielo del atardecer y la ciudad al fondo
  const sk = g.createLinearGradient(0, 0, 0, SUELO);
  sk.addColorStop(0, "#151a3e"); sk.addColorStop(0.5, "#4b3a78"); sk.addColorStop(0.8, "#d9706a"); sk.addColorStop(1, "#ffb36b");
  g.fillStyle = sk; g.fillRect(0, 0, 1080, SUELO);
  g.save(); g.globalCompositeOperation = "lighter";
  const so = g.createRadialGradient(820, SUELO - 40, 10, 820, SUELO - 40, 700);
  so.addColorStop(0, "rgba(255,200,120,0.55)"); so.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = so; g.fillRect(0, 0, 1080, SUELO); g.restore();
  ciudad(g, -60, SUELO, 1200, 0.55);
  // el suelo de la plaza, con sus baldosas en perspectiva
  const sg = g.createLinearGradient(0, SUELO, 0, 1920);
  sg.addColorStop(0, "#8d7a86"); sg.addColorStop(1, "#2b2433");
  g.fillStyle = sg; g.fillRect(0, SUELO, 1080, 560);
  g.strokeStyle = "rgba(30,20,40,0.35)"; g.lineWidth = 2;
  for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(540 + i * 40, SUELO); g.lineTo(540 + i * 260, 1920); g.stroke(); }
  for (let y = SUELO + 20, d = 18; y < 1920; y += d, d *= 1.35) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }

  const h = alto(t), brilla = pulso(t, Tcubo + 0.15, 0.25);
  edificio(g);
  // su sombra y su luz sobre el suelo
  g.save(); g.globalCompositeOperation = "lighter";
  const rf = g.createRadialGradient(CX0 + LADO / 2, SUELO, 10, CX0 + LADO / 2, SUELO, LADO * 0.8);
  rf.addColorStop(0, `rgba(255,190,80,${0.4 * h / LADO})`); rf.addColorStop(1, "rgba(255,190,80,0)");
  g.fillStyle = rf; g.save(); g.translate(0, SUELO); g.scale(1, 0.25); g.beginPath(); g.arc(CX0 + LADO / 2, 0, LADO * 0.8, 0, Math.PI * 2); g.restore(); g.fill(); g.restore();
  cubo(g, h, t, brilla);
  // los lingotes que caen sobre el montón
  for (const L of lingotes) {
    const u = tramo(t, L.tl - L.dur, L.tl);
    if (u <= 0 || u >= 1) continue;
    lingote(g, L.x + 35, k.mez(-120, SUELO - alto(L.tl) - 14, sale(u)), L.gira * (1 - u), 1.15);
  }
  // la gente, pequeñita, para la escala
  for (const p of gente) {
    if (p.x > CX0 - 30 && p.x < CX0 + LADO + 50) continue;
    g.fillStyle = p.ropa; k.redondo(g, p.x - 6, SUELO + 6, 12, 26, 5); g.fill();
    g.fillStyle = "#e0b48a"; g.beginPath(); g.arc(p.x, SUELO + 1, 6, 0, Math.PI * 2); g.fill();
  }
  if (brilla > 0.02) destello(g, CX0 + 40, SUELO - LADO + 10, 560, brilla);
  // la altura: 22 m
  const ap = tramo(t, Tmetros - 0.2, Tmetros + 0.15);
  if (ap > 0) {
    g.save(); g.globalAlpha = ap; g.strokeStyle = "#ffffff"; g.lineWidth = 5; g.lineCap = "round";
    const x = CX0 - 30, y0 = SUELO - 4, y1 = SUELO - LADO + 4;
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.moveTo(x - 16, y0); g.lineTo(x + 16, y0); g.moveTo(x - 16, y1); g.lineTo(x + 16, y1); g.stroke();
    g.beginPath(); g.moveTo(x - 12, y1 + 22); g.lineTo(x, y1 + 4); g.lineTo(x + 12, y1 + 22); g.moveTo(x - 12, y0 - 22); g.lineTo(x, y0 - 4); g.lineTo(x + 12, y0 - 22); g.stroke();
    g.restore();
    k.pastilla(g, CX0 + LADO / 2, SUELO - LADO / 2, "22", "m", "255,236,180", ap, 120);
  }
}

export const caen = lingotes.map((L) => L.tl);
export const cuboListo = Tcubo;
