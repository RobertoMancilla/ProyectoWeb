document.addEventListener("DOMContentLoaded", function() {
    // Realizar la solicitud GET para obtener los productos
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/productosAPI", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var productos = JSON.parse(xhr.responseText);
                // Agrupar los productos por categoría
                var productosPorCategoria = agruparProductosPorCategoria(productos);
                // Generar HTML para cada contenedor de categoría
                generarContenedoresDeCategorias(productosPorCategoria);
            } else {
                console.error("Error al obtener los productos:", xhr.status);
            }
        }
    };
    xhr.send();
});

// Función para agrupar productos por categoría
function agruparProductosPorCategoria(productos) {
    var productosPorCategoria = {};
    productos.forEach(function(producto) {
        if (!productosPorCategoria[producto.category]) {
            productosPorCategoria[producto.category] = [];
        }
        productosPorCategoria[producto.category].push(producto);
    });
    return productosPorCategoria;
}

// Función para generar HTML para cada contenedor de categoría
function generarContenedoresDeCategorias(productosPorCategoria) {
    var productsContainer = document.querySelector(".products_images");
    for (var categoria in productosPorCategoria) {
        if (productosPorCategoria.hasOwnProperty(categoria)) {
            var productosDeLaCategoria = productosPorCategoria[categoria];
            var containerHTML = `
                <!-- LETRAS BAJO LA IMAGEN GRANDE --> 
                <div class="texto">
                    <h3><a href="">${categoria}</a></h3>
                    <p><a href="">DISCOVER MORE</a></p>
                </div>
                <div class="container justify-content-center">
                    <div class="row align-items-center">
            `;
            productosDeLaCategoria.forEach(function(producto, index) {
                // Construir la URL con el ID del producto
                const productURL = `one_product?id=${producto._id}`;
                
                // Crear la tarjeta de producto en formato HTML con el enlace
                const productCardHTML = `
                    <div class="col col-sm-6 col-md-4 col-lg-3">
                        <a href="${productURL}">
                            <div class="card">
                                <img class="card-img-top" src="${producto.imageUrl}" alt="producto" />
                                <div class="card-body">
                                    <h4 class="card-title">${producto.productName}</h4>
                                    <p class="card-text">$${producto.price}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                containerHTML += productCardHTML;
            });
            containerHTML += `
                    </div>
                </div>
                <br> <!-- Salto de línea después del contenedor de productos -->
            `;
            // Agregar el contenedor al contenedor principal
            productsContainer.innerHTML += containerHTML;
        }
    }
}