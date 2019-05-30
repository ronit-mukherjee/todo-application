
// Function to set the necessaary router for todos module
function todoRoutes(express, db) {
    const router = express.Router();
    const todoCntrl = require("./controller")(db);
    const todoResponse = require("./responses");

    router.get("/", async (req, res) => {
        const todos = await todoCntrl.get();

        if (todos === false) {
            res.json(todoResponse.dbFailure());
        } else if (todos === -1) {
            res.json(todoResponse.failure());
        } else {
            res.json(todoResponse.getSuccess(todos));
        }
    });

    router.post("/", async (req, res) => {
        const todoAdded = await todoCntrl.add(req.body);

        if (todoAdded === false) {
            res.json(todoResponse.dbFailure());
        } else if (todoAdded === -1) {
            res.json(todoResponse.failure());
        } else {
            res.json(todoResponse.addSuccess(todoAdded));
        }
    });

    router.put("/:id", async (req, res) => {
        const todoUpdated = await todoCntrl.update(req.params.id, req.body);

        if (todoUpdated === false) {
            res.json(todoResponse.dbFailure());
        } else if (todoUpdated === -1) {
            res.json(todoResponse.failure());
        } else {
            res.json(todoResponse.success());
        }
    });

    router.delete("/:id", async (req, res) => {
        const todoDeleted = await todoCntrl.delete(req.params.id);

        if (todoDeleted === false) {
            res.json(todoResponse.dbFailure());
        } else if (todoDeleted === -1) {
            res.json(todoResponse.failure());
        } else {
            res.json(todoResponse.success());
        }
    });
    return router;
}

module.exports = todoRoutes;