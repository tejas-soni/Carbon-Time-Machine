/**
 * @fileoverview Future self narrative templates.
 * Contains pre-written emotional letters from the user's 2050 future self,
 * customized by behavioral archetype for local (non-AI) generation.
 */

import { Archetype } from '../types';

/** Pre-written narrative letters from the user's future self, keyed by behavioral archetype. */
export const LOCAL_NOTES: Record<Archetype, string> = {
  'Convenience Commuter': `Dear Present Me,

I know your travel choices weren't about carelessness. They were about speed, comfort, and squeezing more hours into a busy day. But repeated short cab rides and car trips shape our future air and climate quietly.

The week you started replacing short rides with walking, cycling, or public transit, the city didn't transform overnight. But you broke the auto-pilot pattern. You showed that clean air is built one active choice at a time. 

Thank you for choosing to move differently.

— You, from 2050`,

  'Delivery Loop': `Dear Present Me,

I remember how sweet the convenience of food delivery was after a exhausting day. But packaging clutter and shipping emissions accumulate silently, one meal container at a time.

When you chose to cook at home and swap one delivery order for a low-packaging, plant-based meal, you did more than save carbon. You broke the passive convenience cycle and became mindful of what you consume. 

That single home-cooked meal was the point where the timeline started to bend.

— You, from 2050`,

  'Cooling Dependent Urbanite': `Dear Present Me,

I know how suffocating the heat can feel and how easy it is to set the AC to freezing temperatures. Home energy feels invisible, but the grid runs hot to keep us cold, warming the city air outside.

By raising your thermostat by 1°C and using natural cooling, you eased the burden on our grid. You showed that we can adapt without over-consuming. The air is slightly cooler and the grid more stable in my time because you adjusted yours.

— You, from 2050`,

  'High-Street Shopper': `Dear Present Me,

I remember the thrill of unboxing online deliveries and fast-fashion updates. But production, shipping, and fabric waste have a massive hidden cost behind the price tag.

The day you decided to delay an impulse purchase by 7 days, you took control. That pause helped you realize that many purchases are just temporary impulses. By slowing down your consumption, you helped slow down the global extraction cycle.

We have less clutter and a healthier planet because you paused.

— You, from 2050`,

  'Packaging Accumulator': `Dear Present Me,

Single-use packaging and plastics are everywhere, and throwing them away felt like a minor thing. But that trash doesn't disappear; it piles up in our soil and oceans for centuries.

By switching to reusable bags, keeping a bottle on hand, and organizing your recycling this week, you took responsibility for your physical trace. You stopped treating the earth as a disposable resource. 

That shift started a habit that keeps my future city clean and beautiful.

— You, from 2050`,

  'Quiet Saver': `Dear Present Me,

You were already living mindfully and keeping your footprint low. But the climate crisis isn't something we can solve in isolation. Personal conservation is just the first step.

The moment you shared your carbon journey and pledge with a friend, you amplified your impact. You started a conversation that turned individual care into collective action. The timeline bends when we stop hiding our green habits and start sharing them.

Thank you for leading by example.

— You, from 2050`
};

/**
 * Generates a future self narrative letter based on the user's behavioral archetype.
 * Used as the local (non-AI) fallback for the "Note From 2050" feature.
 * @param archetype - The user's identified behavioral archetype.
 * @returns A personalized letter from the user's future self.
 */
export function generateFutureNote(archetype: Archetype): string {
  return LOCAL_NOTES[archetype] || LOCAL_NOTES['Quiet Saver'];
}
