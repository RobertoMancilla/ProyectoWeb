document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Previene el envío normal del formulario

        var name = document.getElementById('name').value;
        var surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        name = capitalizeFirstLetter(name);
        surname = capitalizeFirstLetter(surname);

        const allFields = [
            document.getElementById('name'), 
            document.getElementById('surname'), 
            document.getElementById('email'), 
            document.getElementById('password'), 
            document.getElementById('confirmPassword')
        ];

        console.log("printing data");
        console.log("name:", name);
        console.log("surname:", surname);
        console.log("email:",email);
        console.log("password:", password);
        console.log("confirm password:", confirmPassword);

        // Restablecer estilos antes de validar
        resetFieldsStyle(allFields);

        // Verificar campos vacíos
        if (highlightEmptyFields(allFields)) {
            Swal.fire({
                icon: "error",
                title: "All fields are required",
                confirmButtonColor: '#FF6347', // Tomate Red
                timer: 1000
            });
            return;
        }
        // Validación de correo electrónico
        if (!isValidEmail(email)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid email address.",
                confirmButtonColor: '#FF6347',
                timer: 1000
            });
            document.getElementById('email').style.borderColor = '#FF6347';  // Tomate Red, un rojo más suave
            return;
        }

        // Validación de contraseñas que coinciden
        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Password Mismatch",
                confirmButtonColor: '#FF6347',
                timer: 1000
            });
            highlightPasswordFields();
            return;
        }

        // Crear un objeto XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/signup', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status == 409) {
                Swal.fire({
                    icon: "error",
                    title: "Email allready registered",
                    text: "Please log in or use another email",
                    confirmButtonColor: '#FF6347',
                    timer: 1500
                });
            } else if (xhr.status >= 200 && xhr.status < 300) {
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "You have been registered successfully!",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Cerrar el modal de registro
                    var myModalEl = document.getElementById('myModalSignUp');
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                
                    // Cambiar "Log in" a "Profile"
                    const loginLink = document.getElementById('log_in');
                    loginLink.textContent = 'Profile';
                    loginLink.href = '/profile'; // Cambia esto según la URL de tu perfil

                    loginLink.removeAttribute('data-bs-toggle');
                    loginLink.removeAttribute('data-bs-target');
                });
                
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong. Please try again later.",
                    confirmButtonColor: '#FF6347'
                });
            }
        };
        // Enviar la solicitud
        const data = JSON.stringify({ name, surname, email, password });

        console.log("data:", data);

        xhr.send(data);
  });
});

function capitalizeFirstLetter(string) {
    return string.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}  

function isValidEmail(email) {
    const emailRegex = /^.+@.+\..+$/;  // Simple regex para verificar "@" y dominio
    return emailRegex.test(email);
}
  
function highlightPasswordFields() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    if (password && confirmPassword) {
        password.style.borderColor = '#FF6347';  // Tomate Red
        confirmPassword.style.borderColor = '#FF6347';
    }
}

function highlightEmptyFields(fields) {
    let isAnyFieldEmpty = false;
    fields.forEach(field => {
        if (field && !field.value.trim()) {
            field.style.borderColor = '#FF6347';  // color de error
            isAnyFieldEmpty = true;
        } else if (field) {
            field.style.borderColor = '#ced4da';  // color default bs5
        }
    });
    return isAnyFieldEmpty;
}

function resetFieldsStyle(fields) {
    fields.forEach(field => {
        if (field) {
            field.style.borderColor = '#ced4da';  //color default bs5
        }
    });
}
