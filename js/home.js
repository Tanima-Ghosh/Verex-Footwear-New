// Fetch products from products.json
fetch('data/products.json')
  .then(res => res.json())
  .then(data => {
    renderTrendingProducts(data);
    renderAllProducts(data);
    updateCartCount();
    updateWishlistCount();
  })
  .catch(err => console.error("Failed to load products:", err));

// Render trending products (limit to 4)
function renderTrendingProducts(products) {
  const trendingSection = document.querySelector(".trending-products");
  const trendingItems = products.filter(p => p.trending).slice(0, 4);

  trendingSection.innerHTML = trendingItems.map(product => generateTrendingHTML(product)).join('');
}

// Render first 6 products in all-products section
function renderAllProducts(products) {
  const allSection = document.querySelector(".all-products");
  const limited = products.slice(0, 6);

  allSection.innerHTML = limited.map(product => generateAllProductsHTML(product)).join('');
}

// Generate trending product card HTML
function generateTrendingHTML(product) {
  return `
    <div class="col-xl-3 col-md-6 col-sm-12 mt-3">
      <div class="product-box h-100 d-flex flex-column">
        ${product.trending ? `<span class="badge-trending"> Trending </span>` : ""}
        <div class="product-img-container">
          <img src="${product.images[0]}" alt="${product.name}">
          <div class="product-button-container mt-auto">
            <a href="#" onclick="addToWishlist(${product.id}); return false;" class="product-btn">
              <i class="fa-regular fa-heart"></i>
            </a>
            <a href="product-details.html?id=${product.id}" class="product-btn">
              <i class="fa-solid fa-eye"></i>
            </a>
            <a href="#" onclick="addCardSizeToCart(${product.id}); return false;" class="product-btn">
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
              <button class="btn btn-outline-dark btn-sm size-btn ${idx === 0 ? 'active' : ''}"
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
  `;
}

// Generate all products card HTML
function generateAllProductsHTML(product) {
  return `
    <div class="col-md-4">
      <div class="product-box h-100 d-flex flex-column">
        ${product.trending ? `<span class="badge-trending"> Trending </span>` : ""}
        <div class="product-img-container">
          <img src="${product.images[0]}" alt="${product.name}">
          <div class="product-button-container mt-auto">
            <a href="#" onclick="addToWishlist(${product.id}); return false;" class="product-btn">
              <i class="fa-regular fa-heart"></i>
            </a>
            <a href="product-details.html?id=${product.id}" class="product-btn">
              <i class="fa-solid fa-eye"></i>
            </a>
            <a href="#" onclick="addCardSizeToCart(${product.id}); return false;" class="product-btn">
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
              <button class="btn btn-outline-dark btn-sm size-btn ${idx === 0 ? 'active' : ''}"
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
  `;
}

// Add to cart with selected size
function addCardSizeToCart(productId) {
  const sizeInput = document.getElementById(`selectedCardSize-${productId}`);
  const selectedSize = sizeInput ? sizeInput.value : null;

  if (!selectedSize) {
    alert("Please select a size first.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(item => item.id === productId && item.size === selectedSize);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1, size: selectedSize });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartTooltip("Added to cart");
}
