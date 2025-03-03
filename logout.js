document.addEventListener("DOMContentLoaded", function () {
    const userLogo = document.getElementById("user-logo");
    const authButtons = document.getElementById("auth-buttons");
    const logoutButton = document.getElementById("logout-button");

    // Check if user is logged in from the server
    fetch("http://localhost:3000/isLoggedIn", {
        method: "GET",
        credentials: "include", // Necessary to send authentication cookies
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            userLogo.style.display = "block";  // Show the logo
            authButtons.style.display = "none"; // Hide login/register buttons
            logoutButton.style.display = "inline-block"; // Show logout button
        }
    })
    .catch(error => console.error("Error checking login state:", error));

    // Logout function
    logoutButton.addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (data.success) {
                window.location.reload(); // Refresh to update UI
            } else {
                alert("❌ Logout failed!");
            }
        } catch (error) {
            alert("❌ An error occurred while logging out!");
        }
    });
});