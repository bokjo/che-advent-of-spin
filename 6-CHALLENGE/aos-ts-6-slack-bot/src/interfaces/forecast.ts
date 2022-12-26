export interface ForecastResponse {
  geometry: PointGeometry;
  properties: Forecast;
  type: string; // "Feature";
}

interface PointGeometry {
  coordinates: number[]; //: [longitude, latitude, altitude]. All numbers in decimal.
  type: string; // "Point";
}

interface Forecast {
  meta: Metadata;
  timeseries: ForecastTimeStep[];
}

interface Metadata {
  units: ForecastUnits;
  updated_at: string; // Update time for this forecast
}

interface ForecastTimeStep {
  data: ForecastData; // Forecast for a specific time ,
  time: string; // The time these forecast values are valid for. Timestamp in format YYYY-MM-DDThh:mm:ssZ: ISO 8601)
}

interface ForecastUnits {
  air_pressure_at_sea_level?: string;
  air_temperature?: string;
  air_temperature_max?: string;
  air_temperature_min?: string;
  cloud_area_fraction?: string;
  cloud_area_fraction_high?: string;
  cloud_area_fraction_low?: string;
  cloud_area_fraction_medium?: string;
  dew_point_temperature?: string;
  fog_area_fraction?: string;
  precipitation_amount?: string;
  precipitation_amount_max?: string;
  precipitation_amount_min?: string;
  probability_of_precipitation?: string;
  probability_of_thunder?: string;
  relative_humidity?: string;
  ultraviolet_index_clear_sky_max?: string;
  wind_from_direction?: string;
  wind_speed?: string;
  wind_speed_of_gust?: string;
}

interface ForecastData {
  instant: InstantModel; // Parameters which applies to this exact point in time ,
  next_12_hours?: Next12HoursModel; // Parameters with validity times over twelve hours. Will not exist for all time steps. ,
  next_1_hours?: NextHourModel; // Parameters with validity times over one hour. Will not exist for all time steps. ,
  next_6_hours?: Next6HoursModel; // Parameters with validity times over six hours. Will not exist for all time steps.
}

interface InstantModel {
  details?: ForecastTimeInstant;
}

interface Next12HoursModel {
  details: ForecastTimePeriod;
  summary: ForecastSummary;
}

interface NextHourModel {
  details: ForecastTimePeriod;
  summary: ForecastSummary;
}

interface Next6HoursModel {
  details: ForecastTimePeriod;
  summary: ForecastSummary;
}

interface ForecastTimeInstant {
  air_pressure_at_sea_level?: number; // Air pressure at sea level ,
  air_temperature?: number; // Air temperature ,
  cloud_area_fraction?: number; // Amount of sky covered by clouds. ,
  cloud_area_fraction_high?: number; // Amount of sky covered by clouds at high elevation. ,
  cloud_area_fraction_low?: number; // Amount of sky covered by clouds at low elevation. ,
  cloud_area_fraction_medium?: number; // Amount of sky covered by clouds at medium elevation. ,
  dew_point_temperature?: number; // Dew point temperature at sea level ,
  fog_area_fraction?: number; // Amount of area covered by fog. ,
  relative_humidity?: number; // Amount of humidity in the air. ,
  wind_from_direction?: number; // The directon which moves towards ,
  wind_speed?: number; // Speed of wind ,
  wind_speed_of_gust?: number; // Speed of wind gust
}

interface ForecastTimePeriod {
  air_temperature_max?: number; //  Maximum air temperature in period ,
  air_temperature_min?: number; //  Minimum air temperature in period ,
  precipitation_amount?: number; //  Best estimate for amount of precipitation for this period ,
  precipitation_amount_max?: number; //  Maximum amount of precipitation for this period ,
  precipitation_amount_min?: number; //  Minimum amount of precipitation for this period ,
  probability_of_precipitation?: number; //  Probability of any precipitation coming for this period ,
  probability_of_thunder?: number; //  Probability of any thunder coming for this period ,
  ultraviolet_index_clear_sky_max?: number; //  Maximum ultraviolet index if sky is clear
}

interface ForecastSummary {
  //   symbol_code: WeatherSymbol;
  symbol_code: string; // TODO: temp!
}

// interface WeatherSymbol {}
