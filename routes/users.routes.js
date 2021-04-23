const router = require("express").Router();
const usersController = require("../controllers/users.controller");
const auth = require("../middleware/auth.middleware");

const urlRoot = "/users/";

router.post(urlRoot, auth, usersController.create);
router.get(urlRoot, auth, usersController.findAll);
router.get(`${urlRoot}:id`, auth, usersController.findOne);
router.put(`${urlRoot}:id`, auth, usersController.update);
router.delete(`${urlRoot}:id`, auth, usersController.delete);

module.exports = router;
