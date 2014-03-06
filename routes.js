// routes.js

require ('./models/notepad');
var mongoose = require( 'mongoose' );
var NotePad     = mongoose.model( 'NotePad' );

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index', {user : req.user});
    });

    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/notebook',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { user : req.user, message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));


    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/notebook', isLoggedIn, function(req, res) {
        NotePad.find( function ( err, notepads, count ){
        res.render('notebook/index', {
            user : req.user,
            notepads: notepads
        });
      });

    });
    app.post('/notebook/new', isLoggedIn, function(req, res) {

        var notepad = new NotePad({
            user_id: req.user._id,
            name: req.body.title,
            date_created: Date.now(),
            date_updated: Date.now(),
            pinned: false,
            active: true
        }).save( function( err, notepad, count ){
            res.send(notepad);
        });
        //console.log(req);

    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}