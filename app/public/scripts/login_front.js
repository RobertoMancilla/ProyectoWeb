document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');

    checkUserLogin();  // Verifica si el usuario está logueado al cargar la página.

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(result => {
            if (result.status === 200) {
                localStorage.setItem('jwt', result.data.sToken);
                checkUserLogin();

                var myModalEl = document.getElementById('myModalLogIn');
                var modalLogIn = bootstrap.Modal.getInstance(myModalEl);
                modalLogIn.hide();

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

    document.getElementById('profile_link').addEventListener('click', function() {
        fetchProfileInfo();  // Función que carga los datos del perfil
    });

    function checkUserLogin() {
        const jwt = localStorage.getItem('jwt');
        const logInLink = document.getElementById('log_in');
        const profileLink = document.getElementById('profile_link');
    
        if (jwt) {
            logInLink.style.display = 'none';        // Oculta el enlace de Log in
            profileLink.style.display = 'block';     // Muestra el enlace de Profile
        } else {
            logInLink.style.display = 'block';       // Muestra el enlace de Log in
            profileLink.style.display = 'none';      // Oculta el enlace de Profile
        }
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
        })
        .catch(error => {
            console.error('Failed to fetch user profile:', error);
        });
    }    
});
