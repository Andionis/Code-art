# Lyric video: Dios Primero (Lil Naay)

Lo decidido: del segundo 20 al 46,6 de la canción; la letra del creador (más «Ser rico es otra cosa…», que suena en el
tramo). Video del creador de fondo (fondo/original.mp4) en bucle y en blanco y negro; letra a color; desvanecido final
de imagen y música (25,95 → 26,6 s). **Sin marca de agua** (lo pidió para este video).

Cómo está hecho: igual que proyectos/2026-11-19-lyric-hombre (ver su CONTINUAR.md): audio/cancion-estereo.wav,
voz/tiempos.json con la letra alineada, audio/golpes.json (100 bpm), fondo/f/ los fotogramas recortados en vertical.
Tras render.mjs se cambia el audio por el estéreo original con ffmpeg (-map 0:v -map 1:a).

Pasos:
- [x] Tramo, letra sincronizada, beats y fondo
- [x] Borrador v1 (revisar/Dios Primero lyric v1 (borrador).mp4)
- [ ] El creador aprueba o corrige
- [ ] Final a 60 fps, miniatura (SIN_LETRA=1) y descripciones
