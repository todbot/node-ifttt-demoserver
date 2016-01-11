/**
 * Module dependencies.
 */
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');

var site = require('./site');
var oauth2 = require('./oauth2');
var user = require('./user');
var ifttt = require('./ifttt');
var util = require('util');


// Express configuration

// var app = express.createServer();
var app = express();
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.session({ secret: 'keyboard cat' }));
/*
app.use(function(req, res, next) {
  console.log('-- session --');
  console.dir(req.session);
  //console.log(util.inspect(req.session, true, 3));
  console.log('-------------');
  next()
});
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration

require('./auth');

// Middleware error handler for json response
function handleError(err,req,res,next){
    var output = {
        errors: [{
            name: err.name,
            message: err.message,
            text: err.toString()
        }]
    };
    var statusCode = err.status || 500;
    res.status(statusCode).json(output);
}
app.use(handleError);

app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

// app.get('/api/userinfo', user.info);

app.get('/ifttt/v1/user/info', ifttt.userinfo);

app.get('/ifttt/v1/status', ifttt.status);

app.post('/ifttt/v1/test/setup', ifttt.testsetup);

app.post('/ifttt/v1/actions/:action_slug', ifttt.actions);

app.listen(8080);
// app.listen(3000);
