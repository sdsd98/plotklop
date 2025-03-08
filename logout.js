document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");

    // 🔹 Check if the user is logged in
    fetch("/isLoggedIn", {
        method: "GET",
        credentials: "include" // Ensures cookies are sent with request
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            logoutButton.style.display = "block"; // Show button if logged in
        } else {
            logoutButton.style.display = "none"; // Hide button if not logged in
        }
    })
    .catch(error => {
        console.error("❌ Error checking login status:", error);
        logoutButton.style.display = "none"; // Hide button on error
    });

    // 🔹 Logout function (clears cookie & redirects)
    logoutButton.addEventListener("click", () => {
        fetch("/logout", {
            method: "POST",
            credentials: "include" // Include cookies
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show logout success message
            window.location.href = "/login.html"; // Redirect to login page
        })
        .catch(error => console.error("❌ Logout failed:", error));
    });
});
