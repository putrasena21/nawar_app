const multer = require("multer");

const upload = multer({
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("Only png, jpg, and jpeg are allowed to upload!"));
    }
  },
  onError: (err, next) => {
    next(err);
  },
});

module.exports = upload;
