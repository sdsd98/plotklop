
document.addEventListener("DOMContentLoaded", function () {
    const userLogo = document.getElementById("user-logo");
    const authButtons = document.getElementById("auth-buttons");
    const logoutButton = document.getElementById("logout-button");

    const BASE_URL = "https://opravdova-webovka.onrender.com"; // ✅ Use your Render backend URL

    if (!userLogo || !authButtons || !logoutButton) {
        console.error("⚠️ One or more elements are missing in the DOM.");
        return;
    }

    // ✅ Check if user is logged in
    fetch(`${BASE_URL}/isLoggedIn`, {
        method: "GET",
        credentials: "include", // ✅ Necessary to send authentication cookies
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            userLogo.style.display = "block";  // ✅ Show user icon
            authButtons.style.display = "none"; // ❌ Hide login/register buttons
            logoutButton.style.display = "inline-block"; // ✅ Show logout button
        } else {
            userLogo.style.display = "none";  // ❌ Hide user icon
            authButtons.style.display = "flex"; // ✅ Show login/register buttons
            logoutButton.style.display = "none"; // ❌ Hide logout button
        }
    })
    .catch(error => console.error("❌ Error checking login state:", error));

    // ✅ Logout function
    logoutButton.addEventListener("click", async function () {
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                credentials: "include",
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

