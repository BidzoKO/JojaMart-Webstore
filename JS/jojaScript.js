
const carousel = document.querySelector(".limited-item-container");
const scrollArrows = document.querySelectorAll(".catalog-arrow");
const popularItem = document.querySelector(".limited-offers-item");

let popularItemWidth = popularItem.clientWidth + 40;

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
