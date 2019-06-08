module.exports = function (db) {
    const todoModel = require("./model")(db);

    class TodoController {
        constructor(model) {
            this.model = model;
        }

        add(data) {
            return new Promise((resolve, reject) => {
                try {
                    const todo = new this.model(data);


                    if (todo && todo.status && todo.status === 1) {
                        todo.save((err, r) => {
                            if (err !== null) {
                                resolve(false);
                            }

                            if (r) {
                                resolve(r);
                            }
                        })
                    } else {
                        resolve(false);
                    }
                } catch (e) {
                    return -1;
                }
            });
        }

        get(id = null) {
            return new Promise((resolve, reject) => {
                try {
                    this.model.getAllNonDeletedTodos((err, r) => {
                        if (err !== null) {
                            resolve(false);
                        }

                        if (r) {
                            resolve(r);
                        }
                    });
                } catch (e) {
                    return resolve(-1);
                }
            });
        }

        update(id = null, data) {
            return new Promise((resolve, reject) => {
                try {
                    if (!id || !data) {
                        resolve(false);
                    } else {
                        this.model.updateById(id, { title: data.title, body: data.body, status: data.status }, (err, r) => {
                            if (!err && r && r.nModified == 1) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                } catch (error) {
                    return -1;
                }
            });
        }

        delete(id = null) {
            return new Promise((resolve, reject) => {
                try {
                    if (!id) {
                        resolve(false);
                    } else {
                        this.model.deleteById(id, (err, r) => {
                            if (!err && r) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                } catch (error) {
                    return -1;
                }
            });
        }
    }

    return new TodoController(todoModel);
}