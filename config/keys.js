const fs = require("fs");

module.exports = {
  PRIVATE_KEY: fs.readFileSync(__dirname + "/private.key", "utf8"),
  PUBLIC_KEY: fs.readFileSync(__dirname + "/public.key", "utf8"),
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
};
