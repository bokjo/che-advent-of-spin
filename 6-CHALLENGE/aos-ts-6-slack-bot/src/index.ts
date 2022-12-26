import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";
import queryString from "query-string";

// TODO: add index.ts to interfaces folder and export all interfaces from there
import { GeoLocationResponse, GeoLocation } from "./interfaces/geo";
import { ForecastResponse } from "./interfaces/forecast";
import { SlackWebhookPayload } from "./interfaces/slack";

const encoder = new TextEncoder();

interface WeatherRequest {
  location: string;
}

async function getGeoLocation(
  locationName: string
): Promise<GeoLocationResponse> {
  try {
    const response = await fetch(
      `${process.env.GEOSEARCH_API_URL}?name=${locationName}`,
      {
        headers: {
          "User-Agent": "CheAdventOfSpinWeatherBot",
        },
      }
    );
    const data = (await response.json()) as GeoLocation;

    if (!data.results || data?.results?.length === 0) {
      throw new Error(`No location found for ${locationName}`);
    }

    const { latitude, longitude, elevation } = data.results[0]; // TODO: temp poc!

    return { latitude, longitude, elevation };
  } catch (error) {
    throw new Error(`Error getting location for ${locationName}: ${error}`);
  }
}

async function getForecast(
  latitude: number,
  longitude: number,
  elevation: number
): Promise<ForecastResponse> {
  try {
    const forecastResp = await fetch(
      `${process.env.WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&altitude=${elevation}`,
      {
        headers: {
          "User-Agent": "CheAdventOfSpinWeatherBot",
        },
      }
    );

    const forecastData = (await forecastResp.json()) as ForecastResponse;

    return forecastData;
  } catch (error) {
    throw new Error(
      `Error getting forecast for ${latitude}, ${longitude}: ${error}`
    );
  }
}

async function parseSlackWebhookPayload(payload: string) {
  const parsed = queryString.parse(payload);
  return JSON.parse(JSON.stringify(parsed)) as SlackWebhookPayload;
}

export const handleRequest: HandleRequest = async function (
  request: HttpRequest
): Promise<HttpResponse> {
  console.log("Headers: ", JSON.stringify(request.headers));
  console.log("Body text: ", JSON.stringify(request.text()));

  if (request.headers["spin-path-info"] === "/") {
    return {
      status: 200,
      headers: { "content-type": "application/json" },
      body: encoder.encode(
        JSON.stringify({
          available_endpoints: [
            {
              path: "/weather",
              description: "Get weather forecast for a location",
              method: "POST",
            },
          ],
        })
      ).buffer,
    };
  }

  if (request.method !== "POST") {
    return {
      status: 405,
      headers: { "content-type": "text/plain" },
      body: encoder.encode("Method Not Allowed").buffer,
    };
  }

  if (request.headers["spin-path-info"] === "/weather") {
    try {
      const slackWebhookPayload = await parseSlackWebhookPayload(
        request.text()
      );
      const location = slackWebhookPayload.text; // TODO: sanitize input, check for empty string, trim whitespace, etc.

      if (!location) {
        return {
          status: 400,
          headers: { "content-type": "application/json" },
          body: encoder.encode(
            JSON.stringify({
              status: "Bad Request",
              message: "Please provide `location`",
              error: "Missing location",
            })
          ).buffer,
        };
      }

      const { latitude, longitude, elevation } = await getGeoLocation(location);

      const forecastData = await getForecast(latitude, longitude, elevation);

      const slackMessage = `Forecast for '${location}'\nTemperature: ${
        forecastData?.properties?.timeseries[0]?.data?.instant?.details
          ?.air_temperature ?? "N/A"
      }°C\nAir pressure: ${
        forecastData?.properties?.timeseries[0]?.data?.instant?.details
          ?.air_pressure_at_sea_level ?? "N/A"
      } hPa\nHumidity: ${
        forecastData?.properties?.timeseries[0]?.data?.instant?.details
          ?.relative_humidity ?? "N/A"
      } %\nWind speed: ${
        forecastData?.properties?.timeseries[0]?.data?.instant?.details
          ?.wind_speed ?? "N/A"
      } m/s\n\nTime: ${forecastData?.properties?.timeseries[0]?.time ?? "N/A"}`;

      const webhookResp = await fetch(`${process.env.SLACK_HOOK_WEATHER_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: slackMessage,
        }),
      });

      console.log(
        "[DEBUG] Slack webhook response: ",
        JSON.stringify(webhookResp)
      );

      return {
        status: 200,
        headers: { "content-type": "application/json" },
        body: encoder.encode(
          JSON.stringify({
            status: "Success",
            message: "Forecast sent to Slack",
            data: forecastData,
          })
        ).buffer,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        headers: { "content-type": "application/json" },
        body: encoder.encode(JSON.stringify({ error })).buffer,
      };
    }
  }

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: encoder.encode(
      JSON.stringify({ data: "TODO: this should not happen..." })
    ).buffer,
  };
};
