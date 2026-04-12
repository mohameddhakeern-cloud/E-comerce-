// Debug helper script for troubleshooting

function debugCheckout() {
    console.log('=== CHECKOUT DEBUG ===');
    
    // Check if user is logged in
    const user = getCurrentUser();
    console.log('Current User:', user);
    
    // Check localStorage keys
    console.log('LocalStorage Keys:');
    console.log('  dc_current_user:', localStorage.getItem('dc_current_user') ? 'EXISTS' : 'MISSING');
    console.log('  currentUser:', localStorage.getItem('currentUser') ? 'EXISTS' : 'MISSING');
    console.log('  dc_users:', localStorage.getItem('dc_users') ? 'EXISTS' : 'MISSING');
    console.log('  users:', localStorage.getItem('users') ? 'EXISTS' : 'MISSING');
    
    // Check PRODUCTS array
    console.log('PRODUCTS Array:', typeof PRODUCTS !== 'undefined' ? `Available (${PRODUCTS.length} items)` : 'NOT AVAILABLE');
    
    // Check current order
    console.log('Current Order:', window.currentOrder || 'NOT SET');
    
    // Check price breakdown
    console.log('Price Breakdown:', window.priceBreakdown || 'NOT SET');
    
    // Check form elements
    console.log('Form Elements:');
    console.log('  #addressForm:', document.getElementById('addressForm') ? 'EXISTS' : 'MISSING');
    console.log('  #order-products:', document.getElementById('order-products') ? 'EXISTS' : 'MISSING');
    console.log('  #delivery-address-display:', document.getElementById('delivery-address-display') ? 'EXISTS' : 'MISSING');
    console.log('  #addressFormSection:', document.getElementById('addressFormSection') ? 'EXISTS' : 'MISSING');
}

function debugAllUsers() {
    console.log('=== ALL USERS DEBUG ===');
    const users = JSON.parse(localStorage.getItem('dc_users') || localStorage.getItem('users') || '[]');
    console.log('Total Users:', users.length);
    users.forEach((user, index) => {
        console.log(`User ${index + 1}:`, {
            email: user.email,
            name: user.firstName + ' ' + user.lastName,
            addresses: user.addresses ? user.addresses.length : 0,
            orders: user.orders ? user.orders.length : 0
        });
    });
}

function testLocalStorage() {
    console.log('=== TESTING LOCALSTORAGE ===');
    
    // Test write
    const testData = { test: 'value', timestamp: Date.now() };
    localStorage.setItem('test_key', JSON.stringify(testData));
    
    // Test read
    const readData = JSON.parse(localStorage.getItem('test_key') || '{}');
    console.log('Test Write/Read:', readData.test === 'value' ? 'OK' : 'FAILED');
    
    // Cleanup
    localStorage.removeItem('test_key');
}

// Run on page load
window.addEventListener('load', function() {
    console.log('Page Loaded. Run debugCheckout(), debugAllUsers(), or testLocalStorage() in console');
});
