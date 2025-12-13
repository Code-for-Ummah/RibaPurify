import React, { useState, useEffect, useRef } from 'react';

// Multi-language words for animations
const PURIFICATION_WORDS = [
  { lang: 'ar', haram: 'حرام', halal: 'حلال', font: 'font-amiri' },
  { lang: 'en', haram: 'Haram', halal: 'Halal', font: 'font-sans' },
  { lang: 'ur', haram: 'حرام', halal: 'حلال', font: 'font-urdu' },
  { lang: 'hi', haram: 'हराम', halal: 'हलाल', font: 'font-hindi' },
  { lang: 'bn', haram: 'হারাম', halal: 'হালাল', font: 'font-bengali' },
  { lang: 'zh', haram: '禁止', halal: '清真', font: 'font-chinese' },
  { lang: 'ru', haram: 'Харам', halal: 'Халяль', font: 'font-sans' },
  { lang: 'tr', haram: 'Haram', halal: 'Helal', font: 'font-sans' },
  { lang: 'he', haram: 'חראם', halal: 'חלאל', font: 'font-hebrew' },
  { lang: 'fr', haram: 'Illicite', halal: 'Licite', font: 'font-sans' },
  { lang: 'sq', haram: 'Haram', halal: 'Halall', font: 'font-sans' },
  { lang: 'id', haram: 'Haram', halal: 'Halal', font: 'font-sans' },
  { lang: 'ms', haram: 'Haram', halal: 'Halal', font: 'font-sans' },
  { lang: 'de', haram: 'Verboten', halal: 'Erlaubt', font: 'font-sans' },
  { lang: 'bs', haram: 'Haram', halal: 'Halal', font: 'font-sans' },
  { lang: 'nl', haram: 'Haram', halal: 'Halal', font: 'font-sans' },
  // stylistic variations for Arabic
  { lang: 'ar-kufi', haram: 'حرام', halal: 'حلال', font: 'font-kufi' }, 
  { lang: 'ar-cairo', haram: 'حرام', halal: 'حلال', font: 'font-cairo' },
];

// Helper to shuffle array (Fisher-Yates)
const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Optimized PurificationAnimation - Zoned Distribution & Shuffle Bag Selection
export const PurificationAnimation = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const newItems = [];
    
    // OPTIMIZATION: Reduce particle count on smaller screens (mobile)
    // Mobile (<768px): 8 particles. Tablet (<1024px): 15 particles. Desktop: 25 particles.
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
    const count = isMobile ? 8 : isTablet ? 15 : 25; 

    // SHUFFLE BAG LOGIC:
    let pool = [...PURIFICATION_WORDS, ...PURIFICATION_WORDS]; 
    while (pool.length < count) {
       pool = [...pool, ...PURIFICATION_WORDS];
    }
    pool = shuffleArray(pool);
    const selectedWords = pool.slice(0, count);
    
    // GRID DISTRIBUTION LOGIC:
    const rowCount = Math.ceil(count / 3);
    const slotHeight = 90 / rowCount; 

    for (let i = 0; i < count; i++) { 
      const langPair = selectedWords[i];
      const zone = i % 3; // 0, 1, or 2
      let minLeft, maxLeft;

      if (zone === 0) {
        minLeft = 2; maxLeft = 30;
      } else if (zone === 1) {
        minLeft = 33; maxLeft = 63;
      } else {
        minLeft = 66; maxLeft = 95;
      }
      
      const leftPos = Math.random() * (maxLeft - minLeft) + minLeft;
      const minTop = (Math.floor(i / 3)) * slotHeight;
      const maxTop = minTop + slotHeight;
      const topPos = Math.random() * (maxTop - minTop) + minTop;

      newItems.push({
        left: `${leftPos}%`, 
        top: `${topPos}%`, 
        // Delay: Base 5s + Random 6s = Starts between 5s and 11s (Prevents initial flash)
        delay: `${5 + Math.random() * 6}s`, 
        size: `${Math.random() * 3.5 + 1}rem`, 
        font: langPair.font,
        haramText: langPair.haram,
        halalText: langPair.halal,
        // SLOWED DOWN: 10s to 18s duration for ambient effect
        duration: `${Math.random() * 8 + 10}s` 
      });
    }
    setItems(newItems);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" style={{contain: 'strict'}}>
       <style>{`
         @keyframes float-up {
           0% { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0; }
           15% { opacity: 0.3; } 
           50% { transform: translate3d(0, -50px, 0) scale(1); opacity: 0.4; }
           70% { opacity: 0.2; } /* Begin fade out */
           100% { transform: translate3d(0, -100px, 0) scale(0.9); opacity: 0; }
         }
         @keyframes fade-haram {
            0%, 40% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 0; }
         }
         @keyframes fade-halal {
            0%, 40% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 1; }
         }
         .purify-item {
           position: absolute;
           opacity: 0; /* Ensures invisible before animation starts */
           will-change: transform, opacity;
           animation-name: float-up;
           animation-timing-function: ease-in-out;
           animation-iteration-count: infinite;
           animation-fill-mode: both; /* Keeps 0% state during delay */
         }
         .text-haram { animation: fade-haram ease-in-out infinite; will-change: opacity; }
         .text-halal { animation: fade-halal ease-in-out infinite; will-change: opacity; }
       `}</style>

       {items.map((item, i) => (
         <div 
           key={i} 
           className="purify-item" 
           style={{ 
             left: item.left, 
             top: item.top, 
             animationDelay: item.delay,
             animationDuration: item.duration 
           }}
         >
           <div className={`relative font-bold ${item.font}`} style={{ fontSize: item.size }}>
             <span className="absolute text-red-500/50 text-haram top-0 left-0 whitespace-nowrap" style={{ animationDuration: item.duration }}>{item.haramText}</span>
             <span className="absolute text-emerald-500/50 text-halal top-0 left-0 whitespace-nowrap" style={{ animationDuration: item.duration }}>{item.halalText}</span>
           </div>
         </div>
       ))}
    </div>
  );
};

// CursorTrail - Spatial Throttling & Start Delay & Edge Fading
export const CursorTrail = () => {
  const [trails, setTrails] = useState<{id: number, x: number, y: number, size: string, opacity: number, wordPair: typeof PURIFICATION_WORDS[0] }[]>([]);
  const lastPos = useRef({ x: 0, y: 0, time: 0 });
  const isActiveRef = useRef(false);

  useEffect(() => {
    // OPTIMIZATION: Disable Cursor Trail completely on Touch Devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    // START DELAY: Don't show any trails for the first 4 seconds
    const timer = setTimeout(() => {
      isActiveRef.current = true;
    }, 4000);

    const handleMove = (e: MouseEvent) => {
      if (!isActiveRef.current) return;

      const now = Date.now();
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // SPATIAL THROTTLING: > 80px and > 80ms
      if (distance > 80 && now - lastPos.current.time > 80) {
        
        lastPos.current = { x: e.clientX, y: e.clientY, time: now };
        
        // Edge Proximity Fading
        const w = window.innerWidth;
        const h = window.innerHeight;
        const edgeThreshold = 150;
        const minDist = Math.min(e.clientX, w - e.clientX, e.clientY, h - e.clientY);
        const opacityFactor = Math.min(1, Math.max(0.1, minDist / edgeThreshold));

        const id = now;
        const wordPair = PURIFICATION_WORDS[Math.floor(Math.random() * PURIFICATION_WORDS.length)];
        const sizeClass = Math.random() > 0.5 ? 'text-2xl' : 'text-3xl';
        
        setTrails(prev => {
            const newTrails = [...prev, { id, x: e.clientX + 20, y: e.clientY + 20, size: sizeClass, opacity: opacityFactor, wordPair }];
            return newTrails.slice(-15); 
        });
        
        // Remove item after animation
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== id));
        }, 3000); // 3s cleanup
      }
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  if (trails.length === 0) return <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
       <style>{`
         @keyframes float-cursor {
           0% { transform: translate3d(0, 0, 0) scale(0.8); opacity: 0; }
           10% { opacity: var(--target-opacity, 0.9); }
           100% { transform: translate3d(0, -60px, 0) scale(1.1); opacity: 0; }
         }
         @keyframes fade-haram-cursor {
            0% { opacity: 1; }
            45% { opacity: 0; }
            100% { opacity: 0; }
         }
         @keyframes fade-halal-cursor {
            0% { opacity: 0; }
            55% { opacity: 1; }
            100% { opacity: 0; }
         }
         .cursor-trail-item {
           position: absolute;
           will-change: transform;
           /* SLOWED DOWN: 3s duration */
           animation: float-cursor 3s ease-out forwards;
         }
         .text-haram-cursor { animation: fade-haram-cursor 3s ease-out forwards; will-change: opacity; }
         .text-halal-cursor { animation: fade-halal-cursor 3s ease-out forwards; will-change: opacity; }
       `}</style>
       {trails.map(t => (
         <div 
           key={t.id} 
           className="cursor-trail-item" 
           style={{ 
             left: t.x, 
             top: t.y, 
             '--target-opacity': t.opacity * 0.9 
           } as React.CSSProperties}
         >
           <div className={`relative font-bold ${t.size} ${t.wordPair.font}`}>
             <span className="absolute text-red-600 text-haram-cursor whitespace-nowrap drop-shadow-sm">{t.wordPair.haram}</span>
             <span className="absolute text-emerald-600 text-halal-cursor whitespace-nowrap drop-shadow-sm">{t.wordPair.halal}</span>
           </div>
         </div>
       ))}
    </div>
  );
};
