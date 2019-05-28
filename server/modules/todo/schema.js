module.exports = db => {
    const Schema = db.getSchema();

    const todoSchema = new Schema({
        title: { type: String, required: true },
        body: { type: String, default: null },
        status: { type: Number, default: 1 }, //1: Todo 2: Done 3: Deleted  
        added_on: { type: Date, default: Date.now }
    });

    return todoSchema;
}