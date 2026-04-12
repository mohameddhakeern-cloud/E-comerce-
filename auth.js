// =========================================
//   DHARIYA COUTURE — AUTH (FINAL VERSION)
// =========================================


// =========================================
//   LOGIN
// =========================================
function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const msgEl = document.getElementById("login-msg");

    if (!username || !password) {
        showMsg(msgEl, "Please fill in all fields ⚠️", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("dc_users")) || [];

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {

        // ✅ store full user (IMPORTANT)
        localStorage.setItem("dc_current_user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");

        showMsg(msgEl, "Login successful! Redirecting... ✅", "success");

        setTimeout(() => {
            window.location.href = "profile.html"; // go to profile directly
        }, 1000);

    } else {
        showMsg(msgEl, "Invalid username or password ❌", "error");
    }
}


// =========================================
//   SIGNUP
// =========================================
function signup() {

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const msgEl = document.getElementById("login-msg");

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        showMsg(msgEl, "Please fill in all fields ⚠️", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showMsg(msgEl, "Enter a valid email ⚠️", "error");
        return;
    }

    if (password.length < 6) {
        showMsg(msgEl, "Password must be at least 6 characters ⚠️", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMsg(msgEl, "Passwords do not match ❌", "error");
        return;
    }

    let users = JSON.parse(localStorage.getItem("dc_users")) || [];

    const exists = users.find(u => u.username === username);

    if (exists) {
        showMsg(msgEl, "Username already taken ❌", "error");
        return;
    }

    // ✅ CREATE FULL USER PROFILE
    const newUser = {
        id: Date.now(),
        username,
        email,
        password,

        // Profile fields
        firstName,
        lastName,
        phone: "",

        avatar: "Image/profile default.jpeg",

        orders: [],
        wishlist: [],
        cart: []
    };

    users.push(newUser);

    localStorage.setItem("dc_users", JSON.stringify(users));

    showMsg(msgEl, "Account created! Redirecting... ✅", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1200);
}


// =========================================
//   GET CURRENT USER
// =========================================
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("dc_current_user"));
}


// =========================================
//   UPDATE USER (VERY IMPORTANT)
// =========================================
function updateCurrentUser(updatedData) {

    let users = JSON.parse(localStorage.getItem("dc_users")) || [];
    let currentUser = getCurrentUser();

    if (!currentUser) return;

    // merge new data
    currentUser = { ...currentUser, ...updatedData };

    // update in users array
    users = users.map(u =>
        u.id === currentUser.id ? currentUser : u
    );

    // save
    localStorage.setItem("dc_users", JSON.stringify(users));
    localStorage.setItem("dc_current_user", JSON.stringify(currentUser));
}


// =========================================
//   LOGOUT
// =========================================
function handleLogout(e) {
    if (e) e.preventDefault();

    // Show confirmation dialog
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    // Clear all session data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("dc_current_user");
    localStorage.removeItem("currentUser");

    // Clear any temporary cart/wishlist data if not saved to user profile
    // (In a real app, cart/wishlist would be saved to user profile)

    // Show logout message
    showToast('Logged out successfully. See you soon!', 'success');

    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}


// =========================================
//   HELPERS
// =========================================
function showMsg(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.style.color = type === "success" ? "#90ee90" : "#ffcccc";
}

// =========================================
//   TOAST NOTIFICATION
// =========================================
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existing = document.getElementById("dc-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "dc-toast";
    toast.innerText = message;
    toast.className = type === 'success' ? 'success-toast' : type === 'error' ? 'error-toast' : '';

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

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =========================================
//   UPDATE AUTH UI (FOR CHECKOUT AND OTHER PAGES)
// =========================================
function updateAuthUI() {
    try {
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
    } catch (e) {
        console.error('Error updating auth UI:', e);
    }
}
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