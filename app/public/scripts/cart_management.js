document.addEventListener('DOMContentLoaded', function() {
    const productContainer = document.querySelector('.container.custom-container');
    if (productContainer) {
        productContainer.addEventListener('click', function(event) {
            if (event.target.id === 'btnAddToBag') {
                addToCart();
            }
        });
    }
});

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
    const productId = urlParams.get('id');  //
    console.log("product id:", productId);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/cart/add-item', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Producto añadido al carrito:', xhr.responseText);
                alert('Producto añadido correctamente al carrito.');
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
            size: "G"
        }]
    }));
}
