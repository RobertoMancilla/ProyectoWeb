document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('jwt');
    if (token) {
        const decoded = jwt_decode(token);
        loadCartProducts(decoded.id);
    }
});

function loadCartProducts(userId) {
    //obtener carrito
}

function displayCartItems(cart) {
    const container = document.querySelector('.container .row .col');
    // console.log("cart:", cart.items);
    console.log("item lenght:", cart.items.length); 
    if (cart.items.length === 0) {
        container.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    let cardInCartHtml = '';
    cart.items.forEach((item, i) => {
        cardInCartHtml += `
            <div class="media border p-3 cart-product">
                <div class="image-container">
                    <img src="${item.productoId.imageUrl}" alt="Product Image" class="mr-3 mt-3" />
                </div>
                <div class="media-body">
                    <h4>${item.productoId.title}</h4>
                    <div>COLOR: ${item.productoId.color}</div>
                    <div>SIZE: ${item.size}</div>
                    <div>QUANTITY: ${item.cantidad}</div>
                    <br>
                    <div><a class="edit" href="#">Edit</a></div>
                    <div class="trash-icon-container">
                        <a href="#" class="trash-icon" onclick="removeFromCart('${item._id}')">
                            <span class="material-symbols-outlined">delete</span>
                        </a>
                    </div>
                </div>
                <div class="product-price"><h4>$${item.productoId.price}</h4></div>
            </div>
        `;
    });
    container.innerHTML = cardInCartHtml;
}

function displayOrderSummary(cart) {
    const summaryContainer = document.querySelector('.container .row .col-lg-4 .media-body');
    let subtotal = cart.items.reduce((total, item) => total + (item.productoId.price * item.cantidad), 0);
    let shipping = subtotal > 0 ? 60 : 0; // Example shipping cost logic
    let total = subtotal + shipping;

    const summaryHtml = `
        <br>
        <br>
        <br>

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

function removeFromCart(productId) {
    // Implement the function to handle removing an item from the cart
}