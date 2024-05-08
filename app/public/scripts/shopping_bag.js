document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('jwt');
    if (token) {
        const decoded = jwt_decode(token);
        loadCartProducts(decoded.id);
    }
});

async function loadCartProducts(userId) {
    try {
        const response = await fetch(`/cart/${userId}`);
        const cart = await response.json();
        displayShoppingBagTitle(cart);
        displayCartItems(cart);
        displayOrderSummary(cart);
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function displayShoppingBagTitle(cart) {
    const titleContainer = document.getElementById('titleShoppingBag');
    if (!titleContainer) return;

    let totalItems = 0;
    if (cart && cart.items) {
        totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Genera el título basado en el número de ítems
    const titleText = `Your Shopping Bag (${totalItems} Item${totalItems === 1 ? '' : 's'})`;
    titleContainer.innerHTML = `<h3 class="text">${titleText}</h3>`;
}


function displayCartItems(cart) {
    // console.log("cart:", cart);
    const container = document.querySelector('.container .row .col');
    if (cart.items.length === 0) {
        container.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    let cardInCartHtml = '';
    cart.items.forEach((item, i) => {
        cardInCartHtml += `
            <div class="media border p-3 cart-product">
                <div class="image-container">
                    <img src="${item.productId.imageUrl}" alt="Product Image" class="mr-3 mt-3" />
                </div>
                <div class="media-body">
                    <h4>${item.productId.productName}</h4>
                    <div>SIZE: ${item.size}</div>
                    <div>QUANTITY: ${item.quantity}</div>
                    <br>
                    <div><a class="edit" href="#">Edit</a></div>
                    <div class="trash-icon-container">
                        <a href="#" class="trash-icon" onclick="removeFromCart('${item.productId._id}', '${item.size}')">
                            <span class="material-symbols-outlined">delete</span>
                        </a>
                    </div>
                </div>
                <div class="product-price"><h4>$${item.productId.price}</h4></div>
            </div>
        `;
    });
    container.innerHTML = cardInCartHtml;
}

function displayOrderSummary(cart) {
    const summaryContainer = document.querySelector('.container .row .col-lg-4 .media-body');
    let subtotal = 0;
    if (cart && cart.items) {
        subtotal = cart.items.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
    }
    // console.log("subtotal:", subtotal);
    let shipping = subtotal > 0 ? 60 : 0; // shipping cost logic (inventada)
    let total = subtotal + shipping;

    const summaryHtml = `
        <h4>YOUR ORDER SUMMARY</h4>
        <div class="price-line">
            <span>Subtotal:</span>
            <span class="value">$${subtotal} USD</span>
        </div>
        <div class="price-line">
            <span>Shipping:</span>
            <span class="value">$${shipping} USD</span>
        </div>
        <h5 class="total-price">Total: <span class="value">$${total}</span></h5>
        <div class="btn-container-card">
            <button id="btn1card" type="button" class="btn btn-dark btn-card-tres">CHECKOUT</button> <br>
        </div>
    `;
    summaryContainer.innerHTML = summaryHtml;
}


async function removeFromCart(productId, size) {
    const token = localStorage.getItem('jwt');

    console.log("Removing product:", productId, "Size:", size);

    if (!token) {
        alert('You are not authenticated. Please log in.');
        return;
    }

    try {
        const response = await fetch(`/cart/remove/${productId}/${size}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Asegúrate de que tu backend espera y valida este encabezado
            },
            body: JSON.stringify({ userId: jwt_decode(token).id }) 
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('Item removed successfully:', data);
            alert('Item removed successfully');
            loadCartProducts(jwt_decode(token).id);
        } else {
            throw new Error(data.message || 'Failed to remove item from cart.');
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        alert(`Error: ${error.message}`);
    }
}

