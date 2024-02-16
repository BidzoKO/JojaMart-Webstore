import * as Api from "./jojaApi.js";
import * as assembler from "./htmlAssembler.js";

// disables scroll for registration form
export function disableScroll() {
  let scrollY = window.scrollY;
  let scrollX = window.scrollX;

  window.onscroll = function () {
    window.scrollTo(scrollX, scrollY);
  };
}

// enables scroll on closing the registrations form
export function enableScroll() {
  window.onscroll = function () {};
}

// Checks and formats user data for serverside
export function assembleUserForCreation() {
  const userFullname = document.querySelector("#signup-fullname").value;
  const userUsername = document.querySelector("#signup-username").value;
  const userEmail = document.querySelector("#signup-email").value;
  const userPassword = document.querySelector("#signup-password").value;
  const userDob = document.querySelector("#signup-dob");
  const userGender = document.querySelector("#signup-gender").value;

  const userNameArray = userFullname.split(" ");

  let errorCount = 0;

  // ensures fullname field's validity
  if (
    userFullname == null ||
    userFullname.trim() === "" ||
    !userFullname.includes(" ")
  ) {
    document.getElementById("signup-fullname").style.border = "2px  solid red";
    document.getElementById("signup-fullname-error-text").innerHTML =
      "Must contain first and last names seperated by a space";
    errorCount = errorCount + 1;
  } else {
    document.getElementById("signup-fullname").style.border = "";
    document.getElementById("signup-fullname-error-text").innerHTML = "";
  }

  // ensures username field's validity
  if (userUsername == null || userUsername == "") {
    document.getElementById("signup-username").style.border = "2px  solid red";
    document.getElementById("signup-username-error-text").innerHTML =
      "Invalid username";
    errorCount = errorCount + 1;
  } else {
    document.getElementById("signup-username").style.border = "";
    document.getElementById("signup-username-error-text").innerHTML = "";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ensures email field's validity
  if (userEmail == null || userEmail == "" || !emailRegex.test(userEmail)) {
    document.getElementById("signup-email").style.border = "2px  solid red";
    document.getElementById("signup-email-error-text").innerHTML =
      "Invalid email";
    errorCount = errorCount + 1;
  } else {
    document.getElementById("signup-email").style.border = "";
    document.getElementById("signup-email-error-text").innerHTML = "";
  }

  // ensures password field's validity
  if (userPassword == null || userPassword == "") {
    document.getElementById("signup-password").style.border = "2px  solid red";
    document.getElementById("signup-password-error-text").innerHTML =
      "Invalid password";
    errorCount = errorCount + 1;
  } else {
    document.getElementById("signup-password").style.border = "";
    document.getElementById("signup-password-error-text").innerHTML = "";
  }

  // ensures date of birth field's validity
  if (userDob.value == null || userDob.value == "") {
    document.getElementById("signup-dob").style.border = "2px  solid red";
    document.getElementById("signup-dob-error-text").innerHTML = "Invalid date";
    errorCount = errorCount + 1;
  } else {
    document.getElementById("signup-dob").style.border = "";
    document.getElementById("signup-dob-error-text").innerHTML = "";
  }

  // ensures gender field's validity
  if (userGender == null || userGender == "") {
    document.getElementById("signup-gender").style.border = "2px  solid red";
    document.getElementById("signup-gender-error-text").innerHTML =
      "Invalid gender";
    errorCount = errorCount + 1;
  } else {
    document.getElementById("signup-gender").style.border = "";
    document.getElementById("signup-gender-error-text").innerHTML = "";
  }

  if (errorCount > 0) {
    return null;
  }

  // assigns an appropirate value to gender
  let genderDbValue;
  switch (userGender.toLowerCase()) {
    case "male":
      genderDbValue = "m";
      break;
    case "female":
      genderDbValue = "f";
      break;
    case "other":
      genderDbValue = "o";
      break;
    default:
      genderDbValue = "o";
      break;
  }

  // formats date appropriately for serverside
  const formattedDob = new Date(userDob.value).toISOString();

  // assembles the user object
  const userObject = {
    firstName: userNameArray[0],
    lastName: userNameArray[1],
    username: userUsername,
    email: userEmail,
    password: userPassword,
    dob: formattedDob,
    gender: genderDbValue,
    address: null,
    phoneNumber: null,
    callingCode: null,
  };
  console.log(userObject);

  return userObject;
}

// clears the fields in the registration form when switching between login and regsitration
export function ClearRegistrationForm() {
  // login fields
  const loginEmailField = document.getElementById("login-email");
  const loginPasswordField = document.getElementById("login-password");
  // signup fields
  const signupFullnameField = document.getElementById("signup-fullname");
  const signupUsernameField = document.getElementById("signup-username");
  const signupEmailField = document.getElementById("signup-email");
  const signupPasswordField = document.getElementById("signup-password");
  const signupDobField = document.getElementById("signup-dob");
  const signupGenderField = document.getElementById("signup-gender");

  loginEmailField.value = "";
  loginPasswordField.value = "";
  signupFullnameField.value = "";
  signupUsernameField.value = "";
  signupEmailField.value = "";
  signupPasswordField.value = "";
  signupDobField.value = "";
  signupGenderField.value = "";
}

// used with authorized api, if access token is expired will call reauthentication endpoint and retry the original api call
export async function MakeAuthenticatedAPICall(apiEndpoint, options) {
  try {
    let accessToken = Cookies.get("accessToken");

    if (accessToken == undefined || accessToken == null) {
      throw new Error("access token missing");
    }
    const response = await fetch(apiEndpoint, {
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      ...options,
    });

    if (response.ok) {
      if (response.status == 204) {
        console.log("No content available.");
        return true;
      }
      return response.json();
    } else if (response.status === 401) {
      newAccessToken = await Api.ReauthenticateUser();
      if (newAccessToken) {
        console.log(
          "Reauthentication successful. Retrying the original API call."
        );
        return MakeAuthenticatedAPICall(apiEndpoint, options);
      } else {
        throw new Error("Reauthentication failed");
      }
    } else {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// configures page UI depending on if the user is authenticated. takes in true or false
export function configureIndexUIForAuth(loginState) {
  const accountAndCart = document.getElementById("header-Account-cart");
  const loginBtn = document.getElementById("header-login-btn");
  const accountBtn = document.getElementById("header-Account-btn");

  if (loginState) {
    loginBtn.classList.add("Inactive");
    accountAndCart.classList.add("Active");
  } else if (!loginState) {
    loginBtn.classList.remove("Inactive");
    accountAndCart.classList.remove("Active");
  }
}

// is user loged in or not
export function CheckUserState() {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  if ((accessToken != null) & (refreshToken != null)) {
    configureIndexUIForAuth(true);
  } else {
    configureIndexUIForAuth(false);
  }
}

// enables the limited time items scrolling
export function EnableLimitedOffersScroll() {
  const carousel = document.querySelector(".limited-items-content");
  const scrollArrows = document.querySelectorAll(".catalog-arrow");
  const popularItem = document.querySelector(".limited-items-item");

  let popularItemWidth = 2 * popularItem.clientWidth + 50;

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
}

//
export function InsertLimitedItems(items) {
  const itemContainer = document.getElementById("limited-items-content-id");
  itemContainer.addEventListener("click", (event) => {
    var clickedItem = event.target.closest(".limited-items-item");

    if (clickedItem) {
      console.log(
        clickedItem.querySelector(".limited-item-desc h2").textContent
      );
      assembler.ItemOverview(
        clickedItem.querySelector(".limited-item-desc h2").textContent
      );
    }
  });
  items.forEach((item) => {
    itemContainer.innerHTML += `
      <div class="limited-items-item">
        <div class="limited-item-content">
          <div class="limited-item-img-container">
            <img src="${item.imageUrl}" alt="" class="limited-item-img" />
          </div>
          <div class="limited-item-desc">
            <h2>${item.productName}</h2>
          </div>
          <div class="limited-item-price">
            <h4>Price: ${item.price}</h4>
            <img src="/JojaMart_files/element_icons/18px-Gold.png" alt="" />
          </div>
        </div>
      </div>
      `;
  });
}

//
export function InsertPopularItem(item) {
  const itemContainer = document.getElementById("popular-item-container");
  itemContainer.innerHTML += `
    <div class="popular-item">
    <div class="popular-item-img-container">
      <img src="${item.imageUrl}" alt="" />
    </div>
    <div class="popular-item-desc">
      <h2>${item.productName}</h2>
    </div>
    <div class="popular-item-price">
      <h4>Price: ${item.price}</h4>
      <img src="/JojaMart_files/element_icons/18px-Gold.png" alt="" />
    </div>
  </div>
    `;
}

// calls all the apis and functions that need executing at page startup
export function StartupApiCalls() {
  Api.GetLimitedTimeItems();
  Api.GetPopularItems();
}

//-----------------------------------------------accound page-------------------------------------------------//

export function AccountMain() {
  SetAccountPageIdentity();
  AccountNavListeners();
  AccountPageListeners();
}

function AccountNavListeners() {
  const accNavContainer = document.getElementById("account-nav-container");

  accNavContainer.addEventListener("click", function (event) {
    if (event.target.nodeName === "LI") {
      const content = event.target.dataset.content;

      switch (content) {
        case "dashboard":
          NavToDashboard();
          break;
        case "orders":
          NavToOrders();
          break;
        case "information":
          NavToInformation();
          break;
        case "details":
          NavToDetails();
          break;
        case "logout":
          AccPageLogoutPrompt();
          break;
      }
    }
  });
}

function NavToDashboard() {
  console.log("navigating the content to dashboard");
  const dashboardContent = document.getElementById("account-nav-content-box");

  dashboardContent.innerHTML = `
  <div id="accound-dashboard-container">
    <div id="account-dashboard-content">
      <h3>Hello ${name} (not ${name}? <a href="">log out</a>)<br><br></h3>
      From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</h3>
    </div>
  </div>
  `;
}

function NavToOrders() {
  console.log("navigating the content to dashboard");
  const dashboardContent = document.getElementById("account-nav-content-box");

  dashboardContent.innerHTML = `
  `;
}

function NavToInformation() {
  console.log("navigating the content to dashboard");
  const dashboardContent = document.getElementById("account-nav-content-box");

  dashboardContent.innerHTML = `
  `;
}

function NavToDetails() {
  console.log("navigating the content to dashboard");
  const dashboardContent = document.getElementById("account-nav-content-box");

  dashboardContent.innerHTML = `
  `;
}

function AccPageLogoutPrompt() {
  console.log("navigating the content to dashboard");
  const dashboardContent = document.getElementById("account-nav-content-box");

  dashboardContent.innerHTML = `
  <div id="account-nav-logout-box">
    <h3>do you want to logout?<a href="">   Logout</a></h3>
    <h3>deactivate your account?<a href="">   Deactivate</a></h3>
    <h3>delete your acount?<a href="">   Delete </a></h3>
  </div>
  `;
}

function AccountPageListeners() {
  const accountIdentityLogout = document.getElementById(
    "account-identity-logout"
  );
  accountIdentityLogout.addEventListener("click", () => {
    Api.UserLogout();
    console.log("loged out");
  });
}

async function SetAccountPageIdentity(){

  const userIdentity = await Api.GetUseridentity()

  localStorage.setItem('userIdentity', JSON.stringify(userIdentity));

  const userName = localStorage.getItem('userIdentity');

  const storedUserIdentity = JSON.parse(userName)

  console.log(storedUserIdentity);
}
