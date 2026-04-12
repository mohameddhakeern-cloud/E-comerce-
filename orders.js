// =========================================
//   DHARIYA COUTURE — orders.js
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();

    // If not logged in → redirect
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    renderOrders();
});

function renderOrders() {
    const user = getCurrentUser();
    const orders = (user && user.orders) ? user.orders : [];
    const container = document.getElementById("orders-container");
    const emptyEl = document.getElementById("empty-orders");

    if (orders.length === 0) {
        container.style.display = "none";
        emptyEl.style.display = "block";
        return;
    }

    container.style.display = "block";
    emptyEl.style.display = "none";

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="order-date">${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span class="order-status">${order.status || "Delivered"}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image || 'assets/images/default-product.jpg'}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Qty: ${item.qty || item.quantity || 1}</p>
                            <p>₹${(item.price || 0).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: ₹${(order.total || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div class="order-actions">
              <button class="btn-reorder">Reorder</button>
            </div>
        </div>
    `).join('');
}