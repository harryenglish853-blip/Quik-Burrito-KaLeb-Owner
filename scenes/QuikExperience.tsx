'use client';

import React from 'react';
import { OpeningScene } from './OpeningScene';
import { IngredientScene } from './IngredientScene';
import { KitchenScene } from './KitchenScene';
import { BuildScene } from './BuildScene';
import { MenuShowcase } from './MenuShowcase';
import { BirriaScene } from './BirriaScene';
import { BreakfastScene } from './BreakfastScene';
import { DayScene } from './DayScene';
import { PeopleScene } from './PeopleScene';
import { ReviewsScene } from './ReviewsScene';
import { LocationsScene } from './LocationsScene';
import { OrderFinaleScene } from './OrderFinaleScene';
import { ClosingScene } from './ClosingScene';

/**
 * THE QUIK EXPERIENCE
 *
 * One continuous camera move through the food, the kitchen, the restaurant and
 * the people, ending on the order button. Each chapter is a scrubbed scene:
 * scroll forward and the camera moves forward, scroll back and it reverses,
 * stop and it settles.
 *
 * Every chapter is also a plain, readable section of HTML. Nothing on this page
 * waits for JavaScript, WebGL or a video to decode before the visitor can order.
 */
export function QuikExperience() {
  return (
    <>
      <OpeningScene />
      <IngredientScene />
      <KitchenScene />
      <BuildScene />
      <MenuShowcase />
      <BirriaScene />
      <BreakfastScene />
      <DayScene />
      <PeopleScene />
      <ReviewsScene />
      <LocationsScene />
      <OrderFinaleScene />
      <ClosingScene />
    </>
  );
}
