const cart = JSON.parse(localStorage.getItem("cart")) || [];
let productsData = [];

fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    productsData = data;
    renderSummary();
    updateCartCount();
    updateWishlistCount();
  });

function renderSummary() {
  const summaryContainer = document.getElementById("cartSummary");
  if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let html = `
    <table>
      <tr>
        <th>Image</th>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
      </tr>`;
  let total = 0;

  cart.forEach((item) => {
    const product = productsData.find((p) => p.id === item.id);
    if (product) {
      const subtotal = product.price * item.quantity;
      total += subtotal;

      html += `
        <tr>
          <td><img src="${product.images[0]}" width="50" /></td>
          <td>${product.name} <small class="text-muted">(Size: ${item.size || "N/A"})</small></td>
          <td>${item.quantity}</td>
          <td>₹${subtotal.toLocaleString()}</td>
        </tr>`;
    }
  });

  html += `</table><div class="total-line">Total: ₹${total.toLocaleString()}</div>`;
  summaryContainer.innerHTML = html;
}

// ✅ Terms Validation and Order Submission
document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const termsCheckbox = document.getElementById("terms");
  const termsError = document.getElementById("terms-error");

  if (!termsCheckbox.checked) {
    termsError.classList.remove("d-none");
    termsError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  termsError.classList.add("d-none");

  const billingDetails = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    zip: document.getElementById("zip").value,
    address: document.getElementById("address").value,
  };

  const orderDetails = {
    billingDetails,
    cart: cart,
  };

  localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "thank-you.html";
});

// ✅ Update Cart Badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

// ✅ Update Wishlist Badge
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const badge = document.querySelector(".wishlist-count");
  if (badge) badge.textContent = wishlist.length;
}
