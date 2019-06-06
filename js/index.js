import '../scss/index.scss';

import todoList from './classes/TodoList.class';


function initAddTodo(parentSelector, selector) {
    function addTodo() {
        //Create data
        const data = {
            id: Date.now(),
            title: $(`${parentSelector} [name='title']`).val().trim(),
            body: $(`${parentSelector} [name='body']`).val().trim()
        };


        // Emmit event  of adding
        const addingEvent = new CustomEvent("addingTodo", { detail: { todo: data } })
        document.dispatchEvent(addingEvent);

        todoList.addTodo(data).then(() => {
            // Emmit event of addingSuccess
            const addingEventSuccess = new CustomEvent("addingTodoSuccess", { detail: { todo: data } })
            document.dispatchEvent(addingEventSuccess);
        }).catch(error => {
            // Emmit event of adding
            const addingFailedEvent = new CustomEvent("addingTodoFailure", { detail: { todo: data } })
            document.dispatchEvent(addingFailedEvent);

            console.error(error);
        });
    }

    console.log($(selector))

    $(`${parentSelector} ${selector}`).on("click", addTodo);
}

function initTodoDone(selector) {
    function markTodoDone(event) {
        const $elem = $(event.target);
        const $todoMainElem = $elem.parents("[data-id]")
        const todoId = $todoMainElem.data("id");

        const data = {
            id: todoId,
            title: $(".todo-title", $todoMainElem).text().trim(),
            body: $(".todo-body", $todoMainElem).text().trim(),
            status: 2
        };


        // Emmit event of updating
        const updatingTodo = new CustomEvent("updatingTodo", { detail: { todo: data } })
        document.dispatchEvent(updatingTodo);

        todoList.updateTodoById(todoId, data)
            .then((todo) => {
                // Emmit event of update success
                const updatingTodoSuccess = new CustomEvent("updatingTodoSuccess", { detail: { todo } })
                document.dispatchEvent(updatingTodoSuccess);
            })
            .catch(([error, oldTodo]) => {
                setTimeout(() => {
                    // Emmit event of update failure
                    const updatingTodoFailure = new CustomEvent("updatingTodoFailure", { detail: { todo: oldTodo } })
                    document.dispatchEvent(updatingTodoFailure);

                    console.error(error.message);
                }, 1000);
            });
    }

    $(document).on("click", selector, markTodoDone);
}

function initTodoDelete(selector) {
    async function deleteTodo(event) {
        const $elem = $(event.target);
        const $todoMainElem = $elem.parents("[data-id]")
        const todoId = $todoMainElem.data("id");

        const data = {
            title: $(".todo-title", $todoMainElem).text().trim(),
            body: $(".todo-body", $todoMainElem).text().trim(),
            status: 3
        };

        try {
            // Emmit event of updating
            const updatingTodo = new CustomEvent("deletingTodo", { detail: { todo: data } })
            document.dispatchEvent(updatingTodo);

            await todoList.updateTodoById(todoId, data);

            // Emmit event of update success
            const updatingTodoSuccess = new CustomEvent("deletingTodoSuccess", { detail: { todo: data } })
            document.dispatchEvent(updatingTodoSuccess);
        } catch (error) {
            // Emmit event of update failure
            const updatingTodoFailure = new CustomEvent("deletingTodoFailure", { detail: { todo: data } })
            document.dispatchEvent(updatingTodoFailure);

            console.error(error.message);
        }
    }

    $(selector).on("click", deleteTodo);
}

function initEventListeners(selector) {
    const todoTemplate = `
    <tr class="todo" data-id="1">
        <td class="todo-srno"></td>
        <td class="todo-title">Cute you are</td>
        <td class="todo-body">Body</td>
        <td class="todo-actions">
            <i class="fas fa-edit action-edit" title="Edit"></i>
            <i class="fas fa-check action-done" title="Mark Done"></i>
            <i class="fas fa-trash-alt action-delete" title="Delete"></i>
        </td>
    </tr>
    `;

    const $parentElement = $(selector);

    function onAddingTodo(e) {
        const todo = e.detail.todo;
        const $todoElem = $(todoTemplate);

        $todoElem.addClass("processing");
        $todoElem.attr("data-id", todo.id);

        $todoElem.children(".todo-title").text(todo.title);
        $todoElem.children(".todo-body").text(todo.body);

        $parentElement.append($todoElem);
    };
    function onAddingTodoSuccess(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing");

        $todoElem.children(".todo-title").text(todo.title);
        $todoElem.children(".todo-body").text(todo.body);
    };
    function onAddingTodoFailure(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing");
        $todoElem.fadeOut(function () { this.remove(); })
    };
    function onUpdatingTodo(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);
        console.log(todo, $todoElem);
        $todoElem.addClass("processing");

        if (todo.status == 2) {
            $todoElem.addClass("done")
        }

        $todoElem.children(".todo-title").text(todo.title);
        $todoElem.children(".todo-body").text(todo.body);
    };
    function onUpdatingTodoSuccess(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing");
    };
    function onUpdatingTodoFailure(e) {
        console.log(e);
        const todo = e.detail.todo;
        console.log(todo);
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing");
    };
    function onDeletingTodo(e) { };
    function onDeletingTodoSuccess(e) { };
    function onDeletingTodoFailure(e) { };


    document.addEventListener("addingTodo", onAddingTodo);
    document.addEventListener("addingTodoSuccess", onAddingTodoSuccess);
    document.addEventListener("addingTodoFailure", onAddingTodoFailure);
    document.addEventListener("updatingTodo", onUpdatingTodo);
    document.addEventListener("updatingTodoSuccess", onUpdatingTodoSuccess);
    document.addEventListener("updatingTodoFailure", onUpdatingTodoFailure);
    document.addEventListener("deletingTodo", onDeletingTodo);
    document.addEventListener("deletingTodoSuccess", onDeletingTodoSuccess);
    document.addEventListener("deletingTodoFailure", onDeletingTodoFailure);
}

$(document).ready(() => {
    initAddTodo("#add-todo-form", ".action-add-todo");

    initTodoDone(".todo .action-done");

    initEventListeners("#todo-list .table tbody");
})