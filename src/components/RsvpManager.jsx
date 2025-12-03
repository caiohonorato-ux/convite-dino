import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, AlertTriangle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RsvpManager() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false); // Novo estado para o alerta

  async function handleConfirm(e) {
    e.preventDefault();
    
    // VALIDAÇÃO: Se não tiver nome, abre o alerta do Dino
    if (!name.trim()) {
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('convidados')
        .insert([{ nome: name }]);

      if (error) throw error;

      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        colors: ['#4ade80', '#ffffff', '#facc15']
      });
      setName('');
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o parque. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md relative mx-auto mt-8 z-30">
      
      {/* IMAGEM DO DINO (Decorativa) */}
      <motion.img 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: -60, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        src="/dino-head.png" 
        alt="Dino"
        className="absolute -top-10 -right-10 w-40 z-20 drop-shadow-2xl pointer-events-none hidden md:block" 
      />

      {/* CARD PRINCIPAL */}
      <div className="relative z-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {!success ? (
          <form onSubmit={handleConfirm} className="flex flex-col gap-6">
            <div>
              <label className="block text-green-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                Nome do Convidado
              </label>
              <input
                type="text"
                placeholder="Digite seu nome..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if(showError) setShowError(false); // Fecha o erro se começar a digitar
                }}
                className={`w-full bg-slate-800/50 border ${showError ? 'border-red-500 animate-pulse' : 'border-slate-700'} focus:border-green-500/50 text-white rounded-lg px-4 py-4 outline-none transition-all placeholder:text-slate-600 focus:bg-slate-800`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="group relative w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                {loading ? "Processando..." : "Confirmar Presença"} 
                {!loading && <ArrowRight className="w-4 h-4" />}
              </span>
            </motion.button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4 border border-green-500/50">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl text-white font-dino mb-2">Confirmado!</h3>
            <p className="text-slate-400 text-sm">Seu nome já está na nossa lista.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-6 text-xs text-green-500 hover:text-green-400 underline"
            >
              Adicionar outro convidado
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE ALERTA (DINO BRAVO) */}
      <AnimatePresence>
        {showError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowError(false)} // Fecha ao clicar fora
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="bg-slate-900 border-2 border-red-500 p-6 rounded-2xl max-w-sm w-full shadow-[0_0_50px_rgba(239,68,68,0.4)] relative"
              onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
            >
              <button 
                onClick={() => setShowError(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                
                <h3 className="text-2xl font-dino text-white mb-2">ROAAAR! 🦖</h3>
                <p className="text-slate-300 mb-6">
                  Um dinossauro bloqueou o caminho! <br/>
                  <span className="text-red-400 font-bold">Você precisa informar seu nome</span> para entrar no parque.
                </p>

                <button 
                  onClick={() => setShowError(false)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-wide"
                >
                  Entendido!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}