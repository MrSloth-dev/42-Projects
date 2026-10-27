import React from 'react';

/**
 * Editorial constellation map used on the landing page.
 * Pure SVG so it stays crisp and needs no assets.
 */
const CurriculumGraph: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 560 440"
    className={className}
    role="img"
    aria-label="Illustration of the curriculum as a connected graph of projects"
  >
    <defs>
      <pattern id="pn-dots" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="#dedede" />
      </pattern>
    </defs>

    <rect width="560" height="440" fill="url(#pn-dots)" opacity="0.65" />

    {/* Orbit rings */}
    <g fill="none">
      <circle cx="290" cy="222" r="58" stroke="#ebebeb" strokeWidth="1" />
      <circle cx="290" cy="222" r="108" stroke="#ebebeb" strokeWidth="1" />
      <circle cx="290" cy="222" r="158" stroke="#ebebeb" strokeWidth="1" />
      <circle
        cx="290"
        cy="222"
        r="133"
        stroke="var(--brand-magenta)"
        strokeOpacity="0.35"
        strokeDasharray="4 7"
      />
      <path d="M96 222H484" stroke="#ebebeb" strokeDasharray="3 6" />
      <path d="M290 40V404" stroke="#ebebeb" strokeDasharray="3 6" />
    </g>

    {/* Connections */}
    <g fill="none" strokeWidth="1.6" strokeLinecap="round">
      <path
        d="M136 150L214 112L366 128L446 186L414 320L258 342Z"
        stroke="var(--brand-cyan)"
        strokeOpacity="0.55"
      />
      <path
        d="M136 150L290 222L446 186"
        stroke="var(--brand-magenta)"
        strokeOpacity="0.55"
      />
      <path
        d="M214 112L290 222L414 320"
        stroke="var(--brand-magenta)"
        strokeOpacity="0.35"
      />
      <path
        d="M258 342L290 222L366 128"
        stroke="var(--brand-cyan)"
        strokeOpacity="0.4"
      />
    </g>

    {/* Nodes */}
    <g>
      <circle cx="290" cy="222" r="13" fill="#fff" stroke="#1a1c1c" strokeWidth="2" />
      <path d="M290 214L295 222L290 230L285 222Z" fill="var(--brand-magenta)" />

      <circle cx="136" cy="150" r="5" fill="var(--brand-cyan)" />
      <circle cx="214" cy="112" r="4.5" fill="var(--brand-magenta)" />
      <circle cx="366" cy="128" r="6" fill="var(--brand-magenta)" />
      <circle cx="446" cy="186" r="5" fill="var(--brand-cyan)" />
      <circle cx="414" cy="320" r="5.5" fill="var(--brand-magenta)" />
      <circle cx="258" cy="342" r="4.5" fill="var(--brand-cyan)" />
      <circle cx="482" cy="286" r="3.5" fill="var(--brand-magenta)" />
      <circle cx="290" cy="80" r="3" fill="var(--brand-cyan)" />
    </g>

    {/* Labels */}
    <g
      fontFamily="Geist, sans-serif"
      fontSize="9"
      fontWeight="600"
      letterSpacing="0.08em"
      fill="#9aa0a6"
    >
      <text x="360" y="66" textAnchor="end">
        COMMON CORE 0.0
      </text>
      <text x="118" y="136" textAnchor="middle">
        MINISHELL
      </text>
      <text x="380" y="114">
        FT_TRANSCENDENCE
      </text>
      <text x="432" y="340">
        WEBSERV
      </text>
      <text x="244" y="366" textAnchor="end">
        FT_IRC
      </text>
    </g>

    {/* Caption chip */}
    <g>
      <rect
        x="24"
        y="392"
        width="176"
        height="28"
        rx="14"
        fill="#f3f3f4"
      />
      <circle cx="40" cy="406" r="3" fill="var(--brand-cyan)" />
      <text
        x="52"
        y="409.5"
        fontFamily="Geist, sans-serif"
        fontSize="9"
        fontWeight="600"
        letterSpacing="0.08em"
        fill="#6b7280"
      >
        CURRICULUM GRAPH · V4.2
      </text>
    </g>
  </svg>
);

export default CurriculumGraph;
