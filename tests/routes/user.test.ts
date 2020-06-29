import { Server } from "http";
import request from "supertest";
import { Types } from "mongoose";
import initServer from "../../src/server";
import { userService } from "../../src/services";
import { Students } from "../../src/models";

const { ObjectId } = Types;
let server: Server;

describe("/api/user", () => {
    beforeEach(async () => {
        const app = await initServer();
        server = app.listen();
    });

    afterEach(async (done: () => void) => {
        await Students.deleteMany({});
        server.close(done);
    });

    describe("/student/", () => {
        it(`should get all students`, async () => {
            const student1 = {
                firstName: "John",
                lastName: "Doe",
                email: "jdoe@email.com",
                hash: "12345678",
                interests: ["interest"],
                meta: {
                    school: ObjectId(),
                },
            };
            const student2 = {
                ...student1,
                firstName: "Jane",
                email: "janed@email.com",
                interests: ["interest"],
            };
            const student3 = {
                ...student1,
                firstName: "Jack",
                email: "jackd@email.com",
                interests: ["interest"],
            };

            const res = await request(server).get(`/api/user/student`);
            expect(res.body.data).toHaveLength(3);
        });
    });
});
