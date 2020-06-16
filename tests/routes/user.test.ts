import serverRunning from "../../src/app";
const request = require("supertest");

serverRunning.then(function(app) {

  describe("/api/user", () => {
    // beforeEach((done) => {
    //   app.on("serverInitialized", done);
    // });
  
    const userTests = (userRole: string) => {
      describe(`GET - ${userRole}`, () => {
        it(`should get all ${userRole}s`, async () => {
          const res = await request(app).get(`api/user/${userRole}`);
          expect(res).toBeDefined();
        });
  
        it(`should get ${userRole} by id`, () => {
          // TODO
        });
      });
  
      const methodTests = (method: "PATCH" | "DELETE") => {
        it(`should ${method} ${userRole} if authorized and id matches access-token`, () => {
          // TODO
        });
  
        it("should fail if not authorized", () => {
          // TODO
        });
  
        it("should fail if id doesn't match access-token", () => {
          // TODO
        });
      };
  
      describe(`PATCH - ${userRole}`, () => {
        methodTests("PATCH");
      });
  
      describe(`DELETE - ${userRole}`, () => {
        methodTests("DELETE");
      });
    };
  
    const userRoleEnpoints = ["student", "instructor", "school-official"];
    userRoleEnpoints.map(userTests);
  });
  
})
