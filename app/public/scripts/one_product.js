document.addEventListener("DOMContentLoaded", function() {
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Realizar la solicitud GET para obtener los detalles del producto
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/oneProducto/${productId}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Convertir la respuesta JSON en un objeto JavaScript
                const producto = JSON.parse(xhr.responseText);
                // Actualizar el contenido de la página con los detalles del producto
                mostrarDetallesProducto(producto);
            } else {
                console.error("Error al obtener los detalles del producto:", xhr.status);
            }
        }
    };
    xhr.send();
});

function mostrarDetallesProducto(producto) {
    // Seleccionar el contenedor donde se mostrarán los detalles del producto
    const productContainer = document.querySelector('.containerProduct.custom-container');

    // Crear elementos HTML para mostrar los detalles del producto
    const productRow = document.createElement('div');
    productRow.classList.add('row');
    
    // Primera columna para la primera imagen
    const productImageDiv1 = document.createElement('div');
    productImageDiv1.classList.add('col-md-4');
    productImageDiv1.innerHTML = `
        <div class="border p-3 cart-product">
            <div class="image-container">
                <img src="${producto.imageUrl}" alt="imagen_producto" class="mr-3 mt-3">
            </div>
        </div>
    `;

    // Segunda columna para la segunda imagen
    const productImageDiv2 = document.createElement('div');
    productImageDiv2.classList.add('col-md-4');
    productImageDiv2.innerHTML = `
        <div class="border p-3 cart-product">
            <div class="image-container">
                <img src="${producto.imageUrl2}" alt="imagen_producto" class="mr-3 mt-3">
            </div>
        </div>
    `;

    // Tercera columna para la tercera imagen
    const productImageDiv3 = document.createElement('div');
    productImageDiv3.classList.add('col-md-4');
    productImageDiv3.innerHTML = `
        <div class="border p-3 cart-product">
            <div class="image-container">
                <img src="${producto.imageUrl3}" alt="imagen_producto" class="mr-3 mt-3">
            </div>
        </div>
    `;

    // Cuarta columna para la información del producto
    const productInfoDiv = document.createElement('div');
    productInfoDiv.classList.add('col-md-4');
    productInfoDiv.innerHTML = `
        <div class="border p-3 card-tres">
            <h4>${producto.productName}</h4>
            <h4>$${producto.price}</h4>
            <p>${producto.description}</p>
            <div class="sizes">
                SIZES:
                <div class="size-buttons">
                    ${generarBotonesTallas(producto.sizes)}
                </div>
            </div>
            <div class="product-actions">
                <button id="btn1card" type="button" class="btn btn-dark btn-add-to-bag">ADD TO BAG</button>
                <button class="btn btn-outline-dark btn-favorite">
                    <span class="material-symbols-outlined">favorite</span>
                </button>
            </div>
        </div>
    `;

    // Agregar elementos al contenedor
    productContainer.appendChild(productRow);
    productRow.appendChild(productImageDiv1);
    productRow.appendChild(productImageDiv2);
    productRow.appendChild(productInfoDiv);
    
    // Crear nueva fila para la tercera imagen
    const productRow2 = document.createElement('div');
    productRow2.classList.add('row');
    productRow2.innerHTML = `
        <div class="col-md-4">
            <div class="border p-3 cart-product">
                <div class="image-container">
                    <img src="${producto.imageUrl3}" alt="imagen_producto" class="mr-3 mt-3">
                </div>
            </div>
        </div>
    `;

    // Agregar tercera imagen a la nueva fila
    productContainer.appendChild(productRow2);
}

// Función para generar los botones de tallas
function generarBotonesTallas(sizes) {
    let buttonsHTML = '';
    const availableSizes = sizes || []; // Si no hay tallas disponibles, usar un array vacío
    const validSizes = ['S', 'M', 'G']; // Tallas válidas
    validSizes.forEach(size => {
        const isAvailable = availableSizes.includes(size);
        const buttonClass = isAvailable ? 'size-btn' : 'size-btn unavailable';
        const buttonStyle = isAvailable ? '' : 'style="text-decoration: line-through"';
        buttonsHTML += `<button class="${buttonClass}" ${buttonStyle}>${size}</button>`;
    });
    return buttonsHTML;
}