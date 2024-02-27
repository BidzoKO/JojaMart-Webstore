import * as Api from "./jojaApi.js";
import * as Assembler from "./htmlAssembler.js";
import * as Validator from "./validatiors.js";

//#region general

export function disableScroll() {
  let scrollY = window.scrollY;
  let scrollX = window.scrollX;

  window.onscroll = function () {
    window.scrollTo(scrollX, scrollY);
  };
}

export function enableScroll() {
  window.onscroll = function () {};
}

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

  return userObject;
}

export async function MakeAuthenticatedAPICall(apiEndpoint, options) {
  try {
    let accessToken = Cookies.get("accessToken");

    let response = await fetch(apiEndpoint, {
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
        return 204;
      }

      const responseBodyText = await response.text();
      if (responseBodyText == "") {
        return response;
      } else {
        const responseData = JSON.parse(responseBodyText);
        return await responseData;
      }
    } else if (response.status === 401) {
      const newAccessToken = await Api.ReauthenticateUser();
      if (newAccessToken.statusCode != 401) {
        console.log(
          "Reauthentication successful. Retrying the original API call."
        );
        return await MakeAuthenticatedAPICall(apiEndpoint, options);
      } else {
        return 401;
      }
    } else {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function CalculateAnimationKeyframes() {
  var keyframes = `
  @keyframes fade-in {
    from {
      top: ${45 + (window.scrollY / window.innerHeight) * 100}%;
      opacity: ${0.3};
    }
    to {
      top: ${50 + (window.scrollY / window.innerHeight) * 100}%;
      opacity: ${1};
    }
  }
`;
  var styleElement = document.createElement("style");
  styleElement.innerHTML = keyframes;
  document.head.appendChild(styleElement);
}

export function CalculateAnimationKeyframesCart() {
  var keyframes = `
  @keyframes fade-left {
    from {
      right: -300px;
      opacity: ${0.3};
    }
    to {
      right: 0px;
      opacity: ${1};
    }
  }
`;
  var styleElement = document.createElement("style");
  styleElement.innerHTML = keyframes;
  document.head.appendChild(styleElement);
}

//#endregion general

//#region index page

export function StartupApiCalls() {
  Api.GetLimitedTimeItems();
  Api.GetPopularItems();
}

export function LoginFormConifg(action) {
  const unclickableOverlay = document.getElementById("unclickable-overlay-id");
  const FormContainer = document.getElementById("registration-form-container");

  if (action == "enable") {
    unclickableOverlay.classList.add("active");
    unclickableOverlay.addEventListener("click", () => {
      LoginFormConifg("disable");
    });
    disableScroll();
  }
  if (action == "disable") {
    unclickableOverlay.classList.remove("active");
    enableScroll();
    FormContainer.innerHTML = "<!--registration html-->";
  }
}

export function CartConifg(action) {
  const unclickableOverlay = document.getElementById("unclickable-overlay-id");
  const CartContainer = document.getElementById("cart-section");

  if (action == "enable") {
    unclickableOverlay.classList.add("active");
    unclickableOverlay.addEventListener("click", () => {
      CartConifg("disable");
    });
    disableScroll();
  }
  if (action == "disable") {
    unclickableOverlay.classList.remove("active");
    CartContainer.innerHTML = "<!--cart html-->";
    enableScroll();
  }
}

export function CheckLoginCredentials() {
  const userEmail = document.querySelector("#login-email").value;
  const userPassword = document.querySelector("#login-password").value;
  let errorCount = 0;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (userEmail == "" || !emailRegex.test(userEmail)) {
    document.getElementById("login-email").style.border = "2px  solid red";
    document.getElementById("login-email-error-text").innerHTML =
      "invalid email";
    errorCount += 1;
  } else {
    document.getElementById("login-email").style.border = "";
    document.getElementById("login-email-error-text").innerHTML = "";
  }

  if (userPassword == "") {
    document.getElementById("login-password").style.border = "2px  solid red";
    document.getElementById("login-password-error-text").innerHTML =
      "invalid password";
    errorCount += 1;
  } else {
    document.getElementById("login-password").style.border = "";
    document.getElementById("login-password-error-text").innerHTML = "";
  }

  if (errorCount > 0) {
    return null;
  }

  const userCredentials = {
    password: userPassword,
    email: userEmail,
  };
  return userCredentials;
}

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

export function ConfigureIndexUIForAuth(loginState) {
  const accountAndCart = document.getElementById("header-Account-cart");
  const loginBtn = document.getElementById("header-login-btn");
  const cartBtn = document.getElementById("header-Cart-btn");

  if (loginState) {
    loginBtn.classList.add("Inactive");
    accountAndCart.classList.add("Active");
    cartBtn.addEventListener("click", () => {
      Assembler.DisplayCart();
    });
  } else if (!loginState) {
    loginBtn.classList.remove("Inactive");
    accountAndCart.classList.remove("Active");
  }
}

export function CheckUserState() {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  if ((accessToken != null) & (refreshToken != null)) {
    ConfigureIndexUIForAuth(true);
  } else {
    ConfigureIndexUIForAuth(false);
  }
}

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

export function InsertLimitedItems(items) {
  const itemContainer = document.getElementById("limited-items-content-id");
  itemContainer.addEventListener("click", (event) => {
    var clickedItem = event.target.closest(".limited-items-item");

    if (clickedItem) {
      Assembler.ItemOverview(
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

export function InsertPopularItem(items) {
  const itemContainer = document.getElementById("popular-item-container");
  itemContainer.addEventListener("click", (event) => {
    var clickedItem = event.target.closest(".popular-item");

    if (clickedItem) {
      Assembler.ItemOverview(
        clickedItem.querySelector(".popular-item-desc h2").textContent
      );
    }
  });

  for (let i = 0; i < 8; i++) {
    itemContainer.innerHTML += `
    <div class="popular-item">
    <div class="popular-item-img-container">
      <img src="${items[i].imageUrl}" alt="" />
    </div>
    <div class="popular-item-desc">
      <h2>${items[i].productName}</h2>
    </div>
    <div class="popular-item-price">
      <h4>Price: ${items[i].price}</h4>
      <img src="/JojaMart_files/element_icons/18px-Gold.png" alt="" />
    </div>
  </div>
    `;
  }
}

export function AddItemToCart(orderDetails) {
  const itemExpandContainer = document.getElementById("item-expand-section");
  const orderQuantity = document.getElementById("item-expand-amount-input");
  const errorMessage = document.getElementById("add-to-cart-error");

  if (orderQuantity.value == 0) {
    orderQuantity.classList.add("error");
    errorMessage.innerHTML = "Invalid input!";
    return;
  }

  if (!orderDetails) {
    console.error("client-siode error with order details");
    return;
  }

  const apiEndpoint = "https://localhost:7177/Order/AddOrderToCart";

  const apiOptions = {
    method: "POST",
    body: JSON.stringify({
      productName: orderDetails.productName,
      quantity: orderDetails.quantity,
    }),
  };

  try {
    MakeAuthenticatedAPICall(apiEndpoint, apiOptions)
      .then((data) => {
        if (data == 401) {
          alert("you must login for that action");
          Assembler.assembleLoginForm();
        }
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
  ExpandedItemFormConifg("disable");
  itemExpandContainer.innerHTML = "";
}

export function ExpandedItemFormConifg(action) {
  const unclickableOverlay = document.getElementById("unclickable-overlay-id");
  const FormContainer = document.getElementById("item-expand-section");

  if (action == "enable") {
    unclickableOverlay.classList.add("active");
    unclickableOverlay.addEventListener("click", () => {
      ExpandedItemFormConifg("disable");
    });
    disableScroll();
  }
  if (action == "disable") {
    unclickableOverlay.classList.remove("active");
    enableScroll();
    FormContainer.innerHTML = "<!--registration html-->";
  }
}

export function CreateCartItemHTML(item) {
  let itemHTML = `
  <div class="cart-item" order-id="${item.id}">
    <div class="cart-item-delete-container"><p class="cart-item-delete">delete</p></div>
    <img src=${item.imageUrl} alt="">
    <h3>${item.productName}</h3>
    <p>Q: ${item.quantity}</p>
    <p>${item.totalPrice}<img src="./JojaMart_files/element_icons/18px-Gold.png" alt=""></p>            
  </div>`;

  return itemHTML;
}

//#endregion index page

//#region accound page

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
          NavTologout();
          break;
      }
    }
  });
}

function NavToDashboard() {
  const userDetails = JSON.parse(localStorage.getItem("userIdentity"));
  const dashboardContent = document.getElementById("account-nav-content-box");

  const userFullname = userDetails.firstName + " " + userDetails.lastName;

  dashboardContent.innerHTML = `
  <div id="accound-dashboard-container">
    <div id="account-dashboard-content">
      <h3>Hello ${userFullname} &nbsp;(not ${userDetails.firstName}? <a href="">log out</a>)<br><br></h3>
      From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</h3>
    </div>
  </div>
  `;
}

function NavToOrders() {
  const dashboardContent = document.getElementById("account-nav-content-box");

  dashboardContent.innerHTML = `<div id="account-nav-orders-content-box">
  <div id="orders-table-title-container"><h2>Orders</h2></div>
  <div id="acc-orders-table-container">
    <table>
      <tr>
        <th>id</th>
        <th>product</th>
        <th>quantity</th>
        <th>date</th>
        <th>total price</th>
        <th>status</th>
      </tr>
      <tr>
        <td>sample</td>
        <td>sample</td>
        <td>sample</td>
        <td>sample</td>
        <td>sample</td>
        <td>sample</td>
      </tr>
    </table>
  </div>
</div>
  `;
}

function NavToInformation() {
  const dashboardContent = document.getElementById("account-nav-content-box");

  dashboardContent.innerHTML = `
  `;
}

function NavToDetails() {
  const dashboardContent = document.getElementById("account-nav-content-box");
  const storedUserDetails = JSON.parse(localStorage.getItem("userIdentity"));
  sessionStorage.setItem(
    "sessionUserDetails",
    JSON.stringify(storedUserDetails)
  );
  const userDetails = JSON.parse(sessionStorage.getItem("sessionUserDetails"));
  console.log(userDetails);

  let phoneNumber = userDetails.imageUrl;

  if (userDetails.firstName != "")
    if (phoneNumber == null || phoneNumber == "") {
      phoneNumber = "add a phone number";
    }

  dashboardContent.innerHTML = `
  <!--dynamic-->
  <div id="account-detail-container">
    <div id="account-detail-content-grid">
      <div class="account-detail-content-item" id="account-detail-firstname-container">
        <h5>Name</h5>
        <div class="account-detail-view-mode">
          <p> ${userDetails.firstName + " " + userDetails.lastName} </p>
          <img src="/JojaMart_files/element_icons/edit-pen.png" alt="" />
        </div>
        <div class="account-detail-edit-mode">
          <input type="text" value="${
            userDetails.firstName + " " + userDetails.lastName
          } " data="name">
          <img src="/JojaMart_files/element_icons/edit-tick.png" alt="" />
        </div>
      </div>
      <div class="account-detail-content-item" id="account-detail-username-container">
        <h5>Username</h5>
        <div class="account-detail-view-mode">
          <p> ${userDetails.username} </p>
          <img src="/JojaMart_files/element_icons/edit-pen.png" alt="" />
        </div>
        <div class="account-detail-edit-mode">
          <input type="text" value="${userDetails.username}" data="username">
          <img src="/JojaMart_files/element_icons/edit-tick.png" alt="" />
        </div>
      </div>
      <div class="account-detail-content-item" id="account-detail-address-container">
        <h5>Address</h5>
        <div class="account-detail-view-mode">
          <p> ${userDetails.address} </p>
          <img src="/JojaMart_files/element_icons/edit-pen.png" alt="" />
        </div>
        <div class="account-detail-edit-mode">
          <input type="text" value="${userDetails.address}" data="address">
          <img src="/JojaMart_files/element_icons/edit-tick.png" alt="" />
        </div>
      </div>
      <div class="account-detail-content-item" id="account-detail-phone-container">
        <h5>Phone Number</h5>
        <div class="account-detail-view-mode">
          <p> ${phoneNumber} </p>
          <img src="/JojaMart_files/element_icons/edit-pen.png" alt="" />
        </div>
        <div class="account-detail-edit-mode">
          <input type="text" value="${phoneNumber}" data="phoneNumber">
          <img src="/JojaMart_files/element_icons/edit-tick.png" alt="" />
        </div>
      </div>
      <div class="account-detail-content-item" id="account-detail-profilePicture-container">
        <h5>Profile Picture</h5>
        <input id ="account-details-upload-profile" type="file" accept="image/*">
      </div>
      <div class="account-detail-content-item" id="account-detail-password-container">
        <h5>Password</h5>
        <div class="account-detail-view-mode">
          <p> password </p>
          <img src="/JojaMart_files/element_icons/edit-pen.png" alt="" />
        </div>
        <div class="account-detail-edit-mode">
          <input type="password" data="password" id ="details-password-input">
          <img src="/JojaMart_files/element_icons/edit-tick.png" alt="" />
          <img id="details-password-view-btn" src="/JojaMart_files/element_icons/view-password-eye.png" alt="" />
        </div>
      </div>
    </div>
    <div id="account-details-change-btn-container">
      <button class="account-details-btn" id="account-details-cancel-btn">
        cancel
      </button>
      <button class="account-details-btn" id="account-details-save-btn">
        save changes
      </button>
    </div>
  </div>
  `;

  SetDetailListeners();
}

function NavTologout() {
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
  });
}

async function SetAccountPageIdentity() {
  const response = await Api.GetUserIdentity();

  localStorage.setItem("userIdentity", JSON.stringify(response));

  const userDetails = JSON.parse(localStorage.getItem("userIdentity"));

  const userImgContainer = document
    .getElementById("account-identity-image")
    .querySelector("img");
  const userNameContainer = document
    .getElementById("account-identity-name")
    .querySelector("h4");

  if (userDetails.imageUrl != null) {
    userImgContainer.src = userDetails.imageUrl;
  }

  if (userDetails.firstName != null || userDetails.firstName != "") {
    userNameContainer.innerHTML = userDetails.firstName;
  }

  NavToDetails();
}

function SetDetailListeners() {
  let sessionUserDetails = JSON.parse(
    sessionStorage.getItem("sessionUserDetails")
  );
  const cancelBtn = document.getElementById("account-details-cancel-btn");
  const unclickableOverlay = document.getElementById(
    "unclickable-overlay-account-id"
  );

  cancelBtn.addEventListener("click", () => {
    console.log("cancel");
    NavToDashboard();
  });

  const detailContainer = document.getElementById(
    "account-detail-content-grid"
  );

  const viewpasswordBtn = document.getElementById("details-password-view-btn");
  const passowrdInput = document.getElementById("details-password-input");
  
  viewpasswordBtn.addEventListener("click", () => {
    if (passowrdInput.type == "password") {
      passowrdInput.type = "text";
    } else if(passowrdInput.type == "text") {
      passowrdInput.type = "password";
    }
  });

  var editorState = 0;
  // listeners for editing account details
  detailContainer.addEventListener("click", (event) => {
    let passwordHolder = null;
    const pfpContainer = document.getElementById(
      "account-detail-profilePicture-container"
    );
    const clickedItem = event.target.closest(".account-detail-content-item");
    const pfpBtn = document.getElementById("account-details-upload-profile");
    if (
      clickedItem == null ||
      (clickedItem == pfpContainer && event.target != pfpBtn)
    ) {
      return;
    }
    if (event.target == pfpBtn) {
      return;
    }
    const viewElementContainer = clickedItem.querySelector(
      ".account-detail-view-mode"
    );
    const editElementContainer = clickedItem.querySelector(
      ".account-detail-edit-mode"
    );
    const editIcon = viewElementContainer.querySelector("img");
    const confirmIcon = editElementContainer.querySelector("img");

    if (event.target === editIcon && editorState == 0) {
      console.log(editIcon);
      viewElementContainer.style.display = "none";
      editElementContainer.style.display = "flex";
      unclickableOverlay.classList.add("no-blur");
      editorState = 1;
    } else if (event.target === confirmIcon && editorState == 1) {
      viewElementContainer.style.display = "flex";
      editElementContainer.style.display = "none";
      unclickableOverlay.classList.remove("no-blur");
      editorState = 0;

      let changedVariable = editElementContainer.querySelector("input");
      const varibaleName = changedVariable.getAttribute("data");
      console.log(varibaleName);
      switch (varibaleName) {
        case "name":
          const nameCheckResult = Validator.CheckFullname(
            changedVariable.value
          );
          if (nameCheckResult) {
            sessionUserDetails.firstName = nameCheckResult.firstName;
            sessionUserDetails.lastName = nameCheckResult.lastName;
            viewElementContainer.querySelector("p").innerHTML =
              changedVariable.value;
          }
          changedVariable.value =
            sessionUserDetails.firstName + " " + sessionUserDetails.lastName;
          break;
        case "username":
          const userCheckResult = Validator.CheckUsername(
            changedVariable.value
          );
          if (userCheckResult) {
            console.log(userCheckResult);
            sessionUserDetails.username = userCheckResult;
            viewElementContainer.querySelector("p").innerHTML =
              changedVariable.value;
          }
          changedVariable.value = sessionUserDetails.username;
          break;
        case "address":
          const addressCheckResult = Validator.CheckAddress(
            changedVariable.value
          );
          if (addressCheckResult) {
            sessionUserDetails.address = addressCheckResult;
            viewElementContainer.querySelector("p").innerHTML =
              changedVariable.value;
          }
          changedVariable.value = sessionUserDetails.address;
          break;
        case "phoneNumber":
          const phoneCheckResult = Validator.CheckPhoneNumber(
            changedVariable.value
          );
          if (phoneCheckResult) {
            sessionUserDetails.phoneNumber = phoneCheckResult;
            viewElementContainer.querySelector("p").innerHTML =
              changedVariable.value;
          }
          changedVariable.value = sessionUserDetails.phoneNumber;
          break;
        case "password":
          const passCheckResult = Validator.PasswordPhoneNumber(
            changedVariable.value
          );
          if (passCheckResult) {
            passwordHolder = changedVariable.value;
          } else {
            changedVariable.value = "";
          }

          break;
        default:
          break;
      }
      console.log(sessionUserDetails);
    }
  });

  const saveChangesBtn = document.getElementById("account-details-save-btn");

  saveChangesBtn.addEventListener("click", () => {
    const newUserImage = document.getElementById(
      "account-details-upload-profile"
    ).files[0];

    if (newUserImage != null) {
      const newProfileFormData = new FormData();
      newProfileFormData.append("userImage", newUserImage);
      sessionUserDetails.imageUrl = newProfileFormData;
      console.log(newProfileFormData);
    } else {
      console.log("null image");
    }

    sessionStorage.setItem(
      "sessionUserDetails",
      JSON.stringify(sessionUserDetails)
    );

    const sessionFinalizedUserDetails =
      sessionStorage.getItem("sessionUserDetails");
    const UserDetails = localStorage.getItem("userIdentity");

    if (sessionFinalizedUserDetails == UserDetails) {
      console.log("nothing changed");
    } else {
      Api.UpdateUserDetails(sessionFinalizedUserDetails);
    }
  });
}

//#endregion account page
