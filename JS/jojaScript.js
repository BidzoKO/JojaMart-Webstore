const carousel = document.querySelector(".limited-items-container");
const scrollArrows = document.querySelectorAll(".catalog-arrow");
const popularItem = document.querySelector(".limited-offers-item");

let popularItemWidth = (2 * popularItem.clientWidth) + 50;

let scrollTimeOut = false;

scrollArrows.forEach((icon) => {
  icon.addEventListener("click", () => {
    if (!scrollTimeOut) {
      carousel.scrollLeft +=
        icon.id == "arrow-left" ? -popularItemWidth : popularItemWidth;
      scrollTimeOut = true;
      setTimeout(() => {
        scrollTimeOut = false;
      }, 300);
    }
  });
});

// #region login

const loginForm = document.querySelector("#simple-login-form");
const logInBtn = document.querySelector("#header-login-btn");
const closeLoginBtn = document.querySelector("#close-login-form-btn");
const signInBtn = document.getElementById("signin-btn");

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

let loginEmail = document.getElementById("login-email");
let loginPassword = document.getElementById("login-password");

signInBtn.addEventListener("click", () => {
  console.log("SignInStarted");
  UserLogIn();
});

logInBtn.addEventListener("click", () => {
  loginForm.classList.add("active");
  disableScroll();
});

closeLoginBtn.addEventListener("click", () => {
  loginForm.classList.remove("active");
  enableScroll();
  loginEmail.value = "";
  loginPassword.value = "";
});

// #endregion login
