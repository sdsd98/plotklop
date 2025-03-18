document.addEventListener("DOMContentLoaded", async function () {
    const BASE_URL = "https://opravdova-webovka.onrender.com"; // ✅ Your backend URL

    const loginIcon = document.getElementById("login-icon");
    const authButtons = document.querySelectorAll(".nav_button"); // Select both login & register buttons
    const logoutButton = document.getElementById("logout-button");

    if (!loginIcon || authButtons.length === 0 || !logoutButton) {
        console.error("⚠️ UI elements missing: Check IDs and classes.");
        return;
    }

    try {
        console.log("🔍 Checking login status...");

        // ✅ Opravená cesta: `/isLoggedIn` místo `/check-auth`
        const response = await fetch(`${BASE_URL}/isLoggedIn`, {
            method: "GET",
            credentials: "include", // ✅ Sends cookies (JWT authentication)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🔍 Server response:", data);

        if (data.loggedIn) {
            loginIcon.style.display = "block";  // ✅ Show login icon
            authButtons.forEach(button => button.style.display = "none"); // ❌ Hide login/register buttons
            logoutButton.style.display = "inline-block"; // ✅ Show logout button
        } else {
            loginIcon.style.display = "none";  // ❌ Hide login icon
            authButtons.forEach(button => button.style.display = "inline-block"); // ✅ Show login/register buttons
            logoutButton.style.display = "none"; // ❌ Hide logout button
        }
    } catch (error) {
        console.error("❌ Error checking login status:", error);
    }
});
logoutButton.addEventListener("click", async () => {
    await fetch(`${BASE_URL}/logout`, { method: "POST", credentials: "include" });
    window.location.reload(); 
});
