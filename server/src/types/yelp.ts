// Define lightweight TypeScript types for external Yelp API data
// to ensure type safety, better autocomplete, and safer refactors.
export interface YelpBusiness {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  distance?: number;
}
