const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  const saltRounds = 10;

  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const { username } = req.body;
  const condition = username ? { username: { [Op.eq]: `${username}` } } : null;

  User.findOne({ where: condition })
    .then(async (data) => {
      if (data) {
        return res.status(500).send({
          message: "username already registered.",
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

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

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const firstName = req.query.firstName;
  const condition = firstName
    ? { firstName: { [Op.like]: `%${firstName}%` } }
    : null;

  User.findAll({ where: condition })
    .then((data) => {
      let user = [];

      data.forEach((element) => {
        const us = {
          id: element.dataValues.id,
          firstName: element.dataValues.firstName,
          lastName: element.dataValues.lastName,
          username: element.dataValues.username,
          role: element.dataValues.role,
          dateOfBirth: element.dataValues.dateOfBirth,
        };

        user.push(us);
      });
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      console.log(num);
      // eslint-disable-next-line eqeqeq
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete User with id=" + id,
      });
    });
};
