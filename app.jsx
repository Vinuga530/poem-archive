import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { POEMS } from './poems.js';

// --- 1. GALAXY BACKGROUND (HARDWARE OPTIMIZED) ---
function GalaxyBackground({ theme }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size to optimize particle count dynamically
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stars = useMemo(() => {
    const count = isMobile ? 40 : 120; // Drastically reduces CPU load on phones
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.1,
      duration: Math.random() * 5 + 4
    }));
  }, [isMobile]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      {/* Dynamic Nebula Core */}
      <motion.div 
        className="absolute inset-0 opacity-70"
        initial={false}
        animate={{ background: `radial-gradient(circle at 50% 50%, ${theme.from} 0%, ${theme.via} 60%, ${theme.to} 100%)` }}
        transition={{ duration: 3, ease: "easeInOut" }}
        style={{ willChange: "background", transform: "translateZ(0)" }}
      />
      
      {/* Rotating Starfield */}
      <motion.div 
        className="absolute inset-[-50%] w-[200%] h-[200%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              willChange: "opacity",
            }}
            animate={{ opacity: [star.opacity * 0.2, star.opacity, star.opacity * 0.2] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Lightweight Film Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, transform: "translateZ(0)" }}>
      </div>
    </div>
  );
}

// --- 2. ARCHIVE ROOM (ULTRA-SMOOTH TEXT ENGINE) ---
function ArchiveRoom({ poem, index, onNext, onPrev }) {
  // Master container orchestrates the timings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 }
    }
  };

  // Cinematic custom bezier curve for luxurious text reveals
  const lineVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
      style={{ willChange: "opacity", transform: "translateZ(0)" }}
    >
      <button onClick={onPrev} className="absolute left-2 md:left-12 z-30 p-4 text-gray-700 hover:text-white transition-colors duration-500">
        <ArrowLeft strokeWidth={1} size={24} />
      </button>
      <button onClick={onNext} className="absolute right-2 md:right-12 z-30 p-4 text-gray-700 hover:text-white transition-colors duration-500">
        <ArrowRight strokeWidth={1} size={24} />
      </button>

      <div className="max-w-3xl w-full px-6 py-24 h-screen overflow-y-auto no-scrollbar">
        <motion.div 
          key={poem.id} 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-6 md:space-y-8 pb-48 pt-16"
        >
          <motion.span 
            variants={lineVariants}
            className="text-[10px] md:text-xs font-sans tracking-[0.3em] text-gray-600 mb-6 block uppercase"
          >
            Chapter 0{index + 1}
          </motion.span>
          
          {poem.lines.map((line, i) => (
            <motion.p
              key={i}
              variants={lineVariants}
              className={`text-base md:text-xl leading-relaxed md:leading-[2.5] tracking-wide transition-colors duration-1000 ${
                line.includes('love') || line.includes('ආදරය') || line.includes('ඔයා')
                ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-medium' 
                : 'text-gray-400 font-light'
              }`}
              style={{ willChange: "transform, opacity, filter" }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- 3. CONSTELLATION GRID ---
function ConstellationGrid({ onSelect }) {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
      style={{ willChange: "opacity", transform: "translateZ(0)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-20 max-w-4xl w-full mt-16 max-h-[75vh] overflow-y-auto no-scrollbar">
        {POEMS.map((poem, index) => (
          <motion.div
            key={poem.id}
            className="group flex flex-col items-center cursor-pointer py-4"
            onClick={() => onSelect(index)}
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="w-4 h-4 text-gray-700 group-hover:text-white transition-all duration-700 mb-4" />
            <h3 className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase text-gray-600 group-hover:text-gray-200 transition-colors duration-500 text-center mb-2">
              {poem.title}
            </h3>
            <p className="text-gray-500 text-[11px] italic text-center max-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block">
              "{poem.lines[0].substring(0, 30)}..."
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// --- 4. CORE APP CONTROLLER ---
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
    <div className="relative min-h-screen w-full font-serif bg-black text-gray-200 overflow-hidden">
      <GalaxyBackground theme={currentTheme} />

      {/* Global Interface Navigation */}
      <div className="fixed top-6 left-0 w-full flex justify-center space-x-8 z-40 text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans text-gray-600">
        <button onClick={() => setView('archive')} className={`hover:text-white transition-colors duration-500 ${view === 'archive' ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : ''}`}>The Archive</button>
        <button onClick={() => setView('grid')} className={`hover:text-white transition-colors duration-500 ${view === 'grid' ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : ''}`}>Constellations</button>
      </div>

      {/* Ambient Audio Toggle */}
      <button 
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full border border-gray-900 bg-black/40 backdrop-blur-md text-gray-600 hover:text-white transition-all duration-700"
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

// Render Engine Boot
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
