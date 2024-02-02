StartupApiCalls();

// #region login

CheckUserState();

const loginBtn = document.getElementById("header-login-btn");
const signoutBtn = document.getElementById("header-signout-btn");

loginBtn.addEventListener("click", () => {
  console.log("login");
  assembleLoginForm();
});

signoutBtn.addEventListener("click", () => {
  console.log("signout");
  UserLogout();
});

// for testing authorizatrion
const springStock = document.getElementById("header-nav-spring");
springStock.addEventListener("click", () => {
  console.log("spring clicked");
  GetUserById();
});

// #endregion login
