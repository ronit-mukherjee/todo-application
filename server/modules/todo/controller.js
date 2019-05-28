module.exports = function (db) {
    const todoModel = require("./model")(db);

    class TodoController {
        constructor(model) {
            this.model = model;
        }

        add(data) {
            try {
                return new Promise((resolve, reject) => {
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
                        console.log("waha");
                        resolve(false);
                    }
                });
            } catch (e) {
                return -1;
            }
        }

        get(id = null) {
            try {
                return new Promise((resolve, reject) => {
                    this.model.find({ status: { $ne: 3 } }, (err, r) => {
                        if (err !== null) {
                            resolve(false);
                        }

                        if (r) {
                            resolve(r);
                        }
                    });
                });
            } catch (e) {
                return -1;
            }
        }

        update(id = null, data) {
            try {
                return new Promise((resolve, reject) => {
                    if (!id || !data) {
                        resolve(false);
                    } else {
                        this.model.updateOne({ _id: id }, { title: data.title, body: data.body }, null, (err, r) => {
                            if (!err && r && r.nModified == 1) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                });
            } catch (error) {
                return -1;
            }
        }

        delete(id = null) {
            try {
                return new Promise((resolve, reject) => {
                    if (!id) {
                        resolve(false);
                    } else {
                        this.model.deleteOne({ _id: id }, (err, r) => {
                            if (!err && r) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                });
            } catch (error) {
                return -1;
            }
        }
    }

    return new TodoController(todoModel);
}