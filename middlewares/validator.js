const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is Missing"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid !"),
  check("mobile")
    .not()
    .isEmpty()
    .withMessage("Mobile No. is Missing")
    .matches(/^\d{10}$/)
    .withMessage("Mobile No. must be 10 digits"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is Missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(400).json({ error: errors[0].msg });
  }
  next();
};

exports.signInValidator = [
  check("username").normalizeEmail().isEmail().withMessage("Email is Invalid !"),
  check("password").trim().not().isEmpty().withMessage("Password is Missing")
]
