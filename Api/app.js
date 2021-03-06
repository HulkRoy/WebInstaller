/* Set up */
var express = require('express');
var app = express();  // Create our app based on express
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var database = require('./config/database');  // Load the database config
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');  // Mongoose for mongodb
var path = require('path');

/* Connect to MongoDB */
mongoose.Promise = global.Promise;
mongoose.connect(database.localDB)
    .then(() => console.log('DB connection succesful'))
    .catch((err) => console.error(err));

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* Configuration */
app.use(cors());  // Enable CORS
app.use(express.static(path.join(__dirname, 'swagger')));  // Set the api document files location
app.use(favicon(path.join(__dirname, 'swagger/images', 'favicon.ico')));  // Set the favicon
app.use(logger('dev'));  // Log every request to the console
app.use(bodyParser.urlencoded({ 'extended': false })); // Parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // Parse application/vnd.api+json as json
app.use(cookieParser());

/* Router */
var application = require('./routes/application');
var applicationList = require('./routes/applicationList');
var customer = require('./routes/customer');
var context = require('./routes/context');
app.use('/', application);
app.use('/', applicationList);
app.use('/', customer);
app.use('/', context);

/* Catch 404 and forward to error handler */
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* Error handler */
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
