import React from 'react';

interface SimetriaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  useImage?: boolean;
}

export const SimetriaLogo: React.FC<SimetriaLogoProps> = ({
  className = '',
  size = 48,
  showText = true,
  useImage = true
}) => {
  if (useImage) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/logo-simetria.jpg"
          alt="Colégio Simetria"
          className="h-full w-full object-contain rounded-full shadow-sm"
          onError={(e) => {
            // Fallback to SVG if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Vector SVG Rendering of the Colégio Simetria Emblem
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: showText ? size * 1.15 : size }}
    >
      <svg
        viewBox="0 0 200 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <path
            id="simetria-text-path"
            d="M 25 180 A 90 90 0 0 0 175 180"
            fill="none"
          />
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Braided Rope Border Ring */}
        <circle
          cx="100"
          cy="95"
          r="86"
          stroke="#334155"
          strokeWidth="10"
          strokeDasharray="6 3"
          fill="#1e293b"
        />
        <circle
          cx="100"
          cy="95"
          r="80"
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* Vibrant Orange Inner Disc */}
        <circle
          cx="100"
          cy="95"
          r="76"
          fill="#F97316"
          filter="url(#shadow)"
        />

        {/* Open Book in Background */}
        <g transform="translate(42, 60) scale(0.9)" opacity="0.95">
          {/* Left Page */}
          <path
            d="M 65 65 C 45 55, 15 56, 5 62 L 18 10 C 28 8, 50 10, 65 20 Z"
            fill="#FFFFFF"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Page */}
          <path
            d="M 65 65 C 85 55, 115 56, 125 62 L 112 10 C 102 8, 80 10, 65 20 Z"
            fill="#F8FAFC"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Spine & Page Creases */}
          <path d="M 65 20 L 65 65" stroke="#0f172a" strokeWidth="3" />
          <path d="M 22 20 C 35 18, 52 20, 62 27" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M 20 30 C 35 28, 52 30, 62 37" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M 68 27 C 78 20, 95 18, 108 20" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M 68 37 C 78 30, 95 28, 108 30" stroke="#94A3B8" strokeWidth="1.5" />
        </g>

        {/* Monogram CS Letters (Intertwined Serif) */}
        {/* Letter C */}
        <text
          x="58"
          y="118"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="72"
          fontWeight="900"
          fill="#0F172A"
          stroke="#000000"
          strokeWidth="1.5"
        >
          C
        </text>

        {/* Letter S (Overlapping C) */}
        <text
          x="88"
          y="132"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="76"
          fontWeight="900"
          fill="#0F172A"
          stroke="#000000"
          strokeWidth="1.5"
        >
          S
        </text>

        {/* Arched text: COLÉGIO SIMETRIA */}
        {showText && (
          <text
            fill="#FFFFFF"
            fontSize="15"
            fontFamily="'Cinzel', Georgia, serif"
            fontWeight="bold"
            letterSpacing="2.5"
          >
            <textPath href="#simetria-text-path" startOffset="50%" textAnchor="middle">
              COLÉGIO SIMETRIA
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};
