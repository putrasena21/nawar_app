const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();

const responseHelper = require("./helpers/response.helper");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/image", express.static("public/uploads"));
app.use(responseHelper);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(require("./swagger-nawar-app.json"))
);

app.use("/api/v1", indexRouter);

app.use((err, req, res, next) => {
  res.serverError(err.message);
});

module.exports = app;
