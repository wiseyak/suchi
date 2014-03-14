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

 /*   var ENTER_KEY = 13;
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
            this.$todoList = this.$notebook.find('.todo-list');
        },
        bindEvents: function () {
            var list = this.$todoList;
            this.$notebook.on('keyup', '.new-todo', this.createNotePad.bind(this));
          //  this.$notebook.on('keyup', '.new-note', this.createNoteitem.bind(this));
            list.on('dblclick', 'label', this.editNote.bind(this));
            list.on('focusout', '.edit', this.updateNote.bind(this));
        },
        editNote: function (e) {
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
        },
        createNotePad: function (e){
            var $input = $(e.target);
            //console.log($input);
            var val = $input.val().trim();
            console.log(val);
            if (e.which !== ENTER_KEY || !val) {
                return;
            }

            var notepad_id = $input.closest('div.notepad').data('noteid');
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
            console.log(val);
            if (e.which !== ENTER_KEY || !val) {
                return;
            }
            $.ajax({
                type: "POST",
                url: "/notebook/new/:id",
                data: JSON.stringify({ content: val }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    $(this).removeClass("");
                }
            });
        }

    };*/

   // App.init();
});


$(document).ready(function(){
        $('#add_notebook').on("click", function(evt){
        var button = $(this);

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


        $('.header label').on('click',function(){

            var label = $(this);

            label.next('input').show();

            label.hide();
            
        });

         $('.view > input[type=text]').on('blur',function(){
         //   var ENTER_KEY = 13;
          //  var ESCAPE_KEY = 27;
            //var $input = $(e.target);
           // console.log($input.val());
          //  var val = $input.val().trim();
            //console.log(val);
           /* if (e.which !== ENTER_KEY || !val) {
                return;
            }*/
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

