// const { startTransition, StrictMode } = require("react");

const { React } = require("react");
const { RemixBrowser } = require("@remix-run/react");
const { hydrateRoot } = require("react-dom/client");

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <RemixBrowser />
      </React.StrictMode>
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
