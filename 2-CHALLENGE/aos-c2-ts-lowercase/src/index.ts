import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

interface Body {
  value: string;
}

export const handleRequest: HandleRequest = async function (
  request: HttpRequest
): Promise<HttpResponse> {
  const body = request.json() as Body;

  const response = {
    message: body.value.toLowerCase(),
  };

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: encoder.encode(JSON.stringify(response)).buffer,
  };
};
