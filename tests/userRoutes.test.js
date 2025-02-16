import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../user/userSchema.js";
import usersRoutes from "../user/userRoutes.js";

describe('User Routes', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("Register User", function () {
        it("should register a user and return a token", async function () {
            req.body = { username: "testuser", password: "password123" };

            const fakeUser = { _id: "12345" };
            sinon.stub(users, "insertOne").resolves(fakeUser);
            sinon.stub(bcrypt, "hash").resolves("hashed-password");
            sinon.stub(jwt, "sign").returns("fake-jwt-token");

            const routeHandler = usersRoutes.stack.find(r => r.route.path === "/register").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ message: "User registered", token: "fake-jwt-token" })).to.be.true;
        });

        it("should return 400 if username already exists", async function () {
            req.body = { username: "existinguser", password: "password123" };

            sinon.stub(users, "insertOne").throws(new Error("Username already exists"));

            const routeHandler = usersRoutes.stack.find(r => r.route.path === "/register").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Username already exists" })).to.be.true;
        });
    });

    describe("Login User", function () {
        it("should log in a user and return a token", async function () {
            req.body = { username: "testuser", password: "password123" };

            const fakeUser = { _id: "12345", password: "hashed-password" };
            sinon.stub(users, "findOne").resolves(fakeUser);
            sinon.stub(bcrypt, "compare").resolves(true);
            sinon.stub(jwt, "sign").returns("fake-jwt-token");

            const routeHandler = usersRoutes.stack.find(r => r.route.path === "/login").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.json.calledWith({ token: "fake-jwt-token" })).to.be.true;
        });

        it("should return 401 for invalid credentials", async function () {
            req.body = { username: "testuser", password: "wrongpassword" };

            sinon.stub(users, "findOne").resolves({ password: "hashed-password" });
            sinon.stub(bcrypt, "compare").resolves(false);

            const routeHandler = usersRoutes.stack.find(r => r.route.path === "/login").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid credentials" })).to.be.true;
        });

        it("should return 401 if user does not exist", async function () {
            req.body = { username: "nonexistentuser", password: "password123" };

            sinon.stub(users, "findOne").resolves(null);

            const routeHandler = usersRoutes.stack.find(r => r.route.path === "/login").route.stack[0].handle;
            await routeHandler(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid credentials" })).to.be.true;
        });
    });

});