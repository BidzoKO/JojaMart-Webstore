import * as functionLibrary from '../functionLibrary.js';
import * as Api from '../jojaApi.js';
import * as assembler from '../htmlAssembler.js';

functionLibrary.StartupApiCalls();

// #region login

functionLibrary.CheckUserState();

const loginBtn = document.getElementById("header-login-btn");
const signoutBtn = document.getElementById("header-signout-btn");

loginBtn.addEventListener("click", () => {
  console.log("login");
  assembler.assembleLoginForm();
});

const summerStock = document.getElementById("header-nav-summer");
summerStock.addEventListener("click", () => {
  console.log("signout");
  Api.UserLogout();
});

// for testing authorizatrion
const springStock = document.getElementById("header-nav-spring");
springStock.addEventListener("click", () => {
  console.log("spring clicked");
  Api.GetUserById();
});

// #endregion login
