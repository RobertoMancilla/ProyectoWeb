document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const logInTextElement = document.getElementById('log_in');

    const myModalLogIn = document.getElementById('myModalLogIn');
    const modalLogIn = new bootstrap.Modal(myModalLogIn); 

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
                logInTextElement.innerText = 'Profile';

                logInTextElement.onclick = openProfileModal;

                // console.log("Login successful, closing modal.");
                // modalLogIn.hide();
                window.location.reload(); // Reload the page to update the wishlist display

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
            console.error("Error during login or modal operation:", error);
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
            logInTextElement.innerText = 'Profile';
            logInTextElement.onclick = openProfileModal;  
        } else {
            logInTextElement.innerText = 'Log In';
            logInTextElement.onclick = null;  
        }
    }

    function openProfileModal() {
        const myModalEl = document.getElementById('myModalShowProfile');
        const modal = new bootstrap.Modal(myModalEl);
        modal.show();
        fetchProfileInfo();
    }

    function fetchProfileInfo() {
        const token = localStorage.getItem('jwt');
        
        if (!token) {
            console.warn('No JWT found, user is probably not logged in');
            return;
        }
        fetch('/user/info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(user => {
            document.getElementById('name_show').value = user.name || '';
            document.getElementById('surname_show').value = user.surname || '';
            document.getElementById('email_show').value = user.email || '';
            // Asegúrate de manejar aquí también los campos de contraseña si es necesario
        })
        .catch(error => {
            console.error('Failed to fetch user profile:', error);
        });
    }    
    
});
