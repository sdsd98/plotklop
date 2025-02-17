// register.js

const fs = require('fs');

document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = sanitizeInput(document.getElementById("username").value.trim());
    const email = sanitizeInput(document.getElementById("email").value.trim());
    const password = document.getElementById("password").value.trim();
    const registerMessage = document.getElementById("registerMessage");

    registerMessage.textContent = "";

    if (!username || !email || !password) {
        registerMessage.textContent = "All fields are required!";
        registerMessage.style.color = "red";
        return;
    }

    if (!validateEmail(email)) {
        registerMessage.textContent = "Invalid email format!";
        registerMessage.style.color = "red";
        return;
    }

    const hashedPassword = await hashPassword(password);
    const userData = `${username}, ${email}, ${hashedPassword}\n`;

    fs.appendFile('user_data.txt', userData, (err) => {
        if (err) {
            registerMessage.textContent = "Error saving data!";
            registerMessage.style.color = "red";
        } else {
            registerMessage.textContent = "Registration successful! Data saved.";
            registerMessage.style.color = "green";
        }
    });
});

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function sanitizeInput(input) {
    const temp = document.createElement("div");
    temp.textContent = input;
    return temp.innerHTML;
}

function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
