export interface FloristProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  favoriteBloom: string;
  imageUrl: string;
  yearsWithStudio: number;
  specialties: string[];
}

export interface GrowerPartnership {
  id: string;
  farmName: string;
  location: string;
  specialty: string;
  distance: string;
  description: string;
  practices: string[];
  imageUrl: string;
}

export interface SustainabilityPillar {
  id: string;
  title: string;
  metric: string;
  description: string;
  detail: string;
}

export interface CraftsmanshipStep {
  step: number;
  title: string;
  tagline: string;
  description: string;
  detail: string;
}

export interface PressQuote {
  id: string;
  publication: string;
  quote: string;
  year: string;
  featuredArticle?: string;
}
