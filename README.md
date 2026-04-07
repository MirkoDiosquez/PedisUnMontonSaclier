# PedisUnMontonSaclier — Comparación Claude vs GPT

Proyecto comparativo entre dos implementaciones del mismo juego (**JuegoContador**) generadas con distintos modelos de IA: Claude y GPT.

## ¿Qué es JuegoContador?

Un juego simple en React: el jugador tiene un tiempo limitado para hacer la mayor cantidad de clics posible. El objetivo es comparar cómo cada IA resuelve el mismo problema.

## Estructura del proyecto

```
├── juego-contador Sonet4.6/   # Implementación generada con Claude (Vite + CSS Modules)
├── JuegoContadorGPT/          # Implementación generada con GPT (Create React App)
├── juegoContadorManu/         # Implementación manual de referencia
└── comparacion_claude_vs_gpt.html  # Comparación técnica visual entre ambas versiones
```

## Comparación técnica

| Aspecto                  | Claude                        | GPT                          |
|--------------------------|-------------------------------|------------------------------|
| Bundler                  | Vite ✓                        | CRA (lento, deprecado)       |
| Estilos                  | CSS Modules ✓                 | Inline                       |
| Lógica de estado         | Máquina de estados ✓          | Booleans entrelazados        |
| Precisión del timer      | `Date.now()` 50ms ✓           | `setInterval` 1s (deriva)    |
| Prevención stale closure | `useRef` + `useCallback` ✓    | No                           |
| Feedback al terminar     | Mensajes + badge récord ✓     | No                           |
| Accesibilidad            | ARIA completo ✓               | Ninguna                      |
| Listo para producción    | Casi listo ✓                  | Prototipo                    |

## Veredicto

- **Claude** — Código conciso y fácil de entender. Funciona, pero tiene deuda técnica: el timer puede derivar, el estado puede desincronizarse, y no hay diseño ni accesibilidad. Buen punto de partida para explorar la idea.
- **GPT** — Implementación más robusta en todos los aspectos: timer preciso, estado sin ambigüedad, CSS separado con diseño completo y accesibilidad. La brecha de complejidad tiene sentido para un proyecto real.

## Cómo correr cada versión

### Claude (Vite)
```bash
cd "juego-contador Sonet4.6"
npm install
npm run dev
```

### GPT (Create React App)
```bash
cd JuegoContadorGPT
npm install
npm start
```

