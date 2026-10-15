import { testData } from "./testData";

export const loginData = {
  validUser: {
    email: testData.validEmail,
    password: testData.validPassword,
  },
  invalidUser: {
    email: testData.invalidEmail,
    password: testData.invalidPassword,
  },
  wrongPasswordUser: {
    email: testData.validEmail,
    password: testData.wrongPassword,
  },
  emptyCredentials: {
    email: testData.emptyEmail,
    password: testData.emptyPassword,
  },
  invalidEmailFormat: {
    email: "invalid-email-format",
    password: testData.validPassword,
  },
};
