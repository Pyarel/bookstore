// Function to check if the user is authenticated
function checkAuthentication() {
  // Get all cookies and split them into an array
  const cookies = document.cookie.split(";");

  // Loop through the cookies to find the isAuthenticated property
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");

    // Check if the cookie has the isAuthenticated property set to true
    if (name === "isAuthenticated" && value === "true") {
      // User is authenticated
      return true;
    }
  }

  // User is not authenticated
  return false;
}

const username = sessionStorage.getItem("username");
/*To display the addForm when add New book button is clicked.
         This function also gets the value of input field and sent to createBook()*/
async function showAddForm() {
  document.getElementById("AddFormDiv").style.display = "block";
  document
    .getElementById("newBookForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = {
        title: document.getElementById("AddTitle").value,
        author: document.getElementById("AddAuthor").value,
        genre: document.getElementById("AddGenre").value,
        quantity: document.getElementById("AddQuantity").value,
        price: document.getElementById("AddPrice").value,
      };

      try {
        const createdBook = await createBook(formData);
        alert("Book added successfully");
      } catch (error) {
        console.error("error:", error.message);
      } finally {
        document.getElementById("AddFormDiv").style.display = "none";
        document.getElementById("newBookForm").reset();
        getAllBooks();
      }
    });
}

// Client Side JS Function to send POST request to server in order to create a book
async function createBook(formData) {
  // For Debbugging
  console.log(formData);
  const response = await fetch(`/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error(
      "Failed to Add book: ${response.status} ${response.statusText}"
    );
  }

  // received response
  const createdBook = await response.json();
  return createdBook;
}

// Client Side JS Function to send request to server in search of a book
async function searchBooks() {
  const searchCriteria = document.getElementById("search").value;
  const response = await fetch(`/api/books/search?criteria=${searchCriteria}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const books = await response.json();
  console.log("in html data:", books);
  displayBook(books);
}

// Client Side JS Function to send request to server for all book details.
async function getAllBooks() {
  const response = await fetch(`/api/books/`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const books = await response.json();
  // For Debugging: console.log("All books: ", books);
  displayBook(books);
}

// Client Side JS Function to send a PUT request to server in order to update the selected book.
// Each Book entry has its own edit button. This edit button provided the bookId for the particualr book.
async function updateBook(bookId, updatedValues) {
  const response = await fetch(`/api/books/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedValues),
  });

  if (!response.ok) {
    throw new Error(
      "Failed to update book: ${response.status} ${response.statusText}"
    );
  }
  const updatedBook = await response.json();
  return updatedBook;
}

// Client Side JS Function to send a DELETE request to server in order to delete the selected book.
// Each Book entry has its own delete button. This delete button determines which book has been selected for delete operation.
async function deleteBook(bookId) {
  try {
    const response = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        "Failed to delete book: ${response.status} ${response.statusText}"
      );
    }
    await response.json();
    getAllBooks();
  } catch (error) {
    console.log("Error deleting the book");
  }
}

// This function displays the details of all books from BookStore.books (from DB) to html page in table format
function displayBook(books) {
  // get the element by ID
  const booksTable = document.getElementById("booksTableDiv");
  booksTable.innerHTML = "";
  // If book details is fetched
  if (books.length > 0) {
    // create Table to display
    const table = document.createElement("table");

    // style table with bootstrap
    table.classList.add("table");

    // create Header Row element for table (tr)
    const headerRow = table.insertRow(0);
    const headers = [
      "Title",
      "Author",
      "Genre",
      "Quantity",
      "Price (in USD)",
      "Action",
      "Delete",
    ];

    // Creating th for each headers.
    headers.forEach((headerText) => {
      const header = document.createElement("th");

      // style header using bootStrap
      header.classList.add("table-dark");
      header.textContent = headerText;
      headerRow.appendChild(header);
    });

    //Populate the table with book details
    books.forEach((book) => {
      const row = table.insertRow();
      const cells = [
        book.title,
        book.author,
        book.genre,
        book.quantity,
        book.price,
      ];
      cells.forEach((cellText) => {
        const cell = row.insertCell();
        cell.textContent = cellText;
      });

      // Edit Form
      const EditForm = (book) => {
        const form = document.createElement("form");

        // create label for quantity
        const quantityLabel = document.createElement("label");
        quantityLabel.setAttribute("for", "quantity");
        quantityLabel.innerHTML = "Quantity";
        //create input field for quantity
        const quantityInput = document.createElement("input");
        quantityInput.type = "number"; // setting the input field type = "number"
        quantityInput.value = book.quantity; // Setting the existing value
        quantityInput.name = "quantity"; // setting the input field name = "quantity"
        quantityInput.id = "quantity"; // setting the id of this element to be used later in JavaScript
        quantityInput.min = 0; // minimum number allowed is zero
        quantityInput.max = book.stock; // maximum number allowed is stock
        quantityInput.step = 1; // step size is one
        quantityInput.required = true; // required field

        // create label for price
        const priceLabel = document.createElement("label");
        priceLabel.setAttribute("for", "price");
        priceLabel.innerHTML = "Price";
        //create input field for price
        const priceInput = document.createElement("input");
        priceInput.type = "number"; // setting the input field type = "number"
        priceInput.min = "0";
        priceInput.max = "1000";
        priceInput.step = "0.01";
        priceInput.value = book.price; // Setting the existing value
        priceInput.name = "price"; // setting the input field name = "price"

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Update";

        // Append input fields and submit button to form
        form.appendChild(quantityLabel);
        form.appendChild(quantityInput);
        form.appendChild(priceLabel);
        form.appendChild(priceInput);
        form.appendChild(submitButton);

        form.addEventListener("submit", async (event) => {
          event.preventDefault();

          // get the updated Values
          const updatedValues = {
            quantity: quantityInput.value,
            price: priceInput.value,
          };

          //Call the updateBook function with book ID and updated Values.
          try {
            const updatedBook = await updateBook(book._id, updatedValues);
            console.log("Book updated:", updatedBook);
            form.remove();
            getAllBooks();
          } catch (error) {
            console.error("Failed to update book");
          }
        });

        return form;
      };

      // Adding update Icon for each entry
      const updateIcon = document.createElement("i");
      updateIcon.classList.add("bi", "bi-pen-fill");
      // When clicked on updateIcon
      updateIcon.addEventListener("click", () => {
        console.log("Updated clicked for book:", book);
        const form = EditForm(book);
        const row = updateIcon.parentElement.parentElement; // accessing row element of the particular icon
        const cell = row.insertCell();
        cell.appendChild(form);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "btn-danger", "btn-sm");
      // When delete button is clicked
      deleteButton.addEventListener("click", () => {
        const confirmation = prompt(
          `Are you sure you want to delete Book : ${book.title} \nType yes to proceed.`
        );
        // if the choice is yes or YES or Yes it call the deleteBook function
        if (confirmation && confirmation.toLowerCase() === "yes") {
          deleteBook(book._id); // To Line: 245
        }
      });

      // Adding Add to Cart button for each entry
      const addToCartButton = document.createElement("button");
      addToCartButton.textContent = "Add to Cart";
      addToCartButton.classList.add("btn", "btn-success", "btn-sm");

      addToCartButton.addEventListener("click", () => {
        let cart = getCookie("cart");
        if (!cart) {
          document.cookie = `cart=${encodeURIComponent(book.title)}; path=/`;
          console.log(`${book.title} added to cart!`);
        } else {
          cart = decodeURIComponent(cart);
          const cartItems = cart.split(", ");
          if (!cartItems.includes(book.title)) {
            cart += `, ${book.title}`;
            document.cookie = `cart=${encodeURIComponent(cart)}; path=/`;
            console.log(`${book.title} added to cart!`);
          } else {
            console.log(`${book.title} is already in the cart!`);
          }
          console.log(`cookie value:` + cart);
        }
      });

      // Adding Delete button for each entry
      const rmvFromCart = document.createElement("button");
      rmvFromCart.textContent = "Remove From Cart";
      rmvFromCart.classList.add("btn", "btn-danger", "btn-sm");
      // When delete button is clicked
      rmvFromCart.addEventListener("click", () => {
        const confirmation = prompt(
          `Do you want to remove Book from cart : ${book.title} \nType yes to proceed.`
        );
        // if the choice is yes or YES or Yes it call the deleteBook function
        if (confirmation && confirmation.toLowerCase() === "yes") {
          rmvBookFromCart(book._id); // To Line: 245
        }
      });
      console.log("user Name:", username);
      if (username === "admin") {
        row.insertCell().appendChild(updateIcon);
        row.insertCell().appendChild(deleteButton);
      } else {
        row.insertCell().appendChild(addToCartButton);
        row.insertCell().appendChild(rmvFromCart);
      }
    });

    booksTable.appendChild(table);
  } else {
    booksTable.textContent = "No Books Found!!!";
  }
}

// Function to retrieve cookie by name
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

// Fetch all the book details when page is loaded
getAllBooks();
