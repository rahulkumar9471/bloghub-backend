const { check, validationResult } = require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(400).json({ error: errors[0].msg });
  }
  next();
};

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is Missing"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid !"),
  check("mobile")
    .not()
    .isEmpty()
    .withMessage("Mobile No. is Missing")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid mobile number!"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is Missing")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long"),
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
];

exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is Invalid !"),
  check("password").trim().not().isEmpty().withMessage("Password is Missing")
]

exports.authorInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("Author name is Missing!"),
  check("about").trim().not().isEmpty().withMessage("About is Required field!"),
  check("gender").trim().not().isEmpty().withMessage("Gender is Required field!"),
]

exports.validateBlog = [
  check("title").trim().not().isEmpty().withMessage("Blog Title is Missing!"),
  check("description").trim().not().isEmpty().withMessage("Blog Description is Missing!"),
  check("publishDate").isDate().withMessage("Blog Publish Date is Missing!"),
  check("status").isIn(["public", "draft"]).withMessage("Blog status must be public or draft!"),
  check("type").trim().not().isEmpty().withMessage("Blog Type is Missing!"),
  check("genres").isArray().withMessage("Blog Genres must be an array!").custom((value) => {
    for (let g of value) {
      if (!genres.includes(g)) throw Error("Invalid Blog Genres");
    }
    return true;
  }),
  check("tags").isArray({ min: 1 }).withMessage("Tags must be an array of string!").custom((tags) => {
    for (let tag of tags) {
      if (typeof tag !== "string") throw Error("Tags must be an array of string!")
    }
    return true;
  }),
  check("cast").isArray().withMessage("Cast must be an array of objects!").custom((cast) => {
    for (let c of cast) {
      if (!isValidObjectId(c.author)) throw Error("Invalid cast id inside cast!");
      if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast!");
      if (typeof c.leadAuthor !== 'boolean') throw Error("Only accepted boolean value inside leadAuthor inside cast!");
    }
    return true;
  }),
  check("pdf").isObject().withMessage("PDF must be an object with url and public_id").custom(({ url, public_id }) => {
    try {
      const result = new URL(url);
      if (!result.protocol.includes('https')) throw Error("PDF URL is invalid");

      const arr = url.split('/');
      const publicId = arr[arr.length - 1].split('.')[0]

      if (public_id !== publicId) throw Error("PDF public_id is Invalid");

      return true;
    } catch (error) {
      throw Error("PDF URL is invalid");
    }
  }),
  // check("thumbnail").custom((_, { req }) => {
  //   if (!req.file) throw Error("Thumbnail is missing");
  //   return true;
  // })


]