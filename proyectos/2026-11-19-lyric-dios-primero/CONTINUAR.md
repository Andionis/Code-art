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
- [x] Borrador v2: como mucho 3 filas de letra en pantalla (las líneas largas, en pantallas seguidas)
- [x] Borrador v3: termina en «Gracia', Dios mío» (ad-lib, colocado a oído hacia 41,3-41,75 s de la canción; las voces callan de 41,75 a 42,9), desvanecido 21,75 → 22,9 s; sin «Ser rico…»
- [x] Borrador v4: vuelve a durar 26,6 s; tras «Dios mío» la letra se va y la música (con su voz, sin letra en pantalla) y la imagen se desvanecen despacio de 21,75 s al final
- [ ] El creador aprueba o corrige
- [ ] Final a 60 fps, miniatura (SIN_LETRA=1) y descripciones
