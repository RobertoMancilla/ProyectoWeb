document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submitProductBtn").addEventListener("click", function() {
        var productName = document.querySelector("#myModal input[name='PName']").value;
        var productId = document.querySelector("#myModal input[name='Id']").value;
        var price = document.querySelector("#myModal input[name='Price']").value;
        var description = document.querySelector("#myModal input[name='Descrip']").value;
        var stock = document.querySelector("#myModal input[name='confirmStock']").value;

        var sizes = [];
        var checkboxes = document.querySelectorAll("#myModal input[name='size']:checked");
        checkboxes.forEach(function(checkbox) {
            sizes.push(checkbox.value);
        });

        var productData = {
            productName: productName,
            productId: productId,
            price: price,
            description: description,
            stock: stock,
            sizes: sizes
        };
        console.log(productData);

        fetch("/admin/guardar-producto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            document.querySelector("#myModal input[name='PName']").value = "";
            document.querySelector("#myModal input[name='Id']").value = "";
            document.querySelector("#myModal input[name='Price']").value = "";
            document.querySelector("#myModal input[name='Descrip']").value = "";
            document.querySelector("#myModal input[name='confirmStock']").value = "";
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = false;
            });
        })
        .catch(error => {
            console.error("Error al enviar los datos del producto:", error);
        });
    });
});