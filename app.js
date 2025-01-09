var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {connectDB} = require('./database/mongoDB');
require('dotenv').config()


var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')
const commonRouter = require('./routes/common')
const traningRouter = require('./routes/traning')




var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1/api/agent', usersRouter);
app.use('/v1/api/auth', authRouter);
app.use('/v1/api/common', commonRouter);
app.use('/v1/api/traning', traningRouter);




connectDB()
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
