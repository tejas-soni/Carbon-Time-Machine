import { ResultData } from '../types';

/** Base URL for sharing links. */
export const APP_LINK = 'https://carbontimemachine.tejassoni.in';

export function buildShareText(result: ResultData): string {
  const { archetype, futureMood, shiftedFutureMood, recommendedShift } = result;

  return `I visited my Carbon Time Machine! â³ðŸŒ²

My pattern: ${archetype}
My future risk: ${futureMood} City
My one shift: ${recommendedShift}
Shifted future: ${shiftedFutureMood} City

The future bends when the pattern changes.
Try yours: ${APP_LINK}
#CarbonTimeMachine #ClimateAwareness`;
}

export function buildSocialShareLinks(shareText: string) {
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(APP_LINK)}&title=${encodeURIComponent('Carbon Time Machine')}&summary=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_LINK)}&quote=${encodeURIComponent(shareText)}`,
  };
}
