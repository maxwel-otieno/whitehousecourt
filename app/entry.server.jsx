const { PassThrough } = require("stream");
const { renderToPipeableStream } = require("react-dom/server");
const { RemixServer } = require("@remix-run/react");
const { Response } = require("@remix-run/node");

// import { PassThrough } from "stream";
// import { renderToPipeableStream } from "react-dom/server";
// import { RemixServer } from "@remix-run/react";
// import { Response } from "@remix-run/node";

const isbot = require("isbot");
// import isbot from "isbot";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]() {
          let body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );

          pipe(body);
        },
        onShellError(err) {
          reject(err);
        },
        onError(error) {
          didError = true;
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
