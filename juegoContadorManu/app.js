import React, { useState, useEffect, useRef } from 'react';

const JuegoContador = () => {
  // Estados del juego
  const [puntajeActual, setPuntajeActual] = useState(0);
  const [puntajeMaximo, setPuntajeMaximo] = useState(0);
  const [fase, setFase] = useState('IDLE'); // IDLE, CUENTA_REGRESIVA, JUGANDO
  const [mensaje, setMensaje] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(5);

  // Referencias para evitar problemas con cierres (closures) en intervalos
  const timerRef = useRef(null);

  // Lógica de la cuenta regresiva inicial
  const iniciarPreparacion = () => {
    setFase('CUENTA_REGRESIVA');
    setPuntajeActual(0);
    const pasos = ['Preparados', 'Listos', '¡Ya!'];
    let indice = 0;

    setMensaje(pasos[indice]);
    
    const intervaloPrep = setInterval(() => {
      indice++;
      if (indice < pasos.length) {
        setMensaje(pasos[indice]);
      } else {
        clearInterval(intervaloPrep);
        empezarJuego();
      }
    }, 1000);
  };

  // Lógica del juego (5 segundos)
  const empezarJuego = () => {
    setFase('JUGANDO');
    setTiempoRestante(5);

    timerRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          finalizarJuego();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finalizarJuego = () => {
    clearInterval(timerRef.current);
    setFase('IDLE');
    setMensaje('¡Tiempo cumplido!');
    
    // Actualizar récord usando un callback para asegurar el valor más reciente
    setPuntajeActual((final) => {
      setPuntajeMaximo((max) => (final > max ? final : max));
      return final;
    });
  };

  const manejarClickBoton = () => {
    if (fase === 'JUGANDO') {
      setPuntajeActual((prev) => prev + 1);
    }
  };

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">Juego Contador</h1>
        
        <div className="flex justify-between mb-8 bg-indigo-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Récord</p>
            <p className="text-2xl font-black text-indigo-900">{puntajeMaximo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Puntos</p>
            <p className="text-2xl font-black text-indigo-900">{puntajeActual}</p>
          </div>
        </div>

        <div className="h-24 flex items-center justify-center mb-6">
          {fase === 'CUENTA_REGRESIVA' && (
            <span className="text-4xl font-bold animate-pulse text-orange-500">{mensaje}</span>
          )}
          {fase === 'JUGANDO' && (
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">¡Rápido!</p>
              <p className="text-5xl font-mono font-bold text-red-500">{tiempoRestante}s</p>
            </div>
          )}
          {fase === 'IDLE' && mensaje && (
            <p className="text-xl font-medium text-green-600">{mensaje}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={manejarClickBoton}
            disabled={fase !== 'JUGANDO'}
            className={`py-12 rounded-xl text-2xl font-bold transition-all transform active:scale-95 ${
              fase === 'JUGANDO' 
                ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ¡CLICK AQUÍ!
          </button>

          <button
            onClick={iniciarPreparacion}
            disabled={fase !== 'IDLE'}
            className={`py-4 rounded-lg font-semibold border-2 transition-colors ${
              fase === 'IDLE'
                ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
            }`}
          >
            {puntajeMaximo > 0 ? 'Intentar de nuevo' : 'Iniciar Juego'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuegoContador;