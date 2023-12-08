const makeRequest = async function (method, url, data = null) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });
    const responseData = await response.json();
    if (!response.ok)
      throw new Error(responseData.message || "Something went wrong");
    return responseData;
  } catch (err) {
    console.error(err.message);
  }
};

function setCookie() {
  // Calculate the expiration date, which is one minute from the current time
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 1);

  // Format the expiration date in the correct format for the cookie
  const expires = expirationDate.toUTCString();

  // Set the cookie with the expires attribute
  document.cookie = `isAuthenticated=true; path=/; expires=${expires}`;
}

const signIn = function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {
    username,
    password,
  };
  makeRequest("POST", "http://localhost:3000/login", data).then((response) => {
    sessionStorage.setItem("username", response.username);

    // User is logged in, set a cookie
    setCookie(); // Set the cookie

    // Navigate to the constructed URL
    window.location.href = "http://localhost:3000/books";
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
