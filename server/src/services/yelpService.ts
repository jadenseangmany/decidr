import axios from "axios";
import type { YelpBusiness } from "../types/yelp";
import { sortByWeightedRating } from "../utils/algo";

const YELP_URL = "https://api.yelp.com/v3/businesses/search";

const milesToMeters = (miles?: number) => {
  if (!miles) return;
  const meters = miles * 1609.34;
  return Math.min(Math.floor(meters), 40000);
};

type SearchRestaurantsArgs = {
  location?: string;
  latitude?: number;
  longitude?: number;
  miles?: number;
  cuisine?: string;
  price?: string;
  index: number;
};

export const searchRestaurants = async ({
  location,
  latitude,
  longitude,
  miles,
  cuisine,
  price,
  index,
}: SearchRestaurantsArgs) => {
  const params: Record<string, any> = {
    categories: cuisine,
    price,
    limit: 50,
  };

  if (latitude && longitude) {
    params.latitude = latitude;
    params.longitude = longitude;

    const radius = milesToMeters(miles);
    if (radius) {
      params.radius = radius;
    }
  } else if (location) {
    params.location = location;
  }

  const response = await axios.get(YELP_URL, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    params,
  });

  const businesses = response.data.businesses as YelpBusiness[];
  if (!businesses || businesses.length === 0) {
    return {
      ...response.data,
      businesses: null,
    };
  }

  const sortedBusinesses = sortByWeightedRating(businesses);

  // wrap index so callers don't need to care about bounds
  const safeIndex =
    ((index % sortedBusinesses.length) + sortedBusinesses.length) %
    sortedBusinesses.length;

  return {
    ...response.data,
    businesses: sortedBusinesses[safeIndex],
  };
};
