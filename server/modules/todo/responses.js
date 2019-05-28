const config = require("../../config");
const responseStatusCodes = config.response_status_codes;

class Response {
    constructor(status = 1, message = "", data = null, statusCode = responseStatusCodes.get('success')) {
        this.status = status;
        this.statusCode = statusCode;

        if (message && message !== "") {
            this.message = message;
        }

        if (data && data !== null) {
            this.data = data;
        }
    }
}

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
            responseStatusCodes.get('db_query_failed')
        );
    }

    failure() {
        return new Response(0,
            "Server Error: Something went wrong.", null,
            responseStatusCodes.get('failure')
        );
    }
}

module.exports = new TodoResponse();