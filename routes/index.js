const express = require("express");
const Router = express.Router;
const router = Router();
const glob = require("glob");

/**
 * options ignore files inside routes folder
 */
const options = {
  ignore: [`${__dirname}/index.js`],
};

/**
 * read all files on current directory and export routes as lowercase of the filename
 * example 'routes/users.routes' route will be access by '/users'
 */
const routes = glob
  .sync(__dirname + "/*.js", options)
  .map((filename) => {
    const arr = filename.split("/");
    let name = arr.pop();
    name = name.replace(".js", "");
    return {
      path: `/${name.toLowerCase()}`,
      router: require(`${filename.replace(".js", "")}`),
    };
  })
  .filter((obj) => Object.getPrototypeOf(obj.router) == Router)
  .forEach((obj) => router.use(obj.router));

module.exports = router;
