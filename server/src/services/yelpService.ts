import axios from "axios";
import type { YelpBusiness } from "../types/yelp";
import { sortByWeightedRating } from "../utils/algo";

const YELP_URL = "https://api.yelp.com/v3/businesses/search";

const milesToMeters = (miles: number) =>
  Math.min(Math.floor(miles * 1609.34), 40000);

export const searchRestaurants = async ({
  location,
  latitude,
  longitude,
  miles,
  cuisine,
  price,
}: {
  location?: string;
  latitude?: number;
  longitude?: number;
  miles?: number;
  cuisine?: string; // e.g. "korean,mexican"
  price?: string;   // "1", "1,2", etc
}) => {
  const params: any = {
    categories: cuisine,
    price,
    limit: 50,
  };

  if (latitude && longitude) {
    params.latitude = latitude;
    params.longitude = longitude;
    if (miles) params.radius = milesToMeters(miles);
  } else if (location) {
    params.location = location;
  }

  const response = await axios.get(YELP_URL, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    params,
  });

  // Extract the businesses array from the Yelp response and assert its shape
  // So typescript expects those fields(safer)
  const businesses = response.data.businesses as YelpBusiness[];

  // Sort businesses using a weighted rating to account for review count
  const sortedBusinesses = sortByWeightedRating(businesses);

  //preserve Yelp response shape
  return {
    ...response.data,
    businesses: sortedBusinesses,
  };
};


