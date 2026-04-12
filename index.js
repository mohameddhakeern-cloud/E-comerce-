// =========================================
//   DHARIYA COUTURE — index.js
// =========================================

// ---- SIDE NAV ----
function openNav() {
    const nav = document.querySelector(".side-navbar");
    const overlay = document.querySelector(".nav-overlay");
    if (nav) nav.classList.add("active");
    if (overlay) overlay.classList.add("active");
}

function closeNav() {
    const nav = document.querySelector(".side-navbar");
    const overlay = document.querySelector(".nav-overlay");
    if (nav) nav.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
}

// Close side nav when overlay is clicked
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.querySelector(".nav-overlay");
    if (overlay) {
        overlay.addEventListener("click", closeNav);
    }

    // ---- LOGIN / LOGOUT TOGGLE ----
    const user = getCurrentUser();
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const sideLoginLink = document.getElementById("side-login-link");
    const sideLogoutLink = document.getElementById("side-logout-link");

    if (user) {
        if (loginLink) loginLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "block";
        if (sideLoginLink) sideLoginLink.style.display = "none";
        if (sideLogoutLink) sideLogoutLink.style.display = "block";
    } else {
        if (loginLink) loginLink.style.display = "block";
        if (logoutLink) logoutLink.style.display = "none";
        if (sideLoginLink) sideLoginLink.style.display = "block";
        if (sideLogoutLink) sideLogoutLink.style.display = "none";
    }

    // ---- CONTACT FORM (only on contact page) ----
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            showToast("Message sent successfully 💌");
            contactForm.reset();
        });
    }

    // ---- INIT CART + WISHLIST UI ----
    updateCartUI();
    updateWishlistUI();
});

// ---- LOGOUT ----
// handleLogout is now in auth.js

// =========================================
//   CART — stores objects with name, price, qty
// =========================================
function getCart() {
    const user = getCurrentUser();
    if (user) {
        return user.cart || [];
    }
    return JSON.parse(localStorage.getItem("guest_cart")) || [];
}

function saveCart(cart) {
    const user = getCurrentUser();
    if (user) {
        user.cart = cart;
        updateCurrentUser({ cart });
    } else {
        localStorage.setItem("guest_cart", JSON.stringify(cart));
    }
}

function addToCart(name, price) {
    const cart = getCart();

    // Check if item already exists → increment qty
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price || 0, qty: 1 });
    }

    saveCart(cart);
    updateCartUI();
    showToast(`"${name}" added to cart 🛍️`);
}

function updateCartUI() {
    const cart = getCart();
    // Total item count (sum of all qtys)
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const el = document.getElementById("cart-count");
    if (el) el.innerText = totalCount;
}

function updateWishlistUI() {
    const count = getWishlist().length;
    document.querySelectorAll("#wishlist-count").forEach(el => {
        el.innerText = count;
    });
}

// =========================================
//   WISHLIST — stores objects with name, price, image
// =========================================
function getWishlist() {
    const user = getCurrentUser();
    if (user) {
        return user.wishlist || [];
    }
    return JSON.parse(localStorage.getItem("guest_wishlist")) || [];
}

function saveWishlist(wishlist) {
    const user = getCurrentUser();
    if (user) {
        user.wishlist = wishlist;
        updateCurrentUser({ wishlist });
    } else {
        localStorage.setItem("guest_wishlist", JSON.stringify(wishlist));
    }
}

function addToWishlist(button) {
    const card = button.closest(".product-card, .product-card-2, .product-box, .product-detail");
    if (!card) return;

    const productName = card.querySelector("h3, h4, .product-title")?.innerText || card.dataset.name || card.getAttribute('data-name');
    const productPrice = (card.querySelector(".price")?.innerText || card.dataset.price || "0").replace("₹", "");
    const productImage = card.querySelector("img")?.src || card.dataset.image || "";

    const product = {
        name: productName,
        price: productPrice,
        image: productImage
    };

    let wishlist = getWishlist();

    const exists = wishlist.some(item => item.name === product.name);

    if (!exists) {
        wishlist.push(product);
        saveWishlist(wishlist);

        // ❤️ UI change
        button.classList.add("active");
        button.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        updateWishlistUI();

        showToast("Added to Wishlist ❤️");
    } else {
        showToast("Already in Wishlist");
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

window.addEventListener("DOMContentLoaded", () => {
    let wishlist = getWishlist();

    document.querySelectorAll(".product-card, .product-box").forEach(card => {
        const name = card.querySelector("h3, h4, .name")?.innerText || card.dataset.name;

        const exists = wishlist.some(item => item.name === name);

        if (exists) {
            const btn = card.querySelector(".wishlist-btn");
            if (btn) {
                btn.classList.add("active");
                btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
            }
        }
    });
});

// =========================================
//   TOAST NOTIFICATION
// =========================================
function showToast(message) {
    // Remove existing toast if any
    const existing = document.getElementById("dc-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "dc-toast";
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        background: #111;
        color: #fff;
        padding: 12px 24px;
        border-radius: 3px;
        font-size: 13px;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        z-index: 9999;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        animation: toastIn 0.3s ease;
        letter-spacing: 0.3px;
        white-space: nowrap;
    `;

    // Inject keyframe if not already present
    if (!document.getElementById("toast-style")) {
        const style = document.createElement("style");
        style.id = "toast-style";
        style.textContent = `
            @keyframes toastIn {
                from { opacity: 0; transform: translateX(-50%) translateY(12px); }
                to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = "opacity 0.3s";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// =========================================
//   ADD TO CART BUTTON FEEDBACK
// =========================================
// Call this version from HTML: addToCartBtn(btn, 'Floral Dress', 999)
function addToCartBtn(btn, name, price) {
    addToCart(name, price);

    if (btn) {
        const original = btn.innerText;
        btn.innerText = "✓ Added";
        btn.classList.add("added");
        setTimeout(() => {
            btn.innerText = original;
            btn.classList.remove("added");
        }, 1800);
    }
}