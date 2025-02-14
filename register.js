document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = sanitizeInput(document.getElementById("username").value.trim());
    const email = sanitizeInput(document.getElementById("email").value.trim());
    const password = document.getElementById("password").value.trim();
    const registerMessage = document.getElementById("registerMessage");

    // Reset message
    registerMessage.textContent = "";
    registerMessage.style.color = "black";

    // Validate inputs
    if (!username || !email || !password) {
        registerMessage.textContent = "Všechna pole jsou povinná!";
        registerMessage.style.color = "red";
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        registerMessage.textContent = "Neplatný formát e-mailu!";
        registerMessage.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the username or email already exists
    if (users.some(user => user.username === username || user.email === email)) {
        registerMessage.textContent = "Uživatelské jméno nebo e-mail už existuje!";
        registerMessage.style.color = "red";
        return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Store user securely
    users.push({ username, email, password: hashedPassword });
    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.textContent = "Registrace úspěšná! Přesměrování na přihlášení...";
    registerMessage.style.color = "green";

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});

// Function to hash password (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Function to sanitize user input
function sanitizeInput(input) {
    const temp = document.createElement("div");
    temp.textContent = input;
    return temp.innerHTML;
}

// Function to validate email format
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
