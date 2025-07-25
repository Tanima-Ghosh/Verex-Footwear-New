const wishlistContainer = document.getElementById("wishlistItems");
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Fetch all product data
fetch("data/products.json")
  .then(res => res.json())
  .then(products => {
    const wishlistProducts = products.filter(product => wishlist.includes(product.id));

    if (wishlistProducts.length === 0) {
      wishlistContainer.innerHTML = ` <div class="col-12 text-center">
      <h5>Your wishlist is empty.</h5>
      <p>Start exploring and add items you love!</p>
      <a href="shop.html" class="common-btn mt-3">Go to Shop</a>
    </div>`;
      return;
    }

    wishlistContainer.innerHTML = wishlistProducts.map(product => `
      <div class="col-md-3">
        <div class="product-box h-100 d-flex flex-column">
          ${product.trending ? `<span class="badge-trending"> Trending </span>` : ""}

          <div class="product-img-container">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="product-button-container mt-auto">
              <a href="#" onclick="removeFromWishlist(${product.id}); return false;" class="product-btn">
                <i class="fa-solid fa-trash"></i>
              </a>
              <a href="product-details.html?id=${product.id}" class="product-btn">
                <i class="fa-solid fa-eye"></i>
              </a>
              <a href="#" onclick="addToCartFromWishlist(${product.id}); return false;" class="product-btn">
                <i class="fa-solid fa-cart-plus"></i>
              </a>
            </div>
          </div>

          <div class="product-content flex-grow-1">
            <div class="cat-rat">
              <span>${product.shoeCat}</span>
              <span>${product.rating || "0.0"} <i class="fa-regular fa-star"></i></span>
            </div>
            <h6>${product.name}</h6>
            <p>${product.description}</p>

            <div class="d-flex flex-wrap gap-1 my-2">
              ${product.sizes.map((size, idx) => `
                <button class="btn btn-outline-dark btn-sm size-btn ${idx === 0 ? "active" : ""}"
                        onclick="selectCardSize(this, '${size}', ${product.id})">${size}</button>
              `).join('')}
            </div>
            <input type="hidden" id="selectedCardSize-${product.id}" value="${product.sizes[0]}" />

            <div class="price">
              <h4>₹${product.price}</h4>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  });

// ✅ Remove item from wishlist
function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter(id => id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  showTooltip("Removed from wishlist", "wishlist-tooltip");
  setTimeout(() => location.reload(), 800);
}

// ✅ Add to cart with size + remove from wishlist
function addToCartFromWishlist(productId) {
  const sizeInput = document.getElementById(`selectedCardSize-${productId}`);
  const selectedSize = sizeInput ? sizeInput.value : null;

  if (!selectedSize) {
    alert("Please select a size first.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item.id === productId && item.size === selectedSize);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1, size: selectedSize });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Remove from wishlist
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter(id => id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  updateCartCount();
  updateWishlistCount();
  showTooltip("Added to cart & removed from wishlist", "cart-tooltip");

  setTimeout(() => location.reload(), 800);
}

// ✅ Size selection logic (like product cards)
function selectCardSize(btn, size, productId) {
  const allBtns = btn.closest(".product-content").querySelectorAll(".size-btn");
  allBtns.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`selectedCardSize-${productId}`).value = size;
}

// ✅ Tooltip
function showTooltip(message, tooltipId) {
  const tooltip = document.getElementById(tooltipId);
  if (!tooltip) return;
  tooltip.textContent = message;
  tooltip.classList.add("show");
  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 2000);
}

// ✅ Count updates
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const badge = document.querySelector(".wishlist-count");
  if (badge) badge.textContent = wishlist.length;
}

// Init count
updateCartCount();
updateWishlistCount();
