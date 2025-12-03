import { useState, useEffect } from 'react';
import RsvpManager from './components/RsvpManager';
import { Footprints, Volume2, PackageOpen, Utensils, GlassWater } from 'lucide-react';

// Função auxiliar para garantir dois dígitos
const formatTime = (time) => {
  return String(time).padStart(2, '0');
};

// COMPONENTE DO CONTADOR
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, mins: 0, segs: 0 });

  useEffect(() => {
    // DATA ALVO: 21 de Dezembro de 2025 às 18:00:00
    const partyDate = new Date(2025, 11, 21, 18, 0, 0).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = partyDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ dias: 0, horas: 0, mins: 0, segs: 0 });
        return;
      }

      setTimeLeft({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2 md:gap-4 mt-6 md:mt-8 text-white text-center justify-center font-dino tracking-wider z-20 relative">
      {[
        { label: 'Dias', value: timeLeft.dias },
        { label: 'Hrs', value: timeLeft.horas },
        { label: 'Min', value: timeLeft.mins },
        { label: 'Seg', value: timeLeft.segs }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col bg-slate-900/60 backdrop-blur-md p-2 md:p-3 rounded-xl border border-green-500/40 min-w-[60px] md:min-w-[70px] shadow-lg shadow-green-900/20">
          <span className="text-xl md:text-3xl text-green-400 font-bold drop-shadow-md">
            {formatTime(item.value)}
          </span>
          <span className="text-[10px] md:text-xs uppercase opacity-70 tracking-widest">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// COMPONENTE PRINCIPAL
function App() {
  const [clicks, setClicks] = useState([]);
  const [isShaking, setIsShaking] = useState(false);

  // Efeito de Pegadas ao clicar
  const handleGlobalClick = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

    const newClick = {
      id: Date.now(),
      x: e.clientX || (e.touches && e.touches[0].clientX), 
      y: (e.clientY || (e.touches && e.touches[0].clientY)) + window.scrollY, 
    };

    setClicks((prev) => [...prev, newClick]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== newClick.id));
    }, 1000);
  };

  // Efeito do Rugido
  const triggerRoar = () => {
    setIsShaking(true);
    if (navigator.vibrate) {
        navigator.vibrate([400, 50, 400, 50, 400, 50, 400, 50, 400, 50, 200]);
    }
    const audio = new Audio('/roar.mp3'); 
    audio.volume = 0.6;
    audio.play().catch((e) => console.log("Áudio bloqueado", e)); 

    setTimeout(() => { audio.pause(); audio.currentTime = 0; }, 7000);
    setTimeout(() => setIsShaking(false), 5000); 
  };

  const fireflies = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 3}px`,
    duration: `${Math.random() * 15 + 10}s`,
    delay: `${Math.random() * 5}s`
  }));

  return (
    <div 
      onClick={handleGlobalClick}
      className={`min-h-screen relative overflow-x-hidden bg-slate-900 font-sans selection:bg-green-500/30 selection:text-green-200 touch-manipulation ${isShaking ? 'shake-screen' : ''}`}
    >
      
      {/* Renderiza as pegadas */}
      {clicks.map((click) => (
        <Footprints 
          key={click.id}
          className="footprint w-8 h-8 md:w-12 md:h-12"
          style={{ left: click.x - 20, top: click.y - 20 }} 
        />
      ))}

      {/* Camada de Fundo Fixa */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105"
          style={{ backgroundImage: "url('/bg-dino.jpg')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30" />

        {/* Vagalumes */}
        {fireflies.map((firefly) => (
          <div
            key={firefly.id}
            className="firefly"
            style={{
              left: firefly.left,
              width: firefly.size,
              height: firefly.size,
              animationDuration: firefly.duration,
              animationDelay: firefly.delay
            }}
          />
        ))}
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        
        <header className="text-center mb-6 relative w-full">
          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-green-900/40 border border-green-500/30 backdrop-blur-sm shadow-lg">
             <h2 className="text-green-300 font-dino text-sm md:text-lg tracking-[0.2em] uppercase">
              Você foi convocado
            </h2>
          </div>
         
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-dino text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 drop-shadow-2xl py-2 pr-2 md:pr-4 leading-tight">
            Festa do Zyon Dino
          </h1>
          
          <div className="flex items-center justify-center gap-4 mt-2 mb-6">
            <span className="h-[2px] w-8 bg-green-500/50 rounded-full"></span>
            <span className="text-green-400 font-bold text-xl md:text-2xl uppercase tracking-widest drop-shadow-lg">4 Anos</span>
            <span className="h-[2px] w-8 bg-green-500/50 rounded-full"></span>
          </div>

          <CountdownTimer />
        </header>

        {/* BOTÃO RUGIDO */}
        <div className="mb-6 relative group active:scale-95 transition-transform z-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur opacity-40 group-hover:opacity-75 animate-pulse"></div>
            <button 
              onClick={(e) => { e.stopPropagation(); triggerRoar(); }}
              className="relative px-6 py-3 bg-slate-900 ring-1 ring-white/10 rounded-full leading-none flex items-center divide-x divide-slate-600 shadow-xl cursor-pointer"
            >
              <span className="flex items-center space-x-2 text-orange-500 pr-4">
                <Volume2 className="w-5 h-5" />
                <span className="font-dino tracking-wide text-lg">RUGIR!</span>
              </span>
              <span className="pl-4 text-orange-200 font-bold text-sm">🦖</span>
            </button>
        </div>

        {/* --- CARTÃO DE SUPRIMENTOS (LISTA) --- */}
        <div className="w-full max-w-md mx-auto mb-8 relative z-10">
          <div className="bg-yellow-900/40 backdrop-blur-md border border-yellow-600/30 rounded-xl p-5 relative overflow-hidden group shadow-lg">
            
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <PackageOpen className="w-16 h-16 text-yellow-500" />
            </div>
            
            <h3 className="text-yellow-500 font-dino text-lg tracking-wide mb-4 flex items-center gap-2 border-b border-yellow-600/20 pb-2">
              ⚠️ Kit de Sobrevivência:
            </h3>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-yellow-500/10">
                <div className="mt-1 p-1 bg-yellow-500/10 rounded-md">
                   <GlassWater className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-yellow-200 font-bold leading-none">1 Bebida Alcoólica de sua preferência</p>
                  <p className="text-yellow-500/60 text-xs mt-1 italic font-medium">(para hidratar durante a expedição)</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-yellow-500/10">
                 <div className="mt-1 p-1 bg-yellow-500/10 rounded-md">
                   <Utensils className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-yellow-200 font-bold leading-none">1kg de Carne</p>
                  <p className="text-yellow-500/60 text-xs mt-1 italic font-medium">(para o T-Rex não te comer!)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* ------------------------------------------ */}

        <RsvpManager />

        <footer className="mt-12 border-t border-white/10 pt-8 text-center text-slate-400 text-sm bg-slate-950/60 w-full backdrop-blur-xl pb-8 rounded-t-3xl border-x border-x-white/5 shadow-2xl relative z-10">
          <div className="flex flex-col gap-2 px-4">
            <p className="text-white font-medium text-lg md:text-xl font-dino tracking-wide text-green-400">📅 21 de Dezembro • 18:00h</p>
            <p className="text-slate-300 leading-relaxed">📍 Casa do Zyon<br/>Travessa Cinco de Outubro - SC, 122</p>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default App;