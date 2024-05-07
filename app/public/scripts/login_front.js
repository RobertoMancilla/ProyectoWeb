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
        .then(response => response.json().then(data => ({
            status: response.status,
            data
        })))
        .then(result => {
            if (result.status === 200) {
                localStorage.setItem('jwt', result.data.sToken);
                logInTextElement.innerText = 'My Account';

                var myModalEl = document.getElementById('myModalLogIn');
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();

                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: "You have logged in successfully!",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                throw result.data;
            }
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.authError || 'An unknown error occurred during login.',
                showConfirmButton: true
            });
        });
    });

    function checkUserLogin() {
        if (localStorage.getItem('jwt')) {
            logInTextElement.innerText = 'My Account';
        } else {
            logInTextElement.innerText = 'Log In';   
        }
    }
});
