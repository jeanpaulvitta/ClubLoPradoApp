import React from "react";

export function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg 
      width="140" 
      height="140" 
      viewBox="0 0 140 140" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#EF4444", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#DC2626", stopOpacity: 1 }} />
        </linearGradient>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      <circle cx="70" cy="70" r="65" fill="url(#redGradient)" filter="url(#shadow)"/>
      
      <circle cx="70" cy="70" r="65" fill="none" stroke="#1F2937" strokeWidth="3"/>
      
      <g opacity="0.85">
        <path d="M20 35 Q27 30, 34 35 T48 35 Q55 30, 62 35 T76 35 Q83 30, 90 35 T104 35 Q111 30, 118 35" 
              stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        
        <path d="M20 45 Q27 40, 34 45 T48 45 Q55 40, 62 45 T76 45 Q83 40, 90 45 T104 45 Q111 40, 118 45" 
              stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
        
        <path d="M20 55 Q27 50, 34 55 T48 55 Q55 50, 62 55 T76 55 Q83 50, 90 55 T104 55 Q111 50, 118 55" 
              stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      </g>
      
      <g transform="translate(70, 68)">
        <ellipse cx="0" cy="0" rx="22" ry="9" fill="white" opacity="0.95"/>
        
        <circle cx="-8" cy="-3" r="5" fill="white"/>
        
        <path d="M0 0 L18 -5" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
        
        <path d="M-5 0 L-12 -8" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        
        <path d="M5 2 L10 8" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M0 2 L3 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      </g>
      
      <circle cx="35" cy="70" r="2" fill="white" opacity="0.6"/>
      <circle cx="40" cy="75" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="105" cy="65" r="2.5" fill="white" opacity="0.6"/>
      <circle cx="100" cy="72" r="1.8" fill="white" opacity="0.5"/>
      
      <text 
        x="70" 
        y="100" 
        fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif" 
        fontSize="15" 
        fontWeight="900" 
        fill="white" 
        textAnchor="middle"
        letterSpacing="0.5"
      >
        Natación
      </text>
      
      <text 
        x="70" 
        y="117" 
        fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif" 
        fontSize="18" 
        fontWeight="900" 
        fill="white" 
        textAnchor="middle"
        letterSpacing="2"
      >
        LPD
      </text>
      
      <line x1="45" y1="105" x2="95" y2="105" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  );
}
