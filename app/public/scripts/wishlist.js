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
    console.log("wishlist:", wishlist.size);

    wishlist.items.forEach(item => {
        console.log();
        const productCard = `
            <div class="col">
                <div class="media border p-3 cart-product">
                    <div class="image-container">
                        <img src="${item.productId.imageUrl}" alt="Product Image" class="mr-3 mt-3" />
                    </div>
                    <div class="media-body">
                        <h4>${item.productId.productName}</h4>
                        <div>SIZE: ${item.size}</div>
                        <br>
                        <div class="edit-container">  <!-- Contenedor para el botón de edición -->
                            <button id="btn_edit" class="edit-size"data-id="${item.productId._id}" data-size="${item.size}" data-sizes='${JSON.stringify(item.productId.sizes)}'>Edit</button>
                        </div>
                        <div class="trash-icon-container" onclick="removeFromWishlist('${item.productId._id}')">
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

    document.querySelectorAll('.edit-size').forEach(button => {
        button.addEventListener('click', function(event) {
            const productId = event.target.getAttribute('data-id');
            const currentSize = event.target.getAttribute('data-size');
            const sizesJson = event.target.getAttribute('data-sizes');  // Recuperamos la cadena JSON de las tallas
            const sizes = JSON.parse(sizesJson);  // Convertimos la cadena JSON de nuevo a un array
    
            console.log("current size:", currentSize);

            showSizeOptions(event.target, productId, sizes, currentSize);
        });
    });

}

function showSizeOptions(button, productId, sizes, currentSize) {
    let buttonsHTML = sizes.map(size => {
        const isSelected = size === currentSize ? 'selected-size' : '';
        // Ajuste para enviar correctamente la talla actual y la nueva al hacer clic
        return `<button class="size-btn ${isSelected}" onclick="confirmSizeChange('${productId}', '${currentSize}', '${size}', event)">${size}</button>`;
    }).join('');

    const editContainer = button.closest('.edit-container');
    editContainer.innerHTML = buttonsHTML;
}

function confirmSizeChange(productId, currentSize, newSize, event) {
    event.stopPropagation();

    console.log("New size selected:", newSize);

    const token = localStorage.getItem('jwt'); 
    if (!token) {
        alert('You must be logged in to update your wishlist');
        return;
    }

    const decoded = jwt_decode(token);
    const userId = decoded.id;

    if (currentSize === newSize) {
        alert('No changes were made because you selected the same size.');
        loadWishlist(userId);
        return;
    }

    fetch(`/new/wishlist/update-size/${productId}`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, newSize })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // alert(data.message);
        loadWishlist(userId);
    })
    .catch(error => {
        console.error('Failed to update the product size in the wishlist:', error);
        alert('Failed to update the product size. Please try again.');
    });
}


function removeFromWishlist(productId) {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('You must be logged in to perform this action');
        return;
    }

    let userId = null;
    try {
        const decoded = jwt_decode(token);
        userId = decoded.id;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        alert('Error processing your authentication token. Please login again.');
        return;
    }

    fetch(`/new/wishlist/remove/${productId}`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Product removed from wishlist:', data);
        // alert('Product removed from wishlist successfully!');
        window.location.reload(); // Reload the page to update the wishlist display
    })
    .catch(error => {
        console.error('Error removing product from wishlist:', error);
        alert('Failed to remove product from wishlist. Please try again.');
    });
}

