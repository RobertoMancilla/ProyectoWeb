function getFilteredProduct(category,filtered){
    var productsContainer = document.querySelector("#prFilteredContainer");

    // Limpiar Productps
    productsContainer.innerHTML=""


    console.log("esta es la categoria: ",category)
            // Realizar la solicitud GET para obtener los productos
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/productosAPI", true);
    xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var productos = JSON.parse(xhr.responseText);
                    // Agrupar los productos por categoría
                    
                    productos.map(pr=>{
                      if(pr[filtered]==category){
                        console.log("producto: ",pr)
                        catToHtml(pr)
                      }
                      if (Array.isArray(pr[filtered]) && pr[filtered].includes(category.toUpperCase())) {
                        console.log("yeah producto: ", pr);
                        catToHtml(pr)
                      }
                    })
                } else {
                    console.error("Error al obtener los productos:", xhr.status);
                }
            }
        };
        xhr.send();
  }


  function catToHtml(cat){
    var productsContainer = document.querySelector("#prFilteredContainer");
    console.log("esta es:", cat)
    productsContainer.innerHTML += `


    <div>
        <div class="col col-sm-6 col-md-4 col-lg-3">
            <a href="#">
                <div class="card">
                    <img class="card-img-top" src="${cat.imageUrl}" alt="producto" />
                    <div class="card-body">
                        <h4 class="card-title">${cat.productName}</h4>
                        <p class="card-text">${cat.description}</p>
                    </div>
                </div>
            </a>
        </div>
    </div>
    `
  }

  function generarContenedoresDeCategorias(productosPorCategoria) {
    var productsContainer = document.querySelector(".products_filter");
    for (var categoria in productosPorCategoria) {
        if (productosPorCategoria.hasOwnProperty(categoria)) {
            var productosDeLaCategoria = productosPorCategoria[categoria];
            var containerHTML = `
            <br>
            <br>
                    
                    <div style="width: 50%;justify-content: space-around;display:flex">
                        <div>
                            <label for="catSize" >
                            Talla
                            </label>
                                <select id="catSize">
                                    <option value="">select</option>
                                    <option value="s">small</option>
                                    <option value="m">medium</option>
                                    <option value="l">large</option>
                                </select>
                        </div>

                        <div>
                            <label for="cat">
                            Categoria
                            </label>
                            <select id="cat">
                                <option value="">select</option>
                                <option>Sweatshirts</option>
                                <option>T-shirts</option>
                                <option>Sneakers</option>
                            </select>
                        </div>

                        <div>
                            <label for="catGender" >
                            Genero
                            </label>
                            <select id="catGender">
                                <option value="">select</option>
                                <option>Men</option>
                                <option>Women</option>
                            </select>
                        </div>
                    
                    </div>


                <div id="prFilteredContainer" class="container justify-content-center">
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