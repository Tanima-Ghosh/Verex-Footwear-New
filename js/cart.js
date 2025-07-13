document.addEventListener("DOMContentLoaded", function () {
  const cartBody = document.getElementById("cartBody");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.querySelector(".cart-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let productsData = [];

  // ✅ Add wishlist count on load
  updateWishlistCount();

  // Fetch product data
  fetch("data/products.json")
    .then(res => res.json())
    .then(data => {
      productsData = data;
      renderCart();
      updateCartCount();
    })
    .catch(err => {
      console.error("Failed to load products:", err);
      cartBody.innerHTML = "<tr><td colspan='7'>Failed to load cart data.</td></tr>";
    });

  // Render cart items
  function renderCart() {
    cartBody.innerHTML = "";
    let total = 0;

    cart.forEach((cartItem, index) => {
      const product = productsData.find(p => p.id === cartItem.id);
      if (!product) return;

      const quantity = cartItem.quantity;
      const price = product.price;
      const subtotal = price * quantity;
      total += subtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
       <tr>
          <td><img src="${product.images[0]}" width="60" class="img-fluid" alt="Product" /></td>
          <td class="text-start">${product.name} <span class="text-muted">(${cartItem.size})</span></td>
          <td>$${price.toFixed(2)}</td>
          <td>
            <div class="d-flex justify-content-center align-items-center gap-2">
              <button class="btn btn-outline-secondary btn-sm decrease" data-index="${index}">−</button>
              <span>${quantity}</span>
              <button class="btn btn-outline-secondary btn-sm increase" data-index="${index}">+</button>
            </div>
          </td>
          <td>$${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-danger btn-sm remove" data-index="${index}">Remove</button>
          </td>
        </tr>
      `;

      cartBody.appendChild(row);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Handle increase/decrease/remove
  cartBody.addEventListener("click", function (e) {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains("increase")) {
      cart[index].quantity += 1;
    } else if (e.target.classList.contains("decrease")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      }
    } else if (e.target.classList.contains("remove")) {
      cart.splice(index, 1);
    }

    renderCart();
  });

  // Update cart icon in navbar
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalItems;
    }
  }

  // Update wishlist icon in navbar
  function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const badge = document.querySelector(".wishlist-count");
    if (badge) badge.textContent = wishlist.length;
  }
});
