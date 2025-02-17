document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";

    if (!username || !password) {
        errorMessage.textContent = "⚠️ Username and password are required!";
        errorMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Login successful!");  // Popup on successful login
            window.location.href = "index.html";  // Redirect to index.html
        } else {
            errorMessage.textContent = `❌ ${data.error}`;
            errorMessage.style.color = "red";
        }
    } catch (error) {
        errorMessage.textContent = "❌ An error occurred!";
        errorMessage.style.color = "red";
    }
});
