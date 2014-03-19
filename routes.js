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
          //  console.dir(notepads[0].note);
        res.render('notebook/index', {
            user : req.user,
            notepads: notepads
        });
      });

    });
    app.post('/notebook/new', isLoggedIn, function(req, res) {

        var notepad = new NotePad({
            user_id: req.user._id,
            //name: req.body.title,
            name :'new note',
            date_created: Date.now(),
            date_updated: Date.now(),
            pinned: false,
            active: true
        });

        /*notepad.findById(req.Notepad._id,function(err,notepad){
            var notes = notepad.note.create({
                content: req.body.content,
                complete: false
            });

            notepad.note.push(notes);

        });*/
        notepad.save( function( err ){
            //id 
           // if(err)console.dir(err);
            res.json({id: notepad._id});
        });
        //console.log(req);

    });

    
     app.put('/notebooktitle/edit', isLoggedIn, function(req, res) {

        var title = req.body.title;
        console.log(title);
     //   var notepad = new NotePad();

        NotePad.findOne({_id: req.body.id},function(err,notepad){



            console.dir(notepad);
            notepad.name = title;
           notepad.save(function(err) {
            if(err) throw err;
            res.send(notepad);
      });

        });
    });

    app.put('/noteitem/:id', isLoggedIn, function(req, res) {

        //var title = req.body.title;
        //console.log(title);
     //   var notepad = new NotePad();

        NotePad.findOne({_id: req.params.id},function(err,notepad){



            console.dir(notepad);

         //   notepad.note.content = req.body.title;
         //   notepad.note.complete = false;
            var notes = ({
                content: req.body.title,
                notepad_id: req.params.id,
                complete: false
            });
            notepad.note.push(notes);
           notepad.save(function(err) {
            if(err) throw err;
            res.send(notepad);
      });

        });
    });
        
app.put('/noteitem/edit/:id',isLoggedIn, function(req,res){
  var id = req.params.id;
  NotePad.findById(id, function(err, notepad){

    notepad.note.pull({_id: req.body.id});
     var notes = ({
                content: req.body.title,
                notepad_id: req.params.id,
                complete: false
            });
    notepad.note.push(notes);
      notepad.save(function(err) {
            if(err) throw err;
            res.send(notepad);
      });

  });

});

app.del('/notepad/remove/:id',isLoggedIn, function(req,res){
    var id = req.params.id;
    NotePad.findById(id, function(err, notepad) {
       // notepad.pull({_id: req.params.id});

      notepad.remove(function(err) {
        if(err) throw err;
    });
           notepad.save(function(err) {
            if(err) throw err;
            res.send(notepad);
          });

      });


});


app.del("/noteitem/remove/:id",isLoggedIn, function(req,res){
  var id = req.params.id;
  NotePad.findById(id, function(err, notepad) {
      
     notepad.note.pull({_id: req.body.id});

     // contact.remove(function(err) {
           notepad.save(function(err) {
            if(err) throw err;
            res.send(notepad);
      });

      });
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