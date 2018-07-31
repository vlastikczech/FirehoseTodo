$(function() {


    // The taskHtml method takes in a JavaScript representation
    // of the task and produces an HTML representation using
    // <li> tags
    function taskHtml(task) {
        var checkedStatus = task.done ? "checked" : "";
        var liClass = task.done ? "completed" : "";
        var liElement = '<li id="listItem-' + task.id +'" class="' + liClass + '">' +
            '<div class="view"><input class="toggle" type="checkbox"' +
            " data-id='" + task.id + "'" +
            checkedStatus +
            '><label>' +
            task.title + '</label>'+'<button class="destroy"'  +
                    " data-id='" + task.id + "'" +
                    '></button>' +
        '</div></li>';

        return liElement;
    }

    // toggleTask takes in an HTML representation of
    // an event that fires from an HTML representation of
    // the toggle checkbox and  performs an API request to toggle
    // the value of the `done` field
    function toggleTask(e) {
        var itemId = $(e.target).data("id");

        var doneValue = Boolean($(e.target).is(':checked'));

        var uITodos = $.makeArray('.todo-list');


        $.post("/tasks/" + itemId, {
            _method: "PUT",
            task: {
                done: doneValue
            }
        }).success(function(data) {
            var liHtml = taskHtml(data);
            console.log(data.done)
            var $li = $("#listItem-" + data.id);
            $li.replaceWith(liHtml);
            $('.toggle').change(toggleTask);
            $('.destroy').click(deleteTask);

        } );
    }
    // deleteTask takes the data attribute
    // performs an API request to delete
    function deleteTask(e) {
        var itemId = $(e.target).data("id");


        $.post("/tasks/" + itemId, {
            _method: 'delete'
        }).success(function(data) {
            e.target.parentElement.remove()
        });
    }

    $.get("/tasks").success( function( data ) {
        var htmlString = "";

        $.each(data, function(index,  task) {
            htmlString += taskHtml(task);
        });
        var ulTodos = $('.todo-list');
        ulTodos.html(htmlString);

        $('.toggle').change(toggleTask);
        $('.destroy').click(deleteTask)

    });


    $('#new-form').submit(function(event) {
        event.preventDefault();
        var textbox = $('.new-todo');
        var payload = {
            task: {
                title: textbox.val()
            }
        };
        $.post("/tasks", payload).success(function(data){
            var htmlString = taskHtml(data);
            var uITodos = $('.todo-list');
            uITodos.append(htmlString);
            $('.toggle').click(toggleTask);
            $('.destroy').click(deleteTask);
            $('.new-todo').val('');
        });
    });

});