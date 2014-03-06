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
        },
        bindEvents: function () {
            this.$notebook.on('keyup', '.new-todo', this.createNotePad.bind(this));
        },
        render: function () {
        },
        createNotePad: function (e){
            var $input = $(e.target);
            //console.log($input);
            var val = $input.val().trim();
            console.log(val);
            if (e.which !== ENTER_KEY || !val) {
                return;
            }
            $.ajax({
                type: "POST",
                url: "/notebook/new",
                data: JSON.stringify({ title: val }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    $(this).removeClass("");
                }
            });
        }
    };

    App.init();
});


$(document).ready(function(){
    $('#add_notebook').on("click", function(evt){
        var template = Handlebars.compile($("#notepad-new").html());
        var context = {noteDate: Date.now(), padType: "new"};
        var html = template(context);
        $('#notebook').prepend(html);
        return false;
    });
});

