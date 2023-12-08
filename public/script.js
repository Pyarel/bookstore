const makeRequest = async function (method, url, data = null) {
  try {
    // Retrieve the token from sessionStorage
    const token = sessionStorage.getItem("token");

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Include the token in the Authorization header if available
        ...(token && { Authorization: `${token}` }),
      },
      body: data ? JSON.stringify(data) : null,
    });

    // Check if the response is HTML
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const htmlContent = await response.text();
      return htmlContent;
    }

    const responseData = await response.json();

    if (!response.ok)
      throw new Error(responseData.message || "Something went wrong");
    return responseData;
  } catch (err) {
    console.error(err.message);
  }
};

const signIn = function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {
    username,
    password,
  };
  makeRequest("POST", "http://localhost:3000/login", data).then((response) => {
    sessionStorage.setItem("token", response.token);
    const booksURL = `http://localhost:3000/books${
      response.token ? `?token=${response.token}` : ""
    }`;
    // Navigate to the constructed URL
    window.location.href = booksURL;
  });
};

const signUp = function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {
    username,
    password,
  };
  makeRequest("POST", "http://localhost:3000/register", data).then(
    (response) => {
      alert(JSON.stringify(response.message));
    }
  );
};
