
document.addEventListener('DOMContentLoaded', function() {
    cargarDetallesProducto();

});

async function cargarDetallesProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        const response = await fetch(`/api/oneProducto/${productId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los detalles del producto');
        }
        const producto = await response.json();
        mostrarDetallesProducto(producto);
    } catch (error) {
        console.error("Error al obtener los detalles del producto:", error.message);
    }
}

function mostrarDetallesProducto(producto) {
    const productContainer = document.querySelector('.container.custom-container');
    if (!productContainer) {
        console.error('El contenedor del producto no existe');
        return;
    }

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
                <button id="btnAddToBag" type="button" class="btn btn-dark btn-add-to-bag">ADD TO BAG</button>
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
    const validSizes = ['S', 'M', 'L']; // Asegúrate de que estos valores coinciden con tus tallas válidas
    validSizes.forEach(size => {
        const isAvailable = availableSizes.includes(size);
        const buttonClass = 'size-btn' + (isAvailable ? '' : ' unavailable');
        const buttonAttributes = isAvailable ? `class="${buttonClass}"` : `class="${buttonClass}" disabled style="cursor: default; text-decoration: line-through; pointer-events: none;"`;
        buttonsHTML += `<button ${buttonAttributes}>${size}</button>`;
    });
    return buttonsHTML;
}
