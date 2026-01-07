import { Request, Response } from "express";
import { searchRestaurants } from "../services/yelpService";

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const {
      location,
      lat,
      lng,
      miles,
      cuisine,
      priceLimit,
    } = req.query;

    if (!location && (!lat || !lng)) {
      return res.status(400).json({
        error: "Provide either location OR lat/lng",
      });
    }

    const results = await searchRestaurants({
      location: location as string | undefined,
      latitude: lat ? Number(lat) : undefined,
      longitude: lng ? Number(lng) : undefined,
      miles: miles ? Number(miles) : undefined,
      cuisine: cuisine as string | undefined,
      price: priceLimit as string | undefined,
    });

    res.json(results);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Yelp fetch failed" });
  }
};
// good example to test: http://localhost:3000/api/yelp/restaurants?lat=34.0522&lng=-118.2437&miles=5&cuisine=korean&priceLimit=1,2
