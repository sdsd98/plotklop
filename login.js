document.addEventListener("DOMContentLoaded", function () {
    console.log("🔐 Secure Login Script Loaded");

    // Ensure default admin user exists (hashed password)
    if (!localStorage.getItem("users")) {
        createDefaultUser();
    }

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

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let validUser = users.find(user => user.username === username);

        if (!validUser) {
            showError("Špatné uživatelské jméno nebo heslo!", errorMessage);
            return;
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        if (hashedPassword === validUser.password) {
            alert("✅ Přihlášení úspěšné!");
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));

            console.log("➡ Redirecting to index.html...");
            window.location.href = "index.html"; // Ensure this file exists
        } else {
            showError("❌ Špatné uživatelské jméno nebo heslo!", errorMessage);
        }
    });
});

// 🛡️ Function to hash password (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// 🔍 Function to sanitize user input (prevents code injection)
function sanitizeInput(input) {
    const temp = document.createElement("div");
    temp.textContent = input;
    return temp.innerHTML;
}

// 🚨 Function to show error messages
function showError(message, element) {
    element.textContent = message;
    element.style.color = "red";
}

// 🔑 Function to create a default secure admin user
async function createDefaultUser() {
    const defaultUsers = [
        {
            username: "admin",
            email: "admin@example.com",
            password: await hashPassword("1234"), // Hash the default password
        }
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers));
}
