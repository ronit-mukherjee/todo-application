module.exports = {
    "db": {
        "host": "localhost",
        "port": 27017,
        "db": "todo_list"
    },
    "server": {
        "port": 3000
    },
    "response_status_codes": new Map([
        ['success', 100],
        ['failure', 101],
        ['db_query_failed', 102]
    ])
};