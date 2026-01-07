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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRestaurants = void 0;
const axios_1 = __importDefault(require("axios"));
const algo_1 = require("../utils/algo");
const YELP_URL = "https://api.yelp.com/v3/businesses/search";
const milesToMeters = (miles) => {
    if (!miles)
        return;
    const meters = miles * 1609.34;
    return Math.min(Math.floor(meters), 40000);
};
const searchRestaurants = (_a) => __awaiter(void 0, [_a], void 0, function* ({ location, latitude, longitude, miles, cuisine, price, index, }) {
    const params = {
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
    }
    else if (location) {
        params.location = location;
    }
    const response = yield axios_1.default.get(YELP_URL, {
        headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
        },
        params,
    });
    const businesses = response.data.businesses;
    if (!businesses || businesses.length === 0) {
        return Object.assign(Object.assign({}, response.data), { businesses: null });
    }
    const sortedBusinesses = (0, algo_1.sortByWeightedRating)(businesses);
    // wrap index so callers don't need to care about bounds
    const safeIndex = ((index % sortedBusinesses.length) + sortedBusinesses.length) %
        sortedBusinesses.length;
    return Object.assign(Object.assign({}, response.data), { businesses: sortedBusinesses[safeIndex] });
});
exports.searchRestaurants = searchRestaurants;
