// -------------------------
// UI EFFECTS
// -------------------------

// Sticky Navbar
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("sticky-nav");
  } else {
    navbar.classList.remove("sticky-nav");
  }
});

// Button Hover Ripple Effect
$(function () {
  $(".common-btn")
    .on("mouseenter", function (e) {
      const offset = $(this).offset();
      const relX = e.pageX - offset.left;
      const relY = e.pageY - offset.top;
      $(this).find("span").css({ top: relY, left: relX });
    })
    .on("mouseout", function (e) {
      const offset = $(this).offset();
      const relX = e.pageX - offset.left;
      const relY = e.pageY - offset.top;
      $(this).find("span").css({ top: relY, left: relX });
    });
});

// -------------------------
// PLUGINS
// -------------------------

// Owl Carousel for Banner
$(document).ready(function () {
  $(".banner-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 1000,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
    },
  });
});

// Testimonial Switching
$(document).ready(function () {
  $(".client-single").on("click", function (e) {
    e.preventDefault();
    const $this = $(this);
    const parent = $this.parents(".testi-wrap");

    if (!$this.hasClass("active")) {
      const currentPos = $this.attr("data-position");
      const $active = parent.find(".client-single.active");
      const newPos = $active.attr("data-position");

      $active
        .removeClass("active")
        .removeClass(newPos)
        .addClass("inactive")
        .addClass(currentPos)
        .attr("data-position", currentPos);

      $this
        .addClass("active")
        .removeClass("inactive")
        .removeClass(currentPos)
        .addClass(newPos)
        .attr("data-position", newPos);
    }
  });
});

// -------------------------
// ECOMMERCE UTILITIES
// -------------------------

// Update Cart Count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

// Update Wishlist Count
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const badge = document.querySelector(".wishlist-count");
  if (badge) badge.textContent = wishlist.length;
}

// Show Cart Tooltip
function showCartTooltip(message) {
  const tooltip = document.getElementById("cart-tooltip");
  if (tooltip) {
    tooltip.textContent = message;
    tooltip.classList.add("show");
    setTimeout(() => tooltip.classList.remove("show"), 2000);
  }
}

// Show Wishlist Tooltip
function showWishlistTooltip(message) {
  const tooltip = document.getElementById("wishlist-tooltip");
  if (tooltip) {
    tooltip.textContent = message;
    tooltip.classList.add("show");
    setTimeout(() => tooltip.classList.remove("show"), 2000);
  }
}

// Size Selection Handler (Reusable)
function selectCardSize(btn, size, productId) {
  const allBtns = btn.closest(".product-content").querySelectorAll(".size-btn");
  allBtns.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`selectedCardSize-${productId}`).value = size;
}

// -------------------------
// INIT ON LOAD
// -------------------------
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  updateWishlistCount();
});
