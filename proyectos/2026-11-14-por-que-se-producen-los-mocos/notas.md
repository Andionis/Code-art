# De dónde salen los mocos: cómo se hizo

Un video de una pregunta, con el túnel de la nariz como sitio principal (hook, virus y cierre, que enlaza con el
principio) y una escena por idea: la pared que suelta gotas, dentro de una gota, los pelitos, la cinta del súper, el
estómago, el lavamanos y las defensas.

- Voz: Liam (voz gratis de ElevenLabs); el plan gratuito no deja usar la voz latina por defecto (Antonio) por la API.
- La cinta del súper se leía como un panel solar en diagonal: se puso de frente, con manzana y separador de clientes.
- Saltos del render final: texturas que se movían con `% N` (saltaban al dar la vuelta) y un `globalAlpha =` dentro de
  algo que se desvanecía. Se cambiaron por desplazamientos continuos y `*=`.
- El creador aprobó las escenas 1 y 2 una a una, y el resto viendo el video completo.
