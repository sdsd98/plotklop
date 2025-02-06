document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    // Get stored users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user with the same username and password
    let validUser = users.find(user => user.username === username && user.password === password);

    if (validUser) {
        alert("Přihlášení úspěšné!");

        // Store the logged-in user in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));

        // Redirect to homepage (index.html)
        window.location.href = "index.html";
    } else {
        errorMessage.textContent = "Špatné uživatelské jméno nebo heslo!";
        errorMessage.style.color = "red";
    }
});
