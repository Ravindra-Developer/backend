import { expect } from "chai";
import sinon from "sinon";
import tasks from "../task/taskSchema.js";
import taskRoutes from "../task/taskRoutes.js";
import dotenv from "dotenv";




describe("Task Routes Tests", function () {
    let req, res, next;

    beforeEach(() => {
        req = { headers: { authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FmMDUwN2FmN2IwNDc1OTEwNTk3ZTMiLCJpYXQiOjE3Mzk3NDE0MTR9.N6yv1S0USh7TonnP0bJowqsmiJHGBzRnMdkBboDT7QI" }, body: {}, params: {}, query: {}, user: { userId: "12345" } };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        next = sinon.spy();
        dotenv.config();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("Create Task", function () {
        it("should create a task and return it", async function () {
            req.body = { title: "Test Task", description: "Test Description" };

            sinon.stub(tasks.prototype, "save").resolves({
                _id: "task123",
                title: "Test Task",
                description: "Test Description",
                userId: "12345",
            });

            const routeHandler = taskRoutes.stack.find(r => r.route.path === "/create").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.status.calledWith(201));
            expect(res.json.calledWithMatch({ title: "Test Task", userId: "12345" }));
        });
    });

    describe("Get My Tasks", function () {
        it("should return a list of tasks", async function () {
            req.query = {};

            const fakeTasks = [
                { _id: "task1", title: "Task 1", userId: "12345" },
                { _id: "task2", title: "Task 2", userId: "12345" },
            ];

            sinon.stub(tasks, "find").resolves(fakeTasks);

            const routeHandler = taskRoutes.stack.find(r => r.route.path === "/getMyTask").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.json.calledWith(fakeTasks));
        });

        it("should filter tasks by status", async function () {
            req.query = { status: "completed" };

            const fakeTasks = [{ _id: "task3", title: "Completed Task", userId: "12345", status: "completed" }];

            sinon.stub(tasks, "find").resolves(fakeTasks);

            const routeHandler = taskRoutes.stack.find(r => r.route.path === "/getMyTask").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.json.calledWith(fakeTasks));
        });
    });

    describe("Update Task", function () {
        it("should update a task and return it", async function () {
            req.params.id = "task123";
            req.body = { title: "Updated Task" };

            const updatedTask = { _id: "task123", title: "Updated Task", userId: "12345" };

            sinon.stub(tasks, "findOneAndUpdate").resolves(updatedTask);

            const routeHandler = taskRoutes.stack.find(r => r.route.path === "/update/:id").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.json.calledWith(updatedTask));
        });

        it("should return 404 if task is not found", async function () {
            req.params.id = "nonexistent";

            sinon.stub(tasks, "findOneAndUpdate").resolves(null);

            const routeHandler = taskRoutes.stack.find(r => r.route.path === "/update/:id").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.status.calledWith(404));
            expect(res.json.calledWith({ message: "Task not found" }));
        });
    });

    describe("Delete Task", function () {
        it("should delete a task and return success message", async function () {
            req.params.id = "task123";

            sinon.stub(tasks, "findOneAndDelete").resolves({ _id: "task123" });

            const routeHandler = taskRoutes.stack.find(r => r.route.path === "/delete/:id").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.json.calledWith({ message: "Task deleted" }));
        });

        it("should return 404 if task is not found", async function () {
            req.params.id = "nonexistent";

            sinon.stub(tasks, "findOneAndDelete").resolves(null);

            const routeHandler = taskRoutes.stack.find(r => r.route.path === "/delete/:id").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.status.calledWith(404));
            expect(res.json.calledWith({ message: "Task not found" }));
        });
    });
});
