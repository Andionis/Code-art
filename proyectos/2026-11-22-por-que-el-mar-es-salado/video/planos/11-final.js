// «Así que lo que sala el mar es justo lo más dulce que tiene: la lluvia. Síguenos para más videos.»
// Corte en «Así» al paisaje del principio: el río entra en el mar y llueve. Una sola cámara hasta el final.
// - «lo que sala el mar»: llueve sobre el mar y el río; los granos de sal brillan en el agua.
// - «lo más dulce»: el río brilla, claro, de la montaña al mar.
// - «la lluvia»: una gota grande cae en el centro y revienta en el mar con su salpicadura.
// - «Síguenos»: la imagen se oscurece un poco y entra el botón rojo «SEGUIR»; el pulgar lo aprieta en «Síguenos»
//   y cambia a «SIGUIENDO» con un anillo de luz. Se queda encendido hasta el final.
import * as k from "#kit";
import { v } from "#voz";
import { pulgar } from "#piezas/celular.js";
import { camPaisaje, paisaje, lluvia, velo, pp, rioX } from "../mundo.js";
import { gotaGrande } from "./01-hook.js";

export const desde = () => v.frase(12).inicio;

const { suave: su, tramo: tr, mez, claves, azar } = k;
const f12 = v.frase(12), f13 = v.frase(13);
const T0 = f12.inicio, Tdul = f12.t("dulce"), Tllu = f12.t("lluvia"), T13 = f13.inicio, Tsig = f13.t("siguenos"), Tvid = f13.t("videos"), Tfin = v.duracion ?? f13.fin + 0.8;
const Tcae = Tllu + 0.15;                 // la gota llega al agua
const Tapr = Tsig + 0.35;                 // el pulgar aprieta
export const momentos = { cae: Tcae, boton: T13 - 0.1, aprieta: Tapr };

const camZ = claves([[T0, -60], [Tcae, -48], [T13, -46]]);
const camH = claves([[T0, 20], [Tcae, 13], [T13, 12]]);
const camHy = claves([[T0, 600], [Tcae, 700], [T13, 720]]);

export function dibuja(g, t) {
  const c = camPaisaje(0, camH(t), camZ(t), camHy(t));
  paisaje(g, c, t, { sal: 1, salMar: 1, oscuro: 0.25, nubes: [[-120, 110, 380, 220, 0.4, 0.9, 81], [90, 120, 420, 260, 0.4, 0.9, 82]] });
  // «dulce»: el río brilla
  const dul = k.pulso(t, Tdul + 0.25, 0.55) * 0.9;
  if (dul > 0.02) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let z = 1; z < 200; z *= 1.25) { const P = pp(c, rioX(z), 0, z); if (P) k.brillo(g, P.x, P.y, Math.max(24, P.s * 2.2), "200,245,255", dul * 0.35); }
    g.restore();
  }
  lluvia(g, t, 0.6, T0);
  // la gota grande que cae al mar y revienta
  const C = pp(c, 0, 0, -14), ym = C ? C.y : 1400;
  const uc = tr(t, Tllu - 0.6, Tcae);
  if (uc > 0 && uc < 1) gotaGrande(g, 540, mez(250, ym - 60, uc * uc), mez(60, 110, uc));
  const us = tr(t, Tcae, Tcae + 0.9);
  if (us > 0 && us < 1) {
    g.save();
    for (let i = 0; i < 3; i++) { const s = Math.max(0, us - i * 0.15); g.strokeStyle = `rgba(235,250,255,${0.8 * (1 - s)})`; g.lineWidth = 8 * (1 - s) + 2; g.beginPath(); g.ellipse(540, ym, 60 + 380 * s, 16 + 90 * s, 0, 0, Math.PI * 2); g.stroke(); }
    const a = azar(66);
    for (let i = 0; i < 26; i++) {
      const an = Math.PI + a() * Math.PI, vv = 400 + a() * 700, u = us * 0.9;
      const x = 540 + Math.cos(an) * vv * u, y = ym + Math.sin(an) * vv * u * 1.2 + 1600 * u * u;
      g.fillStyle = `rgba(225,245,255,${0.9 * (1 - us)})`; g.beginPath(); g.arc(x, y, 12 * (1 - us) + 3, 0, Math.PI * 2); g.fill();
    }
    g.restore();
    k.brillo(g, 540, ym, 500, "220,245,255", 0.5 * (1 - us));
  }
  velo(g, 0.35);
  // el botón «Seguir»
  const entra = k.entra(tr(t, T13 - 0.15, T13 + 0.3));
  if (entra > 0) {
    g.fillStyle = `rgba(4,12,26,${0.35 * entra})`; g.fillRect(0, 520, 1080, 1400);
    const ap = k.pulso(t, Tapr, 0.08), hecho = su(tr(t, Tapr, Tapr + 0.15));
    const s = mez(0.5, 1, entra) * (1 + 0.025 * Math.sin((t - T13) * 6) * (1 - hecho));
    g.save(); g.translate(540, 1080); g.scale(s, s); g.globalAlpha = Math.min(1, entra * 1.5);
    boton(g, ap, hecho);
    g.restore();
    const an = tr(t, Tapr, Tapr + 0.9);
    if (an > 0 && an < 1) { g.strokeStyle = `rgba(255,200,180,${0.8 * (1 - an)})`; g.lineWidth = 14 * (1 - an) + 2; g.beginPath(); g.ellipse(540, 1080, 420 + 400 * an, 130 + 260 * an, 0, 0, Math.PI * 2); g.stroke(); }
    const dx = claves([[T13, 1300], [Tapr - 0.15, 720], [Tapr, 690], [Tapr + 0.3, 760], [Tvid + 0.6, 820]]), dy = claves([[T13, 2300], [Tapr - 0.15, 1130], [Tapr, 1100], [Tapr + 0.3, 1230], [Tvid + 0.6, 1330]]);
    pulgar(g, dx(t), dy(t), -0.55, ap, 1700);
  }
}

// El botón: rojo con su canto, el icono de una persona con «+» (o una marca de hecho) y «SEGUIR» / «SIGUIENDO».
function boton(g, hunde, hecho) {
  const W = 760, H = 200;
  g.save(); g.translate(0, 12 * hunde);
  k.brillo(g, 0, 0, 1300, "255,80,60", 0.35 + 0.3 * hecho);
  k.redondo(g, -W / 2, -H / 2 + 24 * (1 - hunde), W, H, H / 2); g.fillStyle = "#8f140d"; g.fill();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2); bg.addColorStop(0, "#ff6a5c"); bg.addColorStop(0.5, "#ff3b30"); bg.addColorStop(1, "#d42a20");
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)"; k.redondo(g, -W / 2 + 40, -H / 2 + 14, W - 80, 46, 23); g.fill();
  // el icono: una persona y un «+» que se vuelve marca
  g.save(); g.translate(-262, 6); g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.arc(-12, -26, 22, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(-50, 42); g.quadraticCurveTo(-50, 2, -12, 2); g.quadraticCurveTo(26, 2, 26, 42); g.closePath(); g.fill();
  if (hecho < 0.5) { g.beginPath(); g.moveTo(48, -6); g.lineTo(48, 30); g.moveTo(30, 12); g.lineTo(66, 12); g.stroke(); }
  else { g.beginPath(); g.moveTo(32, 12); g.lineTo(44, 26); g.lineTo(68, -4); g.stroke(); }
  g.restore();
  g.fillStyle = "#fff"; g.font = `900 ${hecho < 0.5 ? 96 : 80}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = "rgba(120,10,5,0.6)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
  g.fillText(hecho < 0.5 ? "SEGUIR" : "SIGUIENDO", 70, 8);
  g.restore();
}
