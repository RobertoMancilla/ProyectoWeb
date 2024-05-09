document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('You must be logged in to view your wishlist');
        return;
    }
    const decoded = jwt_decode(token);
    loadWishlist(decoded.id);
});

async function loadWishlist(userId) {
    try {
        const response = await fetch(`/new/wishlist/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch wishlist');
        }
        const wishlist = await response.json();
        displayWishlistTitle(wishlist);
        displayWishlistItems(wishlist);
    } catch (error) {
        console.error('Error loading wishlist:', error);
    }
}

function displayWishlistTitle(wishlist) {
    const titleContainer = document.getElementById('titleWishlist');
    if (!titleContainer) return;

    let totalItems = wishlist.items.length;
    const titleText = `Your Wishlist (${totalItems} Item${totalItems === 1 ? '' : 's'})`;
    titleContainer.innerHTML = `<h3 class="text">${titleText}</h3>`;
}

function displayWishlistItems(wishlist) {
    // console.log("my wishlist:", wishlist);
    const container = document.querySelector('.container .row');
    container.innerHTML = ''; // Clear existing items
    if (wishlist.items.length === 0) {
        container.innerHTML = '<div class="col"><p>Your wishlist is empty.</p></div>';
        return;
    }

    wishlist.items.forEach(item => {
        const productCard = `
            <div class="col">
                <div class="media border p-3 cart-product">
                    <div class="image-container">
                        <img src="${item.productId.imageUrl}" alt="Product Image" class="mr-3 mt-3" />
                    </div>
                    <div class="media-body">
                        <h4>${item.productId.productName}</h4>
                        <div>SIZE: ${item.size || 'N/A'}</div>
                        <br>
                        <div><a class="edit" href="#">Edit</a></div>
                        <div class="trash-icon-container">
                            <a href="#" class="trash-icon">
                                <span class="material-symbols-outlined">delete</span>
                            </a>
                        </div>
                        <button class="btn-add-to-bag">Add to Bag</button>
                    </div>
                    <div class="product-price">
                        <h4>$${item.productId.price}</h4>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

