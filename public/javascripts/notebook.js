jQuery(function ($) {
    'use strict';

    Handlebars.registerHelper('dateFormat', function(context, block) {
        if (window.moment) {
            var f = block.hash.format || "MMM Do YYYY, h:mm a";
            return moment(Date(context)).format(f);
        }else{
            return context; // moment plugin not available. return data as is.
        };
    });

    Handlebars.registerHelper('fromNow', function(context, block) {
        if (window.moment) {
            var f = block.hash.format || "MMM Do YYYY, h:mm a";
            return moment(Date(context)).fromNow();
        }else{
            return context; // moment plugin not available. return data as is.
        };
    });

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    var App = {
        init: function () {
            this.cacheElements();
            this.bindEvents();
        },
        cacheElements: function () {
            this.$notebook = $('#notebook');
            this.$newNotePad = this.$notebook.find('.notepad.new .new-todo');
            this.$newNoteitem = this.$notebook.find('.notepad.new .new-note');
          //  this.$newadditem = this.$notebook.find('.notepad.new #add_item');
            this.$todoList = this.$notebook.find('.todo-list');
        },
        bindEvents: function () {
            var list = this.$todoList;
            this.$notebook.on('keyup', '.new-todo', this.createNotePad.bind(this));
            this.$notebook.on('keyup', '.new-note', this.createNoteitem.bind(this));
           // this.$notebook.on('click', '#add_item', this.addnoteitem.bind(this));
           /* list.on('dblclick', 'label', this.editNote.bind(this));
            list.on('focusout', '.edit', this.updateNote.bind(this));
            */
        },
       /* editNote: function (e) {
            var $input = $(e.target).closest('li').addClass('editing').find('.edit');
            $input.val($input.val()).focus();
        },
        updateNote: function (e) {
            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            this.renderNote();
        },
        renderNote: function () {
        },*/
        createNotePad: function (e){
            var $input = $(e.target);
            //console.log($input);
            var val = $input.val().trim();
           // console.log(val);
            if (e.which !== ENTER_KEY || !val) {

                return;
            }
            
            var notepad_id = $input.closest('div.notepad').data('noteid');
            var div_notepad_id = $input.closest('div.notepad');
           // console.log(div_notepad_id);
            console.log(div_notepad_id[0].attributes.id);
            $.ajax({
                type: "PUT",
                url: "/notebooktitle/edit",
                data: JSON.stringify({ title: val, id: notepad_id }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    $(this).removeClass("");
                }
            });
        },
        createNoteitem: function (e){
            var $input = $(e.target);
            //console.log($input);
            var val = $input.val().trim();
            //console.log(val);
            if (e.which !== ENTER_KEY || !val) {
              /*    var template = Handlebars.compile($("#notepad-new").html());
                var context = {padType: "new"};
                var html = template(context);
            
          //  $('input.new-todo').show();

            $('.new-note').prepend(html);*/
                return;
            }


            var notepad_id = $input.closest('div.notepad').data('noteid');
            $.ajax({
                type: "PUT",
                url: "/noteitem/"+ notepad_id,
                data: JSON.stringify({ title: val, id: notepad_id }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    $(this).removeClass("");
                }
            });
        }

      /*  addnoteitem: function(e){
        
        var $input = $(e.target);

        var div_notepad_id = $input.closest('div.notepad');
           
         var $add_item_btn =  $(div_notepad_id[0].attributes.id).find('#add_item');

         $add_item_btn.on('click',function(e){

           // alert(1);
           e.preventDefault();
           alert(2);

         });

        }*/


    };

    App.init();
});


$(document).ready(function(){


        $('#add_notebook').on("click", function(){
       // var button = $(this);
      // alert(1);
        $.ajax({
            url:'notebook/new',
            data:{},
            dataType:'json',
            type: 'POST'

        }).done(function(response){
            console.log(response);
            var noteid = response.id;
            var template = Handlebars.compile($("#notepad-new").html());
            var context = {noteDate: Date.now(), padType: "new", padId : noteid};
            var html = template(context);
            
            $('input.new-todo').show();

            $('#notebook').prepend(html);

        });

            return false;
        });

     //var a = 'add_item';
        $('#notebook #add_item').on("click",function(e){

           // e.preventDefault();
            //alert(1);
            var $input = $(e.target);
          //  console.log($input);
            var div_notepad_id = $input.closest('div.notepad');
            console.log(div_notepad_id);
           // console.log(div_notepad_id[0].attributes.id.value);
            var note_add = document.getElementById(div_notepad_id[0].attributes.id.value);
           // console.log(note_add);
            $(note_add).find('.notes > .todo-list').append('<input autofocus="" placeholder="Please enter a new Note." class = "new-note" />');
             
           //console.log($input);
          //  var $inputbox_input = $('.new-note');
           // var val = $inputbox_input.val().trim();
            //console.log(val);
           /* if (e.which !== 13 || !val) {
                //$('new-note').removeClass();
                return;
            }*/

    });

     $('#notebook #remove_notepad').on("click",function(e){    

        var $input = $(e.target);
        
        var notepad_remove_id = $input.closest('div.notepad');
        var notepad_id = notepad_remove_id.data('noteid');
        console.log($input.closest('div.notepad'));
       // console.log(notepad_id);

        var agree=confirm("Are you sure you want to delete?");
            if (agree){
                //console.log('yes');
            var notepad_remove = document.getElementById(notepad_remove_id[0].attributes.id.value);
            //console.log(note_remove);
           $(notepad_remove).remove();
            
            $.ajax({

                        url: 'notepad/remove/'+notepad_id ,
                        data: JSON.stringify({ id: notepad_id }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: 'DELETE',
                        success: function(data){
                            $(this).removeClass("");
                        }

                });

                
            }

            
            else
            return false ;
            




     });

    $('#notebook #remove_item').on("click",function(e){

           // e.preventDefault();
            //alert(1);
            var $input = $(e.target);
           // console.log($input);
            var div_noteitem_id = $input.closest('div.noteitem ');
            var notepad_id = $input.closest('div.notepad').data('noteid');
            console.log(notepad_id);
            var noteitem_id = div_noteitem_id.data('noteid');
            console.log(noteitem_id);

           // console.log(div_notepad_id[0].attributes.id.value);
            //document.getElementById(div_notepad_id[0].attributes.id.value).remove();


           // console.log(div_notepad_id[0].attributes.id.value);
            var note_remove = document.getElementById(div_noteitem_id[0].attributes.id.value);
            console.log(note_remove);
            $(note_remove).remove();



          $.ajax({

                url: 'noteitem/remove/'+ notepad_id ,
                data: JSON.stringify({ id: noteitem_id }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: 'DELETE',
                success: function(data){
                  //  $(this).removeClass("");
                }

            });
          

    });

    $('.noteitem label').on('click',function(e){

       
        var label = $(this);

            label.next('input').show();

            label.hide();

       
    });

    $('.noteitem input[type=text]').on('blur',function(){

            var inputbox =  $(this);

            inputbox.prev('label').show();
           // inputbox.prev('#remove_item').show();
            inputbox.prev('label').text(inputbox.val());
            console.log(inputbox.val());

            inputbox.hide();  

            var notepad_id = $(this).parents('div.notepad').data('noteid');
           // console.log(notepad_id);

            var noteitem_id = $(this).parents('div.noteitem').data('noteid');
           // console.log(noteitem_id);

           $.ajax({
                url:'noteitem/edit/'+ notepad_id,
                data:{title:inputbox.val(),id:noteitem_id},
                dataType:'json',
                type: 'PUT'

            }).done(function(response){
                //console.log(response);
                
            });

    });
         


        $('.header label').on('click',function(){

            var label = $(this);

            label.next('input').show();

            label.hide();
            
        });

         $('.view > input[type=text]').on('blur',function(){
         
            var inputbox =  $(this);

            inputbox.prev('label').show();
            inputbox.prev('label').text(inputbox.val());
            console.log(inputbox.val());

            inputbox.hide();  

            var notepad_id = $(this).parents('div.notepad').data('noteid');

            $.ajax({
                url:'notebooktitle/edit',
                data:{title:inputbox.val(),id:notepad_id},
                dataType:'json',
                type: 'PUT'

            }).done(function(response){
                //console.log(response);
            });
        });




    });

