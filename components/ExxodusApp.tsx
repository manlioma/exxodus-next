'use client';

import React, { useState, useId, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Menu, X, ChevronDown, Unlock, Layers, Zap, Shield, Clock, DollarSign, BookOpen, Network } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '@/components/Providers';
import { translations } from '@/lib/translations';
import { getReleases } from '@/lib/releases';
import { getConceptCards } from '@/lib/conceptCards';
import type { DomainKey } from '@/lib/domains';

gsap.registerPlugin(ScrollTrigger);

// --- Assets ---
const LOGO_URL = "https://devops.supernaturale.it/dir/exxodus/exodus%20logo.svg";
const SYMBOL_URL = "https://devops.supernaturale.it/dir/exxodus/exodus%20symbol.svg";
const HERO_IMAGE = "https://devops.supernaturale.it/dir/exxodus/img/02-exx.jpeg";
const CONCEPT_IMAGE = "https://devops.supernaturale.it/dir/exxodus/img/03-exx.jpeg";
const TRANSITION_IMAGE = "https://devops.supernaturale.it/dir/exxodus/img/04-exx.jpeg";
const ROADMAP_IMAGE = "https://devops.supernaturale.it/dir/exxodus/img/05-exx.jpeg";

// Domain definitions — color scale across 7 domains
const DOMAINS = {
  work:     { label: 'WORK · ORGANIZATION',  color: '#8BC48A', icon: <Layers  size={14} /> },
  time:     { label: 'TIME · STRUCTURE',      color: '#5BBFB5', icon: <Clock   size={14} /> },
  value:    { label: 'VALUE · REDISTRIBUTION',color: '#4AA8D8', icon: <Zap     size={14} /> },
  identity: { label: 'IDENTITY · ROLE',       color: '#6B8FD4', icon: <Shield  size={14} /> },
  income:   { label: 'INCOME · SURVIVAL',     color: '#C46BA8', icon: <DollarSign size={14} /> },
  learning: { label: 'LEARNING · TRANSITION', color: '#E8925A', icon: <BookOpen  size={14} /> },
  social:   { label: 'SOCIAL · COORDINATION', color: '#A87ED4', icon: <Network   size={14} /> },
} as const;

// --- Components ---

const LiquidImage = ({ src, alt, className = "", overlay = true }: { src: string, alt: string, className?: string, overlay?: boolean }) => {
  const filterId = useId().replace(/:/g, "");

  // Safari clips CSS filter output to the element bounding box even with overflow:visible.
  // Fix: apply the filter to a buffer div that extends 24px beyond the visible area,
  // then clip with overflow:hidden on the outer wrapper. Displaced edge pixels come
  // from the extra image content in the buffer zone, not from empty space.
  const BUFFER = 24; // px — must be > feDisplacementMap scale/2 (scale=20 → ±10px)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg className="absolute w-0 h-0">
        <filter
          id={`liquid-${filterId}`}
          x="0%" y="0%" width="100%" height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.003" numOctaves="1" result="warp">
            <animate
              attributeName="baseFrequency"
              values="0.003 0.003;0.006 0.007;0.003 0.003"
              dur="15s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
            />
          </feTurbulence>
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="20"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </svg>
      {/* Buffer wrapper: extends BUFFER px beyond visible area so displaced
          edge pixels draw from real image content, not empty space */}
      <div
        className="absolute"
        style={{
          inset: `-${BUFFER}px`,
          filter: `url(#liquid-${filterId})`,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1628] opacity-60 pointer-events-none" />
      )}
    </div>
  );
};

// Blob che segue il mouse con spring lag
const OrganicBlob = ({ color, size, top, left, delay = 0, followMouse = false, mouseX = 0, mouseY = 0, offsetX = 0, offsetY = 0 }: {
  color: string, size: string, top: string, left: string, delay?: number,
  followMouse?: boolean, mouseX?: number, mouseY?: number, offsetX?: number, offsetY?: number
}) => {
  const springConfig = { stiffness: 8, damping: 18, mass: 4 };
  const x = useSpring(mouseX + offsetX, springConfig);
  const y = useSpring(mouseY + offsetY, springConfig);

  useEffect(() => {
    x.set(mouseX + offsetX);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseX]);
  useEffect(() => {
    y.set(mouseY + offsetY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseY]);

  if (followMouse) {
    return (
      <motion.div
        className="fixed pointer-events-none blur-[220px] opacity-[0.07] mix-blend-screen"
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: '50%',
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    );
  }

  return (
    <motion.div
      animate={{
        scale: [1, 1.15, 0.9, 1.1, 1],
        x: [0, 40, -20, 50, 0],
        y: [0, -50, 30, -20, 0],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear", delay }}
      className="absolute pointer-events-none blur-[180px] opacity-[0.12] mix-blend-screen"
      style={{ backgroundColor: color, width: size, height: size, top, left, borderRadius: '50%' }}
    />
  );
};

const Section = ({ children, className = "", id = "" }: { children?: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`min-h-screen flex flex-col justify-center px-6 md:px-24 lg:px-48 py-32 relative ${className}`}>
    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    {children}
  </section>
);

// Parallax GSAP: la foto scorre a velocità ridotta rispetto al testo
const ParallaxCol = ({ children, speed = 0.3, className = "" }: { children: React.ReactNode, speed?: number, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    const container = ref.current;
    if (!el || !container) return;

    const tl = gsap.fromTo(el,
      { y: 0 },
      {
        y: () => container.offsetHeight * (1 - speed),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );
    return () => { tl.scrollTrigger?.kill(); };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  );
};

// --- CONCEPT CARDS ---
const ConceptCards = () => {
  const { lang } = useLang();
  const conceptCards = getConceptCards(lang);
  return (
  <div className="w-full relative z-10 mt-20">
    {/* Desktop: horizontal scroll */}
    <div className="hidden md:flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
      {conceptCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.08 }}
          className="flex-none w-[380px] snap-start border border-[#8BC48A]/15 bg-[#C8E6D5]/3 backdrop-blur-md p-10 flex flex-col gap-6 hover:border-[#C8E6D5]/40 transition-all duration-500"
        >
          <span className="text-[10px] font-mono tracking-[0.5em] text-[#8BC48A] uppercase">[{card.num}]</span>
          <h4 className="text-xl font-bold tracking-tight text-[#C8E6D5] leading-snug uppercase">{card.title}</h4>
          <div className="flex flex-col gap-6 flex-1">
            {card.sections.map((s, j) => (
              <div key={j} className="border-l border-[#8BC48A]/20 pl-4 space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#8BC48A]">{s.subtitle}</p>
                <p className="text-sm text-[#FFF9C4]/60 leading-relaxed font-light">{s.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Mobile: vertical stack */}
    <div className="flex md:hidden flex-col gap-6">
      {conceptCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          className="border border-[#8BC48A]/15 bg-[#C8E6D5]/3 backdrop-blur-md p-8 flex flex-col gap-5"
        >
          <span className="text-[10px] font-mono tracking-[0.5em] text-[#8BC48A] uppercase">[{card.num}]</span>
          <h4 className="text-lg font-bold tracking-tight text-[#C8E6D5] leading-snug uppercase">{card.title}</h4>
          <div className="flex flex-col gap-5">
            {card.sections.map((s, j) => (
              <div key={j} className="border-l border-[#8BC48A]/20 pl-4 space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#8BC48A]">{s.subtitle}</p>
                <p className="text-sm text-[#FFF9C4]/60 leading-relaxed font-light">{s.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
  );
};

// Scroll verticale → movimento orizzontale con GSAP ScrollTrigger
const HorizontalScrollCards = () => {
  const { lang } = useLang();
  const conceptCards = getConceptCards(lang);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getShift = () => -(track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getShift,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "center center",
          end: () => `+=${Math.abs(getShift())}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (conceptCards.length - 1));
            setActiveIndex(idx);
          },
          onToggle: (self) => { stRef.current = self ?? null; },
        }
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile, conceptCards.length]);

  // Native scroll index tracking on mobile
  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(idx);
  };

  const goToCard = (i: number) => {
    if (isMobile) {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: i * track.offsetWidth, behavior: 'smooth' });
      setActiveIndex(i);
      return;
    }
    const st = ScrollTrigger.getAll().find(t => t.vars.trigger === sectionRef.current);
    if (!st) return;
    const progress = i / (conceptCards.length - 1);
    const targetScroll = st.start + progress * (st.end - st.start);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <div
          ref={trackRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4 pb-4"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {conceptCards.map((card, i) => (
            <div
              key={i}
              className={`flex-none w-[85vw] snap-center border backdrop-blur-md p-7 flex flex-col gap-5 transition-all duration-500
                ${i === activeIndex
                  ? 'border-[#C8E6D5]/50 bg-[#C8E6D5]/6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
                  : 'border-[#8BC48A]/15 bg-[#C8E6D5]/3'
                }`}
              style={{ minHeight: '400px' }}
            >
              <span className="text-[10px] font-mono tracking-[0.5em] text-[#8BC48A] uppercase">[{card.num}]</span>
              <h4 className="text-lg font-bold tracking-tight text-[#C8E6D5] leading-snug uppercase">{card.title}</h4>
              <div className="flex flex-col gap-5 flex-1">
                {card.sections.map((s, j) => (
                  <div key={j} className="border-l border-[#8BC48A]/20 pl-4 space-y-2">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-[#8BC48A]">{s.subtitle}</p>
                    <p className="text-sm text-[#FFF9C4]/60 leading-relaxed font-light">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-3 mt-5 px-4">
          {conceptCards.map((card, i) => (
            <button
              key={i}
              onClick={() => goToCard(i)}
              className="flex flex-col items-center gap-1.5 cursor-pointer py-2 px-1"
              title={card.title}
            >
              <div className={`h-[2px] origin-left transition-all duration-300
                ${i === activeIndex ? 'w-10 bg-[#C8E6D5]' : 'w-5 bg-[#8BC48A]/30'}`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-6 pl-6 md:pl-24 lg:pl-48 pr-24 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {conceptCards.map((card, i) => (
          <div
            key={i}
            className={`flex-none w-[700px] border backdrop-blur-md p-10 flex flex-col gap-6 transition-all duration-500
              ${i === activeIndex
                ? 'border-[#C8E6D5]/50 bg-[#C8E6D5]/6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
                : 'border-[#8BC48A]/15 bg-[#C8E6D5]/3 hover:border-[#C8E6D5]/30'
              }`}
            style={{ minHeight: '480px' }}
          >
            <span className="text-[10px] font-mono tracking-[0.5em] text-[#8BC48A] uppercase">[{card.num}]</span>
            <h4 className="text-xl md:text-2xl font-bold tracking-tight text-[#C8E6D5] leading-snug uppercase">{card.title}</h4>
            <div className="grid grid-cols-2 gap-6 flex-1">
              {card.sections.map((s, j) => (
                <div key={j} className="border-l border-[#8BC48A]/20 pl-4 space-y-2">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#8BC48A]">{s.subtitle}</p>
                  <p className="text-sm text-[#FFF9C4]/60 leading-relaxed font-light">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Paginazione interattiva */}
      <div className="flex items-center gap-3 pl-6 md:pl-24 lg:pl-48 mt-8">
        {conceptCards.map((card, i) => (
          <button
            key={i}
            onClick={() => goToCard(i)}
            className="group flex flex-col gap-1.5 cursor-pointer py-2 px-1"
            title={card.title}
          >
            <div className={`h-[2px] origin-left transition-all duration-300
              ${i === activeIndex
                ? 'w-12 bg-[#C8E6D5]'
                : 'w-6 bg-[#8BC48A]/30 group-hover:w-10 group-hover:bg-[#8BC48A]/70'
              }`}
            />
            <span className={`text-[9px] font-mono uppercase tracking-widest transition-all duration-300
              ${i === activeIndex ? 'text-[#C8E6D5] opacity-100' : 'text-[#8BC48A]/40 opacity-0 group-hover:opacity-100'}`}>
              {card.num}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AlterModal = ({ onClose }: { onClose: () => void }) => {
  const { lang } = useLang();
  const t = translations[lang];
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const layersData = {
    en: [
      { num: '01', label: 'Reality Mapping', title: 'Digital Twin Operative', desc: 'Separates real work from organizational narrative. Maps actual workflows, atomized tasks (10–15 min), dependencies and decision points using process mining, cognitive shadowing and artifact analysis (email, logs).', output: 'The digital twin of work — not of people.' },
      { num: '02', label: 'Task Ontology & Cognitive Load', title: 'The Language Machines Understand', desc: 'Classifies every task across cognitive axes: Repetitiveness, Variability, Judgment Load, Accountability, Relational Intensity, Creativity. Measures cognitive load to explain mental fatigue at the systemic level.', output: 'The task ontology of the 21st century. The defensible IP.' },
      { num: '03', label: 'Delegability Engine', title: 'AI Capability Matching', desc: 'Evaluates which cognitive component of each task is replaceable or augmentable, at what cost and with what risk. Calculates Failure Cost, Confidence Threshold and Human-in-the-loop necessity per task.', output: 'Constrained delegability map. Exposes inefficiencies. Protects management from bad tech decisions.' },
      { num: '04', label: 'Workflow Recomposition', title: 'Rewriting the Implicit Contract', desc: 'Dismantles workflows into atomic tasks and reassigns them (human, AI, hybrid), producing decision scenarios: Aggressive Efficiency, Sustainable Hybrid, Conservative/Political.', output: 'Not a dashboard. A new Operating Model and a 12–36 month Transition Plan.' },
    ],
    it: [
      { num: '01', label: 'Reality Mapping', title: 'Digital Twin Operativo', desc: "Separa il lavoro reale dalla narrativa organizzativa. Mappa flussi di lavoro effettivi, compiti atomizzati (10–15 min), dipendenze e punti decisionali tramite process mining, shadowing cognitivo e analisi degli artefatti (email, log).", output: 'Il gemello digitale del lavoro — non delle persone.' },
      { num: '02', label: 'Ontologia dei Compiti & Carico Cognitivo', title: 'Il Linguaggio che le Macchine Comprendono', desc: 'Classifica ogni compito lungo assi cognitivi: Ripetitività, Variabilità, Carico Decisionale, Responsabilità, Intensità Relazionale, Creatività. Misura il carico cognitivo per spiegare la fatica mentale a livello sistemico.', output: "L'ontologia dei compiti del XXI secolo. La proprietà intellettuale difendibile." },
      { num: '03', label: 'Motore di Delegabilità', title: 'Corrispondenza con le Capacità AI', desc: "Valuta quale componente cognitiva di ogni compito è sostituibile o potenziabile, a quale costo e con quale rischio. Calcola il Costo di Fallimento, la Soglia di Confidenza e la necessità dell'uomo nel ciclo per ogni compito.", output: 'Mappa di delegabilità vincolata. Espone inefficienze. Protegge il management da decisioni tecnologiche errate.' },
      { num: '04', label: 'Ricomposizione del Flusso di Lavoro', title: 'Riscrivere il Contratto Implicito', desc: 'Smantella i flussi di lavoro in compiti atomici e li riassegna (umano, AI, ibrido), producendo scenari decisionali: Efficienza Aggressiva, Ibrido Sostenibile, Conservativo/Politico.', output: 'Non un dashboard. Un nuovo Modello Operativo e un Piano di Transizione da 12–36 mesi.' },
    ],
  };
  const layers = layersData[lang];

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="alter-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-md"
      />

      {/* Central expanding modal */}
      <motion.div
        key="alter-modal"
        initial={{ opacity: 0, scale: 0.93, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 30 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
        className="fixed inset-0 z-[910] flex items-center justify-center p-4 md:p-8 pointer-events-none"
      >
        <div
          className="relative w-full max-w-6xl max-h-[92vh] bg-[#060E1C] border border-[#8BC48A]/20 shadow-[0_40px_120px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Sticky header */}
          <div className="flex-none flex items-center justify-between px-6 md:px-10 py-4 bg-[#060E1C]/95 backdrop-blur-md border-b border-[#8BC48A]/10">
            <div className="flex items-center gap-4">
              <img src="https://devops.supernaturale.it/dir/exxodus/alterLogo.svg" alt="ALTER" className="h-7" />
              <span className="hidden sm:block text-[9px] font-mono uppercase tracking-[0.4em] text-[#8BC48A]/40">{t.alterOverview}</span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 border border-[#8BC48A]/20 hover:border-white/50 hover:bg-white/5 transition-all duration-200 group cursor-pointer"
              aria-label="Close"
            >
              <X size={16} className="text-[#8BC48A]/60 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* VIDEO — full width, prominent */}
            <div className="w-full bg-black relative">
              <video
                src="/alterDemo-v5.mp4"
                controls
                preload="metadata"
                playsInline
                className="w-full max-h-[55vh] object-contain bg-black"
              />
            </div>

            <div className="px-6 md:px-12 py-10 space-y-12">

              {/* Domain badge + quote */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                className="space-y-4"
              >
                <span className="inline-block text-[10px] font-mono tracking-[0.3em] uppercase px-2 py-0.5 border border-[#8BC48A]/40 text-[#8BC48A]">{t.alterDomain}</span>
                <p className="text-xl md:text-2xl font-light text-[#FFF9C4]/80 leading-relaxed">
                  &quot;{t.alterQuote1}{' '}<span className="text-white font-bold">{t.alterQuote2}</span>&quot;
                </p>
              </motion.div>

              {/* 4 Layers — 2×2 grid on desktop */}
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8BC48A]/60">{t.alterArchLabel}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {layers.map((layer, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 + i * 0.07 }}
                      className="border border-[#8BC48A]/15 bg-[#C8E6D5]/3 p-6 flex flex-col gap-4 hover:border-[#C8E6D5]/30 transition-all duration-500"
                    >
                      <div className="flex items-start gap-4">
                        <p className="text-3xl font-bold text-[#C8E6D5]/12 font-mono flex-none">{layer.num}</p>
                        <div className="space-y-1.5 flex-1">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8BC48A]">{layer.label}</p>
                          <h5 className="text-sm font-bold text-[#C8E6D5] leading-snug">{layer.title}</h5>
                          <p className="text-xs font-light text-[#FFF9C4]/55 leading-relaxed">{layer.desc}</p>
                        </div>
                      </div>
                      <div className="border-t border-[#8BC48A]/10 pt-3">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-[#8BC48A]/40 mb-1">{t.alterKeyOutput}</p>
                        <p className="text-xs font-light text-[#C8E6D5]/65 italic leading-relaxed">{layer.output}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* MVP + Buyers — side by side on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="border border-[#C8E6D5]/20 bg-[#C8E6D5]/5 p-7 space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#8BC48A]">{t.alterMvpLabel}</p>
                  <p className="text-base font-light text-white leading-relaxed">{t.alterMvpDesc}</p>
                  <p className="text-sm font-light text-[#FFF9C4]/50 leading-relaxed italic border-l border-[#C8E6D5]/20 pl-4">
                    &quot;{t.alterMvpQuote}&quot;
                  </p>
                </div>
                <div className="border border-[#8BC48A]/15 p-7 space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#8BC48A]">{t.alterBuyersLabel}</p>
                  <p className="text-base font-light text-white leading-relaxed">{t.alterBuyersDesc}</p>
                  <p className="text-sm font-light text-[#FFF9C4]/50 leading-relaxed">{t.alterBuyersMsg} <span className="text-[#C8E6D5]">&quot;{t.alterBuyersQuote}&quot;</span></p>
                </div>
              </motion.div>

              <div className="pb-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const ReleaseSequence = ({ onModalChange }: { onModalChange?: (open: boolean) => void }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { lang } = useLang();
  const t = translations[lang];
  const releases = getReleases(lang);
  const openModal = () => { setModalOpen(true); onModalChange?.(true); };
  const closeModal = () => { setModalOpen(false); onModalChange?.(false); };

  return (
    <>
    {modalOpen && <AlterModal onClose={closeModal} />}
    <div className="w-full max-w-6xl mx-auto relative pl-8 md:pl-20">
      <div className="absolute left-[9px] md:left-[39px] top-4 bottom-0 w-[1px] bg-white/10" />
      <div className="space-y-3">
        {releases.map((rel, i) => {
          const dom = DOMAINS[rel.domain];
          const isActive = rel.status === 'active';
          const isComingSoon = rel.status === 'coming-soon';
          const isExpanded = isActive || expandedIndex === i;

          // dot color
          const dotStyle = isActive
            ? { backgroundColor: dom.color, borderColor: dom.color, boxShadow: `0 0 15px ${dom.color}99` }
            : isComingSoon
            ? { backgroundColor: 'transparent', borderColor: `${dom.color}60` }
            : { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.1)' };

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: Math.min(i * 0.04, 0.3) }}
              className="relative"
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-[30px] md:-left-[61px] top-5 w-3 h-3 rounded-full border-2 transition-all duration-700"
                style={dotStyle}
              />

              {/* ACTIVE card — always expanded, full design */}
              {isActive ? (
                <div
                  className="border backdrop-blur-md flex flex-col p-7 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
                  style={{ borderColor: dom.color, backgroundColor: `${dom.color}08` }}
                >
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="space-y-2 min-w-0">
                      <img src="https://devops.supernaturale.it/dir/exxodus/alterLogo.svg" alt="ALTER" className="h-10 mb-1" />
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.25em] uppercase px-2 py-0.5 border"
                        style={{ borderColor: `${dom.color}50`, color: dom.color }}
                      >
                        {dom.icon}{dom.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-none">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 tracking-widest" style={{ color: '#0A1628', backgroundColor: dom.color }}>
                        {rel.date}
                      </span>
                      <Unlock size={16} style={{ color: dom.color }} />
                    </div>
                  </div>
                  {rel.subtitle && (
                    <span className="text-[10px] font-mono tracking-[0.5em] uppercase mb-5 block" style={{ color: `${dom.color}80` }}>
                      {rel.subtitle}
                    </span>
                  )}
                  <p className="font-light leading-relaxed mb-7 max-w-4xl text-lg md:text-xl text-white/90">
                    <span className="font-bold text-white">&quot;</span>{rel.thesis}<span className="font-bold text-white">&quot;</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                    {rel.points.map((pt, j) => (
                      <div key={j} className="pl-4 space-y-1" style={{ borderLeft: `1px solid ${dom.color}30` }}>
                        <p className="text-[11px] font-mono uppercase tracking-widest" style={{ color: dom.color }}>{pt.label}</p>
                        <p className="text-sm font-light leading-relaxed text-white/50">{pt.text}</p>
                      </div>
                    ))}
                  </div>
                  {rel.cta && (
                    <div className="mt-2">
                      <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-4 px-8 py-4 transition-all duration-300 text-[11px] font-bold tracking-[0.3em] uppercase"
                        style={{ border: `1px solid ${dom.color}60`, color: dom.color }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = dom.color; (e.currentTarget as HTMLButtonElement).style.color = '#0A1628'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = dom.color; }}
                      >
                        {t.alterCta} <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* COLLAPSED / EXPANDABLE row for non-active releases */
                <div
                  className={`border backdrop-blur-md transition-all duration-500 cursor-pointer
                    ${isComingSoon ? 'opacity-85 hover:opacity-100' : 'opacity-55 hover:opacity-85'}
                    ${isExpanded ? '' : 'hover:border-white/20'}`}
                  style={{
                    borderColor: isExpanded ? `${dom.color}50` : 'rgba(255,255,255,0.07)',
                    backgroundColor: isExpanded ? `${dom.color}06` : 'rgba(0,0,0,0.15)',
                  }}
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                >
                  {/* Always-visible collapsed row */}
                  <div className="flex items-start justify-between gap-4 px-6 py-4">
                    {/* Left: title + domain badge + subtitle */}
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <h4 className="font-mono tracking-tight uppercase text-sm md:text-base text-white/90 leading-tight">
                        {rel.title}
                      </h4>
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-mono tracking-[0.2em] uppercase px-1.5 py-0.5 border w-fit"
                        style={{ borderColor: `${dom.color}50`, color: dom.color }}
                      >
                        {dom.icon}{dom.label}
                      </span>
                      {rel.subtitle && (
                        <span className="text-[9px] font-mono tracking-[0.35em] uppercase" style={{ color: `${dom.color}70` }}>
                          {rel.subtitle}
                        </span>
                      )}
                    </div>

                    {/* Right: date + lock + chevron */}
                    <div className="flex items-center gap-2.5 flex-none pt-0.5">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 tracking-widest"
                        style={{ color: dom.color, backgroundColor: `${dom.color}12`, border: `1px solid ${dom.color}30` }}
                      >
                        {rel.date}
                      </span>
                      <Lock size={13} className="text-white/15" />
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={13} className="text-white/25" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-4 space-y-5" style={{ borderTop: `1px solid ${dom.color}15` }}>
                          {/* Thesis */}
                          <p className="text-base font-light leading-relaxed text-white/65 max-w-4xl">
                            <span className="font-bold text-white">&quot;</span>{rel.thesis}<span className="font-bold text-white">&quot;</span>
                          </p>
                          {/* Key points */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rel.points.map((pt, j) => (
                              <div key={j} className="pl-4 space-y-1" style={{ borderLeft: `1px solid ${dom.color}30` }}>
                                <p className="text-[11px] font-mono uppercase tracking-widest" style={{ color: dom.color }}>{pt.label}</p>
                                <p className="text-sm font-light leading-relaxed text-white/45">{pt.text}</p>
                              </div>
                            ))}
                          </div>
                          {/* Prerequisite */}
                          {rel.prerequisite && (
                            <div className="pt-3" style={{ borderTop: `1px solid ${dom.color}12` }}>
                              <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: `${dom.color}45` }}>{t.unlockedBy}</p>
                              <p className="text-sm font-light text-white/25 italic leading-relaxed">{rel.prerequisite}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
    </>
  );
};

// Fixed bottom release timeline bar
const ReleaseTimelineBar = ({ hidden = false }: { hidden?: boolean }) => {
  const { lang } = useLang();
  const releases = getReleases(lang);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const show = visible && !hidden;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 z-[150] flex items-stretch bg-[#070e1c]/90 backdrop-blur-xl border border-[#8BC48A]/15 shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden max-w-[calc(100vw-2rem)]"
          style={{ borderRadius: 2 }}
        >
          {(Object.entries(DOMAINS) as [DomainKey, typeof DOMAINS[DomainKey]][]).map(([key, dom], i) => {
            const isActive = key === 'work';
            return (
              <a
                key={key}
                href="#releases"
                className={`relative flex items-center gap-3 px-5 py-4 transition-all duration-300 group border-r last:border-r-0
                  ${isActive ? 'bg-white/4' : 'hidden md:flex opacity-55 hover:opacity-100'}`}
                style={{ borderRightColor: 'rgba(255,255,255,0.06)' }}
              >
                {/* Dot */}
                <div className="relative flex-none">
                  {isActive ? (
                    <>
                      <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${dom.color}50`, animationDuration: '2s' }} />
                      <span className="relative block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dom.color, boxShadow: `0 0 8px ${dom.color}` }} />
                    </>
                  ) : (
                    <span className="block w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: `${dom.color}40` }} />
                  )}
                </div>

                {/* Label */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  {isActive ? (
                    <>
                      <span className="text-[10px] font-mono uppercase tracking-wider leading-none whitespace-nowrap font-bold" style={{ color: dom.color }}>
                        {dom.label}
                      </span>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <img src="https://devops.supernaturale.it/dir/exxodus/alterLogo.svg" alt="ALTER" className="h-3 flex-none" />
                        <span className="text-[9px] font-mono font-bold leading-none" style={{ color: dom.color }}>· ACTIVE</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-mono uppercase tracking-wider leading-none whitespace-nowrap font-bold" style={{ color: `${dom.color}` }}>
                        {dom.label}
                      </span>
                      <span className="text-[9px] font-mono leading-none whitespace-nowrap" style={{ color: `${dom.color}60` }}>
                        {(() => {
                          const domReleases = releases.filter(r => r.domain === key);
                          const first = domReleases[0]?.date;
                          const last = domReleases[domReleases.length - 1]?.date;
                          return first === last ? first : `${first} → ${last}`;
                        })()}
                      </span>
                    </>
                  )}
                </div>
              </a>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const t = translations[lang];
  const navIds = ['concept', 'transition', 'releases'];
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 bg-[#0A1628] z-[800] flex flex-col items-center justify-center gap-10 px-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 flex items-center justify-center w-10 h-10 border border-[#8BC48A]/20 hover:border-white/40 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} className="text-[#8BC48A]/60" />
          </button>

          {/* Logo */}
          <img src={LOGO_URL} alt="EXXODUS" className="h-4 opacity-40 mb-4" />

          {/* Nav links */}
          {t.nav.map((item, i) => (
            <motion.a
              key={item}
              href={`#${navIds[i]}`}
              onClick={onClose}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="text-4xl font-bold tracking-tighter uppercase text-white hover:text-[#C8E6D5] transition-colors"
            >
              {item}
            </motion.a>
          ))}
          <motion.a
            href="#footer"
            onClick={onClose}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + t.nav.length * 0.07 }}
            className="text-4xl font-bold tracking-tighter uppercase text-[#8BC48A] hover:text-[#C8E6D5] transition-colors"
          >
            {t.navContacts}
          </motion.a>

          {/* Bottom status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-8 flex items-center gap-2"
          >
            <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
            <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#8BC48A]/30">{t.heroLabel}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-0 border border-[#8BC48A]/20 overflow-hidden">
      {(['en', 'it'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-2.5 py-1 text-[8px] font-mono uppercase tracking-widest transition-all duration-200"
          style={{
            backgroundColor: lang === l ? '#8BC48A' : 'transparent',
            color: lang === l ? '#0A1628' : 'rgba(139,196,138,0.45)',
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLang();
  const t = translations[lang];
  const navIds = ['concept', 'transition', 'releases'];

  return (
    <>
    <header className="fixed top-0 left-0 w-full z-[100] p-6 md:px-12 flex justify-between items-center bg-[#0A1628]/40 backdrop-blur-xl border-b border-[#8BC48A]/10">
      <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={LOGO_URL} alt="EXXODUS" className="h-4 md:h-5" />

      <nav className="hidden md:flex gap-12 text-[9px] uppercase tracking-[0.4em] font-bold text-[#C8E6D5]/60">
        {t.nav.map((item, i) => (
          <a key={item} href={`#${navIds[i]}`} className="hover:text-white transition-all relative group">
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C8E6D5] group-hover:w-full transition-all duration-500" />
          </a>
        ))}
        <a href="#footer" className="hover:text-white transition-all relative group">
          {t.navContacts}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C8E6D5] group-hover:w-full transition-all duration-500" />
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2">
          <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
          <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#8BC48A]/40">{t.syncActive}</span>
        </div>
        <LanguageSwitcher />
        <button onClick={() => setIsOpen(true)} className="md:hidden text-[#FFF9C4] p-1"><Menu size={22} /></button>
      </div>
    </header>

    <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export function ExxodusApp() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { lang } = useLang();
  const t = translations[lang];

  useEffect(() => {
    setMouse({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-[#0A1628] text-[#FFF9C4] selection:bg-[#8BC48A] selection:text-[#0A1628] overflow-x-hidden font-sans">
      <Header />

      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Blob verde: segue il mouse con offset lieve a sinistra */}
        <OrganicBlob color="#8BC48A" size="700px" top="0" left="0"
          followMouse mouseX={mouse.x} mouseY={mouse.y} offsetX={-120} offsetY={-80} />
        {/* Blob chiaro: segue il mouse con lag maggiore e offset diverso */}
        <OrganicBlob color="#C8E6D5" size="600px" top="0" left="0" delay={5}
          followMouse mouseX={mouse.x} mouseY={mouse.y} offsetX={80} offsetY={60} />
      </div>

      {/* 1. HERO */}
      <Section className="relative min-h-screen pt-28 md:pt-48 flex flex-col items-center text-center overflow-visible">
        <div className="max-w-5xl z-10 space-y-12 mb-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-8 bg-[#8BC48A]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#8BC48A]">{t.heroLabel}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[0.92] uppercase"
          >
            <span className="text-white">{t.heroTitle1}</span>{' '}
            <span className="text-[#C8E6D5]">{t.heroTitle2}</span>
            <br />
            <span className="text-white">{t.heroTitle3}</span>{' '}
            <span className="text-[#C8E6D5]">{t.heroTitle4}</span>{' '}
            <span className="text-white">{t.heroTitle5}</span>
            <br />
            <span className="relative inline-block">
              <span className="text-[#C8E6D5]">{t.heroTitle6}</span>
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#8BC48A] to-transparent" />
            </span>{' '}
            <span className="text-[#8BC48A]">{t.heroTitle7}</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="space-y-6 text-left max-w-3xl mx-auto">
            <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed">{t.heroPara1}</p>
            <p className="text-base md:text-lg font-light text-white/50 leading-relaxed">{t.heroPara2}</p>
            <p className="text-base md:text-lg font-light text-[#C8E6D5]/70 leading-relaxed">{t.heroPara3}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="w-[90vw] mt-[2em] z-0 relative"
        >
          <LiquidImage src={HERO_IMAGE} alt="Hero migration" className="w-full aspect-square md:aspect-video shadow-[0_40px_80px_rgba(0,0,0,0.4)]" overlay={true} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="pt-24 z-10">
          <a href="#concept" className="inline-flex items-center gap-4 px-10 py-5 border border-white/20 hover:bg-white hover:text-black transition-all text-[11px] font-bold tracking-[0.3em] uppercase">
            {t.heroCta} <ArrowRight size={16} />
          </a>
        </motion.div>
      </Section>

      {/* 2. CONCEPT */}
      <section id="concept" className="py-32 relative">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

        {/* Parte superiore: titolo sx + foto dx */}
        <div className="px-6 md:px-24 lg:px-48 relative z-10 mb-24">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 w-full max-w-7xl mx-auto">
            {/* Sinistra sticky: titolo + testo + citazione */}
            <div className="w-full lg:w-[50%] space-y-10 lg:sticky lg:top-28 self-start">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-[0.6em] text-[#8BC48A] uppercase">{t.conceptLabel}</span>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#C8E6D5] leading-none">{t.conceptTitle}</h2>
              </div>
              <p className="text-xl font-light text-[#FFF9C4]/80 leading-relaxed">
                {t.conceptIntro} <span className="text-white font-bold underline decoration-[#8BC48A]/30 underline-offset-8">{t.conceptIntroHighlight}</span> {t.conceptIntroSuffix}
              </p>
              <div className="p-8 bg-[#C8E6D5]/5 border-l border-[#C8E6D5]/40 backdrop-blur-xl space-y-4">
                <p className="text-base opacity-80 leading-relaxed italic">&quot;{t.conceptQuote}&quot;</p>
                <div className="flex items-center gap-4 text-[9px] font-mono text-[#8BC48A] uppercase tracking-widest opacity-60">
                  <span className="w-8 h-[1px] bg-[#8BC48A]" />
                  {t.conceptSource}
                </div>
              </div>
            </div>

            {/* Destra: foto 3/5 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="w-full lg:w-[40%] relative"
            >
              <LiquidImage src={CONCEPT_IMAGE} alt="Concept visual" className="w-full aspect-[4/3] lg:aspect-[3/4] shadow-[0_60px_120px_rgba(0,0,0,0.6)]" overlay={false} />
              <div className="absolute -top-8 -right-8 w-32 h-32 border border-[#8BC48A]/20 pointer-events-none" />
            </motion.div>
          </div>
        </div>

        {/* Cards — scroll orizzontale pilotato dallo scroll verticale */}
        <HorizontalScrollCards />
      </section>

      {/* 3. TRANSITION */}
      <section id="transition" className="bg-black/10 px-6 md:px-24 lg:px-48 py-32 relative overflow-visible">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="flex flex-col lg:flex-row-reverse justify-between items-start relative z-10 w-full max-w-7xl mx-auto gap-24">
          <div className="w-full lg:w-[50%] space-y-16">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.6em] text-[#8BC48A] uppercase">{t.transitionLabel}</span>
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-[#C8E6D5] leading-none">{t.transitionTitle}</h2>
            </div>

            {/* What EXXODUS is not */}
            <div className="space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#8BC48A]/60">{t.transitionNotLabel}</p>
              <div className="space-y-2">
                {t.transitionNotItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-[#FFF9C4]/40 text-sm font-light">
                    <span className="mt-2 w-4 h-[1px] bg-[#8BC48A]/30 flex-none" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* What EXXODUS is */}
            <div className="p-10 bg-[#C8E6D5]/5 border-l border-[#C8E6D5]/40 backdrop-blur-xl space-y-6">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#8BC48A]">{t.transitionIsLabel}</p>
              <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                {t.transitionIsStatement} <span className="text-[#C8E6D5] font-bold">{t.transitionIsHighlight}</span>
              </p>
              <div className="space-y-2">
                {t.transitionIsItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-[#FFF9C4]/60 text-sm font-light">
                    <span className="mt-2 w-4 h-[1px] bg-[#8BC48A]/50 flex-none" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Closing statement */}
            <div className="space-y-4 border-t border-[#8BC48A]/10 pt-10">
              <p className="text-lg md:text-xl font-light text-[#FFF9C4]/70 leading-relaxed">
                {t.transitionClose1} <span className="text-white font-bold">{t.transitionCloseHighlight}</span>{t.transitionClose2}
              </p>
              <p className="text-base text-[#C8E6D5]/50 font-light leading-relaxed italic">{t.transitionQuote}</p>
            </div>
          </div>

          {/* Foto con parallax: scorre più lentamente del testo */}
          <ParallaxCol speed={0.25} className="w-full lg:w-[40%] self-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1.2 }}
              className="aspect-[4/3] lg:aspect-square relative"
            >
              <LiquidImage src={TRANSITION_IMAGE} alt="Transition visual" className="w-full h-full shadow-[0_60px_100px_rgba(0,0,0,0.5)]" overlay={false} />
              <div className="absolute -bottom-6 -left-6 text-[10px] font-mono tracking-[0.5em] text-[#8BC48A] rotate-90 origin-left opacity-40">
                MIGRATION_VECTOR_422
              </div>
            </motion.div>
          </ParallaxCol>
        </div>
      </section>

      {/* 4. DOMAINS OF INTERVENTION */}
      <Section id="domains">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-14 space-y-4">
            <p className="text-[10px] font-mono tracking-[0.6em] text-[#8BC48A] uppercase">{t.domainsLabel}</p>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#C8E6D5] leading-none uppercase">{t.domainsTitle}</h3>
            <p className="text-sm text-[#FFF9C4]/40 font-light max-w-xl pt-2">{t.domainsSubtitle}</p>
          </div>

          {/* Row 1 — 3 domains */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {(Object.entries(DOMAINS) as [DomainKey, typeof DOMAINS[DomainKey]][]).slice(0, 3).map(([key, dom], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="space-y-4 p-7 border bg-black/5 transition-all duration-300 hover:bg-black/10 group"
                style={{ borderColor: `${dom.color}20` }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${dom.color}50`}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${dom.color}20`}
              >
                <div style={{ color: dom.color }}>{React.cloneElement(dom.icon as React.ReactElement<{ size?: number }>, { size: 22 })}</div>
                <h5 className="font-mono text-xs uppercase tracking-widest" style={{ color: dom.color }}>{dom.label}</h5>
                <p className="text-sm text-white/40 leading-relaxed font-light">{t.domainDescriptions[key]}</p>
              </motion.div>
            ))}
          </div>

          {/* Row 2 — 4 domains */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(Object.entries(DOMAINS) as [DomainKey, typeof DOMAINS[DomainKey]][]).slice(3).map(([key, dom], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="space-y-4 p-7 border bg-black/5 transition-all duration-300 hover:bg-black/10 group"
                style={{ borderColor: `${dom.color}20` }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${dom.color}50`}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${dom.color}20`}
              >
                <div style={{ color: dom.color }}>{React.cloneElement(dom.icon as React.ReactElement<{ size?: number }>, { size: 22 })}</div>
                <h5 className="font-mono text-xs uppercase tracking-widest" style={{ color: dom.color }}>{dom.label}</h5>
                <p className="text-sm text-white/40 leading-relaxed font-light">{t.domainDescriptions[key]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. RELEASES */}
      <Section id="releases">
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10 mb-20">
          <p className="text-[10px] font-mono tracking-[0.6em] text-[#8BC48A] uppercase">{t.releasesLabel}</p>
          <h3 className="text-4xl md:text-7xl font-bold tracking-tighter text-[#C8E6D5] leading-none uppercase">{t.releasesTitle}</h3>
        </div>

        {/* Large 80vw Main Photo with 16:8 ratio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-[80vw] mx-auto mb-32 relative z-10"
        >
          <LiquidImage
            src={ROADMAP_IMAGE}
            alt="Evolution roadmap visual"
            className="w-full aspect-square md:aspect-[16/8] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-[#C8E6D5]/10"
            overlay={false}
          />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 border-r border-b border-[#8BC48A]/30 pointer-events-none" />
        </motion.div>

        {/* THE EXXODUS LAB intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10 mb-20 space-y-6"
        >
          <p className="text-[10px] font-mono tracking-[0.6em] text-[#8BC48A] uppercase">{t.labLabel}</p>
          <p className="text-xl md:text-2xl font-light text-[#FFF9C4]/70 leading-relaxed max-w-3xl">
            {t.labIntro1} <span className="text-white font-bold">{t.labIntroHighlight1}</span> {t.labIntro2} <span className="text-[#C8E6D5] font-bold">{t.labIntroHighlight2}</span>{t.labIntro3} <span className="text-white font-bold">{t.labIntroHighlight3}</span>{t.labIntro4}
          </p>
          <div className="h-[1px] w-full bg-[#8BC48A]/10" />
        </motion.div>

        <div className="relative z-10">
          <ReleaseSequence onModalChange={setSidebarOpen} />
        </div>
      </Section>

      {/* FOOTER */}
      <footer id="footer" className="py-48 px-6 md:px-24 lg:px-48 relative overflow-hidden bg-black/40 border-t border-[#8BC48A]/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 md:gap-24">
          {/* Left — logo + tagline */}
          <div className="space-y-12 max-w-2xl">
            <img src={LOGO_URL} alt="EXXODUS" className="h-6" />
            <p className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {t.footerTagline1} <br/> {t.footerTagline2} <span className="text-[#8BC48A]">{t.footerTaglineHighlight}</span>.
            </p>
          </div>
          {/* Right — contact box + symbol + copyright */}
          <div className="flex flex-col items-end gap-8">
            {/* Contact box */}
            <div className="border border-[#8BC48A]/15 bg-[#8BC48A]/4 backdrop-blur-sm p-6 flex flex-col gap-3 text-right min-w-[220px]">
              <p className="text-[9px] font-mono tracking-[0.45em] uppercase text-[#8BC48A] mb-1">{t.footerContactLabel}</p>
              <p className="text-[11px] text-[#C8E6D5]/40 font-light leading-relaxed">{t.footerContactMicro}</p>
              <a
                href="mailto:loop@exxodus.io"
                className="text-[12px] font-mono tracking-[0.2em] text-[#8BC48A]/70 hover:text-[#8BC48A] transition-colors mt-1"
              >
                {t.footerContactEmail}
              </a>
            </div>
            {/* Symbol + copyright */}
            <div className="flex flex-col items-end gap-4">
              <img src={SYMBOL_URL} alt="" className="h-12 opacity-20" />
              <span className="text-[9px] font-mono text-[#8BC48A]/20 tracking-[0.5em] uppercase">{t.footerCopyright}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed bottom timeline bar — hidden when ALTER sidebar is open */}
      <ReleaseTimelineBar hidden={sidebarOpen} />

      <motion.div className="fixed bottom-0 left-0 h-1 bg-[#C8E6D5] z-[200]" style={{ scaleX: smoothProgress, transformOrigin: "0%" }} />
    </div>
  );
}
