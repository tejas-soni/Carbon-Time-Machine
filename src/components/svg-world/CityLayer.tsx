import { FC } from 'react';
import { WorldState } from './worldState';

interface CityLayerProps {
  state: WorldState;
}

export const CityLayer: FC<CityLayerProps> = ({ state }) => {
  return (
    <g>
      <rect x="90" y="100" width="45" height="110" fill="#3B82F6" opacity="0.85" />
      <rect x="150" y="70" width="60" height="140" fill="#1E3A8A" opacity="0.9" />
      <rect x="230" y="110" width="50" height="100" fill="#1D4ED8" opacity="0.85" />

      {state.solarPanels && (
        <g transform="translate(152, 60)">
          <polygon points="5,10 25,2 25,8 5,10" fill="#1E40AF" stroke="#60A5FA" strokeWidth="0.5" />
          <polygon points="30,10 50,2 50,8 30,10" fill="#1E40AF" stroke="#60A5FA" strokeWidth="0.5" />
        </g>
      )}

      <g fill={state.windowColor} className={state.windowPulse}>
        <rect x="97" y="115" width="8" height="8" />
        <rect x="115" y="115" width="8" height="8" />
        <rect x="97" y="135" width="8" height="8" />
        <rect x="115" y="135" width="8" height="8" />
        <rect x="97" y="155" width="8" height="8" />
        <rect x="115" y="155" width="8" height="8" />
        <rect x="97" y="175" width="8" height="8" />
        <rect x="115" y="175" width="8" height="8" />
      </g>

      <g fill={state.windowColor} className={state.windowPulse}>
        <rect x="160" y="85" width="10" height="10" />
        <rect x="185" y="85" width="10" height="10" />
        <rect x="160" y="110" width="10" height="10" />
        <rect x="185" y="110" width="10" height="10" />
        <rect x="160" y="135" width="10" height="10" />
        <rect x="185" y="135" width="10" height="10" />
        <rect x="160" y="160" width="10" height="10" />
        <rect x="185" y="160" width="10" height="10" />
      </g>

      <g fill={state.windowColor} className={state.windowPulse}>
        <rect x="240" y="125" width="8" height="8" />
        <rect x="260" y="125" width="8" height="8" />
        <rect x="240" y="145" width="8" height="8" />
        <rect x="260" y="145" width="8" height="8" />
        <rect x="240" y="165" width="8" height="8" />
        <rect x="260" y="165" width="8" height="8" />
      </g>
    </g>
  );
};
