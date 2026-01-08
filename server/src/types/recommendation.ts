import { YelpBusiness } from "./yelp";

/**
 * RestaurantRecommendation extends YelpBusiness with computed/transient fields.
 * This is the "View Model" returned by the recommendation endpoint.
 * Do NOT save driving_time_minutes to the database - it's location-specific.
 */
export interface RestaurantRecommendation extends YelpBusiness {
    driving_time_minutes?: number;
}
