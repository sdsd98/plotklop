document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const registerMessage = document.getElementById("registerMessage");

    registerMessage.textContent = "";

    if (!username || !email || !password) {
        registerMessage.textContent = "⚠️ All fields are required!";
        registerMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Registration successful!");  // Popup after successful registration
            registerMessage.textContent = "✅ Registration successful!";
            registerMessage.style.color = "green";

            setTimeout(() => {
                window.location.href = "index.html";  // Redirect to index.html after 2 seconds
            }, 2000);
        } else {
            registerMessage.textContent = `❌ ${data.error}`;
            registerMessage.style.color = "red";
        }
    } catch (error) {
        registerMessage.textContent = "❌ An error occurred!";
        registerMessage.style.color = "red";
    }
});
