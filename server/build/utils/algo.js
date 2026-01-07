"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByWeightedRating = sortByWeightedRating;
function sortByWeightedRating(businesses, 
// This is the minimum number of reviews needed for a rating to be trusted.
minimumReviews = 100
//This function takes a list of YelpBusiness and returns a list of YelpBusiness, typescript
//needs to format it like this
) {
    if (businesses.length === 0)
        return [];
    // Calculate the average rating across all businesses,the baseline 
    // that keeps low-review restaurants from being ranked unfairly high or low.
    const averageRating = businesses.reduce((total, business) => {
        return total + business.rating;
    }, 0) / businesses.length;
    // Create a shallow copy so we don't mutate the original array
    // ...businesses is spread operator, copies all elements into new array
    return [...businesses].sort((a, b) => {
        // Business A values
        const reviewsA = a.review_count;
        const ratingA = a.rating;
        // Business B values
        const reviewsB = b.review_count;
        const ratingB = b.rating;
        // Weighted rating formula (balances rating vs number of reviews)
        const weightedA = (reviewsA / (reviewsA + minimumReviews)) * ratingA +
            (minimumReviews / (reviewsA + minimumReviews)) * averageRating;
        const weightedB = (reviewsB / (reviewsB + minimumReviews)) * ratingB +
            (minimumReviews / (reviewsB + minimumReviews)) * averageRating;
        // Sort descending (higher weighted rating first)
        return weightedB - weightedA;
    });
}
