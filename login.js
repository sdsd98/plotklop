document.addEventListener("DOMContentLoaded", function () {
    console.log("🔐 Secure Login Script Loaded");

    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        console.error("❌ Error: login-form element not found!");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("📩 Login form submitted!");

        const username = sanitizeInput(document.getElementById("username").value.trim());
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("errorMessage");

        console.log("🔍 Entered Username:", username);
        console.log("🔍 Entered Password:", password);

        let users = JSON.parse(localStorage.getItem("users")) || [];
        console.log("🗂️ Stored Users:", users);

        let validUser = users.find(user => user.username === username);

        if (!validUser) {
            console.log("❌ User not found!");
            showError("Špatné uživatelské jméno nebo heslo!", errorMessage);
            return;
        }

        // Hash the entered password
        const hashedPassword = await hashPassword(password);
        console.log("🔑 Hashed Entered Password:", hashedPassword);
        console.log("🔑 Stored Hashed Password:", validUser.password);

        if (hashedPassword === validUser.password) {
            alert("✅ Přihlášení úspěšné!");
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));

            console.log("➡ Redirecting to index.html...");
            window.location.href = "index.html"; // Ensure this file exists
        } else {
            console.log("❌ Password mismatch!");
            showError("❌ Špatné uživatelské jméno nebo heslo!", errorMessage);
        }
    });
});
