module.exports = db => {
    const Schema = db.getSchema();

    const todoSchema = new Schema({
        title: { type: String, required: true },
        body: { type: String, default: null },
        status: { type: Number, default: 1 }, //1: Todo 2: Done 3: Deleted  
        added_on: { type: Date, default: Date.now }
    });

    todoSchema.statics.getAllNonDeletedTodos = function (callback) {
        return this.find({ status: { $ne: 3 } }, callback);
    };

    todoSchema.statics.updateById = function (id, data, callback) {
        return this.updateOne({ _id: id }, data, null, callback);
    };

    todoSchema.statics.deleteById = function (id, callback) {
        return this.updateOne({ _id: id }, { status: 3 }, null, callback);
    };



    return todoSchema;
}