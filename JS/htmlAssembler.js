

function injectLoginForm() {
  fetch("/HTML/IndexPage/temp.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("simple-login-form").innerHTML = html;
      document
        .getElementById("signin-btn")
        .addEventListener("click", function () {
          alert("Sign In button clicked!");
        });

      // Add more event listeners or logic as needed
    })
    .catch((error) => console.error("Error fetching temp.html:", error));
}
// Call the injectLoginForm function when the page is loaded
