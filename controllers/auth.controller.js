const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  PRIVATE_KEY,
  PUBLIC_KEY,
  JWT_EXPIRATION_TIME,
} = require("../config/keys");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// register new user
exports.register = async (req, res) => {
  // Validate request
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  var condition = req.body.username
    ? { username: { [Op.eq]: `${req.body.username}` } }
    : null;

  User.findOne({ where: condition })
    .then(async (data) => {
      if (data) {
        return res.status(500).send({
          message: "username already registered.",
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create a User
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role,
        dateOfBirth: req.body.dateOfBirth,
      };

      // Save User in the database
      User.create(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};

exports.auth = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;

  User.findOne({ username: username })
    .then(async (data) => {
      if (!data) {
        return res.status(404).json({ usernameNotfound: "Username not found" });
      }

      bcrypt.compare(password, data.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: data.id,
            username: data.username,
            name: data.firstName,
            role: data.role,
          };
          console.log(Math.floor(Date.now() / 1000) + 60 * 60);

          // Token signing options
          const signOptions = {
            issuer: "Media Center",
            subject: "nasr2ldin@gmail.com",
            audience: "localhost",
            expiresIn: JWT_EXPIRATION_TIME,
            algorithm: "RS256",
          };

          const token = jwt.sign(payload, PRIVATE_KEY, signOptions);
          res.json({
            token,
            message: "success",
          });

          // res.cookie("token", token, { httpOnly: false }).send({
          //   token,
          //   payload: payload,
          //   message: "Login was successful",
          // });
        } else {
          return res
            .status(400)
            .json({ error: "Invalid username or password" });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
      res.status(401).send({
        message: err.message || "Incorrect email.",
      });
    });
};

// check user is authenticated
exports.checkAuth = (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("No token provided");
  } else {
    jwt.verify(token, PUBLIC_KEY, (err, decoded) => {
      console.log(decoded);
      if (err) {
        res.status(401).send(err + "Unauthorized user");
      } else {
        res.send("Authenticated");
      }
    });
  }
};
