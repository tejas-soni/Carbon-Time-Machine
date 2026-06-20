import { ResultData } from '../types';

const BASE_YEAR = 2026;
const MID_YEAR_START = 2029;
const MID_YEAR_END = 2033;

export function getTimelineDescription(
  result: ResultData,
  timeline: 'A' | 'B',
  year: number,
): string {
  const { archetype, totalCo2e, futureMood, recommendedShift, shiftedCo2e, shiftedFutureMood } = result;
  const isMidFuture = year >= MID_YEAR_START && year < MID_YEAR_END;

  if (timeline === 'A') {
    if (year === BASE_YEAR) {
      return `Present Day. Your lifestyle habits are generating a footprint of ${totalCo2e.toLocaleString()} kg CO2e/year. The baseline city experiences moderate traffic, average cooling loads, and typical landfill stress.`;
    }

    if (futureMood === 'Restoring' || futureMood === 'Balanced') {
      return `Year ${year}. Your low-carbon lifestyle helps maintain a stable atmosphere. The city's visual footprint is light, public transit runs clean, and tree canopies remain healthy. Your timeline is steady.`;
    }

    const impactDescription =
      futureMood === 'Overheated'
        ? 'severe heat island domes, massive traffic blockages, and choking grey smog'
        : futureMood === 'Stressed'
          ? 'heavy utility loads, notable haze, and cardboard/plastic waste piles'
          : 'rising grid stress, noticeable temperature spikes, and fewer green spots';

    if (isMidFuture) {
      return `Year ${year}. As your ${archetype.toLowerCase()} habits continue, carbon effects compile. The city experiences early signs of ${impactDescription}. The timeline is starting to harden.`;
    }

    return `Year ${year}. A decade of unchanged habits. The city is locked into a ${futureMood.toLowerCase()} state, defined by ${impactDescription}. Total emissions continue at ${totalCo2e.toLocaleString()} kg/year.`;
  }

  if (year === BASE_YEAR) {
    return `Pledge Day. You start making your one habit shift: "${recommendedShift}". Your baseline carbon footprint drops instantly by ${Math.round(totalCo2e - shiftedCo2e)} kg CO2e/year. The timeline starts bending.`;
  }

  if (isMidFuture) {
    return `Year ${year}. By swapping just one repeating habit, you've saved thousands of kilograms of carbon over the years. The grid is relaxed, new public transit is introduced, and trees are flourishing.`;
  }

  const moodImprovementText =
    shiftedFutureMood === 'Restoring'
      ? 'fully clean skies, thriving urban gardens, and active cyclist lanes'
      : shiftedFutureMood === 'Balanced'
        ? 'stable summer cooling grids, clear air, and organized recycling programs'
        : 'a significantly reduced heat burden and cleaner traffic conditions compared to the unchanged path';

  return `Year ${year}. The cumulative bending of your timeline. By sticking to your shift, your year-over-year footprint stays at a lower ${shiftedCo2e.toLocaleString()} kg CO2e/year, paving the way for ${moodImprovementText}.`;
}
