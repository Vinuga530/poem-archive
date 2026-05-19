import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { POEMS } from './poems.js';

// --- SUB-COMPONENT: GALAXY BACKGROUND ---
function GalaxyBackground({ theme }) {
  const stars = useMemo(() => {
    return Array.from({ length: 140 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 5 + 4
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute inset-0 opacity-70"
        initial={false}
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${theme.from} 0%, ${theme.via} 60%, ${theme.to} 100%)`
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute inset-[-50%] w-[200%] h-[200%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
      >
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white galaxy-star shadow-[0_0_6px_rgba(255,255,255,0.7)]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [star.opacity * 0.2, star.opacity, star.opacity * 0.2] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: ARCHIVE ROOM ---
function ArchiveRoom({ poem, index, onNext, onPrev }) {
  const staggerText = {
    hidden: { opacity: 0, y: 15 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.35, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
    })
  };

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10 view-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
    >
      <button onClick={onPrev} className="absolute left-3 md:left-12 z-30 p-4 text-gray-600 hover:text-white transition-colors">
        <ArrowLeft strokeWidth={1} size={20} />
      </button>
      <button onClick={onNext} className="absolute right-3 md:right-12 z-30 p-4 text-gray-600 hover:text-white transition-colors">
        <ArrowRight strokeWidth={1} size={20} />
      </button>

      <div className="max-w-2xl w-full px-6 py-24 h-screen overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 pb-36 pt-16">
          <span className="text-xs font-sans tracking-[0.25em] text-gray-500 mb-4 block">
            CHAPTER 0{index + 1}
          </span>
          
          {poem.lines.map((line, i) => (
            <motion.p
              key={i} custom={i} variants={staggerText} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-5%" }}
              className={`text-base md:text-xl leading-relaxed md:leading-loose tracking-wide ${
                line.includes('love') || line.includes('ආදරය') 
                ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] font-medium' 
                : 'text-gray-300 font-light'
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- SUB-COMPONENT: CONSTELLATION GRID ---
function ConstellationGrid({ onSelect }) {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 view-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-20 max-w-4xl w-full mt-16 max-h-[75vh] overflow-y-auto no-scrollbar">
        {POEMS.map((poem, index) => (
          <motion.div
            key={poem.id}
            className="group flex flex-col items-center cursor-pointer py-4"
            onClick={() => onSelect(index)}
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="w-4 h-4 text-gray-600 group-hover:text-white transition-all duration-500 mb-4" />
            <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-200 transition-colors duration-500 text-center mb-2">
              {poem.title}
            </h3>
            <p className="text-gray-500 text-[11px] italic text-center max-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
              "{poem.lines[0].substring(0, 30)}..."
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// --- CORE APP CONTROLLER ---
function App() {
  const [view, setView] = useState('archive'); 
  const [activePoem, setActivePoem] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const handleNext = () => setActivePoem(prev => (prev === POEMS.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setActivePoem(prev => (prev === 0 ? POEMS.length - 1 : prev - 1));

  const currentTheme = view === 'archive' 
    ? POEMS[activePoem].theme 
    : { from: '#020617', via: '#000000', to: '#090d16' };

  return (
    <div className="relative min-h-screen w-full font-serif">
      <GalaxyBackground theme={currentTheme} />

      {/* Global Interface Navigation */}
      <div className="fixed top-6 left-0 w-full flex justify-center space-x-8 z-40 text-[10px] tracking-[0.25em] uppercase font-sans text-gray-500">
        <button onClick={() => setView('archive')} className={`hover:text-white transition-colors ${view === 'archive' ? 'text-white' : ''}`}>The Archive</button>
        <button onClick={() => setView('grid')} className={`hover:text-white transition-colors ${view === 'grid' ? 'text-white' : ''}`}>Constellations</button>
      </div>

      {/* Ambient Tone Audio Button Asset */}
      <button 
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full border border-gray-900 bg-black/40 backdrop-blur-md text-gray-500 hover:text-white transition-all duration-500"
      >
        {audioEnabled ? <Volume2 size={16} strokeWidth={1.5} /> : <VolumeX size={16} strokeWidth={1.5} />}
      </button>

      <AnimatePresence mode="wait">
        {view === 'archive' && (
          <ArchiveRoom 
            poem={POEMS[activePoem]} index={activePoem} onNext={handleNext} onPrev={handlePrev} 
          />
        )}
        {view === 'grid' && (
          <ConstellationGrid onSelect={(idx) => { setActivePoem(idx); setView('archive'); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Render Engine Execution
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);