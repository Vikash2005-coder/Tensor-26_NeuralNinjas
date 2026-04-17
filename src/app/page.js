'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

const personas = [
  { id: 'youth', name: 'KIDS & TEENS', image: '/images/youth.jpg', maturity: 0.6 },
  { id: 'worker', name: 'WORKING CLASS', image: '/images/worker.jpg', maturity: 1.0 },
  { id: 'senior', name: 'SENIOR CITIZENS', image: '/images/senior.jpg', maturity: 0.8 }
];

export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const tearRef = useRef(null);
  const [activePersona, setActivePersona] = useState(null);
  const [showGreeting, setShowGreeting] = useState(false);

  const greetingData = {
    youth: "HEY DUDE!",
    worker: "HEY PROFESSIONALS!",
    senior: "NAMASTE!"
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(tearRef.current, { display: 'none' });
        }
      });

      // 1. Initial Tension: Show the Japanese text solid first
      tl.to('.intro-text', {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
        delay: 0.5
      });

      // 2. The Strike: High-speed flash line streaking through
      tl.fromTo('.katana-strike',
        { width: 0, opacity: 0, x: '-100%', y: '100%' },
        {
          width: '200%',
          opacity: 1,
          x: '50%',
          y: '-50%',
          duration: 0.2,
          ease: "power4.out"
        }
      );

      // 3. The Cleave: Move along the diagonal vector (-45 degrees)
      tl.to('.slice-part', {
        x: (i) => i === 0 ? 1200 : -1200,
        y: (i) => i === 0 ? -1200 : 1200,
        duration: 1,
        ease: "power4.inOut"
      }, "-=0.1");

      // Fade out the leftover strike line
      tl.to('.katana-strike', { opacity: 0, duration: 0.4 }, "-=0.6");

      // 3.5 The Reveal Interval: PRESENTS
      tl.fromTo('.presents-text',
        { opacity: 0, scale: 0.5, letterSpacing: "40px" },
        { opacity: 1, scale: 1, letterSpacing: "15px", duration: 1, ease: "power3.out" }
        , "-=0.2")
        .to('.presents-text', { opacity: 0, scale: 2, duration: 0.6, ease: "power3.in" }, "+=0.5");

      // 4. Reveal the MINDSTONE BRAND
      tl.fromTo('.app-title',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "expo.out" }
        , "-=0.5");

      tl.fromTo('.persona-card',
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)" }
        , "-=1");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const selectPersona = (id) => {
    setActivePersona(id);
    setShowGreeting(true);

    // Initializing high-speed neural redirect
    setTimeout(() => {
      router.push(`/dashboard?persona=${id}`);
    }, 2800);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#03050a] text-white overflow-x-hidden font-mono">
      {/* Sparkly Glitter Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:40px_40px] animate-pulse" />

      {/* Neural Greeting Overlay (Holographic Projection) */}
      {showGreeting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-3xl bg-black/80 animate-in fade-in duration-700">
          <div className="max-w-xl w-full p-8 flex flex-col items-center text-center">
            <div className="relative mb-10">
              {/* Octagon Avatar for Greeting */}
              <div className="w-32 h-32 octagon border-2 border-alpha bg-black overflow-hidden scale-110 shadow-[0_0_30px_rgba(0,242,255,0.4)]">
                <img
                  src={`/images/${activePersona}.jpg`}
                  className="w-full h-full object-cover"
                  alt={activePersona}
                />
              </div>
              <div className="absolute inset-0 octagon border-alpha animate-ping opacity-20" />
            </div>

            <h2 className="japanese-font text-2xl md:text-3xl text-alpha glow-text mb-6 tracking-widest leading-tight">
              {greetingData[activePersona]}
            </h2>

            <p className="mono text-[10px] text-white/40 mb-10 tracking-[5px] uppercase">
              ESTABLISHING_QUANTUM_UPLINK...
            </p>

            {/* Progress Bar Container */}
            <div className="w-64 h-1 bg-white/5 border border-white/10 relative overflow-hidden">
              <div className="h-full bg-alpha shadow-[0_0_10px_#00f2ff] animate-uplink" />
            </div>
          </div>
        </div>
      )}

      {/* INTRO SCREEN (Ronin Slice Protocol) */}
      <div ref={tearRef} className="fixed inset-0 z-[100] overflow-hidden pointer-events-none bg-transparent">
        {/* The Katana Strike Flash */}
        <div className="katana-strike absolute top-1/2 left-1/2" />

        <div className="slice-part absolute inset-0 bg-[#03050a] z-20 flex items-center justify-center"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
          <h1 className="intro-text opacity-0 japanese-font text-7xl md:text-[10rem] text-white leading-none uppercase font-black">
            NEURAL<br />NINJAS
          </h1>
        </div>

        <div className="slice-part absolute inset-0 bg-[#03050a] z-20 flex items-center justify-center"
          style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}>
          <h1 className="intro-text opacity-0 japanese-font text-7xl md:text-[10rem] text-white leading-none uppercase font-black">
            NEURAL<br />NINJAS
          </h1>
        </div>

        {/* THE PRESENTS REVEAL (Inside the Intro Container for visibility) */}
        <div className="presents-text absolute inset-0 z-10 flex items-center justify-center opacity-0 pointer-events-none">
          <h1 className="japanese-font text-4xl md:text-6xl text-alpha tracking-[20px] uppercase">
            PRESENTS
          </h1>
        </div>
      </div>

      {/* MAIN CONTENT REVEALED FROM BEHIND */}
      <main className="relative z-0 min-h-screen flex flex-col items-center justify-center p-10 pb-40">
        <h1 className="app-title opacity-0 text-5xl md:text-9xl font-extrabold mb-10 text-center tracking-[15px] festive-text leading-none uppercase">
          MINDSTONE
        </h1>

        <div className="flex flex-wrap justify-center gap-12 mt-10">
          {personas.map((p) => (
            <div
              key={p.id}
              onClick={() => selectPersona(p.id)}
              className="persona-card group cursor-pointer relative w-64 h-64 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-alpha/5 border-2 border-alpha/30 octagon transition-all duration-500 group-hover:bg-alpha/20 group-hover:scale-110 group-hover:border-alpha group-hover:shadow-[0_0_40px_rgba(0,242,255,0.4)]" />
              <div className="relative w-48 h-48 octagon overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110"
                />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-center">
                <p className="mono text-alpha font-bold tracking-[6px] uppercase text-xs">{p.name}</p>
              </div>
            </div>
          ))}
        </div>

        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
            .octagon {
              clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
            }
            .festive-text {
              font-family: 'Monoton', cursive;
              color: transparent;
              -webkit-text-stroke: 1px #00f2ff;
              text-shadow: 0 0 20px rgba(0,242,255,0.3);
            }
         `}</style>
      </main>

      <footer className="fixed bottom-10 left-0 w-full flex justify-center opacity-20 pointer-events-none mono text-[8px] tracking-[5px] uppercase">
        MINDSTONE_DIVISION // ENTRY_PROTOCOL_ACTIVE
      </footer>
    </div>
  );
}
