import * as functionLibrary from '../functionLibrary.js';
import * as Api from '../jojaApi.js';
import * as assembler from '../htmlAssembler.js';

functionLibrary.StartupApiCalls();

// #region login

functionLibrary.CheckUserState();

const loginBtn = document.getElementById("header-login-btn");

loginBtn.addEventListener("click", () => {
  assembler.assembleLoginForm();
});

document.getElementById("header-nav-spring").addEventListener("click", () => {
  Api.GetUserById();
})

// #endregion login
