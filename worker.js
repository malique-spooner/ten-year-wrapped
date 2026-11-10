export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prefix = "/wrapped";
    const strippedPath = url.pathname.slice(prefix.length) || "/";
    url.pathname = strippedPath.startsWith("/") ? strippedPath : "/" + strippedPath;

    const assetRequest = new Request(url, request);
    return env.ASSETS.fetch(assetRequest);
  },
};
