module.exports = db => {
    const todoSchema = require("./schema")(db);
    const model = db.getModel();

    const todoModel = model("Todo", todoSchema);

    return todoModel;
}