// =========================================
//   DHARIYA COUTURE — cart.js
// =========================================

const SHIPPING_FEE = 50;
const FREE_SHIPPING_THRESHOLD = 999;

// ---- Run on page load ----
document.addEventListener("DOMContentLoaded", function () {
    renderCart();
});

// ---- Helpers ----
// getCart() and saveCart() are now in auth.js

// ---- RENDER CART ----
function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    const emptyCartEl = document.getElementById("empty-cart");
    const cartWrapper = document.getElementById("cart-wrapper");

    if (!container) return;

    // Empty state
    if (cart.length === 0) {
        if (cartWrapper) cartWrapper.style.display = "none";
        if (emptyCartEl) emptyCartEl.style.display = "flex";
        updateSummary(0);
        updateCartUI();
        return;
    }

    if (cartWrapper) cartWrapper.style.display = "flex";
    if (emptyCartEl) emptyCartEl.style.display = "none";

    // Build HTML once — avoid innerHTML += in loop
    let html = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        // FIX: support both 'qty' and 'quantity' keys for safety
        const qty = item.qty || item.quantity || 1;
        // Ensure price is a number
        const price = parseFloat(item.price) || 0;
        const itemTotal = price * qty;
        subtotal += itemTotal;

        html += `
            <div class="cart-item">
                <img src="${item.image || 'dress1.jpg'}" alt="${item.name || 'Product'}">
                <div class="item-details">
                    <h4>${item.name || 'Product'}</h4>
                    <p class="item-price">₹${price.toLocaleString('en-IN')}</p>
                    <div class="quantity">
                        <button onclick="changeQty(${index}, -1)">&#8722;</button>
                        <span>${qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeItem(${index})">
                            <i class="fa-solid fa-trash-can"></i> Remove
                        </button>
                    </div>
                </div>
                <div class="item-total">
                    <strong>₹${itemTotal.toLocaleString('en-IN')}</strong>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateSummary(subtotal);
    updateCartUI(); // refresh navbar badge
}

// ---- CHANGE QUANTITY ----
function changeQty(index, delta) {
    const cart = getCart();

    // Normalise key to 'qty'
    if (cart[index].quantity !== undefined) {
        cart[index].qty = cart[index].quantity;
        delete cart[index].quantity;
    }

    cart[index].qty += delta;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

// ---- REMOVE ITEM ----
function removeItem(index) {
    const cart = getCart();
    const removed = cart.splice(index, 1);
    saveCart(cart);
    renderCart();

    if (removed.length && typeof showToast === "function") {
        showToast('"' + removed[0].name + '" removed from cart');
    }
}

// ---- UPDATE ORDER SUMMARY ----
function updateSummary(subtotal) {
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
    const discount = 0; // For now, no automatic discount
    const total = subtotal + shipping - discount;

    const subtotalEl = document.getElementById("subtotal");
    const deliveryEl = document.getElementById("delivery");
    const discountEl = document.getElementById("discount");
    const discountRowEl = document.getElementById("discount-row");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.innerText = "₹" + subtotal.toLocaleString('en-IN');
    if (deliveryEl) {
        deliveryEl.innerText = isFreeShipping ? "FREE" : "₹" + shipping;
        deliveryEl.style.color = isFreeShipping ? "#14958f" : "inherit";
    }
    if (discountEl) discountEl.innerText = "-₹" + discount.toLocaleString('en-IN');
    if (discountRowEl) {
        discountRowEl.style.display = discount > 0 ? "flex" : "none";
    }
    if (totalEl) totalEl.innerText = "₹" + total.toLocaleString('en-IN');

    updateShippingHint(subtotal, isFreeShipping);
}

// ---- SHIPPING HINT ----
function updateShippingHint(subtotal, isFreeShipping) {
    let hint = document.getElementById("shipping-hint");
    if (!hint) {
        hint = document.createElement("p");
        hint.id = "shipping-hint";
        hint.style.cssText = [
            "font-size: 12px",
            "font-weight: 600",
            "color: #14958f",
            "margin-top: 14px",
            "text-align: center",
            "padding: 8px 10px",
            "background: #f0faf9",
            "border-radius: 3px"
        ].join(";");
        const summary = document.querySelector(".cart-summary");
        if (summary) summary.appendChild(hint);
    }

    if (isFreeShipping) {
        hint.textContent = "You have unlocked FREE delivery!";
    } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        hint.textContent = "Add Rs." + remaining + " more for FREE delivery!";
    }
}

// ---- GO TO CHECKOUT ----
function goToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        if (typeof showToast === "function") showToast("Your cart is empty!");
        return;
    }

    // Redirect to checkout page
    window.location.href = "checkout.html";
}