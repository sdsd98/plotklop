document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("errorMessage");

    if (!loginForm) {
        console.error("⚠️ Login form not found!");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        errorMessage.textContent = "";
        
        // ✅ Validate input fields
        if (!username || !password) {
            errorMessage.textContent = "⚠️ Username and password are required!";
            errorMessage.style.color = "red";
            return;
        }

        try {
            // ✅ Use Render backend URL instead of localhost
            const BASE_URL = "https://opravdova-webovka.onrender.com";

            // ✅ Disable submit button to prevent multiple submissions
            loginForm.querySelector("button").disabled = true;
            errorMessage.textContent = "⏳ Logging in...";
            errorMessage.style.color = "blue";

            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                credentials: "include", // ✅ Important for session/cookie authentication
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Login successful!");  
                window.location.href = "index.html";  // ✅ Redirect to homepage
            } else {
                errorMessage.textContent = `❌ ${data.error}`;
                errorMessage.style.color = "red";
            }
        } catch (error) {
            errorMessage.textContent = "❌ An error occurred while logging in!";
            errorMessage.style.color = "red";
        } finally {
            // ✅ Re-enable the submit button
            loginForm.querySelector("button").disabled = false;
        }
    });
});
