import * as functionLibrary from './functionLibrary.js';
import * as Api from "./jojaApi.js";

export function assembleLoginForm() {
  fetch("./HTML/templates/registrationForm.html")
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

      functionLibrary.disableScroll();

      signupForm.classList.add("inactive");

      // switch from login form to signup form
      signupTag.addEventListener("click", () => {
        signupForm.classList.remove("inactive");
        signinForm.classList.add("inactive");
        functionLibrary.ClearRegistrationForm();
      });

      // switch from signup form to login form
      logingTag.addEventListener("click", () => {
        signinForm.classList.remove("inactive");
        signupForm.classList.add("inactive");
        functionLibrary.ClearRegistrationForm();
      });

      // configure the top right 'x' to close the registration form
      closeLoginBtn.addEventListener("click", () => {
        functionLibrary.enableScroll();
        document.getElementById("registration-form-container").innerHTML =
          "<!--registration html-->";
      });

      // signin api call
      signinBtn.addEventListener("click", () => {
        Api.UserLogIn();
      });

      // signup api call
      signupBtn.addEventListener("click", () => {
        Api.CreateNewUser();
      });
    })
    .catch((error) =>
      console.error("Error fetching registrationForm.html:", error)
    );
}

export function insertLimitedItem() {
  const itemContainer = document.getElementById("limited-items-container-id");

  itemContainer;
}

export async function ItemOverview(itemName) {
  let product = await Api.GetProductByName(itemName);

  const itemExpandContainer = document.getElementById("item-expand-section");

  fetch("./HTML/templates/itemExpand.html")
    .then((response) => response.text())
    .then((html) => {
      const processedHTML = html
        .replace(/\$\{product\.imageUrl\}/, product.imageUrl)
        .replace(/\$\{product\.productName\}/, product.productName)
        .replace(/\$\{product\.description\}/, product.description)
        .replace(/\$\{product\.price\}/, product.price);

      itemExpandContainer.innerHTML = processedHTML;

      const productQuantity = document.getElementById(
        "item-expand-amount-input"
      );

      productQuantity.addEventListener("input", (event) => {
        if (+productQuantity.value < 0) {
          productQuantity.value = 0;
        }
      });

      productQuantity.value = 0;

      document
        .getElementById("item-expand-subtract-btn")
        .addEventListener("click", () => {
          if (productQuantity.value > 0) {
            productQuantity.value = parseInt(productQuantity.value) - 1;
          }
        });

      document
        .getElementById("item-expand-add-btn")
        .addEventListener("click", () => {
          productQuantity.value = parseInt(productQuantity.value) + 1;
          expandedWindow.classList.add("active");
        });

      document
        .getElementById("item-expand-close-btn")
        .addEventListener("click", () => {
          itemExpandContainer.innerHTML = "";
          console.log("close");
        });
    });
}

