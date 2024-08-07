var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require("./routes/catalog");

var app = express();

// set up mongoose connection
// ouyangzhengxuan uBhsb1uvdsNX4KAZ
// xdyang m6QT3XDs5hax
// mongodb+srv://xdyang:m6QT3XDs5hax@cluster0.zllplnp.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0
const mongoose = require("mongoose")
mongoose.set("strictQuery", false);
const dev_db_url = "mongodb+srv://xdyang:m6QT3XDs5hax@cluster0.zllplnp.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => {
  console.log("MongoDB connect error:")
  console.log(err)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 *1000, // 1 minute
  max: 20,
});
app.use(limiter);

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    }
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
