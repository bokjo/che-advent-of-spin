export interface GeoLocation {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    timezone: string;
    population: number;
    country_id: number;
    country: string;
    admin1: string;
  }>;
  generationtime_ms: number;
}

export interface GeoLocationResponse {
  latitude: number;
  longitude: number;
  elevation: number;
}
