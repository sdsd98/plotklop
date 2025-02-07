document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const username = sanitizeInput(document.getElementById("username").value.trim());
    const email = sanitizeInput(document.getElementById("email").value.trim());
    const password = document.getElementById("password").value.trim();
    const registerMessage = document.getElementById("registerMessage");

    
    if (!username || !email || !password) {
        registerMessage.textContent = "Všechna pole jsou povinná!";
        registerMessage.style.color = "red";
        return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
        registerMessage.textContent = "Heslo musí mít min. 8 znaků, velké písmeno, číslo a speciální znak!";
        registerMessage.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the username or email is already taken
    if (users.some(user => user.username === username || user.email === email)) {
        registerMessage.textContent = "Uživatelské jméno nebo e-mail už existuje!";
        registerMessage.style.color = "red";
        return;
    }

    //  Hash the password before storing it
    const hashedPassword = await hashPassword(password);

    // Store user securely
    users.push({ username, email, password: hashedPassword });
    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.textContent = "Registrace úspěšná! Můžete se přihlásit.";
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
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Function to sanitize user input (prevents code injection)
function sanitizeInput(input) {
    const temp = document.createElement("div");
    temp.textContent = input;
    return temp.innerHTML;
}

//  Function to validate password strength
function validatePassword(password) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
}
