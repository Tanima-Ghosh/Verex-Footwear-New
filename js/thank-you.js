const orderDetails = JSON.parse(localStorage.getItem("orderDetails")) || null;

if (!orderDetails) {
  document.querySelector(".order-confirmation").innerHTML = "<p>No order details found.</p>";
} else {
  const { billingDetails, cart } = orderDetails;

  // Billing Info
  const billingHTML = `
    <h4>Billing Details</h4>
    <p><strong>Name:</strong> ${billingDetails.firstName} ${billingDetails.lastName}</p>
    <p><strong>Email:</strong> ${billingDetails.email}</p>
    <p><strong>Phone:</strong> ${billingDetails.phone}</p>
    <p><strong>City:</strong> ${billingDetails.city}</p>
    <p><strong>ZIP:</strong> ${billingDetails.zip}</p>
    <p><strong>Address:</strong> ${billingDetails.address}</p>
  `;
  document.getElementById("billingInfo").innerHTML = billingHTML;

  // Fetch product data
  fetch("data/products.json")
    .then(res => res.json())
    .then(productsData => {
      let html = `
        <h4>Order Summary</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>`;

      let total = 0;

      cart.forEach(item => {
        const product = productsData.find(p => p.id === item.id);
        if (product) {
          const subtotal = product.price * item.quantity;
          total += subtotal;

          html += `
            <tr>
              <td>${product.name}</td>
              <td>${item.size || "N/A"}</td>
              <td>${item.quantity}</td>
              <td>$${subtotal.toLocaleString()}</td>
            </tr>
          `;
        }
      });

      html += `
          </tbody>
        </table>
        <h5>Total: $${total.toLocaleString()}</h5>
      `;

      document.getElementById("orderSummary").innerHTML = html;
    });
}
