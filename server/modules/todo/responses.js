const Response = require('../utility/response');

class TodoResponse {
    addSuccess(data) {
        return new Response(1, null, { id: data._id });
    }

    getSuccess(data) {
        return new Response(1, null, data);
    }

    success() {
        return new Response(1);
    }

    dbFailure() {
        return new Response(0,
            "DB Error: Operation failed.", null,
            'DB_QUERY_FAILURE'
        );
    }

    failure() {
        return new Response(0,
            "Server Error: Something went wrong.", null,
            'FAILURE'
        );
    }
}

module.exports = new TodoResponse();