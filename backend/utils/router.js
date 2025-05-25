const { sendResponse } = require("./functions");

class Router {
  constructor() {
    this.routes = [];
  }

  register(method, path, handler, middlewares = []) {
    const paramNames = [];
    const regexPath = path
      .split("/")
      .map((part) => {
        if (part.startsWith(":")) {
          paramNames.push(part.slice(1));
          return "([^/]+)";
        }
        return part;
      })
      .join("/");
    const regex = new RegExp(`^${regexPath}$`);
    method = method.toUpperCase();
    this.routes.push({ method, regex, paramNames, handler, middlewares });
  }

  async handle(req, res) {
    const { method, url } = req;
    for (const route of this.routes) {
      const match = url.match(route.regex);
      if (method == route.method && match) {
        const params = {};
        route.paramNames.forEach((name, idx) => {
          params[name] = match[idx + 1];
        });

        req.params = params;
        
        for (const mw of route.middlewares) {
          const proceed = await mw(req, res);
          if (!proceed) return;
        }
        return route.handler(req, res);
      }
    }
   return sendResponse(res, 404,{message: "Route Not Found"});
  }
}

module.exports = Router;
