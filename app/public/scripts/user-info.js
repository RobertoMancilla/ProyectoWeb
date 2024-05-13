document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.getElementById('editButton');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    const passwordFields = document.getElementById('passwordFields');
    const deleteProfileBtn = document.getElementById('deleteProfile');
    const logoutButton = document.getElementById('logoutButton');
    
    const inputs = document.querySelectorAll('#showInfoForm input');
  
    // Función para habilitar la edición y mostrar los campos de contraseña
    function enableEdit() {
      inputs.forEach(input => input.removeAttribute('disabled'));
      passwordFields.style.display = 'block';  // Mostrar campos de contraseña
      editButton.style.display = 'none';
      confirmButton.style.display = 'inline-block';
      cancelButton.style.display = 'inline-block';
      deleteProfileBtn.style.display = 'inline-block';  // Mostrar el botón de eliminar
    }
  
    // Función para cancelar la edición y ocultar los campos de contraseña
    function cancelEdit() {
      inputs.forEach(input => {
        input.setAttribute('disabled', true);
        input.value = input.defaultValue; 
      });
      passwordFields.style.display = 'none';  // Ocultar campos de contraseña
      editButton.style.display = 'inline-block';
      confirmButton.style.display = 'none';
      cancelButton.style.display = 'none';
      deleteProfileBtn.style.display = 'none';  // Ocultar el botón de eliminar
    }
  
    editButton.addEventListener('click', enableEdit);
    cancelButton.addEventListener('click', cancelEdit);
  
    confirmButton.addEventListener('click', function() {
        const oldPassword = document.getElementById('password_show').value;
        const newPassword = document.getElementById('new_password_show').value;
        const confirmNewPassword = document.getElementById('confirm_new_password_show').value;
        const email = document.getElementById('email_show').value;
  
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          alert('Please enter a valid email address.');
          return;
        }

        // Comprobar que la nueva contraseña y la confirmación son iguales
        if (newPassword !== confirmNewPassword) {
          alert('New password and confirm new password do not match.');
          return;
        }

        if (!oldPassword && (newPassword || confirmNewPassword)) {
          alert('Please provide the old password to set a new password.');
          return;
        }
  
        const updateData = {
          name: document.getElementById('name_show').value,
          surname: document.getElementById('surname_show').value,
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        };
  
        fetch('/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          },
          body: JSON.stringify(updateData)
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert('Error: ' + data.error);
          } else {
            alert('Profile updated successfully');
            console.log("data update",updateData);
            cancelEdit(); 

            // Actualizar los valores en los inputs del modal
            document.getElementById('name_show').value = updateData.name;
            document.getElementById('surname_show').value = updateData.surname;
            document.getElementById('email_show').value = updateData.email;

            // Limpia los campos de contraseña ya que no deben mantenerse visibles ni accesibles
            document.getElementById('password_show').value = '';
            document.getElementById('new_password_show').value = '';
            document.getElementById('confirm_new_password_show').value = '';

          }
        })
        .catch(error => {
          console.error('Failed to update profile:', error);
          alert('Failed to update profile.');
        });
    });

    deleteProfileBtn.addEventListener('click', function(){
      if (confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
        fetch('/user/delete', {  // Asegúrate de que la URL y el método HTTP sean correctos según tu API
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert('Error deleting profile: ' + data.error);
          } else {
            alert('Profile deleted successfully.');
            window.location.href = '/home'; // Redirecciona al usuario después de eliminar el perfil
          }
        })
        .catch(error => {
          console.error('Failed to delete profile:', error);
          alert('Failed to delete profile.');
        });
      }
    });

    logoutButton.addEventListener('click', function() {
      localStorage.removeItem('jwt'); 
      window.location.href = '/home';
    });
});
  