export interface YelpBusiness {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  distance?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  location?: {
    address1?: string;
    address2?: string;
    address3?: string;
    city?: string;
    state?: string;
    display_address?: string[];
  };
  price?: string;
  categories?: Array<{ title: string }>;
  image_url?: string;
  url?: string;
  is_closed?: boolean;
}
