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
const logInBtn = document.getElementById("header-login-btn");

logInBtn.addEventListener("click", () => {
  console.log("login");
  assembleLoginForm();
});


const springStock = document.getElementById("header-nav-Spring")

springStock.addEventListener("click", () => {
  console.log("spring clicked");
  GetUserById();
})

// #endregion login
