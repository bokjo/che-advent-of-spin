import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";

const encoder = new TextEncoder();

interface HelloResponse {
  message: string;
}

interface LowercaseResponse {
  message: string;
}

export const handleRequest: HandleRequest = async function (
  request: HttpRequest
): Promise<HttpResponse> {
  console.log("request: ", JSON.stringify(request));
  let value = "world";

  const headers = request.headers;
  const spinPathInfo = headers["spin-path-info"];
  const host = headers["host"];

  if (spinPathInfo !== "") {
    value = spinPathInfo.substring(1);
    // const dogFact = await fetch("http://some-random-api.ml/facts/dog", {
    //   mode: "no-cors",
    //   redirect: "follow",
    // });

    // const dogFactBody = await dogFact.text();

    // console.log("dogFactBody: ", dogFactBody);
    try {
      const resp = await fetch(`https://${host}/lowercase`, {
        method: "POST",
        // mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
        // redirect: "follow",
      });
      const lowercaseValue = (await resp.json()) as LowercaseResponse;
      console.log("lowercaseValue: ", lowercaseValue);
      value = lowercaseValue.message;
    } catch (error) {
      console.error(error);
    }
  }

  const response: HelloResponse = {
    message: `Hello, ${value}!`,
  };

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: encoder.encode(JSON.stringify(response)).buffer,
  };
};
