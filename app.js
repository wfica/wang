var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var debug = require("debug")("wang:server");
var favicon = require("serve-favicon");
var catalogRouter = require("./routes/catalog");

var app = express();
// serve favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// connect to db
var mongoose = require("mongoose");
var mongoDB =
  "mongodb://vang_admin:GCa32Xwr2pD5bSn@ds143614.mlab.com:43614/wang";
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
// db.on("error", debug("Mongo DB connection error:"));

// Express only serves static assets in production
debug(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
