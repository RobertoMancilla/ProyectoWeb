document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log("emial:",email);
        console.log("password:", password);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
                // Cerrar el modal de inicio de sesión
                const modal = bootstrap.Modal.getInstance(document.getElementById('myModalLogIn'));
                modal.hide();

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You are now logged in!',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Actualizar el UI para mostrar "Profile" en lugar de "Log in"
                const loginLink = document.getElementById('log_in');
                loginLink.textContent = 'Profile';
                loginLink.href = '/profile';
                loginLink.removeAttribute('data-bs-toggle');
                loginLink.removeAttribute('data-bs-target');
            } else if (xhr.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'User not found. Please check your email.',
                    confirmButtonColor: '#FF6347'
                });
            } else if (xhr.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid password. Please try again.',
                    confirmButtonColor: '#FF6347'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: response.message || 'Something went wrong. Please try again later.',
                    confirmButtonColor: '#FF6347'
                });
            }
        };
        const data = JSON.stringify({ email, password });

        console.log("data:",data);

        xhr.send(data);
    });
});
