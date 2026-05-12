"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function HydroBackground() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#110b1a]">
      {/* Background base noise/texture if performance allows */}
      <div 
        className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-[0.05]" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' 
        }} 
      />

      {/* 
        Removed mix-blend-screen so the colors overlap and obscure each other like physical paint.
        Using normal alpha blending with high opacity and intense blur for the hydro dip swirling effect. 
      */}
      <div className="absolute inset-0" style={{ filter: isMobile ? 'blur(60px)' : 'blur(90px)' }}>
        
        {/* Blob 1: Pastel Violet */}
        <div 
          className="absolute rounded-full opacity-80"
          style={{
            top: '-20%',
            left: '-20%',
            width: isMobile ? '80vw' : '70vw',
            height: isMobile ? '80vw' : '70vw',
            background: 'radial-gradient(circle, #b19cd9 0%, transparent 70%)',
            animation: prefersReducedMotion ? 'none' : `hydro-float1 ${isMobile ? '8s' : '6s'} ease-in-out infinite alternate`,
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {/* Blob 2: Lively Pastel Coral/Pink */}
        <div 
          className="absolute rounded-full opacity-80"
          style={{
            bottom: '-20%',
            right: '-20%',
            width: isMobile ? '90vw' : '80vw',
            height: isMobile ? '90vw' : '80vw',
            background: 'radial-gradient(circle, #ffb7b2 0%, transparent 70%)',
            animation: prefersReducedMotion ? 'none' : `hydro-float2 ${isMobile ? '9s' : '7s'} ease-in-out infinite alternate-reverse`,
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {/* Blob 3: Lively Pastel Teal */}
        <div 
          className="absolute rounded-full opacity-70"
          style={{
            top: '30%',
            right: '10%',
            width: isMobile ? '70vw' : '60vw',
            height: isMobile ? '70vw' : '60vw',
            background: 'radial-gradient(circle, #9bf6ff 0%, transparent 70%)',
            animation: prefersReducedMotion ? 'none' : `hydro-float3 ${isMobile ? '7s' : '5s'} ease-in-out infinite alternate`,
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {/* Blob 4: Pastel Peach/Red */}
        <div 
          className="absolute rounded-full opacity-80"
          style={{
            bottom: '-10%',
            left: '-10%',
            width: isMobile ? '70vw' : '60vw',
            height: isMobile ? '70vw' : '60vw',
            background: 'radial-gradient(circle, #ffadad 0%, transparent 70%)',
            animation: prefersReducedMotion ? 'none' : `hydro-float4 ${isMobile ? '10s' : '8s'} ease-in-out infinite alternate-reverse`,
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {/* Blob 5: Pastel Lemon/Green (Desktop only) */}
        {(!isMobile) && (
          <div 
            className="absolute rounded-full opacity-70"
            style={{
              top: '40%',
              left: '10%',
              width: '50vw',
              height: '50vw',
              background: 'radial-gradient(circle, #caffbf 0%, transparent 70%)',
              animation: prefersReducedMotion ? 'none' : 'hydro-float5 6s ease-in-out infinite alternate',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        )}
        
        {/* Blob 6: Muted Periwinkle wash overlay to tie it together */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(circle at center, #bdb2ff 0%, transparent 90%)',
            animation: prefersReducedMotion ? 'none' : `hydro-pulse ${isMobile ? '6s' : '4s'} ease-in-out infinite alternate`,
            willChange: 'opacity',
          }}
        />

      </div>
    </div>
  );
}
