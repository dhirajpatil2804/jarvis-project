// register.js
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Store the credentials in localStorage
    localStorage.setItem('username', newUsername);
    localStorage.setItem('password', newPassword);

    // Redirect to login page after successful registration
    window.location.href = 'login.html';
});
