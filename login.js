document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    
    if (username === "admin" && password === "1234") {
        alert("Přihlášení úspěšné!");
        window.location.href = "dashboard.html"; 
    } else {
        errorMessage.textContent = "Špatné uživatelské jméno nebo heslo!";
    }
});
