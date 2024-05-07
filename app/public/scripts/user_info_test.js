document.addEventListener("DOMContentLoaded", function() {
    const userInfo = document.getElementById('userInfo');

    function displayUserInfo() {
        const token = localStorage.getItem('jwt');
        if (token) {
            const decoded = jwt_decode(token); // Nota el cambio aquí a jwt_decode
            userInfo.innerText = `User ID: ${decoded.id}`;
        }
    }
    displayUserInfo();
});
