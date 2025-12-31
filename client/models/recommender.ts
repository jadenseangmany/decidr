export type PriceCategory =
  | "Cheap"
  | "Moderate"
  | "Expensive"
  | "Very Expensive";

export interface RecommenderFilter {
  radius: number;
  price: PriceCategory;
  cuisine: string;
  latitude: number;
  longitude: number;
}
