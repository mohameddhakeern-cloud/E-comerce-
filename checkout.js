// checkout.js - Handles checkout page functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    // Small delay to ensure all scripts are loaded
    setTimeout(function() {
        // Load cart items instead of single product
        loadCartItems();

        // Load delivery address
        loadDeliveryAddress();

        // Handle address form submission
        const addressForm = document.getElementById('addressForm');
        if (addressForm) {
            addressForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveAddress();
            });
        }

        // Update UI based on login status
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }

        // Initialize price calculations
        updatePriceBreakdown();
    }, 300);
});

function loadCartItems() {
    console.log('Loading cart items for checkout');
    
    const cart = getCart();
    console.log('Cart items:', cart);
    
    if (!cart || cart.length === 0) {
        const productsContainer = document.getElementById('order-products');
        if (productsContainer) {
            productsContainer.innerHTML = '<p style="color: #dc3545; text-align: center; padding: 20px;">Your cart is empty. <a href="collection.html" style="color: var(--gold);">Continue shopping</a></p>';
        }
        return;
    }

    let totalSubtotal = 0;
    let cartItems = [];

    cart.forEach((item, index) => {
        // Ensure price is a number
        const price = parseFloat(item.price) || 0;
        const qty = item.qty || item.quantity || 1;
        const itemTotal = price * qty;
        totalSubtotal += itemTotal;

        cartItems.push({
            ...item,
            price: price,
            qty: qty,
            itemTotal: itemTotal
        });
    });

    // Generate HTML for all cart items
    let productsHTML = '';
    cartItems.forEach((item, index) => {
        productsHTML += `
            <div class="order-product-item">
                <img src="${item.image || 'Image/placeholder.jpg'}" alt="${item.name || 'Product'}" class="order-product-image" onerror="this.src='Image/placeholder.jpg'">
                <div class="order-product-details">
                    <div class="order-product-name">${item.name || 'Product'}</div>
                    <div class="order-product-meta">
                        Quantity: <strong>${item.qty}</strong>
                    </div>
                    <div class="order-product-meta">
                        Price per item: <strong>₹${item.price.toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="order-product-price">Total: ₹${item.itemTotal.toLocaleString('en-IN')}</div>
                </div>
            </div>
        `;
    });

    const productsContainer = document.getElementById('order-products');
    if (productsContainer) {
        productsContainer.innerHTML = productsHTML;
    }

    // Store cart data for calculations
    window.currentOrder = {
        items: cartItems,
        subtotal: totalSubtotal,
        totalItems: cartItems.length
    };

    updatePriceBreakdown();
}

function loadDeliveryAddress() {
    const user = getCurrentUser();
    const addressDisplay = document.getElementById('delivery-address-display');

    console.log('Loading delivery address, user:', user);

    if (!addressDisplay) {
        console.error('Address display element not found');
        return;
    }

    if (!user || !user.addresses || user.addresses.length === 0) {
        console.log('No addresses found, showing form');
        addressDisplay.innerHTML = `
            <div class="address-display-item">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <span>No delivery address found. Please add an address to continue.</span>
            </div>
        `;
        showAddressForm();
        return;
    }

    // Use the most recent address (last in array)
    const address = user.addresses[user.addresses.length - 1];
    console.log('Using address:', address);

    const addressHTML = `
        <div class="address-display-item">
            <i class="fa-solid fa-user"></i>
            <span><strong>${address.fullName}</strong></span>
        </div>
        <div class="address-display-item">
            <i class="fa-solid fa-phone"></i>
            <span>${address.phone}</span>
        </div>
        <div class="address-display-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>${address.address}, ${address.city}, ${address.state} - ${address.pincode}</span>
        </div>
    `;

    addressDisplay.innerHTML = addressHTML;
    hideAddressForm();
}

function showAddressForm() {
    const formSection = document.getElementById('addressFormSection');
    const addressSection = document.querySelector('.checkout-section:has(#delivery-address-display)');
    
    if (formSection) {
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (addressSection) addressSection.style.display = 'none';
}

function hideAddressForm() {
    const formSection = document.getElementById('addressFormSection');
    const addressSection = document.querySelector('.checkout-section:has(#delivery-address-display)');
    
    if (formSection) formSection.style.display = 'none';
    if (addressSection) addressSection.style.display = 'block';
}

function saveAddress() {
    console.log('Saving address...');
    
    const user = getCurrentUser();
    if (!user) {
        console.error('User not logged in');
        showToast('Please login to place an order.', 'error');
        window.location.href = 'login.html';
        return;
    }

    const addressData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        pincode: document.getElementById('pincode').value.trim()
    };

    console.log('Address data:', addressData);

    // Validate required fields
    if (!addressData.fullName || !addressData.phone || !addressData.address ||
        !addressData.city || !addressData.state || !addressData.pincode) {
        console.error('Missing required fields');
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    // Save address to user profile
    user.addresses = user.addresses || [];
    user.addresses.push(addressData);

    console.log('Updated user:', user);

    // Update user in localStorage - check both possible keys
    let users = JSON.parse(localStorage.getItem('dc_users') || '[]');
    if (users.length === 0) {
        users = JSON.parse(localStorage.getItem('users') || '[]');
    }
    
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        // Save with correct keys
        localStorage.setItem('dc_users', JSON.stringify(users));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('dc_current_user', JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        console.log('Address saved successfully');
        showToast('Address saved successfully!', 'success');

        // Hide form and show address display
        setTimeout(() => {
            hideAddressForm();
            loadDeliveryAddress();
        }, 500);
    } else {
        console.error('User not found in users array');
        showToast('Error saving address. Please try again.', 'error');
    }
}

function updatePriceBreakdown() {
    if (!window.currentOrder) return;

    const { subtotal } = window.currentOrder;

    // Calculate discount (example: 10% off for orders above ₹1000)
    const discount = subtotal > 1000 ? Math.round(subtotal * 0.1) : 0;

    // Delivery charges (free above ₹999)
    const deliveryCharges = subtotal >= 999 ? 0 : 99;

    // Tax (GST 18% on the amount after discount)
    const taxableAmount = subtotal - discount;
    const tax = Math.round(taxableAmount * 0.18);

    // Platform fee (fixed ₹10)
    const platformFee = 10;

    // Total
    const total = subtotal - discount + deliveryCharges + tax + platformFee;

    // Update UI
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('discount').textContent = discount > 0 ? `-₹${discount}` : '₹0';
    document.getElementById('delivery-charges').textContent = deliveryCharges > 0 ? `₹${deliveryCharges}` : 'FREE';
    document.getElementById('tax').textContent = `₹${tax}`;
    document.getElementById('platform-fee').textContent = `₹${platformFee}`;
    document.getElementById('total-amount').textContent = `₹${total}`;

    // Show savings message if applicable
    const savingsElement = document.getElementById('savings-message');
    if (discount > 0) {
        savingsElement.textContent = `You saved ₹${discount}!`;
        savingsElement.style.display = 'block';
    } else {
        savingsElement.style.display = 'none';
    }

    // Store for coupon calculations
    window.priceBreakdown = {
        subtotal,
        discount,
        deliveryCharges,
        tax,
        platformFee,
        total
    };
}

function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    const messageElement = document.getElementById('coupon-message');

    if (!couponCode) {
        messageElement.textContent = 'Please enter a coupon code';
        messageElement.className = 'coupon-message error';
        return;
    }

    // Example coupon codes
    const validCoupons = {
        'DHARIYA10': { type: 'percentage', value: 10, minOrder: 500 },
        'DHARIYA20': { type: 'percentage', value: 20, minOrder: 1500 },
        'FLAT100': { type: 'fixed', value: 100, minOrder: 800 },
        'FREESHIP': { type: 'shipping', value: 0, minOrder: 0 }
    };

    const coupon = validCoupons[couponCode];

    if (!coupon) {
        messageElement.textContent = 'Invalid coupon code';
        messageElement.className = 'coupon-message error';
        return;
    }

    const { subtotal } = window.priceBreakdown;

    if (subtotal < coupon.minOrder) {
        messageElement.textContent = `Minimum order value of ₹${coupon.minOrder} required`;
        messageElement.className = 'coupon-message error';
        return;
    }

    // Apply coupon
    let additionalDiscount = 0;
    let message = '';

    switch (coupon.type) {
        case 'percentage':
            additionalDiscount = Math.round(subtotal * (coupon.value / 100));
            message = `${coupon.value}% discount applied!`;
            break;
        case 'fixed':
            additionalDiscount = coupon.value;
            message = `₹${coupon.value} discount applied!`;
            break;
        case 'shipping':
            // This would set delivery charges to 0
            message = 'Free shipping applied!';
            break;
    }

    // Update discount
    window.priceBreakdown.discount += additionalDiscount;
    window.appliedCoupon = { code: couponCode, discount: additionalDiscount };

    messageElement.textContent = message;
    messageElement.className = 'coupon-message success';

    // Clear input
    document.getElementById('couponCode').value = '';

    // Update price breakdown
    updatePriceBreakdown();
}

function placeOrder() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to place an order.', 'error');
        window.location.href = 'login.html';
        return;
    }

    if (!user.addresses || user.addresses.length === 0) {
        showToast('Please add a delivery address.', 'error');
        showAddressForm();
        return;
    }

    if (!window.currentOrder || !window.currentOrder.items || window.currentOrder.items.length === 0) {
        showToast('Your cart is empty.', 'error');
        window.location.href = 'cart.html';
        return;
    }

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Create order object
    const order = {
        id: 'ORD' + Date.now(),
        items: window.currentOrder.items,
        subtotal: window.currentOrder.subtotal,
        priceBreakdown: window.priceBreakdown,
        address: user.addresses[user.addresses.length - 1],
        paymentMethod: paymentMethod,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        appliedCoupon: window.appliedCoupon || null
    };

    console.log('Creating order:', order);

    // Save order to user profile
    user.orders = user.orders || [];
    user.orders.push(order);

    // Clear the cart after successful order
    saveCart([]);

    // Update user in localStorage - use correct keys
    let users = JSON.parse(localStorage.getItem('dc_users') || '[]');
    if (users.length === 0) {
        users = JSON.parse(localStorage.getItem('users') || '[]');
    }
    
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        // Save with correct keys
        localStorage.setItem('dc_users', JSON.stringify(users));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('dc_current_user', JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        console.log('Order saved successfully');
        showToast('Order placed successfully! Redirecting to orders...', 'success');

        // Redirect to orders page after a short delay
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 2000);
    } else {
        console.error('User not found in users array');
        showToast('Error placing order. Please try again.', 'error');
    }
}