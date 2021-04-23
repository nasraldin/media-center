const router = require("express").Router();
const authController = require("../controllers/auth.controller");

const urlRoot = "/api/auth/";

router.get(`${urlRoot}check-auth`, authController.checkAuth);
router.post(`${urlRoot}register`, authController.register);
router.post(`${urlRoot}login`, authController.auth);

module.exports = router;
