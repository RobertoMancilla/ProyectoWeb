document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const logInTextElement = document.getElementById('log_in');

    // Verifica si el usuario ya está logueado
    checkUserLogin();

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.sToken) {
                // Guarda el token en localStorage o maneja como creas conveniente
                localStorage.setItem('jwt', data.sToken);
                // Cambiar el texto de inicio de sesión a "Mi Cuenta"
                logInTextElement.innerText = 'My Account';
                alert('Inicio de sesión exitoso!');

                var myModalEl = document.getElementById('myModalLogIn');
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();

                console.log("Token from localStorage:", localStorage.getItem('jwt'));
            } else {
                throw new Error(data.authError || 'Error desconocido al iniciar sesión');
            }
        })
        .catch(error => {
            alert('Error al iniciar sesión: ' + error.message);
        });
    });

    function checkUserLogin() {
        if (localStorage.getItem('jwt')) {
            // Si el token existe, cambia el texto del elemento
            logInTextElement.innerText = 'My Account';
        } else {
            logInTextElement.innerText = 'Profile';   
        }
    }
});
