document.addEventListener("DOMContentLoaded", async function () {
    const BASE_URL = "https://opravdova-webovka.onrender.com"; // ✅ Your backend URL

    const loginIcon = document.getElementById("login-icon");
    const authButtons = document.querySelectorAll(".nav_button"); // Select both login & register buttons

    if (!loginIcon || authButtons.length === 0) {
        console.error("⚠️ UI elements missing: Make sure the IDs and classes are correct.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/isLoggedIn`, {
            method: "GET",
            credentials: "include", // ✅ Important for JWT authentication
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.loggedIn) {
            loginIcon.style.display = "block";  // ✅ Show login icon
            authButtons.forEach(button => button.style.display = "none"); // ❌ Hide login/register buttons
        } else {
            loginIcon.style.display = "none";  // ❌ Hide login icon
            authButtons.forEach(button => button.style.display = "inline-block"); // ✅ Show login/register buttons
        }
    } catch (error) {
        console.error("❌ Error checking login status:", error);
    }
});
