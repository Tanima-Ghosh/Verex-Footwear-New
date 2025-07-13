const productContainer = document.getElementById("productDetails");
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

let productData = null;
let unitPrice = 0;

// Fetch product
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    productData = data.find(p => p.id === productId);
    if (productData) {
      renderProductDetails(productData);
      updateCartCount();
      updateWishlistCount();
    } else {
      productContainer.innerHTML = "<p>Product not found.</p>";
    }
  })
  .catch(err => {
    console.error("Error loading product:", err);
    productContainer.innerHTML = "<p>Failed to load product.</p>";
  });

function renderProductDetails(product) {
  unitPrice = product.price;

  productContainer.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <img id="mainImage" src="${product.images[0]}" class="main-image mb-3" alt="${product.name}" />
        <div class="d-flex flex-wrap gap-2">
          ${product.images.map((img, i) => `
            <img src="${img}" class="thumbnail ${i === 0 ? 'active' : ''}" onclick="switchImage('${img}', this)">
          `).join('')}
        </div>
      </div>

      <div class="col-md-6">
        <h2 class="product-details-title">${product.name}</h2>
        <h4 class="product-details-edition">${product.edition}</h4>
        <ul class="sku-cat">
          <li><strong>SKU:</strong> 11</li>
          <li><strong>CATEGORY:</strong> Sneakers</li>
        </ul>
        <p class="product-details-des">${product.longDes}</p>

        <h6 class="product-size">Select Size:</h6>
        <input type="hidden" id="selectedSize" value="${product.sizes[0]}" />
<div class="mb-3 d-flex flex-wrap gap-2">
  ${product.sizes.map((size, i) => `
    <button class="btn btn-outline-dark btn-sm size-btn ${i === 0 ? 'active' : ''}" onclick="selectSize('${size}', this)">${size}</button>
  `).join("")}
      </div>
      <input type="hidden" id="selectedSize" />
        <h4 class="product-details-price">Price: ₹<span id="priceDisplay">${unitPrice.toFixed(2)}</span></h4>

        <div class="my-3 d-flex align-items-center">
          <label class="me-3 fw-bold">Quantity:</label>
          <button class="btn btn-outline-secondary btn-sm me-2" onclick="changeQty(-1)">-</button>
          <input type="number" id="qtyInput" value="1" min="1" class="form-control form-control-sm text-center" style="width: 60px;" oninput="updatePrice()">
          <button class="btn btn-outline-secondary btn-sm ms-2" onclick="changeQty(1)">+</button>
        </div>

        <div class="d-flex gap-3 mt-3">
          <a href="#" class="common-btn" onclick="addToCart(${product.id}); return false;">Add to Cart</a>
          <a href="#" class="common-btn wishlist-btn" onclick="addToWishlist(${product.id}); return false;">
            <i class="fa-regular fa-heart"></i>
          </a>
        </div>

        <div id="tooltip" class="tooltip-box"></div>
      </div>
    </div>

    <!-- Tabs -->
    <div class = "row mt-5">
        <div class = "col-md-12">

  <ul class="nav nav-pills mb-3 border-bottom border-2" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link fw-semibold active position-relative" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Description</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link fw-semibold position-relative" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Additional Information</button>
    </li>

  </ul>
  <div class="tab-content p-3" id="pills-tabContent">
    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
      <h2>Description</h2>
      <p>${product.tabDes}</p>
      <h6 class= "tab-key-feature">Key Features:</h6>
  <ul class="tab-des-list">
    ${product.features.map((item) => `<li>${item}</li>`).join("")}
  </ul>
   <h6 class = "tab-best-for">Best for:</h6>
   <p>${product.bestFor}</p>
    </div>
    <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
      <h2>Additional Description</h2>
      <div class="product-specs">
  
  <table>
    <thead>
      <tr>
        <th>Specification</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class = "table-info">Sole Material</td>
        <td>${product.soleMaterial}</td>
      </tr>
      <tr>
        <td class = "table-info">Upper Material</td>
        <td>${product.upperMaterial}</td>
      </tr>
      <tr>
        <td class = "table-info">Weight</td>
        <td>${product.weight}</td> 
      </tr>
      <tr>
        <td class = "table-info">Closure Type</td>
        <td>${product.closureType}</td>
      </tr>
      <tr>
        <td class = "table-info">Fit Type</td>
        <td>${product.fitType}</td>
      </tr>
    </tbody>
  </table>
</div>
    </div>

  </div>
</div>

    </div>
  `;
}

// Quantity logic
function changeQty(change) {
  const qtyInput = document.getElementById("qtyInput");
  let qty = parseInt(qtyInput.value);
  qty = isNaN(qty) ? 1 : qty + change;
  if (qty < 1) qty = 1;
  qtyInput.value = qty;
  updatePrice();
}

function updatePrice() {
  const qty = parseInt(document.getElementById("qtyInput").value) || 1;
  const total = unitPrice * qty;
  document.getElementById("priceDisplay").textContent = total.toFixed(2);
}

// choose size
function selectSize(size, btn) {
  document.getElementById("selectedSize").value = size;
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}


// Show tooltip message
function showTooltip(message) {
  const tooltip = document.getElementById("tooltip");
  tooltip.textContent = message;
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 2000);
}







// Update cart badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

// Update wishlist badge
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const count = wishlist.length;
  const badge = document.querySelector(".wishlist-count");
  if (badge) badge.textContent = count;
}

// Switch preview image
function switchImage(imageUrl, thumbElement) {
  document.getElementById("mainImage").src = imageUrl;
  document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
  thumbElement.classList.add("active");
}
