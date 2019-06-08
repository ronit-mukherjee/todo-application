import Todo from "./Todo.class";
import axios from 'axios';

const apiUrl = "http://localhost:3001/api/todos";

class TodoList {
    constructor() {
        this._todos = [];
    }

    get todos() {
        return this._todos;
    }

    set todos(todo) {
        if (Array.isArray(todo)) {
            this._todos = todo;
        } else {
            this._todos.unshift(todo);
        }
    }

    /**
     * Function to update a todo by it's id
     * @param {*} todoId 
     * @param {*} data 
     */
    updateTodoById(todoId, data) {
        return new Promise(
            (resolve, reject) => {
                if (todoId && data) {
                    const index = this.todos.findIndex(element => element.ref_id == todoId);

                    if (index >= 0) {
                        const todo = this.todos[index];
                        const oldTodo = { ...todo };

                        todo.title = data.title;
                        todo.body = data.body;
                        todo.status = data.status;

                        axios.put(`${apiUrl}/${todoId}`, todo)
                            .then((r) => {
                                r = r.data;
                                if (r.status == 1 && r.statusCode == 100) {
                                    resolve(todo);
                                } else {
                                    reject([Error(r.message), oldTodo]);
                                }
                            })
                            .catch(error => {
                                reject([Error(error.message), oldTodo])
                            });
                    } else {
                        reject([Error("Todo with given id can't be found")]);
                    }
                } else {
                    reject([Error("Required data for updating a todo is not received")]);
                }
            }
        );
    }


    /**
     * Function to add a todo to the list
     * @param {*} data 
     */
    addTodo(data) {
        return new Promise((resolve, reject) => {
            if (data) {
                console.log(data);
                const todo = new Todo(data);
                console.log(todo);
                if (todo) {
                    this.todos = todo;

                    axios.post(apiUrl, todo)
                        .then((r) => {
                            r = r.data;
                            if (r.status == 1 && r.statusCode == 100) {
                                resolve(r);
                            } else {
                                reject([Error(r.message)]);
                            }
                        })
                        .catch(error => reject([Error(error.message)]));
                } else {
                    reject([Error("Todo can't be created")]);
                }
            } else {
                reject([Error("Required data to create Todo is not received")]);
            }
        });
    }


    /**
     * Function to delete a todo by given id
     * @param {*} todoId 
     */
    deleteTodo(todoId) {
        return new Promise((resolve, reject) => {
            if (todoId) {
                const index = this.todos.findIndex(element => element.ref_id == todoId);

                if (index >= 0) {
                    this.todos = this.todos.splice(index, 1);

                    axios.delete(`${apiUrl}/${todoId}`)
                        .then((r) => {
                            r = r.data;
                            if (r.status == 1 && r.statusCode == 100) {
                                resolve(todoId);
                            } else {
                                reject([Error(r.message)]);
                            }
                        })
                        .catch(error => reject([Error(error.message)]));


                }
                else {
                    reject([Error("Todo with given id cannot be found")])
                }
            }

            reject([Error("Todo id not received")]);
        });
    }


    fetchTodosFromServer() {
        return new Promise((resolve, reject) => {
            axios.get(`${apiUrl}`)
                .then((r) => {
                    r = r.data;
                    if (r.status == 1 && r.statusCode == 100) {
                        this.todos = r.data;
                        resolve(r.data);
                    } else {
                        reject([Error(r.message)]);
                    }
                })
                .catch(error => reject([Error(error.message)]));
        });
    }
}


export default new TodoList();