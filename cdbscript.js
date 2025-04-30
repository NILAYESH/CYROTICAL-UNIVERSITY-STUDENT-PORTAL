document.getElementById('loginForm').onsubmit = function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Example login validation (you can expand this part)
    if (username === "student" && password === "password") {
        alert('Login Successful!');
        // Redirect to the dashboard or perform further actions here
    } else {
        alert('Invalid username or password.');
    }
};