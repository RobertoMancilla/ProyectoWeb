document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById('signupForm');

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateFields(name, surname, email, password, confirmPassword) {
        // Comprueba si las contraseñas coinciden
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Passwords do not match',
                text: 'Please make sure your passwords match.'
            });
            return false;
        }
        // Comprueba que todos los campos están llenos
        if (!name || !surname || !email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Missing fields',
                text: 'Please fill out all fields.',
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }
        // Validar el formato del correo electrónico
        if (!validateEmail(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }
        return true;
    }

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var name = capitalizeFirstLetter(document.getElementById('name').value);
        var surname = capitalizeFirstLetter(document.getElementById('surname').value);
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!validateFields(name, surname, email, password, confirmPassword)) {
            return; // Detener la ejecución si la validación falla
        }

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok && response.status === 409) {
                throw new Error('User already exists with the given email');
            } else if (!response.ok) {
                throw new Error('Registration failed');
            } else {
                return response.json();

            }
        })
        .then(data => {
            Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "You have been registered successfully! Redirecting...",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                var myModalEl = document.getElementById('myModalSignUp');
                var modalSignUp = bootstrap.Modal.getInstance(myModalEl);
                modalSignUp.hide();

                // Abrir el modal de login
                var myModalLogin = new bootstrap.Modal(document.getElementById('myModalLogIn'), {
                  keyboard: false
                });
                myModalLogin.show();
            });
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: error.message || "An unknown error occurred!"
            });
        });
    });
});
