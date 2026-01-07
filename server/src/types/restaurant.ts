export interface VisitedRestaurant {
    restaurant_id: string;
    name: string;
    location: string;
    visited_at: Date;
    rating?: number;
    notes?: string;
}
