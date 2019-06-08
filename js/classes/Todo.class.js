class Todo {
    constructor({ ref_id, title, body }) {
        if (title && body) {
            this.ref_id = ref_id;
            this.title = title;
            this.body = body;
            this.status = 1; //1 Open
        } else {
            return false;
        }
    }
}

export default Todo;