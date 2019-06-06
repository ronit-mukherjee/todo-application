class Response {
    constructor(status = 1, message = "", data = null, statusCodeName = "SUCCESS") {
        //RESPONSE CODES
        const response_status_codes = new Map([
            ['SUCCESS', 100],
            ['FAILURE', 101],
            ['DB_QUERY_FAILURE', 102]
        ]);

        this.status = status;
        this.statusCode = response_status_codes.get(statusCodeName);

        if (message && message !== "") {
            this.message = message;
        }

        if (data && data !== null) {
            this.data = data;
        }
    }
}

module.exports = Response;