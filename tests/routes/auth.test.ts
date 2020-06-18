import { EUserRoles } from "../../src/types";

describe("/api/auth", () => {
  const roleTests = (role: EUserRoles) => {
    describe(`POST - ${role}`, () => {
      it("should sign up if params are valid", () => {
        // TODO
      });

      it("should fail to sign up if params are invalid", () => {
        // TODO
      });

      it("should log in if params are valid", () => {
        // TODO
      });

      it("should fail to log in if user does not exist", () => {
        // TODO
      });

      it("should fail to log in if password is invalid", () => {
        // TODO
      });
    });
  };

  describe("GET", () => {
    it("should get user if token is valid", () => {
      // TODO
    });

    it("should fail to get user if token is invalid", () => {
      // TODO
    });
  });

  for (let [key, value] of Object.entries(EUserRoles)) {
    roleTests(value);
  }
});
