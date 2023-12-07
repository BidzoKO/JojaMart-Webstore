fetch("https://localhost:7177/User/GetAllUsers")
  .then((res) => res.json())
  .then((data) => console.log(data));

function UserLogIn() {
  const userEmail = document.querySelector("#login-email");
  const userpassword = document.querySelector("#login-password");
console.log(userEmail.value);
  fetch("https://localhost:7177/User/UserLogin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail.value,
      password: userpassword.value,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("Success");
      } else {
        console.log("Error");
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch((error) => console.log("Error widh data"));
}
