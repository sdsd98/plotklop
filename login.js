
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Error: loginForm element not found!");
        return;
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("errorMessage");

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let validUser = users.find(user => user.username === username && user.password === password);

        if (validUser) {
            alert("Přihlášení úspěšné!");
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));

            console.log("Redirecting to index.html...");

            window.location.replace("index.html");
        } else {
            errorMessage.textContent = "Špatné uživatelské jméno nebo heslo!";
            errorMessage.style.color = "red";
        }
    });

    // Ensure default users exist
    if (!localStorage.getItem("users")) {
        let defaultUsers = [
            { username: "admin", email: "admin@example.com", password: "1234" }
        ];
        localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
});
