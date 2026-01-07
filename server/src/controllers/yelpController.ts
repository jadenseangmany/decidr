import { Request, Response } from "express";
import { searchRestaurants } from "../services/yelpService";

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const { location, lat, lng, miles, cuisine, priceLimit, index } = req.query;

    if (!location && (!lat || !lng)) {
      return res.status(400).json({
        error: "location or (lat and lng together) is required",
      });
    }

    if (index == null) {
      return res.status(400).json({
        error: "index is required",
      });
    }

    const results = await searchRestaurants({
      location: location as string | undefined,
      latitude: lat ? +lat : undefined,
      longitude: lng ? +lng : undefined,
      miles: miles ? +miles : undefined,
      cuisine: cuisine as string | undefined,
      price: priceLimit as string | undefined,
      index: +index,
    });

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Yelp fetch failed" });
  }
};

// Example:
// http://localhost:3000/api/yelp/restaurants?lat=34.0522&lng=-118.2437&miles=5&cuisine=korean&priceLimit=1,2&index=0
