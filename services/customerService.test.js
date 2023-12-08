// customerService.test.js
const customerService = require("../services/customerService");
const bcrypt = require("bcrypt");
const Customer = require("../models/Customer"); // Import the Customer model

describe("createCustomer function", () => {
  test("should create a new customer and save it to the database", async () => {
    const username = "testuser";
    const password = "testpassword";
    const hashedPassword = "hashedpassword"; // Replace with the expected hashed password

    // Mocking bcrypt hash function
    jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword);

    // Mocking the save method of the Customer model prototype
    const saveMock = jest
      .fn()
      .mockResolvedValue({ username, password: hashedPassword });
    Customer.prototype.save = saveMock;

    // Call the createCustomer function
    const result = await customerService.createCustomer(username, password);

    // Assertions
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual({ username, password: hashedPassword });
  });
});
