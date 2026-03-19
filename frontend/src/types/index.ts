export interface EventSearch {
  id: number;
  userQuery: string;
  venueName: string;
  location: string;
  estimatedCost: string;
  whyItFits: string;
  amenities: string[];
  createdAt: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
