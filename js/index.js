import '../scss/index.scss';

import todoList from './classes/TodoList.class';

function initTodoList() {
    // Emmit event of fetch started
    const fetchingEvent = new CustomEvent("fetchingTodos")
    document.dispatchEvent(fetchingEvent);

    todoList.fetchTodosFromServer().then((r) => {
        // Emmit event of fetching success
        const fetchingSuccessEvent = new CustomEvent("fetchingTodosSuccess", { detail: { todos: r } })
        document.dispatchEvent(fetchingSuccessEvent);
    }).catch(([error]) => {
        // Emmit event of fetching failed
        const fetchingFailedEvent = new CustomEvent("fetchingTodosFailure")
        document.dispatchEvent(fetchingFailedEvent);

        console.error(error);
    })
}


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
    function deleteTodo(event) {
        const $elem = $(event.target);
        const $todoMainElem = $elem.parents("[data-id]")
        const todoId = $todoMainElem.data("id");

        const data = {
            id: todoId,
            title: $(".todo-title", $todoMainElem).text().trim(),
            body: $(".todo-body", $todoMainElem).text().trim(),
            status: 3
        };


        // Emmit event of updating
        const updatingTodo = new CustomEvent("deletingTodo", { detail: { todo: data } })
        document.dispatchEvent(updatingTodo);

        todoList.updateTodoById(todoId, data).then(() => {
            // Emmit event of update success
            const updatingTodoSuccess = new CustomEvent("deletingTodoSuccess", { detail: { todo: data } })
            document.dispatchEvent(updatingTodoSuccess);
        }).catch(([error]) => {
            // Emmit event of update failure
            const updatingTodoFailure = new CustomEvent("deletingTodoFailure", { detail: { todo: data } })
            document.dispatchEvent(updatingTodoFailure);

            console.error(error.message);
        });
    }

    $(document).on("click", selector, deleteTodo);
}

function initEventListeners(selector) {
    const todoTemplate = `
    <tr class="todo" data-id="">
        <td class="todo-srno"></td>
        <td class="todo-title"></td>
        <td class="todo-body"></td>
        <td class="todo-actions">
            <i class="fas fa-edit action-edit" title="Edit"></i>
            <i class="fas fa-check action-done" title="Mark Done"></i>
            <i class="fas fa-trash-alt action-delete" title="Delete"></i>
        </td>
    </tr>
    `;

    const $parentElement = $(selector);


    function onFetchingTodos(e) {
        $("#todo-list").addClass("loading");
    }
    function onFetchingTodosSuccess(e) {
        const todos = e.detail.todos;
        const $todosTable = $("#todo-list table tbody");

        const todoElements = todos.map(todo => {
            const $todoElem = $(todoTemplate);

            $todoElem.attr("data-id", todo.ref_id);

            $todoElem.children(".todo-title").text(todo.title);
            $todoElem.children(".todo-body").text(todo.body);

            if (todo.status == 2) {
                $todoElem.addClass("done");
            }

            return $todoElem[0].outerHTML;
        });

        $todosTable.append(todoElements);

        $("#todo-list").removeClass("loading");
    }
    function onFetchingTodosFailure(e) {
        $("#todo-list").removeClass("loading");
    }

    function onAddingTodo(e) {
        const todo = e.detail.todo;
        const $todoElem = $(todoTemplate);

        $todoElem.addClass("processing");
        $todoElem.attr("data-id", todo.ref_id);

        $todoElem.children(".todo-title").text(todo.title);
        $todoElem.children(".todo-body").text(todo.body);

        $parentElement.prepend($todoElem);

        $("#add-todo-form input").val("");
    }
    function onAddingTodoSuccess(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing");

        $todoElem.children(".todo-title").text(todo.title);
        $todoElem.children(".todo-body").text(todo.body);
    }
    function onAddingTodoFailure(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing");
        $todoElem.fadeOut(function () { this.remove(); })
    }
    function onUpdatingTodo(e) {
        const todo = e.detail.todo;

        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.addClass("processing");

        if (todo.status == 2) {
            $todoElem.addClass("done")
        }

        $todoElem.children(".todo-title").text(todo.title);
        $todoElem.children(".todo-body").text(todo.body);
    }
    function onUpdatingTodoSuccess(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing");
    }
    function onUpdatingTodoFailure(e) {
        const todo = e.detail.todo;
        console.log(todo);
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.removeClass("processing done");
    }
    function onDeletingTodoSuccess(e) {
        const todo = e.detail.todo;
        const $todoElem = $(`.todo[data-id='${todo.id}']`);

        $todoElem.fadeOut(function () { $(this).remove(); });
    }


    document.addEventListener("fetchingTodos", onFetchingTodos);
    document.addEventListener("fetchingTodosSuccess", onFetchingTodosSuccess);
    document.addEventListener("fetchingTodosFailure", onFetchingTodosFailure);


    document.addEventListener("addingTodo", onAddingTodo);
    document.addEventListener("addingTodoSuccess", onAddingTodoSuccess);
    document.addEventListener("addingTodoFailure", onAddingTodoFailure);
    document.addEventListener("updatingTodo", onUpdatingTodo);
    document.addEventListener("updatingTodoSuccess", onUpdatingTodoSuccess);
    document.addEventListener("updatingTodoFailure", onUpdatingTodoFailure);
    document.addEventListener("deletingTodo", onUpdatingTodo);
    document.addEventListener("deletingTodoSuccess", onDeletingTodoSuccess);
    document.addEventListener("deletingTodoFailure", onUpdatingTodoFailure);
}

$(document).ready(() => {
    initEventListeners("#todo-list .table tbody");

    initTodoList();
    initAddTodo("#add-todo-form", ".action-add-todo");
    initTodoDone(".todo .action-done");
    initTodoDelete(".todo .action-delete");
});