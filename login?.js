
document.addEventListener("DOMContentLoaded", checkLoginStatus);
const BASE_URL = "https://opravdova-webovka.onrender.com"; // ✅ Store backend URL

async function checkLoginStatus() {
  try {
    const response = await fetch(`${BASE_URL}/isLoggedIn`, {
      credentials: "include", // ✅ Sends cookies (JWT)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // ✅ Show/Hide elements based on login status
    if (data.loggedIn) {
      document.getElementById("login-icon").style.display = "block"; // ✅ Show icon
      document.querySelector(".nav_button").style.display = "none"; // ❌ Hide login button
    } else {
      document.getElementById("login-icon").style.display = "none"; // ❌ Hide icon
      document.querySelector(".nav_button").style.display = "inline-block"; // ✅ Show login button
    }
  } catch (error) {
    console.error("❌ Error checking login status:", error);
  }
}

// ✅ Run this function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);
