function disableScroll() {
  let scrollY = window.scrollY;
  let scrollX = window.scrollX;

  window.onscroll = function () {
    window.scrollTo(scrollX, scrollY);
  };
}

function enableScroll() {
  window.onscroll = function () {};
}

function loginValidation(){

}

function assembleLoginForm() {
  fetch("./HTML/IndexPage/login.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("login-form-container-id").innerHTML = html;

      const loginForm = document.getElementById("simple-login-form");
      const closeLoginBtn = document.getElementById("close-login-form-btn");
      const signInBtn = document.getElementById("signin-btn");

      loginForm.classList.add("active");
      disableScroll();

      closeLoginBtn.addEventListener("click", () => {
        enableScroll();
        document.getElementById("login-form-container-id").innerHTML =
          "<!--login html-->";
      });

      signInBtn.addEventListener("click", () => {
        console.log("SignInStarted");
        UserLogIn();
      });
    })
    .catch((error) => console.error("Error fetching login.html:", error));
}
