// login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the user is registered
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // If the user is registered and the credentials match
    if (username === storedUsername && password === storedPassword) {
        // Redirect to the main page after successful login
        localStorage.setItem('loggedIn', true);
        window.location.href = 'index.html';
    } else {
        alert("Invalid credentials. Please try again.");
    }
});
