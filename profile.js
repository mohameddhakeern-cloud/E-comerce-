// =========================================
//   DHARIYA COUTURE — PROFILE.JS (FINAL)
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const user = getCurrentUser();

    // If not logged in → redirect
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // ========================
    // DISPLAY TOP BANNER
    // ========================

    document.getElementById("displayName").textContent =
        (user.firstName || "") + " " + (user.lastName || "");

    document.getElementById("displayEmail").textContent =
        user.email || "";

    // ========================
    // BADGES
    // ========================
    const ordersCount = (user.orders || []).length;
    const wishlistCount = (user.wishlist || []).length;

    document.querySelector(".badges-row .tag:nth-child(2)").innerHTML =
        `<i class="fa-solid fa-box"></i> ${ordersCount} Orders`;

    document.querySelector(".badges-row .tag:nth-child(3)").innerHTML =
        `<i class="fa-regular fa-heart"></i> ${wishlistCount} Wishlist`;

    // ========================
    // FORM FIELDS
    // ========================

    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";

    // ========================
    // AVATAR
    // ========================

    const avatarImg = document.getElementById("avatarImg");

    if (user.avatar) {
        avatarImg.src = user.avatar;
    }

});


// =========================================
//   EDIT TOGGLE
// =========================================

const editBtn = document.getElementById("editToggle");
const inputs = document.querySelectorAll("#profileForm input");
const formActions = document.getElementById("formActions");

let isEditing = false;

editBtn.addEventListener("click", () => {

    isEditing = !isEditing;

    inputs.forEach(input => input.disabled = !isEditing);

    formActions.hidden = !isEditing;

    editBtn.textContent = isEditing ? "Cancel" : "Edit";
});


// =========================================
//   SAVE PROFILE
// =========================================

document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        avatar: document.getElementById("avatarImg").src
    };

    // 🔥 IMPORTANT: updates both current user + users array
    updateCurrentUser(updatedData);

    alert("Profile updated successfully ✅");

    location.reload();
});


// =========================================
//   AVATAR UPLOAD (LIVE PREVIEW)
// =========================================

const avatarInput = document.getElementById("avatarInput");

avatarInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function () {

            document.getElementById("avatarImg").src = reader.result;

            // Save instantly
            updateCurrentUser({
                avatar: reader.result
            });
        };

        reader.readAsDataURL(file);
    }
});


// =========================================
//   LOGOUT BUTTON (SIDEBAR)
// =========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        handleLogout();
    });
}


// =========================================
//   TAB SWITCHING
// =========================================

const tabItems = document.querySelectorAll('.tab-item');
const tabPanels = document.querySelectorAll('.tab-panel');

tabItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all tabs and panels
        tabItems.forEach(tab => tab.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked tab
        item.classList.add('active');

        // Show corresponding panel
        const tabName = item.getAttribute('data-tab');
        const targetPanel = document.getElementById(`tab-${tabName}`);
        if (targetPanel) {
            targetPanel.classList.add('active');

            // Load addresses if addresses tab is selected
            if (tabName === 'addresses') {
                loadAddresses();
            }
        }
    });
});


// =========================================
//   LOAD ADDRESSES
// =========================================

function loadAddresses() {
    const user = getCurrentUser();
    const addressesList = document.getElementById('addresses-list');

    if (!user || !user.addresses || user.addresses.length === 0) {
        addressesList.innerHTML = '<p class="no-addresses">No saved addresses found. <a href="checkout.html">Add your first address</a></p>';
        return;
    }

    let addressesHTML = '';
    user.addresses.forEach((address, index) => {
        addressesHTML += `
            <div class="address-card">
                <div class="address-info">
                    <h4>${address.fullName}</h4>
                    <p>${address.address}</p>
                    <p>${address.city}, ${address.state} - ${address.pincode}</p>
                    <p><strong>Phone:</strong> ${address.phone}</p>
                </div>
                <div class="address-actions">
                    <button class="btn-edit" onclick="editAddress(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteAddress(${index})">Delete</button>
                </div>
            </div>
        `;
    });

    addressesList.innerHTML = addressesHTML;
}


// =========================================
//   ADDRESS MANAGEMENT FUNCTIONS
// =========================================

function editAddress(index) {
    // For now, redirect to checkout to edit (can be enhanced later)
    alert('Edit functionality coming soon. Please add a new address for now.');
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        const user = getCurrentUser();
        user.addresses.splice(index, 1);

        // Update user in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
        }

        loadAddresses(); // Reload addresses
        alert('Address deleted successfully.');
    }
}