const PRODUCTS = [
    {
        slug: 'men-cargo-pants',
        name: 'Men Cargo Pants',
        price: 1299,
        image: 'Image/darkblueTshirt.jpg',
        gender: 'men',
        category: 'men-pants',
        type: 'pants',
        description: 'A relaxed fit cargo pant with premium stitching and a soft finish. Perfect for everyday style.'
    },
    {
        slug: 'men-linen-shirt',
        name: 'Men Linen Shirt',
        price: 1499,
        image: 'Image/darkgreyShirt.jpg',
        gender: 'men',
        category: 'men-shirts',
        type: 'shirts',
        description: 'Lightweight linen shirt built for breathable comfort and modern tailoring.'
    },
    {
        slug: 'men-grey-tshirt',
        name: 'Men Grey T-Shirt',
        price: 999,
        image: 'Image/greyTshirt.jpg',
        gender: 'men',
        category: 'men-tshirts',
        type: 'tshirts',
        description: 'Essential grey tee with a clean cut and soft, premium cotton feel.'
    },
    {
        slug: 'men-navy-tshirt',
        name: 'Men Navy T-Shirt',
        price: 1299,
        image: 'Image/navyblueTshirt.jpeg',
        gender: 'men',
        category: 'men-tshirts',
        type: 'tshirts',
        description: 'Bold navy tone with stretch fabric for a sharp, comfortable finish.'
    },
    {
        slug: 'men-classic-shirt',
        name: 'Men Classic Shirt',
        price: 1399,
        image: 'Image/darkgreyShirt.jpg',
        gender: 'men',
        category: 'men-shirts',
        type: 'shirts',
        description: 'Smart classic shirt with a crisp collar and polished everyday style.'
    },
    {
        slug: 'women-printed-top',
        name: 'Women Printed Top',
        price: 1099,
        image: 'Image/White.jpeg',
        gender: 'women',
        category: 'women-tops',
        type: 'tops',
        description: 'Elegant printed top with delicate texture and a flattering silhouette.'
    },
    {
        slug: 'women-maroon-lehenga',
        name: 'Women Maroon Lehenga',
        price: 2799,
        image: 'Image/Maroon.jpeg',
        gender: 'women',
        category: 'women-lehangas',
        type: 'lehangas',
        description: 'Rich maroon lehenga crafted with festive embroidery for special occasions.'
    },
    {
        slug: 'women-black-tshirt',
        name: 'Women Black T-Shirt',
        price: 1299,
        image: 'Image/blackTshirt.jpg',
        gender: 'women',
        category: 'women-tshirts',
        type: 'tshirts',
        description: 'Chic black tee with lightweight stretch for a city-ready everyday look.'
    },
    {
        slug: 'women-ivory-lehenga',
        name: 'Women Ivory Lehenga',
        price: 2899,
        image: 'Image/dress2.jpeg',
        gender: 'women',
        category: 'women-lehangas',
        type: 'lehangas',
        description: 'Soft ivory lehenga with graceful drape and elegant detailing.'
    },
    {
        slug: 'women-red-tshirt',
        name: 'Women Red T-Shirt',
        price: 1299,
        image: 'Image/redTshirt.jpg',
        gender: 'women',
        category: 'women-tshirts',
        type: 'tshirts',
        description: 'Bright red tee with polished stitching and comfortable stretch fabric.'
    },
    {
        slug: 'women-white-tshirt',
        name: 'Women White T-Shirt',
        price: 1299,
        image: 'Image/whiteTshirt.jpg',
        gender: 'women',
        category: 'women-tshirts',
        type: 'tshirts',
        description: 'Crisp white tee designed for layering or clean standalone styling.'
    } ,
   
];

function findProduct(slug) {
    return PRODUCTS.find(item => item.slug === slug);
}

function viewProduct(event, slug) {
    if (event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
    }
    window.location.href = `product.html?product=${encodeURIComponent(slug)}`;
}

function renderProductDetail() {
    const productPage = document.getElementById('product-page');
    if (!productPage) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('product');
    const product = findProduct(slug);

    if (!product) {
        productPage.innerHTML = '<div class="empty-state"><h2>Product not found</h2><p>Please return to collections to choose another style.</p><a href="collection.html" class="primary-btn">Back to Collection</a></div>';
        return;
    }

    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-image').alt = product.name;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-description').innerText = product.description;
    document.getElementById('detail-price').innerText = `₹${product.price}`;
    document.getElementById('detail-badge').innerText = `${product.gender.toUpperCase()} • ${product.type}`;
    document.getElementById('detail-add-cart').onclick = function () {
        addToCart(product.name, product.price);
    };

    document.getElementById('detail-buy-now').onclick = function () {
        window.location.href = `checkout.html?product=${encodeURIComponent(product.slug)}`;
    };

    const detailWishlist = document.getElementById('detail-wishlist');
    if (detailWishlist) {
        detailWishlist.dataset.name = product.name;
        detailWishlist.dataset.price = product.price;
        detailWishlist.dataset.image = product.image;
    }

    renderSuggestions(product);
}

function renderSuggestions(product) {
    const suggestionsGrid = document.getElementById('suggestions-grid');
    if (!suggestionsGrid) return;

    const related = PRODUCTS.filter(item => item.slug !== product.slug && (item.gender === product.gender || item.category === product.category));
    suggestionsGrid.innerHTML = '';

    related.slice(0, 4).forEach(item => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.dataset.slug = item.slug;
        card.onclick = () => viewProduct(null, item.slug);
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="info">
                <h4>${item.name}</h4>
                <p class="price">₹${item.price}</p>
            </div>
        `;
        suggestionsGrid.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', function () {
    renderProductDetail();
});
