// app.js

var express  = require('express');
var ejs  = require('ejs');

var engine   = require('ejs-locals');
var app      = express();
var http     = require('http');
var path     = require('path');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var moment = require('moment');

var configDB = require('./config/database.js');


app.engine('ejs', engine);


mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

    // set up our express application
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(express.bodyParser()); // get information from html forms

    app.set('view engine', 'ejs'); // set up ejs for templating

    app.use(express.static(path.join(__dirname, 'public')));
    // required for passport
    app.use(express.session({ secret: 'E#S29y&62!@G8s%5' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

});

ejs.filters.fromNow = function(date){
  return moment(date).fromNow();
};

ejs.filters.dateFormat = function(date){
    var f = "MMM Do YYYY, h:mm a";
    return moment(date).format(f);
};

// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);