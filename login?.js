document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (!loginForm) {
        console.error("⚠️ Login form not found!");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        loginMessage.textContent = "";

        if (!email || !password) {
            loginMessage.textContent = "⚠️ Both fields are required!";
            loginMessage.style.color = "red";
            return;
        }

        try {
            // ✅ Use the correct Render backend URL
            const BASE_URL = "https://opravdova-webovka.onrender.com";

            // ✅ Disable the submit button to prevent multiple submissions
            const submitButton = loginForm.querySelector("button");
            submitButton.disabled = true;
            loginMessage.textContent = "⏳ Logging in...";
            loginMessage.style.color = "blue";

            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("Response from server:", data); // Log the response data to the console

            if (response.ok) {
                alert("✅ Login successful!");
                loginMessage.textContent = "✅ Login successful!";
                loginMessage.style.color = "green";

                // Redirect to homepage after successful login
                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 2000);
            } else {
                loginMessage.textContent = `❌ ${data.error}`;
                loginMessage.style.color = "red";
            }
        } catch (error) {
            console.error("❌ Error during login:", error); // Log error to the console for debugging
            loginMessage.textContent = "❌ An error occurred while logging in!";
            loginMessage.style.color = "red";
        } finally {
            // ✅ Re-enable the submit button
            loginForm.querySelector("button").disabled = false;
        }
    });

    // Check if the user is already logged in
    const userLogo = document.getElementById("user-logo");
    const authButtons = document.getElementById("auth-buttons");
    const logoutButton = document.getElementById("logout-button");

    if (!userLogo || !authButtons || !logoutButton) {
        console.error("⚠️ One or more elements are missing in the DOM.");
        return;
    }

    // Check login status on page load
    fetch(`${BASE_URL}/isLoggedIn`, {
        method: "GET",
        credentials: "include", // ✅ Necessary to send authentication cookies
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            userLogo.style.display = "block"; // ✅ Show user logo
            authButtons.style.display = "none"; // ❌ Hide login/register buttons
            logoutButton.style.display = "inline-block"; // ✅ Show logout button
        } else {
            userLogo.style.display = "none"; // ❌ Hide user logo
            authButtons.style.display = "flex"; // ✅ Show login/register buttons
            logoutButton.style.display = "none"; // ❌ Hide logout button
        }
    })
    .catch(error => console.error("❌ Error checking login state:", error));

    // Logout functionality
    logoutButton.addEventListener("click", async function () {
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                credentials: "include", // Necessary for sending cookies with the request
            });

            const data = await response.json();

            if (data.success) {
                window.location.reload(); // ✅ Refresh UI after logout
            } else {
                alert("❌ Logout failed!");
            }
        } catch (error) {
            alert("❌ An error occurred while logging out!");
        }
    });
});
