# JuegoContador

Juego de clics contrarreloj en React. El usuario intenta hacer la mayor cantidad de clics posible en **5 segundos**, compitiendo contra su propio récord.

---

## Demo rápida

El juego presenta:
- Cuenta regresiva de preparación: **Preparados → Listos → ¡Ya!**
- 5 segundos de juego activo con contador de clics en tiempo real
- Barra de progreso visual del tiempo restante (se vuelve roja en los últimos 2 segundos)
- Indicador de puntaje máximo histórico (por sesión)
- Notificación de nuevo récord al superarlo

---

## Requisitos previos

- [Node.js](https://nodejs.org/) **v18 o superior**
- npm **v9 o superior** (incluido con Node.js)

Verificar versiones:
```bash
node -v
npm -v
```

---

## Cómo correr el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/juego-contador.git
cd juego-contador
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Esto abre Vite en modo desarrollo. Abrir en el navegador la URL que aparece en la terminal (normalmente `http://localhost:5173`).

### 4. (Opcional) Build de producción

```bash
npm run build
npm run preview
```

---

## Estructura del proyecto

```
juego-contador/
├── index.html                  # Entry point HTML
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                # Punto de entrada React
    ├── index.css               # Reset / layout global
    ├── JuegoContador.jsx       # Componente principal del juego
    └── JuegoContador.module.css # Estilos con CSS Modules
```

---

## Decisiones técnicas y supuestos

### Arquitectura

- **Un único componente funcional** (`JuegoContador`) contiene toda la lógica y el estado del juego. Dado que la aplicación es pequeña y auto-contenida, dividirla en sub-componentes habría agregado complejidad sin beneficio real de mantenibilidad.
- Se utilizan **CSS Modules** para el scope de estilos, evitando colisiones de clases sin necesidad de una librería de componentes externa (el enunciado menciona MUI como opción, no como requisito).

### Estado del juego

Se modela mediante una variable `phase` con los valores: `idle | countdown | playing | finished`. Esto simplifica las condiciones de habilitación de botones y la renderización condicional sin necesidad de múltiples flags booleanos.

### Precisión del timer

El temporizador usa `setInterval` con 50 ms de intervalo comparando `Date.now()` contra un timestamp de inicio fijo (`startTime`). Esto evita la deriva acumulativa que ocurre cuando se usa `setTimeout` o `setInterval` con conteo de "ticks" para calcular el tiempo transcurrido.

### `scoreRef` como complemento de `score`

El click counter usa `useState` (para re-renders) más un `useRef` (`scoreRef`) para que el callback del `setInterval` pueda leer el valor actualizado del score sin necesidad de incluirlo en el array de dependencias del `useCallback`, evitando reiniciar el intervalo en cada click.

### Puntaje máximo

El puntaje máximo se mantiene **en memoria durante la sesión** (estado de React). No se persiste en `localStorage` ya que el enunciado no lo solicita y hacerlo implicaría decisiones de UX adicionales (reseteo, privacidad, etc.) fuera del alcance.

### Accesibilidad

- Se usan elementos `<output>` con `aria-live="polite"` para los contadores, permitiendo que lectores de pantalla anuncien cambios.
- La cuenta regresiva usa `aria-live="assertive"` para máxima prioridad.
- Los botones tienen `aria-label` descriptivos.
- Los estados deshabilitados usan el atributo nativo `disabled`.

### Fuentes externas

Se importan **Bebas Neue** y **DM Sans** desde Google Fonts. En un entorno sin acceso a internet se puede reemplazar con cualquier fuente del sistema cambiando las variables CSS.
