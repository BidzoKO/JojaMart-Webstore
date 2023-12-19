

//gets all users, only for development purposes
fetch("https://localhost:7177/User/GetAllUsers")
  .then((res) => res.json())
  .then((data) => console.log(data));


//user signin POST method
function UserLogIn() {

  const userEmail = document.querySelector("#login-email");
  const userPassword = document.querySelector("#login-password");

  fetch("https://localhost:7177/User/UserLogin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail.value,
      password: userPassword.value,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("fetch result valid");
      } else {
        console.log("fetch result error");
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
      Cookies.set('accessToken',data.accessToken);
      Cookies.set('refreshToken',data.refreshToken);
    })
    .catch((error) => console.log("Error widh data"));
}

//only for testing needs changing
function GetUserById() {
// Retrieve tokens from cookies
const refreshToken = Cookies.get('refreshToken');
const accessToken = Cookies.get('accessToken');

// Make the fetch request with tokens in headers
const userId = 10;
fetch(`https://localhost:7177/User/GetuserById?Id=${userId}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  },
  credentials: "include", // Send cookies with the request
})
  .then(response => response.json())
  .then(data => {
    // Handle the response data
    console.log(data);
  })
  .catch(error => {
    // Handle errors
    console.error("Error:", error);
  });
}



