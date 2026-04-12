let wishlist = getWishlist();
const container = document.getElementById("wishlistContainer");
const empty = document.getElementById("emptyWishlist");

function renderWishlist() {
    container.innerHTML = "";

    if (wishlist.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    wishlist.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("wishlist-card");

        card.innerHTML = `
            <div class="wishlist-img">
                <img src="${item.image}">
                <button class="remove-icon" onclick="removeItem(${index})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="wishlist-info">
                <h3>${item.name}</h3>

                <div class="price-box">
                    <span class="price">₹${item.price}</span>
                </div>

                <button class="move-btn" onclick="moveToCart(${index})">
                    MOVE TO BAG
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function removeItem(index) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    renderWishlist();
    if (typeof updateWishlistUI === 'function') updateWishlistUI();
}

function moveToCart(index) {
    let cart = getCart();
    const wishlistItem = wishlist[index];

    // Ensure proper cart item format
    const cartItem = {
        name: wishlistItem.name,
        price: parseFloat(wishlistItem.price) || 0,
        qty: 1,
        image: wishlistItem.image
    };

    cart.push(cartItem);

    wishlist.splice(index, 1);

    saveCart(cart);
    saveWishlist(wishlist);

    renderWishlist();
    if (typeof updateWishlistUI === 'function') updateWishlistUI();
    if (typeof updateCartUI === 'function') updateCartUI();
}

renderWishlist();

