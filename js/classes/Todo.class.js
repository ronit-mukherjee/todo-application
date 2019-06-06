class Todo {
    constructor({ id, title, body }) {
        if (title && body) {
            this.id = id;
            this.title = title;
            this.body = body;
            this.status = 1; //1 Open
        } else {
            return false;
        }
    }
}

export default Todo;