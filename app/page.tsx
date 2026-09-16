import React from 'react';
import { QuikExperience } from '@/scenes/QuikExperience';
import { RestaurantSchema } from '@/components/StructuredData';
import { defaultLocation } from '@/data/locations';

export default function HomePage() {
  return (
    <>
      <RestaurantSchema location={defaultLocation} />
      <QuikExperience />
    </>
  );
}
