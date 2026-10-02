# JS Quest

Una aventura educativa original con seis niveles jugables, escrita en HTML5, CSS3 y JavaScript sin frameworks ni dependencias.

## Jugar

Abre `dist/index.html` en un navegador moderno. También puedes servir `dist` con cualquier servidor estático. El proyecto descargable contiene `index.html` en su raíz.

## Arquitectura

- `levels.js`: contenido, mapas, objetivos, pistas y recompensas de cada nivel.
- `levelManager.js`: selección y validación de objetivos y estrellas.
- `game.js`: estado del tablero, sprites de canvas y reproducción animada de acciones.
- `player.js` y `enemy.js`: entidades del juego.
- `codeRunner.js`: Worker generado desde un Blob y un intérprete limitado de JavaScript.
- `progress.js`: progreso local, desbloqueos y recompensas sin duplicación.
- `ui.js`: editor, consola, salud, tutorial y celebración.
- `app.js`: navegación y coordinación entre módulos.

## Ejecución controlada

El intérprete no usa eval ni Function. Ejecuta un subconjunto de JavaScript con variables let/const, valores de texto y números, operadores, asignaciones, condiciones if/else, bucles for/while, llamadas a las APIs del juego y propiedades de salud y daño. No ofrece acceso al DOM, red o APIs del navegador. Impone un presupuesto de operaciones, un límite de 120 acciones y un tiempo máximo de 1,5 segundos en un Worker que puede terminarse sin bloquear la interfaz. El estado simulado permite que las condiciones consulten el efecto de ataques anteriores; la cola se reproduce después con animaciones.

Este primer mundo no incluye todavía funciones definidas por el alumno, arrays ni objetos literales. Estos son contenidos para ampliar junto con el intérprete y nuevos mundos; no se anuncian como disponibles dentro del juego.

## Niveles y progreso

Cada nivel define su mapa, héroe, enemigos, oleadas, objetos, código inicial, tres pistas y objetivo. Añade más datos en `levels.js` y nuevos validadores en `levelManager.js` cuando el objetivo necesite una mecánica nueva. Reutiliza las APIs existentes para crear más mapas.

El progreso se guarda en `localStorage`, solo en este navegador y dispositivo. Ganar de nuevo puede mejorar estrellas, pero no duplica XP ni monedas. Las estrellas premian completar el reto, mantener una solución corta y utilizar el concepto del nivel. La opción de sonido utiliza tonos locales de Web Audio; no carga archivos externos.

## Verificación

Desde la raíz del proyecto: `node test.cjs`. Comprueba soluciones de los seis niveles, las tres oleadas, errores, bucles infinitos, APIs restringidas, derrota, condiciones y persistencia. No se realizó verificación visual en un navegador dentro del entorno de construcción.
