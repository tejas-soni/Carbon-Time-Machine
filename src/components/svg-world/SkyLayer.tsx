import { FC } from 'react';
import { WorldState } from './worldState';

interface SkyLayerProps {
  state: WorldState;
  timeline: 'A' | 'B';
  year: number;
}

export const SkyLayer: FC<SkyLayerProps> = ({ state, timeline, year }) => {
  return (
    <>
      <defs>
        <linearGradient id={`skyGrad-${timeline}-${year}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={state.skyStart} />
          <stop offset="100%" stopColor={state.skyEnd} />
        </linearGradient>
        <radialGradient id="heatGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="240" fill={`url(#skyGrad-${timeline}-${year})`} />

      {state.opacityGlow > 0 && (
        <rect
          width="400"
          height="240"
          fill="url(#heatGlowGrad)"
          opacity={state.opacityGlow}
          className="svg-heat-glow"
        />
      )}

      <g opacity={state.opacityGlow > 0.4 ? 0.6 : 0.85} className="anim-cloud-float">
        <path
          d="M 30,60 A 15,15 0 0,1 60,60 A 20,20 0 0,1 95,65 A 15,15 0 0,1 110,80 L 25,80 Z"
          fill={state.opacityGlow > 0.3 ? '#94A3B8' : '#FFFFFF'}
        />
        <path
          d="M 230,40 A 10,10 0 0,1 250,40 A 15,15 0 0,1 275,45 A 10,10 0 0,1 285,55 L 225,55 Z"
          fill={state.opacityGlow > 0.3 ? '#8E9AA8' : '#FFFFFF'}
          opacity="0.8"
        />
      </g>

      {state.opacityGlow > 0.4 ? (
        <g>
          <circle cx="320" cy="60" r="30" fill="#EF4444" opacity="0.2" className="anim-pulse-fast" />
          <circle cx="320" cy="60" r="18" fill="#F59E0B" />
        </g>
      ) : (
        <circle cx="320" cy="60" r="16" fill="#FCD34D" />
      )}

      {state.windTurbine && (
        <g transform="translate(45, 120)">
          <path d="M -2,70 L 2,70 L 0.5,0 L -0.5,0 Z" fill="#94A3B8" />
          <g className="anim-spin-slow" transform="translate(0, 0)">
            <circle cx="0" cy="0" r="2" fill="#64748B" />
            <path d="M 0,0 L 0,-25 L 2,-25 L 1,0 Z" fill="#E2E8F0" />
            <path d="M 0,0 L 21,12 L 22,14 L 0,0 Z" fill="#E2E8F0" transform="rotate(120, 0, 0)" />
            <path d="M 0,0 L -21,12 L -22,14 L 0,0 Z" fill="#E2E8F0" transform="rotate(240, 0, 0)" />
          </g>
        </g>
      )}

      {state.chimneySmoke && (
        <g transform="translate(350, 100)">
          <rect x="-20" y="30" width="40" height="40" fill="#475569" />
          <rect x="-8" y="0" width="16" height="35" fill="#334155" />
          <rect x="-9" y="0" width="18" height="4" fill="#EF4444" />
          <circle cx="0" cy="-10" r="6" fill="#64748B" opacity="0.6" className="anim-pulse-fast" />
          <circle cx="8" cy="-22" r="9" fill="#475569" opacity="0.4" className="anim-pulse-slow" />
        </g>
      )}
    </>
  );
};
