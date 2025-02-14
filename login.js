document.addEventListener("DOMContentLoaded", () => {
    console.log("🔐 Secure Login Script Loaded");

    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        console.error("❌ Error: login-form element not found!");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("📩 Login form submitted!");

        const username = sanitizeInput(document.getElementById("username").value.trim());
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("errorMessage");

        if (!username || !password) {
            showError("⚠️ Uživatelské jméno a heslo jsou povinné!", errorMessage);
            return;
        }

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const validUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());

        if (!validUser) {
            showError("❌ Špatné uživatelské jméno nebo heslo!", errorMessage);
            return;
        }

        // Hash the entered password
        const hashedPassword = await hashPassword(password);

        if (hashedPassword === validUser.password) {
            // Store login session
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));

            // Redirect after successful login
            window.location.href = "index.html"; 
        } else {
            showError("❌ Špatné uživatelské jméno nebo heslo!", errorMessage);
        }
    });
});

// Hash the password with SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Sanitize user input to prevent injection
function sanitizeInput(input) {
    const temp = document.createElement("div");
    temp.textContent = input;
    return temp.innerHTML;
}

// Show error messages with dynamic styling
function showError(message, element) {
    if (element) {
        element.textContent = message;
        element.style.color = "red";
        element.style.fontWeight = "bold";
    }
}
