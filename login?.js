const BASE_URL = "https://opravdova-webovka.onrender.com"; // ✅ Store your backend URL

async function checkLoginStatus() {
  try {
    const response = await fetch(`${BASE_URL}/isLoggedIn`, {
      credentials: "include", // ✅ Important for sending cookies (JWT)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.loggedIn) {
      document.getElementById("login-icon").classList.add("logged-in"); // ✅ Show icon
    } else {
      document.getElementById("login-icon").classList.remove("logged-in"); // ❌ Hide icon
    }
  } catch (error) {
    console.error("❌ Error checking login status:", error);
  }
}

// ✅ Run this function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);
