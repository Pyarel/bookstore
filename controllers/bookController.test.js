const { createBook, updateBook, deleteBook } = require("./bookController"); // Adjust the path accordingly
const Book = require("../models/Book"); // Adjust the path accordingly

describe("createBook function", () => {
  test("should create a new book and return it", async () => {
    // Mock request and response objects
    const req = {
      body: {
        title: "Test Book",
        author: "Test Author",
        genre: "Test Genre",
        quantity: 10,
        price: 20,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Book model and its save method
    const mockSave = jest.fn().mockResolvedValue({ _id: "123", ...req.body });
    jest.spyOn(Book.prototype, "save").mockImplementationOnce(mockSave);

    // Call the createBook function
    await createBook(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: "123", ...req.body });
    expect(mockSave).toHaveBeenCalledWith();
  });

  test("should handle errors and return a 404 status with an error message", async () => {
    // Mock request and response objects
    const req = {
      body: {
        /* invalid data */
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Book model and its save method to throw an error
    const mockSave = jest
      .fn()
      .mockRejectedValue(new Error("Some error occurred"));
    jest.spyOn(Book.prototype, "save").mockImplementationOnce(mockSave);

    // Call the createBook function
    await createBook(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Some error occurred" });
    expect(mockSave).toHaveBeenCalledWith();
  });
});
describe("updateBook function", () => {
  test("should update the book and return the updated book", async () => {
    const bookId = "123";
    const req = { params: { id: bookId }, body: { quantity: 15, price: 25 } };
    const res = {
      json: jest.fn(),
    };

    const existingBook = {
      _id: bookId,
      quantity: 10,
      price: 20,
      save: jest.fn().mockResolvedValue({ _id: bookId, ...req.body }),
    };

    jest.spyOn(Book, "findById").mockResolvedValue(existingBook);

    await updateBook(req, res);

    expect(Book.findById).toHaveBeenCalledWith(bookId);
    expect(existingBook.save).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith({ _id: bookId, ...req.body });
  });

  test("should handle errors and return a 400 status with an error message", async () => {
    const bookId = "456";
    const req = {
      params: { id: bookId },
      body: {
        /* invalid data */
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest
      .spyOn(Book, "findById")
      .mockRejectedValue(new Error("Some error occurred"));

    await updateBook(req, res);

    expect(Book.findById).toHaveBeenCalledWith(bookId);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Some error occurred" });
  });
});
describe("deleteBook function", () => {
  test("should delete the book and return a success message", async () => {
    const bookId = "123";
    const req = { params: { id: bookId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const deletedBook = {
      _id: bookId,
    };

    jest.spyOn(Book, "findByIdAndDelete").mockResolvedValue(deletedBook);

    await deleteBook(req, res);

    expect(Book.findByIdAndDelete).toHaveBeenCalledWith(bookId);
    expect(res.json).toHaveBeenCalledWith({
      message: "Book deleted successfully",
    });
  });

  test("should handle book not found and return a 404 status with a message", async () => {
    const bookId = "456";
    const req = { params: { id: bookId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Book, "findByIdAndDelete").mockResolvedValue(null);

    await deleteBook(req, res);

    expect(Book.findByIdAndDelete).toHaveBeenCalledWith(bookId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
  });

  test("should handle errors and return a 500 status with an error message", async () => {
    const bookId = "789";
    const req = { params: { id: bookId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(Book, "findByIdAndDelete")
      .mockRejectedValue(new Error("Some error occurred"));

    await deleteBook(req, res);

    expect(Book.findByIdAndDelete).toHaveBeenCalledWith(bookId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Some error occurred" });
  });
});
