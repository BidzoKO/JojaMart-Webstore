
const carousel = document.querySelector(".limited-items-container");
const scrollArrows = document.querySelectorAll(".catalog-arrow");
const popularItem = document.querySelector(".limited-offers-item");

let popularItemWidth = (2*popularItem.clientWidth) + 50;

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

function disableScroll() {
  let scrollY = window.scrollY;
  let scrollX = window.scrollX;

  window.onscroll = function() {
    window.scrollTo(scrollX, scrollY);
};
}

function enableScroll() {
  window.onscroll = function() {};
}

document.querySelector(".login-btn").addEventListener("click", () => {
  document.querySelector(".login-form").classList.add("active");
  disableScroll();
});

document.querySelector(".close-btn").addEventListener("click", () =>{
  document.querySelector(".login-form").classList.remove("active");
  enableScroll();
});

// #endregion login



