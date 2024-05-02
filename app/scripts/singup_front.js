document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Previene el envío normal del formulario

        const name = document.getElementById('name');
        const surname = document.getElementById('surname');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        const allFields = [name, surname, email, password, confirmPassword];
        // Restablecer estilos antes de validar
        resetFieldsStyle(allFields);

        // Verificar campos vacíos
        if (highlightEmptyFields(allFields)) {
            alert('All fields are required.');
            return;
        }
        // Validación de correo electrónico
        if (!isValidEmail(email.value)) {
            alert('Please enter a valid email address.');
            email.style.borderColor = '#FF6347';  // Tomate Red, un rojo más suave
            return;
        }

        // Validación de contraseñas que coinciden
        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match.');
            highlightPasswordFields();
            return;
        }

        // Crear un objeto XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/signup', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status == 409) {
                alert('Email already registered. Please use another email or login.');
            } else if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Success:', xhr.responseText);
            } else if (xhr.status == 400){
                alert('All fields are required.');
            } 
            else {
                console.error('Error Status:', xhr.status);
            }
        };

        // Enviar la solicitud
        // console.log("name: " + name + "  surname: " + surname + "  email: " + email + "  password: " + password);
        const data = JSON.stringify({ name, surname, email, password });
        console.log("data:", data);
        xhr.send(data);
  });
});


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
