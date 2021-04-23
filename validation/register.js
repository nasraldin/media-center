module.exports = function validateRegisterInput(data) {
  const validate = require("validate.js");
  let errors = {};

  if (validate.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }
  if (!validate.isString(data.username)) {
    errors.username = "Username field is invalid";
  }

  if (validate.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (validate(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    errors,
    isValid: validate.isEmpty(errors),
  };
};
