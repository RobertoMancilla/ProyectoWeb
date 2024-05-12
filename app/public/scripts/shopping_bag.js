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

        // console.log("cart:", cart);
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// update size or qty
function confirmSizeChange(productId, currentSize, newSize, newQuantity, event) {
    const token = localStorage.getItem('jwt');
    const userId = jwt_decode(token).id;

    const updateBody = {
        userId,
        currentSize: currentSize,  // Usa la nueva talla si esta disponible, si no, la actual
        newSize: newSize || currentSize,
    };

    if (newQuantity !== null) {
        updateBody.newQuantity = newQuantity;  // Solo añade la cantidad si realmente se ha modificado
    }

    fetch(`/cart/update-item/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update size.');
        }
        return response.json();
    })
    .then(updatedCart => {
        console.log('Size updated successfully:', updatedCart);
        loadCartProducts(userId);
        toggleEditAndView(event.target);
    })
    .catch(error => {
        console.error('Error updating size:', error);
        alert(`Error: ${error.message}`);
    });
}


function toggleEditAndView(sizeButton) {
    const editContainer = sizeButton.closest('.edit-container');
    const productId = sizeButton.getAttribute('data-id');
    const currentSize = sizeButton.getAttribute('data-size');
    const sizesJson = sizeButton.getAttribute('data-sizes');

    // Recreate the edit button with event handler
    editContainer.innerHTML = `<button id="btn_edit" class="edit-size" data-id="${productId}" data-size="${currentSize}" data-sizes='${sizesJson}'>Edit</button>`;
    
    // Reattach the event listener to the new edit button
    editContainer.querySelector('.edit-size').addEventListener('click', function(event) {
        const productId = event.target.getAttribute('data-id');
        const currentSize = event.target.getAttribute('data-size');
        const sizesJson = event.target.getAttribute('data-sizes');
        const sizes = JSON.parse(sizesJson);
        const currentQuantity = event.target.getAttribute('data-quantity');

        showSizeOptions(event.target, productId, sizes, currentSize, currentQuantity);
    });
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
    const container = document.querySelector('.container .row .col');
    if (cart.items.length === 0) {
        container.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    let cardInCartHtml = '';
    cart.items.forEach((item) => {

        cardInCartHtml += `
            <div class="media border p-3 cart-product">
                <div class="image-container">
                    <img src="${item.productId.imageUrl}" alt="Product Image" class="mr-3 mt-3" />
                </div>
                <div class="media-body">
                    <h4>${item.productId.productName}</h4>
                    <div>SIZE: <span class="item-size">${item.size}</span></div>
                    <div id="qty">QUANTITY: ${item.quantity}</div>
                    <br>
                    <div class="edit-container">  <!-- Contenedor para el botón de edición -->
                        <button id="btn_edit" class="edit-size" data-quantity="${item.quantity}" data-id="${item.productId._id}" data-size="${item.size}" data-sizes='${JSON.stringify(item.productId.sizes)}'>Edit</button>
                    </div>
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
    
    document.querySelectorAll('.edit-size').forEach(button => {
        button.addEventListener('click', function(event) {
            const productId = event.target.getAttribute('data-id');
            const currentSize = event.target.getAttribute('data-size');
            const sizesJson = event.target.getAttribute('data-sizes');  // Recuperamos la cadena JSON de las tallas
            const sizes = JSON.parse(sizesJson);  // Convertimos la cadena JSON de nuevo a un array
            const currentQuantity = event.target.getAttribute('data-quantity')
    
            showSizeOptions(event.target, productId, sizes, currentSize, currentQuantity);
        });
    });
}

function showSizeOptions(button, productId, sizes, currentSize, currentQuantity) {
    console.log("current qty:", currentQuantity);
    
    let buttonsHTML = sizes.map(size => {
        const isSelected = size === currentSize ? 'selected-size' : '';
        return `<button class="size-btn ${isSelected}" onclick="confirmSizeChange('${productId}', '${currentSize}', '${size}', '${currentQuantity}', event)">${size}</button>`;
    }).join('');

    const editContainer = button.closest('.edit-container');

    // Añadir controlador de cantidad
    buttonsHTML += `
        <div class="quantity-controller">
            <button class="quantity-btn decrease" onclick="updateQuantity('${productId}', 'decrease', event)">-</button>
            <input type="number" class="quantity-input" data-id="${productId}" value="${currentQuantity}" min="1">
            <button class="quantity-btn increase" onclick="updateQuantity('${productId}', 'increase', event)">+</button>
        </div>
    `;

    editContainer.innerHTML = buttonsHTML;
}

function updateQuantity(productId, action) {
    const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
    let currentQuantity = parseInt(quantityInput.value);
    let currentSize = quantityInput.closest('.cart-product').querySelector('.item-size').textContent;
    
    if (action === 'increase') {
        // console.log("click increase");
        currentQuantity++;
    } else if (action === 'decrease' && currentQuantity > 1) {
        // console.log("click decrease");
        currentQuantity--;
    }
    quantityInput.value = currentQuantity;

    // hacer update 
    confirmSizeChange(productId, currentSize, currentSize, currentQuantity, event);
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
            <button id="btn1card" onclick="CheckOut()" type="button" class="btn btn-dark btn-card-tres">CHECKOUT</button> <br>
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
            // alert('Item removed successfully');
            loadCartProducts(jwt_decode(token).id);
        } else {
            throw new Error(data.message || 'Failed to remove item from cart.');
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        alert(`Error: ${error.message}`);
    }
}


//stripe 
async function loadCartP(userId) {
    try {
        const response = await fetch(`/cart/${userId}`);
        const cart = await response.json();
        let processedCart = [];

        // Uso de un Map para extraer datos y luego transformarlos en la estructura deseada
        let newCart = new Map(Object.entries(cart.items));
        newCart.forEach((value, key) => {
            // Crear y añadir un arreglo al arreglo 'processedCart'
            processedCart.push([parseInt(key), {
                name: value.productId.productName,
                priceInCents: value.productId.price * 100,
                quantity:value.quantity
            }]);
        });

        console.log("Carrito procesado: ", processedCart);

        const postResponse = await fetch("/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: processedCart // Enviando el arreglo de arreglos directamente
            }),
        }).then(res => {
            if (res.ok) return res.json()
            return res.json().then(json => Promise.reject(json))
          })
          .then(({ url }) => {
            window.location = url
          })
          .catch(e => {
            console.error(e.error)
          })



        const postData = await postResponse.json();
        console.log(postData);

    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function CheckOut() {
    document.getElementById("checkLoader").style.display="block"

    const token = localStorage.getItem('jwt');
    loadCartP(jwt_decode(token).id)

    var button = document.getElementById("btn1card");
              
        button.addEventListener("click", function() {
          loader.style.display = "block !important";
        });
}