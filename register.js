document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");

    if (!registerForm) {
        console.error("⚠️ Registration form not found!");
        return;
    }

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        registerMessage.textContent = "";

        if (!username || !email || !password) {
            registerMessage.textContent = "⚠️ All fields are required!";
            registerMessage.style.color = "red";
            return;
        }

        try {
            // ✅ Use the correct Render backend URL
            const BASE_URL = "https://opravdova-webovka.onrender.com";

            // ✅ Disable the submit button to prevent multiple submissions
            const submitButton = registerForm.querySelector("button");
            submitButton.disabled = true;
            registerMessage.textContent = "⏳ Registering...";
            registerMessage.style.color = "blue";

            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Registration successful!");
                registerMessage.textContent = "✅ Registration successful!";
                registerMessage.style.color = "green";

                setTimeout(() => {
                    window.location.href = "index.html"; // ✅ Redirect to homepage after 2 seconds
                }, 2000);
            } else {
                registerMessage.textContent = `❌ ${data.error}`;
                registerMessage.style.color = "red";
            }
        } catch (error) {
            registerMessage.textContent = "❌ An error occurred while registering!";
            registerMessage.style.color = "red";
        } finally {
            // ✅ Re-enable the submit button
            registerForm.querySelector("button").disabled = false;
        }
    });
});
