"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurants = void 0;
const yelpService_1 = require("../services/yelpService");
const getRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const results = yield (0, yelpService_1.searchRestaurants)({
            location: location,
            latitude: lat ? +lat : undefined,
            longitude: lng ? +lng : undefined,
            miles: miles ? +miles : undefined,
            cuisine: cuisine,
            price: priceLimit,
            index: +index,
        });
        return res.json(results);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Yelp fetch failed" });
    }
});
exports.getRestaurants = getRestaurants;
// Example:
// http://localhost:3000/api/yelp/restaurants?lat=34.0522&lng=-118.2437&miles=5&cuisine=korean&priceLimit=1,2&index=0
