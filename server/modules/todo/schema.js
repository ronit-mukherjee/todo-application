module.exports = db => {
    const Schema = db.getSchema();

    const todoSchema = new Schema({
        ref_id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        body: { type: String, default: null },
        status: { type: Number, default: 1 }, //1: Open 2: Done 3: Deleted  
        added_on: { type: Date, default: Date.now }
    });

    todoSchema.statics.getAllNonDeletedTodos = function (callback) {
        return this.find({ status: { $ne: 3 } }, null, { sort: { added_on: 'descending' } }, callback);
    };

    todoSchema.statics.updateById = function (id, data, callback) {
        console.log(id, data);
        return this.updateOne({ ref_id: id }, data, null, callback);
    };

    todoSchema.statics.deleteById = function (id, callback) {
        return this.updateOne({ ref_id: id }, { status: 3 }, null, callback);
    };



    return todoSchema;
}