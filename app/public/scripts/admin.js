document.addEventListener("DOMContentLoaded", function() {
    // Obtener el contenedor donde se mostrarán los productos
    const productsContainer = document.querySelector(".products_container");

    // Realizar la solicitud GET para obtener los productos
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/admin/productos", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var productos = JSON.parse(xhr.responseText);
                // Declarar las variables fuera del bucle
                productos.forEach(function(producto) {
                    // Obtener la URL de la imagen 2 y la imagen 3
                    // Crear la tarjeta de producto en formato HTML
                    const productCardHTML = `
                        <div class="media border p-3 cart-product">
                            <div class="image-container">
                                <img src="${producto.imageUrl}" alt="imagen_producto" class="mr-3 mt-3"/>
                            </div>
                            <div class="media-body">
                                <h4>${producto.productName}</h4>
                                <div>
                                    Product ID: ${producto.productId}
                                </div>
                                <div>
                                    Price: $${producto.price}
                                </div>
                                <div>
                                    Description: ${producto.description}
                                </div>
                                <div>
                                    Category: ${producto.category}
                                </div>
                                <div>
                                    Stock: ${producto.stock}
                                </div>
                                <div>
                                    Gender: ${producto.gender.join(", ")}
                                </div>
                                <div>
                                    Sizes: ${producto.sizes.join(", ")}
                                </div>
                                <br>
                                <button class="btn-edit-product" data-bs-toggle="modal" data-bs-target="#addCartShopping" data-product-id="${producto.productId}">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn-delete-product" data-product-id="${producto.productId}">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;

                    // Agregar la tarjeta de producto al contenedor de productos
                    productsContainer.innerHTML += productCardHTML;
                });
                
                // Listener de eventos para los botones de editar producto
                var editButtons = document.querySelectorAll(".btn-edit-product");
                editButtons.forEach(function(button) {
                    button.addEventListener("click", function() {
                        var productName = this.closest(".media-body").querySelector("h4").innerText;
                        var productId = this.dataset.productId;
                        var producto = productos.find(prod => prod.productId === productId);

                        // Obtener los valores de imageUrl2 e imageUrl3 del producto específico
                        var imageUrl2 = producto.imageUrl2;
                        var imageUrl3 = producto.imageUrl3;
                        // Seleccionar el input del productId y deshabilitarlo
                        var productIdInput = document.querySelector('input[name="updateId"]');
                        productIdInput.value = productId;
                        productIdInput.disabled = true;

                        // Seleccionar los elementos HTML correspondientes a los datos del producto
                        var productImageUrlElement = this.closest(".cart-product").querySelector(".image-container img");
                        var productDescriptionElement = this.closest(".media-body").querySelectorAll("div")[2];
                        var productPriceElement = this.closest(".media-body").querySelectorAll("div")[1];
                        var productCategoryElement = this.closest(".media-body").querySelectorAll("div")[3];
                        var productStockElement = this.closest(".media-body").querySelectorAll("div")[4];
                        var productGenderElement = this.closest(".media-body").querySelectorAll("div")[5];
                        var productSizesElement = this.closest(".media-body").querySelectorAll("div")[6];

                        // Obtener solo el valor de cada elemento
                        var productDescription = productDescriptionElement.innerText.split(": ")[1];
                        var productPrice = productPriceElement.innerText.split(": ")[1].replace('$', ''); // Eliminar el símbolo "$"
                        var productStock = productStockElement.innerText.split(": ")[1];
                        var productCategory = productCategoryElement.innerText.split(": ")[1];
                        var productImageUrl = productImageUrlElement.getAttribute("src");
                        var productGender = productGenderElement.innerText.split(": ")[1].split(", ");
                        var productSizes = productSizesElement.innerText.split(": ")[1].split(", ");

                        // Llenar el formulario del modal con los datos del producto seleccionado
                        document.querySelector('input[name="updateName"]').value = productName;
                        document.querySelector('input[name="updateId"]').value = productId;
                        document.querySelector('input[name="updatePrice"]').value = productPrice;
                        document.querySelector('input[name="updateDescrip"]').value = productDescription;
                        document.querySelector('input[name="updateStock"]').value = productStock;
                        document.querySelector('input[name="updateCateg"]').value = productCategory;
                        document.querySelector('input[name="updateImagee"]').value = productImageUrl;
                        
                        // Asignar las URLs de las imágenes 2 y 3 al formulario del modal
                        document.querySelector('input[name="updateImagee2"]').value = imageUrl2;
                        document.querySelector('input[name="updateImagee3"]').value = imageUrl3;

                        // Marcar los tamaños seleccionados en el formulario del modal
                        var checkboxes = document.querySelectorAll("#addCartShopping input[name='gender']");
                        checkboxes.forEach(function(checkbox) {
                            if (productGender.includes(checkbox.value)) {
                                checkbox.checked = true;
                            } else {
                                checkbox.checked = false;
                            }
                        });

                        var checkboxes = document.querySelectorAll("#addCartShopping input[name='size']");
                        checkboxes.forEach(function(checkbox) {
                            if (productSizes.includes(checkbox.value)) {
                                checkbox.checked = true;
                            } else {
                                checkbox.checked = false;
                            }
                        });
                    });
                });
                
                // Agregar listeners de eventos a los botones de eliminación de producto
                var deleteButtons = document.querySelectorAll(".btn-delete-product");
                deleteButtons.forEach(function(button) {
                    button.addEventListener("click", function() {
                        var productId = this.closest(".cart-product").querySelector("[data-product-id]").getAttribute("data-product-id");
                        deleteProduct(productId);
                    });
                });
            } else {
                console.error("Error al obtener los productos:", xhr.status);
            }
        }
    };
    xhr.send();

    // subir/añadir productos
    document.getElementById("submitProductBtn").addEventListener("click", function() {
        var productName = document.querySelector("#myModal input[name='PName']").value;
        var productId = document.querySelector("#myModal input[name='Id']").value;
        var imageUrl = document.querySelector("#myModal input[name='Imagee']").value;
        var imageUrl2 = document.querySelector("#myModal input[name='Imagee2']").value;
        var imageUrl3 = document.querySelector("#myModal input[name='Imagee3']").value;
        var price = document.querySelector("#myModal input[name='Price']").value;
        var description = document.querySelector("#myModal input[name='Descrip']").value;
        var stock = document.querySelector("#myModal input[name='confirmStock']").value;
        var category = document.querySelector("#myModal input[name='categ']").value

        var gender = [];
        var checkboxes = document.querySelectorAll("#myModal input[name='gender']:checked");
        checkboxes.forEach(function(checkbox) {
            gender.push(checkbox.value);
        });

        var sizes = [];
        var checkboxes = document.querySelectorAll("#myModal input[name='size']:checked");
        checkboxes.forEach(function(checkbox) {
            sizes.push(checkbox.value);
        });

        var productData = {
            productName: productName,
            productId: productId,
            imageUrl: imageUrl,
            imageUrl2: imageUrl2,
            imageUrl3: imageUrl3,
            price: price,
            description: description,
            stock: stock,
            category: category,
            gender: gender,
            sizes: sizes
        };
        console.log(productData);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/admin/guardar-producto", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    document.querySelector("#myModal input[name='PName']").value = "";
                    document.querySelector("#myModal input[name='Id']").value = "";
                    document.querySelector("#myModal input[name='Imagee']").value = "";
                    document.querySelector("#myModal input[name='Imagee2']").value = "";
                    document.querySelector("#myModal input[name='Imagee3']").value = "";
                    document.querySelector("#myModal input[name='Price']").value = "";
                    document.querySelector("#myModal input[name='Descrip']").value = "";
                    document.querySelector("#myModal input[name='confirmStock']").value = "";
                    document.querySelector("#myModal input[name='categ']").value = "";
                    checkboxes.forEach(function(checkbox) {
                        checkbox.checked = false;
                    });
                    location.reload();
                } else {
                    console.error("Error al enviar los datos del producto:", xhr.status);
                }
            }
        };
        xhr.send(JSON.stringify(productData));
    });
});

//Listener de eventos para el botón de actualizar producto en el modal
document.getElementById("updateProductBtn").addEventListener("click", function() {
    // Obtener los valores actualizados del formulario del modal
    var updatedProductName = document.querySelector('input[name="updateName"]').value;
    var updatedProductId = document.querySelector('input[name="updateId"]').value;
    var updatedImageUrl = document.querySelector('input[name="updateImagee"]').value;
    var updatedImageUrl2 = document.querySelector('input[name="updateImagee2"]').value;
    var updatedImageUrl3 = document.querySelector('input[name="updateImagee3"]').value;
    var updatedPrice = document.querySelector('input[name="updatePrice"]').value;
    var updatedDescription = document.querySelector('input[name="updateDescrip"]').value;
    var updatedStock = document.querySelector('input[name="updateStock"]').value;
    var updatedCategory = document.querySelector('input[name="updateCateg"]').value;

    console.log("Updated Product Name:", updatedProductName);
    console.log("Updated Product ID:", updatedProductId);
    console.log("Updated Image URL:", updatedImageUrl);
    console.log("Updated Image URL2:", updatedImageUrl2);
    console.log("Updated Image URL3:", updatedImageUrl3);
    console.log("Updated Price:", updatedPrice);
    console.log("Updated Description:", updatedDescription);
    console.log("Updated Stock:", updatedStock);
    console.log("Updated Category:", updatedCategory);

    var updatedGender = [];
    var updatedCheckboxes = document.querySelectorAll("#addCartShopping input[name='gender']:checked");
    updatedCheckboxes.forEach(function(checkbox) {
        updatedGender.push(checkbox.value);
    });

    console.log("Updated gender:", updatedGender);
    var updatedSizes = [];
    var updatedCheckboxes = document.querySelectorAll("#addCartShopping input[name='size']:checked");
    updatedCheckboxes.forEach(function(checkbox) {
        updatedSizes.push(checkbox.value);
    });

    // Crear el objeto con los datos actualizados del producto
    var updatedProductData = {
        productName: updatedProductName,
        productId: updatedProductId,
        imageUrl: updatedImageUrl,
        imageUrl2: updatedImageUrl2,
        imageUrl3: updatedImageUrl3,
        price: updatedPrice,
        description: updatedDescription,
        stock: updatedStock,
        category: updatedCategory,
        gender: updatedGender,
        sizes: updatedSizes
    };

    // Llamar a la función para actualizar el producto y pasarle los datos actualizados
    updateProduct(updatedProductData);
});


// Función para enviar los valores actualizados al servidor
function updateProduct(updatedProduct) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/actualizar-producto", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Actualización exitosa
                console.log("Producto actualizado correctamente.");
                // Recargar la página o realizar alguna otra acción si es necesario
                location.reload(); // Recargar la página
            } else {
                // Error al actualizar el producto
                console.error("Error al actualizar el producto:", xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify(updatedProduct));
}

// Función para eliminar un producto
function deleteProduct(productId) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/admin/delete/${productId}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Eliminar la tarjeta del producto del DOM si la eliminación en el servidor fue exitosa
                document.querySelector(`[data-product-id="${productId}"]`).closest(".cart-product").remove();
                location.reload();
            } else {
                console.error("Error al eliminar el producto5.");
            }
        }
    };
    xhr.send();
}