document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const registerMessage = document.getElementById("registerMessage");

    // Validate inputs
    if (!username || !email || !password) {
        registerMessage.textContent = "Všechna pole jsou povinná!";
        registerMessage.style.color = "red";
        return;
    }

    // Get existing users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if username or email already exists
    let userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        registerMessage.textContent = "Uživatelské jméno nebo e-mail už existuje!";
        registerMessage.style.color = "red";
        return;
    }

    // Save new user (
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.textContent = "Registrace úspěšná! Můžete se přihlásit.";
    registerMessage.style.color = "green";

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});
