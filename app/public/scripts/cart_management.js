document.addEventListener('DOMContentLoaded', function() {
    const productContainer = document.querySelector('.container.custom-container');
    if (productContainer) {
        productContainer.addEventListener('click', function(event) {
            if (event.target.id === 'btnAddToBag') {
                addToCart();
            } else if (event.target.classList.contains('size-btn') && !event.target.disabled) {
                handleSizeSelection(event.target);
            } else if (event.target.closest('.btn-favorite')) {  // Comprueba si el elemento que provocó el clic está dentro de un botón de favoritos
                const productId = new URLSearchParams(window.location.search).get('id');
                console.log("favorite btn");
                addToWishlist(productId);
            }
        });
    }
});

function handleSizeSelection(button) {
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.classList.remove('selected-size'); // Remove the class from all buttons
    });
    button.classList.add('selected-size'); // Add the class to the clicked button
    // console.log("Selected size:", button.textContent);
}

function addToCart() {
    const token = localStorage.getItem('jwt');
    let userId = null;

    if (token) {
        try {
            const decoded = jwt_decode(token);
            userId = decoded.id;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            alert('Error processing your authentication token. Please login again.');
            return;
        }
    }

    if (!userId) {
        console.error('No user ID found in token');
        alert('Your session has expired. Please login again.');
        return;
    }

    //obtener producto id
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    // console.log("product id:", productId);

    //obtener talla
    const selectedSizeButton = document.querySelector('.size-btn.selected-size');
    const selectedSize = selectedSizeButton ? selectedSizeButton.textContent : null;

    if (!selectedSize) {
        alert('Please select a size before adding to cart.');
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/cart/add-item', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Producto añadido al carrito:', xhr.responseText);
                // alert('Producto añadido correctamente al carrito.');
                window.location.href = '/shopping_cart'
            } else {
                console.error('Error añadiendo el producto al carrito:', xhr.statusText);
                alert('Error añadiendo el producto al carrito.');
            }
        }
    };
    xhr.send(JSON.stringify({
        userId: userId,
        items: [{
            productId: productId,
            quantity: 1,
            size: selectedSize
        }]
    }));
}

async function addToWishlist(productId) {
    const token = localStorage.getItem('jwt');
    if (!token) {
        alert('You must be logged in to add items to your wishlist');
        return;
    }

    try {
        const token = localStorage.getItem('jwt');
        let userId = null;

        if (token) {
            try {
                const decoded = jwt_decode(token);
                userId = decoded.id;
            } catch (error) {
                console.error('Error decoding JWT:', error);
                alert('Error processing your authentication token. Please login again.');
                return;
            }
        }

        const response = await fetch('/new/wishlist/add-item', {  // Asegúrate de que esta URL es correcta
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({userId, productId })
        });

        console.log("user id front:", userId);
        console.log("product id front:", productId);

        if (!response.ok) {
            throw new Error('Failed to add product to wishlist');
        }

        alert('Product added to wishlist successfully!');
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        alert('Error adding product to wishlist. Please try again.');
    }
}
