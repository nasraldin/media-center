module.exports = function validateLoginInput(data) {
  const validate = require("validate.js");
  let errors = {};

  if (validate.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }
  if (!validate.isString(data.username)) {
    errors.username = "Username is invalid";
  }

  if (validate.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: validate.isEmpty(errors),
  };
};
