const router = require("express").Router();

const urlRoot = "/";

/* GET home page. */
router.get(urlRoot, function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
