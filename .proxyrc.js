const path = require("path");
const serveStatic = require("serve-static");

const assetsPath = path.join(__dirname, "public");
// Beware the leading `/` before the path!
const pathToServe = "/static";

module.exports = function (app) {
  app.use(pathToServe, serveStatic(assetsPath));

  // Optionally, serve more static assets from another folder.
  // app.use(pathToServe, serveStatic(anotherAssetsPath));
};
