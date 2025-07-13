let allProducts = [];

fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    renderProducts(allProducts);
    updateCartCount();
    updateWishlistCount();
  })
  .catch(err => console.error("Failed to load products:", err));

// Filter event listeners
document.querySelectorAll(".filter-gender, .filter-size, .filter-price").forEach(cb => {
  cb.addEventListener("change", applyFilters);
});

document.getElementById("clear-filters").addEventListener("click", () => {
  document.querySelectorAll(".filter-gender, .filter-size, .filter-price").forEach(cb => {
    cb.checked = false;
  });
  renderProducts(allProducts);
});

// Filter logic
function applyFilters() {
  const genders = Array.from(document.querySelectorAll(".filter-gender:checked")).map(cb => cb.value);
  const sizes = Array.from(document.querySelectorAll(".filter-size:checked")).map(cb => cb.value);
  const prices = Array.from(document.querySelectorAll(".filter-price:checked")).map(cb => cb.value);

  let filtered = allProducts;

  if (!genders.includes("All") && genders.length > 0) {
    filtered = filtered.filter(product => genders.includes(product.gender));
  }

  if (sizes.length > 0) {
    filtered = filtered.filter(product => product.sizes.some(s => sizes.includes(s.toString())));
  }

  if (prices.length > 0) {
    filtered = filtered.filter(product =>
      prices.some(range => {
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      })
    );
  }

  renderProducts(filtered);
}

// Product rendering
function renderProducts(products) {
  const container = document.querySelector(".shop-product-list");

  if (products.length === 0) {
    container.innerHTML = `<div class="col-12"><p>No products found for selected filters.</p></div>`;
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 col-12">
      <div class="product-box h-100 d-flex flex-column">
        ${product.trending ? `<span class="badge-trending"> Trending </span>` : ""}
        <div class="product-img-container">
          <img src="${product.images[0]}" alt="${product.name}">
          <div class="product-button-container mt-auto">
            <a href="#" onclick="addToWishlist(${product.id}); return false;" class="product-btn"><i class="fa-regular fa-heart"></i></a>
            <a href="product-details.html?id=${product.id}" class="product-btn"><i class="fa-solid fa-eye"></i></a>
            <a href="#" onclick="addCardSizeToCart(${product.id}); return false;" class="product-btn"><i class="fa-solid fa-cart-plus"></i></a>
          </div>
        </div>
        <div class="product-content flex-grow-1">
          <div class="cat-rat">
            <span>${product.shoeCat}</span>
            <span>${product.rating} <i class="fa-regular fa-star"></i></span>
          </div>
          <h6>${product.name}</h6>
          <p>${product.description}</p>
          <div class="d-flex flex-wrap gap-1 my-2">
            ${product.sizes.map((size, idx) => `
              <button class="btn btn-outline-dark btn-sm size-btn ${idx === 0 ? 'active' : ''}" onclick="selectCardSize(this, '${size}', ${product.id})">${size}</button>
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
}

// 🛒 Add to Cart
function addToCart(productId, selectedSize = null) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item.id === productId && item.size === selectedSize);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1, size: selectedSize });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showCartTooltip("Added to cart");
}

function addCardSizeToCart(productId) {
  const sizeInput = document.getElementById(`selectedCardSize-${productId}`);
  const selectedSize = sizeInput ? sizeInput.value : null;

  if (!selectedSize) {
    alert("Please select a size first.");
    return;
  }

  addToCart(productId, selectedSize);
}

// ❤️ Add to Wishlist (with tooltip)
function addToWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    showWishlistTooltip("Added to wishlist");
  } else {
    showWishlistTooltip("Already in wishlist");
  }
  updateWishlistCount();
}

// ✅ Cart Tooltip
function showCartTooltip(message) {
  const tooltip = document.getElementById("cart-tooltip");
  tooltip.textContent = message;
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 2000);
}

// ✅ Wishlist Tooltip
function showWishlistTooltip(message) {
  const tooltip = document.getElementById("wishlist-tooltip");
  tooltip.textContent = message;
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 2000);
}

// Update Cart Badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

// Update Wishlist Badge
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const badge = document.querySelector(".wishlist-count");
  if (badge) badge.textContent = wishlist.length;
}

// Size select logic
function selectCardSize(btn, size, productId) {
  const allBtns = btn.closest('.product-content').querySelectorAll('.size-btn');
  allBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`selectedCardSize-${productId}`).value = size;
}
