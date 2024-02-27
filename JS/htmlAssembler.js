import * as functionLibrary from "./functionLibrary.js";
import * as Api from "./jojaApi.js";

export function assembleLoginForm() {
  fetch("./HTML/templates/registrationForm.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("registration-form-container").innerHTML = html;
      const registrationForm = document.getElementById("registration-form");
      const closeLoginBtn = document.getElementById(
        "close-registration-form-btn"
      );
      const signinForm = document.getElementById("login-form");
      const signinBtn = document.getElementById("signin-btn");
      const signupForm = document.getElementById("signup-form");
      const signupBtn = document.getElementById("signup-btn");
      const signupTag = document.getElementById("registration-form-signup-tag");
      const logingTag = document.getElementById("registration-form-login-tag");

      functionLibrary.LoginFormConifg("enable");
      //for allowing expanded item animation to be in the screen center
      functionLibrary.CalculateAnimationKeyframes();

      registrationForm.style.top =
      50 + (window.scrollY / window.innerHeight) * 100 + "%";

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
        functionLibrary.LoginFormConifg("disable");
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

      //disable scrolling
      functionLibrary.ExpandedItemFormConifg("enable");
      //for allowing expanded item animation to be in the screen center
      functionLibrary.CalculateAnimationKeyframes();

      const expandedContainer = document.getElementById(
        "item-expand-container"
      );

      expandedContainer.style.top =
        50 + (window.scrollY / window.innerHeight) * 100 + "%";
      expandedContainer.classList.add("active");

      const productQuantity = document.getElementById(
        "item-expand-amount-input"
      );

      let previousValue = "";
      productQuantity.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "");
        let currentValue = event.target.value;

        currentValue = currentValue.replace(/^0+(?=\d)/, "");
        event.target.value = currentValue;

        // Check if the current value is a valid non-negative integer
        if (
          !/^\d*$/.test(currentValue) ||
          parseInt(currentValue) < 0 ||
          parseInt(currentValue) > 100
        ) {
          // If the current value is invalid, revert it to the previous value
          event.target.value = previousValue;
        } else {
          // Update the previous value if the current value is valid
          previousValue = currentValue;
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
          if (productQuantity.value < 100) {
            productQuantity.value = parseInt(productQuantity.value) + 1;
          }
        });

      document
        .getElementById("item-expand-close-btn")
        .addEventListener("click", () => {
          functionLibrary.ExpandedItemFormConifg("disable");
        });

      document
        .getElementById("item-expand-to-cart-btn")
        .addEventListener("click", () => {
          const orderDetails = {
            productName: product.productName,
            quantity: productQuantity.value,
          };
            functionLibrary.AddItemToCart(orderDetails);
        });
    });
}

async function ConfigureCartItemsHTML(){
  let cartItems = await Api.GetCartItems();

  let subtotal = 0;
  let cartItemsHTML = "";

  if (cartItems!= null)
    cartItems.forEach((item) => {
      cartItemsHTML += functionLibrary.CreateCartItemHTML(item);
      subtotal += item.totalPrice;
    });
  else {
    cartItemsHTML = `<p id="cart-content-empty-text"> Cart Empty </p>`;
  }

  return {
    html: cartItemsHTML,
    subtotal: subtotal,
  };
}

export async function DisplayCart() {
  const cartSection = document.getElementById("cart-section");

  let cartTableContent = await ConfigureCartItemsHTML();

  cartSection.innerHTML = `
  <div id="cart-container">
    <div id="cart-content">
      <div id="cart-close-btn">Close</div>
      <h2>Cart</h2>
      <div id="cart-content-table">
      ${cartTableContent.html}
      </div>
      <div id="cart-purchase-btn-container">
        <p id="cart-subtotal">Subtotal: ${cartTableContent.subtotal}<img src="./JojaMart_files/element_icons/18px-Gold.png" alt=""></p>
        <button id="cart-purchase-btn">Confirm Purchase</button>
      </div>
    </div>
  </div>
    `;

  const closeBtn = document.getElementById("cart-close-btn");
  const cartContainer = document.getElementById("cart-container");
  const cartTable = document.getElementById("cart-content-table");
  const cartPurchaseBtn = document.getElementById("cart-purchase-btn");

  cartPurchaseBtn.addEventListener("click", () => {
    const result = Api.OrderCartItems();
    if(result){
    functionLibrary.CartConifg("disable");
    }else{
      throw new Error(result);
    }
  })

  cartTable.addEventListener("click", async (event) => {
    const clickedItem = event.target.closest(".cart-item");
    const clickedItemDelete = event.target.closest(".cart-item-delete");

    const orderId = clickedItem.getAttribute("order-id")

    if (clickedItemDelete && clickedItem.contains(clickedItemDelete)) {
      await Api.DeleteCartItem(orderId);

      const newCartTable = document.getElementById("cart-content-table");
      const newCartSubtotal = document.getElementById("cart-subtotal");
      const newcartTableContent = await ConfigureCartItemsHTML();

      newCartTable.innerHTML = newcartTableContent.html;
      newCartSubtotal.innerHTML = `Subtotal: ${newcartTableContent.subtotal}<img src="./JojaMart_files/element_icons/18px-Gold.png" alt="">`;

    }
  });

  cartContainer.style.top = (window.scrollY / window.innerHeight) * 100 + "%";

  functionLibrary.CalculateAnimationKeyframesCart();

  functionLibrary.CartConifg("enable");

  closeBtn.addEventListener("click", () => {
    functionLibrary.CartConifg("disable");
  });
}
