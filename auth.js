// =========================================
//   DHARIYA COUTURE — AUTH.JS
// =========================================


// =========================================
//   PASSWORD HASHING (SHA-256 via Web Crypto)
// =========================================
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


// =========================================
//   LOGIN
// =========================================
async function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const msgEl = document.getElementById("login-msg");

    if (!username || !password) {
        showMsg(msgEl, "Please fill in all fields ⚠️", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("dc_users")) || [];

    //  Compare hashed password
    const hashedPassword = await hashPassword(password);
    const user = users.find(
        u => u.username === username && u.password === hashedPassword
    );

    if (user) {

        //  Merge guest cart & wishlist into user account on login
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
        const guestWishlist = JSON.parse(localStorage.getItem("guest_wishlist")) || [];

        if (guestCart.length > 0) {
            // Merge: avoid duplicates by productId
            const mergedCart = [...user.cart];
            guestCart.forEach(guestItem => {
                const existing = mergedCart.find(i => i.productId === guestItem.productId);
                if (existing) {
                    existing.quantity = (existing.quantity || 1) + (guestItem.quantity || 1);
                } else {
                    mergedCart.push(guestItem);
                }
            });
            user.cart = mergedCart;
        }

        if (guestWishlist.length > 0) {
            const mergedWishlist = [...new Set([...user.wishlist, ...guestWishlist])];
            user.wishlist = mergedWishlist;
        }

        // Clear guest data after merge
        localStorage.removeItem("guest_cart");
        localStorage.removeItem("guest_wishlist");

        // Update merged user back to storage
        let allUsers = JSON.parse(localStorage.getItem("dc_users")) || [];
        allUsers = allUsers.map(u => u.id === user.id ? user : u);
        localStorage.setItem("dc_users", JSON.stringify(allUsers));

        // Store session
        localStorage.setItem("dc_current_user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");

        showMsg(msgEl, "Login successful! Redirecting... ✅", "success");

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 1000);

    } else {
        showMsg(msgEl, "Invalid username or password ❌", "error");
    }
}


// =========================================
//   SIGNUP
// =========================================
async function signup() {

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

    //  Check both username AND email for duplicates
    const usernameTaken = users.find(u => u.username === username);
    if (usernameTaken) {
        showMsg(msgEl, "Username already taken ❌", "error");
        return;
    }

    const emailTaken = users.find(u => u.email === email);
    if (emailTaken) {
        showMsg(msgEl, "An account with this email already exists ❌", "error");
        return;
    }

    //  Hash password before storing
    const hashedPassword = await hashPassword(password);

    // CREATE FULL USER PROFILE
    const newUser = {
        id: Date.now(),
        username,
        email,
        password: hashedPassword,  // ✅ hashed, never plain text

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
//  Wrapped in try/catch to prevent crash on corrupted JSON
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("dc_current_user")) || null;
    } catch (e) {
        console.error("Failed to parse current user from localStorage:", e);
        localStorage.removeItem("dc_current_user"); // clean up bad data
        return null;
    }
}


// =========================================
//   UPDATE USER
// =========================================
function updateCurrentUser(updatedData) {

    let users;
    try {
        users = JSON.parse(localStorage.getItem("dc_users")) || [];
    } catch {
        users = [];
    }

    let currentUser = getCurrentUser();
    if (!currentUser) return;

    // Merge new data
    currentUser = { ...currentUser, ...updatedData };

    // Update in users array
    users = users.map(u =>
        u.id === currentUser.id ? currentUser : u
    );

    // Save
    localStorage.setItem("dc_users", JSON.stringify(users));
    localStorage.setItem("dc_current_user", JSON.stringify(currentUser));
}


// =========================================
//   LOGOUT
// =========================================
function handleLogout(e) {
    if (e) e.preventDefault();

    if (!confirm("Are you sure you want to logout?")) return;

    // Clear session data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("dc_current_user");
    localStorage.removeItem("currentUser");

    // FIX #5: Show toast THEN redirect — toast is shown before page unloads
    showToast("Logged out successfully. See you soon!", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500); // slightly longer so toast is visible
}


// =========================================
//   HELPERS
// =========================================

//  showMsg now auto-clears after 4 seconds
function showMsg(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.style.color = type === "success" ? "#90ee90" : "#ffcccc";

    // Auto-clear after 4s
    clearTimeout(el._msgTimer);
    el._msgTimer = setTimeout(() => {
        el.textContent = "";
    }, 4000);
}


// =========================================
//   TOAST NOTIFICATION
// =========================================
function showToast(message, type = "info") {
    const existing = document.getElementById("dc-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "dc-toast";
    toast.innerText = message;

    // Inline styles so toast works on any page without extra CSS
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        zIndex: "9999",
        opacity: "1",
        transition: "opacity 0.3s ease",
        background: type === "success" ? "#2d6a4f" : type === "error" ? "#7b2d2d" : "#333",
        color: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// =========================================
//   UPDATE AUTH UI
// =========================================
//  Uses querySelectorAll so it works across any page structure
function updateAuthUI() {
    try {
        const user = getCurrentUser();

        // Support multiple login/logout links by class or ID
        document.querySelectorAll("[data-auth='login']").forEach(el => {
            el.style.display = user ? "none" : "block";
        });

        document.querySelectorAll("[data-auth='logout']").forEach(el => {
            el.style.display = user ? "block" : "none";
        });

        // Fallback: also support the original hardcoded IDs
        const ids = {
            "login-link": !user,
            "logout-link": !!user,
            "side-login-link": !user,
            "side-logout-link": !!user,
        };

        for (const [id, show] of Object.entries(ids)) {
            const el = document.getElementById(id);
            if (el) el.style.display = show ? "block" : "none";
        }

    } catch (e) {
        console.error("Error updating auth UI:", e);
    }
}


// =========================================
//   CART HELPERS
// =========================================
function getCart() {
    const user = getCurrentUser();
    if (user) return user.cart || [];
    try {
        return JSON.parse(localStorage.getItem("guest_cart")) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    const user = getCurrentUser();
    if (user) {
        updateCurrentUser({ cart });
    } else {
        localStorage.setItem("guest_cart", JSON.stringify(cart));
    }
}


// =========================================
//   WISHLIST HELPERS
// =========================================
function getWishlist() {
    const user = getCurrentUser();
    if (user) return user.wishlist || [];
    try {
        return JSON.parse(localStorage.getItem("guest_wishlist")) || [];
    } catch {
        return [];
    }
}

function saveWishlist(wishlist) {
    const user = getCurrentUser();
    if (user) {
        updateCurrentUser({ wishlist });
    } else {
        localStorage.setItem("guest_wishlist", JSON.stringify(wishlist));
    }
}