// dont know
function loginValidation() {}


function assembleLoginForm() {
  fetch("./HTML/IndexPage/registrationForm.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("registration-form-container").innerHTML = html;

      const closeLoginBtn = document.getElementById(
        "close-registration-form-btn"
      );
      const signinForm = document.getElementById("login-form");
      const signinBtn = document.getElementById("signin-btn");
      const signupForm = document.getElementById("signup-form");
      const signupBtn = document.getElementById("signup-btn");
      const signupTag = document.getElementById("registration-form-signup-tag");
      const logingTag = document.getElementById("registration-form-login-tag");

      disableScroll();

      signupForm.classList.add("inactive");

      // switch from login form to signup form
      signupTag.addEventListener("click", () => {
        signupForm.classList.remove("inactive");
        signinForm.classList.add("inactive");
        ClearRegistrationForm();
      });

      // switch from signup form to login form
      logingTag.addEventListener("click", () => {
        signinForm.classList.remove("inactive");
        signupForm.classList.add("inactive");
        ClearRegistrationForm();
      });

      // configure the top right 'x' to close the registration form
      closeLoginBtn.addEventListener("click", () => {
        enableScroll();
        document.getElementById("registration-form-container").innerHTML =
          "<!--registration html-->";
      });

      // signin api call
      signinBtn.addEventListener("click", () => {
        UserLogIn();
      });

      // signup api call
      signupBtn.addEventListener("click", () => {        
        CreateNewUser();
      })
    })
    .catch((error) =>
      console.error("Error fetching registrationForm.html:", error)
    );
}
