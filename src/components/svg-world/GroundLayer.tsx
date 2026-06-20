import { FC } from 'react';
import { WorldState } from './worldState';

interface GroundLayerProps {
  state: WorldState;
}

export const GroundLayer: FC<GroundLayerProps> = ({ state }) => {
  return (
    <>
      <rect x="0" y="200" width="400" height="12" fill={state.treeCount > 1 ? '#10B981' : '#854D0E'} />

      {state.treeCount >= 1 && (
        <g>
          <g transform="translate(15, 202)">
            <rect x="-2" y="-12" width="4" height="12" fill="#78350F" />
            {state.isWithered ? (
              <path d="M -5,-12 L 0,-20 L 5,-12 L -2,-12" fill="#92400E" />
            ) : (
              <circle cx="0" cy="-15" r="10" fill="#047857" />
            )}
          </g>

          {state.treeCount >= 2 && (
            <g transform="translate(34, 202)">
              <rect x="-1.5" y="-10" width="3" height="10" fill="#78350F" />
              {state.isWithered ? (
                <path d="M -4,-10 L 0,-18 L 4,-10 L -1.5,-10" fill="#92400E" />
              ) : (
                <circle cx="0" cy="-12" r="8" fill="#059669" />
              )}
            </g>
          )}

          {state.treeCount >= 3 && (
            <g transform="translate(70, 202)">
              <rect x="-2" y="-14" width="4" height="14" fill="#78350F" />
              <circle cx="0" cy="-16" r="11" fill="#047857" />
            </g>
          )}

          {state.treeCount >= 4 && (
            <g transform="translate(52, 202)">
              <rect x="-1" y="-8" width="2" height="8" fill="#78350F" />
              <circle cx="0" cy="-10" r="6" fill="#34D399" />
              <polygon points="0,-16 2,-12 6,-12 3,-10 4,-6 0,-8 -4,-6 -3,-10 -6,-12 -2,-12" fill="#FBBF24" />
            </g>
          )}
        </g>
      )}

      <rect x="0" y="210" width="400" height="30" fill="#475569" />
      <line x1="0" y1="225" x2="400" y2="225" stroke="#FFFFFF" strokeDasharray="15,15" strokeWidth="1.5" opacity="0.6" />

      {state.electricBus && (
        <g className="anim-bus-move" transform="translate(0, 212)">
          <rect x="0" y="0" width="32" height="12" fill="#10B981" rx="2" />
          <rect x="3" y="2" width="6" height="4" fill="#EFF6FF" />
          <rect x="11" y="2" width="6" height="4" fill="#EFF6FF" />
          <rect x="19" y="2" width="6" height="4" fill="#EFF6FF" />
          <circle cx="7" cy="12" r="3" fill="#1E293B" />
          <circle cx="25" cy="12" r="3" fill="#1E293B" />
          <rect x="26" y="2" width="4" height="4" fill="#60A5FA" />
        </g>
      )}

      {state.cyclist && (
        <g transform="translate(210, 224)" opacity="0.9">
          <circle cx="-6" cy="0" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="6" cy="0" r="3" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="-6,0 0,-5 6,0 0,0" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="0" cy="-9" r="2.5" fill="#E2E8F0" />
          <line x1="0" y1="-6.5" x2="0" y2="-1" stroke="#E2E8F0" strokeWidth="1.5" />
        </g>
      )}

      {state.trafficDensity === 'dense' && (
        <g className="anim-car-move" transform="translate(0, 214)">
          <g transform="translate(0, 0)">
            <rect x="0" y="2" width="18" height="8" fill="#EF4444" rx="1.5" />
            <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
            <circle cx="4" cy="10" r="2" fill="#000000" />
            <circle cx="14" cy="10" r="2" fill="#000000" />
          </g>
          <g transform="translate(50, 2)">
            <rect x="0" y="2" width="18" height="8" fill="#64748B" rx="1.5" />
            <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
            <circle cx="4" cy="10" r="2" fill="#000000" />
            <circle cx="14" cy="10" r="2" fill="#000000" />
          </g>
        </g>
      )}

      {state.trafficDensity === 'jam' && (
        <g transform="translate(0, 214)">
          <g transform="translate(10, 0)">
            <rect x="0" y="2" width="18" height="8" fill="#EF4444" rx="1.5" />
            <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
            <circle cx="4" cy="10" r="2" fill="#000000" />
            <circle cx="14" cy="10" r="2" fill="#000000" />
            <circle cx="-4" cy="6" r="2" fill="#B45309" opacity="0.6" className="anim-pulse-fast" />
          </g>
          <g transform="translate(45, 1)">
            <rect x="0" y="2" width="20" height="8" fill="#F59E0B" rx="1.5" />
            <rect x="5" y="0" width="11" height="5" fill="#1E293B" />
            <circle cx="5" cy="10" r="2" fill="#000000" />
            <circle cx="15" cy="10" r="2" fill="#000000" />
          </g>
          <g transform="translate(80, 0)">
            <rect x="0" y="2" width="18" height="8" fill="#94A3B8" rx="1.5" />
            <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
            <circle cx="4" cy="10" r="2" fill="#000000" />
            <circle cx="14" cy="10" r="2" fill="#000000" />
            <circle cx="-4" cy="6" r="2" fill="#B45309" opacity="0.6" className="anim-pulse-slow" />
          </g>
          <g transform="translate(115, 2)">
            <rect x="0" y="2" width="18" height="8" fill="#EF4444" rx="1.5" />
            <rect x="4" y="0" width="10" height="5" fill="#1E293B" />
            <circle cx="4" cy="10" r="2" fill="#000000" />
            <circle cx="14" cy="10" r="2" fill="#000000" />
          </g>
          <g transform="translate(150, 0)">
            <rect x="0" y="0" width="24" height="10" fill="#334155" rx="2" />
            <rect x="5" y="0" width="14" height="5" fill="#CBD5E1" />
            <circle cx="6" cy="10" r="2.5" fill="#000000" />
            <circle cx="18" cy="10" r="2.5" fill="#000000" />
          </g>
        </g>
      )}

      {state.trashPiles && (
        <g transform="translate(300, 222)">
          <rect x="0" y="4" width="12" height="8" fill="#B45309" />
          <line x1="0" y1="4" x2="12" y2="12" stroke="#78350F" strokeWidth="0.7" />
          <rect x="10" y="1" width="10" height="11" fill="#D97706" />
          <rect x="8" y="7" width="9" height="5" fill="#F59E0B" />
          <circle cx="23" cy="10" r="1.5" fill="#38BDF8" opacity="0.8" />
          <ellipse cx="26" cy="11" rx="2.5" ry="1" fill="#38BDF8" opacity="0.8" />
        </g>
      )}

      {state.recyclingBin && (
        <g transform="translate(330, 218)">
          <rect x="0" y="0" width="10" height="14" fill="#059669" rx="1" />
          <rect x="-1" y="-1" width="12" height="2" fill="#10B981" rx="0.5" />
          <polygon points="5,3 3,7 7,7" fill="#FFFFFF" opacity="0.7" />
          <rect x="14" y="2" width="9" height="12" fill="#2563EB" rx="1" />
          <rect x="13" y="1" width="11" height="2" fill="#3B82F6" rx="0.5" />
        </g>
      )}

      <rect x="0" y="238" width="400" height="2" fill="rgba(16, 185, 129, 0.2)" />
    </>
  );
};
