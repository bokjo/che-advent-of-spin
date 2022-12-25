import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";

const encoder = new TextEncoder();

interface LatLong {
  lat: number;
  long: number;
}

interface Body {
  d1: LatLong;
  d2: LatLong;
}

function toRad(value: number) {
  // return (value * Math.PI) / 180;
  return value * 0.017453292519943295;
}

function haversineFormulaDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = (R * c) / 1.852; // for nautical miles divide by 1.852
  return parseFloat(d.toFixed(1));
  // return d;
}

export const handleRequest: HandleRequest = async function (
  request: HttpRequest
): Promise<HttpResponse> {
  const body = request.json() as Body;
  console.log("body", JSON.stringify(body));

  if (request.method !== "POST") {
    return {
      status: 405,
      headers: { "content-type": "application/json" },
      body: encoder.encode("Method not allowed").buffer,
    };
  }

  const res = {
    distance: haversineFormulaDistance(
      body.d1.lat,
      body.d1.long,
      body.d2.lat,
      body.d2.long
    ),
  };

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: encoder.encode(JSON.stringify(res)).buffer,
  };
};
